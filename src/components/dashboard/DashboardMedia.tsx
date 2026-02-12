import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Upload, Trash2, Image as ImageIcon, Video } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

interface DashboardMediaProps {
  prestataireId: string;
}

export function DashboardMedia({ prestataireId }: DashboardMediaProps) {
  const [medias, setMedias] = useState<Tables<'medias'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedias = async () => {
    const { data } = await supabase
      .from('medias')
      .select('*')
      .eq('prestataire_id', prestataireId)
      .order('ordre', { ascending: true });
    setMedias(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMedias(); }, [prestataireId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const mediaType = isVideo ? 'video' : 'photo';

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${prestataireId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(path, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);

      const { error: insertError } = await supabase.from('medias').insert({
        prestataire_id: prestataireId,
        url: publicUrl,
        type: mediaType,
        ordre: medias.length,
      });
      if (insertError) throw insertError;

      toast.success('Média ajouté');
      fetchMedias();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (media: Tables<'medias'>) => {
    // Extract path from URL
    const urlParts = media.url.split('/media/');
    const filePath = urlParts[urlParts.length - 1];

    await supabase.storage.from('media').remove([filePath]);
    const { error } = await supabase.from('medias').delete().eq('id', media.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Média supprimé');
    fetchMedias();
  };

  const photos = medias.filter(m => m.type === 'photo');
  const videos = medias.filter(m => m.type === 'video');

  return (
    <Card className="card-premium">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Galerie média</CardTitle>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleUpload}
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn-gold">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : medias.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucun média. Ajoutez vos photos et vidéos.</p>
        ) : (
          <div className="space-y-6">
            {photos.length > 0 && (
              <div>
                <h3 className="text-lg font-serif mb-3 flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Photos ({photos.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {photos.map(m => (
                    <div key={m.id} className="relative group rounded-xl overflow-hidden aspect-square">
                      <img src={m.url} alt={m.titre ?? ''} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDelete(m)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {videos.length > 0 && (
              <div>
                <h3 className="text-lg font-serif mb-3 flex items-center gap-2"><Video className="h-5 w-5" /> Vidéos ({videos.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {videos.map(m => (
                    <div key={m.id} className="relative group rounded-xl overflow-hidden">
                      <video src={m.url} controls className="w-full rounded-xl" />
                      <button
                        onClick={() => handleDelete(m)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

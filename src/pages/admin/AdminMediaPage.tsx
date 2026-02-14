import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Upload, Trash2, Copy, Image, Film } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logAdminAction } from "@/hooks/use-admin-log";

type MediaItem = {
  id: string;
  url: string;
  type: string;
  titre: string | null;
  prestataire_id: string;
  created_at: string;
};

export default function AdminMediaPage() {
  const [medias, setMedias] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchMedias = async () => {
    setLoading(true);
    const { data } = await supabase.from("medias").select("*").order("created_at", { ascending: false }).limit(100);
    setMedias(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMedias(); }, []);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `admin/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) {
      toast({ title: "Erreur upload", description: error.message, variant: "destructive" });
    } else {
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      await logAdminAction("upload_media", "storage", path);
      toast({ title: "Fichier uploadé" });
      // Copy URL
      navigator.clipboard.writeText(urlData.publicUrl);
      toast({ title: "URL copiée", description: urlData.publicUrl });
    }
    setUploading(false);
    e.target.value = "";
    fetchMedias();
  };

  const deleteMedia = async (id: string, url: string) => {
    const { error } = await supabase.from("medias").delete().eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else {
      await logAdminAction("delete_media", "medias", id);
      toast({ title: "Média supprimé" });
      fetchMedias();
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copiée" });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-champagne" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-champagne">Médias</h1>
        <div className="relative">
          <Input type="file" accept="image/*,video/*" onChange={uploadFile} className="hidden" id="media-upload" />
          <Button asChild className="bg-champagne text-chocolate hover:bg-champagne/90">
            <label htmlFor="media-upload" className="cursor-pointer flex items-center gap-2">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Uploader
            </label>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {medias.map((m) => (
          <Card key={m.id} className="bg-[#1a1a2e] border-champagne/10 overflow-hidden group">
            <div className="aspect-square relative bg-black/30">
              {m.type === "photo" ? (
                <img src={m.url} alt={m.titre || ""} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film size={40} className="text-champagne/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-ivory hover:text-champagne" onClick={() => copyUrl(m.url)}>
                  <Copy size={14} />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-ivory hover:text-red-400"><Trash2 size={14} /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer ce média ?</AlertDialogTitle>
                      <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMedia(m.id, m.url)} className="bg-red-600">Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <div className="p-2">
              <p className="text-xs text-ivory/50 truncate">{m.titre || m.type}</p>
            </div>
          </Card>
        ))}
        {medias.length === 0 && (
          <div className="col-span-full text-center py-12 text-ivory/40">
            <Image size={48} className="mx-auto mb-2 opacity-30" />
            <p>Aucun média</p>
          </div>
        )}
      </div>
    </div>
  );
}

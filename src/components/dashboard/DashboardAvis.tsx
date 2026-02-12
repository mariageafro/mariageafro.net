import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Star, MessageSquare } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

interface DashboardAvisProps {
  prestataireId: string;
}

export function DashboardAvis({ prestataireId }: DashboardAvisProps) {
  const [avis, setAvis] = useState<Tables<'avis'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('avis')
      .select('*')
      .eq('prestataire_id', prestataireId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setAvis(data ?? []);
        setLoading(false);
      });
  }, [prestataireId]);

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const approved = avis.filter(a => a.approved);
  const pending = avis.filter(a => !a.approved);

  return (
    <Card className="card-premium">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Avis clients ({approved.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {avis.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucun avis pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {pending.length > 0 && (
              <p className="text-sm text-muted-foreground">{pending.length} avis en attente de modération</p>
            )}
            {approved.map(a => (
              <div key={a.id} className="bg-secondary/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < a.note ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {new Date(a.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {a.commentaire && <p className="text-sm">{a.commentaire}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

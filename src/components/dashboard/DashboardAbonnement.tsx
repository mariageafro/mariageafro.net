import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, Crown } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

interface DashboardAbonnementProps {
  prestataireId: string;
}

const planDetails: Record<string, { label: string; photos: string; videos: string; features: string[] }> = {
  gratuit: { label: 'Gratuit', photos: '1 photo', videos: '0 vidéo', features: ['Profil de base'] },
  pro: { label: 'Pro', photos: '10 photos', videos: '2 vidéos', features: ['Badge vérifié', 'Profil enrichi'] },
  premium: { label: 'Premium', photos: '30 photos', videos: '5 vidéos', features: ['Badge vérifié', 'Mise en avant', 'Profil enrichi'] },
  elite: { label: 'Elite', photos: 'Illimité', videos: 'Illimité', features: ['Badge vérifié', 'Placement prioritaire', 'Support dédié', 'Tout inclus'] },
};

export function DashboardAbonnement({ prestataireId }: DashboardAbonnementProps) {
  const [abonnement, setAbonnement] = useState<Tables<'abonnements'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('abonnements')
      .select('*')
      .eq('prestataire_id', prestataireId)
      .eq('actif', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setAbonnement(data);
        setLoading(false);
      });
  }, [prestataireId]);

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const currentPlan = abonnement?.type ?? 'gratuit';
  const plan = planDetails[currentPlan];

  return (
    <div className="space-y-6">
      <Card className="card-premium max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Votre abonnement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-gold text-primary-foreground text-base px-4 py-1">{plan.label}</Badge>
            {abonnement?.actif && <span className="text-sm text-muted-foreground">Actif</span>}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-secondary/50 rounded-xl p-4">
              <p className="text-sm text-muted-foreground">Photos</p>
              <p className="text-lg font-serif font-semibold">{plan.photos}</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <p className="text-sm text-muted-foreground">Vidéos</p>
              <p className="text-lg font-serif font-semibold">{plan.videos}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Fonctionnalités incluses</p>
            <ul className="space-y-2">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {currentPlan !== 'elite' && (
        <Card className="card-premium max-w-2xl border-primary/20">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">
              Vous souhaitez débloquer plus de fonctionnalités ? Contactez-nous pour surclasser votre abonnement.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

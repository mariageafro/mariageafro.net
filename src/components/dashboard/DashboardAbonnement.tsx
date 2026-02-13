import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, Crown, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

interface DashboardAbonnementProps {
  prestataireId: string;
}

const PLANS = {
  gratuit: { label: 'Gratuit', price: '0€', photos: '1 photo', videos: '0 vidéo', features: ['Profil de base'] },
  pro: {
    label: 'Pro', price: '29€/mois', photos: '10 photos', videos: '2 vidéos',
    features: ['Badge vérifié', 'Profil enrichi'],
    priceId: 'price_1T0O8gH4jjuEDnAhcZnt6zU9',
  },
  premium: {
    label: 'Premium', price: '59€/mois', photos: '30 photos', videos: '5 vidéos',
    features: ['Badge vérifié', 'Mise en avant', 'Profil enrichi'],
    priceId: 'price_1T0OA2H4jjuEDnAhjtLDxSmV',
  },
  elite: {
    label: 'Elite', price: '99€/mois', photos: 'Illimité', videos: 'Illimité',
    features: ['Badge vérifié', 'Placement prioritaire', 'Support dédié', 'Tout inclus'],
    priceId: 'price_1T0OAdH4jjuEDnAh14km9L07',
  },
} as const;

type PlanKey = keyof typeof PLANS;

export function DashboardAbonnement({ prestataireId }: DashboardAbonnementProps) {
  const [abonnement, setAbonnement] = useState<Tables<'abonnements'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const fetchAbonnement = () => {
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
  };

  const syncSubscription = async () => {
    try {
      const { error } = await supabase.functions.invoke('check-subscription');
      if (!error) fetchAbonnement();
    } catch {}
  };

  useEffect(() => {
    fetchAbonnement();
    syncSubscription();
  }, [prestataireId]);

  // Check for success/canceled in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      toast.success('Abonnement activé avec succès !');
      syncSubscription();
      window.history.replaceState({}, '', window.location.pathname);
    }
    if (params.get('canceled') === 'true') {
      toast.info('Paiement annulé.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleCheckout = async (priceId: string, planKey: string) => {
    setCheckoutLoading(planKey);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création du paiement');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'ouverture du portail');
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const currentPlan: PlanKey = (abonnement?.type as PlanKey) ?? 'gratuit';
  const plan = PLANS[currentPlan];
  const planOrder: PlanKey[] = ['gratuit', 'pro', 'premium', 'elite'];
  const currentIndex = planOrder.indexOf(currentPlan);

  return (
    <div className="space-y-8">
      {/* Current plan */}
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
            {abonnement?.actif && currentPlan !== 'gratuit' && <span className="text-sm text-muted-foreground">Actif</span>}
            {abonnement?.date_fin && (
              <span className="text-xs text-muted-foreground">
                Jusqu'au {new Date(abonnement.date_fin).toLocaleDateString('fr-FR')}
              </span>
            )}
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
          <div className="flex gap-3 mt-4">
            {currentPlan !== 'gratuit' && (
              <Button variant="outline" size="sm" onClick={handlePortal} disabled={portalLoading}>
                {portalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                Gérer mon abonnement
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => { setLoading(true); syncSubscription().then(() => setLoading(false)); }}>
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade options */}
      {currentPlan !== 'elite' && (
        <div>
          <h3 className="text-lg font-serif font-semibold mb-4">Surclasser votre abonnement</h3>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {planOrder.filter((_, i) => i > currentIndex && i > 0).map(key => {
              const p = PLANS[key];
              const isPopular = key === 'premium';
              return (
                <Card key={key} className={`relative ${isPopular ? 'border-primary shadow-lg' : ''}`}>
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground text-xs">Populaire</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg font-serif">{p.label}</CardTitle>
                    <p className="text-2xl font-bold text-primary">{'price' in p ? p.price : ''}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>📷 {p.photos}</p>
                      <p>🎥 {p.videos}</p>
                    </div>
                    <ul className="space-y-1.5">
                      {p.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {'priceId' in p && p.priceId && (
                      <Button
                        className="w-full"
                        variant={isPopular ? 'gold' : 'default'}
                        onClick={() => handleCheckout(p.priceId, key)}
                        disabled={checkoutLoading === key}
                      >
                        {checkoutLoading === key ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Choisir ce plan'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

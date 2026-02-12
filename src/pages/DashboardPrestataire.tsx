import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/auth-context';
import { useUserRole } from '@/hooks/use-user-role';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardProfil } from '@/components/dashboard/DashboardProfil';
import { DashboardMedia } from '@/components/dashboard/DashboardMedia';
import { DashboardAbonnement } from '@/components/dashboard/DashboardAbonnement';
import { DashboardAvis } from '@/components/dashboard/DashboardAvis';
import { Loader2, LayoutDashboard, User, Image, CreditCard, Star } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

export default function DashboardPrestataire() {
  const { user, isLoading: authLoading } = useAuthContext();
  const { role, isLoading: roleLoading } = useUserRole(user?.id);
  const navigate = useNavigate();
  const [prestataire, setPrestataire] = useState<Tables<'prestataires'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    if (!authLoading && !roleLoading && role !== 'prestataire' && role !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, authLoading, role, roleLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchPrestataire = async () => {
      const { data } = await supabase
        .from('prestataires')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      setPrestataire(data);
      setLoading(false);
    };
    fetchPrestataire();
  }, [user]);

  if (authLoading || roleLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center pt-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!prestataire) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center pt-24">
          <div className="text-center space-y-4">
            <h2 className="text-2xl">Créez votre profil prestataire</h2>
            <p className="text-muted-foreground">Votre profil n'existe pas encore. Complétez les informations ci-dessous.</p>
            <DashboardProfil prestataire={null} userId={user!.id} onUpdate={(p) => setPrestataire(p)} />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container-editorial">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-4xl">Tableau de bord</h1>
            <p className="text-muted-foreground mt-2">{prestataire.nom_entreprise}</p>
          </div>

          <Tabs defaultValue="stats" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 max-w-2xl">
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="profil" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span className="hidden sm:inline">Médias</span>
              </TabsTrigger>
              <TabsTrigger value="abonnement" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Abo</span>
              </TabsTrigger>
              <TabsTrigger value="avis" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Avis</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats">
              <DashboardStats prestataireId={prestataire.id} />
            </TabsContent>
            <TabsContent value="profil">
              <DashboardProfil prestataire={prestataire} userId={user!.id} onUpdate={(p) => setPrestataire(p)} />
            </TabsContent>
            <TabsContent value="media">
              <DashboardMedia prestataireId={prestataire.id} />
            </TabsContent>
            <TabsContent value="abonnement">
              <DashboardAbonnement prestataireId={prestataire.id} />
            </TabsContent>
            <TabsContent value="avis">
              <DashboardAvis prestataireId={prestataire.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

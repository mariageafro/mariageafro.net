import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/auth-context';
import { useFavorites } from '@/hooks/use-favorites';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FavoriteButton } from '@/components/prestataire/FavoriteButton';
import type { Tables } from '@/integrations/supabase/types';

import categoryVideaste from '@/assets/category-videaste.jpg';

type FavoriteVendor = Tables<'prestataires'> & {
  categories: { name: string; slug: string } | null;
};

export default function MesFavoris() {
  const { user, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const { favoriteIds } = useFavorites();
  const [vendors, setVendors] = useState<FavoriteVendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (favoriteIds.size === 0) {
      setVendors([]);
      setIsLoading(false);
      return;
    }

    const fetchVendors = async () => {
      setIsLoading(true);
      const ids = Array.from(favoriteIds);
      const { data } = await supabase
        .from('prestataires')
        .select('*, categories(name, slug)')
        .in('id', ids)
        .eq('statut', 'actif');

      setVendors(data ?? []);
      setIsLoading(false);
    };

    fetchVendors();
  }, [favoriteIds]);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-warm">
        <div className="container-editorial text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Heart size={28} className="text-red-500 fill-red-500" />
            </div>
            <h1 className="font-serif text-chocolate mb-2">Mes Favoris</h1>
            <p className="font-body text-muted-foreground">
              {favoriteIds.size > 0
                ? `${favoriteIds.size} prestataire${favoriteIds.size > 1 ? 's' : ''} sauvegardé${favoriteIds.size > 1 ? 's' : ''}`
                : 'Retrouvez ici les prestataires que vous avez sauvegardés'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-gradient-warm">
        <div className="container-editorial">
          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card-premium">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💛</div>
              <h3 className="font-serif text-chocolate mb-2">Aucun favori pour l'instant</h3>
              <p className="font-body text-muted-foreground mb-6">
                Parcourez nos prestataires et cliquez sur le cœur pour les sauvegarder.
              </p>
              <Button variant="gold" asChild>
                <Link to="/prestataires">Découvrir les prestataires</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {vendors.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link to={`/prestataires/${p.slug}`} className="group block card-premium">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={p.photo_url || categoryVideaste}
                        alt={p.nom_entreprise}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <FavoriteButton
                        prestataireId={p.id}
                        className="absolute top-3 right-3"
                      />
                      {p.categories && (
                        <div className="absolute bottom-3 left-3">
                          <span className="px-3 py-1 rounded-full bg-ivory/90 font-body text-xs font-medium text-chocolate">
                            {p.categories.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-lg text-chocolate mb-1 group-hover:text-champagne transition-colors">
                        {p.nom_entreprise}
                      </h3>
                      {p.ville && (
                        <div className="flex items-center gap-1.5 text-muted-foreground font-body text-sm">
                          <MapPin size={14} />
                          {p.ville}{p.pays ? `, ${p.pays}` : ''}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Prestataire = Tables<'prestataires'> & {
  categories: { name: string; slug: string } | null;
  avg_rating: number;
  review_count: number;
};

type Review = Tables<'avis'>;

type Media = Tables<'medias'>;

export function usePrestaireDetail() {
  const { id } = useParams<{ id: string }>();
  const [prestataire, setPrestataire] = useState<Prestataire | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [medias, setMedias] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch prestataire with category
        const { data: prestData, error: prestError } = await supabase
          .from('prestataires')
          .select(`
            *,
            categories(name, slug)
          `)
          .eq('slug', id)
          .eq('statut', 'actif')
          .maybeSingle();

        if (prestError) throw prestError;

        if (!prestData) {
          setError('Prestataire non trouvé');
          setIsLoading(false);
          return;
        }

        // Fetch ratings
        const { data: avisData, error: avisError } = await supabase
          .from('avis')
          .select('prestataire_id, note')
          .eq('prestataire_id', prestData.id)
          .eq('approved', true);

        if (avisError) throw avisError;

        let avgRating = 0;
        if (avisData && avisData.length > 0) {
          avgRating = avisData.reduce((sum, a) => sum + a.note, 0) / avisData.length;
        }

        // Fetch approved reviews with client info
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('avis')
          .select('*')
          .eq('prestataire_id', prestData.id)
          .eq('approved', true)
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;

        // Fetch medias
        const { data: mediasData, error: mediasError } = await supabase
          .from('medias')
          .select('*')
          .eq('prestataire_id', prestData.id)
          .order('ordre', { ascending: true });

        if (mediasError) throw mediasError;

        setPrestataire({
          ...prestData,
          avg_rating: avgRating,
          review_count: avisData?.length ?? 0,
        });
        setReviews(reviewsData ?? []);
        setMedias(mediasData ?? []);
      } catch (err) {
        console.error('Error fetching prestataire:', err);
        setError('Erreur lors du chargement du profil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return {
    prestataire,
    reviews,
    medias,
    isLoading,
    error,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/auth-context';

export function useFavorites() {
  const { user, isAuthenticated } = useAuthContext();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's favorites
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setFavoriteIds(new Set());
      return;
    }

    const fetchFavorites = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('user_favorites')
        .select('prestataire_id')
        .eq('user_id', user.id);

      if (data) {
        setFavoriteIds(new Set(data.map(f => f.prestataire_id)));
      }
      setIsLoading(false);
    };

    fetchFavorites();
  }, [isAuthenticated, user]);

  const isFavorite = useCallback((prestataireId: string) => {
    return favoriteIds.has(prestataireId);
  }, [favoriteIds]);

  const toggleFavorite = useCallback(async (prestataireId: string) => {
    if (!user) return false;

    const isFav = favoriteIds.has(prestataireId);

    // Optimistic update
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (isFav) next.delete(prestataireId);
      else next.add(prestataireId);
      return next;
    });

    if (isFav) {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('prestataire_id', prestataireId);

      if (error) {
        // Revert
        setFavoriteIds(prev => { const next = new Set(prev); next.add(prestataireId); return next; });
        return false;
      }
    } else {
      const { error } = await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, prestataire_id: prestataireId });

      if (error) {
        // Revert
        setFavoriteIds(prev => { const next = new Set(prev); next.delete(prestataireId); return next; });
        return false;
      }
    }

    return true;
  }, [user, favoriteIds]);

  return { favoriteIds, isFavorite, toggleFavorite, isLoading, count: favoriteIds.size };
}

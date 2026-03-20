import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ExplorerFilters } from '@/pages/Explorer';

type ExplorerPrestataire = {
  id: string;
  nom_entreprise: string;
  slug: string;
  ville: string | null;
  pays: string | null;
  photo_url: string | null;
  origine_culturelle: string | null;
  zone_disponibilite: string | null;
  sous_categorie: string | null;
  description: string | null;
  badge_type: string | null;
  is_featured: boolean | null;
  is_lifetime_featured: boolean | null;
  score_ranking: number | null;
  langues: string[] | null;
  categories: { name: string; slug: string } | null;
  avg_rating: number;
  review_count: number;
  cover_url: string | null;
};

const PAGE_SIZE = 50;

async function fetchInBatches<T>(
  ids: string[],
  batchFn: (batchIds: string[]) => Promise<T[]>,
  batchSize = 40
): Promise<T[]> {
  if (ids.length === 0) return [];
  const results: T[] = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const data = await batchFn(batch);
    results.push(...data);
  }
  return results;
}

export function useExplorerData(filters: ExplorerFilters) {
  const [prestataires, setPrestataires] = useState<ExplorerPrestataire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const fetchIdRef = useRef(0);

  // Fetch categories once
  useEffect(() => {
    supabase.from('categories').select('id, name, slug').order('name').then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  // Fetch vendors
  useEffect(() => {
    const currentFetchId = ++fetchIdRef.current;

    const doFetch = async () => {
      setIsLoading(true);

      let query = supabase
        .from('prestataires')
        .select('*, categories(name, slug)')
        .eq('statut', 'actif')
        .not('photo_url', 'is', null)
        .neq('photo_url', '')
        .range(0, PAGE_SIZE - 1);

      if (filters.categorie) query = query.eq('categorie_id', filters.categorie);
      if (filters.sousCategorie) query = query.eq('sous_categorie', filters.sousCategorie);
      if (filters.search) query = query.or(`nom_entreprise.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      if (filters.zone) query = query.eq('zone_disponibilite', filters.zone);

      if (filters.pays) {
        const { data: countryData } = await supabase
          .from('countries')
          .select('id')
          .eq('name', filters.pays)
          .maybeSingle();
        if (countryData) query = query.eq('country_id', countryData.id);
      }

      if (filters.ville.length > 0) query = query.in('ville', filters.ville);

      query = query
        .order('is_lifetime_featured', { ascending: false, nullsFirst: false })
        .order('score_ranking', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (currentFetchId !== fetchIdRef.current) return; // stale
      if (error) { console.error(error); setIsLoading(false); return; }

      const ids = (data ?? []).map(p => p.id);
      let ratingsMap: Record<string, { avg: number; count: number }> = {};
      let mediasMap: Record<string, string> = {};

      if (ids.length > 0) {
        const [avisAll, mediasAll] = await Promise.all([
          fetchInBatches(ids, async (batch) => {
            const { data: d } = await supabase.from('avis').select('prestataire_id, note').eq('approved', true).in('prestataire_id', batch);
            return d ?? [];
          }),
          fetchInBatches(ids, async (batch) => {
            const { data: d } = await supabase.from('medias').select('prestataire_id, url').eq('type', 'photo').in('prestataire_id', batch).order('ordre', { ascending: true });
            return d ?? [];
          }),
        ]);

        if (currentFetchId !== fetchIdRef.current) return; // stale

        for (const a of avisAll) {
          if (!ratingsMap[a.prestataire_id]) ratingsMap[a.prestataire_id] = { avg: 0, count: 0 };
          ratingsMap[a.prestataire_id].count++;
          ratingsMap[a.prestataire_id].avg += a.note;
        }
        for (const key of Object.keys(ratingsMap)) {
          ratingsMap[key].avg = ratingsMap[key].avg / ratingsMap[key].count;
        }
        for (const m of mediasAll) {
          if (!mediasMap[m.prestataire_id]) mediasMap[m.prestataire_id] = m.url;
        }
      }

      let results: ExplorerPrestataire[] = (data ?? []).map(p => ({
        ...p,
        avg_rating: ratingsMap[p.id]?.avg ?? 0,
        review_count: ratingsMap[p.id]?.count ?? 0,
        cover_url: mediasMap[p.id] ?? null,
      }));

      // Client-side filters
      if (filters.origine.length > 0) {
        results = results.filter(p =>
          p.origine_culturelle && filters.origine.some(o => p.origine_culturelle!.toLowerCase().includes(o.toLowerCase()))
        );
      }

      if (filters.langue.length > 0) {
        results = results.filter(p =>
          p.langues && filters.langue.some(l => p.langues!.includes(l))
        );
      }

      if (filters.noteMin > 0) {
        results = results.filter(p => p.avg_rating >= filters.noteMin);
      }

      // Sort
      if (filters.sort === 'note') {
        results.sort((a, b) => b.avg_rating - a.avg_rating);
      } else if (filters.sort === 'avis') {
        results.sort((a, b) => b.review_count - a.review_count);
      } else if (filters.sort === 'premium') {
        results.sort((a, b) => {
          if (a.is_lifetime_featured && !b.is_lifetime_featured) return -1;
          if (!a.is_lifetime_featured && b.is_lifetime_featured) return 1;
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return (b.score_ranking ?? 0) - (a.score_ranking ?? 0);
        });
      }

      setPrestataires(results);
      setIsLoading(false);
    };

    doFetch();
  }, [filters]);

  return { prestataires, isLoading, categories };
}

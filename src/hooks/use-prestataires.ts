import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Prestataire = Tables<'prestataires'> & {
  categories: { name: string; slug: string } | null;
  avg_rating: number;
  review_count: number;
  cover_url: string | null;
};

export type PrestatairesFilters = {
  search: string;
  ville: string;
  categorie: string;
  culture: string;
  langue: string;
  noteMin: number;
  sort: 'pertinence' | 'note' | 'avis';
};

const defaultFilters: PrestatairesFilters = {
  search: '',
  ville: '',
  categorie: '',
  culture: '',
  langue: '',
  noteMin: 0,
  sort: 'pertinence',
};

export function usePrestataires() {
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<PrestatairesFilters>(defaultFilters);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [villes, setVilles] = useState<string[]>([]);
  const [cultures, setCultures] = useState<string[]>([]);
  const [langues, setLangues] = useState<string[]>([]);

  // Fetch filter options
  useEffect(() => {
    const fetchOptions = async () => {
      const [catRes, villeRes, cultureRes, langueRes] = await Promise.all([
        supabase.from('categories').select('id, name, slug').order('name'),
        supabase.from('prestataires').select('ville').not('ville', 'is', null),
        supabase.from('prestataires').select('origine_culturelle').not('origine_culturelle', 'is', null),
        supabase.from('prestataires').select('langues'),
      ]);

      if (catRes.data) setCategories(catRes.data);

      if (villeRes.data) {
        const unique = [...new Set(villeRes.data.map(v => v.ville).filter(Boolean))] as string[];
        setVilles(unique.sort());
      }

      if (cultureRes.data) {
        const unique = [...new Set(cultureRes.data.map(c => c.origine_culturelle).filter(Boolean))] as string[];
        setCultures(unique.sort());
      }

      if (langueRes.data) {
        const allLangs = langueRes.data.flatMap(l => l.langues ?? []);
        const unique = [...new Set(allLangs)].sort();
        setLangues(unique);
      }
    };

    fetchOptions();
  }, []);

  // Fetch prestataires
  useEffect(() => {
    const fetchPrestataires = async () => {
      setIsLoading(true);

      let query = supabase
        .from('prestataires')
        .select(`
          *,
          categories(name, slug)
        `)
        .eq('statut', 'actif');

      if (filters.ville) {
        query = query.eq('ville', filters.ville);
      }

      if (filters.categorie) {
        query = query.eq('categorie_id', filters.categorie);
      }

      if (filters.culture) {
        query = query.ilike('origine_culturelle', `%${filters.culture}%`);
      }

      if (filters.langue) {
        query = query.contains('langues', [filters.langue]);
      }

      if (filters.search) {
        query = query.or(`nom_entreprise.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.sort === 'pertinence') {
        query = query.order('score_ranking', { ascending: false, nullsFirst: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching prestataires:', error);
        setIsLoading(false);
        return;
      }

      // Fetch ratings for each prestataire
      const ids = (data ?? []).map(p => p.id);
      let ratingsMap: Record<string, { avg: number; count: number }> = {};

      if (ids.length > 0) {
        const { data: avisData } = await supabase
          .from('avis')
          .select('prestataire_id, note')
          .eq('approved', true)
          .in('prestataire_id', ids);

        if (avisData) {
          for (const a of avisData) {
            if (!ratingsMap[a.prestataire_id]) {
              ratingsMap[a.prestataire_id] = { avg: 0, count: 0 };
            }
            ratingsMap[a.prestataire_id].count++;
            ratingsMap[a.prestataire_id].avg += a.note;
          }
          for (const key of Object.keys(ratingsMap)) {
            ratingsMap[key].avg = ratingsMap[key].avg / ratingsMap[key].count;
          }
        }
      }

      // Fetch cover photos
      let mediasMap: Record<string, string> = {};
      if (ids.length > 0) {
        const { data: mediasData } = await supabase
          .from('medias')
          .select('prestataire_id, url')
          .eq('type', 'photo')
          .in('prestataire_id', ids)
          .order('ordre', { ascending: true });

        if (mediasData) {
          for (const m of mediasData) {
            if (!mediasMap[m.prestataire_id]) {
              mediasMap[m.prestataire_id] = m.url;
            }
          }
        }
      }

      let results: Prestataire[] = (data ?? []).map(p => ({
        ...p,
        avg_rating: ratingsMap[p.id]?.avg ?? 0,
        review_count: ratingsMap[p.id]?.count ?? 0,
        cover_url: mediasMap[p.id] ?? null,
      }));

      // Filter by minimum rating
      if (filters.noteMin > 0) {
        results = results.filter(p => p.avg_rating >= filters.noteMin);
      }

      // Sort
      if (filters.sort === 'note') {
        results.sort((a, b) => b.avg_rating - a.avg_rating);
      } else if (filters.sort === 'avis') {
        results.sort((a, b) => b.review_count - a.review_count);
      }

      setPrestataires(results);
      setIsLoading(false);
    };

    fetchPrestataires();
  }, [filters]);

  return {
    prestataires,
    isLoading,
    filters,
    setFilters,
    updateFilter: <K extends keyof PrestatairesFilters>(key: K, value: PrestatairesFilters[K]) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    },
    resetFilters: () => setFilters(defaultFilters),
    categories,
    villes,
    cultures,
    langues,
  };
}

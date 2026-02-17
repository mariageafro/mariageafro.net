import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { haversineDistance } from './use-geolocation';

type Prestataire = Tables<'prestataires'> & {
  categories: { name: string; slug: string } | null;
  avg_rating: number;
  review_count: number;
  cover_url: string | null;
  distance?: number;
};

export type PrestatairesFilters = {
  search: string;
  ville: string[];
  categorie: string;
  culture: string[];
  langue: string[];
  noteMin: number;
  sort: 'pertinence' | 'note' | 'avis' | 'distance';
  country: string;
};

const defaultFilters: PrestatairesFilters = {
  search: '',
  ville: [],
  categorie: '',
  culture: [],
  langue: [],
  noteMin: 0,
  sort: 'pertinence',
  country: '',
};

export function usePrestataires(initialFilters?: Partial<PrestatairesFilters>) {
  const [searchParams] = useSearchParams();
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const lockedFilters = initialFilters || {};
  const [filters, setFilters] = useState<PrestatairesFilters>(() => ({
    ...defaultFilters,
    country: searchParams.get('country') || '',
    ...lockedFilters,
  }));
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [villes, setVilles] = useState<string[]>([]);
  const [cultures, setCultures] = useState<string[]>([]);
  const [langues, setLangues] = useState<string[]>([]);
  const [geoLocation, setGeoLocation] = useState<{ lat: number; lng: number; radius: number } | null>(null);

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
        setLangues([...new Set(allLangs)].sort());
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
        .select(`*, categories(name, slug)`)
        .eq('statut', 'actif')
        .not('photo_url', 'is', null)
        .neq('photo_url', '');

      if (filters.ville.length > 0) query = query.in('ville', filters.ville);
      if (filters.categorie) query = query.eq('categorie_id', filters.categorie);
      if (filters.country) query = query.eq('country_id', filters.country);
      if (filters.search) query = query.or(`nom_entreprise.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      
      // Ranking: lifetime featured first, then score_ranking
      if (filters.sort === 'pertinence') {
        query = query
          .order('is_lifetime_featured', { ascending: false, nullsFirst: false })
          .order('score_ranking', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) { console.error('Error fetching prestataires:', error); setIsLoading(false); return; }

      const ids = (data ?? []).map(p => p.id);
      let ratingsMap: Record<string, { avg: number; count: number }> = {};
      let mediasMap: Record<string, string> = {};

      if (ids.length > 0) {
        const [avisRes, mediasRes] = await Promise.all([
          supabase.from('avis').select('prestataire_id, note').eq('approved', true).in('prestataire_id', ids),
          supabase.from('medias').select('prestataire_id, url').eq('type', 'photo').in('prestataire_id', ids).order('ordre', { ascending: true }),
        ]);

        if (avisRes.data) {
          for (const a of avisRes.data) {
            if (!ratingsMap[a.prestataire_id]) ratingsMap[a.prestataire_id] = { avg: 0, count: 0 };
            ratingsMap[a.prestataire_id].count++;
            ratingsMap[a.prestataire_id].avg += a.note;
          }
          for (const key of Object.keys(ratingsMap)) {
            ratingsMap[key].avg = ratingsMap[key].avg / ratingsMap[key].count;
          }
        }
        if (mediasRes.data) {
          for (const m of mediasRes.data) {
            if (!mediasMap[m.prestataire_id]) mediasMap[m.prestataire_id] = m.url;
          }
        }
      }

      let results: Prestataire[] = (data ?? []).map(p => {
        const result: Prestataire = {
          ...p,
          avg_rating: ratingsMap[p.id]?.avg ?? 0,
          review_count: ratingsMap[p.id]?.count ?? 0,
          cover_url: mediasMap[p.id] ?? null,
        };
        // Calculate distance if geolocation is active and provider has coordinates
        if (geoLocation && p.lat && p.lng) {
          result.distance = haversineDistance(geoLocation.lat, geoLocation.lng, p.lat, p.lng);
        }
        return result;
      });

      // Filter by minimum rating
      if (filters.noteMin > 0) {
        results = results.filter(p => p.avg_rating >= filters.noteMin);
      }

      // Filter by cultures (multi-select, client-side)
      if (filters.culture.length > 0) {
        results = results.filter(p =>
          p.origine_culturelle && filters.culture.some(c => p.origine_culturelle!.toLowerCase().includes(c.toLowerCase()))
        );
      }

      // Filter by langues (multi-select, client-side)
      if (filters.langue.length > 0) {
        results = results.filter(p =>
          p.langues && filters.langue.some(l => p.langues!.includes(l))
        );
      }

      // Filter by radius when geolocation is active
      if (geoLocation) {
        results = results.filter(p => {
          if (p.distance !== undefined) return p.distance <= geoLocation.radius;
          return true; // Keep providers without coordinates
        });
      }

      // Sort
      if (geoLocation && (filters.sort === 'distance' || filters.sort === 'pertinence')) {
        results.sort((a, b) => {
          const distA = a.distance ?? Infinity;
          const distB = b.distance ?? Infinity;
          if (distA !== distB) return distA - distB;
          return (b.score_ranking ?? 0) - (a.score_ranking ?? 0);
        });
      } else if (filters.sort === 'note') {
        results.sort((a, b) => b.avg_rating - a.avg_rating);
      } else if (filters.sort === 'avis') {
        results.sort((a, b) => b.review_count - a.review_count);
      }

      setPrestataires(results);
      setIsLoading(false);
    };

    fetchPrestataires();
  }, [filters, geoLocation]);

  return {
    prestataires,
    isLoading,
    filters,
    setFilters,
    updateFilter: <K extends keyof PrestatairesFilters>(key: K, value: PrestatairesFilters[K]) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    },
    resetFilters: () => {
      setFilters({ ...defaultFilters, ...lockedFilters });
      setGeoLocation(null);
    },
    categories,
    villes,
    cultures,
    langues,
    geoLocation,
    setGeoLocation,
  };
}

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

interface SimilarVendorsProps {
  currentId: string;
  categoryId: string | null;
  pays: string | null;
}

type VendorWithMedia = Tables<'prestataires'> & {
  medias: { url: string }[];
};

export function SimilarVendors({ currentId, categoryId, pays }: SimilarVendorsProps) {
  const [vendors, setVendors] = useState<VendorWithMedia[]>([]);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    if (!categoryId) return;

    const fetch = async () => {
      let query = supabase
        .from('prestataires')
        .select('*, medias(url)')
        .eq('statut', 'actif')
        .eq('categorie_id', categoryId)
        .neq('id', currentId)
        .order('score_ranking', { ascending: false })
        .limit(8);

      if (pays) query = query.eq('pays', pays);

      const { data } = await query;
      if (data && data.length > 0) {
        setVendors(data);
      } else if (pays) {
        // Fallback: same category, any country
        const { data: fallback } = await supabase
          .from('prestataires')
          .select('*, medias(url)')
          .eq('statut', 'actif')
          .eq('categorie_id', categoryId)
          .neq('id', currentId)
          .order('score_ranking', { ascending: false })
          .limit(8);
        setVendors(fallback ?? []);
      }
    };

    fetch();
  }, [currentId, categoryId, pays]);

  if (vendors.length === 0) return null;

  const scroll = (dir: 'left' | 'right') => {
    const el = document.getElementById('similar-vendors-scroll');
    if (!el) return;
    const amount = 320;
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    setScrollPos(el.scrollLeft + (dir === 'right' ? amount : -amount));
  };

  return (
    <section className="section-padding bg-gradient-warm">
      <div className="container-editorial">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl md:text-3xl text-chocolate">
            Prestataires similaires
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-champagne/30 flex items-center justify-center hover:bg-champagne/10 transition-colors"
            >
              <ChevronLeft size={20} className="text-chocolate" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-champagne/30 flex items-center justify-center hover:bg-champagne/10 transition-colors"
            >
              <ChevronRight size={20} className="text-chocolate" />
            </button>
          </div>
        </div>

        <div
          id="similar-vendors-scroll"
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x"
        >
          {vendors.map((v, i) => {
            const img = v.photo_url || v.medias?.[0]?.url;
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="min-w-[280px] max-w-[300px] snap-start"
              >
                <Link
                  to={`/prestataire/${v.slug}`}
                  className="block rounded-2xl overflow-hidden bg-background border border-border hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    {img ? (
                      <img
                        src={img}
                        alt={v.nom_entreprise}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground text-4xl">
                        📷
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg text-chocolate truncate">
                      {v.nom_entreprise}
                    </h3>
                    {v.ville && (
                      <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                        <MapPin size={14} />
                        <span className="font-body text-xs truncate">
                          {v.ville}{v.pays ? `, ${v.pays}` : ''}
                        </span>
                      </div>
                    )}
                    {v.verified && (
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-champagne/20 text-champagne-dark font-body text-xs">
                        ✓ Vérifié
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

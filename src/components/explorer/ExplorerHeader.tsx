import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { useState, useRef } from 'react';
import type { ExplorerFilters } from '@/pages/Explorer';

interface Props {
  filters: ExplorerFilters;
  updateFilter: <K extends keyof ExplorerFilters>(key: K, value: ExplorerFilters[K]) => void;
}

export function ExplorerHeader({ filters, updateFilter }: Props) {
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="relative overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-chocolate via-chocolate-light to-chocolate" />
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c4a265' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-champagne to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-20 md:pt-20 md:pb-24 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-champagne/30 bg-champagne/10 backdrop-blur-sm mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-champagne" />
          <span className="text-[11px] font-medium tracking-widest uppercase text-champagne">
            Marketplace Afro Premium
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] text-ivory font-semibold leading-[1.05] tracking-tight"
        >
          Trouvez l'excellence
          <br />
          <span className="text-champagne">pour votre mariage</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 text-ivory/60 font-body text-sm md:text-base max-w-lg mx-auto leading-relaxed"
        >
          Les meilleurs professionnels afro, sélectionnés pour leur savoir-faire et leur compréhension de nos cultures.
        </motion.p>

        {/* Floating Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 max-w-2xl mx-auto"
        >
          <div
            className={`relative flex items-center rounded-2xl border transition-all duration-300 ${
              searchFocused
                ? 'bg-ivory/15 border-champagne/50 shadow-[0_0_30px_-5px_hsla(38,45%,50%,0.3)]'
                : 'bg-ivory/10 border-ivory/15 shadow-[0_4px_30px_-10px_hsla(0,0%,0%,0.3)]'
            } backdrop-blur-md`}
          >
            <Search className="w-5 h-5 text-ivory/40 ml-5 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Rechercher un prestataire, un style, une spécialité..."
              className="flex-1 bg-transparent text-ivory placeholder:text-ivory/30 text-sm font-body px-4 py-4 md:py-5 outline-none"
            />
            <button
              onClick={() => inputRef.current?.focus()}
              className="mr-3 px-5 py-2 rounded-xl bg-champagne hover:bg-champagne-dark text-primary-foreground text-xs font-semibold transition-colors shrink-0"
            >
              Rechercher
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" fill="none" className="w-full" preserveAspectRatio="none">
          <path d="M0 40V20C360 0 1080 0 1440 20V40H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
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
    <section className="relative overflow-hidden bg-chocolate text-ivory/90">
      {/* Match footer background */}
      <div className="absolute inset-0 bg-chocolate" />

      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c4a265' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2h2v2h20v2H22v2.5L20 20.5z'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Top gold accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-24 md:pt-24 md:pb-32 text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-[1.08] tracking-tight"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
        >
          Trouvez l'excellence
          <br />
          <span className="text-champagne">pour votre mariage</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-white/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
        >
          Les meilleurs professionnels afro, sélectionnés pour leur savoir-faire.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 max-w-2xl mx-auto"
        >
          <div
            className={`relative flex items-center rounded-2xl transition-all duration-300 ${
              searchFocused
                ? 'bg-white/20 border-2 border-champagne/60 shadow-[0_0_40px_-8px_hsla(38,50%,55%,0.4)]'
                : 'bg-white/10 border-2 border-white/15 shadow-[0_8px_40px_-12px_hsla(0,0%,0%,0.5)]'
            } backdrop-blur-md`}
          >
            <Search className="w-5 h-5 text-white/50 ml-5 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Rechercher un prestataire, un style..."
              className="flex-1 bg-transparent text-white placeholder:text-white/35 text-sm px-4 py-4 md:py-5 outline-none"
            />
            <button
              onClick={() => inputRef.current?.focus()}
              className="mr-2.5 px-6 py-2.5 rounded-xl bg-champagne hover:bg-champagne-dark text-primary-foreground text-sm font-semibold transition-colors shrink-0 active:scale-95"
            >
              Rechercher
            </button>
          </div>
        </motion.div>
      </div>

      {/* Clean bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 48" fill="none" className="w-full block" preserveAspectRatio="none">
          <path d="M0 48V24C240 4 480 0 720 0C960 0 1200 4 1440 24V48H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
}

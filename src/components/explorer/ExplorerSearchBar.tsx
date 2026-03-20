import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check, Globe, Users, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExplorerFilters } from '@/pages/Explorer';

const ORIGINS = [
  'Congo', 'Cameroun', 'Sénégal', 'Côte d\'Ivoire', 'Mali', 'Guinée',
  'Bénin', 'Ghana', 'Nigeria', 'Haïti', 'Antilles'
];

const PAYS = ['France', 'Belgique'];

interface Props {
  filters: ExplorerFilters;
  updateFilter: <K extends keyof ExplorerFilters>(key: K, value: ExplorerFilters[K]) => void;
  categories: { id: string; name: string; slug: string }[];
}

function FilterPill({
  icon: Icon,
  label,
  value,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-left transition-all duration-200 ${
        active
          ? 'bg-champagne/10 border-champagne/40 shadow-sm'
          : 'bg-card border-border/50 hover:border-champagne/30 hover:shadow-sm'
      }`}
    >
      <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
        active ? 'bg-champagne/20 text-champagne-dark' : 'bg-secondary text-muted-foreground group-hover:bg-champagne/10 group-hover:text-champagne'
      }`}>
        <Icon className="w-4 h-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">{label}</p>
        <p className={`text-sm font-medium truncate ${active ? 'text-champagne-dark' : 'text-foreground'}`}>
          {value}
        </p>
      </div>
      <ChevronDown className={`w-3.5 h-3.5 ml-auto text-muted-foreground/50 transition-transform ${active ? 'rotate-180' : ''}`} />
    </button>
  );
}

export function ExplorerSearchBar({ filters, updateFilter, categories }: Props) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => setOpenDropdown(prev => prev === name ? null : name);

  const selectCategory = (id: string, name: string) => {
    updateFilter('categorie', id);
    updateFilter('categorieLabel', name);
    setOpenDropdown(null);
  };

  const toggleOrigin = (origin: string) => {
    const current = filters.origine;
    updateFilter('origine', current.includes(origin)
      ? current.filter(o => o !== origin)
      : [...current, origin]
    );
  };

  const selectPays = (pays: string) => {
    updateFilter('pays', filters.pays === pays ? '' : pays);
    setOpenDropdown(null);
  };

  const dropdownMotion = {
    initial: { opacity: 0, y: -8, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -6, scale: 0.98 },
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Type de prestataire */}
        <div className="relative">
          <FilterPill
            icon={Users}
            label="Type de prestataire"
            value={filters.categorieLabel || 'Tous les prestataires'}
            active={openDropdown === 'categorie'}
            onClick={() => toggleDropdown('categorie')}
          />
          <AnimatePresence>
            {openDropdown === 'categorie' && (
              <motion.div
                {...dropdownMotion}
                className="absolute top-full left-0 right-0 mt-2 z-50 bg-popover border border-border/60 rounded-xl shadow-[var(--shadow-elegant)] p-2 max-h-72 overflow-y-auto"
              >
                <button
                  onClick={() => { updateFilter('categorie', ''); updateFilter('categorieLabel', ''); setOpenDropdown(null); }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    !filters.categorie ? 'bg-champagne/10 text-champagne-dark font-medium' : 'hover:bg-secondary/60 text-muted-foreground'
                  }`}
                >
                  {!filters.categorie && <Check className="w-3.5 h-3.5 text-champagne" />}
                  <span>Toutes les catégories</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => selectCategory(cat.id, cat.name)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      filters.categorie === cat.id ? 'bg-champagne/10 text-champagne-dark font-medium' : 'hover:bg-secondary/60'
                    }`}
                  >
                    {filters.categorie === cat.id && <Check className="w-3.5 h-3.5 text-champagne" />}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Origine & culture */}
        <div className="relative">
          <FilterPill
            icon={Globe}
            label="Origine & culture"
            value={filters.origine.length > 0 ? filters.origine.slice(0, 2).join(', ') + (filters.origine.length > 2 ? ` +${filters.origine.length - 2}` : '') : 'Toutes les origines'}
            active={openDropdown === 'origine'}
            onClick={() => toggleDropdown('origine')}
          />
          <AnimatePresence>
            {openDropdown === 'origine' && (
              <motion.div
                {...dropdownMotion}
                className="absolute top-full left-0 right-0 mt-2 z-50 bg-popover border border-border/60 rounded-xl shadow-[var(--shadow-elegant)] p-4"
              >
                <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground mb-3">Sélection multiple</p>
                <div className="flex flex-wrap gap-2">
                  {ORIGINS.map(origin => {
                    const selected = filters.origine.includes(origin);
                    return (
                      <button
                        key={origin}
                        onClick={() => toggleOrigin(origin)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                          selected
                            ? 'bg-champagne text-primary-foreground shadow-sm scale-[1.02]'
                            : 'bg-secondary hover:bg-warm-beige text-foreground hover:scale-[1.02]'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3" />}
                        {origin}
                      </button>
                    );
                  })}
                </div>
                {filters.origine.length > 0 && (
                  <button
                    onClick={() => updateFilter('origine', [])}
                    className="mt-3 text-xs text-champagne hover:text-champagne-dark transition-colors"
                  >
                    Effacer la sélection
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pays du mariage */}
        <div className="relative">
          <FilterPill
            icon={MapPin}
            label="Pays du mariage"
            value={filters.pays || 'Tous les pays'}
            active={openDropdown === 'pays'}
            onClick={() => toggleDropdown('pays')}
          />
          <AnimatePresence>
            {openDropdown === 'pays' && (
              <motion.div
                {...dropdownMotion}
                className="absolute top-full left-0 right-0 mt-2 z-50 bg-popover border border-border/60 rounded-xl shadow-[var(--shadow-elegant)] p-2"
              >
                <button
                  onClick={() => { updateFilter('pays', ''); setOpenDropdown(null); }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    !filters.pays ? 'bg-champagne/10 text-champagne-dark font-medium' : 'hover:bg-secondary/60 text-muted-foreground'
                  }`}
                >
                  {!filters.pays && <Check className="w-3.5 h-3.5 text-champagne" />}
                  <span>Tous les pays</span>
                </button>
                {PAYS.map(p => (
                  <button
                    key={p}
                    onClick={() => selectPays(p)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      filters.pays === p ? 'bg-champagne/10 text-champagne-dark font-medium' : 'hover:bg-secondary/60'
                    }`}
                  >
                    {filters.pays === p && <Check className="w-3.5 h-3.5 text-champagne" />}
                    <span>{p === 'France' ? '🇫🇷 France' : '🇧🇪 Belgique'}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

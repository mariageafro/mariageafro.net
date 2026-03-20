import { useState } from 'react';
import { ChevronDown, Star, Zap, TrendingUp, Clock, Crown, Globe, MapPin, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExplorerFilters } from '@/pages/Explorer';
import { ExplorerProfessionFilters } from './ExplorerProfessionFilters';

const POPULAR_ORIGINS = ['Congo', 'Cameroun', 'Sénégal', 'Côte d\'Ivoire', 'Nigeria', 'Antilles'];
const MORE_ORIGINS = ['Mali', 'Guinée', 'Bénin', 'Ghana', 'Haïti'];
const ZONES = ['France', 'Belgique', 'France & Belgique', 'Europe', 'International'];
const SORT_OPTIONS = [
  { value: 'pertinence', label: 'Pertinence', icon: Zap },
  { value: 'note', label: 'Mieux notés', icon: Star },
  { value: 'avis', label: 'Plus d\'avis', icon: TrendingUp },
  { value: 'nouveaux', label: 'Nouveaux', icon: Clock },
  { value: 'premium', label: 'Premium', icon: Crown },
];

interface Props {
  filters: ExplorerFilters;
  updateFilter: <K extends keyof ExplorerFilters>(key: K, value: ExplorerFilters[K]) => void;
  categories: { id: string; name: string; slug: string }[];
}

function SidebarSection({ title, icon: Icon, children, defaultOpen = true, accent = false }: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accent?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="pb-4 mb-4 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 justify-between w-full text-left mb-3 group"
      >
        <div className="flex items-center gap-2">
          {Icon && (
            <span className={`flex items-center justify-center w-6 h-6 rounded-md ${accent ? 'bg-champagne/15 text-champagne' : 'bg-secondary text-muted-foreground'}`}>
              <Icon className="w-3.5 h-3.5" />
            </span>
          )}
          <h3 className={`text-xs font-semibold tracking-wide uppercase ${accent ? 'text-champagne-dark' : 'text-chocolate'}`}>
            {title}
          </h3>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground/50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Chip({ label, active, onClick, count }: { label: string; active: boolean; onClick: () => void; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95 ${
        active
          ? 'bg-champagne text-primary-foreground shadow-sm'
          : 'bg-secondary/80 hover:bg-secondary text-foreground hover:shadow-sm'
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-champagne-dark text-ivory text-[9px] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

export function ExplorerSidebar({ filters, updateFilter, categories }: Props) {
  const [showMoreOrigins, setShowMoreOrigins] = useState(false);

  const toggleOrigin = (origin: string) => {
    const current = filters.origine;
    updateFilter('origine', current.includes(origin) ? current.filter(o => o !== origin) : [...current, origin]);
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-[var(--shadow-card)] sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-border/40">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-champagne">Affiner la recherche</p>
      </div>

      <div className="p-5 space-y-0">
        {/* Catégorie */}
        <SidebarSection title="Catégorie">
          <div className="flex flex-wrap gap-1.5">
            <Chip label="Toutes" active={!filters.categorie} onClick={() => { updateFilter('categorie', ''); updateFilter('categorieLabel', ''); }} />
            {categories.map(cat => (
              <Chip
                key={cat.id}
                label={cat.name}
                active={filters.categorie === cat.id}
                onClick={() => {
                  updateFilter('categorie', filters.categorie === cat.id ? '' : cat.id);
                  updateFilter('categorieLabel', filters.categorie === cat.id ? '' : cat.name);
                }}
              />
            ))}
          </div>
        </SidebarSection>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mb-4" />

        {/* Origine & culture */}
        <SidebarSection title="Origine & culture" icon={Globe}>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_ORIGINS.map(o => (
              <Chip key={o} label={o} active={filters.origine.includes(o)} onClick={() => toggleOrigin(o)} />
            ))}
            <AnimatePresence>
              {showMoreOrigins && MORE_ORIGINS.map(o => (
                <motion.div
                  key={o}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Chip label={o} active={filters.origine.includes(o)} onClick={() => toggleOrigin(o)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setShowMoreOrigins(!showMoreOrigins)}
            className="mt-2 text-xs text-champagne hover:text-champagne-dark transition-colors inline-flex items-center gap-1"
          >
            {showMoreOrigins ? '− Voir moins' : '+ Voir plus'}
          </button>
        </SidebarSection>

        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mb-4" />

        {/* Pays du mariage */}
        <SidebarSection title="Pays du mariage" icon={MapPin}>
          <div className="flex gap-2">
            {['France', 'Belgique'].map(p => (
              <Chip
                key={p}
                label={p === 'France' ? '🇫🇷 France' : '🇧🇪 Belgique'}
                active={filters.pays === p}
                onClick={() => updateFilter('pays', filters.pays === p ? '' : p)}
              />
            ))}
          </div>
        </SidebarSection>

        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mb-4" />

        {/* Zone de disponibilité */}
        <SidebarSection title="Zone de disponibilité" icon={Plane}>
          <div className="flex flex-wrap gap-1.5">
            {ZONES.map(z => (
              <Chip key={z} label={z} active={filters.zone === z} onClick={() => updateFilter('zone', filters.zone === z ? '' : z)} />
            ))}
          </div>
        </SidebarSection>

        {/* Dynamic profession filters */}
        <AnimatePresence mode="wait">
          {filters.categorieLabel && (
            <motion.div
              key={filters.categorieLabel}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="h-px bg-gradient-to-r from-champagne/30 via-champagne/50 to-champagne/30 mb-4" />
              <ExplorerProfessionFilters
                categoryName={filters.categorieLabel}
                filters={filters}
                updateFilter={updateFilter}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mb-4" />

        {/* Trier par */}
        <SidebarSection title="Trier par">
          <div className="grid grid-cols-2 gap-1.5">
            {SORT_OPTIONS.map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => updateFilter('sort', opt.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-200 active:scale-95 ${
                    filters.sort === opt.value
                      ? 'bg-champagne/10 text-champagne-dark font-medium border border-champagne/20'
                      : 'hover:bg-secondary/60 text-foreground border border-transparent'
                  }`}
                >
                  <Icon className="w-3 h-3 shrink-0" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </SidebarSection>

        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mb-4" />

        {/* Filtres avancés */}
        <SidebarSection title="Filtres avancés" defaultOpen={false}>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground mb-2">Note minimum</p>
              <div className="flex gap-1.5">
                {[0, 3, 4, 4.5].map(n => (
                  <button
                    key={n}
                    onClick={() => updateFilter('noteMin', filters.noteMin === n ? 0 : n)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 active:scale-95 ${
                      filters.noteMin === n && n > 0
                        ? 'bg-champagne/10 text-champagne-dark font-medium border border-champagne/20'
                        : 'bg-secondary/80 hover:bg-secondary text-foreground border border-transparent'
                    }`}
                  >
                    {n === 0 ? 'Tous' : <><Star className="w-3 h-3 fill-champagne text-champagne" />{n}+</>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SidebarSection>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import type { ExplorerFilters } from '@/pages/Explorer';
import { ExplorerProfessionFilters } from './ExplorerProfessionFilters';

const POPULAR_ORIGINS = ['Congo', 'Cameroun', 'Sénégal', 'Côte d\'Ivoire', 'Nigeria', 'Antilles'];
const MORE_ORIGINS = ['Mali', 'Guinée', 'Bénin', 'Ghana', 'Haïti'];
const ZONES = ['France', 'Belgique', 'France & Belgique', 'Europe', 'International'];
const SORT_OPTIONS = [
  { value: 'pertinence', label: 'Pertinence' },
  { value: 'note', label: 'Mieux notés' },
  { value: 'avis', label: 'Plus d\'avis' },
  { value: 'nouveaux', label: 'Nouveaux' },
  { value: 'premium', label: 'Premium en premier' },
];

interface Props {
  filters: ExplorerFilters;
  updateFilter: <K extends keyof ExplorerFilters>(key: K, value: ExplorerFilters[K]) => void;
  categories: { id: string; name: string; slug: string }[];
}

function SidebarSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/40 pb-5 mb-5 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <h3 className="font-serif text-sm font-semibold text-chocolate tracking-wide">{title}</h3>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && children}
    </div>
  );
}

function ChipButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        active
          ? 'bg-champagne text-primary-foreground shadow-sm'
          : 'bg-secondary hover:bg-warm-beige text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

export function ExplorerSidebar({ filters, updateFilter, categories }: Props) {
  const [showMoreOrigins, setShowMoreOrigins] = useState(false);

  const toggleOrigin = (origin: string) => {
    const current = filters.origine;
    if (current.includes(origin)) {
      updateFilter('origine', current.filter(o => o !== origin));
    } else {
      updateFilter('origine', [...current, origin]);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-[var(--shadow-card)] p-5 sticky top-24">
      {/* Catégorie */}
      <SidebarSection title="Catégorie">
        <div className="flex flex-wrap gap-1.5">
          <ChipButton
            label="Toutes"
            active={!filters.categorie}
            onClick={() => { updateFilter('categorie', ''); updateFilter('categorieLabel', ''); }}
          />
          {categories.map(cat => (
            <ChipButton
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

      {/* Origine & culture */}
      <SidebarSection title="Origine & culture">
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_ORIGINS.map(o => (
            <ChipButton key={o} label={o} active={filters.origine.includes(o)} onClick={() => toggleOrigin(o)} />
          ))}
          {showMoreOrigins && MORE_ORIGINS.map(o => (
            <ChipButton key={o} label={o} active={filters.origine.includes(o)} onClick={() => toggleOrigin(o)} />
          ))}
        </div>
        <button
          onClick={() => setShowMoreOrigins(!showMoreOrigins)}
          className="mt-2 text-xs text-champagne hover:text-champagne-dark transition-colors"
        >
          {showMoreOrigins ? 'Voir moins' : 'Voir plus'}
        </button>
      </SidebarSection>

      {/* Pays du mariage */}
      <SidebarSection title="Pays du mariage">
        <div className="flex gap-2">
          {['France', 'Belgique'].map(p => (
            <ChipButton
              key={p}
              label={p}
              active={filters.pays === p}
              onClick={() => updateFilter('pays', filters.pays === p ? '' : p)}
            />
          ))}
        </div>
      </SidebarSection>

      {/* Zone de disponibilité */}
      <SidebarSection title="Zone de disponibilité">
        <div className="flex flex-wrap gap-1.5">
          {ZONES.map(z => (
            <ChipButton
              key={z}
              label={z}
              active={filters.zone === z}
              onClick={() => updateFilter('zone', filters.zone === z ? '' : z)}
            />
          ))}
        </div>
      </SidebarSection>

      {/* Dynamic profession filters */}
      {filters.categorieLabel && (
        <ExplorerProfessionFilters
          categoryName={filters.categorieLabel}
          filters={filters}
          updateFilter={updateFilter}
        />
      )}

      {/* Trier par */}
      <SidebarSection title="Trier par">
        <div className="space-y-1">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateFilter('sort', opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                filters.sort === opt.value
                  ? 'bg-champagne/10 text-champagne-dark font-medium'
                  : 'hover:bg-secondary/60 text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </SidebarSection>

      {/* Filtres avancés */}
      <SidebarSection title="Filtres avancés" defaultOpen={false}>
        <div className="space-y-4">
          {/* Note minimum */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Note minimum</p>
            <div className="flex gap-1.5">
              {[0, 3, 4, 4.5].map(n => (
                <button
                  key={n}
                  onClick={() => updateFilter('noteMin', filters.noteMin === n ? 0 : n)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    filters.noteMin === n && n > 0
                      ? 'bg-champagne/10 text-champagne-dark font-medium'
                      : 'bg-secondary hover:bg-warm-beige text-foreground'
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
  );
}

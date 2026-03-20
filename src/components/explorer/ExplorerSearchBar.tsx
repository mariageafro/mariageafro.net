import { useState } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
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

export function ExplorerSearchBar({ filters, updateFilter, categories }: Props) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  const selectCategory = (id: string, name: string) => {
    updateFilter('categorie', id);
    updateFilter('categorieLabel', name);
    setOpenDropdown(null);
  };

  const selectOrigin = (origin: string) => {
    const current = filters.origine;
    if (current.includes(origin)) {
      updateFilter('origine', current.filter(o => o !== origin));
    } else {
      updateFilter('origine', [...current, origin]);
    }
  };

  const selectPays = (pays: string) => {
    updateFilter('pays', filters.pays === pays ? '' : pays);
    setOpenDropdown(null);
  };

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row gap-2 md:gap-0 md:rounded-2xl md:border md:border-border/60 md:bg-card md:shadow-[var(--shadow-soft)] md:overflow-visible">
        {/* Type de prestataire */}
        <div className="relative flex-1 md:border-r md:border-border/40">
          <button
            onClick={() => toggleDropdown('categorie')}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left rounded-xl md:rounded-none md:rounded-l-2xl hover:bg-secondary/50 transition-colors"
          >
            <div>
              <p className="text-[10px] font-medium tracking-wider uppercase text-champagne-dark">Type de prestataire</p>
              <p className="text-sm text-foreground mt-0.5 truncate">
                {filters.categorieLabel || 'Photographe, DJ, vidéaste...'}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openDropdown === 'categorie' ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === 'categorie' && (
            <div className="absolute top-full left-0 right-0 md:min-w-[320px] mt-1 z-50 bg-popover border border-border/60 rounded-xl shadow-lg p-2 max-h-72 overflow-y-auto">
              <button
                onClick={() => { updateFilter('categorie', ''); updateFilter('categorieLabel', ''); setOpenDropdown(null); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-secondary/60 text-muted-foreground transition-colors"
              >
                Toutes les catégories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.id, cat.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.categorie === cat.id ? 'bg-champagne/10 text-champagne-dark font-medium' : 'hover:bg-secondary/60'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Origine & culture */}
        <div className="relative flex-1 md:border-r md:border-border/40">
          <button
            onClick={() => toggleDropdown('origine')}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-secondary/50 transition-colors"
          >
            <div>
              <p className="text-[10px] font-medium tracking-wider uppercase text-champagne-dark">Origine & culture</p>
              <p className="text-sm text-foreground mt-0.5 truncate">
                {filters.origine.length > 0 ? filters.origine.join(', ') : 'Congo, Cameroun, Antilles...'}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openDropdown === 'origine' ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === 'origine' && (
            <div className="absolute top-full left-0 right-0 md:min-w-[320px] mt-1 z-50 bg-popover border border-border/60 rounded-xl shadow-lg p-3">
              <div className="flex flex-wrap gap-2">
                {ORIGINS.map(origin => (
                  <button
                    key={origin}
                    onClick={() => selectOrigin(origin)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      filters.origine.includes(origin)
                        ? 'bg-champagne text-primary-foreground shadow-sm'
                        : 'bg-secondary hover:bg-secondary/80 text-foreground'
                    }`}
                  >
                    {origin}
                    {filters.origine.includes(origin) && <X className="inline w-3 h-3 ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pays du mariage */}
        <div className="relative flex-1 md:border-r md:border-border/40">
          <button
            onClick={() => toggleDropdown('pays')}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-secondary/50 transition-colors"
          >
            <div>
              <p className="text-[10px] font-medium tracking-wider uppercase text-champagne-dark">Pays du mariage</p>
              <p className="text-sm text-foreground mt-0.5">
                {filters.pays || 'France, Belgique'}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openDropdown === 'pays' ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === 'pays' && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-popover border border-border/60 rounded-xl shadow-lg p-2">
              <button
                onClick={() => { updateFilter('pays', ''); setOpenDropdown(null); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-secondary/60 text-muted-foreground transition-colors"
              >
                Tous les pays
              </button>
              {PAYS.map(p => (
                <button
                  key={p}
                  onClick={() => selectPays(p)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.pays === p ? 'bg-champagne/10 text-champagne-dark font-medium' : 'hover:bg-secondary/60'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search button */}
        <button
          onClick={() => setOpenDropdown(null)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-champagne hover:bg-champagne-dark text-primary-foreground font-medium text-sm rounded-xl md:rounded-none md:rounded-r-2xl transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="md:hidden lg:inline">Rechercher</span>
        </button>
      </div>

      {/* Click outside to close */}
      {openDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
      )}
    </div>
  );
}

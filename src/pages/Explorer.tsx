import { useState, useMemo, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ExplorerHeader } from '@/components/explorer/ExplorerHeader';
import { ExplorerSearchBar } from '@/components/explorer/ExplorerSearchBar';
import { ExplorerActiveFilters } from '@/components/explorer/ExplorerActiveFilters';
import { ExplorerSidebar } from '@/components/explorer/ExplorerSidebar';
import { ExplorerGrid } from '@/components/explorer/ExplorerGrid';
import { ExplorerMobileFilters } from '@/components/explorer/ExplorerMobileFilters';
import { ExplorerEmptyState } from '@/components/explorer/ExplorerEmptyState';
import { useExplorerData } from '@/hooks/use-explorer-data';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export type ExplorerFilters = {
  search: string;
  categorie: string;
  categorieLabel: string;
  origine: string[];
  pays: string;
  zone: string;
  sort: string;
  langue: string[];
  sousCategorie: string;
  ville: string[];
  noteMin: number;
  professionFilters: Record<string, string[]>;
};

export const defaultExplorerFilters: ExplorerFilters = {
  search: '',
  categorie: '',
  categorieLabel: '',
  origine: [],
  pays: '',
  zone: '',
  sort: 'pertinence',
  langue: [],
  sousCategorie: '',
  ville: [],
  noteMin: 0,
  professionFilters: {},
};

export default function Explorer() {
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<ExplorerFilters>(defaultExplorerFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { prestataires, isLoading, categories } = useExplorerData(filters);

  // Sync URL search params into filters on mount
  useEffect(() => {
    if (categories.length === 0) return;
    const catSlug = searchParams.get('category') || searchParams.get('cat');
    const searchQuery = searchParams.get('search');
    const origineParam = searchParams.get('culture');

    setFilters(prev => {
      const next = { ...prev };
      if (catSlug) {
        const cat = categories.find(c => c.slug === catSlug);
        if (cat) {
          next.categorie = cat.id;
          next.categorieLabel = cat.name;
        }
      }
      if (searchQuery) next.search = searchQuery;
      if (origineParam) next.origine = [origineParam];
      return next;
    });
  }, [searchParams, categories]);

  const updateFilter = <K extends keyof ExplorerFilters>(key: K, value: ExplorerFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(defaultExplorerFilters);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categorie) count++;
    if (filters.origine.length) count += filters.origine.length;
    if (filters.pays) count++;
    if (filters.zone) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Premium Header with integrated search */}
        <ExplorerHeader filters={filters} updateFilter={updateFilter} />

        {/* Filter Bar */}
        <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b border-border/30">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <ExplorerSearchBar
              filters={filters}
              updateFilter={updateFilter}
              categories={categories}
            />
          </div>
        </div>

        {/* Active Filters + Mobile Toggle */}
        {(activeFilterCount > 0 || isMobile) && (
          <div className="max-w-7xl mx-auto px-4 pt-4">
            <div className="flex items-center gap-3">
              {isMobile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="shrink-0 gap-2 border-champagne/30 text-chocolate rounded-xl"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-champagne text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              )}
              <ExplorerActiveFilters filters={filters} updateFilter={updateFilter} resetFilters={resetFilters} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 pb-20 pt-6">
          <div className="flex gap-8">
            {/* Sidebar - Desktop only */}
            {!isMobile && (
              <motion.aside
                initial={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-[280px] shrink-0"
              >
                <ExplorerSidebar
                  filters={filters}
                  updateFilter={updateFilter}
                  categories={categories}
                />
              </motion.aside>
            )}

            {/* Results Grid */}
            <div className="flex-1 min-w-0">
              {!isLoading && prestataires.length === 0 ? (
                <ExplorerEmptyState resetFilters={resetFilters} filters={filters} />
              ) : (
                <ExplorerGrid prestataires={prestataires} isLoading={isLoading} />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <ExplorerMobileFilters
          open={mobileFiltersOpen}
          onOpenChange={setMobileFiltersOpen}
          filters={filters}
          updateFilter={updateFilter}
          categories={categories}
          resetFilters={resetFilters}
        />
      </div>
    </Layout>
  );
}

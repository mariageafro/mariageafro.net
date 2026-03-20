import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ExplorerSidebar } from './ExplorerSidebar';
import { SlidersHorizontal, X } from 'lucide-react';
import type { ExplorerFilters } from '@/pages/Explorer';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ExplorerFilters;
  updateFilter: <K extends keyof ExplorerFilters>(key: K, value: ExplorerFilters[K]) => void;
  categories: { id: string; name: string; slug: string }[];
  resetFilters: () => void;
}

export function ExplorerMobileFilters({ open, onOpenChange, filters, updateFilter, categories, resetFilters }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl overflow-hidden p-0">
        {/* Sticky header */}
        <SheetHeader className="sticky top-0 bg-card/95 backdrop-blur-lg z-10 px-5 py-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-champagne/10">
                <SlidersHorizontal className="w-4 h-4 text-champagne" />
              </span>
              <SheetTitle className="font-serif text-lg text-chocolate">Filtres</SheetTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs text-muted-foreground hover:text-champagne-dark"
              >
                Réinitialiser
              </Button>
              <Button
                size="sm"
                onClick={() => onOpenChange(false)}
                className="bg-champagne text-primary-foreground hover:bg-champagne-dark text-xs rounded-lg px-4"
              >
                Voir les résultats
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="overflow-y-auto h-[calc(90vh-4.5rem)] p-5">
          <ExplorerSidebar filters={filters} updateFilter={updateFilter} categories={categories} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

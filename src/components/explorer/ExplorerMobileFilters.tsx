import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ExplorerSidebar } from './ExplorerSidebar';
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
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl overflow-y-auto p-0">
        <SheetHeader className="sticky top-0 bg-card z-10 px-5 py-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-lg text-chocolate">Filtres</SheetTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs text-muted-foreground">
                Réinitialiser
              </Button>
              <Button size="sm" onClick={() => onOpenChange(false)} className="bg-champagne text-primary-foreground hover:bg-champagne-dark text-xs">
                Appliquer
              </Button>
            </div>
          </div>
        </SheetHeader>
        <div className="p-5">
          <ExplorerSidebar filters={filters} updateFilter={updateFilter} categories={categories} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

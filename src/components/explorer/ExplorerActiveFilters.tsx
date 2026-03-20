import { X } from 'lucide-react';
import type { ExplorerFilters } from '@/pages/Explorer';

interface Props {
  filters: ExplorerFilters;
  updateFilter: <K extends keyof ExplorerFilters>(key: K, value: ExplorerFilters[K]) => void;
  resetFilters: () => void;
}

export function ExplorerActiveFilters({ filters, updateFilter, resetFilters }: Props) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.categorieLabel) {
    chips.push({ label: filters.categorieLabel, onRemove: () => { updateFilter('categorie', ''); updateFilter('categorieLabel', ''); } });
  }
  filters.origine.forEach(o => {
    chips.push({ label: o, onRemove: () => updateFilter('origine', filters.origine.filter(x => x !== o)) });
  });
  if (filters.pays) {
    chips.push({ label: filters.pays, onRemove: () => updateFilter('pays', '') });
  }
  if (filters.zone) {
    chips.push({ label: filters.zone, onRemove: () => updateFilter('zone', '') });
  }
  if (filters.search) {
    chips.push({ label: `"${filters.search}"`, onRemove: () => updateFilter('search', '') });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-champagne/10 text-champagne-dark text-xs font-medium hover:bg-champagne/20 transition-colors group"
        >
          {chip.label}
          <X className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
      <button
        onClick={resetFilters}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
      >
        Effacer tout
      </button>
    </div>
  );
}

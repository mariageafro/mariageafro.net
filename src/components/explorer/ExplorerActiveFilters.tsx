import { X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <AnimatePresence mode="popLayout">
        {chips.map((chip) => (
          <motion.button
            key={chip.label}
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={chip.onRemove}
            className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-champagne/10 border border-champagne/20 text-champagne-dark text-xs font-medium hover:bg-champagne/20 hover:border-champagne/30 transition-colors group active:scale-95"
          >
            {chip.label}
            <span className="w-4 h-4 rounded-full bg-champagne/20 flex items-center justify-center group-hover:bg-champagne/30 transition-colors">
              <X className="w-2.5 h-2.5" />
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
      <motion.button
        layout
        onClick={resetFilters}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-champagne-dark transition-colors active:scale-95"
      >
        <RotateCcw className="w-3 h-3" />
        Effacer tout
      </motion.button>
    </div>
  );
}

import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ExplorerFilters } from '@/pages/Explorer';
import { motion } from 'framer-motion';

interface Props {
  resetFilters: () => void;
  filters: ExplorerFilters;
}

export function ExplorerEmptyState({ resetFilters }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-champagne/10 flex items-center justify-center mb-6">
        <Search className="w-7 h-7 text-champagne" />
      </div>

      <h3 className="font-serif text-2xl text-chocolate font-semibold mb-2">
        Aucun résultat
      </h3>
      <p className="text-muted-foreground text-sm max-w-md mb-6">
        Nous n'avons pas trouvé de prestataires correspondant à vos critères. Essayez d'élargir votre recherche.
      </p>

      <Button
        onClick={resetFilters}
        variant="gold-outline"
        className="gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Effacer les filtres
      </Button>
    </motion.div>
  );
}

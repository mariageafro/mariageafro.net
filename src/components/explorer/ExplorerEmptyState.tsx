import { Search, Sparkles, ArrowRight } from 'lucide-react';
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
      initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-28 text-center"
    >
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-champagne/10 to-champagne/5 flex items-center justify-center border border-champagne/20">
          <Search className="w-8 h-8 text-champagne/60" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-champagne/10 flex items-center justify-center animate-pulse">
          <Sparkles className="w-4 h-4 text-champagne" />
        </div>
      </div>

      <h3 className="font-serif text-2xl text-chocolate font-semibold mb-2">
        Aucun résultat trouvé
      </h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-8 leading-relaxed">
        Essayez d'élargir vos critères de recherche ou explorez d'autres catégories pour découvrir nos prestataires.
      </p>

      <Button
        onClick={resetFilters}
        className="gap-2 bg-champagne hover:bg-champagne-dark text-primary-foreground rounded-xl px-6"
      >
        Réinitialiser les filtres
        <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExplorerFilters } from '@/pages/Explorer';

const PROFESSION_FILTERS: Record<string, { title: string; icon: string; options: string[] }[]> = {
  'Image & Souvenirs': [
    { title: 'Type de service', icon: '📸', options: ['Photo', 'Vidéo', 'Les deux'] },
    { title: 'Options', icon: '✨', options: ['Drone', 'Same day edit', 'Album', 'Multi-day coverage'] },
  ],
  'Photographie & Vidéo': [
    { title: 'Type de service', icon: '📸', options: ['Photo', 'Vidéo', 'Les deux'] },
    { title: 'Options', icon: '✨', options: ['Drone', 'Same day edit', 'Album', 'Multi-day coverage'] },
  ],
  'Animation & Ambiance': [
    { title: 'Type de prestation', icon: '🎵', options: ['DJ', 'MC', 'DJ + MC'] },
    { title: 'Équipement', icon: '🔊', options: ['Son inclus', 'Lumière incluse'] },
    { title: 'Type d\'événement', icon: '💒', options: ['Mariage traditionnel', 'Grande réception'] },
  ],
  'Traiteurs & Gastronomie': [
    { title: 'Service', icon: '🍽️', options: ['Buffet', 'Service à table', 'Cocktail'] },
    { title: 'Options alimentaires', icon: '🥗', options: ['Halal', 'Végétarien', 'Dégustation possible'] },
    { title: 'Capacité', icon: '👥', options: ['0–100 invités', '100–200', '200–300', '300+'] },
  ],
  'Beauté': [
    { title: 'Spécialités', icon: '💄', options: ['Maquillage', 'Coiffure', 'Peaux noires / mates', 'Coiffure afro'] },
    { title: 'Options', icon: '🏠', options: ['À domicile', 'Essai disponible'] },
  ],
  'Cérémonies & Coutumes': [
    { title: 'Type', icon: '📋', options: ['Organisation complète', 'Coordination jour J'] },
    { title: 'Format', icon: '💍', options: ['Mariage traditionnel', 'Civil + traditionnel', 'Petit mariage', 'Grand mariage'] },
  ],
  'Coordination & Cérémonie': [
    { title: 'Type', icon: '📋', options: ['Organisation complète', 'Coordination jour J'] },
    { title: 'Format', icon: '💍', options: ['Mariage traditionnel', 'Civil + traditionnel', 'Petit mariage', 'Grand mariage'] },
  ],
  'Décoration & Lieux': [
    { title: 'Type de lieu', icon: '🏰', options: ['Salle de réception', 'Domaine', 'Château', 'Restaurant', 'Rooftop', 'Jardin / extérieur'] },
    { title: 'Capacité', icon: '👥', options: ['0–100', '100–200', '200–300', '300+'] },
    { title: 'Équipements', icon: '🅿️', options: ['Parking', 'Espace extérieur', 'Traiteur externe autorisé', 'Hébergement', 'Piste de danse', 'Cuisine sur place'] },
  ],
};

interface Props {
  categoryName: string;
  filters: ExplorerFilters;
  updateFilter: <K extends keyof ExplorerFilters>(key: K, value: ExplorerFilters[K]) => void;
}

export function ExplorerProfessionFilters({ categoryName, filters, updateFilter }: Props) {
  const sections = PROFESSION_FILTERS[categoryName];
  const [open, setOpen] = useState(true);

  if (!sections) return null;

  const toggleProfFilter = (key: string, value: string) => {
    const current = filters.professionFilters[key] || [];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter('professionFilters', { ...filters.professionFilters, [key]: next });
  };

  const totalActive = Object.values(filters.professionFilters).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 justify-between w-full text-left mb-3 group"
      >
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-champagne/15 text-champagne">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h3 className="text-xs font-semibold tracking-wide uppercase text-champagne-dark">
            Filtres spécifiques
          </h3>
          {totalActive > 0 && (
            <span className="w-5 h-5 rounded-full bg-champagne text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {totalActive}
            </span>
          )}
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
            <div className="space-y-4">
              {sections.map((section, sIdx) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: sIdx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                    <span>{section.icon}</span>
                    {section.title}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {section.options.map(opt => {
                      const active = (filters.professionFilters[section.title] || []).includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleProfFilter(section.title, opt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95 ${
                            active
                              ? 'bg-champagne text-primary-foreground shadow-sm'
                              : 'bg-secondary/80 hover:bg-secondary text-foreground hover:shadow-sm'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

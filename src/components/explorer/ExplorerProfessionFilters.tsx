import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ExplorerFilters } from '@/pages/Explorer';

const PROFESSION_FILTERS: Record<string, { title: string; options: string[] }[]> = {
  // Photography & Video
  'Image & Souvenirs': [
    { title: 'Type de service', options: ['Photo', 'Vidéo', 'Les deux'] },
    { title: 'Options', options: ['Drone', 'Same day edit', 'Album', 'Multi-day coverage'] },
  ],
  'Photographie & Vidéo': [
    { title: 'Type de service', options: ['Photo', 'Vidéo', 'Les deux'] },
    { title: 'Options', options: ['Drone', 'Same day edit', 'Album', 'Multi-day coverage'] },
  ],
  // DJ & Animation
  'Animation & Ambiance': [
    { title: 'Type de prestation', options: ['DJ', 'MC', 'DJ + MC'] },
    { title: 'Équipement', options: ['Son inclus', 'Lumière incluse'] },
    { title: 'Type d\'événement', options: ['Mariage traditionnel', 'Grande réception'] },
  ],
  // Catering
  'Traiteurs & Gastronomie': [
    { title: 'Service', options: ['Buffet', 'Service à table', 'Cocktail'] },
    { title: 'Options alimentaires', options: ['Halal', 'Végétarien', 'Dégustation possible'] },
    { title: 'Capacité', options: ['0–100 invités', '100–200', '200–300', '300+'] },
  ],
  // Beauty
  'Beauté': [
    { title: 'Spécialités', options: ['Maquillage', 'Coiffure', 'Peaux noires / mates', 'Coiffure afro'] },
    { title: 'Options', options: ['À domicile', 'Essai disponible'] },
  ],
  // Coordination
  'Cérémonies & Coutumes': [
    { title: 'Type', options: ['Organisation complète', 'Coordination jour J'] },
    { title: 'Format', options: ['Mariage traditionnel', 'Civil + traditionnel', 'Petit mariage', 'Grand mariage'] },
  ],
  'Coordination & Cérémonie': [
    { title: 'Type', options: ['Organisation complète', 'Coordination jour J'] },
    { title: 'Format', options: ['Mariage traditionnel', 'Civil + traditionnel', 'Petit mariage', 'Grand mariage'] },
  ],
  // Decoration & Venues
  'Décoration & Lieux': [
    { title: 'Type de lieu', options: ['Salle de réception', 'Domaine', 'Château', 'Restaurant', 'Rooftop', 'Jardin / extérieur'] },
    { title: 'Capacité', options: ['0–100', '100–200', '200–300', '300+'] },
    { title: 'Équipements', options: ['Parking', 'Espace extérieur', 'Traiteur externe autorisé', 'Hébergement', 'Piste de danse', 'Cuisine sur place'] },
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

  return (
    <div className="border-b border-border/40 pb-5 mb-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <h3 className="font-serif text-sm font-semibold text-champagne-dark tracking-wide">
          Filtres spécifiques
        </h3>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="space-y-4">
          {sections.map(section => (
            <div key={section.title}>
              <p className="text-xs text-muted-foreground mb-2">{section.title}</p>
              <div className="flex flex-wrap gap-1.5">
                {section.options.map(opt => {
                  const active = (filters.professionFilters[section.title] || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleProfFilter(section.title, opt)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        active
                          ? 'bg-champagne text-primary-foreground shadow-sm'
                          : 'bg-secondary hover:bg-warm-beige text-foreground'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Ordre de priorité des catégories à travers toute la plateforme.
 * Les noms correspondent aux `name` dans la table `categories`.
 * Les catégories non listées ici apparaîtront après, en ordre alphabétique.
 */
export const CATEGORY_PRIORITY_ORDER = [
  'Vidéaste',
  'Photographe',
  'DJ & Musique',
  'Wedding Planner',
  'MC / Animateur',
  'Décoration',
  'Traiteur',
  'Tenues traditionnelles',
  'Beauté',
];

/**
 * Sort an array of categories (or any objects with a `name` field)
 * according to the priority order above.
 */
export function sortByPriority<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const idxA = CATEGORY_PRIORITY_ORDER.indexOf(a.name);
    const idxB = CATEGORY_PRIORITY_ORDER.indexOf(b.name);
    const priorityA = idxA === -1 ? CATEGORY_PRIORITY_ORDER.length : idxA;
    const priorityB = idxB === -1 ? CATEGORY_PRIORITY_ORDER.length : idxB;
    if (priorityA !== priorityB) return priorityA - priorityB;
    return a.name.localeCompare(b.name);
  });
}

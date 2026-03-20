// Profession-specific metadata field definitions for vendor onboarding
// Each category slug maps to a set of fields that appear during onboarding

export type FieldType = 'chips' | 'toggle' | 'select' | 'number';

export interface VendorField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];       // for chips / select
  placeholder?: string;     // for number
  group?: string;           // section grouping
}

export interface CategoryFieldConfig {
  categorySlug: string;
  label: string;
  fields: VendorField[];
}

export const VENDOR_FIELD_CONFIGS: CategoryFieldConfig[] = [
  {
    categorySlug: 'image-souvenirs',
    label: 'Photographie & Vidéo',
    fields: [
      { key: 'service_type', label: 'Type de service', type: 'chips', options: ['Photo', 'Vidéo', 'Photo & Vidéo'], group: 'Services' },
      { key: 'visual_style', label: 'Style visuel', type: 'chips', options: ['Reportage', 'Artistique', 'Lifestyle', 'Cinématique', 'Documentaire'], group: 'Services' },
      { key: 'drone', label: 'Drone disponible', type: 'toggle', group: 'Équipement' },
      { key: 'teaser', label: 'Teaser / aftermovie', type: 'toggle', group: 'Équipement' },
      { key: 'same_day_edit', label: 'Same day edit', type: 'toggle', group: 'Équipement' },
      { key: 'album_included', label: 'Album inclus', type: 'toggle', group: 'Prestations' },
      { key: 'multi_day', label: 'Couverture multi-jours', type: 'toggle', group: 'Prestations' },
    ],
  },
  {
    categorySlug: 'animation-ambiance',
    label: 'DJ & Animation',
    fields: [
      { key: 'role_type', label: 'Rôle', type: 'chips', options: ['DJ', 'MC / Animateur', 'DJ + MC'], group: 'Services' },
      { key: 'music_styles', label: 'Styles musicaux', type: 'chips', options: ['Afrobeats', 'Coupé-décalé', 'Ndombolo', 'Zouk', 'Kompa', 'Rumba', 'Afro house', 'RnB', 'Hip-hop', 'Dancehall', 'Reggae', 'Amapiano', 'Variété française'], group: 'Services' },
      { key: 'sound_included', label: 'Matériel son inclus', type: 'toggle', group: 'Équipement' },
      { key: 'lighting_included', label: 'Éclairage / lumière inclus', type: 'toggle', group: 'Équipement' },
      { key: 'traditional_wedding', label: 'Mariage traditionnel', type: 'toggle', group: 'Expérience' },
      { key: 'large_event', label: 'Grande réception (300+)', type: 'toggle', group: 'Expérience' },
    ],
  },
  {
    categorySlug: 'beaute',
    label: 'Beauté',
    fields: [
      { key: 'beauty_services', label: 'Services', type: 'chips', options: ['Maquillage', 'Coiffure', 'Maquillage & Coiffure'], group: 'Services' },
      { key: 'dark_skin', label: 'Expertise peaux noires / mates', type: 'toggle', group: 'Spécialités' },
      { key: 'afro_hair', label: 'Coiffure afro', type: 'toggle', group: 'Spécialités' },
      { key: 'home_service', label: 'Déplacement à domicile', type: 'toggle', group: 'Prestations' },
      { key: 'trial_available', label: 'Essai disponible', type: 'toggle', group: 'Prestations' },
      { key: 'group_service', label: 'Service groupe (cortège)', type: 'toggle', group: 'Prestations' },
    ],
  },
  {
    categorySlug: 'traiteurs-gastronomie',
    label: 'Traiteurs & Gastronomie',
    fields: [
      { key: 'cuisine_types', label: 'Types de cuisine', type: 'chips', options: ['Africaine', 'Antillaise', 'Française', 'Fusion', 'Internationale', 'Congolaise', 'Camerounaise', 'Sénégalaise', 'Ivoirienne'], group: 'Cuisine' },
      { key: 'service_format', label: 'Format de service', type: 'chips', options: ['Buffet', 'Service à table', 'Cocktail', 'Food truck'], group: 'Services' },
      { key: 'max_guests', label: 'Nombre max d\'invités', type: 'number', placeholder: 'ex: 300', group: 'Capacité' },
      { key: 'halal', label: 'Option halal', type: 'toggle', group: 'Options' },
      { key: 'vegetarian', label: 'Option végétarienne', type: 'toggle', group: 'Options' },
      { key: 'tasting', label: 'Dégustation possible', type: 'toggle', group: 'Options' },
    ],
  },
  {
    categorySlug: 'decoration-lieux',
    label: 'Décoration & Lieux',
    fields: [
      { key: 'deco_style', label: 'Style décoratif', type: 'chips', options: ['Moderne', 'Traditionnel', 'Bohème', 'Champêtre', 'Luxe', 'Afro-chic'], group: 'Style' },
      { key: 'deco_scope', label: 'Périmètre', type: 'chips', options: ['Décoration salle', 'Cérémonie', 'Décoration complète'], group: 'Services' },
      { key: 'flowers_type', label: 'Fleurs', type: 'chips', options: ['Fraîches', 'Artificielles', 'Les deux'], group: 'Services' },
      { key: 'setup_included', label: 'Installation incluse', type: 'toggle', group: 'Prestations' },
      { key: 'teardown_included', label: 'Désinstallation incluse', type: 'toggle', group: 'Prestations' },
    ],
  },
  {
    categorySlug: 'mode-tenues',
    label: 'Mode & Tenues',
    fields: [
      { key: 'tenue_type', label: 'Type de tenue', type: 'chips', options: ['Robe de mariée', 'Costume', 'Tenue traditionnelle', 'Accessoires', 'Sur mesure'], group: 'Services' },
      { key: 'style', label: 'Style', type: 'chips', options: ['Moderne', 'Traditionnel', 'Afro-contemporain', 'Classique', 'Bohème'], group: 'Style' },
      { key: 'custom_made', label: 'Création sur mesure', type: 'toggle', group: 'Options' },
      { key: 'fitting', label: 'Essayage possible', type: 'toggle', group: 'Options' },
    ],
  },
  {
    categorySlug: 'ceremonies-coutumes',
    label: 'Coordination & Cérémonie',
    fields: [
      { key: 'coordination_type', label: 'Type', type: 'chips', options: ['Organisation complète', 'Coordination jour J', 'Cérémonie traditionnelle (dot)'], group: 'Services' },
      { key: 'wedding_format', label: 'Format', type: 'chips', options: ['Civil + traditionnel', 'Religieux', 'Mariage laïque', 'Cérémonie mixte'], group: 'Services' },
      { key: 'small_wedding', label: 'Petit mariage (< 100)', type: 'toggle', group: 'Expérience' },
      { key: 'large_wedding', label: 'Grand mariage (300+)', type: 'toggle', group: 'Expérience' },
    ],
  },
  {
    categorySlug: 'bijoux-accessoires',
    label: 'Bijoux & Accessoires',
    fields: [
      { key: 'product_type', label: 'Type', type: 'chips', options: ['Bijoux mariée', 'Bijoux marié', 'Accessoires cheveux', 'Couronnes', 'Bijoux traditionnels'], group: 'Produits' },
      { key: 'material', label: 'Matériaux', type: 'chips', options: ['Or', 'Argent', 'Perles', 'Cristaux', 'Mixte'], group: 'Produits' },
      { key: 'custom_made', label: 'Création sur mesure', type: 'toggle', group: 'Options' },
    ],
  },
  {
    categorySlug: 'logistique-services',
    label: 'Logistique & Services',
    fields: [
      { key: 'service_type', label: 'Type de service', type: 'chips', options: ['Transport VTC', 'Location de voiture', 'Faire-part', 'Gâteau', 'Cadeaux invités', 'Location de mobilier'], group: 'Services' },
    ],
  },
];

export function getFieldConfigForCategory(categorySlug: string | null | undefined): CategoryFieldConfig | null {
  if (!categorySlug) return null;
  return VENDOR_FIELD_CONFIGS.find(c => c.categorySlug === categorySlug) ?? null;
}

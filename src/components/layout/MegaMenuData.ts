import {
  Camera, Music, Scissors, Sparkles, Utensils,
  Palette, Church, Car, Gem, Plane
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface MegaMenuSubItem {
  label: string;
  slug: string;
}

export interface MegaMenuCategory {
  emoji: string;
  label: string;
  slug: string;
  icon: LucideIcon;
  subs: MegaMenuSubItem[];
}

export const megaMenuCategories: MegaMenuCategory[] = [
  {
    emoji: "📸", label: "Image & Souvenirs", slug: "image-souvenirs", icon: Camera,
    subs: [
      { label: "Photographe", slug: "photographe" },
      { label: "Vidéaste", slug: "videaste" },
      { label: "Drone", slug: "drone" },
      { label: "Same Day Edit", slug: "same-day-edit" },
      { label: "Créateur de Reels", slug: "createur-reels" },
      { label: "Content Creator", slug: "content-creator" },
      { label: "Livre d'or vidéo", slug: "livre-or-video" },
      { label: "Photobooth", slug: "photobooth" },
      { label: "Photobooth 360°", slug: "photobooth-360" },
      { label: "Live streaming", slug: "live-streaming" },
    ],
  },
  {
    emoji: "🎶", label: "Animation & Ambiance", slug: "animation-ambiance", icon: Music,
    subs: [
      { label: "DJ mariage", slug: "dj-mariage" },
      { label: "DJ afro par pays", slug: "dj-afro" },
      { label: "MC / Animateur", slug: "mc-animateur" },
      { label: "MC traditionnel", slug: "mc-traditionnel" },
      { label: "Groupe live / Orchestre", slug: "groupe-live" },
      { label: "Chorale gospel", slug: "chorale-gospel" },
      { label: "Chorale traditionnelle", slug: "chorale-traditionnelle" },
      { label: "Percussionnistes", slug: "percussionnistes" },
      { label: "Groupe folklorique", slug: "groupe-folklorique" },
      { label: "Griots", slug: "griots" },
    ],
  },
  {
    emoji: "👗", label: "Mode & Tenues", slug: "mode-tenues", icon: Scissors,
    subs: [
      { label: "Robes de mariée", slug: "robes-mariee" },
      { label: "Tenues traditionnelles", slug: "tenues-traditionnelles" },
      { label: "Styliste sur mesure", slug: "styliste" },
      { label: "Location tenues", slug: "location-tenues" },
      { label: "Vendeur pagnes", slug: "vendeur-pagnes" },
    ],
  },
  {
    emoji: "💄", label: "Beauté", slug: "beaute", icon: Sparkles,
    subs: [
      { label: "Maquilleuse afro", slug: "maquilleuse-afro" },
      { label: "Coiffeuse afro", slug: "coiffeuse-afro" },
      { label: "Barbier mariage", slug: "barbier" },
      { label: "Esthéticienne", slug: "estheticienne" },
      { label: "Prothésiste ongulaire", slug: "prothesiste-ongulaire" },
    ],
  },
  {
    emoji: "🍽️", label: "Traiteurs & Gastronomie", slug: "traiteurs-gastronomie", icon: Utensils,
    subs: [
      { label: "Traiteur africain", slug: "traiteur-africain" },
      { label: "Traiteur afro-fusion", slug: "traiteur-afro-fusion" },
      { label: "Wedding cake", slug: "wedding-cake" },
      { label: "Chef privé afro", slug: "chef-prive-afro" },
      { label: "Bar à cocktails afro", slug: "bar-cocktails-afro" },
      { label: "Bar à jus africains", slug: "bar-jus-africains" },
      { label: "Stand street-food", slug: "stand-street-food" },
    ],
  },
  {
    emoji: "🌸", label: "Décoration & Lieux", slug: "decoration-lieux", icon: Palette,
    subs: [
      { label: "Décorateur", slug: "decorateur" },
      { label: "Fleuriste", slug: "fleuriste" },
      { label: "Location mobilier", slug: "location-mobilier" },
      { label: "Location vaisselle", slug: "location-vaisselle" },
      { label: "Salle de réception", slug: "salle-reception" },
      { label: "Domaine & Château", slug: "domaine-chateau" },
      { label: "Lumière & son", slug: "lumiere-son" },
    ],
  },
  {
    emoji: "⛪", label: "Cérémonies & Coutumes", slug: "ceremonies-coutumes", icon: Church,
    subs: [
      { label: "Wedding Planner", slug: "wedding-planner" },
      { label: "Coordinateur Jour J", slug: "coordinateur-jour-j" },
      { label: "Maître de cérémonie", slug: "maitre-ceremonie" },
      { label: "Conseiller coutumier", slug: "conseiller-coutumier" },
      { label: "Pasteur", slug: "pasteur" },
      { label: "Prêtre", slug: "pretre" },
      { label: "Imam", slug: "imam" },
      { label: "Officiant laïque", slug: "officiant-laique" },
    ],
  },
  {
    emoji: "✈️", label: "Logistique & Services", slug: "logistique-services", icon: Car,
    subs: [
      { label: "Transport mariage", slug: "transport-mariage" },
      { label: "Hébergement invités", slug: "hebergement-invites" },
      { label: "Agence voyage mariage", slug: "agence-voyage-mariage" },
      { label: "Conciergerie mariage", slug: "conciergerie-mariage" },
      { label: "Sécurité événementielle", slug: "securite-evenementielle" },
      { label: "Hôtesses d'accueil", slug: "hotesses-accueil" },
      { label: "Garde d'enfants", slug: "garde-enfants" },
      { label: "Animations enfants", slug: "animations-enfants" },
    ],
  },
  {
    emoji: "💍", label: "Bijoux & Accessoires", slug: "bijoux-accessoires", icon: Gem,
    subs: [
      { label: "Bijoutier mariage", slug: "bijoutier" },
      { label: "Alliances sur mesure", slug: "alliances" },
      { label: "Bijoux traditionnels", slug: "bijoux-traditionnels" },
      { label: "Accessoires cheveux", slug: "accessoires-cheveux" },
      { label: "Chaussures mariage", slug: "chaussures" },
      { label: "Parfums personnalisés", slug: "parfums" },
    ],
  },
];

// Flat list for backwards compatibility (Header featuredCategories, etc.)
export const mainCategories = megaMenuCategories.map(c => ({
  label: `${c.emoji} ${c.label}`,
  icon: c.icon,
  href: `/categories/${c.slug}`,
}));

import {
  Camera, Music, Scissors, Sparkles, Utensils,
  Palette, Church, Car, Gem, Plane,
  Video, Aperture, Radio, Tv, BookOpen, MonitorPlay, ScanLine, Airplay,
  Mic, Drum, Users, HandMetal, Speech,
  Shirt, Crown, Wand2, Store, Layers,
  Brush, UserCheck,
  CakeSlice, ChefHat, Wine, GlassWater, Candy, IceCreamCone,
  Flower2, Lamp, Armchair, GlassesIcon, Building2, Castle, Speaker,
  Heart, Star, BookHeart, Cross,
  Bus, Hotel, Globe, Headphones, Shield, SmilePlus, Baby, PartyPopper,
  Diamond, CircleDot, Beaker, Footprints, SprayCan
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface MegaMenuSubItem {
  label: string;
  slug: string;
  icon?: LucideIcon;
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
      { label: "Photographe", slug: "photographe", icon: Camera },
      { label: "Vidéaste", slug: "videaste", icon: Video },
      { label: "Drone", slug: "drone", icon: Airplay },
      { label: "Same Day Edit", slug: "same-day-edit", icon: MonitorPlay },
      { label: "Créateur de Reels", slug: "createur-reels", icon: Tv },
      { label: "Content Creator", slug: "content-creator", icon: Radio },
      { label: "Livre d'or vidéo", slug: "livre-or-video", icon: BookOpen },
      { label: "Photobooth", slug: "photobooth", icon: Aperture },
      { label: "Photobooth 360°", slug: "photobooth-360", icon: ScanLine },
      { label: "Live streaming", slug: "live-streaming", icon: Airplay },
    ],
  },
  {
    emoji: "🎶", label: "Animation & Ambiance", slug: "animation-ambiance", icon: Music,
    subs: [
      { label: "DJ mariage", slug: "dj-mariage", icon: Music },
      { label: "DJ afro par pays", slug: "dj-afro", icon: Globe },
      { label: "MC / Animateur", slug: "mc-animateur", icon: Mic },
      { label: "MC traditionnel", slug: "mc-traditionnel", icon: Mic },
      { label: "Groupe live / Orchestre", slug: "groupe-live", icon: Users },
      { label: "Chorale gospel", slug: "chorale-gospel", icon: Heart },
      { label: "Chorale traditionnelle", slug: "chorale-traditionnelle", icon: Heart },
      { label: "Percussionnistes", slug: "percussionnistes", icon: Drum },
      { label: "Groupe folklorique", slug: "groupe-folklorique", icon: HandMetal },
      { label: "Griots", slug: "griots", icon: Star },
    ],
  },
  {
    emoji: "👗", label: "Mode & Tenues", slug: "mode-tenues", icon: Scissors,
    subs: [
      { label: "Robes de mariée", slug: "robes-mariee", icon: Shirt },
      { label: "Tenues traditionnelles", slug: "tenues-traditionnelles", icon: Crown },
      { label: "Styliste sur mesure", slug: "styliste", icon: Scissors },
      { label: "Location tenues", slug: "location-tenues", icon: Store },
      { label: "Vendeur pagnes", slug: "vendeur-pagnes", icon: Layers },
    ],
  },
  {
    emoji: "💄", label: "Beauté", slug: "beaute", icon: Sparkles,
    subs: [
      { label: "Maquilleuse afro", slug: "maquilleuse-afro", icon: Brush },
      { label: "Coiffeuse afro", slug: "coiffeuse-afro", icon: Scissors },
      { label: "Barbier mariage", slug: "barbier", icon: Scissors },
      { label: "Esthéticienne", slug: "estheticienne", icon: Sparkles },
      { label: "Prothésiste ongulaire", slug: "prothesiste-ongulaire", icon: Wand2 },
    ],
  },
  {
    emoji: "🍽️", label: "Traiteurs & Gastronomie", slug: "traiteurs-gastronomie", icon: Utensils,
    subs: [
      { label: "Traiteur africain", slug: "traiteur-africain", icon: Utensils },
      { label: "Traiteur afro-fusion", slug: "traiteur-afro-fusion", icon: ChefHat },
      { label: "Wedding cake", slug: "wedding-cake", icon: CakeSlice },
      { label: "Chef privé afro", slug: "chef-prive-afro", icon: ChefHat },
      { label: "Bar à cocktails afro", slug: "bar-cocktails-afro", icon: Wine },
      { label: "Bar à jus africains", slug: "bar-jus-africains", icon: GlassWater },
      { label: "Stand street-food", slug: "stand-street-food", icon: Candy },
    ],
  },
  {
    emoji: "🌸", label: "Décoration & Lieux", slug: "decoration-lieux", icon: Palette,
    subs: [
      { label: "Décorateur", slug: "decorateur", icon: Palette },
      { label: "Fleuriste", slug: "fleuriste", icon: Flower2 },
      { label: "Location mobilier", slug: "location-mobilier", icon: Armchair },
      { label: "Location vaisselle", slug: "location-vaisselle", icon: GlassWater },
      { label: "Salle de réception", slug: "salle-reception", icon: Building2 },
      { label: "Domaine & Château", slug: "domaine-chateau", icon: Castle },
      { label: "Lumière & son", slug: "lumiere-son", icon: Speaker },
    ],
  },
  {
    emoji: "⛪", label: "Cérémonies & Coutumes", slug: "ceremonies-coutumes", icon: Church,
    subs: [
      { label: "Wedding Planner", slug: "wedding-planner", icon: BookHeart },
      { label: "Coordinateur Jour J", slug: "coordinateur-jour-j", icon: UserCheck },
      { label: "Maître de cérémonie", slug: "maitre-ceremonie", icon: Mic },
      { label: "Conseiller coutumier", slug: "conseiller-coutumier", icon: Star },
      { label: "Pasteur", slug: "pasteur", icon: Cross },
      { label: "Prêtre", slug: "pretre", icon: Cross },
      { label: "Imam", slug: "imam", icon: Heart },
      { label: "Officiant laïque", slug: "officiant-laique", icon: Heart },
    ],
  },
  {
    emoji: "✈️", label: "Logistique & Services", slug: "logistique-services", icon: Car,
    subs: [
      { label: "Transport mariage", slug: "transport-mariage", icon: Bus },
      { label: "Hébergement invités", slug: "hebergement-invites", icon: Hotel },
      { label: "Agence voyage mariage", slug: "agence-voyage-mariage", icon: Globe },
      { label: "Conciergerie mariage", slug: "conciergerie-mariage", icon: Headphones },
      { label: "Sécurité événementielle", slug: "securite-evenementielle", icon: Shield },
      { label: "Hôtesses d'accueil", slug: "hotesses-accueil", icon: SmilePlus },
      { label: "Garde d'enfants", slug: "garde-enfants", icon: Baby },
      { label: "Animations enfants", slug: "animations-enfants", icon: PartyPopper },
    ],
  },
  {
    emoji: "💍", label: "Bijoux & Accessoires", slug: "bijoux-accessoires", icon: Gem,
    subs: [
      { label: "Bijoutier mariage", slug: "bijoutier", icon: Diamond },
      { label: "Alliances sur mesure", slug: "alliances", icon: CircleDot },
      { label: "Bijoux traditionnels", slug: "bijoux-traditionnels", icon: Gem },
      { label: "Accessoires cheveux", slug: "accessoires-cheveux", icon: Crown },
      { label: "Chaussures mariage", slug: "chaussures", icon: Footprints },
      { label: "Parfums personnalisés", slug: "parfums", icon: SprayCan },
    ],
  },
];

// Flat list for backwards compatibility (Header featuredCategories, etc.)
export const mainCategories = megaMenuCategories.map(c => ({
  label: `${c.emoji} ${c.label}`,
  icon: c.icon,
  href: `/explorer?cat=${c.slug}`,
}));

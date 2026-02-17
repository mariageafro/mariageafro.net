import {
  Camera, Video, Music, Utensils, MapPin, Layout,
  Palette, Gift, PartyPopper, Scissors, Crown, Plane,
  FileText, Car, Mic2, Church, Sparkles, Gem,
  ChefHat, Flower2, Users, HeartHandshake
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface MegaMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
}

export const mainCategories: MegaMenuItem[] = [
  { label: "📸 Image & Souvenirs", icon: Camera, href: "/categories/image-souvenirs" },
  { label: "🎶 Animation & Ambiance", icon: Music, href: "/categories/animation-ambiance" },
  { label: "👗 Mode & Beauté", icon: Scissors, href: "/categories/mode-beaute" },
  { label: "🍽️ Traiteurs & Gastronomie", icon: Utensils, href: "/categories/traiteurs-gastronomie" },
  { label: "🌸 Décoration & Lieux", icon: Palette, href: "/categories/decoration-lieux" },
  { label: "⛪ Cérémonies & Coutumes", icon: Church, href: "/categories/ceremonies-coutumes" },
  { label: "✈️ Logistique & Services", icon: Car, href: "/categories/logistique-services" },
  { label: "💍 Bijoux & Accessoires", icon: Gem, href: "/categories/bijoux-accessoires" },
];

export const otherCategories: { label: string; href: string; highlight?: boolean }[] = [
  { label: "Photographe", href: "/categories/image-souvenirs" },
  { label: "Vidéaste", href: "/categories/image-souvenirs" },
  { label: "DJ mariage", href: "/categories/animation-ambiance" },
  { label: "Wedding Planner", href: "/categories/ceremonies-coutumes" },
  { label: "Traiteur africain", href: "/categories/traiteurs-gastronomie" },
  { label: "Coiffeuse & Maquilleuse afro", href: "/categories/mode-beaute" },
  { label: "Décorateur", href: "/categories/decoration-lieux" },
  { label: "Salle & Domaine", href: "/categories/decoration-lieux" },
  { label: "Destination Weddings", href: "/categories/logistique-services", highlight: true },
];

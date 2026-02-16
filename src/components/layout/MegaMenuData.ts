import {
  MapPin, Utensils, Music, Camera, Sparkles, Layout,
  Video, Car, Bus, Palette, FileText, Gift,
  Mic2, Church, PartyPopper, Scissors, Crown, Plane
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface MegaMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
}

export const mainCategories: MegaMenuItem[] = [
  { label: "Photo mariage", icon: Camera, href: "/categories/photographe" },
  { label: "Vidéo mariage", icon: Video, href: "/categories/videaste" },
  { label: "Musique mariage", icon: Music, href: "/categories/dj-musique" },
  { label: "Traiteur mariage", icon: Utensils, href: "/categories/traiteur" },
  { label: "Voiture mariage", icon: Car, href: "/categories/transport" },
  { label: "Bus mariage", icon: Bus, href: "/categories/transport" },
  { label: "Salle & Lieu", icon: MapPin, href: "/categories/salle-lieu" },
  { label: "Décoration mariage", icon: Palette, href: "/categories/decoration" },
  { label: "Faire-part mariage", icon: FileText, href: "/prestataires" },
  { label: "Cadeaux invités", icon: Gift, href: "/prestataires" },
  { label: "Animation mariage", icon: PartyPopper, href: "/categories/animation" },
  { label: "Wedding Planner", icon: Layout, href: "/categories/wedding-planner" },
];

export const otherCategories: { label: string; href: string; highlight?: boolean }[] = [
  { label: "Tenues & Couture", href: "/categories/tenues-couture" },
  { label: "Coiffure & Beauté", href: "/categories/coiffure-beaute" },
  { label: "Wedding Cake", href: "/categories/traiteur" },
  { label: "Officiants", href: "/prestataires" },
  { label: "Food Truck", href: "/prestataires" },
  { label: "Vin et Spiritueux", href: "/prestataires" },
  { label: "Chorale Gospel", href: "/categories/dj-musique" },
  { label: "Henné / Art corporel", href: "/categories/coiffure-beaute" },
  { label: "Destination Weddings", href: "/categories/salle-lieu", highlight: true },
];

import { MapPin, Utensils, Music, Camera, Sparkles, Layout } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface MegaMenuItem {
  label: string;
  href: string;
  highlight?: boolean;
  info?: string;
}

export interface MegaMenuCategory {
  title: string;
  icon: LucideIcon;
  items: MegaMenuItem[];
}

export const megaMenuCategories: MegaMenuCategory[] = [
  {
    title: "Lieux de mariage",
    icon: MapPin,
    items: [
      { label: "Domaine mariage", href: "/categories/salle-lieu" },
      { label: "Hôtel mariage", href: "/categories/salle-lieu" },
      { label: "Salle mariage (300+)", href: "/categories/salle-lieu" },
      { label: "Mariages à la plage", href: "/categories/salle-lieu" },
      { label: "Château mariage", href: "/categories/salle-lieu" },
      { label: "Destination Weddings", href: "/categories/salle-lieu", highlight: true },
    ],
  },
  {
    title: "Traiteur & Gastronomie",
    icon: Utensils,
    items: [
      { label: "Traiteur Afro-fusion", href: "/categories/traiteur" },
      { label: "Buffet traditionnel", href: "/categories/traiteur" },
      { label: "Wedding cake", href: "/categories/traiteur" },
      { label: "Food Truck", href: "/categories/traiteur" },
      { label: "Vin et Spiritueux", href: "/categories/traiteur" },
    ],
  },
  {
    title: "Musique & Show",
    icon: Music,
    items: [
      { label: "DJ Afro / Musique Live", href: "/categories/dj-musique" },
      { label: "Chorale Gospel", href: "/categories/dj-musique" },
      { label: "Orchestre Rumba / Kompa", href: "/categories/dj-musique" },
      { label: "Animation mariage", href: "/categories/animation" },
      { label: "Maître de Cérémonie / Griot", href: "/categories/animation" },
    ],
  },
  {
    title: "Image & Tech",
    icon: Camera,
    items: [
      { label: "Photo mariage", href: "/categories/photographe" },
      { label: "Vidéo mariage / 4K", href: "/categories/videaste" },
      { label: "Livre d'or Vidéo/Audio", href: "/categories/videaste", highlight: true },
      { label: "Drone & Prises aériennes", href: "/categories/videaste" },
      { label: "Content Creator TikTok/Reels", href: "/categories/videaste" },
    ],
  },
  {
    title: "Mode & Beauté",
    icon: Sparkles,
    items: [
      { label: "MUA Peaux Noires", href: "/categories/coiffure-beaute" },
      { label: "Coiffure Afro / Nappy", href: "/categories/coiffure-beaute" },
      { label: "Attacheur de Gele / Foulard", href: "/categories/coiffure-beaute" },
      { label: "Barbier & Soins Homme", href: "/categories/coiffure-beaute" },
      { label: "Henné / Art corporel", href: "/categories/coiffure-beaute" },
    ],
  },
  {
    title: "Logistique & Orga",
    icon: Layout,
    items: [
      { label: "Organisation mariage", href: "/categories/wedding-planner" },
      { label: "Bus / Transports", href: "/categories/transport" },
      { label: "Voiture de luxe", href: "/categories/transport" },
      { label: "Décoration / Trônes", href: "/categories/decoration" },
      { label: "Faire-part & Papeterie", href: "/prestataires" },
      { label: "Dot Manager", href: "/categories/wedding-planner", highlight: true },
    ],
  },
];

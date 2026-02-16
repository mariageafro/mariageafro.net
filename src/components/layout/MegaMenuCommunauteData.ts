import type { SimpleMenuItem } from "./MegaMenuMarieeData";
import {
  LayoutGrid, Palette, Shirt, CalendarDays, Heart,
  Church, Utensils, Gift, Plane, Users,
  Crown, Dice5, HelpCircle, Gamepad2,
  FileText, Image, Video, UserCircle
} from "lucide-react";

export const communauteThemes: SimpleMenuItem[] = [
  { label: "Organisation du mariage", href: "/blog", icon: LayoutGrid },
  { label: "Décoration", href: "/blog", icon: Palette },
  { label: "Mode nuptiale", href: "/blog", icon: Shirt },
  { label: "Avant le mariage", href: "/blog", icon: CalendarDays },
  { label: "Beauté", href: "/blog", icon: Heart },
  { label: "Cérémonie de mariage", href: "/blog", icon: Church },
  { label: "Banquets", href: "/blog", icon: Utensils },
  { label: "Après le mariage", href: "/blog", icon: Gift },
  { label: "Lune de miel", href: "/blog", icon: Plane },
  { label: "Vivre ensemble", href: "/blog", icon: Users },
  { label: "Mariages célèbres", href: "/blog", icon: Crown },
  { label: "Tirage au sort", href: "/blog", icon: Dice5 },
  { label: "Aide technique", href: "/blog", icon: HelpCircle },
  { label: "Jeux et tests", href: "/blog", icon: Gamepad2 },
];

export const communauteNewItems: SimpleMenuItem[] = [
  { label: "Posts", href: "/blog", icon: FileText },
  { label: "Photos", href: "/blog", icon: Image },
  { label: "Vidéos", href: "/blog", icon: Video },
  { label: "Membres", href: "/blog", icon: UserCircle },
];

import type { SimpleMenuItem } from "./MegaMenuMarieeData";
import {
  LayoutGrid, Palette, Shirt, CalendarDays, Heart,
  Church, Utensils, Gift, Plane, Users,
  Crown, Dice5, HelpCircle, Gamepad2,
  FileText, Image, Video, UserCircle
} from "lucide-react";

export const communauteThemes: SimpleMenuItem[] = [
  { label: "Organisation du mariage", href: "/categories/ceremonies-coutumes?sub=wedding-planner", icon: LayoutGrid },
  { label: "Décoration", href: "/categories/decoration-lieux?sub=decorateur", icon: Palette },
  { label: "Mode nuptiale", href: "/categories/mode-tenues", icon: Shirt },
  { label: "Photographes", href: "/categories/image-souvenirs?sub=photographe", icon: CalendarDays },
  { label: "Beauté", href: "/categories/beaute", icon: Heart },
  { label: "Cérémonie de mariage", href: "/categories/ceremonies-coutumes", icon: Church },
  { label: "Traiteurs", href: "/categories/traiteurs-gastronomie", icon: Utensils },
  { label: "Animation & DJ", href: "/categories/animation-ambiance", icon: Gift },
  { label: "Voyage & Lune de miel", href: "/categories/logistique-services?sub=agence-voyage-mariage", icon: Plane },
  { label: "Bijoux & Accessoires", href: "/categories/bijoux-accessoires", icon: Users },
  { label: "Prestataires Premium", href: "/prestataires-premium", icon: Crown },
  { label: "Vidéastes", href: "/categories/image-souvenirs?sub=videaste", icon: Dice5 },
  { label: "Aide & Contact", href: "/contact", icon: HelpCircle },
  { label: "Blog & Inspiration", href: "/blog", icon: Gamepad2 },
];

export const communauteNewItems: SimpleMenuItem[] = [
  { label: "Nouveaux prestataires", href: "/prestataires", icon: FileText },
  { label: "Galeries photos", href: "/categories/image-souvenirs", icon: Image },
  { label: "Vidéos", href: "/categories/image-souvenirs?sub=videaste", icon: Video },
  { label: "Tous les prestataires", href: "/prestataires", icon: UserCircle },
];

import type { SimpleMenuItem } from "./MegaMenuMarieeData";
import {
  CalendarDays, Church, PartyPopper, Users, Shirt,
  Heart, Plane, Gift, Paintbrush, Camera
} from "lucide-react";

export const ideesItems: SimpleMenuItem[] = [
  { label: "Avant le mariage", href: "/blog", icon: CalendarDays },
  { label: "La cérémonie de mariage", href: "/blog", icon: Church },
  { label: "La réception", href: "/blog", icon: PartyPopper },
  { label: "Les prestataires de mariage", href: "/prestataires", icon: Users },
  { label: "Mode nuptiale", href: "/categories/tenues-couture", icon: Shirt },
  { label: "Beauté et Santé", href: "/categories/coiffure-beaute", icon: Heart },
  { label: "Lune de miel", href: "/blog", icon: Plane },
  { label: "Après le mariage", href: "/blog", icon: Gift },
  { label: "Fait Maison", href: "/blog", icon: Paintbrush },
  { label: "Instants de mariage", href: "/blog", icon: Camera },
];

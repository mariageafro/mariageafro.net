import type { SimpleMenuItem } from "./MegaMenuMarieeData";
import {
  CalendarDays, Church, PartyPopper, Users, Shirt,
  Heart, Plane, Gift, Paintbrush, Camera
} from "lucide-react";

export const ideesItems: SimpleMenuItem[] = [
  { label: "Photographes", href: "/categories/image-souvenirs?sub=photographe", icon: Camera },
  { label: "Vidéastes", href: "/categories/image-souvenirs?sub=videaste", icon: Camera },
  { label: "La cérémonie", href: "/categories/ceremonies-coutumes", icon: Church },
  { label: "La réception", href: "/categories/decoration-lieux", icon: PartyPopper },
  { label: "Tous les prestataires", href: "/prestataires", icon: Users },
  { label: "Mode nuptiale", href: "/categories/mode-tenues", icon: Shirt },
  { label: "Beauté & Soins", href: "/categories/beaute", icon: Heart },
  { label: "Voyage & Lune de miel", href: "/categories/logistique-services?sub=agence-voyage-mariage", icon: Plane },
  { label: "Animation & DJ", href: "/categories/animation-ambiance", icon: PartyPopper },
  { label: "Traiteurs & Gastronomie", href: "/categories/traiteurs-gastronomie", icon: Gift },
];

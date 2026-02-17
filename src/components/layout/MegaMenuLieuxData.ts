import type { SimpleMenuItem, PromoCard } from "./MegaMenuMarieeData";
import { MapPin, Building2, TreePine, Warehouse, Church, Hotel, Ship, Tent, Castle, Wine } from "lucide-react";

export const lieuxItems: SimpleMenuItem[] = [
  { label: "Salle de réception", href: "/categories/decoration-lieux?sub=salle-reception", icon: Building2 },
  { label: "Domaine & Château", href: "/categories/decoration-lieux?sub=domaine-chateau", icon: Castle },
  { label: "Décorateur", href: "/categories/decoration-lieux?sub=decorateur", icon: Building2 },
  { label: "Fleuriste", href: "/categories/decoration-lieux?sub=fleuriste", icon: TreePine },
  { label: "Location mobilier", href: "/categories/decoration-lieux?sub=location-mobilier", icon: Warehouse },
  { label: "Location vaisselle", href: "/categories/decoration-lieux?sub=location-vaisselle", icon: Wine },
  { label: "Lumière & Son", href: "/categories/decoration-lieux?sub=lumiere-sonorisation", icon: Hotel },
  { label: "Destination Wedding", href: "/categories/logistique-services?sub=agence-voyage-mariage", icon: MapPin },
  { label: "Tous les lieux & déco", href: "/categories/decoration-lieux", icon: Ship },
];

export const lieuxPromo: PromoCard = {
  title: "Trouvez le lieu idéal",
  description: "Parcourez les plus beaux lieux de réception pour votre mariage afro.",
  href: "/categories/decoration-lieux",
};

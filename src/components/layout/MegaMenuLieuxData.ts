import type { SimpleMenuItem, PromoCard } from "./MegaMenuMarieeData";
import { MapPin, Building2, TreePine, Warehouse, Church, Hotel, Ship, Tent, Castle, Wine } from "lucide-react";

export const lieuxItems: SimpleMenuItem[] = [
  { label: "Salle de réception", href: "/categories/salle-lieu", icon: Building2 },
  { label: "Domaine & Château", href: "/categories/salle-lieu", icon: Castle },
  { label: "Hôtel mariage", href: "/categories/salle-lieu", icon: Hotel },
  { label: "Lieu en plein air", href: "/categories/salle-lieu", icon: TreePine },
  { label: "Église & Lieu de culte", href: "/categories/salle-lieu", icon: Church },
  { label: "Salle des fêtes", href: "/categories/salle-lieu", icon: Warehouse },
  { label: "Restaurant mariage", href: "/categories/salle-lieu", icon: Wine },
  { label: "Bateau & Péniche", href: "/categories/salle-lieu", icon: Ship },
  { label: "Tente & Chapiteau", href: "/categories/salle-lieu", icon: Tent },
  { label: "Destination Wedding", href: "/categories/salle-lieu", icon: MapPin },
];

export const lieuxPromo: PromoCard = {
  title: "Trouvez le lieu idéal",
  description: "Parcourez les plus beaux lieux de réception pour votre mariage afro.",
  href: "/categories/salle-lieu",
};

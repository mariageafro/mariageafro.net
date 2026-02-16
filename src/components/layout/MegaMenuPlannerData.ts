import {
  CheckSquare, Wallet, Globe, Users,
  Heart, Gift, LayoutGrid, Shirt
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface PlannerMenuItem {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export const plannerItems: PlannerMenuItem[] = [
  { label: "Tâches", description: "Checklist de mariage", icon: CheckSquare, href: "/outils-maries" },
  { label: "Budget", description: "Gestionnaire de frais", icon: Wallet, href: "/outils-maries" },
  { label: "Site de mariage", description: "Templates & édition", icon: Globe, href: "/mon-mariage" },
  { label: "Invités", description: "RSVP & liste", icon: Users, href: "/mon-mariage/rsvp" },
  { label: "Prestataires", description: "Mes favoris", icon: Heart, href: "/prestataires" },
  { label: "Tirage au sort", description: "Gagnez 4 000 €", icon: Gift, href: "/blog" },
  { label: "Tables", description: "Plan de salle", icon: LayoutGrid, href: "/mon-mariage/plan-de-table" },
  { label: "Robes", description: "Catalogues mode", icon: Shirt, href: "/categories/tenues-couture" },
];

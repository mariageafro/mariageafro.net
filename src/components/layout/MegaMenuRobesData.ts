import type { SimpleMenuItem } from "./MegaMenuMarieeData";
import { Shirt, Crown, PartyPopper } from "lucide-react";

export const robesCategories: SimpleMenuItem[] = [
  { label: "Mariée", href: "/categories/tenues-couture", icon: Crown },
  { label: "Marié", href: "/categories/tenues-couture", icon: Shirt },
  { label: "Soirée", href: "/categories/tenues-couture", icon: PartyPopper },
];

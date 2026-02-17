import type { SimpleMenuItem } from "./MegaMenuMarieeData";
import { Shirt, Crown, PartyPopper, Scissors, Tag } from "lucide-react";

export const robesCategories: SimpleMenuItem[] = [
  { label: "Robes de mariée", href: "/categories/mode-tenues?sub=robes-mariee", icon: Crown },
  { label: "Tenues traditionnelles", href: "/categories/mode-tenues?sub=tenues-traditionnelles", icon: Shirt },
  { label: "Styliste sur mesure", href: "/categories/mode-tenues?sub=styliste", icon: Scissors },
  { label: "Location tenues", href: "/categories/mode-tenues?sub=location-tenues", icon: PartyPopper },
  { label: "Vendeur pagnes", href: "/categories/mode-tenues?sub=vendeur-pagnes", icon: Shirt },
  { label: "Toutes les tenues", href: "/categories/mode-tenues", icon: Tag },
];

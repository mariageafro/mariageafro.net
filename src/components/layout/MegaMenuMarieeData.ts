import type { LucideIcon } from "lucide-react";
import { Shirt, Gem, Sparkles, Scissors, PartyPopper, Tag } from "lucide-react";

export interface SimpleMenuItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export interface PromoCard {
  title: string;
  description: string;
  href: string;
}

export const marieeItems: SimpleMenuItem[] = [
  { label: "Robe de mariée", href: "/categories/tenues-couture", icon: Shirt },
  { label: "Accessoires mariage", href: "/categories/tenues-couture", icon: Sparkles },
  { label: "Bijoux mariage", href: "/categories/tenues-couture", icon: Gem },
  { label: "Esthétique coiffure mariage", href: "/categories/coiffure-beaute", icon: Scissors },
  { label: "Robe de cocktail", href: "/categories/tenues-couture", icon: PartyPopper },
  { label: "Promotions", href: "/prestataires", icon: Tag },
];

export const marieePromo: PromoCard = {
  title: "Catalogue de robes",
  description: "Choisissez la vôtre et trouvez la boutique la plus proche.",
  href: "/categories/tenues-couture",
};

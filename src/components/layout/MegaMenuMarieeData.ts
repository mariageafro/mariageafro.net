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
  { label: "Robe de mariée", href: "/categories/mode-tenues?sub=robes-mariee", icon: Shirt },
  { label: "Tenues traditionnelles", href: "/categories/mode-tenues?sub=tenues-traditionnelles", icon: Shirt },
  { label: "Styliste sur mesure", href: "/categories/mode-tenues?sub=styliste", icon: Scissors },
  { label: "Bijoux mariage", href: "/categories/bijoux-accessoires?sub=bijoutier", icon: Gem },
  { label: "Accessoires cheveux", href: "/categories/bijoux-accessoires?sub=accessoires-cheveux", icon: Sparkles },
  { label: "Maquilleuse afro", href: "/categories/beaute?sub=maquilleuse-afro", icon: Sparkles },
  { label: "Coiffeuse afro", href: "/categories/beaute?sub=coiffeuse-afro", icon: Scissors },
  { label: "Chaussures mariage", href: "/categories/bijoux-accessoires?sub=chaussures", icon: PartyPopper },
  { label: "Tous les prestataires", href: "/prestataires", icon: Tag },
];

export const marieePromo: PromoCard = {
  title: "Catalogue de robes",
  description: "Choisissez la vôtre et trouvez la boutique la plus proche.",
  href: "/categories/mode-tenues",
};

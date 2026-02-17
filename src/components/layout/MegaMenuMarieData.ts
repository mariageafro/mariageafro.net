import type { SimpleMenuItem, PromoCard } from "./MegaMenuMarieeData";
import { Shirt, Sparkles, Heart, Tag, Scissors } from "lucide-react";

export const marieItems: SimpleMenuItem[] = [
  { label: "Costumes mariage", href: "/categories/mode-tenues?sub=styliste", icon: Shirt },
  { label: "Tenues traditionnelles", href: "/categories/mode-tenues?sub=tenues-traditionnelles", icon: Shirt },
  { label: "Barbier mariage", href: "/categories/beaute?sub=barbier", icon: Scissors },
  { label: "Accessoires marié", href: "/categories/bijoux-accessoires", icon: Sparkles },
  { label: "Soins beauté", href: "/categories/beaute", icon: Heart },
  { label: "Tous les prestataires", href: "/prestataires", icon: Tag },
];

export const mariePromo: PromoCard = {
  title: "Catalogue de costumes",
  description: "Choisissez le vôtre et trouvez la boutique la plus proche.",
  href: "/categories/mode-tenues",
};

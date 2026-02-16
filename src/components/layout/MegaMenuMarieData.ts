import type { SimpleMenuItem, PromoCard } from "./MegaMenuMarieeData";
import { Shirt, Sparkles, Heart, Tag } from "lucide-react";

export const marieItems: SimpleMenuItem[] = [
  { label: "Costumes mariage", href: "/categories/tenues-couture", icon: Shirt },
  { label: "Accessoires marié", href: "/categories/tenues-couture", icon: Sparkles },
  { label: "Soins beauté", href: "/categories/coiffure-beaute", icon: Heart },
  { label: "Promotions", href: "/prestataires", icon: Tag },
];

export const mariePromo: PromoCard = {
  title: "Catalogue de costumes",
  description: "Choisissez le vôtre et trouvez la boutique la plus proche.",
  href: "/categories/tenues-couture",
};

import type { SimpleMenuItem, PromoCard } from "./MegaMenuMarieeData";

export const marieItems: SimpleMenuItem[] = [
  { label: "Costumes mariage", href: "/categories/tenues-couture" },
  { label: "Accessoires marié", href: "/categories/tenues-couture" },
  { label: "Soins beauté", href: "/categories/coiffure-beaute" },
  { label: "Promotions", href: "/prestataires" },
];

export const mariePromo: PromoCard = {
  title: "Catalogue de costumes",
  description: "Choisissez le vôtre et trouvez la boutique la plus proche.",
  href: "/categories/tenues-couture",
};

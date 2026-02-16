export interface SimpleMenuItem {
  label: string;
  href: string;
}

export interface PromoCard {
  title: string;
  description: string;
  href: string;
}

export const marieeItems: SimpleMenuItem[] = [
  { label: "Robe de mariée", href: "/categories/tenues-couture" },
  { label: "Accessoires mariage", href: "/categories/tenues-couture" },
  { label: "Bijoux mariage", href: "/categories/tenues-couture" },
  { label: "Esthétique coiffure mariage", href: "/categories/coiffure-beaute" },
  { label: "Robe de cocktail", href: "/categories/tenues-couture" },
  { label: "Promotions", href: "/prestataires" },
];

export const marieePromo: PromoCard = {
  title: "Catalogue de robes",
  description: "Choisissez la vôtre et trouvez la boutique la plus proche.",
  href: "/categories/tenues-couture",
};

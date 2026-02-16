import type { SimpleMenuItem } from "./MegaMenuMarieeData";
import { Flag, MapPin } from "lucide-react";

export interface CountryItem {
  label: string;
  flag: string;
  href: string;
}

export interface ContinentGroup {
  continent: string;
  countries: CountryItem[];
}

export const paysGroups: ContinentGroup[] = [
  {
    continent: "Afrique",
    countries: [
      { label: "Congo", flag: "🇨🇩", href: "/trouver-par-pays?pays=cd" },
      { label: "Cameroun", flag: "🇨🇲", href: "/trouver-par-pays?pays=cm" },
      { label: "Sénégal", flag: "🇸🇳", href: "/trouver-par-pays?pays=sn" },
      { label: "Côte d'Ivoire", flag: "🇨🇮", href: "/trouver-par-pays?pays=ci" },
      { label: "Nigeria", flag: "🇳🇬", href: "/trouver-par-pays?pays=ng" },
      { label: "Ghana", flag: "🇬🇭", href: "/trouver-par-pays?pays=gh" },
      { label: "Mali", flag: "🇲🇱", href: "/trouver-par-pays?pays=ml" },
      { label: "Guinée", flag: "🇬🇳", href: "/trouver-par-pays?pays=gn" },
      { label: "Togo", flag: "🇹🇬", href: "/trouver-par-pays?pays=tg" },
      { label: "Bénin", flag: "🇧🇯", href: "/trouver-par-pays?pays=bj" },
    ],
  },
  {
    continent: "Europe",
    countries: [
      { label: "France", flag: "🇫🇷", href: "/trouver-par-pays?pays=fr" },
      { label: "Belgique", flag: "🇧🇪", href: "/trouver-par-pays?pays=be" },
      { label: "Royaume-Uni", flag: "🇬🇧", href: "/trouver-par-pays?pays=gb" },
      { label: "Allemagne", flag: "🇩🇪", href: "/trouver-par-pays?pays=de" },
      { label: "Suisse", flag: "🇨🇭", href: "/trouver-par-pays?pays=ch" },
      { label: "Pays-Bas", flag: "🇳🇱", href: "/trouver-par-pays?pays=nl" },
    ],
  },
  {
    continent: "Caraïbes & Amériques",
    countries: [
      { label: "Guadeloupe", flag: "🇬🇵", href: "/trouver-par-pays?pays=gp" },
      { label: "Martinique", flag: "🇲🇶", href: "/trouver-par-pays?pays=mq" },
      { label: "Haïti", flag: "🇭🇹", href: "/trouver-par-pays?pays=ht" },
      { label: "Guyane", flag: "🇬🇫", href: "/trouver-par-pays?pays=gf" },
      { label: "Canada", flag: "🇨🇦", href: "/trouver-par-pays?pays=ca" },
      { label: "États-Unis", flag: "🇺🇸", href: "/trouver-par-pays?pays=us" },
    ],
  },
];

import { Link } from "react-router-dom";
import { Crown, Camera, Music, Scissors, Sparkles, Utensils, Palette, Church, Car, Gem } from "lucide-react";

const categoryItems = [
  { label: "Photographie & Vidéo", slug: "image-souvenirs", icon: Camera },
  { label: "DJ & Animation", slug: "animation-ambiance", icon: Music },
  { label: "Beauté", slug: "beaute", icon: Sparkles },
  { label: "Traiteurs & Gastronomie", slug: "traiteurs-gastronomie", icon: Utensils },
  { label: "Décoration & Lieux", slug: "decoration-lieux", icon: Palette },
  { label: "Mode & Tenues", slug: "mode-tenues", icon: Scissors },
  { label: "Coordination & Cérémonie", slug: "ceremonies-coutumes", icon: Church },
  { label: "Bijoux & Accessoires", slug: "bijoux-accessoires", icon: Gem },
  { label: "Logistique & Services", slug: "logistique-services", icon: Car },
];

export function MegaMenuCategories() {
  return (
    <div className="w-full bg-popover shadow-xl border-b border-border z-50">
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-chocolate">Nos catégories</h3>
          <Link
            to="/prestataires-premium"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-champagne to-champagne-dark text-white text-xs font-body font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            <Crown size={13} />
            Prestataires Premium ✨
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {categoryItems.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categories/${cat.slug}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-champagne/5 transition-all group"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-champagne/10 text-champagne shrink-0 group-hover:bg-champagne/20 transition-colors">
                <cat.icon size={15} />
              </span>
              <span className="font-body text-sm text-chocolate group-hover:text-champagne transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

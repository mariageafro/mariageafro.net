import { Link } from "react-router-dom";
import { Plane, ChevronRight } from "lucide-react";
import { megaMenuCategories } from "./MegaMenuData";

export function MegaMenu() {
  return (
    <div className="w-full bg-popover shadow-xl border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-6 pt-7 pb-5">
        {/* Title */}
        <h3 className="font-serif text-lg text-chocolate mb-5">
          Trouvez vos prestataires
        </h3>

        {/* Categories grid – 3 columns on large, 2 on medium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {megaMenuCategories.map((cat) => (
            <div key={cat.slug}>
              {/* Category header */}
              <Link
                to={`/categories/${cat.slug}`}
                className="flex items-center gap-2 group mb-2"
              >
                <span className="text-base">{cat.emoji}</span>
                <span className="font-serif text-sm font-semibold text-chocolate group-hover:text-champagne transition-colors">
                  {cat.label}
                </span>
                <ChevronRight size={14} className="text-muted-foreground group-hover:text-champagne transition-colors" />
              </Link>

              {/* Sub-categories list */}
              <ul className="space-y-0.5 pl-6">
                {cat.subs.map((sub) => (
                  <li key={sub.slug}>
                    <Link
                      to={`/categories/${cat.slug}`}
                      className="font-body text-[13px] text-muted-foreground hover:text-champagne transition-colors leading-relaxed"
                    >
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Promo strip */}
      <div className="border-t border-border bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Plane className="w-5 h-5 text-champagne" />
            <div>
              <p className="text-sm font-body font-semibold text-chocolate">Destination Weddings</p>
              <p className="text-xs text-muted-foreground">Mariez-vous dans le pays de vos rêves.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/prestataires-premium"
              className="text-xs font-body font-semibold text-champagne hover:text-champagne-dark transition-colors"
            >
              ✨ Prestataires Premium
            </Link>
            <Link
              to="/prestataires"
              className="text-xs font-body text-muted-foreground hover:text-champagne underline transition-colors"
            >
              Voir tous les prestataires →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

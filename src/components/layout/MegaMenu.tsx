import { Link } from "react-router-dom";
import { Plane, ChevronRight, Crown } from "lucide-react";
import { megaMenuCategories } from "./MegaMenuData";

export function MegaMenu() {
  return (
    <div className="w-full bg-popover shadow-xl border-b border-border z-50 max-h-[80vh] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 pt-7 pb-5">
        {/* Top bar: title + Premium CTA */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-lg text-chocolate">
            Trouvez vos prestataires
          </h3>
          <Link
            to="/prestataires-premium"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-champagne to-champagne-dark text-white text-xs font-body font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            <Crown size={13} />
            Prestataires Premium ✨
          </Link>
        </div>

        {/* Categories grid – 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {megaMenuCategories.map((cat) => (
            <div key={cat.slug}>
              {/* Category header */}
              <Link
                to={`/categories/${cat.slug}`}
                className="flex items-center gap-2.5 group mb-3"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-champagne/10 text-champagne shrink-0">
                  <cat.icon size={14} />
                </span>
                <span className="font-serif text-base font-semibold text-chocolate group-hover:text-champagne transition-colors">
                  {cat.label}
                </span>
                <ChevronRight size={13} className="text-muted-foreground/50 group-hover:text-champagne transition-colors" />
              </Link>

              {/* Sub-categories list */}
              <ul className="space-y-0.5 pl-1">
                {cat.subs.map((sub) => (
                  <li key={sub.slug}>
                    <Link
                      to={`/prestataires?sub=${sub.slug}`}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg font-body text-sm text-muted-foreground hover:text-champagne hover:bg-champagne/5 transition-all group/sub"
                    >
                      {sub.icon && (
                        <sub.icon size={12} className="text-muted-foreground/40 group-hover/sub:text-champagne transition-colors shrink-0" />
                      )}
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

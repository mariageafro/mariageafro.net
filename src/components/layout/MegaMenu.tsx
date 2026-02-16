import { Link } from "react-router-dom";
import { Plane, Sparkles } from "lucide-react";
import { mainCategories, otherCategories } from "./MegaMenuData";

export function MegaMenu() {
  return (
    <div className="w-full bg-popover shadow-xl border-b border-border z-50">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-6">
        {/* Title */}
        <h3 className="font-serif text-lg text-chocolate mb-6">
          Commencez à rechercher vos prestataires
        </h3>

        {/* Main categories grid */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4 mb-8">
          {mainCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                to={cat.href}
                className="flex items-center gap-3 group py-1.5 transition-colors"
              >
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-champagne transition-colors flex-shrink-0" />
                <span className="text-sm font-body text-chocolate group-hover:text-champagne transition-colors">
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-5">
          <p className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-3">
            Autres catégories
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {otherCategories.map((cat) => (
              <Link
                key={cat.label}
                to={cat.href}
                className={`text-sm font-body transition-colors ${
                  cat.highlight
                    ? "text-destructive font-semibold hover:text-destructive/80"
                    : "text-muted-foreground hover:text-champagne"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Promo strip */}
      <div className="border-t border-border bg-secondary/40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Plane className="w-5 h-5 text-champagne" />
            <div>
              <p className="text-sm font-body font-semibold text-chocolate">Destination Weddings</p>
              <p className="text-xs text-muted-foreground">Mariez-vous dans le pays de vos rêves.</p>
            </div>
          </div>
          <Link
            to="/blog"
            className="text-xs font-body text-champagne underline hover:text-champagne-dark transition-colors"
          >
            Guides par culture →
          </Link>
        </div>
      </div>
    </div>
  );
}

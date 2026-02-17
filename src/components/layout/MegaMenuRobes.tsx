import { Link } from "react-router-dom";
import { robesCategories } from "./MegaMenuRobesData";

export function MegaMenuRobes() {
  return (
    <div className="w-full bg-popover shadow-xl border-b border-border z-50">
      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-10">
        <div className="flex-1">
          <h3 className="font-serif text-lg text-chocolate mb-5">Les dernières tendances de la mode nuptiale</h3>
          <div className="space-y-1">
            {robesCategories.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-body text-muted-foreground hover:text-champagne hover:bg-champagne/5 transition-all group"
              >
                {item.icon && (
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-champagne/10 text-champagne shrink-0">
                    <item.icon size={13} />
                  </span>
                )}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="w-56 flex-shrink-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-body">Marques sélectionnées</p>
          <div className="rounded-xl border border-border bg-secondary/30 p-5 text-center">
            <p className="text-sm text-chocolate font-medium">Découvrez nos marques</p>
            <Link to="/categories/tenues-couture" className="text-xs text-champagne underline mt-2 block">
              Voir tout →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

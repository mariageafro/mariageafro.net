import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { paysGroups } from "./MegaMenuPaysData";

export function MegaMenuPays() {
  return (
    <div className="w-full bg-popover shadow-xl border-b border-border z-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h3 className="font-serif text-lg text-chocolate mb-6">Trouvez vos prestataires par pays</h3>

        <div className="grid grid-cols-3 gap-8">
          {paysGroups.map((group) => (
            <div key={group.continent}>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-body">
                {group.continent}
              </p>
              <div className="space-y-0.5">
                {group.countries.map((country) => (
                  <Link
                    key={country.label}
                    to={country.href}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm font-body text-muted-foreground hover:text-champagne hover:bg-champagne/5 transition-all group"
                  >
                    <span className="text-base flex-shrink-0">{country.flag}</span>
                    {country.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer link */}
        <div className="border-t border-border mt-6 pt-4 flex justify-center">
          <Link
            to="/trouver-par-pays"
            className="flex items-center gap-2 text-xs font-body font-semibold text-champagne hover:text-champagne-dark transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Voir tous les pays et cultures →
          </Link>
        </div>
      </div>
    </div>
  );
}

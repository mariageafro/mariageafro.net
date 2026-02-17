import { Link } from "react-router-dom";
import { Camera, Sparkles } from "lucide-react";
import { plannerItems } from "./MegaMenuPlannerData";

export function MegaMenuPlanner() {
  return (
    <div className="w-full bg-popover shadow-xl border-b border-border z-50">
      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-10">
        {/* Grid 2×4 */}
        <div className="flex-1">
          <h3 className="font-serif text-lg text-chocolate mb-5">Mon Planificateur</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {plannerItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center gap-2.5 text-sm font-body text-chocolate hover:text-champagne transition-colors py-1.5 group"
                >
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-champagne transition-colors flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Promo card */}
        <div className="w-56 flex-shrink-0 rounded-xl bg-gradient-to-br from-champagne/20 to-secondary border border-champagne/20 p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-champagne/20 flex items-center justify-center mb-3">
              <Camera className="w-5 h-5 text-champagne" />
            </div>
            <p className="font-serif text-base text-chocolate font-semibold leading-snug mb-1">
              Wedshoots
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Créez votre album photo partagé et collectez les souvenirs de vos invités.
            </p>
          </div>
          <Link
            to="/blog"
            className="mt-4 text-xs font-body font-semibold text-champagne underline hover:text-champagne-dark transition-colors"
          >
            Télécharger l'app →
          </Link>
        </div>
      </div>

      {/* Demo strip */}
      <div className="border-t border-border bg-secondary/40">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-center gap-3">
          <Sparkles className="w-4 h-4 text-champagne" />
          <Link
            to="/demo-mariage"
            className="text-sm font-body font-semibold text-champagne hover:text-champagne-dark transition-colors"
          >
            ✨ Voir la démo — Mariage de Nadia & Junior
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Shirt } from "lucide-react";
import { marieeItems, marieePromo } from "./MegaMenuMarieeData";

export function MegaMenuMariee() {
  return (
    <div className="w-full bg-popover shadow-xl border-b border-border z-50">
      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-10">
        {/* Left: links */}
        <div className="flex-1">
          <h3 className="font-serif text-lg text-chocolate mb-5">Mariée</h3>
          <div className="grid grid-cols-2 gap-x-10 gap-y-2">
            {marieeItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-2.5 text-sm font-body text-chocolate hover:text-champagne transition-colors py-1.5 group"
              >
                {item.icon && <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-champagne transition-colors flex-shrink-0" />}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        {/* Right: promo card */}
        <div className="w-56 flex-shrink-0 rounded-xl border border-border bg-secondary/30 p-5 flex flex-col items-start gap-3">
          <Shirt className="w-8 h-8 text-champagne" />
          <p className="font-serif text-base text-chocolate font-semibold">{marieePromo.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{marieePromo.description}</p>
          <Link to={marieePromo.href} className="text-xs font-body font-semibold text-champagne underline hover:text-champagne-dark transition-colors">
            Voir le catalogue →
          </Link>
        </div>
      </div>
    </div>
  );
}

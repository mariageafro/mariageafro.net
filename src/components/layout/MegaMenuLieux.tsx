import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { lieuxItems, lieuxPromo } from "./MegaMenuLieuxData";

export function MegaMenuLieux() {
  return (
    <div className="w-full bg-popover shadow-xl border-b border-border z-50">
      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-10">
        <div className="flex-1">
          <h3 className="font-serif text-lg text-chocolate mb-5">Lieux de mariage</h3>
          <div className="grid grid-cols-2 gap-x-10 gap-y-1">
            {lieuxItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm font-body text-muted-foreground hover:text-champagne hover:bg-champagne/5 transition-all group"
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
        <div className="w-56 flex-shrink-0 rounded-xl border border-border bg-secondary/30 p-5 flex flex-col items-start gap-3">
          <MapPin className="w-8 h-8 text-champagne" />
          <p className="font-serif text-base text-chocolate font-semibold">{lieuxPromo.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{lieuxPromo.description}</p>
          <Link to={lieuxPromo.href} className="text-xs font-body font-semibold text-champagne underline hover:text-champagne-dark transition-colors">
            Voir les lieux →
          </Link>
        </div>
      </div>
    </div>
  );
}

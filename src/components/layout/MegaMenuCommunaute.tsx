import { Link } from "react-router-dom";
import { communauteThemes, communauteNewItems } from "./MegaMenuCommunauteData";

export function MegaMenuCommunaute() {
  return (
    <div className="w-full bg-popover shadow-xl border-b border-border z-50">
      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-10">
        {/* Left: grouped themes */}
        <div className="flex-1">
          <h3 className="font-serif text-lg text-chocolate mb-5">Groupes par thème</h3>
          <div className="grid grid-cols-3 gap-x-8 gap-y-1">
            {communauteThemes.map((item) => (
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
        {/* Right: nouveautés */}
        <div className="w-48 flex-shrink-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-body">
            Découvrez les nouveautés
          </p>
          <div className="space-y-1">
            {communauteNewItems.map((item) => (
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
      </div>
    </div>
  );
}

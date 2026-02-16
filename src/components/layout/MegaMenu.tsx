import { Link } from "react-router-dom";
import { megaMenuCategories } from "./MegaMenuData";

interface MegaMenuProps {
  showSolid: boolean;
}

export function MegaMenu({ showSolid }: MegaMenuProps) {
  return (
    <div className="absolute top-full left-0 w-full bg-popover shadow-xl border-b border-border z-50 animate-fade-in">
      <div className="max-w-7xl mx-auto p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {megaMenuCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-champagne border-b border-border pb-2 mb-1">
                <Icon className="w-4 h-4" />
                <h3 className="font-serif text-xs uppercase tracking-widest font-semibold">
                  {cat.title}
                </h3>
              </div>
              <ul className="space-y-1.5">
                {cat.items.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={item.href}
                      className={`text-sm font-body block transition-colors ${
                        item.highlight
                          ? "text-destructive font-semibold"
                          : "text-muted-foreground hover:text-champagne"
                      }`}
                    >
                      {item.label}
                      {item.info && (
                        <span className="block text-[10px] text-muted-foreground/60 font-normal">
                          {item.info}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="bg-secondary/50 p-4 text-center border-t border-border">
        <p className="text-sm text-muted-foreground font-body">
          Besoin d'aide ? Découvrez nos{" "}
          <Link to="/blog" className="text-champagne underline">
            guides d'organisation par culture
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

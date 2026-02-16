import { Link } from "react-router-dom";
import { ideesItems } from "./MegaMenuIdeesData";

export function MegaMenuIdees() {
  return (
    <div className="w-full bg-popover shadow-xl border-b border-border z-50">
      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-10">
        <div className="flex-1">
          <h3 className="font-serif text-lg text-chocolate mb-5">
            Toutes les inspirations et les conseils pour votre mariage
          </h3>
          <div className="grid grid-cols-2 gap-x-10 gap-y-2">
            {ideesItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm font-body text-chocolate hover:text-champagne transition-colors py-1.5"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="w-64 flex-shrink-0 space-y-4">
          <div className="rounded-xl border border-border bg-secondary/30 p-5">
            <p className="font-serif text-sm font-semibold text-chocolate mb-1">Reportages de mariage</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Chaque mariage est unique et il y a une belle histoire derrière chacun d'eux.
            </p>
            <Link to="/blog" className="text-xs text-champagne underline mt-2 block">Découvrir →</Link>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-5">
            <p className="font-serif text-sm font-semibold text-chocolate mb-1">Lune de miel</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Trouvez la destination de vos rêves pour votre lune de miel.
            </p>
            <Link to="/blog" className="text-xs text-champagne underline mt-2 block">Explorer →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

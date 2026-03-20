import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const origins = [
  { label: "Congo", flag: "🇨🇩", code: "cd" },
  { label: "Cameroun", flag: "🇨🇲", code: "cm" },
  { label: "Sénégal", flag: "🇸🇳", code: "sn" },
  { label: "Côte d'Ivoire", flag: "🇨🇮", code: "ci" },
  { label: "Mali", flag: "🇲🇱", code: "ml" },
  { label: "Guinée", flag: "🇬🇳", code: "gn" },
  { label: "Bénin", flag: "🇧🇯", code: "bj" },
  { label: "Ghana", flag: "🇬🇭", code: "gh" },
  { label: "Nigeria", flag: "🇳🇬", code: "ng" },
  { label: "Haïti", flag: "🇭🇹", code: "ht" },
  { label: "Antilles", flag: "🏝️", code: "antilles" },
];

export function MegaMenuPays() {
  return (
    <div className="w-full bg-popover shadow-xl border-b border-border z-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h3 className="font-serif text-lg text-chocolate mb-6">
          Explorer par origine & culture
        </h3>

        <div className="grid grid-cols-4 gap-x-6 gap-y-1">
          {origins.map((o) => (
            <Link
              key={o.code}
              to={`/trouver-par-pays?pays=${o.code}`}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-body text-muted-foreground hover:text-champagne hover:bg-champagne/5 transition-all"
            >
              <span className="text-base flex-shrink-0">{o.flag}</span>
              {o.label}
            </Link>
          ))}
        </div>

        <div className="border-t border-border mt-6 pt-4 flex justify-center">
          <Link
            to="/trouver-par-pays"
            className="flex items-center gap-2 text-xs font-body font-semibold text-champagne hover:text-champagne-dark transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Voir toutes les origines & cultures →
          </Link>
        </div>
      </div>
    </div>
  );
}

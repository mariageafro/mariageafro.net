import { X, RotateCcw, Navigation, Loader2, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRIORITY_CITIES, RADIUS_OPTIONS } from "@/lib/priority-cities";
import type { PrestatairesFilters } from "@/hooks/use-prestataires";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface FilterSidebarProps {
  filters: PrestatairesFilters;
  updateFilter: <K extends keyof PrestatairesFilters>(key: K, value: PrestatairesFilters[K]) => void;
  resetFilters: () => void;
  categories: { id: string; name: string; slug: string }[];
  villes: string[];
  cultures: string[];
  langues: string[];
  geo: { enabled: boolean; lat: number | null; lng: number | null; loading: boolean; error: string | null };
  radius: number;
  setRadius: (r: number) => void;
  onToggleGeo: () => void;
  onSetGeoLocation: (loc: { lat: number; lng: number; radius: number } | null) => void;
  hasActiveFilters: boolean;
  categoryCounts: Record<string, number>;
  onClose?: () => void;
  isMobile?: boolean;
}

const ratingOptions = [
  { label: "Toutes les notes", value: 0, stars: 0 },
  { label: "4+ étoiles", value: 4, stars: 4 },
  { label: "4.5+ étoiles", value: 4.5, stars: 4.5 },
  { label: "5 étoiles", value: 5, stars: 5 },
];

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-2 font-serif text-sm text-chocolate hover:text-champagne transition-colors"
      >
        {title}
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterSidebar({
  filters, updateFilter, resetFilters, categories, villes, cultures, langues,
  geo, radius, setRadius, onToggleGeo, onSetGeoLocation,
  hasActiveFilters, categoryCounts, onClose, isMobile,
}: FilterSidebarProps) {
  const priorityCityNames = PRIORITY_CITIES.map(c => c.name);
  const otherVilles = villes.filter(v => !priorityCityNames.includes(v));

  const selectClass = "w-full px-3 py-2.5 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50 appearance-none cursor-pointer";

  const activeFilterCount = [
    filters.ville, filters.categorie, filters.culture, filters.langue,
    filters.noteMin > 0 ? "yes" : "", filters.country, geo.enabled ? "yes" : ""
  ].filter(Boolean).length;

  return (
    <div className={`${isMobile ? "" : "sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto"} space-y-1 p-5`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-lg text-chocolate">Filtres</h3>
          {activeFilterCount > 0 && (
            <span className="font-body text-xs text-champagne">{activeFilterCount} actif{activeFilterCount > 1 ? "s" : ""}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button onClick={resetFilters} className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-champagne transition-colors">
              <RotateCcw size={12} />
              Réinitialiser
            </button>
          )}
          {isMobile && onClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Geolocation */}
      <FilterSection title="📍 Localisation">
        <Button
          variant={geo.enabled ? "default" : "outline"}
          size="sm"
          onClick={onToggleGeo}
          className={`w-full gap-2 ${geo.enabled ? "bg-champagne text-primary-foreground hover:bg-champagne-dark" : ""}`}
          disabled={geo.loading}
        >
          {geo.loading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
          Autour de moi
        </Button>
        {geo.error && <p className="text-xs font-body text-destructive">{geo.error}</p>}
        {geo.enabled && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {RADIUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setRadius(opt.value); onSetGeoLocation({ lat: geo.lat!, lng: geo.lng!, radius: opt.value }); }}
                className={`px-3 py-1 rounded-full font-body text-xs transition-all ${
                  radius === opt.value
                    ? "bg-champagne text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground hover:bg-champagne/10"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
        <select
          value={filters.ville}
          onChange={(e) => updateFilter('ville', e.target.value)}
          className={selectClass}
          disabled={geo.enabled}
        >
          <option value="">Toutes les villes</option>
          <optgroup label="Villes principales">
            {PRIORITY_CITIES.map((c) => (
              <option key={c.name} value={c.name}>{c.name} ({c.country})</option>
            ))}
          </optgroup>
          {otherVilles.length > 0 && (
            <optgroup label="Autres villes">
              {otherVilles.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </optgroup>
          )}
        </select>
      </FilterSection>

      {/* Category */}
      <FilterSection title="🏷️ Catégorie">
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => updateFilter('categorie', '')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-body text-sm transition-all ${
              !filters.categorie ? "bg-champagne/15 text-champagne-dark font-medium" : "hover:bg-secondary text-muted-foreground"
            }`}
          >
            <span>Toutes</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter('categorie', filters.categorie === cat.id ? '' : cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-body text-sm transition-all ${
                filters.categorie === cat.id ? "bg-champagne/15 text-champagne-dark font-medium" : "hover:bg-secondary text-muted-foreground"
              }`}
            >
              <span>{cat.name}</span>
              {categoryCounts[cat.id] ? (
                <span className="text-xs text-muted-foreground">{categoryCounts[cat.id]}</span>
              ) : null}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Culture */}
      <FilterSection title="🌍 Culture" defaultOpen={false}>
        <select
          value={filters.culture}
          onChange={(e) => updateFilter('culture', e.target.value)}
          className={selectClass}
        >
          <option value="">Toutes les cultures</option>
          {cultures.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </FilterSection>

      {/* Langue */}
      <FilterSection title="💬 Langue" defaultOpen={false}>
        <select
          value={filters.langue}
          onChange={(e) => updateFilter('langue', e.target.value)}
          className={selectClass}
        >
          <option value="">Toutes les langues</option>
          {langues.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="⭐ Note minimum">
        <div className="space-y-1">
          {ratingOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter('noteMin', opt.value)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-body text-sm transition-all ${
                filters.noteMin === opt.value ? "bg-champagne/15 text-champagne-dark font-medium" : "hover:bg-secondary text-muted-foreground"
              }`}
            >
              {opt.stars > 0 && (
                <div className="flex gap-0.5">
                  {Array.from({ length: Math.floor(opt.stars) }).map((_, i) => (
                    <Star key={i} size={12} className="text-gold fill-gold" />
                  ))}
                </div>
              )}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Sort */}
      <FilterSection title="📊 Trier par">
        <select
          value={filters.sort}
          onChange={(e) => updateFilter('sort', e.target.value as any)}
          className={selectClass}
        >
          <option value="pertinence">Pertinence</option>
          {geo.enabled && <option value="distance">Distance</option>}
          <option value="note">Note (décroissant)</option>
          <option value="avis">Avis (décroissant)</option>
        </select>
      </FilterSection>
    </div>
  );
}

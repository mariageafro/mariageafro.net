import { X, RotateCcw, Navigation, Loader2, Star, ChevronDown, Building2, Castle, Hotel, UtensilsCrossed, TreePine, Warehouse, Landmark, Ship, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PRIORITY_CITIES, RADIUS_OPTIONS } from "@/lib/priority-cities";
import type { PrestatairesFilters } from "@/hooks/use-prestataires";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface LieuFilterSidebarProps {
  filters: PrestatairesFilters;
  updateFilter: <K extends keyof PrestatairesFilters>(key: K, value: PrestatairesFilters[K]) => void;
  resetFilters: () => void;
  villes: string[];
  cultures: string[];
  langues: string[];
  geo: { enabled: boolean; lat: number | null; lng: number | null; loading: boolean; error: string | null };
  radius: number;
  setRadius: (r: number) => void;
  onToggleGeo: () => void;
  onSetGeoLocation: (loc: { lat: number; lng: number; radius: number } | null) => void;
  hasActiveFilters: boolean;
  venueTypes: string[];
  venueTypeFilter: string[];
  setVenueTypeFilter: (types: string[]) => void;
  subCategories: { id: string; name: string; slug: string }[];
  onClose?: () => void;
  isMobile?: boolean;
}

const ratingOptions = [
  { label: "4+ étoiles", value: 4, stars: 4 },
  { label: "4.5+ étoiles", value: 4.5, stars: 4.5 },
  { label: "5 étoiles", value: 5, stars: 5 },
];

const venueIcons: Record<string, React.ReactNode> = {
  "Salle de réception": <Building2 size={14} />,
  "Domaine & Château": <Castle size={14} />,
  "Hôtel": <Hotel size={14} />,
  "Restaurant": <UtensilsCrossed size={14} />,
  "Corps de ferme": <TreePine size={14} />,
  "Pavillon": <Warehouse size={14} />,
  "Espace culturel": <Landmark size={14} />,
  "Bateau": <Ship size={14} />,
  "Loft": <LayoutGrid size={14} />,
};

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
            <div className="pt-2 space-y-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckboxItem({ label, checked, onChange, icon }: { label: string; checked: boolean; onChange: (v: boolean) => void; icon?: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-secondary/60 transition-colors group">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      {icon && <span className={`${checked ? "text-champagne" : "text-muted-foreground"} transition-colors`}>{icon}</span>}
      <span className={`font-body text-sm flex-1 ${checked ? "text-chocolate font-medium" : "text-muted-foreground group-hover:text-chocolate"} transition-colors`}>
        {label}
      </span>
    </label>
  );
}

export function LieuFilterSidebar({
  filters, updateFilter, resetFilters, villes, cultures, langues,
  geo, radius, setRadius, onToggleGeo, onSetGeoLocation,
  hasActiveFilters, venueTypes, venueTypeFilter, setVenueTypeFilter,
  subCategories, onClose, isMobile,
}: LieuFilterSidebarProps) {
  const priorityCityNames = PRIORITY_CITIES.map(c => c.name);
  const otherVilles = villes.filter(v => !priorityCityNames.includes(v));

  const selectClass = "w-full px-3 py-2.5 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50 appearance-none cursor-pointer";

  const activeFilterCount = [
    filters.ville.length > 0 ? "yes" : "", filters.culture.length > 0 ? "yes" : "", filters.langue.length > 0 ? "yes" : "",
    filters.noteMin > 0 ? "yes" : "", filters.country, geo.enabled ? "yes" : "",
    venueTypeFilter.length > 0 ? "yes" : ""
  ].filter(Boolean).length;

  const toggleVenueType = (type: string) => {
    if (venueTypeFilter.includes(type)) {
      setVenueTypeFilter(venueTypeFilter.filter(t => t !== type));
    } else {
      setVenueTypeFilter([...venueTypeFilter, type]);
    }
  };

  return (
    <div className={`${isMobile ? "" : "sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto"} space-y-1 p-5`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-lg text-chocolate">Filtres Lieux</h3>
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

      {/* Venue Type */}
      <FilterSection title="🏛️ Type de lieu">
        <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
          {venueTypes.map((type) => (
            <CheckboxItem
              key={type}
              label={type}
              checked={venueTypeFilter.includes(type)}
              onChange={() => toggleVenueType(type)}
              icon={venueIcons[type] || <Building2 size={14} />}
            />
          ))}
        </div>
      </FilterSection>

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
        {/* Ville checkboxes */}
        <div className="mt-3 space-y-0.5 max-h-48 overflow-y-auto pr-1">
          <CheckboxItem
            label="Toutes les villes"
            checked={filters.ville.length === 0}
            onChange={() => updateFilter('ville', [])}
          />
          {PRIORITY_CITIES.map((c) => (
            <CheckboxItem
              key={c.name}
              label={`${c.name} (${c.country})`}
              checked={filters.ville.includes(c.name)}
              onChange={(checked) => updateFilter('ville', checked ? [...filters.ville, c.name] : filters.ville.filter(v => v !== c.name))}
            />
          ))}
          {otherVilles.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2 mb-1 px-2">Autres villes</p>
              {otherVilles.map((v) => (
                <CheckboxItem
                  key={v}
                  label={v}
                  checked={filters.ville.includes(v)}
                  onChange={(checked) => updateFilter('ville', checked ? [...filters.ville, v] : filters.ville.filter(x => x !== v))}
                />
              ))}
            </>
          )}
        </div>
      </FilterSection>

      {/* Culture */}
      <FilterSection title="🌍 Culture" defaultOpen={false}>
        <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
          <CheckboxItem
            label="Toutes les cultures"
            checked={filters.culture.length === 0}
            onChange={() => updateFilter('culture', [])}
          />
          {cultures.map((c) => (
            <CheckboxItem
              key={c}
              label={c}
              checked={filters.culture.includes(c)}
              onChange={(checked) => updateFilter('culture', checked ? [...filters.culture, c] : filters.culture.filter(x => x !== c))}
            />
          ))}
        </div>
      </FilterSection>

      {/* Langue */}
      <FilterSection title="💬 Langue" defaultOpen={false}>
        <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
          <CheckboxItem
            label="Toutes les langues"
            checked={filters.langue.length === 0}
            onChange={() => updateFilter('langue', [])}
          />
          {langues.map((l) => (
            <CheckboxItem
              key={l}
              label={l}
              checked={filters.langue.includes(l)}
              onChange={(checked) => updateFilter('langue', checked ? [...filters.langue, l] : filters.langue.filter(x => x !== l))}
            />
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="⭐ Note minimum">
        <div className="space-y-0.5">
          <CheckboxItem
            label="Toutes les notes"
            checked={filters.noteMin === 0}
            onChange={() => updateFilter('noteMin', 0)}
          />
          {ratingOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-secondary/60 transition-colors group">
              <Checkbox
                checked={filters.noteMin === opt.value}
                onCheckedChange={() => updateFilter('noteMin', filters.noteMin === opt.value ? 0 : opt.value)}
              />
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: Math.floor(opt.stars) }).map((_, i) => (
                    <Star key={i} size={12} className="text-gold fill-gold" />
                  ))}
                </div>
                <span className={`font-body text-sm ${filters.noteMin === opt.value ? "text-chocolate font-medium" : "text-muted-foreground"}`}>
                  {opt.label}
                </span>
              </div>
            </label>
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

      {/* Mobile apply button */}
      {isMobile && onClose && (
        <div className="pt-4">
          <Button variant="gold" className="w-full" onClick={onClose}>
            Appliquer les filtres
          </Button>
        </div>
      )}
    </div>
  );
}

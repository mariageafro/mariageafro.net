import { X, RotateCcw, Star, ChevronDown, Sparkles, Globe, BarChart3, SlidersHorizontal, MapPin, FolderOpen, MessageSquare, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { PrestatairesFilters } from "@/hooks/use-prestataires";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CULTURAL_ORIGINS } from "@/lib/cultural-origins";

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

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
  hideCategories?: boolean;
  initialSubSlugs?: string[];
}

const POPULAR_ORIGINS_COUNT = 6;

const COUNTRIES_MVP = [
  { label: "France", value: "france" },
  { label: "Belgique", value: "belgique" },
];

/* ---------- Shared sub-components ---------- */

function FilterSection({ title, icon, children, defaultOpen = true, badge }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; badge?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 w-full py-3 px-1 text-left transition-colors"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-champagne/10 text-champagne shrink-0">
          {icon}
        </span>
        <span className="font-serif text-sm font-medium text-chocolate flex-1">{title}</span>
        {badge !== undefined && badge > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-champagne text-primary-foreground font-body text-[10px] font-bold min-w-[20px] text-center">
            {badge}
          </span>
        )}
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
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
            <div className="pb-4 pl-1 pr-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}

function CheckboxItem({ label, checked, onChange, count }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; count?: number;
}) {
  return (
    <label className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer transition-all duration-150 ${checked ? "bg-champagne/8 shadow-[inset_0_0_0_1px_hsl(var(--champagne)/0.2)]" : "hover:bg-secondary/80"}`}>
      <Checkbox checked={checked} onCheckedChange={onChange} className="border-border data-[state=checked]:bg-champagne data-[state=checked]:border-champagne" />
      <span className={`font-body text-[13px] flex-1 leading-tight ${checked ? "text-chocolate font-medium" : "text-muted-foreground"} transition-colors`}>
        {label}
      </span>
      {count !== undefined && count > 0 && (
        <span className={`font-body text-[11px] tabular-nums ${checked ? "text-champagne font-medium" : "text-muted-foreground/60"}`}>{count}</span>
      )}
    </label>
  );
}

function OriginChip({ label, flag, active, onClick }: {
  label: string; flag: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-[12px] transition-all duration-150 border ${
        active
          ? "bg-champagne/15 border-champagne/30 text-chocolate font-medium shadow-sm"
          : "bg-background border-border text-muted-foreground hover:border-champagne/20 hover:bg-champagne/5"
      }`}
    >
      <span className="text-sm leading-none">{flag}</span>
      {label}
    </button>
  );
}

/* ---------- Main component ---------- */

export function FilterSidebar({
  filters, updateFilter, resetFilters, categories, cultures, langues, villes,
  hasActiveFilters, categoryCounts, onClose, isMobile, hideCategories, initialSubSlugs,
}: FilterSidebarProps) {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedSubs, setSelectedSubs] = useState<Set<string>>(new Set());
  const [showAllOrigins, setShowAllOrigins] = useState(false);

  useEffect(() => {
    const fetchSubs = async () => {
      const { data } = await supabase.from('sub_categories').select('id, name, slug, category_id, sort_order').order('sort_order', { ascending: true });
      if (data) setSubCategories(data);
    };
    fetchSubs();
  }, []);

  useEffect(() => {
    if (initialSubSlugs && initialSubSlugs.length > 0 && subCategories.length > 0) {
      const matchingIds = subCategories.filter(s => initialSubSlugs.includes(s.slug)).map(s => s.id);
      if (matchingIds.length > 0) setSelectedSubs(new Set(matchingIds));
    }
  }, [initialSubSlugs, subCategories]);

  const relevantSubs = filters.categorie
    ? subCategories.filter(s => s.category_id === filters.categorie)
    : [];

  // Check if an origin is active (any of its filter values match)
  const isOriginActive = (origin: typeof CULTURAL_ORIGINS[0]) =>
    origin.filter.some(f => filters.culture.includes(f));

  const toggleOrigin = (origin: typeof CULTURAL_ORIGINS[0]) => {
    const active = isOriginActive(origin);
    if (active) {
      updateFilter('culture', filters.culture.filter(c => !origin.filter.includes(c)));
    } else {
      updateFilter('culture', [...filters.culture, origin.filter[0]]);
    }
  };

  const visibleOrigins = showAllOrigins
    ? CULTURAL_ORIGINS
    : CULTURAL_ORIGINS.slice(0, POPULAR_ORIGINS_COUNT);

  const activeFilterCount = [
    filters.categorie, filters.culture.length > 0, filters.country, filters.noteMin > 0,
    filters.langue.length > 0, selectedSubs.size > 0,
  ].filter(Boolean).length;

  return (
    <div className={`${isMobile ? "" : "sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin"} px-4 py-5`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-champagne/20 to-champagne/5 border border-champagne/15">
            <SlidersHorizontal size={16} className="text-champagne" />
          </div>
          <div>
            <h3 className="font-serif text-base text-chocolate leading-tight">Filtres</h3>
            {activeFilterCount > 0 && (
              <span className="font-body text-[11px] text-champagne">{activeFilterCount} actif{activeFilterCount > 1 ? "s" : ""}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {hasActiveFilters && (
            <button
              onClick={() => { resetFilters(); setSelectedSubs(new Set()); setShowAllOrigins(false); }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-body text-[11px] text-muted-foreground hover:text-champagne hover:bg-champagne/5 transition-all"
            >
              <RotateCcw size={11} />
              Reset
            </button>
          )}
          {isMobile && onClose && (
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-secondary transition-colors">
              <X size={18} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Catégorie */}
      {!hideCategories && (
        <FilterSection title="Catégorie" icon={<Sparkles size={14} />} badge={filters.categorie ? 1 : 0}>
          <div className="space-y-0.5 max-h-52 overflow-y-auto scrollbar-thin pr-0.5">
            <CheckboxItem label="Toutes" checked={!filters.categorie} onChange={() => updateFilter('categorie', '')} />
            {categories.map((cat) => (
              <CheckboxItem
                key={cat.id}
                label={cat.name}
                checked={filters.categorie === cat.id}
                onChange={() => updateFilter('categorie', filters.categorie === cat.id ? '' : cat.id)}
                count={categoryCounts[cat.id]}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* 2. Origine & culture — chips */}
      <FilterSection title="Origine & culture" icon={<Globe size={14} />} badge={filters.culture.length || undefined}>
        <div className="flex flex-wrap gap-1.5">
          {visibleOrigins.map((o) => (
            <OriginChip
              key={o.label}
              label={o.label}
              flag={o.flag}
              active={isOriginActive(o)}
              onClick={() => toggleOrigin(o)}
            />
          ))}
        </div>
        {CULTURAL_ORIGINS.length > POPULAR_ORIGINS_COUNT && (
          <button
            onClick={() => setShowAllOrigins(!showAllOrigins)}
            className="mt-2 font-body text-[11px] text-champagne hover:text-champagne-dark transition-colors"
          >
            {showAllOrigins ? "Voir moins" : `Voir tout (${CULTURAL_ORIGINS.length})`}
          </button>
        )}
      </FilterSection>

      {/* 3. Pays du mariage */}
      <FilterSection title="Pays du mariage" icon={<MapPin size={14} />} badge={filters.country ? 1 : 0}>
        <div className="flex gap-2">
          {COUNTRIES_MVP.map((c) => (
            <button
              key={c.value}
              onClick={() => updateFilter('country', filters.country === c.value ? '' : c.value)}
              className={`flex-1 py-2 rounded-xl font-body text-[12px] text-center transition-all border ${
                filters.country === c.value
                  ? "bg-champagne/15 border-champagne/30 text-chocolate font-medium shadow-sm"
                  : "bg-background border-border text-muted-foreground hover:border-champagne/20"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* 4. Trier par */}
      <FilterSection title="Trier par" icon={<BarChart3 size={14} />} defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5">
          {[
            { value: 'pertinence', label: 'Pertinence' },
            { value: 'note', label: 'Meilleure note' },
            { value: 'avis', label: 'Plus d\'avis' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter('sort', opt.value as any)}
              className={`px-3 py-2 rounded-xl font-body text-[12px] transition-all ${
                filters.sort === opt.value ? "bg-champagne text-primary-foreground shadow-sm font-medium" : "bg-secondary/80 text-muted-foreground hover:bg-champagne/10"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* 5. Filtres avancés (collapsed) */}
      <FilterSection title="Filtres avancés" icon={<Settings2 size={14} />} defaultOpen={false}>
        <div className="space-y-4">
          {/* Sub-categories — only when a category is selected */}
          {relevantSubs.length > 0 && (
            <div>
              <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider mb-2">Sous-catégorie</p>
              <div className="space-y-0.5 max-h-36 overflow-y-auto scrollbar-thin pr-0.5">
                {relevantSubs.map((sub) => (
                  <CheckboxItem
                    key={sub.id}
                    label={sub.name}
                    checked={selectedSubs.has(sub.id)}
                    onChange={(checked) => {
                      setSelectedSubs(prev => {
                        const next = new Set(prev);
                        if (checked) next.add(sub.id); else next.delete(sub.id);
                        return next;
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Langue */}
          {langues.length > 0 && (
            <div>
              <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider mb-2">Langue</p>
              <div className="space-y-0.5 max-h-36 overflow-y-auto scrollbar-thin pr-0.5">
                {langues.map((l) => (
                  <CheckboxItem key={l} label={l} checked={filters.langue.includes(l)} onChange={(checked) => updateFilter('langue', checked ? [...filters.langue, l] : filters.langue.filter(x => x !== l))} />
                ))}
              </div>
            </div>
          )}

          {/* Note minimum */}
          <div>
            <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider mb-2">Note minimum</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => updateFilter('noteMin', 0)}
                className={`px-3 py-1.5 rounded-xl font-body text-[12px] transition-all ${
                  filters.noteMin === 0 ? "bg-champagne text-primary-foreground shadow-sm font-medium" : "bg-secondary/80 text-muted-foreground hover:bg-champagne/10"
                }`}
              >
                Toutes
              </button>
              {[4, 4.5, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => updateFilter('noteMin', filters.noteMin === val ? 0 : val)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-body text-[12px] transition-all ${
                    filters.noteMin === val ? "bg-champagne text-primary-foreground shadow-sm font-medium" : "bg-secondary/80 text-muted-foreground hover:bg-champagne/10"
                  }`}
                >
                  <Star size={10} className={filters.noteMin === val ? "fill-primary-foreground" : "fill-gold text-gold"} />
                  {val === 5 ? "5" : `${val}+`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Mobile apply button */}
      {isMobile && onClose && (
        <div className="pt-5">
          <Button variant="gold" className="w-full rounded-xl h-11 font-body text-sm" onClick={onClose}>
            Appliquer les filtres
          </Button>
        </div>
      )}
    </div>
  );
}

/* ---------- Active filter chips (exported for use above the grid) ---------- */

export function ActiveFilterChips({
  filters, categories, updateFilter, resetFilters,
}: {
  filters: PrestatairesFilters;
  categories: { id: string; name: string; slug: string }[];
  updateFilter: <K extends keyof PrestatairesFilters>(key: K, value: PrestatairesFilters[K]) => void;
  resetFilters: () => void;
}) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.categorie) {
    const cat = categories.find(c => c.id === filters.categorie);
    if (cat) chips.push({ label: cat.name, onRemove: () => updateFilter('categorie', '') });
  }
  for (const c of filters.culture) {
    const origin = CULTURAL_ORIGINS.find(o => o.filter.includes(c));
    chips.push({ label: origin?.label || c, onRemove: () => updateFilter('culture', filters.culture.filter(x => x !== c)) });
  }
  if (filters.country) {
    const label = filters.country === 'france' ? 'France' : filters.country === 'belgique' ? 'Belgique' : filters.country;
    chips.push({ label, onRemove: () => updateFilter('country', '') });
  }
  if (filters.noteMin > 0) {
    chips.push({ label: `★ ${filters.noteMin}+`, onRemove: () => updateFilter('noteMin', 0) });
  }
  for (const l of filters.langue) {
    chips.push({ label: l, onRemove: () => updateFilter('langue', filters.langue.filter(x => x !== l)) });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {chips.map((chip, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne/10 border border-champagne/20 font-body text-[12px] text-chocolate"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="hover:text-champagne transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <button
        onClick={resetFilters}
        className="font-body text-[11px] text-muted-foreground hover:text-champagne transition-colors ml-1"
      >
        Effacer tout
      </button>
    </div>
  );
}
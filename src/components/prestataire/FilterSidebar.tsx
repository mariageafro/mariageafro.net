import { X, RotateCcw, Star, ChevronDown, Sparkles, Globe, BarChart3, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  hideCategories?: boolean;
  initialSubSlugs?: string[];
}

const ratingOptions = [
  { label: "4+", value: 4 },
  { label: "4.5+", value: 4.5 },
  { label: "5", value: 5 },
];

function FilterSection({ title, icon, children, defaultOpen = true, badge }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; badge?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="group/section">
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

function CheckboxItem({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: (v: boolean) => void; count?: number }) {
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

export function FilterSidebar({
  filters, updateFilter, resetFilters, categories, cultures,
  hasActiveFilters, categoryCounts, onClose, isMobile, hideCategories,
}: FilterSidebarProps) {

  const activeFilterCount = [
    filters.categorie, filters.culture.length > 0, filters.noteMin > 0,
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
              onClick={resetFilters}
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

      {/* 2. Origine & culture */}
      <FilterSection title="Origine & culture" icon={<Globe size={14} />} badge={filters.culture.length || undefined}>
        <div className="space-y-0.5 max-h-52 overflow-y-auto scrollbar-thin pr-0.5">
          <CheckboxItem label="Toutes les origines" checked={filters.culture.length === 0} onChange={() => updateFilter('culture', [])} />
          {cultures.map((c) => (
            <CheckboxItem key={c} label={c} checked={filters.culture.includes(c)} onChange={(checked) => updateFilter('culture', checked ? [...filters.culture, c] : filters.culture.filter(x => x !== c))} />
          ))}
        </div>
      </FilterSection>

      {/* 3. Note minimum */}
      <FilterSection title="Note minimum" icon={<Star size={14} />} defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => updateFilter('noteMin', 0)}
            className={`px-3 py-2 rounded-xl font-body text-[12px] transition-all ${
              filters.noteMin === 0 ? "bg-champagne text-primary-foreground shadow-sm font-medium" : "bg-secondary/80 text-muted-foreground hover:bg-champagne/10"
            }`}
          >
            Toutes
          </button>
          {ratingOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter('noteMin', filters.noteMin === opt.value ? 0 : opt.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-body text-[12px] transition-all ${
                filters.noteMin === opt.value ? "bg-champagne text-primary-foreground shadow-sm font-medium" : "bg-secondary/80 text-muted-foreground hover:bg-champagne/10"
              }`}
            >
              <Star size={11} className={filters.noteMin === opt.value ? "fill-primary-foreground" : "fill-gold text-gold"} />
              {opt.label}
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
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Globe, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

/* ── Cultural origins ── */
const culturalOrigins = [
  "Congo", "Cameroun", "Sénégal", "Côte d'Ivoire", "Mali",
  "Guinée", "Bénin", "Ghana", "Nigeria", "Haïti", "Antilles",
];

/* ── Vendor type suggestions ── */
const vendorSuggestions = [
  "Photographe", "Vidéaste", "DJ", "MC",
  "Wedding Planner", "Coordinatrice",
  "Maquilleuse afro", "Coiffeuse afro",
  "Traiteur", "Wedding Cake",
  "Salles de réception", "Déco",
  "Tenues traditionnelles", "Robe",
  "Location voiture",
];

/* ── Countries for MVP ── */
const countryOptions = ["France", "Belgique"];

/* ── Dropdown animation ── */
const dropdownMotion = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.98 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export function HeroSearchDropdowns() {
  const navigate = useNavigate();
  const [vendorType, setVendorType] = useState("");
  const [location, setLocation] = useState("");
  const [culture, setCulture] = useState("");

  const [showVendorDrop, setShowVendorDrop] = useState(false);
  const [showLocDrop, setShowLocDrop] = useState(false);
  const [showCultureDrop, setShowCultureDrop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const vendorRef = useRef<HTMLDivElement>(null);
  const cultureRef = useRef<HTMLDivElement>(null);
  const locRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (vendorRef.current && !vendorRef.current.contains(e.target as Node)) setShowVendorDrop(false);
      if (locRef.current && !locRef.current.contains(e.target as Node)) setShowLocDrop(false);
      if (cultureRef.current && !cultureRef.current.contains(e.target as Node)) setShowCultureDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const closeAll = () => {
    setShowVendorDrop(false);
    setShowLocDrop(false);
    setShowCultureDrop(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (vendorType) params.set("search", vendorType);
    if (location) params.set("pays", location);
    if (culture) params.set("culture", culture);
    navigate(`/explorer${params.toString() ? `?${params}` : ""}`);
  };

  const filteredVendors = vendorType
    ? vendorSuggestions.filter((v) => v.toLowerCase().includes(vendorType.toLowerCase()))
    : vendorSuggestions;

  const filteredCultures = culture
    ? culturalOrigins.filter((c) => c.toLowerCase().includes(culture.toLowerCase()))
    : culturalOrigins;

  const filteredCountries = location
    ? countryOptions.filter((c) => c.toLowerCase().includes(location.toLowerCase()))
    : countryOptions;

  /* ── Premium dropdown panel ── */
  const DropdownPanel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <motion.div
      {...dropdownMotion}
      className={`absolute top-full left-0 mt-2.5 bg-ivory/98 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.04)] border border-champagne/10 z-[9999] w-full max-h-[260px] overflow-y-auto overscroll-contain ${className}`}
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="py-1.5">
        {children}
      </div>
    </motion.div>
  );

  const DropdownOption = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 text-sm font-body transition-all duration-150 flex items-center justify-between ${
        selected
          ? "text-champagne-dark bg-champagne/8 font-medium"
          : "text-chocolate hover:bg-champagne/5 hover:text-champagne-dark"
      }`}
    >
      <span>{label}</span>
      {selected && <Check size={14} className="text-champagne shrink-0" />}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto relative z-[9999]">
      {/* ─── Desktop ─── */}
      <div className="hidden sm:flex bg-ivory/95 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_-6px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.1)] overflow-visible relative">
        {/* Vendor type */}
        <div ref={vendorRef} className="flex-[1.2] relative">
          <button
            onClick={() => { closeAll(); setShowVendorDrop(!showVendorDrop); }}
            className="w-full flex items-center gap-3 px-6 py-5 border-r border-border/60 text-left group"
          >
            <Search className="text-champagne shrink-0" size={16} />
            <div className="flex-1 min-w-0">
              <p className="font-body text-[10px] text-muted-foreground/70 uppercase tracking-widest mb-0.5">Type de prestataire</p>
              <input
                type="text"
                value={vendorType}
                onChange={(e) => { setVendorType(e.target.value); setShowVendorDrop(true); }}
                onFocus={() => { closeAll(); setShowVendorDrop(true); }}
                placeholder="Photographe, DJ, vidéaste..."
                className="w-full bg-transparent font-body text-sm text-chocolate placeholder:text-muted-foreground/50 focus:outline-none"
              />
            </div>
          </button>
          <AnimatePresence>
            {showVendorDrop && filteredVendors.length > 0 && (
              <DropdownPanel>
                {filteredVendors.map((v) => (
                  <DropdownOption key={v} label={v} selected={vendorType === v} onClick={() => { setVendorType(v); setShowVendorDrop(false); }} />
                ))}
              </DropdownPanel>
            )}
          </AnimatePresence>
        </div>

        {/* Origine & culture */}
        <div ref={cultureRef} className="flex-1 relative">
          <button
            onClick={() => { closeAll(); setShowCultureDrop(!showCultureDrop); }}
            className="w-full flex items-center gap-3 px-6 py-5 border-r border-border/60 text-left group"
          >
            <Globe className="text-champagne shrink-0" size={16} />
            <div className="flex-1 min-w-0">
              <p className="font-body text-[10px] text-muted-foreground/70 uppercase tracking-widest mb-0.5">Origine & culture</p>
              <input
                type="text"
                value={culture}
                onChange={(e) => { setCulture(e.target.value); setShowCultureDrop(true); }}
                onFocus={() => { closeAll(); setShowCultureDrop(true); }}
                placeholder="Congo, Cameroun, Antilles..."
                className="w-full bg-transparent font-body text-sm text-chocolate placeholder:text-muted-foreground/50 focus:outline-none"
              />
            </div>
          </button>
          <AnimatePresence>
            {showCultureDrop && filteredCultures.length > 0 && (
              <DropdownPanel>
                {filteredCultures.map((c) => (
                  <DropdownOption key={c} label={c} selected={culture === c} onClick={() => { setCulture(c); setShowCultureDrop(false); }} />
                ))}
              </DropdownPanel>
            )}
          </AnimatePresence>
        </div>

        {/* Pays du mariage */}
        <div ref={locRef} className="flex-1 relative">
          <button
            onClick={() => { closeAll(); setShowLocDrop(!showLocDrop); }}
            className="w-full flex items-center gap-3 px-6 py-5 text-left group"
          >
            <MapPin className="text-champagne shrink-0" size={16} />
            <div className="flex-1 min-w-0">
              <p className="font-body text-[10px] text-muted-foreground/70 uppercase tracking-widest mb-0.5">Pays du mariage</p>
              <input
                type="text"
                value={location}
                onChange={(e) => { setLocation(e.target.value); setShowLocDrop(true); }}
                onFocus={() => { closeAll(); setShowLocDrop(true); }}
                placeholder="France, Belgique"
                className="w-full bg-transparent font-body text-sm text-chocolate placeholder:text-muted-foreground/50 focus:outline-none"
              />
            </div>
          </button>
          <AnimatePresence>
            {showLocDrop && filteredCountries.length > 0 && (
              <DropdownPanel>
                {filteredCountries.map((c) => (
                  <DropdownOption key={c} label={c} selected={location === c} onClick={() => { setLocation(c); setShowLocDrop(false); }} />
                ))}
              </DropdownPanel>
            )}
          </AnimatePresence>
        </div>

        {/* Search Button */}
        <Button variant="hero" className="m-2 rounded-xl shrink-0 px-6" onClick={handleSearch}>
          <Search size={18} />
          Rechercher
        </Button>
      </div>

      {/* ─── Mobile ─── */}
      <div className="sm:hidden px-4 space-y-3">
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-ivory/95 backdrop-blur-sm shadow-elegant"
        >
          <Search size={16} className="text-champagne" />
          <span className="font-serif text-sm text-chocolate">Rechercher un prestataire</span>
          {mobileOpen ? (
            <ChevronUp size={16} className="text-chocolate/60" />
          ) : (
            <ChevronDown size={16} className="text-chocolate/60" />
          )}
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-visible"
            >
              <div className="rounded-2xl bg-chocolate/60 backdrop-blur-md border border-ivory/15 px-5 py-5 space-y-4">
                {/* Vendor type */}
                <div ref={vendorRef} className="relative">
                  <label className="font-serif text-[11px] text-ivory/80 uppercase tracking-[0.2em] mb-1 block">Type de prestataire</label>
                  <div className="flex items-center gap-2.5 border-b border-ivory/25 pb-2.5">
                    <Search size={15} className="text-gold shrink-0" />
                    <input
                      type="text"
                      value={vendorType}
                      onChange={(e) => { setVendorType(e.target.value); setShowVendorDrop(true); }}
                      onFocus={() => { closeAll(); setShowVendorDrop(true); }}
                      placeholder="Photographe, DJ, vidéaste..."
                      className="w-full bg-transparent font-serif text-[15px] text-ivory placeholder:text-ivory/50 focus:outline-none"
                    />
                  </div>
                  {showVendorDrop && filteredVendors.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 bg-ivory rounded-xl shadow-2xl border border-border z-[9999] w-full max-h-[200px] overflow-y-auto">
                      {filteredVendors.map((v) => (
                        <button
                          key={v}
                          onClick={() => { setVendorType(v); setShowVendorDrop(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors hover:bg-champagne/5 ${
                            vendorType === v ? "text-champagne bg-champagne/10" : "text-chocolate"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Origine & culture */}
                <div ref={cultureRef} className="relative">
                  <label className="font-serif text-[11px] text-ivory/80 uppercase tracking-[0.2em] mb-1 block">Origine & culture</label>
                  <div className="flex items-center gap-2.5 border-b border-ivory/25 pb-2.5">
                    <Globe size={15} className="text-gold shrink-0" />
                    <input
                      type="text"
                      value={culture}
                      onChange={(e) => { setCulture(e.target.value); setShowCultureDrop(true); }}
                      onFocus={() => { closeAll(); setShowCultureDrop(true); }}
                      placeholder="Congo, Cameroun, Antilles..."
                      className="w-full bg-transparent font-serif text-[15px] text-ivory placeholder:text-ivory/50 focus:outline-none"
                    />
                  </div>
                  {showCultureDrop && filteredCultures.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 bg-ivory rounded-xl shadow-2xl border border-border z-[9999] w-full max-h-[200px] overflow-y-auto">
                      {filteredCultures.map((c) => (
                        <button
                          key={c}
                          onClick={() => { setCulture(c); setShowCultureDrop(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors hover:bg-champagne/5 ${
                            culture === c ? "text-champagne bg-champagne/10" : "text-chocolate"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pays du mariage */}
                <div ref={locRef} className="relative">
                  <label className="font-serif text-[11px] text-ivory/80 uppercase tracking-[0.2em] mb-1 block">Pays du mariage</label>
                  <div className="flex items-center gap-2.5 border-b border-ivory/25 pb-2.5">
                    <MapPin size={15} className="text-gold shrink-0" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => { setLocation(e.target.value); setShowLocDrop(true); }}
                      onFocus={() => { closeAll(); setShowLocDrop(true); }}
                      placeholder="France, Belgique"
                      className="w-full bg-transparent font-serif text-[15px] text-ivory placeholder:text-ivory/50 focus:outline-none"
                    />
                  </div>
                  {showLocDrop && filteredCountries.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 bg-ivory rounded-xl shadow-2xl border border-border z-[9999] w-full max-h-[200px] overflow-y-auto">
                      {filteredCountries.map((c) => (
                        <button
                          key={c}
                          onClick={() => { setLocation(c); setShowLocDrop(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors hover:bg-champagne/5 ${
                            location === c ? "text-champagne bg-champagne/10" : "text-chocolate"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Button variant="hero" className="w-full rounded-xl" onClick={handleSearch}>
                  <Search size={18} />
                  Rechercher
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

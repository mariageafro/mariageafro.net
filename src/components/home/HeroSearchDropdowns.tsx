import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

/* ── Cultural origins for dropdown ── */
const culturalOrigins = [
  "Congo", "Cameroun", "Sénégal", "Côte d'Ivoire", "Mali",
  "Guinée", "Bénin", "Ghana", "Nigeria", "Haïti",
  "Antilles",
];

/* ── Vendor type suggestions ── */
const vendorSuggestions = [
  "Photographe", "Vidéaste", "DJ", "Traiteur", "Wedding Planner",
  "Makeup artiste afro", "Coiffure", "Déco", "Salles de réception",
];

/* ── Countries for MVP ── */
const countryOptions = ["France", "Belgique"];

export function HeroSearchDropdowns() {
  const navigate = useNavigate();
  const [vendorType, setVendorType] = useState("");
  const [location, setLocation] = useState("");
  const [culture, setCulture] = useState("");

  const [showVendorDrop, setShowVendorDrop] = useState(false);
  const [showLocDrop, setShowLocDrop] = useState(false);
  const [showCultureDrop, setShowCultureDrop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [cultures, setCultures] = useState<string[]>([]);

  const vendorRef = useRef<HTMLDivElement>(null);
  const cultureRef = useRef<HTMLDivElement>(null);
  const locRef = useRef<HTMLDivElement>(null);

  // Fetch real cultures from DB
  useEffect(() => {
    const fetchData = async () => {
      const cultureRes = await supabase.from("prestataires").select("origine_culturelle").not("origine_culturelle", "is", null);
      if (cultureRes.data) {
        const unique = [...new Set(cultureRes.data.map((c) => c.origine_culturelle).filter(Boolean))] as string[];
        setCultures(unique.sort());
      }
    };
    fetchData();
  }, []);

  // Close on outside click
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
    if (location) params.set("ville", location);
    if (culture) params.set("culture", culture);
    navigate(`/prestataires${params.toString() ? `?${params}` : ""}`);
  };

  const filteredVendors = vendorType
    ? vendorSuggestions.filter((v) => v.toLowerCase().includes(vendorType.toLowerCase()))
    : vendorSuggestions;

  // Merge DB cultures with predefined, keep predefined order first
  const allCultures = culturalOrigins;
  const filteredCultures = culture
    ? allCultures.filter((c) => c.toLowerCase().includes(culture.toLowerCase()))
    : allCultures;

  const filteredCountries = location
    ? countryOptions.filter((c) => c.toLowerCase().includes(location.toLowerCase()))
    : countryOptions;

  return (
    <div className="max-w-4xl mx-auto relative z-[9999]">
      {/* ─── Desktop ─── */}
      <div className="hidden sm:flex bg-ivory/95 backdrop-blur-sm rounded-2xl shadow-elegant overflow-visible relative">
        {/* Vendor type */}
        <div ref={vendorRef} className="flex-1 relative">
          <button
            onClick={() => { closeAll(); setShowVendorDrop(!showVendorDrop); }}
            className="w-full flex items-center gap-3 px-5 py-4 border-r border-border text-left"
          >
            <Search className="text-champagne shrink-0" size={16} />
            <div className="flex-1 min-w-0">
              <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest">Type de prestataire</p>
              <input
                type="text"
                value={vendorType}
                onChange={(e) => { setVendorType(e.target.value); setShowVendorDrop(true); }}
                onFocus={() => { closeAll(); setShowVendorDrop(true); }}
                placeholder="Photographe, DJ, vidéaste..."
                className="w-full bg-transparent font-body text-sm text-chocolate placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </button>
          {showVendorDrop && filteredVendors.length > 0 && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-border z-[9999] w-full max-h-[280px] overflow-y-auto">
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
        <div ref={cultureRef} className="flex-1 relative">
          <button
            onClick={() => { closeAll(); setShowCultureDrop(!showCultureDrop); }}
            className="w-full flex items-center gap-3 px-5 py-4 border-r border-border text-left"
          >
            <Globe className="text-champagne shrink-0" size={16} />
            <div className="flex-1 min-w-0">
              <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest">Origine & culture</p>
              <input
                type="text"
                value={culture}
                onChange={(e) => { setCulture(e.target.value); setShowCultureDrop(true); }}
                onFocus={() => { closeAll(); setShowCultureDrop(true); }}
                placeholder="Congolais, Camerounais, Antillais..."
                className="w-full bg-transparent font-body text-sm text-chocolate placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </button>
          {showCultureDrop && filteredCultures.length > 0 && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-border z-[9999] w-full max-h-[280px] overflow-y-auto">
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
        <div ref={locRef} className="flex-1 relative">
          <button
            onClick={() => { closeAll(); setShowLocDrop(!showLocDrop); }}
            className="w-full flex items-center gap-3 px-5 py-4 text-left"
          >
            <MapPin className="text-champagne shrink-0" size={16} />
            <div className="flex-1 min-w-0">
              <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest">Pays du mariage</p>
              <input
                type="text"
                value={location}
                onChange={(e) => { setLocation(e.target.value); setShowLocDrop(true); }}
                onFocus={() => { closeAll(); setShowLocDrop(true); }}
                placeholder="France, Belgique"
                className="w-full bg-transparent font-body text-sm text-chocolate placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </button>
          {showLocDrop && filteredCountries.length > 0 && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-border z-[9999] w-full max-h-[280px] overflow-y-auto">
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

        {/* Search Button */}
        <Button variant="hero" className="m-1.5 rounded-xl shrink-0" onClick={handleSearch}>
          <Search size={18} />
          Rechercher
        </Button>
      </div>

      {/* ─── Mobile ─── */}
      <div className="sm:hidden px-4 space-y-3">
        {/* Toggle button */}
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

        {/* Animated search card */}
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
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-border z-[9999] w-full max-h-[200px] overflow-y-auto">
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
                      placeholder="Congolais, Camerounais, Antillais..."
                      className="w-full bg-transparent font-serif text-[15px] text-ivory placeholder:text-ivory/50 focus:outline-none"
                    />
                  </div>
                  {showCultureDrop && filteredCultures.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-border z-[9999] w-full max-h-[200px] overflow-y-auto">
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
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-border z-[9999] w-full max-h-[200px] overflow-y-auto">
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

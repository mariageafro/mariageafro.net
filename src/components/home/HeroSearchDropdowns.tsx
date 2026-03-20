import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

/* ── Cultural origins for dropdown ── */
const culturalOrigins = [
  "Congolais", "Ivoirien", "Camerounais", "Sénégalais", "Nigérian",
  "Ghanéen", "Malien", "Guinéen", "Togolais", "Béninois",
  "Haïtien", "Guadeloupéen", "Martiniquais", "Cap-verdien",
  "Éthiopien", "Rwandais", "Burkinabè",
];

/* ── Vendor type suggestions ── */
const vendorSuggestions = [
  "Photographe", "Vidéaste", "DJ", "Wedding Planner", "Traiteur",
  "Décorateur", "Maquilleur", "Coiffeur", "Animateur", "Chorégraphe",
];

export function HeroSearchDropdowns() {
  const navigate = useNavigate();
  const [vendorType, setVendorType] = useState("");
  const [location, setLocation] = useState("");
  const [culture, setCulture] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showFloatingCta, setShowFloatingCta] = useState(true);
  const [showVendorDrop, setShowVendorDrop] = useState(false);
  const [showLocDrop, setShowLocDrop] = useState(false);
  const [showCultureDrop, setShowCultureDrop] = useState(false);

  const [cities, setCities] = useState<string[]>([]);
  const [cultures, setCultures] = useState<string[]>([]);

  const vendorRef = useRef<HTMLDivElement>(null);
  const locRef = useRef<HTMLDivElement>(null);
  const cultureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetch = async () => {
      const [villeRes, cultureRes] = await Promise.all([
        supabase.from("prestataires").select("ville").not("ville", "is", null),
        supabase.from("prestataires").select("origine_culturelle").not("origine_culturelle", "is", null),
      ]);
      if (villeRes.data) {
        const unique = [...new Set(villeRes.data.map((v) => v.ville).filter(Boolean))] as string[];
        setCities(unique.sort());
      }
      if (cultureRes.data) {
        const unique = [...new Set(cultureRes.data.map((c) => c.origine_culturelle).filter(Boolean))] as string[];
        setCultures(unique.sort());
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (vendorRef.current && !vendorRef.current.contains(e.target as Node)) setShowVendorDrop(false);
      if (locRef.current && !locRef.current.contains(e.target as Node)) setShowLocDrop(false);
      if (cultureRef.current && !cultureRef.current.contains(e.target as Node)) setShowCultureDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile panel open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Hide floating CTA when user scrolls past the hero
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCta(window.scrollY < window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
    setMobileOpen(false);
    navigate(`/prestataires${params.toString() ? `?${params}` : ""}`);
  };

  const filteredVendors = vendorType
    ? vendorSuggestions.filter((v) => v.toLowerCase().includes(vendorType.toLowerCase()))
    : vendorSuggestions;

  const filteredCities = location
    ? cities.filter((c) => c.toLowerCase().includes(location.toLowerCase()))
    : cities.slice(0, 12);

  const allCultures = [...new Set([...culturalOrigins, ...cultures])].sort();
  const filteredCultures = culture
    ? allCultures.filter((c) => c.toLowerCase().includes(culture.toLowerCase()))
    : allCultures.slice(0, 15);

  /* ── Shared dropdown list renderer ── */
  const DropList = ({ items, onSelect, current }: { items: string[]; onSelect: (v: string) => void; current: string }) => (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-border z-[9999] w-full max-h-[220px] overflow-y-auto">
      {items.map((v) => (
        <button
          key={v}
          onClick={() => onSelect(v)}
          className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors hover:bg-champagne/5 ${
            current === v ? "text-champagne bg-champagne/10" : "text-chocolate"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );

  /* ── Search field (reused in desktop & mobile panel) ── */
  const SearchFields = () => (
    <>
      {/* Vendor type */}
      <div ref={vendorRef} className="flex-1 relative">
        <button
          onClick={() => { closeAll(); setShowVendorDrop(!showVendorDrop); }}
          className="w-full flex items-center gap-3 px-5 py-4 border-b sm:border-b-0 sm:border-r border-border text-left"
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
          <DropList items={filteredVendors} onSelect={(v) => { setVendorType(v); setShowVendorDrop(false); }} current={vendorType} />
        )}
      </div>

      {/* Location */}
      <div ref={locRef} className="flex-1 relative">
        <button
          onClick={() => { closeAll(); setShowLocDrop(!showLocDrop); }}
          className="w-full flex items-center gap-3 px-5 py-4 border-b sm:border-b-0 sm:border-r border-border text-left"
        >
          <MapPin className="text-champagne shrink-0" size={16} />
          <div className="flex-1 min-w-0">
            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest">Ville du mariage</p>
            <input
              type="text"
              value={location}
              onChange={(e) => { setLocation(e.target.value); setShowLocDrop(true); }}
              onFocus={() => { closeAll(); setShowLocDrop(true); }}
              placeholder="Paris, Lyon, Bruxelles..."
              className="w-full bg-transparent font-body text-sm text-chocolate placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </button>
        {showLocDrop && filteredCities.length > 0 && (
          <DropList items={filteredCities} onSelect={(c) => { setLocation(c); setShowLocDrop(false); }} current={location} />
        )}
      </div>

      {/* Cultural origin */}
      <div ref={cultureRef} className="flex-1 relative">
        <button
          onClick={() => { closeAll(); setShowCultureDrop(!showCultureDrop); }}
          className="w-full flex items-center gap-3 px-5 py-4 text-left"
        >
          <Globe className="text-champagne shrink-0" size={16} />
          <div className="flex-1 min-w-0">
            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest">Origine culturelle</p>
            <input
              type="text"
              value={culture}
              onChange={(e) => { setCulture(e.target.value); setShowCultureDrop(true); }}
              onFocus={() => { closeAll(); setShowCultureDrop(true); }}
              placeholder="Congolais, Sénégalais..."
              className="w-full bg-transparent font-body text-sm text-chocolate placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </button>
        {showCultureDrop && filteredCultures.length > 0 && (
          <DropList items={filteredCultures} onSelect={(c) => { setCulture(c); setShowCultureDrop(false); }} current={culture} />
        )}
      </div>
    </>
  );

  return (
    <>
      <div className="max-w-4xl mx-auto relative z-[9999]">
        {/* ─── Desktop ─── */}
        <div className="hidden sm:flex bg-ivory/95 backdrop-blur-sm rounded-2xl shadow-elegant overflow-visible relative">
          <SearchFields />
          <Button variant="hero" className="m-1.5 rounded-xl shrink-0" onClick={handleSearch}>
            <Search size={18} />
            Rechercher
          </Button>
        </div>

        {/* ─── Mobile: hidden, CTA button handles it ─── */}
      </div>

      {/* ─── Mobile floating CTA ─── */}
      <div className="sm:hidden fixed bottom-6 left-4 right-4 z-[9998]">
        {!mobileOpen && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Button
              variant="hero"
              className="w-full rounded-2xl py-4 shadow-2xl text-base"
              onClick={() => setMobileOpen(true)}
            >
              <Search size={18} />
              Trouver un prestataire
            </Button>
          </motion.div>
        )}
      </div>

      {/* ─── Mobile search panel (slide up) ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="sm:hidden fixed inset-0 z-[10000] bg-ivory flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
              <h2 className="font-serif text-lg text-chocolate">Rechercher</h2>
              <button
                onClick={() => { setMobileOpen(false); closeAll(); }}
                className="p-2 rounded-full hover:bg-secondary/60 transition-colors"
              >
                <X size={20} className="text-chocolate" />
              </button>
            </div>

            {/* Fields */}
            <div className="flex-1 overflow-y-auto px-1 py-4">
              <div className="bg-white rounded-2xl shadow-elegant border border-border/50 overflow-visible">
                <SearchFields />
              </div>
            </div>

            {/* Search button */}
            <div className="px-5 pb-8 pt-3 border-t border-border bg-ivory">
              <Button variant="hero" className="w-full rounded-xl py-4 text-base" onClick={handleSearch}>
                <Search size={18} />
                Rechercher
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

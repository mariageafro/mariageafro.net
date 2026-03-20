import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/* ── Cultural origins for dropdown ── */
const culturalOrigins = [
  "Congolais", "Camerounais", "Sénégalais", "Ivoirien", "Nigérian",
  "Ghanéen", "Malien", "Guinéen", "Togolais", "Béninois",
  "Haïtien", "Guadeloupéen", "Martiniquais", "Cap-verdien",
  "Afro-américain", "Éthiopien", "Rwandais", "Burkinabè",
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

  const [showVendorDrop, setShowVendorDrop] = useState(false);
  const [showLocDrop, setShowLocDrop] = useState(false);
  const [showCultureDrop, setShowCultureDrop] = useState(false);

  const [cities, setCities] = useState<string[]>([]);
  const [cultures, setCultures] = useState<string[]>([]);

  const vendorRef = useRef<HTMLDivElement>(null);
  const locRef = useRef<HTMLDivElement>(null);
  const cultureRef = useRef<HTMLDivElement>(null);

  // Fetch real cities & cultures from DB
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

  const filteredCities = location
    ? cities.filter((c) => c.toLowerCase().includes(location.toLowerCase()))
    : cities.slice(0, 12);

  // Merge DB cultures with predefined, deduplicate
  const allCultures = [...new Set([...culturalOrigins, ...cultures])].sort();
  const filteredCultures = culture
    ? allCultures.filter((c) => c.toLowerCase().includes(culture.toLowerCase()))
    : allCultures.slice(0, 15);

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

        {/* Location */}
        <div ref={locRef} className="flex-1 relative">
          <button
            onClick={() => { closeAll(); setShowLocDrop(!showLocDrop); }}
            className="w-full flex items-center gap-3 px-5 py-4 border-r border-border text-left"
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
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-border z-[9999] w-full max-h-[280px] overflow-y-auto">
              {filteredCities.map((c) => (
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

        {/* Search Button */}
        <Button variant="hero" className="m-1.5 rounded-xl shrink-0" onClick={handleSearch}>
          <Search size={18} />
          Rechercher
        </Button>
      </div>

      {/* ─── Mobile ─── */}
      <div className="sm:hidden bg-white rounded-3xl p-5 shadow-elegant space-y-4 border border-border/50">
        {/* Vendor type */}
        <div>
          <p className="font-body text-[11px] text-chocolate/70 font-medium uppercase tracking-wider mb-1.5">Type de prestataire</p>
          <div className="flex items-center gap-2.5 bg-secondary/60 rounded-xl px-3 py-2.5">
            <Search size={15} className="text-champagne shrink-0" />
            <input
              type="text"
              value={vendorType}
              onChange={(e) => setVendorType(e.target.value)}
              placeholder="Photographe, DJ, vidéaste..."
              className="w-full bg-transparent font-body text-sm text-chocolate placeholder:text-muted-foreground/70 focus:outline-none"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Ville du mariage</p>
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <MapPin size={14} className="text-champagne shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Paris, Lyon, Bruxelles..."
              className="w-full bg-transparent font-body text-sm text-chocolate placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        {/* Cultural origin */}
        <div>
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Origine culturelle</p>
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <Globe size={14} className="text-champagne shrink-0" />
            <input
              type="text"
              value={culture}
              onChange={(e) => setCulture(e.target.value)}
              placeholder="Congolais, Sénégalais..."
              className="w-full bg-transparent font-body text-sm text-chocolate placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        <Button variant="hero" className="w-full mt-2" onClick={handleSearch}>
          <Search size={18} />
          Rechercher
        </Button>
      </div>
    </div>
  );
}

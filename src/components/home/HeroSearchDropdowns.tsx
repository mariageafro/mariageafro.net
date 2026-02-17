import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, MapPin, Navigation, Loader2, ChevronDown, Globe } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { RADIUS_OPTIONS } from "@/lib/priority-cities";
import { megaMenuCategories } from "@/components/layout/MegaMenuData";

/* ── Par Pays ── */
const paysItems = [
  { flag: "🇫🇷", label: "France", slug: "france" },
  { flag: "🇧🇪", label: "Belgique", slug: "belgique" },
  { flag: "🇬🇧", label: "Royaume-Uni", slug: "royaume-uni" },
  { flag: "🇩🇪", label: "Allemagne", slug: "allemagne" },
  { flag: "🇨🇩", label: "Congo", slug: "congo" },
  { flag: "🇨🇲", label: "Cameroun", slug: "cameroun" },
  { flag: "🇸🇳", label: "Sénégal", slug: "senegal" },
  { flag: "🇨🇮", label: "Côte d'Ivoire", slug: "cote-d-ivoire" },
  { flag: "🇳🇬", label: "Nigeria", slug: "nigeria" },
  { flag: "🇬🇵", label: "Guadeloupe", slug: "guadeloupe" },
  { flag: "🇲🇶", label: "Martinique", slug: "martinique" },
  { flag: "🇭🇹", label: "Haïti", slug: "haiti" },
];

/* ── Flat list for mobile ── */
const searchCategories = megaMenuCategories.flatMap(cat =>
  cat.subs.map(sub => ({ icon: sub.icon || cat.icon, label: sub.label, slug: cat.slug }))
);

/* ── Location Data ── */
const regions = [
  {
    name: "France",
    flag: "🇫🇷",
    cities: ["Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Toulouse", "Nantes", "Strasbourg"],
  },
  {
    name: "Belgique",
    flag: "🇧🇪",
    cities: ["Bruxelles", "Anvers", "Liège", "Gand"],
  },
  {
    name: "Allemagne",
    flag: "🇩🇪",
    cities: ["Berlin", "Francfort", "Munich", "Düsseldorf"],
  },
  {
    name: "Royaume-Uni",
    flag: "🇬🇧",
    cities: ["Londres", "Birmingham", "Manchester"],
  },
];

const internationalCountries = [
  { flag: "🇨🇩", name: "Congo" },
  { flag: "🇨🇲", name: "Cameroun" },
  { flag: "🇸🇳", name: "Sénégal" },
  { flag: "🇨🇮", name: "Côte d'Ivoire" },
  { flag: "🇳🇬", name: "Nigeria" },
  { flag: "🇬🇭", name: "Ghana" },
  { flag: "🇲🇱", name: "Mali" },
  { flag: "🇬🇵", name: "Guadeloupe" },
  { flag: "🇲🇶", name: "Martinique" },
  { flag: "🇭🇹", name: "Haïti" },
];



export function HeroSearchDropdowns() {
  const navigate = useNavigate();
  const [categorie, setCategorie] = useState("");
  const [categorieLabel, setCategorieLabel] = useState("");
  const [ville, setVille] = useState("");
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [locTab, setLocTab] = useState<"region" | "international">("region");
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const { geo, radius, setRadius, requestLocation } = useGeolocation();

  const catRef = useRef<HTMLDivElement>(null);
  const catDropdownRef = useRef<HTMLDivElement>(null);
  const locRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node) && catDropdownRef.current && !catDropdownRef.current.contains(e.target as Node)) setShowCatDropdown(false);
      if (locRef.current && !locRef.current.contains(e.target as Node)) setShowLocDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdowns on significant scroll
  useEffect(() => {
    let scrollStart: number | null = null;
    const onScroll = () => {
      if (scrollStart === null) scrollStart = window.scrollY;
      if (Math.abs(window.scrollY - scrollStart) > 80) {
        setShowCatDropdown(false);
        setShowLocDropdown(false);
        scrollStart = null;
      }
    };
    const onReset = () => { scrollStart = null; };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onReset, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onReset);
    };
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (ville) params.set("ville", ville);
    if (categorie) params.set("category", categorie);
    if (geo.enabled) params.set("geo", "1");
    navigate(`/prestataires${params.toString() ? `?${params}` : ""}`);
  };

  const selectCategory = (slug: string, label: string) => {
    setCategorie(slug);
    setCategorieLabel(label);
    setShowCatDropdown(false);
  };

  const selectCity = (city: string) => {
    setVille(city);
    setShowLocDropdown(false);
  };

  const isSelected = (label: string, slug: string) =>
    categorie === slug && categorieLabel === label;

  return (
    <div className="max-w-3xl mx-auto relative z-[9999]">
      {/* ─── Desktop ─── */}
      <div className="hidden sm:flex bg-ivory/95 backdrop-blur-sm rounded-2xl shadow-elegant overflow-visible relative">
        {/* Category input */}
        <div ref={catRef} className="flex-1">
          <button
            onClick={() => { setShowCatDropdown(!showCatDropdown); setShowLocDropdown(false); }}
            className="w-full flex items-center gap-3 px-6 py-4 border-r border-border text-left"
          >
            <Search className="text-champagne shrink-0" size={18} />
            <div className="flex-1 min-w-0">
              <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest">
                Catégorie
              </p>
              <p className={`font-body text-sm truncate ${categorieLabel ? "text-chocolate" : "text-muted-foreground"}`}>
                {categorieLabel || "Nom ou catégorie de prestataires"}
              </p>
            </div>
          </button>

        </div>

        {/* Location input */}
        <div ref={locRef} className="flex-1 relative">
          <div className="flex items-center">
            <button
              onClick={() => { setShowLocDropdown(!showLocDropdown); setShowCatDropdown(false); }}
              className="flex-1 flex items-center gap-3 px-6 py-4 text-left"
            >
              <MapPin className="text-champagne shrink-0" size={18} />
              <div className="flex-1 min-w-0">
                <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest">
                  Où
                </p>
                <p className={`font-body text-sm truncate ${ville ? "text-chocolate" : "text-muted-foreground"}`}>
                  {ville || "Ville ou pays"}
                </p>
              </div>
            </button>
            <button
              onClick={requestLocation}
              disabled={geo.loading}
              className={`shrink-0 p-2 mr-2 rounded-full transition-colors ${
                geo.enabled ? "bg-champagne/20 text-champagne" : "text-muted-foreground hover:text-champagne hover:bg-champagne/10"
              }`}
              title="Autour de moi"
            >
              {geo.loading ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
            </button>
          </div>

          {/* Location Dropdown */}
          {showLocDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-border z-[9999] w-[380px] max-h-[420px] overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-border">
                <button
                  onClick={() => setLocTab("region")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    locTab === "region"
                      ? "text-chocolate border-b-2 border-champagne"
                      : "text-muted-foreground hover:text-chocolate"
                  }`}
                >
                  Région
                </button>
                <button
                  onClick={() => setLocTab("international")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    locTab === "international"
                      ? "text-chocolate border-b-2 border-champagne"
                      : "text-muted-foreground hover:text-chocolate"
                  }`}
                >
                  International
                </button>
              </div>

              <div className="overflow-y-auto max-h-[360px]">
                {locTab === "region" ? (
                  <div>
                    {regions.map((region) => (
                      <div key={region.name} className="border-b border-border/30 last:border-0">
                        <button
                          onClick={() =>
                            setExpandedRegion(expandedRegion === region.name ? null : region.name)
                          }
                          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-champagne/5 transition-colors"
                        >
                          <span className="font-body text-sm text-chocolate flex items-center gap-2">
                            <span>{region.flag}</span> {region.name}
                          </span>
                          <ChevronDown
                            size={16}
                            className={`text-muted-foreground transition-transform ${
                              expandedRegion === region.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {expandedRegion === region.name && (
                          <div className="bg-muted/20 px-5 pb-3">
                            <div className="grid grid-cols-2 gap-1">
                              {region.cities.map((city) => (
                                <button
                                  key={city}
                                  onClick={() => selectCity(city)}
                                  className={`text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                                    ville === city
                                      ? "text-champagne bg-champagne/10"
                                      : "text-chocolate hover:bg-champagne/5"
                                  }`}
                                >
                                  {city}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {internationalCountries.map((country) => (
                      <button
                        key={country.name}
                        onClick={() => selectCity(country.name)}
                        className={`w-full flex items-center gap-3 px-5 py-3.5 text-left border-b border-border/30 last:border-0 hover:bg-champagne/5 transition-colors ${
                          ville === country.name ? "text-champagne bg-champagne/5" : "text-chocolate"
                        }`}
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="font-body text-sm">{country.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <Button
          variant="hero"
          className="m-1.5 rounded-xl shrink-0"
          onClick={handleSearch}
        >
          <Search size={18} />
          Rechercher
        </Button>
      </div>

      {/* ─── Category Mega Dropdown (positioned to match search bar width) ─── */}
      {showCatDropdown && (
        <div
          ref={catDropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-border z-[9999] hidden sm:block"
        >
          <div className="max-h-[75vh] overflow-y-auto overscroll-contain">
            {/* 3×3 category grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 p-5">
              {megaMenuCategories.map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <div key={cat.slug}>
                    <Link
                      to={`/categories/${cat.slug}`}
                      onClick={() => setShowCatDropdown(false)}
                      className="flex items-center gap-2 group mb-2"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-champagne/10 text-champagne shrink-0">
                        <CatIcon size={13} />
                      </span>
                      <span className="font-serif text-sm font-semibold text-chocolate group-hover:text-champagne transition-colors">
                        {cat.label}
                      </span>
                      <ChevronRight size={12} className="text-muted-foreground/50 group-hover:text-champagne transition-colors" />
                    </Link>
                    <ul className="space-y-0.5 pl-0.5">
                      {cat.subs.slice(0, 5).map((sub) => (
                        <li key={sub.slug}>
                          <button
                            onClick={() => selectCategory(cat.slug, sub.label)}
                            className={`w-full flex items-center gap-2 px-2 py-1 rounded-md font-body text-xs text-left transition-all
                              ${isSelected(sub.label, cat.slug)
                                ? "bg-champagne/10 text-champagne"
                                : "text-muted-foreground hover:text-champagne hover:bg-champagne/5"
                              }`}
                          >
                            {sub.icon && <sub.icon size={11} className="shrink-0" />}
                            {sub.label}
                          </button>
                        </li>
                      ))}
                      {cat.subs.length > 5 && (
                        <li>
                          <Link
                            to={`/categories/${cat.slug}`}
                            onClick={() => setShowCatDropdown(false)}
                            className="flex items-center gap-1 px-2 py-1 font-body text-xs text-champagne hover:text-champagne-dark transition-colors"
                          >
                            Voir tout →
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* ── Par Pays ── */}
            <div className="border-t border-border/40 px-5 py-3">
              <p className="flex items-center gap-2 font-semibold text-chocolate font-body text-[13px] mb-2">
                <Globe size={16} className="text-champagne" /> Trouver par pays
              </p>
              <div className="flex flex-wrap gap-2">
                {paysItems.map((pays) => (
                  <Link
                    key={pays.slug}
                    to={`/pays/${pays.slug}`}
                    onClick={() => setShowCatDropdown(false)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/50 text-xs font-body text-chocolate hover:bg-champagne/10 hover:border-champagne/40 transition-colors"
                  >
                    <span>{pays.flag}</span>
                    <span>{pays.label}</span>
                  </Link>
                ))}
                <Link
                  to="/trouver-par-pays"
                  onClick={() => setShowCatDropdown(false)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-champagne/30 bg-champagne/5 text-xs font-body font-semibold text-champagne hover:bg-champagne/10 transition-colors"
                >
                  Voir tous les pays →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Geo radius when active */}
      {geo.enabled && (
        <div className="hidden sm:flex items-center justify-center gap-2 mt-3">
          <span className="font-body text-sm text-ivory/80">📍 Rayon :</span>
          {RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRadius(opt.value)}
              className={`px-3 py-1 rounded-full font-body text-xs transition-all ${
                radius === opt.value
                  ? "bg-champagne text-primary-foreground shadow-md"
                  : "bg-ivory/20 text-ivory/80 hover:bg-ivory/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* ─── Mobile ─── */}
      <div className="sm:hidden bg-ivory/98 rounded-3xl p-6 shadow-elegant space-y-4">
        {/* Category */}
        <div>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">Catégorie</p>
          <select
            value={categorie}
            onChange={(e) => {
              setCategorie(e.target.value);
              const found = searchCategories.find((c) => c.slug === e.target.value);
              setCategorieLabel(found?.label || "");
            }}
            className="w-full bg-transparent font-body text-sm text-chocolate focus:outline-none cursor-pointer border-b border-border pb-2"
          >
            <option value="">Nom ou catégorie de prestataires</option>
            {megaMenuCategories.map((cat) => (
              <optgroup key={cat.slug} label={`${cat.emoji} ${cat.label}`}>
                {cat.subs.map((sub) => (
                  <option key={sub.slug} value={cat.slug}>{sub.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">Où</p>
          <div className="flex items-center gap-2">
            <select
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className="flex-1 bg-transparent font-body text-sm text-chocolate focus:outline-none cursor-pointer border-b border-border pb-2"
            >
              <option value="">Ville ou pays</option>
              {regions.map((r) => (
                <optgroup key={r.name} label={`${r.flag} ${r.name}`}>
                  {r.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </optgroup>
              ))}
              <optgroup label="🌍 International">
                {internationalCountries.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <button
              onClick={requestLocation}
              disabled={geo.loading}
              className={`shrink-0 p-2 rounded-full transition-colors ${
                geo.enabled ? "bg-champagne/20 text-champagne" : "text-muted-foreground hover:text-champagne"
              }`}
            >
              {geo.loading ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
            </button>
          </div>
        </div>

        {/* Search Button */}
        <Button variant="hero" className="w-full mt-4" onClick={handleSearch}>
          <Search size={18} />
          Rechercher
        </Button>
      </div>
    </div>
  );
}

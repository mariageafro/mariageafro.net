import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, MapPin, Navigation, Loader2, ChevronDown, Globe } from "lucide-react";
import {
  Camera, Video, Music, Utensils, Car, Palette,
  PartyPopper, Layout, Scissors, Crown, FileText, Gift, MapPin as MapPinIcon,
  Building2, Castle, Hotel, Church, Tent, Ship, UtensilsCrossed,
  Flower2, ClipboardList, Clapperboard, Moon, Cake, Shirt, Gem, Sparkles,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { RADIUS_OPTIONS } from "@/lib/priority-cities";

/* ── Category Items ── */
interface CatItem { icon: typeof Camera; label: string; slug: string; highlight?: boolean }

const col1Items: CatItem[] = [
  { icon: MapPinIcon, label: "Lieux de mariage", slug: "salle-lieu" },
  { icon: Building2, label: "Domaine mariage", slug: "salle-lieu" },
  { icon: Hotel, label: "Auberge mariage", slug: "salle-lieu" },
  { icon: Hotel, label: "Hôtel mariage", slug: "salle-lieu" },
  { icon: Utensils, label: "Restaurant mariage", slug: "salle-lieu" },
  { icon: Building2, label: "Salle mariage", slug: "salle-lieu" },
  { icon: Castle, label: "Château mariage", slug: "salle-lieu", highlight: true },
  { icon: Ship, label: "Bateau mariage", slug: "salle-lieu" },
  { icon: MapPinIcon, label: "Mariages à la plage", slug: "salle-lieu" },
  { icon: Utensils, label: "Traiteur mariage", slug: "traiteur" },
  { icon: FileText, label: "Faire part mariage", slug: "faire-part" },
  { icon: Gift, label: "Cadeaux invités mariage", slug: "cadeaux-invites" },
  { icon: Camera, label: "Photo mariage", slug: "photographe" },
];

const col2Items: CatItem[] = [
  { icon: Music, label: "Musique mariage", slug: "dj-musique" },
  { icon: Car, label: "Voiture mariage", slug: "transport" },
  { icon: Car, label: "Bus mariage", slug: "transport" },
  { icon: Palette, label: "Décoration mariage", slug: "decoration" },
  { icon: Tent, label: "Chapiteau mariage", slug: "salle-lieu" },
  { icon: PartyPopper, label: "Animation mariage", slug: "animation" },
  { icon: Flower2, label: "Fleurs mariage", slug: "decoration" },
  { icon: ClipboardList, label: "Liste de mariage", slug: "liste" },
  { icon: Layout, label: "Organisation mariage", slug: "wedding-planner" },
  { icon: Clapperboard, label: "Vidéo mariage", slug: "videaste" },
  { icon: Moon, label: "Lune de miel", slug: "lune-de-miel" },
  { icon: Cake, label: "Wedding cake", slug: "traiteur" },
];

const col3Items: CatItem[] = [
  { icon: Church, label: "Officiants", slug: "officiants" },
  { icon: UtensilsCrossed, label: "Food Truck", slug: "traiteur" },
  { icon: Crown, label: "Vin et Spiritueux", slug: "traiteur" },
  { icon: Gem, label: "Bijoux mariage", slug: "tenues-couture" },
];

const marieeItems: CatItem[] = [
  { icon: Shirt, label: "Robe de mariée", slug: "tenues-couture" },
  { icon: Sparkles, label: "Accessoires mariage", slug: "tenues-couture" },
  { icon: Shirt, label: "Robe de cocktail", slug: "tenues-couture" },
  { icon: Scissors, label: "Esthétique coiffure mariage", slug: "coiffure-beaute" },
];

const marieItems: CatItem[] = [
  { icon: Shirt, label: "Costumes mariage", slug: "tenues-couture" },
  { icon: Heart, label: "Soins beauté", slug: "coiffure-beaute" },
  { icon: Sparkles, label: "Accessoires marié", slug: "tenues-couture" },
];

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
const searchCategories = [
  ...col1Items, ...col2Items, ...col3Items, ...marieeItems, ...marieItems,
].filter((item, index, arr) => arr.findIndex(i => i.label === item.label) === index);

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

/* ── Reusable column item renderer ── */
function CatButton({
  cat,
  isHeader,
  isSelected,
  onSelect,
}: {
  cat: CatItem;
  isHeader?: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = cat.icon;
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg transition-colors
        ${cat.highlight ? "text-champagne font-medium" : ""}
        ${isHeader ? "font-semibold text-chocolate text-[13px]" : "text-sm"}
        ${isSelected ? "bg-champagne/10 text-champagne" : "text-chocolate hover:bg-muted/50"}
      `}
    >
      <Icon
        size={isHeader ? 18 : 16}
        className={`shrink-0 ${cat.highlight ? "text-champagne" : "text-muted-foreground"}`}
      />
      <span className="font-body">{cat.label}</span>
    </button>
  );
}

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
  const locRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setShowCatDropdown(false);
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
        <div ref={catRef} className="flex-1 relative">
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

          {/* ─── Category Mega Dropdown ─── */}
          {showCatDropdown && (
            <div
              className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-border z-[9999]"
              style={{ width: "min(780px, 90vw)" }}
            >
              <div className="max-h-[70vh] overflow-y-auto overscroll-contain">
                {/* 3-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40">
                  {/* ── Column 1: Lieux ── */}
                  <div className="p-3 space-y-0.5">
                    {col1Items.map((cat) => (
                      <CatButton
                        key={cat.label}
                        cat={cat}
                        isHeader={cat.label === "Lieux de mariage"}
                        isSelected={isSelected(cat.label, cat.slug)}
                        onSelect={() => selectCategory(cat.slug, cat.label)}
                      />
                    ))}
                  </div>

                  {/* ── Column 2: Musique + Services ── */}
                  <div className="p-3 space-y-0.5">
                    {col2Items.map((cat) => (
                      <CatButton
                        key={cat.label}
                        cat={cat}
                        isHeader={cat.label === "Musique mariage"}
                        isSelected={isSelected(cat.label, cat.slug)}
                        onSelect={() => selectCategory(cat.slug, cat.label)}
                      />
                    ))}
                  </div>

                  {/* ── Column 3: Officiants + Mariée + Marié + Par Pays + Outils ── */}
                  <div className="p-3 space-y-0.5">
                    {/* Officiants */}
                    {col3Items.map((cat) => (
                      <CatButton
                        key={cat.label}
                        cat={cat}
                        isHeader={cat.label === "Officiants"}
                        isSelected={isSelected(cat.label, cat.slug)}
                        onSelect={() => selectCategory(cat.slug, cat.label)}
                      />
                    ))}

                    {/* Mariée */}
                    <div className="pt-3 mt-1 border-t border-border/30">
                      <p className="flex items-center gap-2 px-3 py-2 font-semibold text-chocolate font-body text-[13px]">
                        <Shirt size={18} className="text-muted-foreground" /> Mariée
                      </p>
                      {marieeItems.map((cat) => (
                        <button
                          key={cat.label}
                          onClick={() => selectCategory(cat.slug, cat.label)}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 text-left rounded-lg transition-colors text-sm font-body
                            ${isSelected(cat.label, cat.slug) ? "bg-champagne/10 text-champagne" : "text-chocolate hover:bg-muted/50"}
                          `}
                        >
                          <span className="ml-7">{cat.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Marié */}
                    <div className="pt-3 mt-1 border-t border-border/30">
                      <p className="flex items-center gap-2 px-3 py-2 font-semibold text-chocolate font-body text-[13px]">
                        <Shirt size={18} className="text-muted-foreground" /> Marié
                      </p>
                      {marieItems.map((cat) => (
                        <button
                          key={cat.label}
                          onClick={() => selectCategory(cat.slug, cat.label)}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 text-left rounded-lg transition-colors text-sm font-body
                            ${isSelected(cat.label, cat.slug) ? "bg-champagne/10 text-champagne" : "text-chocolate hover:bg-muted/50"}
                          `}
                        >
                          <span className="ml-7">{cat.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Outils card */}
                    <div className="mt-3 p-4 rounded-xl border border-border bg-muted/20">
                      <p className="font-serif text-sm font-semibold text-chocolate mb-1">Outils d'organisation</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                        Liste de tâches, Budget, Plan de table et autres outils pratiques et gratuits !
                      </p>
                      <Link
                        to="/outils-maries"
                        onClick={() => setShowCatDropdown(false)}
                        className="text-xs font-semibold text-champagne hover:text-champagne-dark transition-colors"
                      >
                        Découvrez nos outils
                      </Link>
                    </div>
                  </div>
                </div>

                {/* ── Par Pays ── */}
                <div className="border-t border-border/40 px-4 py-3">
                  <p className="flex items-center gap-2 font-semibold text-chocolate font-body text-[13px] mb-2">
                    <Globe size={18} className="text-champagne" /> Trouver par pays
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {paysItems.map((pays) => (
                      <Link
                        key={pays.slug}
                        to={`/pays/${pays.slug}`}
                        onClick={() => setShowCatDropdown(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 text-sm font-body text-chocolate hover:bg-champagne/10 hover:border-champagne/40 transition-colors"
                      >
                        <span>{pays.flag}</span>
                        <span>{pays.label}</span>
                      </Link>
                    ))}
                    <Link
                      to="/trouver-par-pays"
                      onClick={() => setShowCatDropdown(false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-champagne/30 bg-champagne/5 text-sm font-body font-semibold text-champagne hover:bg-champagne/10 transition-colors"
                    >
                      Voir tous les pays →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            <optgroup label="📍 Lieux de mariage">
              {col1Items.map((c) => (
                <option key={c.label} value={c.slug}>{c.label}</option>
              ))}
            </optgroup>
            <optgroup label="🎵 Musique & Services">
              {col2Items.map((c) => (
                <option key={c.label} value={c.slug}>{c.label}</option>
              ))}
            </optgroup>
            <optgroup label="⛪ Officiants & Autres">
              {col3Items.map((c) => (
                <option key={c.label} value={c.slug}>{c.label}</option>
              ))}
            </optgroup>
            <optgroup label="👰 Mariée">
              {marieeItems.map((c) => (
                <option key={c.label} value={c.slug}>{c.label}</option>
              ))}
            </optgroup>
            <optgroup label="🤵 Marié">
              {marieItems.map((c) => (
                <option key={c.label} value={c.slug}>{c.label}</option>
              ))}
            </optgroup>
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

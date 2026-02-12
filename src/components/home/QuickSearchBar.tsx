import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { PRIORITY_CITIES, RADIUS_OPTIONS } from "@/lib/priority-cities";

const heroCategories = [
  { name: "Vidéaste", slug: "videaste" },
  { name: "Photographe", slug: "photographe" },
  { name: "DJ & Musique", slug: "dj-musique" },
  { name: "Wedding Planner", slug: "wedding-planner" },
  { name: "Animation", slug: "animation" },
  { name: "Chorégraphie / Flashmob", slug: "choregraphie-flashmob" },
  { name: "Photo Booth / Vidéo Booth", slug: "photo-booth-video-booth" },
  { name: "Vidéo Live / Diffusion en direct", slug: "video-live-diffusion" },
  { name: "Atalaku / Sebene", slug: "atalaku-sebene" },
  { name: "Gospel / Chorale", slug: "gospel-chorale" },
  { name: "Groupe musical (violon/flûte/guitare)", slug: "groupe-musical" },
  { name: "Groupe folklorique", slug: "groupe-folklorique" },
  { name: "Pasteur / Prédicateur (Église)", slug: "pasteur-predicateur" },
  { name: "Location matériel", slug: "location-materiel" },
  { name: "Sonorisation", slug: "sonorisation" },
  { name: "Lumières / Éclairage", slug: "lumieres-eclairage" },
  { name: "Décoration", slug: "decoration" },
  { name: "Traiteur", slug: "traiteur" },
  { name: "Tenues & Couture", slug: "tenues-couture" },
  { name: "Demande en mariage surprise", slug: "demande-mariage-surprise" },
];

export function QuickSearchBar() {
  const navigate = useNavigate();
  const [ville, setVille] = useState("");
  const [categorie, setCategorie] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const { geo, radius, setRadius, requestLocation, disableGeo } = useGeolocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > window.innerHeight - 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (ville) params.set("ville", ville);
    if (categorie) params.set("category", categorie);
    if (geo.enabled) params.set("geo", "1");
    navigate(`/prestataires${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div
      className={`w-full z-40 transition-all duration-300 ${
        isSticky
          ? "fixed top-14 left-0 bg-ivory/95 backdrop-blur-md shadow-elegant border-b border-border"
          : "relative -mt-8 bg-background"
      }`}
    >
      <div className="container-editorial py-1.5">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
          {/* Location */}
          <div className="flex-1 relative flex items-center gap-2">
            <MapPin className="absolute left-3 text-champagne shrink-0" size={18} />
            <select
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50 cursor-pointer"
            >
              <option value="">Choisir une ville</option>
              <optgroup label="Villes principales">
                {PRIORITY_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.country})
                  </option>
                ))}
              </optgroup>
            </select>
            <button
              onClick={() => geo.enabled ? disableGeo() : requestLocation()}
              disabled={geo.loading}
              className={`shrink-0 p-2 rounded-full transition-colors ${
                geo.enabled
                  ? "bg-champagne/20 text-champagne"
                  : "text-muted-foreground hover:text-champagne hover:bg-champagne/10"
              }`}
              title={geo.enabled ? "Désactiver la géolocalisation" : "Autour de moi"}
            >
              {geo.loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Navigation size={16} />
              )}
            </button>
          </div>

          {/* Category */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-champagne shrink-0" size={18} />
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50 cursor-pointer"
            >
              <option value="">Choisir un prestataire</option>
              {heroCategories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <Button variant="hero" className="shrink-0" onClick={handleSearch}>
            <Search size={16} />
            <span className="sm:inline">Rechercher</span>
          </Button>
        </div>

        {/* Geo radius when active */}
        {geo.enabled && (
          <div className="flex items-center gap-2 mt-2">
            <span className="font-body text-xs text-muted-foreground">📍 Rayon :</span>
            {RADIUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRadius(opt.value)}
                className={`px-3 py-1 rounded-full font-body text-xs transition-all ${
                  radius === opt.value
                    ? "bg-champagne text-primary-foreground shadow-md"
                    : "bg-secondary text-muted-foreground hover:bg-champagne/10"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

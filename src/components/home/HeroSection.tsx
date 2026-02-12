import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useGeolocation } from "@/hooks/use-geolocation";
import { PRIORITY_CITIES, RADIUS_OPTIONS } from "@/lib/priority-cities";
import heroImage from "@/assets/hero-couple.jpg";

const stats = [
  { number: "500+", label: "Prestataires sélectionnés" },
  { number: "15k+", label: "Mariages célébrés" },
  { number: "25+", label: "Pays représentés" },
];

// Category order: Vidéaste first
const heroCategories = [
  { name: "Vidéaste", slug: "videaste" },
  { name: "Photographe", slug: "photographe" },
  { name: "DJ & Musique", slug: "dj-musique" },
  { name: "Wedding Planner", slug: "wedding-planner" },
  { name: "Animation", slug: "animation" },
  { name: "Coiffure & Beauté", slug: "coiffure-beaute" },
  { name: "Décoration", slug: "decoration" },
  { name: "Traiteur", slug: "traiteur" },
  { name: "Tenues & Couture", slug: "tenues-couture" },
];

export function HeroSection() {
  const navigate = useNavigate();
  const [ville, setVille] = useState("");
  const [categorie, setCategorie] = useState("");
  const { geo, radius, setRadius, requestLocation } = useGeolocation();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (ville) params.set("ville", ville);
    if (categorie) params.set("category", categorie);
    if (geo.enabled) params.set("geo", "1");
    navigate(`/prestataires${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Couple afro en tenue de mariage traditionnelle"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-chocolate/40 via-chocolate/30 to-chocolate/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-editorial pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
            style={{
              background: "linear-gradient(135deg, hsla(38, 45%, 50%, 0.9) 0%, hsla(43, 75%, 55%, 0.9) 100%)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-ivory animate-pulse" />
            <span className="font-body text-sm font-medium tracking-wider text-ivory uppercase">
              La Plateforme N°1 du Mariage Afro
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-title text-ivory mb-4"
          >
            La Référence du
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-title hero-title-accent mb-8"
          >
            Mariage Afro
          </motion.p>

          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-32 h-px mx-auto mb-8"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(43, 75%, 55%), transparent)",
            }}
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="hero-subtitle text-ivory/90 mb-12 max-w-2xl mx-auto"
          >
            Trouvez les meilleurs prestataires pour votre mariage,
            <br className="hidden sm:block" />
            par culture, par pays et par tradition.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            {/* Desktop */}
            <div className="hidden sm:flex bg-ivory/95 backdrop-blur-sm rounded-full p-2 shadow-elegant gap-0">
              {/* Location */}
              <div className="flex-1 flex items-center gap-3 px-6 py-3 border-r border-border">
                <MapPin className="text-champagne shrink-0" size={20} />
                <div className="text-left flex-1">
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                    Localisation
                  </p>
                  <select
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="w-full bg-transparent font-body text-sm text-chocolate focus:outline-none cursor-pointer"
                  >
                    <option value="">Choisir une ville</option>
                    <optgroup label="Villes principales">
                      {PRIORITY_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>{c.name} ({c.country})</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                {/* Geolocation button */}
                <button
                  onClick={requestLocation}
                  disabled={geo.loading}
                  className={`shrink-0 p-2 rounded-full transition-colors ${
                    geo.enabled ? "bg-champagne/20 text-champagne" : "text-muted-foreground hover:text-champagne hover:bg-champagne/10"
                  }`}
                  title="Autour de moi"
                >
                  {geo.loading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                </button>
              </div>

              {/* Category */}
              <div className="flex-1 flex items-center gap-3 px-6 py-3">
                <Search className="text-champagne shrink-0" size={20} />
                <div className="text-left flex-1">
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                    Catégorie
                  </p>
                  <select
                    value={categorie}
                    onChange={(e) => setCategorie(e.target.value)}
                    className="w-full bg-transparent font-body text-sm text-chocolate focus:outline-none cursor-pointer"
                  >
                    <option value="">Choisir un prestataire</option>
                    {heroCategories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <Button variant="hero" className="m-0" onClick={handleSearch}>
                <Search size={18} />
                Rechercher
              </Button>
            </div>

            {/* Geo radius when active */}
            {geo.enabled && (
              <div className="hidden sm:flex items-center justify-center gap-2 mt-3">
                <span className="font-body text-sm text-ivory/80">📍 Rayon :</span>
                {RADIUS_OPTIONS.map(opt => (
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

            {geo.error && (
              <p className="hidden sm:block mt-2 text-sm font-body text-ivory/70">{geo.error}</p>
            )}

            {/* Mobile Search Card */}
            <div className="sm:hidden bg-ivory/98 rounded-3xl p-6 shadow-elegant space-y-4">
              {/* Location */}
              <div>
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Localisation
                </p>
                <div className="flex items-center gap-2">
                  <select
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="flex-1 bg-transparent font-body text-sm text-chocolate focus:outline-none cursor-pointer border-b border-border pb-2"
                  >
                    <option value="">Choisir une ville</option>
                    <optgroup label="Villes principales">
                      {PRIORITY_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>{c.name} ({c.country})</option>
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
                {geo.enabled && (
                  <div className="flex gap-2 mt-2">
                    {RADIUS_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setRadius(opt.value)}
                        className={`px-3 py-1 rounded-full font-body text-xs transition-all ${
                          radius === opt.value
                            ? "bg-champagne text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Catégorie
                </p>
                <select
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                  className="w-full bg-transparent font-body text-sm text-chocolate focus:outline-none cursor-pointer border-b border-border pb-2"
                >
                  <option value="">Choisir un prestataire</option>
                  {heroCategories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <Button variant="hero" className="w-full mt-4" onClick={handleSearch}>
                <Search size={18} />
                Rechercher
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 mb-24 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-serif text-2xl md:text-3xl font-light text-gold leading-none">
                  {stat.number}
                </p>
                <p className="font-body text-[9px] md:text-[11px] text-ivory/50 uppercase tracking-[0.2em] mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

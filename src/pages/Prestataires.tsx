import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Heart, Grid, List, X, SlidersHorizontal, Globe, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { usePrestataires } from "@/hooks/use-prestataires";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Skeleton } from "@/components/ui/skeleton";
import { PRIORITY_CITIES, RADIUS_OPTIONS } from "@/lib/priority-cities";
import { useEffect } from "react";
import { DevenirPrestatairePopup } from "@/components/home/DevenirPrestatairePopup";

import categoryVideaste from "@/assets/category-videaste.jpg";
import categoryPhotographe from "@/assets/category-photographe.jpg";
import categoryDjMusique from "@/assets/category-djmusique.jpg";
import categoryWeddingPlanner from "@/assets/category-weddingplanner.jpg";
import categoryAnimation from "@/assets/category-animation.jpg";
import categoryCoiffureBeaute from "@/assets/category-coiffurebeaute.jpg";

const ratingOptions = [
  { label: "Toutes", value: 0 },
  { label: "4+ ★", value: 4 },
  { label: "4.5+ ★", value: 4.5 },
  { label: "5 ★", value: 5 },
];

const featuredCategories = [
  { name: "Vidéaste", slug: "videaste", image: categoryVideaste },
  { name: "Photographe", slug: "photographe", image: categoryPhotographe },
  { name: "DJ & Musique", slug: "dj-musique", image: categoryDjMusique },
  { name: "Wedding Planner", slug: "wedding-planner", image: categoryWeddingPlanner },
  { name: "Animation", slug: "animation", image: categoryAnimation },
  { name: "Coiffure & Beauté", slug: "coiffure-beaute", image: categoryCoiffureBeaute },
];

export default function Prestataires() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchParams] = useSearchParams();

  const {
    prestataires,
    isLoading,
    filters,
    updateFilter,
    resetFilters,
    categories,
    villes,
    cultures,
    langues,
    geoLocation,
    setGeoLocation,
  } = usePrestataires();

  const { geo, radius, setRadius, requestLocation, disableGeo } = useGeolocation();

  // Sync URL category param
  useEffect(() => {
    const catSlug = searchParams.get("category");
    if (catSlug && categories.length > 0) {
      const cat = categories.find(c => c.slug === catSlug);
      if (cat) updateFilter("categorie", cat.id);
    }
  }, [searchParams, categories]);

  // Sync geolocation with hook
  useEffect(() => {
    if (geo.enabled && geo.lat && geo.lng) {
      setGeoLocation({ lat: geo.lat, lng: geo.lng, radius });
      updateFilter("sort", "distance");
    }
  }, [geo.enabled, geo.lat, geo.lng, radius]);

  const handleToggleGeo = () => {
    if (geo.enabled) {
      disableGeo();
      setGeoLocation(null);
      updateFilter("sort", "pertinence");
    } else {
      requestLocation();
    }
  };

  const hasActiveFilters = filters.search || filters.ville || filters.categorie || filters.culture || filters.langue || filters.noteMin > 0 || filters.country || geo.enabled;

  const selectClass = "px-4 py-3 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50 appearance-none cursor-pointer";

  // Priority cities for the ville dropdown
  const priorityCityNames = PRIORITY_CITIES.map(c => c.name);
  const otherVilles = villes.filter(v => !priorityCityNames.includes(v));

  return (
    <Layout>
      {/* Hero - DO NOT MODIFY */}
      <section className="pt-32 pb-12 bg-gradient-warm">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-chocolate mb-4">
              Nos <span className="text-gradient-gold italic">Prestataires</span>
            </h1>
            <p className="font-body text-muted-foreground">
              Découvrez les meilleurs professionnels du mariage afro, sélectionnés pour leur expertise et leur compréhension de nos cultures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories - scrolls naturally */}
      <section className="py-12 bg-background">
        <div className="container-editorial">
          <h2 className="font-serif text-2xl text-chocolate mb-8">Catégories vedettes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {featuredCategories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Link
                  to={`/categories/${category.slug}`}
                  className="group block rounded-lg overflow-hidden aspect-square"
                >
                  <div className="relative h-full">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-chocolate/40 to-transparent flex items-end">
                      <p className="font-serif text-sm text-ivory p-3 group-hover:text-gold transition-colors">
                        {category.name}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compact Filter Bar - sticky */}
      <section className="py-4 bg-ivory/95 backdrop-blur-md border-b border-border sticky top-14 z-40">
        <div className="container-editorial">
          {/* Search bar + toggle */}
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Rechercher un prestataire..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50"
              />
            </div>

            {/* Geolocation Button */}
            <Button
              variant={geo.enabled ? "default" : "outline"}
              size="sm"
              onClick={handleToggleGeo}
              className={`shrink-0 gap-1.5 ${geo.enabled ? "bg-champagne text-primary-foreground hover:bg-champagne-dark" : ""}`}
              disabled={geo.loading}
            >
              {geo.loading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
              <span className="hidden sm:inline">Autour de moi</span>
            </Button>

            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <SlidersHorizontal size={18} />
            </Button>

            {/* View Toggle */}
            <div className="hidden sm:flex gap-1 p-1 bg-secondary rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Geo status messages */}
          {geo.error && (
            <p className="mt-2 text-sm font-body text-destructive">{geo.error}</p>
          )}

          {/* Radius selector when geo is active */}
          {geo.enabled && (
            <div className="flex items-center gap-2 mt-3">
              <span className="font-body text-sm text-muted-foreground">Rayon :</span>
              {RADIUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setRadius(opt.value); setGeoLocation({ lat: geo.lat!, lng: geo.lng!, radius: opt.value }); }}
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

          {/* Desktop Filters */}
          <div className={`mt-3 gap-3 flex-wrap items-center ${showMobileFilters ? 'flex' : 'hidden lg:flex'}`}>
            {/* Ville with priority cities */}
            <select
              value={filters.ville}
              onChange={(e) => updateFilter('ville', e.target.value)}
              className={selectClass}
              disabled={geo.enabled}
            >
              <option value="">📍 Toutes les villes</option>
              <optgroup label="Villes principales">
                {PRIORITY_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name} ({c.country})</option>
                ))}
              </optgroup>
              {otherVilles.length > 0 && (
                <optgroup label="Autres villes">
                  {otherVilles.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </optgroup>
              )}
            </select>

            {/* Catégorie */}
            <select
              value={filters.categorie}
              onChange={(e) => updateFilter('categorie', e.target.value)}
              className={selectClass}
            >
              <option value="">🏷️ Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Culture */}
            <select
              value={filters.culture}
              onChange={(e) => updateFilter('culture', e.target.value)}
              className={selectClass}
            >
              <option value="">🌍 Toutes les cultures</option>
              {cultures.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Langue */}
            <select
              value={filters.langue}
              onChange={(e) => updateFilter('langue', e.target.value)}
              className={selectClass}
            >
              <option value="">💬 Toutes les langues</option>
              {langues.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            {/* Note minimum */}
            <select
              value={filters.noteMin}
              onChange={(e) => updateFilter('noteMin', Number(e.target.value))}
              className={selectClass}
            >
              {ratingOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>⭐ {opt.label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value as any)}
              className={selectClass}
            >
              <option value="pertinence">Pertinence</option>
              {geo.enabled && <option value="distance">Distance</option>}
              <option value="note">Note (décroissant)</option>
              <option value="avis">Avis (décroissant)</option>
            </select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={() => { resetFilters(); disableGeo(); }} className="text-muted-foreground">
                <X size={16} className="mr-1" />
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Category Pills - scroll naturally */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2 -mx-1 px-1">
            <button
              onClick={() => updateFilter('categorie', '')}
              className={`px-4 py-2 rounded-full font-body text-sm whitespace-nowrap transition-all ${
                !filters.categorie
                  ? "bg-champagne text-primary-foreground shadow-md"
                  : "bg-secondary text-muted-foreground hover:bg-champagne/10"
              }`}
            >
              Tous
            </button>
            {(() => {
              // Vidéaste first, then Photographe, then DJ, then Wedding Planner
              const priorityOrder = ['Vidéaste', 'Photographe', 'DJ & Musique', 'Wedding Planner', 'Animation', 'Coiffure & Beauté'];
              const sorted = [
                ...priorityOrder.map(name => categories.find(cat => cat.name === name)).filter(Boolean) as typeof categories,
                ...categories.filter(cat => !priorityOrder.includes(cat.name) && cat.name !== 'Caraïbes'),
              ];
              return sorted.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateFilter('categorie', filters.categorie === cat.id ? '' : cat.id)}
                  className={`px-4 py-2 rounded-full font-body text-sm whitespace-nowrap transition-all ${
                    filters.categorie === cat.id
                      ? "bg-champagne text-primary-foreground shadow-md"
                      : "bg-secondary text-muted-foreground hover:bg-champagne/10"
                  }`}
                >
                  {cat.name}
                </button>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section-padding bg-gradient-warm">
        <div className="container-editorial">
          <div className="flex items-center justify-between mb-8">
            <p className="font-body text-muted-foreground">
              <span className="font-medium text-foreground">{prestataires.length}</span> prestataire{prestataires.length !== 1 ? 's' : ''} trouvé{prestataires.length !== 1 ? 's' : ''}
              {geo.enabled && ` dans un rayon de ${radius} km`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-premium">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : prestataires.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-serif text-chocolate mb-2">Aucun prestataire trouvé</h3>
              <p className="font-body text-muted-foreground mb-6">
                Essayez de modifier vos filtres pour élargir la recherche.
              </p>
              <Button variant="gold" onClick={() => { resetFilters(); disableGeo(); }}>
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
              {prestataires.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.03 }}
                >
                  <Link to={`/prestataires/${p.slug}`} className={`group block card-premium ${viewMode === 'list' ? 'flex' : ''}`}>
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 shrink-0' : 'aspect-[4/3]'}`}>
                      <img
                        src={p.cover_url || categoryVideaste}
                        alt={p.nom_entreprise}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ivory/90 flex items-center justify-center hover:bg-ivory transition-colors">
                        <Heart size={16} className="text-chocolate" />
                      </button>
                      {p.categories && (
                        <div className="absolute bottom-3 left-3">
                          <span className="px-3 py-1 rounded-full bg-ivory/90 font-body text-xs font-medium text-chocolate">
                            {p.categories.name}
                          </span>
                        </div>
                      )}
                      {p.verified && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 rounded-full bg-champagne/90 font-body text-[10px] font-semibold text-primary-foreground uppercase tracking-wider">
                            Vérifié
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1">
                      <h3 className="font-serif text-lg text-chocolate mb-1 group-hover:text-champagne transition-colors">
                        {p.nom_entreprise}
                      </h3>
                      {p.ville && (
                        <div className="flex items-center gap-1.5 text-muted-foreground font-body text-sm mb-2">
                          <MapPin size={14} />
                          {p.ville}{p.pays ? `, ${p.pays}` : ''}
                          {p.distance !== undefined && (
                            <span className="ml-1 text-champagne-dark font-medium">· {p.distance < 1 ? '<1' : Math.round(p.distance)} km</span>
                          )}
                        </div>
                      )}
                      {p.origine_culturelle && (
                        <p className="font-body text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Globe size={12} />
                          {p.origine_culturelle}
                        </p>
                      )}
                      {p.langues && p.langues.length > 0 && (
                        <div className="flex gap-1 flex-wrap mb-3">
                          {p.langues.slice(0, 3).map(l => (
                            <span key={l} className="px-2 py-0.5 rounded-full bg-secondary font-body text-[11px] text-muted-foreground">
                              {l}
                            </span>
                          ))}
                          {p.langues.length > 3 && (
                            <span className="px-2 py-0.5 rounded-full bg-secondary font-body text-[11px] text-muted-foreground">
                              +{p.langues.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {p.review_count > 0 ? (
                            <>
                              <Star size={16} className="text-gold fill-gold" />
                              <span className="font-body text-sm font-medium">{p.avg_rating.toFixed(1)}</span>
                              <span className="font-body text-xs text-muted-foreground">({p.review_count} avis)</span>
                            </>
                          ) : (
                            <span className="font-body text-xs text-muted-foreground italic">Nouveau</span>
                          )}
                        </div>
                        <span className="font-body text-xs text-champagne font-medium group-hover:underline">
                          Voir le profil →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <DevenirPrestatairePopup />
    </Layout>
  );
}

import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, Heart, Grid, List, SlidersHorizontal, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { usePrestataires } from "@/hooks/use-prestataires";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Skeleton } from "@/components/ui/skeleton";
import { LieuFilterSidebar } from "@/components/lieux/LieuFilterSidebar";
import { supabase } from "@/integrations/supabase/client";

import categoryVideaste from "@/assets/category-videaste.jpg";

const ITEMS_PER_PAGE = 12;
const LIEU_CATEGORY_ID = "3c604226-6ea4-482b-8de3-dc83375d1932";

const VENUE_TYPES = [
  "Salle de réception", "Domaine & Château", "Hôtel", "Auberge",
  "Restaurant", "Corps de ferme", "Pavillon", "Espace culturel", "Bateau", "Loft"
];

export default function Lieux() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [venueTypeFilter, setVenueTypeFilter] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const {
    prestataires, isLoading, filters, updateFilter, resetFilters,
    categories, villes, cultures, langues, geoLocation, setGeoLocation,
  } = usePrestataires({ categorie: LIEU_CATEGORY_ID });


  // Fetch sub-categories for lieux
  useEffect(() => {
    const fetchSubCats = async () => {
      const { data } = await supabase
        .from('sub_categories')
        .select('id, name, slug')
        .eq('category_id', LIEU_CATEGORY_ID)
        .order('name');
      if (data) setSubCategories(data);
    };
    fetchSubCats();
  }, []);

  const { geo, radius, setRadius, requestLocation, disableGeo } = useGeolocation();

  // Sync geolocation
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

  // Additional client-side filter for venue type (sous_categorie field)
  const filteredLieux = useMemo(() => {
    if (venueTypeFilter.length === 0) return prestataires;
    return prestataires.filter(p =>
      p.sous_categorie && venueTypeFilter.some(t => p.sous_categorie?.toLowerCase().includes(t.toLowerCase()))
    );
  }, [prestataires, venueTypeFilter]);

  const hasActiveFilters = filters.search || filters.ville || filters.culture || filters.langue || filters.noteMin > 0 || filters.country || geo.enabled || venueTypeFilter.length > 0;

  // Pagination
  const totalPages = Math.ceil(filteredLieux.length / ITEMS_PER_PAGE);
  const paginatedLieux = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLieux.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLieux, currentPage]);

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (currentPage > 1) setPage(1);
  }, [filters, geoLocation, venueTypeFilter]);

  const handleResetAll = () => {
    disableGeo();
    setVenueTypeFilter([]);
    resetFilters(); // Hook preserves locked categorie filter
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-warm">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-chocolate mb-4">
              Lieux de <span className="text-gradient-gold italic">Réception</span>
            </h1>
            <p className="font-body text-muted-foreground">
              Trouvez le lieu de mariage parfait : domaines, châteaux, salles de réception et espaces uniques pour célébrer votre union.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content with sidebar */}
      <section className="bg-gradient-warm min-h-screen">
        <div className="container-editorial py-8">
          <div className="flex gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-[300px] shrink-0">
              <div className="bg-card rounded-2xl border border-border shadow-card">
                <LieuFilterSidebar
                  filters={filters}
                  updateFilter={updateFilter}
                  resetFilters={handleResetAll}
                  villes={villes}
                  cultures={cultures}
                  langues={langues}
                  geo={geo}
                  radius={radius}
                  setRadius={setRadius}
                  onToggleGeo={handleToggleGeo}
                  onSetGeoLocation={setGeoLocation}
                  hasActiveFilters={!!hasActiveFilters}
                  venueTypes={VENUE_TYPES}
                  venueTypeFilter={venueTypeFilter}
                  setVenueTypeFilter={setVenueTypeFilter}
                  subCategories={subCategories}
                />
              </div>
            </aside>

            {/* Mobile filter drawer */}
            <AnimatePresence>
              {showMobileFilters && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 lg:hidden"
                    onClick={() => setShowMobileFilters(false)}
                  />
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed inset-y-0 left-0 w-[320px] max-w-[85vw] bg-card z-50 shadow-elegant overflow-y-auto lg:hidden"
                  >
                    <LieuFilterSidebar
                      filters={filters}
                      updateFilter={updateFilter}
                      resetFilters={handleResetAll}
                      villes={villes}
                      cultures={cultures}
                      langues={langues}
                      geo={geo}
                      radius={radius}
                      setRadius={setRadius}
                      onToggleGeo={handleToggleGeo}
                      onSetGeoLocation={setGeoLocation}
                      hasActiveFilters={!!hasActiveFilters}
                      venueTypes={VENUE_TYPES}
                      venueTypeFilter={venueTypeFilter}
                      setVenueTypeFilter={setVenueTypeFilter}
                      subCategories={subCategories}
                      onClose={() => setShowMobileFilters(false)}
                      isMobile
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Right content */}
            <div className="flex-1 min-w-0">
              {/* Search bar + controls */}
              <div className="flex gap-3 items-center mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher un lieu de réception..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50"
                  />
                </div>

                <Button
                  variant="outline"
                  className="lg:hidden shrink-0 gap-2"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <SlidersHorizontal size={18} />
                  <span className="hidden sm:inline">Filtres</span>
                </Button>

                <div className="hidden sm:flex gap-1 p-1 bg-secondary rounded-lg shrink-0">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>

              {/* Results count */}
              <div className="flex items-center justify-between mb-6">
                <p className="font-body text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{filteredLieux.length}</span> lieu{filteredLieux.length !== 1 ? 'x' : ''} trouvé{filteredLieux.length !== 1 ? 's' : ''}
                  {geo.enabled && ` dans un rayon de ${radius} km`}
                </p>
                {totalPages > 1 && (
                  <p className="font-body text-xs text-muted-foreground">
                    Page {currentPage} / {totalPages}
                  </p>
                )}
              </div>

              {/* Grid */}
              {isLoading ? (
                <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
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
              ) : paginatedLieux.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🏛️</div>
                  <h3 className="font-serif text-chocolate mb-2">Aucun lieu trouvé</h3>
                  <p className="font-body text-muted-foreground mb-6">
                    Essayez de modifier vos filtres pour élargir la recherche.
                  </p>
                  <Button variant="gold" onClick={handleResetAll}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              ) : (
                <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                  {paginatedLieux.map((p, index) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.03 }}
                    >
                      <Link to={`/prestataires/${p.slug}`} className={`group block card-premium ${viewMode === 'list' ? 'flex' : ''}`}>
                        <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 shrink-0' : 'aspect-[4/3]'}`}>
                          <img
                            src={p.cover_url || p.photo_url || categoryVideaste}
                            alt={p.nom_entreprise}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <button
                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ivory/90 flex items-center justify-center hover:bg-ivory transition-colors"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Heart size={16} className="text-chocolate" />
                          </button>
                          {p.badge_type && p.badge_type !== 'FREE' && (
                            <div className="absolute top-3 left-3">
                              <span className="px-2.5 py-1 rounded-full bg-champagne/90 font-body text-[10px] font-semibold text-primary-foreground uppercase tracking-wider">
                                {p.badge_type === 'PREMIUM' ? 'Premium' : p.badge_type === 'VIP' ? 'VIP' : p.badge_type === 'FOUNDER' ? 'Fondateur' : p.badge_type}
                              </span>
                            </div>
                          )}
                          {p.sous_categorie && (
                            <div className="absolute bottom-3 left-3">
                              <span className="px-3 py-1 rounded-full bg-ivory/90 font-body text-xs font-medium text-chocolate">
                                {p.sous_categorie}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-1">
                          <h3 className="font-serif text-base text-chocolate mb-1 group-hover:text-champagne transition-colors line-clamp-1">
                            {p.nom_entreprise}
                          </h3>
                          {p.ville && (
                            <div className="flex items-center gap-1.5 text-muted-foreground font-body text-xs mb-2">
                              <MapPin size={12} />
                              {p.ville}{p.pays ? `, ${p.pays}` : ''}
                              {p.distance !== undefined && (
                                <span className="ml-1 text-champagne-dark font-medium">· {p.distance < 1 ? '<1' : Math.round(p.distance)} km</span>
                              )}
                            </div>
                          )}
                          {p.description && (
                            <p className="font-body text-xs text-muted-foreground mb-2 line-clamp-2">
                              {p.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1">
                              {p.review_count > 0 ? (
                                <>
                                  <Star size={14} className="text-gold fill-gold" />
                                  <span className="font-body text-sm font-medium">{p.avg_rating.toFixed(1)}</span>
                                  <span className="font-body text-xs text-muted-foreground">({p.review_count})</span>
                                </>
                              ) : (
                                <span className="font-body text-xs text-muted-foreground italic">Nouveau</span>
                              )}
                            </div>
                            <span className="font-body text-xs text-champagne font-medium group-hover:underline">
                              Voir →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && !isLoading && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setPage(currentPage - 1)}
                    className="gap-1"
                  >
                    <ChevronLeft size={16} /> Précédent
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => {
                      let pageNum: number;
                      if (totalPages <= 10) {
                        pageNum = i + 1;
                      } else if (currentPage <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 4) {
                        pageNum = totalPages - 9 + i;
                      } else {
                        pageNum = currentPage - 4 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 rounded-lg font-body text-sm transition-all ${
                            currentPage === pageNum
                              ? "bg-champagne text-primary-foreground shadow-sm font-medium"
                              : "hover:bg-secondary text-muted-foreground"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage(currentPage + 1)}
                    className="gap-1"
                  >
                    Suivant <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
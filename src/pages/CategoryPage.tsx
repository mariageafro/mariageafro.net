import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, Globe, Search, Grid, List, SlidersHorizontal, ChevronLeft, ChevronRight, BadgeCheck, MessageCircle, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrestataires } from "@/hooks/use-prestataires";
import { useGeolocation } from "@/hooks/use-geolocation";
import { FavoriteButton } from "@/components/prestataire/FavoriteButton";
import { FilterSidebar, ActiveFilterChips } from "@/components/prestataire/FilterSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

import categoryDj from "@/assets/category-dj.jpg";
import categoryPhoto from "@/assets/category-photo.jpg";
import categoryTraiteur from "@/assets/category-traiteur.jpg";
import categoryDeco from "@/assets/category-deco.jpg";
import categoryPlanner from "@/assets/category-planner.jpg";
import categoryTenues from "@/assets/category-tenues.jpg";
import categoryBeaute from "@/assets/category-beaute.jpg";

const categoryMeta: Record<string, { title: string; description: string; image: string }> = {
  "image-souvenirs": { title: "Image & Souvenirs", description: "Photographes, vidéastes, drone, photobooth 360° et créateurs de contenus pour immortaliser votre mariage.", image: categoryPhoto },
  "animation-ambiance": { title: "Animation & Ambiance", description: "DJ, MC, groupes live, chorales gospel, percussionnistes et griots pour une ambiance inoubliable.", image: categoryDj },
  "mode-tenues": { title: "Mode & Tenues", description: "Créateurs de robes de mariée, tenues traditionnelles, stylistes sur mesure et location de tenues.", image: categoryBeaute },
  "beaute": { title: "Beauté", description: "Maquilleuses afro, coiffeuses, barbiers, esthéticiennes et prothésistes ongulaires pour le jour J.", image: categoryBeaute },
  "traiteurs-gastronomie": { title: "Traiteurs & Gastronomie", description: "Traiteurs africains, afro-fusion, wedding cake, chefs privés et bars à cocktails.", image: categoryTraiteur },
  "decoration-lieux": { title: "Décoration & Lieux", description: "Décorateurs, fleuristes, location de mobilier, salles de réception et domaines.", image: categoryDeco },
  "ceremonies-coutumes": { title: "Cérémonies & Coutumes", description: "Wedding planners, maîtres de cérémonie, conseillers coutumiers, officiants religieux et laïques.", image: categoryPlanner },
  "logistique-services": { title: "Logistique & Services", description: "Transport, hébergement, conciergerie, sécurité, garde d'enfants, faire-part et cadeaux invités.", image: categoryDj },
  "bijoux-accessoires": { title: "Bijoux & Accessoires", description: "Bijoutiers, alliances sur mesure, bijoux traditionnels, chaussures et parfums personnalisés.", image: categoryTenues },
};

const ITEMS_PER_PAGE = 24;

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const subSlug = searchParams.get("sub");
  const initialSubSlugs = subSlug ? [subSlug] : [];
  const meta = categoryMeta[slug || ""] || { title: slug, description: "", image: categoryDj };

  const {
    prestataires, isLoading, filters, updateFilter, resetFilters,
    categories, villes, cultures, langues, geoLocation, setGeoLocation,
  } = usePrestataires();

  const { geo, radius, setRadius, requestLocation, disableGeo } = useGeolocation();

  // Set category filter from slug
  useEffect(() => {
    const cat = categories.find(c => c.slug === slug);
    if (cat) updateFilter("categorie", cat.id);
  }, [slug, categories]);

  // Fetch vendor counts
  useEffect(() => {
    const fetchCounts = async () => {
      const { data } = await supabase
        .from('prestataires')
        .select('categorie_id')
        .eq('statut', 'actif')
        .not('photo_url', 'is', null)
        .neq('photo_url', '');
      if (data) {
        const counts: Record<string, number> = {};
        data.forEach(p => {
          if (p.categorie_id) counts[p.categorie_id] = (counts[p.categorie_id] || 0) + 1;
        });
        setCategoryCounts(counts);
      }
    };
    fetchCounts();
  }, []);

  // Sync geolocation
  useEffect(() => {
    if (geo.enabled && geo.lat && geo.lng) {
      setGeoLocation({ lat: geo.lat, lng: geo.lng, radius });
      updateFilter("sort", "distance");
    }
  }, [geo.enabled, geo.lat, geo.lng, radius]);

  const handleToggleGeo = () => {
    if (geo.enabled) { disableGeo(); setGeoLocation(null); updateFilter("sort", "pertinence"); }
    else requestLocation();
  };

  const hasActiveFilters = filters.search || filters.ville.length > 0 || filters.culture.length > 0 || filters.langue.length > 0 || filters.noteMin > 0 || filters.country || geo.enabled;

  // Pagination
  const totalPages = Math.ceil(prestataires.length / ITEMS_PER_PAGE);
  const paginatedPrestataires = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return prestataires.slice(start, start + ITEMS_PER_PAGE);
  }, [prestataires, currentPage]);

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (currentPage > 1) setPage(1);
  }, [filters, geoLocation]);

  return (
    <Layout>
      {/* Header */}
      <section className="pt-32 pb-12 bg-gradient-warm relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={meta.image} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-ivory/80 to-ivory" />
        </div>
        <div className="container-editorial relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
            <h1 className="font-serif text-chocolate mb-4">{meta.title}</h1>
            <p className="font-body text-muted-foreground">{meta.description}</p>
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
                <FilterSidebar
                  filters={filters}
                  updateFilter={updateFilter}
                  resetFilters={() => { resetFilters(); disableGeo(); }}
                  categories={categories}
                  villes={villes}
                  cultures={cultures}
                  langues={langues}
                  geo={geo}
                  radius={radius}
                  setRadius={setRadius}
                  onToggleGeo={handleToggleGeo}
                  onSetGeoLocation={setGeoLocation}
                  hasActiveFilters={!!hasActiveFilters}
                  categoryCounts={categoryCounts}
                  hideCategories
                  initialSubSlugs={initialSubSlugs}
                />
              </div>
            </aside>

            {/* Mobile filter drawer */}
            <AnimatePresence>
              {showMobileFilters && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 lg:hidden"
                    onClick={() => setShowMobileFilters(false)}
                  />
                  <motion.div
                    initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed inset-y-0 left-0 w-[320px] max-w-[85vw] bg-card z-50 shadow-elegant overflow-y-auto lg:hidden"
                  >
                    <FilterSidebar
                      filters={filters}
                      updateFilter={updateFilter}
                      resetFilters={() => { resetFilters(); disableGeo(); }}
                      categories={categories}
                      villes={villes}
                      cultures={cultures}
                      langues={langues}
                      geo={geo}
                      radius={radius}
                      setRadius={setRadius}
                      onToggleGeo={handleToggleGeo}
                      onSetGeoLocation={setGeoLocation}
                      hasActiveFilters={!!hasActiveFilters}
                      categoryCounts={categoryCounts}
                      onClose={() => setShowMobileFilters(false)}
                      isMobile
                      hideCategories
                      initialSubSlugs={initialSubSlugs}
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
                    placeholder="Rechercher un prestataire..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50"
                  />
                </div>
                <Button variant="outline" className="lg:hidden shrink-0 gap-2" onClick={() => setShowMobileFilters(true)}>
                  <SlidersHorizontal size={18} />
                  <span className="hidden sm:inline">Filtres</span>
                </Button>
                <div className="hidden sm:flex gap-1 p-1 bg-secondary rounded-lg shrink-0">
                  <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                    <Grid size={18} />
                  </button>
                  <button onClick={() => setViewMode("list")} className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                    <List size={18} />
                  </button>
                </div>
              </div>

              {/* Active filter chips */}
              <ActiveFilterChips
                filters={filters}
                categories={categories}
                updateFilter={updateFilter}
                resetFilters={() => { resetFilters(); disableGeo(); }}
              />

              {/* Results count */}
              <div className="flex items-center justify-between mb-6">
                <p className="font-body text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{prestataires.length}</span> prestataire{prestataires.length !== 1 ? 's' : ''} trouvé{prestataires.length !== 1 ? 's' : ''}
                </p>
                {totalPages > 1 && <p className="font-body text-xs text-muted-foreground">Page {currentPage} / {totalPages}</p>}
              </div>

              {/* Grid */}
              {isLoading ? (
                <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="card-premium">
                      <Skeleton className="aspect-[4/3] w-full" />
                      <div className="p-5 space-y-3"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
                    </div>
                  ))}
                </div>
              ) : paginatedPrestataires.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="font-serif text-chocolate mb-2">Aucun prestataire trouvé</h3>
                  <p className="font-body text-muted-foreground mb-6">Essayez de modifier vos filtres.</p>
                  <Button variant="gold" onClick={() => { resetFilters(); disableGeo(); }}>Réinitialiser les filtres</Button>
                </div>
              ) : (
                <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                  {paginatedPrestataires.map((p, index) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.03 }}>
                      <div className={`group card-premium ${viewMode === 'list' ? 'flex' : ''}`}>
                        <Link to={`/prestataires/${p.slug}`} className={`block ${viewMode === 'list' ? 'flex flex-1' : ''}`}>
                          <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 shrink-0' : 'aspect-[4/3]'}`}>
                            <img src={p.cover_url || p.photo_url || categoryDj} alt={p.nom_entreprise} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                            <FavoriteButton prestataireId={p.id} className="absolute top-3 right-3" />
                            {p.badge_type && p.badge_type !== 'FREE' && (
                              <div className="absolute top-3 left-3">
                                <span className="px-2.5 py-1 rounded-full bg-champagne/90 font-body text-[10px] font-semibold text-primary-foreground uppercase tracking-wider">
                                  {p.badge_type === 'PREMIUM' ? 'Premium' : p.badge_type === 'VIP' ? 'VIP' : p.badge_type === 'FOUNDER' ? 'Fondateur' : p.badge_type}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-serif text-base text-chocolate group-hover:text-champagne transition-colors line-clamp-1 flex-1">{p.nom_entreprise}</h3>
                              {p.verified && <BadgeCheck size={16} className="text-champagne shrink-0" />}
                            </div>
                            {p.ville && (
                              <div className="flex items-center gap-1.5 text-muted-foreground font-body text-xs mb-2">
                                <MapPin size={12} />{p.ville}{p.pays ? `, ${p.pays}` : ''}
                              </div>
                            )}
                            {p.origine_culturelle && (
                              <p className="font-body text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                                <Globe size={11} />{p.origine_culturelle}
                              </p>
                            )}
                            <div className="flex items-center gap-1 mb-3">
                              {p.review_count > 0 ? (
                                <>
                                  <Star size={14} className="text-gold fill-gold" />
                                  <span className="font-body text-sm font-medium">{p.avg_rating.toFixed(1)}</span>
                                  <span className="font-body text-xs text-muted-foreground">({p.review_count} avis)</span>
                                </>
                              ) : (
                                <span className="font-body text-xs text-muted-foreground italic">Nouveau</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <span className="flex-1 text-center py-1.5 rounded-lg bg-champagne/10 text-champagne font-body text-xs font-semibold group-hover:bg-champagne group-hover:text-primary-foreground transition-all">
                                Voir profil
                              </span>
                            </div>
                          </div>
                        </Link>
                        <div className="px-4 pb-4 -mt-1">
                          <Link
                            to={`/prestataires/${p.slug}#contact`}
                            className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border border-border text-muted-foreground font-body text-xs font-medium hover:border-champagne hover:text-champagne transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MessageCircle size={12} />
                            Contacter
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && !isLoading && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="gap-1">
                    <ChevronLeft size={16} /> Précédent
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => {
                      let pageNum: number;
                      if (totalPages <= 10) pageNum = i + 1;
                      else if (currentPage <= 5) pageNum = i + 1;
                      else if (currentPage >= totalPages - 4) pageNum = totalPages - 9 + i;
                      else pageNum = currentPage - 4 + i;
                      return (
                        <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-9 h-9 rounded-lg font-body text-sm transition-all ${currentPage === pageNum ? "bg-champagne text-primary-foreground shadow-sm font-medium" : "hover:bg-secondary text-muted-foreground"}`}>
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)} className="gap-1">
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

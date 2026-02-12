import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Star, MapPin, Heart, Globe } from "lucide-react";
import { usePrestataires } from "@/hooks/use-prestataires";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import categoryDj from "@/assets/category-dj.jpg";

const categoryMeta: Record<string, { title: string; description: string }> = {
  photo: { title: "Photographes", description: "Les meilleurs photographes de mariage afro, capturant l'émotion et la beauté de vos traditions." },
  dj: { title: "DJ & Musique", description: "DJ spécialisés dans les sonorités afro, caribéennes et urbaines pour une ambiance inoubliable." },
  planner: { title: "Wedding Planners", description: "Organisateurs de mariage experts en traditions et cultures afro." },
  videographe: { title: "Vidéastes", description: "Vidéastes qui subliment vos moments précieux en films d'exception." },
  mc: { title: "MC & Cérémonie", description: "Maîtres de cérémonie pour animer et coordonner votre journée spéciale." },
  coordination: { title: "Coordination", description: "Coordinateurs jour-J pour un déroulement fluide et serein." },
  traiteur: { title: "Traiteurs", description: "Traiteurs spécialisés dans les saveurs africaines et caribéennes." },
  deco: { title: "Décoration", description: "Décorateurs qui créent des ambiances uniques inspirées de vos cultures." },
  tenues: { title: "Tenues traditionnelles", description: "Créateurs de tenues traditionnelles pour un mariage authentique." },
  beaute: { title: "Beauté", description: "Maquilleurs et coiffeurs experts en beauté afro." },
  caraibes: { title: "Caraïbes", description: "Prestataires spécialisés dans les traditions et ambiances caribéennes : Zouk, Kompa, Bouyon, Dancehall, Soca." },
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { prestataires, isLoading, categories, updateFilter } = usePrestataires();
  const meta = categoryMeta[slug || ""] || { title: slug, description: "" };

  useEffect(() => {
    const cat = categories.find(c => c.slug === slug);
    if (cat) updateFilter("categorie", cat.id);
  }, [slug, categories]);

  return (
    <Layout>
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-warm relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={categoryDj} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-ivory/80 to-ivory" />
        </div>
        <div className="container-editorial relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
            <h1 className="font-serif text-chocolate mb-4">{meta.title}</h1>
            <p className="font-body text-muted-foreground">{meta.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="section-padding bg-gradient-warm">
        <div className="container-editorial">
          <p className="font-body text-muted-foreground mb-8">
            <span className="font-medium text-foreground">{prestataires.length}</span> prestataire{prestataires.length !== 1 ? "s" : ""} trouvé{prestataires.length !== 1 ? "s" : ""}
          </p>
          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-premium">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-5 space-y-3"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
                </div>
              ))}
            </div>
          ) : prestataires.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-serif text-chocolate mb-2">Aucun prestataire trouvé</h3>
              <p className="font-body text-muted-foreground">Pas encore de prestataires dans cette catégorie.</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {prestataires.map((p, index) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.03 }}>
                  <Link to={`/prestataires/${p.slug}`} className="group block card-premium">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img src={p.cover_url || categoryDj} alt={p.nom_entreprise} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ivory/90 flex items-center justify-center hover:bg-ivory transition-colors">
                        <Heart size={16} className="text-chocolate" />
                      </button>
                      {p.categories && (
                        <div className="absolute bottom-3 left-3">
                          <span className="px-3 py-1 rounded-full bg-ivory/90 font-body text-xs font-medium text-chocolate">{p.categories.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-lg text-chocolate mb-1 group-hover:text-champagne transition-colors">{p.nom_entreprise}</h3>
                      {p.ville && (
                        <div className="flex items-center gap-1.5 text-muted-foreground font-body text-sm mb-2">
                          <MapPin size={14} />{p.ville}{p.pays ? `, ${p.pays}` : ""}
                        </div>
                      )}
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
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

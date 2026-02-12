import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Star, MapPin, Heart, Globe } from "lucide-react";
import { usePrestataires } from "@/hooks/use-prestataires";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

import categoryDj from "@/assets/category-dj.jpg";
import categoryPhoto from "@/assets/category-photo.jpg";
import categoryTraiteur from "@/assets/category-traiteur.jpg";
import categoryDeco from "@/assets/category-deco.jpg";
import categoryPlanner from "@/assets/category-planner.jpg";
import categoryTenues from "@/assets/category-tenues.jpg";
import categoryBeaute from "@/assets/category-beaute.jpg";

const categoryMeta: Record<string, { title: string; description: string; image: string }> = {
  videaste: { title: "Vidéastes", description: "Vidéastes qui subliment vos moments précieux en films d'exception.", image: categoryDj },
  photographe: { title: "Photographes", description: "Les meilleurs photographes de mariage afro, capturant l'émotion et la beauté de vos traditions.", image: categoryPhoto },
  "dj-musique": { title: "DJ & Musique", description: "DJ spécialisés dans les sonorités afro, caribéennes et urbaines pour une ambiance inoubliable.", image: categoryDj },
  "wedding-planner": { title: "Wedding Planners", description: "Organisateurs de mariage experts en traditions et cultures afro.", image: categoryPlanner },
  animation: { title: "Animation", description: "Maîtres de cérémonie et animateurs pour un événement vibrant et mémorable.", image: categoryPhoto },
  "coiffure-beaute": { title: "Coiffure & Beauté", description: "Maquilleurs et coiffeurs experts en beauté afro.", image: categoryBeaute },
  decoration: { title: "Décoration", description: "Décorateurs qui créent des ambiances uniques inspirées de vos cultures.", image: categoryDeco },
  traiteur: { title: "Traiteur", description: "Traiteurs spécialisés dans les saveurs africaines et caribéennes.", image: categoryTraiteur },
  "salle-lieu": { title: "Salle & Lieu", description: "Les plus beaux lieux de réception pour votre mariage.", image: categoryPlanner },
  "tenues-couture": { title: "Tenues & Couture", description: "Créateurs de tenues traditionnelles pour un mariage authentique.", image: categoryTenues },
  transport: { title: "Transport", description: "Services de transport premium pour votre jour J.", image: categoryDj },
  "faire-part": { title: "Faire-part & Papeterie", description: "Créations papetières élégantes pour vos invitations.", image: categoryPlanner },
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { prestataires, isLoading, categories, updateFilter } = usePrestataires();
  const meta = categoryMeta[slug || ""] || { title: slug, description: "", image: categoryDj };

  useEffect(() => {
    const cat = categories.find(c => c.slug === slug);
    if (cat) updateFilter("categorie", cat.id);
  }, [slug, categories]);

  return (
    <Layout>
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-warm relative overflow-hidden">
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

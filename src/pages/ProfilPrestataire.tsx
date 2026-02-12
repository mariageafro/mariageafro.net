import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { MapPin, Star, Heart, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrestaireDetail } from "@/hooks/use-prestataire-detail";
import { PrestaireGallery } from "@/components/prestataire/PrestaireGallery";
import { PrestaireReviews } from "@/components/prestataire/PrestaireReviews";
import { PrestaireContactCard } from "@/components/prestataire/PrestaireContactCard";
import categoryDj from "@/assets/category-dj.jpg";

export default function ProfilPrestataire() {
  const { prestataire, reviews, medias, isLoading, error } = usePrestaireDetail();

  if (error) {
    return (
      <Layout>
        <section className="pt-32 pb-12 bg-gradient-warm">
          <div className="container-editorial text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="font-serif text-chocolate mb-2">Prestataire non trouvé</h1>
            <p className="font-body text-muted-foreground">
              Désolé, nous n'avons pas pu trouver le prestataire que vous cherchez.
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  if (isLoading || !prestataire) {
    return (
      <Layout>
        <section className="pt-24">
          <div className="container-editorial">
            <div className="grid lg:grid-cols-2 gap-8">
              <Skeleton className="aspect-[4/3] rounded-2xl" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24">
        <div className="container-editorial">
          <PrestaireGallery
            medias={medias}
            coverUrl={categoryDj} // Utilise une image par défaut pour le placeholder
            businessName={prestataire.nom_entreprise}
          />
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {prestataire.categories && (
                      <span className="inline-block px-3 py-1 rounded-full bg-champagne/10 text-champagne-dark font-body text-sm mb-3">
                        {prestataire.categories.name}
                      </span>
                    )}
                    <h1 className="font-serif text-4xl text-chocolate">
                      {prestataire.nom_entreprise}
                    </h1>
                    <div className="flex items-center gap-4 mt-3 text-muted-foreground flex-wrap">
                      {prestataire.ville && (
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span className="font-body text-sm">
                            {prestataire.ville}
                            {prestataire.pays ? `, ${prestataire.pays}` : ''}
                          </span>
                        </div>
                      )}
                      {prestataire.review_count > 0 && (
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-gold fill-gold" />
                          <span className="font-body text-sm font-medium text-foreground">
                            {prestataire.avg_rating.toFixed(1)}
                          </span>
                          <span className="font-body text-sm">
                            ({prestataire.review_count} avis)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cultures & Languages */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {prestataire.origine_culturelle && (
                    <span className="px-3 py-1 rounded-full bg-secondary text-chocolate font-body text-sm">
                      {prestataire.origine_culturelle}
                    </span>
                  )}
                  {prestataire.langues && prestataire.langues.map((lang) => (
                    <span key={lang} className="px-3 py-1 rounded-full bg-secondary text-chocolate font-body text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Description */}
              {prestataire.description && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className="font-serif text-2xl text-chocolate mb-4">Présentation</h2>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {prestataire.description}
                  </p>
                </motion.div>
              )}

              {/* Sub Category / Services */}
              {prestataire.sous_categorie && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="font-serif text-2xl text-chocolate mb-4">Spécialités</h2>
                  <div className="flex flex-wrap gap-3">
                    <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-champagne/10 to-gold/10 border border-champagne/20 text-chocolate font-body text-sm">
                      {prestataire.sous_categorie}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Reviews */}
              <PrestaireReviews
                reviews={reviews}
                avgRating={prestataire.avg_rating}
                reviewCount={prestataire.review_count}
              />
            </div>

            {/* Sidebar */}
            {prestataire && <PrestaireContactCard prestataire={prestataire} />}
          </div>
        </div>
      </section>
    </Layout>
  );
}

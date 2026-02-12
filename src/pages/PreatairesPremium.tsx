import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Star, MapPin, Crown, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import categoryDj from "@/assets/category-dj.jpg";

type PremiumPrestataire = {
  id: string;
  nom_entreprise: string;
  slug: string;
  ville: string | null;
  pays: string | null;
  origine_culturelle: string | null;
  verified: boolean;
  categories: { name: string } | null;
  cover_url: string | null;
  subscription_type: string;
};

export default function PreatairesPremium() {
  const [prestataires, setPrestataires] = useState<PremiumPrestataire[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      // Get prestataires with pro/premium/elite subscriptions
      const { data: abos } = await supabase
        .from("abonnements")
        .select("prestataire_id, type")
        .eq("actif", true)
        .in("type", ["pro", "premium", "elite"]);

      if (!abos || abos.length === 0) {
        setIsLoading(false);
        return;
      }

      const ids = abos.map((a) => a.prestataire_id);
      const typeMap: Record<string, string> = {};
      abos.forEach((a) => { typeMap[a.prestataire_id] = a.type; });

      const { data } = await supabase
        .from("prestataires")
        .select("id, nom_entreprise, slug, ville, pays, origine_culturelle, verified, categories(name)")
        .eq("statut", "actif")
        .in("id", ids)
        .order("score_ranking", { ascending: false });

      // Fetch covers
      const { data: medias } = await supabase
        .from("medias")
        .select("prestataire_id, url")
        .eq("type", "photo")
        .in("prestataire_id", ids)
        .order("ordre", { ascending: true });

      const coverMap: Record<string, string> = {};
      medias?.forEach((m) => { if (!coverMap[m.prestataire_id]) coverMap[m.prestataire_id] = m.url; });

      setPrestataires(
        (data ?? []).map((p) => ({
          ...p,
          cover_url: coverMap[p.id] ?? null,
          subscription_type: typeMap[p.id] ?? "pro",
        }))
      );
      setIsLoading(false);
    };
    fetch();
  }, []);

  const badgeColor: Record<string, string> = {
    pro: "bg-champagne/20 text-champagne-dark",
    premium: "bg-gradient-gold text-primary-foreground",
    elite: "bg-chocolate text-ivory",
  };

  return (
    <Layout>
      <section className="pt-32 pb-12 bg-gradient-warm">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="text-gold" size={28} />
            </div>
            <h1 className="font-serif text-chocolate mb-4">
              Prestataires <span className="text-gradient-gold italic">Premium</span>
            </h1>
            <p className="font-body text-muted-foreground">
              Les meilleurs professionnels du mariage afro, vérifiés et recommandés.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-gradient-warm">
        <div className="container-editorial">
          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card-premium">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : prestataires.length === 0 ? (
            <div className="text-center py-20">
              <Crown className="mx-auto text-gold mb-4" size={48} />
              <h3 className="font-serif text-chocolate mb-2">Bientôt disponible</h3>
              <p className="font-body text-muted-foreground">
                Nos prestataires premium seront affichés ici prochainement.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {prestataires.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link to={`/prestataires/${p.slug}`} className="group block card-premium">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={p.cover_url || categoryDj}
                        alt={p.nom_entreprise}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`px-3 py-1 rounded-full font-body text-[10px] font-semibold uppercase tracking-wider ${badgeColor[p.subscription_type] || badgeColor.pro}`}>
                          {p.subscription_type}
                        </span>
                        {p.verified && (
                          <span className="px-2 py-1 rounded-full bg-champagne/90 font-body text-[10px] font-semibold text-primary-foreground uppercase tracking-wider">
                            Vérifié
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-lg text-chocolate group-hover:text-champagne transition-colors">
                        {p.nom_entreprise}
                      </h3>
                      {p.ville && (
                        <p className="font-body text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin size={14} /> {p.ville}{p.pays ? `, ${p.pays}` : ""}
                        </p>
                      )}
                      {p.origine_culturelle && (
                        <p className="font-body text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Globe size={12} /> {p.origine_culturelle}
                        </p>
                      )}
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

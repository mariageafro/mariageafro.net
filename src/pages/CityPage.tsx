import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Star, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { usePrestataires } from "@/hooks/use-prestataires";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import categoryDj from "@/assets/category-dj.jpg";

const cityMeta: Record<string, { title: string; description: string }> = {
  paris: { title: "Prestataires mariage afro à Paris", description: "Les meilleurs prestataires de mariage afro et caribéen à Paris et en Île-de-France." },
  bruxelles: { title: "Prestataires mariage afro à Bruxelles", description: "Trouvez les prestataires de mariage afro à Bruxelles et en Belgique." },
  berlin: { title: "Prestataires mariage afro à Berlin", description: "Découvrez les prestataires de mariage afro à Berlin et en Allemagne." },
  lyon: { title: "Prestataires mariage afro à Lyon", description: "Les meilleurs prestataires de mariage afro à Lyon et en Auvergne-Rhône-Alpes." },
  marseille: { title: "Prestataires mariage afro à Marseille", description: "Trouvez les prestataires de mariage afro à Marseille et en PACA." },
  liege: { title: "Prestataires mariage afro à Liège", description: "Les prestataires de mariage afro à Liège et en Wallonie." },
};

const cityToVille: Record<string, string> = {
  paris: "Paris",
  bruxelles: "Bruxelles",
  berlin: "Berlin",
  lyon: "Lyon",
  marseille: "Marseille",
  liege: "Liège",
};

export default function CityPage() {
  const { city } = useParams<{ city: string }>();
  const { prestataires, isLoading, updateFilter } = usePrestataires();
  const meta = cityMeta[city || ""] || { title: `Prestataires à ${city}`, description: "" };

  useEffect(() => {
    const villeName = cityToVille[city || ""];
    if (villeName) updateFilter("ville", [villeName]);
  }, [city]);

  return (
    <Layout>
      <section className="pt-32 pb-16 bg-gradient-warm">
        <div className="container-editorial">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
            <h1 className="font-serif text-chocolate mb-4">{meta.title}</h1>
            <p className="font-body text-muted-foreground">{meta.description}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-gradient-warm">
        <div className="container-editorial">
          <p className="font-body text-muted-foreground mb-8">
            <span className="font-medium text-foreground">{prestataires.length}</span> prestataire{prestataires.length !== 1 ? "s" : ""}
          </p>
          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-premium"><Skeleton className="aspect-[4/3] w-full" /><div className="p-5 space-y-3"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></div></div>
              ))}
            </div>
          ) : prestataires.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-serif text-chocolate mb-2">Aucun prestataire trouvé</h3>
              <p className="font-body text-muted-foreground">Pas encore de prestataires dans cette ville.</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {prestataires.map((p, index) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.03 }}>
                  <Link to={`/prestataires/${p.slug}`} className="group block card-premium">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img src={p.cover_url || categoryDj} alt={p.nom_entreprise} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ivory/90 flex items-center justify-center"><Heart size={16} className="text-chocolate" /></button>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-lg text-chocolate mb-1 group-hover:text-champagne transition-colors">{p.nom_entreprise}</h3>
                      {p.ville && <div className="flex items-center gap-1.5 text-muted-foreground font-body text-sm mb-2"><MapPin size={14} />{p.ville}</div>}
                      <div className="flex items-center gap-1">
                        {p.review_count > 0 ? (<><Star size={16} className="text-gold fill-gold" /><span className="font-body text-sm font-medium">{p.avg_rating.toFixed(1)}</span><span className="font-body text-xs text-muted-foreground">({p.review_count})</span></>) : (<span className="font-body text-xs text-muted-foreground italic">Nouveau</span>)}
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

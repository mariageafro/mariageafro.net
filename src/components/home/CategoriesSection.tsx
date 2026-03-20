import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Music, Sparkles, UtensilsCrossed, Flower2, Shirt, HeartHandshake, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

import categoryPhotographe from "@/assets/category-photographe.jpg";
import categoryDjMusique from "@/assets/category-djmusique.jpg";
import categoryCoiffureBeaute from "@/assets/category-coiffurebeaute.jpg";
import categoryTraiteur from "@/assets/category-traiteur2.jpg";
import categoryDecoration from "@/assets/category-decoration.jpg";
import categoryTenuesCouture from "@/assets/category-tenuescouture.jpg";
import categoryAnimation from "@/assets/category-animation.jpg";
import categoryVideaste from "@/assets/category-videaste.jpg";

const mainCategories = [
  { label: "Photographie & Vidéo", slug: "photographe", icon: Camera, image: categoryPhotographe },
  { label: "DJ & Animation", slug: "dj-musique", icon: Music, image: categoryDjMusique },
  { label: "Beauté", slug: "coiffure-beaute", icon: Sparkles, image: categoryCoiffureBeaute },
  { label: "Traiteurs", slug: "traiteur", icon: UtensilsCrossed, image: categoryTraiteur },
  { label: "Décoration & Lieux", slug: "decoration", icon: Flower2, image: categoryDecoration },
  { label: "Mode & Tenues", slug: "tenues-couture", icon: Shirt, image: categoryTenuesCouture },
  { label: "Coordination & Cérémonie", slug: "animation", icon: HeartHandshake, image: categoryAnimation },
  { label: "Bijoux & Accessoires", slug: "videaste", icon: Gem, image: categoryVideaste },
];

export function CategoriesSection() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [catMap, setCatMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, countRes] = await Promise.all([
        supabase.from("categories").select("id, slug").order("name"),
        supabase.from("prestataires").select("categorie_id").eq("statut", "actif").not("photo_url", "is", null).neq("photo_url", ""),
      ]);

      const slugToId: Record<string, string> = {};
      (catRes.data ?? []).forEach((c) => { slugToId[c.slug] = c.id; });
      setCatMap(slugToId);

      const idCounts: Record<string, number> = {};
      (countRes.data ?? []).forEach((p) => {
        if (p.categorie_id) idCounts[p.categorie_id] = (idCounts[p.categorie_id] || 0) + 1;
      });
      setCounts(idCounts);
    };
    fetchData();
  }, []);

  const getCount = (slug: string) => counts[catMap[slug]] || 0;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-editorial">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
            Explorer par catégorie
          </h2>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Les meilleurs professionnels du mariage afro & caribéen, par métier.
          </p>
        </motion.div>

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mainCategories.map((cat, i) => {
            const Icon = cat.icon;
            const count = getCount(cat.slug);
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  to={`/prestataires/${cat.slug}`}
                  className="group relative block rounded-2xl overflow-hidden aspect-[4/3]"
                >
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent group-hover:from-black/80 transition-all duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <h3 className="font-serif text-white text-sm md:text-base font-semibold leading-tight drop-shadow-sm">
                        {cat.label}
                      </h3>
                      {count > 0 && (
                        <p className="text-white/60 text-xs font-body mt-0.5">{count} prestataires</p>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-champagne/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-1">
                      <Icon size={14} className="text-white" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/explorer">
              Voir tous les prestataires <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

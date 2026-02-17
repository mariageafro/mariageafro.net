import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

import categoryVideaste from "@/assets/category-videaste.jpg";
import categoryPhotographe from "@/assets/category-photographe.jpg";
import categoryDjMusique from "@/assets/category-djmusique.jpg";
import categoryWeddingPlanner from "@/assets/category-weddingplanner.jpg";
import categoryAnimation from "@/assets/category-animation.jpg";
import categoryCoiffureBeaute from "@/assets/category-coiffurebeaute.jpg";
import categoryDecoration from "@/assets/category-decoration.jpg";
import categoryTraiteur from "@/assets/category-traiteur2.jpg";
import categorySalleLieu from "@/assets/category-sallelieu.jpg";
import categoryTenuesCouture from "@/assets/category-tenuescouture.jpg";
import categoryTransport from "@/assets/category-transport.jpg";
import categoryRobes from "@/assets/category-robes.jpg";

const categoryImages: Record<string, string> = {
  "videaste": categoryVideaste,
  "photographe": categoryPhotographe,
  "dj-musique": categoryDjMusique,
  "wedding-planner": categoryWeddingPlanner,
  "animation": categoryAnimation,
  "coiffure-beaute": categoryCoiffureBeaute,
  "salle-lieu": categorySalleLieu,
  "traiteur": categoryTraiteur,
  "decoration": categoryDecoration,
  "robes-mariee": categoryRobes,
  "tenues-couture": categoryTenuesCouture,
  "transport": categoryTransport
};

const featuredSlugs = ["videaste", "photographe", "dj-musique", "wedding-planner", "animation", "coiffure-beaute"];


export function CategoriesSection() {
  const [categories, setCategories] = useState<{name: string;slug: string;count: number;featured: boolean;image: string;}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, countRes] = await Promise.all([
      supabase.from('categories').select('id, name, slug').order('name'),
      supabase.from('prestataires').select('categorie_id').eq('statut', 'actif').not('photo_url', 'is', null).neq('photo_url', '')]
      );

      const counts: Record<string, number> = {};
      (countRes.data ?? []).forEach((p) => {
        if (p.categorie_id) counts[p.categorie_id] = (counts[p.categorie_id] || 0) + 1;
      });

      const mapped = (catRes.data ?? []).map((cat) => ({
        name: cat.name,
        slug: cat.slug,
        count: counts[cat.id] || 0,
        featured: featuredSlugs.includes(cat.slug),
        image: categoryImages[cat.slug] || categoryVideaste
      }));

      setCategories(mapped);
    };
    fetchData();
  }, []);

  const featured = categories.filter(c => c.featured);
  const others = categories.filter(c => !c.featured);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-editorial">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">Trouvez vos prestataires</h2>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">Les meilleurs professionnels du mariage afro & caribéen</p>
        </motion.div>

        {/* Featured categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {featured.map((cat, i) => (
            <motion.div key={cat.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={`/prestataires/${cat.slug}`} className="group relative block rounded-xl overflow-hidden aspect-[4/3]">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-serif text-white text-sm md:text-base font-semibold">{cat.name}</h3>
                  {cat.count > 0 && <p className="text-white/70 text-xs font-body">{cat.count} prestataires</p>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Other categories */}
        {others.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {others.map(cat => (
              <Link key={cat.slug} to={`/prestataires/${cat.slug}`} className="px-4 py-2 rounded-full border border-border text-sm font-body text-muted-foreground hover:bg-champagne/10 hover:text-champagne hover:border-champagne/30 transition-all">
                {cat.name} {cat.count > 0 && <span className="text-xs opacity-60">({cat.count})</span>}
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/prestataires">Voir tous les prestataires <ArrowRight size={16} className="ml-2" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
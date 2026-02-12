import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import categoryDj from "@/assets/category-dj.jpg";
import categoryPhoto from "@/assets/category-photo.jpg";
import categoryTraiteur from "@/assets/category-traiteur.jpg";
import categoryDeco from "@/assets/category-deco.jpg";
import categoryPlanner from "@/assets/category-planner.jpg";
import categoryTenues from "@/assets/category-tenues.jpg";
import categoryBeaute from "@/assets/category-beaute.jpg";

// Catégories dans l'ordre de priorité défini
const categories = [
  { name: "Vidéaste mariage", slug: "videographe", image: categoryDj, count: 72, featured: true },
  { name: "Photographe mariage", slug: "photo", image: categoryPhoto, count: 120, featured: true },
  { name: "DJ mariage", slug: "dj", image: categoryDj, count: 85, featured: true },
  { name: "Wedding Planner", slug: "planner", image: categoryPlanner, count: 45, featured: true },
  { name: "MC / Animateur", slug: "mc", image: categoryPhoto, count: 58, featured: true },
  { name: "Décoration", slug: "deco", image: categoryDeco, count: 78, featured: true },
  { name: "Traiteur", slug: "traiteur", image: categoryTraiteur, count: 65, featured: true },
  { name: "Tenues traditionnelles", slug: "tenues", image: categoryTenues, count: 92, featured: true },
  { name: "Beauté", slug: "beaute", image: categoryBeaute, count: 58, featured: true },
];

export function CategoriesSection() {
  return (
    <section className="section-padding bg-gradient-warm relative texture-grain">
      <div className="container-editorial">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-chocolate mb-4">
            Nos <span className="text-gradient-gold italic">Catégories</span>
          </h2>
          <div className="divider-gold my-6" />
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos prestataires triés sur le volet, spécialisés dans les mariages afro et comprenant vos traditions.
          </p>
        </motion.div>

        {/* Featured Categories Grid */}
        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link
                to={`/prestataires?category=${category.slug}`}
                className="group block card-premium overflow-hidden aspect-[3/4]"
              >
                <div className="relative h-full">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 via-chocolate/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="font-serif text-lg md:text-xl text-ivory mb-1 group-hover:text-gold transition-colors">
                      {category.name}
                    </h3>
                    <p className="font-body text-xs text-ivory/60">
                      {category.count} prestataires
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* See All Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: categories.length * 0.08 }}
          >
            <Link
              to="/prestataires"
              className="group flex flex-col items-center justify-center h-full aspect-[3/4] rounded-2xl border-2 border-dashed border-champagne/40 hover:border-champagne hover:bg-champagne/5 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-champagne/10 flex items-center justify-center mb-4 group-hover:bg-champagne/20 transition-colors">
                <ArrowRight className="text-champagne" size={24} />
              </div>
              <span className="font-serif text-lg text-chocolate">Voir tout</span>
              <span className="font-body text-xs text-muted-foreground mt-1">543 prestataires</span>
            </Link>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button variant="gold" size="lg" asChild>
            <Link to="/prestataires">
              Voir tous les prestataires
              <ArrowRight size={18} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

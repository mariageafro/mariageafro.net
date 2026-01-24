import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock } from "lucide-react";

import blogYoruba from "@/assets/blog-yoruba.jpg";
import blogWolof from "@/assets/blog-wolof.jpg";
import blogCongo from "@/assets/blog-congo.jpg";
import blogMaghreb from "@/assets/blog-maghreb.jpg";
import blogDiaspora from "@/assets/blog-diaspora.jpg";
import heroCouple from "@/assets/hero-couple.jpg";

const featuredArticle = {
  title: "Les traditions du mariage Yoruba : un voyage à travers les rituels",
  excerpt: "Découvrez les cérémonies ancestrales, les tenues traditionnelles et les rituels qui font la richesse du mariage Yoruba au Nigeria.",
  image: blogYoruba,
  date: "15 Janvier 2024",
  readTime: "8 min",
  category: "Traditions",
  slug: "traditions-mariage-yoruba",
};

const articles = [
  {
    title: "Mariage Wolof : l'élégance sénégalaise",
    excerpt: "Le Bazin, les bijoux en or, et les cérémonies qui célèbrent l'amour à la sénégalaise.",
    image: blogWolof,
    date: "10 Janvier 2024",
    readTime: "6 min",
    category: "Traditions",
    slug: "mariage-wolof",
  },
  {
    title: "La Libanga : quand le Congo célèbre l'amour",
    excerpt: "Plongez dans l'univers coloré et festif des mariages congolais.",
    image: blogCongo,
    date: "5 Janvier 2024",
    readTime: "7 min",
    category: "Traditions",
    slug: "libanga-congo",
  },
  {
    title: "Mariage du Maghreb et du Sahel",
    excerpt: "Les traditions du henné, le caftan, et les rituels berbères.",
    image: blogMaghreb,
    date: "28 Décembre 2023",
    readTime: "5 min",
    category: "Traditions",
    slug: "mariage-maghreb",
  },
  {
    title: "Fusion culturelle : quand la diaspora réinvente le mariage",
    excerpt: "Comment les couples de la diaspora mélangent traditions africaines et modernité occidentale.",
    image: blogDiaspora,
    date: "20 Décembre 2023",
    readTime: "9 min",
    category: "Inspirations",
    slug: "diaspora-fusion",
  },
  {
    title: "10 conseils pour choisir votre photographe de mariage afro",
    excerpt: "Comment trouver un professionnel qui comprend vos traditions et capture l'essence de votre célébration.",
    image: heroCouple,
    date: "15 Décembre 2023",
    readTime: "5 min",
    category: "Conseils",
    slug: "choisir-photographe",
  },
];

const categories = ["Tous", "Traditions", "Inspirations", "Conseils", "Tendances"];

export default function Blog() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-warm">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="font-serif text-chocolate mb-4">
              Blog & <span className="text-gradient-gold italic">Inspiration</span>
            </h1>
            <p className="font-body text-muted-foreground">
              Explorez les richesses des traditions de mariage africaines, découvrez des conseils d'experts et trouvez l'inspiration pour votre célébration unique.
            </p>
          </motion.div>

          {/* Categories */}
          <div className="flex justify-center gap-3 flex-wrap">
            {categories.map((cat, index) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`px-5 py-2 rounded-full font-body text-sm transition-all ${
                  cat === "Tous"
                    ? "bg-champagne text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-champagne/10"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12 bg-gradient-warm">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to={`/blog/${featuredArticle.slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold text-chocolate font-body text-xs font-medium">
                    À la une
                  </span>
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-champagne/10 text-champagne-dark font-body text-xs font-medium mb-4">
                    {featuredArticle.category}
                  </span>
                  <h2 className="font-serif text-3xl text-chocolate mb-4 group-hover:text-champagne transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span className="font-body text-sm">{featuredArticle.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span className="font-body text-sm">{featuredArticle.readTime} de lecture</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-padding bg-gradient-warm">
        <div className="container-editorial">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/blog/${article.slug}`} className="group block card-premium h-full">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-ivory/90 text-chocolate font-body text-xs font-medium">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl text-chocolate mb-3 group-hover:text-champagne transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-body text-xs">{article.date}</span>
                      <span className="font-body text-xs">{article.readTime}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <button className="inline-flex items-center gap-2 font-body text-champagne-dark hover:text-champagne transition-colors group">
              Voir plus d'articles
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import blogYoruba from "@/assets/blog-yoruba.jpg";
import blogWolof from "@/assets/blog-wolof.jpg";
import blogCongo from "@/assets/blog-congo.jpg";
import blogMaghreb from "@/assets/blog-maghreb.jpg";
import blogDiaspora from "@/assets/blog-diaspora.jpg";

const inspirations = [
  {
    title: "Mariage Congolais",
    subtitle: "La Libanga et ses couleurs",
    image: blogCongo,
    slug: "congo",
  },
  {
    title: "Mariage Yoruba & Igbo",
    subtitle: "Les traditions du Nigeria",
    image: blogYoruba,
    slug: "yoruba-igbo",
  },
  {
    title: "Mariage Wolof",
    subtitle: "L'élégance sénégalaise",
    image: blogWolof,
    slug: "wolof",
  },
  {
    title: "Mariage Maghrébin",
    subtitle: "Traditions du Sahel",
    image: blogMaghreb,
    slug: "maghreb",
  },
  {
    title: "Diaspora Mixte",
    subtitle: "Fusion culturelle moderne",
    image: blogDiaspora,
    slug: "diaspora",
  },
];

export function InspirationSection() {
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
            Inspiration & <span className="text-gradient-gold italic">Traditions</span>
          </h2>
          <div className="divider-gold my-6" />
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Explorez les richesses de nos cultures et trouvez l'inspiration pour votre célébration unique.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Large Featured Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-12 md:col-span-7 lg:col-span-8"
          >
            <Link to={`/inspiration/${inspirations[0].slug}`} className="group block relative overflow-hidden rounded-2xl aspect-[16/9]">
              <img
                src={inspirations[0].image}
                alt={inspirations[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 via-chocolate/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="inline-block px-3 py-1 rounded-full bg-gold/90 text-chocolate font-body text-xs font-medium mb-3">
                  À la une
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-ivory mb-2 group-hover:text-gold transition-colors">
                  {inspirations[0].title}
                </h3>
                <p className="font-body text-ivory/70">{inspirations[0].subtitle}</p>
              </div>
            </Link>
          </motion.div>

          {/* Side Cards */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-6">
            {inspirations.slice(1, 3).map((item, index) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
              >
                <Link to={`/inspiration/${item.slug}`} className="group block relative overflow-hidden rounded-2xl aspect-[4/3]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 via-chocolate/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-serif text-lg text-ivory mb-1 group-hover:text-gold transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-body text-xs text-ivory/60">{item.subtitle}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Bottom Row */}
          {inspirations.slice(3).map((item, index) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index + 3) * 0.1 }}
              className="col-span-6 md:col-span-6"
            >
              <Link to={`/inspiration/${item.slug}`} className="group block relative overflow-hidden rounded-2xl aspect-[4/3]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 via-chocolate/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="font-serif text-lg md:text-xl text-ivory mb-1 group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-body text-xs md:text-sm text-ivory/60">{item.subtitle}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-body text-champagne-dark hover:text-champagne transition-colors group"
          >
            Explorer le blog
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

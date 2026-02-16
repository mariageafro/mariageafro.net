import { motion } from "framer-motion";
import heroImage from "@/assets/hero-couple.jpg";
import { HeroSearchDropdowns } from "./HeroSearchDropdowns";

const stats = [
  { number: "500+", label: "Prestataires sélectionnés" },
  { number: "15k+", label: "Mariages célébrés" },
  { number: "25+", label: "Pays représentés" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-x-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Couple afro en tenue de mariage traditionnelle"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-chocolate/40 via-chocolate/30 to-chocolate/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-editorial pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
            style={{
              background: "linear-gradient(135deg, hsla(38, 45%, 50%, 0.9) 0%, hsla(43, 75%, 55%, 0.9) 100%)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-ivory animate-pulse" />
            <span className="font-body text-sm font-medium tracking-wider text-ivory uppercase">
              La Plateforme N°1 du Mariage Afro
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-title text-ivory mb-4"
          >
            La Référence du
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-title hero-title-accent mb-8"
          >
            Mariage Afro
          </motion.p>

          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-32 h-px mx-auto mb-8"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(43, 75%, 55%), transparent)",
            }}
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="hero-subtitle text-ivory/90 mb-12 max-w-2xl mx-auto"
          >
            Trouvez les meilleurs prestataires pour votre mariage,
            <br className="hidden sm:block" />
            par culture, par pays et par tradition.
          </motion.p>

          {/* Search Bar with Dropdowns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <HeroSearchDropdowns />
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 mb-24 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-serif text-3xl md:text-4xl font-light text-gold leading-none">
                  {stat.number}
                </p>
                <p className="font-body text-[10px] md:text-xs text-ivory/50 uppercase tracking-[0.2em] mt-1.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

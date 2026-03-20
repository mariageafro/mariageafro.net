import { motion } from "framer-motion";
import heroImage from "@/assets/hero-couple.jpg";
import { HeroSearchDropdowns } from "./HeroSearchDropdowns";

const stats = [
  { number: "500+", label: "Prestataires" },
  { number: "15k+", label: "Mariages célébrés" },
  { number: "25+", label: "Pays représentés" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] sm:min-h-[85vh] flex items-center justify-center z-0 overflow-visible">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Couple afro en tenue de mariage traditionnelle"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-chocolate/50 via-chocolate/35 to-chocolate/65" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-editorial pt-28 pb-12 overflow-visible">
        <div className="max-w-4xl mx-auto text-center overflow-visible">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: "linear-gradient(135deg, hsla(38, 45%, 50%, 0.85) 0%, hsla(43, 75%, 55%, 0.85) 100%)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-ivory animate-pulse" />
            <span className="font-body text-xs font-medium tracking-wider text-ivory uppercase">
              La Plateforme N°1 du Mariage Afro
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-ivory leading-[1.1] mb-4"
          >
            Trouvez vos prestataires
            <br />
            <span className="text-gradient-gold italic font-medium">de mariage afro</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="font-body text-base sm:text-lg text-ivory/80 mb-10 max-w-xl mx-auto"
          >
            Par métier, ville et origine culturelle.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <HeroSearchDropdowns />
          </motion.div>

          {/* Stats — discreet, below search */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-10 flex items-center justify-center gap-6 md:gap-10"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-serif text-xl md:text-2xl font-light text-gold/90 leading-none">
                  {stat.number}
                </p>
                <p className="font-body text-[9px] md:text-[10px] text-ivory/40 uppercase tracking-[0.15em] mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-couple.jpg";

const stats = [
  { number: "500+", label: "Prestataires sélectionnés" },
  { number: "15k+", label: "Mariages célébrés" },
  { number: "25+", label: "Pays représentés" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Couple afro en tenue de mariage traditionnelle"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
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

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-ivory/95 backdrop-blur-sm rounded-full p-2 shadow-elegant max-w-3xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0">
              {/* Location */}
              <div className="flex-1 flex items-center gap-3 px-6 py-3 border-b sm:border-b-0 sm:border-r border-border">
                <MapPin className="text-champagne" size={20} />
                <div className="text-left">
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                    Localisation
                  </p>
                  <select className="w-full bg-transparent font-body text-sm text-chocolate focus:outline-none cursor-pointer">
                    <option value="">Choisir une ville</option>
                    <option value="paris">Paris</option>
                    <option value="lyon">Lyon</option>
                    <option value="marseille">Marseille</option>
                    <option value="bordeaux">Bordeaux</option>
                    <option value="lille">Lille</option>
                  </select>
                </div>
              </div>

              {/* Category */}
              <div className="flex-1 flex items-center gap-3 px-6 py-3">
                <Search className="text-champagne" size={20} />
                <div className="text-left">
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                    Catégorie
                  </p>
                  <select className="w-full bg-transparent font-body text-sm text-chocolate focus:outline-none cursor-pointer">
                    <option value="">Choisir un prestataire</option>
                    <option value="dj">DJ & Musique</option>
                    <option value="photo">Photographes</option>
                    <option value="traiteur">Traiteurs</option>
                    <option value="deco">Décoration</option>
                    <option value="planner">Wedding Planners</option>
                    <option value="tenues">Tenues traditionnelles</option>
                    <option value="beaute">Beauté</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <Button variant="hero" className="m-1 sm:m-0">
                <Search size={18} />
                Rechercher
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-serif text-4xl md:text-5xl font-light text-gold mb-2">
                {stat.number}
              </p>
              <p className="font-body text-xs md:text-sm text-ivory/70 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-ivory/60">
            <span className="font-body text-xs uppercase tracking-widest">Découvrir</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-px h-8 bg-gradient-to-b from-ivory/60 to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

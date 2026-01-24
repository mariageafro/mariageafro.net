import { motion } from "framer-motion";
import { Globe, Heart, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Globe,
    title: "Recherche par culture & pays",
    description: "Filtrez par origine, pays ou tradition pour trouver des prestataires qui comprennent vraiment vos célébrations.",
  },
  {
    icon: Heart,
    title: "Prestataires qui vous comprennent",
    description: "Des professionnels qui maîtrisent les codes culturels, les rituels et les attentes des mariages afro.",
  },
  {
    icon: Star,
    title: "Sélection qualitative",
    description: "Pas un simple annuaire : chaque prestataire est vérifié et recommandé par notre communauté.",
  },
  {
    icon: Users,
    title: "Communauté & confiance",
    description: "Rejoignez des milliers de couples qui ont célébré leur union avec MariageAfro.",
  },
];

export function WhySection() {
  return (
    <section className="section-padding bg-chocolate relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-champagne/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

      <div className="container-editorial relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-ivory mb-4">
            Pourquoi choisir <span className="text-gradient-gold italic">MariageAfro</span> ?
          </h2>
          <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-gold to-transparent my-6" />
          <p className="font-body text-ivory/70 max-w-2xl mx-auto">
            Plus qu'une plateforme, une communauté dédiée à célébrer l'amour à travers nos cultures.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-champagne/20 to-gold/20 flex items-center justify-center group-hover:from-champagne/30 group-hover:to-gold/30 transition-all duration-300">
                <feature.icon className="text-gold" size={28} />
              </div>
              <h3 className="font-serif text-xl text-ivory mb-3">{feature.title}</h3>
              <p className="font-body text-sm text-ivory/60 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Button variant="hero" asChild>
            <Link to="/prestataires">Découvrir nos prestataires</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

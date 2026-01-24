import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

const benefits = [
  "Visibilité auprès de milliers de couples",
  "Communauté engagée et qualifiée",
  "Avis vérifiés et confiance renforcée",
  "Tableau de bord professionnel",
];

export function ProSection() {
  return (
    <section className="section-padding bg-secondary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-editorial relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-champagne/10 text-champagne-dark font-body text-sm font-medium mb-6">
              Espace Prestataire
            </span>
            <h2 className="font-serif text-chocolate mb-6">
              Rejoignez <span className="text-gradient-gold italic">MariageAfro</span>
            </h2>
            <p className="font-body text-muted-foreground mb-8 leading-relaxed">
              Vous êtes un professionnel du mariage spécialisé dans les célébrations afro ? 
              Rejoignez notre communauté de prestataires et développez votre activité auprès 
              d'une clientèle qui vous comprend.
            </p>

            {/* Benefits */}
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="text-gold shrink-0" size={20} />
                  <span className="font-body text-foreground">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button variant="gold" size="lg" asChild>
                <Link to="/espace-pro">
                  Créer mon profil
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/a-propos">En savoir plus</Link>
              </Button>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-champagne/20 to-gold/20 rounded-3xl p-8 lg:p-12">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-ivory rounded-2xl p-6 shadow-soft">
                  <p className="font-serif text-4xl text-gradient-gold mb-2">+250%</p>
                  <p className="font-body text-sm text-muted-foreground">Visibilité moyenne</p>
                </div>
                <div className="bg-ivory rounded-2xl p-6 shadow-soft">
                  <p className="font-serif text-4xl text-gradient-gold mb-2">15k+</p>
                  <p className="font-body text-sm text-muted-foreground">Couples actifs</p>
                </div>
                <div className="bg-ivory rounded-2xl p-6 shadow-soft">
                  <p className="font-serif text-4xl text-gradient-gold mb-2">4.8★</p>
                  <p className="font-body text-sm text-muted-foreground">Note moyenne</p>
                </div>
                <div className="bg-ivory rounded-2xl p-6 shadow-soft">
                  <p className="font-serif text-4xl text-gradient-gold mb-2">500+</p>
                  <p className="font-body text-sm text-muted-foreground">Prestataires</p>
                </div>
              </div>

              {/* Decorative */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold/20 rounded-full blur-xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-champagne/20 rounded-full blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

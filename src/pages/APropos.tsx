import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Heart, Target, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import heroCouple from "@/assets/hero-couple.jpg";

const values = [
  {
    icon: Heart,
    title: "Passion & Authenticité",
    description: "Nous célébrons l'amour dans toute sa diversité culturelle, avec respect et authenticité.",
  },
  {
    icon: Target,
    title: "Excellence",
    description: "Chaque prestataire est sélectionné avec soin pour garantir une qualité irréprochable.",
  },
  {
    icon: Users,
    title: "Communauté",
    description: "Nous construisons une famille de couples et de professionnels unis par la même vision.",
  },
  {
    icon: Globe,
    title: "Diversité culturelle",
    description: "Nous honorons la richesse des traditions africaines dans toute leur diversité.",
  },
];

const stats = [
  { number: "500+", label: "Prestataires vérifiés" },
  { number: "15k+", label: "Couples accompagnés" },
  { number: "25+", label: "Pays représentés" },
  { number: "4.9", label: "Note moyenne" },
];

export default function APropos() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-warm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-champagne/10 rounded-full blur-3xl" />
        <div className="container-editorial relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-champagne/10 text-champagne-dark font-body text-sm font-medium mb-6">
                Notre histoire
              </span>
              <h1 className="font-serif text-chocolate mb-6">
                Célébrer l'amour,
                <br />
                <span className="text-gradient-gold italic">honorer nos cultures</span>
              </h1>
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                MariageAfro est né d'un constat simple : organiser un mariage qui respecte et célèbre nos traditions africaines ne devrait pas être un parcours du combattant. 
                Trop de couples passent des heures sur les réseaux sociaux à chercher des prestataires qui comprennent vraiment leurs attentes culturelles.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed">
                Notre mission est de créer le pont entre les couples de la diaspora et les professionnels qui partagent nos valeurs, nos traditions et notre vision de la célébration de l'amour.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-elegant">
                <img src={heroCouple} alt="Couple afro en tenue traditionnelle" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/30 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-ivory p-6 rounded-2xl shadow-elegant">
                <p className="font-serif text-4xl text-gradient-gold mb-1">2024</p>
                <p className="font-body text-sm text-muted-foreground">Année de création</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-chocolate">
        <div className="container-editorial">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="font-serif text-5xl text-gold mb-2">{stat.number}</p>
                <p className="font-body text-sm text-ivory/70 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gradient-warm">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-serif text-chocolate mb-4">
              Nos <span className="text-gradient-gold italic">valeurs</span>
            </h2>
            <div className="divider-gold my-6" />
            <p className="font-body text-muted-foreground">
              Ce qui nous anime au quotidien et guide chacune de nos décisions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-ivory shadow-soft"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-champagne/20 to-gold/20 flex items-center justify-center">
                  <value.icon className="text-champagne" size={28} />
                </div>
                <h3 className="font-serif text-xl text-chocolate mb-3">{value.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="section-padding bg-secondary">
        <div className="container-editorial">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-chocolate mb-6">Notre vision</h2>
              <p className="font-serif text-2xl text-chocolate/80 italic leading-relaxed mb-8">
                "Devenir la référence incontournable pour tous les couples de la diaspora africaine qui souhaitent célébrer leur amour dans le respect de leurs traditions, tout en embrassant la modernité."
              </p>
              <div className="divider-gold my-8" />
              <p className="font-body text-muted-foreground mb-8">
                Nous rêvons d'un monde où chaque couple africain, où qu'il soit dans le monde, peut facilement trouver des professionnels qui comprennent et valorisent ses traditions. 
                Un monde où nos cultures sont célébrées, respectées et transmises de génération en génération.
              </p>
              <Button variant="gold" size="lg" asChild>
                <Link to="/prestataires">Découvrir nos prestataires</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

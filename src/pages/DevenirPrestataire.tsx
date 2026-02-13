import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion, type Easing } from "framer-motion";
import {
  Users,
  BadgeCheck,
  TrendingUp,
  CreditCard,
  HeartHandshake,
  Headphones,
  Check,
  Star,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as Easing },
  }),
};

const avantages = [
  { icon: Users, title: "Accès direct aux futurs mariés", desc: "Recevez des demandes qualifiées de couples en recherche active." },
  { icon: BadgeCheck, title: "Profil professionnel vérifié", desc: "Gagnez en crédibilité avec un profil certifié et complet." },
  { icon: TrendingUp, title: "Mise en avant dans les recherches", desc: "Apparaissez en tête des résultats selon votre abonnement." },
  { icon: CreditCard, title: "Paiement sécurisé via Stripe", desc: "Transactions fiables et protégées pour votre tranquillité." },
  { icon: HeartHandshake, title: "Résiliation sans engagement", desc: "Liberté totale, annulez votre abonnement à tout moment." },
  { icon: Headphones, title: "Support prioritaire", desc: "Une équipe dédiée pour vous accompagner dans votre réussite." },
];

const plans = [
  {
    name: "PRO",
    price: 29,
    recommended: false,
    features: [
      "Profil visible sur la plateforme",
      "10 photos portfolio",
      "2 vidéos",
      "Accès aux demandes de devis",
      "Support standard",
    ],
  },
  {
    name: "PREMIUM",
    price: 59,
    recommended: true,
    features: [
      "Mise en avant prioritaire",
      "30 photos portfolio",
      "5 vidéos",
      "Badge vérifié",
      "Plus de visibilité",
      "Support prioritaire",
    ],
  },
  {
    name: "ELITE",
    price: 99,
    recommended: false,
    features: [
      "Top visibilité homepage",
      "Photos & vidéos illimitées",
      "Vidéo promotionnelle",
      "Placement prioritaire",
      "Accompagnement personnalisé",
    ],
  },
];

const faqs = [
  { q: "Puis-je résilier à tout moment ?", a: "Oui, absolument. Nos abonnements sont sans engagement. Vous pouvez résilier à tout moment depuis votre espace prestataire." },
  { q: "Quand mon profil est-il visible ?", a: "Votre profil devient visible dès que votre paiement est validé et votre compte approuvé par notre équipe." },
  { q: "Comment payer ?", a: "Le paiement se fait par carte bancaire de manière sécurisée via Stripe, leader mondial du paiement en ligne." },
  { q: "Y a-t-il une commission sur mes prestations ?", a: "Non, aucune commission. Vous payez uniquement votre abonnement mensuel, quel que soit le nombre de clients obtenus." },
];

export default function DevenirPrestataire() {
  return (
    <Layout>
      {/* SEO meta */}
      <title>Devenir Prestataire Mariage Afro | MariageAfro</title>
      <meta
        name="description"
        content="Rejoignez MariageAfro, la plateforme leader du mariage afro en Europe. Boostez votre visibilité et trouvez plus de clients mariage."
      />

      {/* ─── HERO ─── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-chocolate via-chocolate/90 to-chocolate/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-champagne/15 via-transparent to-transparent" />
        <div className="container-editorial relative z-10 text-center py-32 px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-champagne/20 text-champagne text-sm font-body tracking-widest uppercase">
              Espace Prestataire
            </span>
          </motion.div>
          <motion.h1
            className="font-display text-4xl md:text-5xl lg:text-6xl text-ivory leading-tight mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            Devenez Prestataire Premium
            <br />
            <span className="text-champagne italic">sur MariageAfro</span>
          </motion.h1>
          <motion.p
            className="font-body text-lg md:text-xl text-ivory/80 max-w-2xl mx-auto mb-10"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            Boostez votre visibilité et trouvez plus de clients mariage auprès de la communauté afro en Europe.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Button size="lg" variant="gold" asChild>
              <Link to="/auth">S'inscrire maintenant</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ─── AVANTAGES ─── */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="container-editorial px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="font-display text-3xl md:text-4xl text-chocolate mb-4">
              Pourquoi nous rejoindre ?
            </h2>
            <p className="font-body text-muted-foreground max-w-xl mx-auto">
              Tout ce dont vous avez besoin pour développer votre activité mariage.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {avantages.map((a, i) => (
              <motion.div
                key={a.title}
                className="bg-ivory rounded-2xl p-8 shadow-soft hover:shadow-lg transition-shadow duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
              >
                <div className="w-12 h-12 rounded-xl bg-champagne/15 flex items-center justify-center mb-5">
                  <a.icon className="w-6 h-6 text-champagne" />
                </div>
                <h3 className="font-display text-xl text-chocolate mb-2">{a.title}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TARIFS ─── */}
      <section className="py-20 md:py-28 bg-ivory">
        <div className="container-editorial px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="font-display text-3xl md:text-4xl text-chocolate mb-4">
              Nos Abonnements
            </h2>
            <p className="font-body text-muted-foreground max-w-xl mx-auto">
              Choisissez la formule qui correspond à vos ambitions. Sans engagement.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col transition-shadow duration-300 ${
                  plan.recommended
                    ? "bg-gradient-to-b from-champagne/10 to-ivory border-2 border-champagne shadow-xl scale-[1.03]"
                    : "bg-cream border border-border shadow-soft hover:shadow-lg"
                }`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-champagne text-chocolate text-xs font-body font-semibold tracking-widest uppercase rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Recommandé
                  </div>
                )}
                <h3 className="font-display text-2xl text-chocolate mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-4xl text-chocolate">{plan.price}€</span>
                  <span className="font-body text-sm text-muted-foreground">/mois</span>
                </div>
                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm font-body text-chocolate/80">
                      <Check className="w-4 h-4 text-champagne mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.recommended ? "gold" : "gold-outline"}
                  className="w-full"
                  asChild
                >
                  <Link to="/auth">Choisir {plan.name}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PREUVE SOCIALE ─── */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="container-editorial px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <p className="font-display text-2xl md:text-3xl text-chocolate italic max-w-3xl mx-auto leading-relaxed">
              « Déjà plusieurs dizaines de prestataires nous font confiance en France et en Europe. »
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 md:py-28 bg-ivory">
        <div className="container-editorial px-4 max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="font-display text-3xl md:text-4xl text-chocolate mb-4">
              Questions fréquentes
            </h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <AccordionItem
                  value={`faq-${i}`}
                  className="bg-cream rounded-xl border border-border px-6"
                >
                  <AccordionTrigger className="font-display text-lg text-chocolate hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-muted-foreground pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── CTA FINALE ─── */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-chocolate via-chocolate/95 to-chocolate/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-champagne/10 via-transparent to-transparent" />
        <div className="container-editorial relative z-10 text-center px-4">
          <motion.h2
            className="font-display text-3xl md:text-4xl text-ivory mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            Rejoignez dès maintenant la plateforme leader
            <br />
            <span className="text-champagne italic">du mariage afro en Europe</span>
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <Button size="lg" variant="gold" asChild>
              <Link to="/auth">Devenir Prestataire</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

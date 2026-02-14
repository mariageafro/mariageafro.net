import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Heart, CalendarDays, ListChecks, Calculator, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useToolTranslations } from "@/hooks/use-tool-translations";

const tools = [
  { icon: CalendarDays, slug: "planning", nameKey: "Planning du mariage", description_fr: "Organisez chaque étape avec un calendrier personnalisé.", description_en: "Organize each step with a personalized calendar." },
  { icon: ListChecks, slug: "checklist", nameKey: "Checklist", description_fr: "Ne rien oublier grâce à une liste de tâches complète.", description_en: "Never forget anything with a comprehensive task list." },
  { icon: Calculator, slug: "budget", nameKey: "Budget", description_fr: "Gérez votre budget mariage et suivez vos dépenses.", description_en: "Manage your wedding budget and track expenses." },
  { icon: Heart, slug: "liste-de-souhaits", nameKey: "Liste de souhaits", description_fr: "Créez votre liste de cadeaux en ligne.", description_en: "Create your gift list online." },
  { icon: Bell, slug: "rappels", nameKey: "Rappels", description_fr: "Recevez des notifications pour vos rendez-vous importants.", description_en: "Get notifications for your important appointments." },
];

export default function OutilsMaries() {
  const t = useToolTranslations();

  return (
    <Layout>
      <section className="pt-32 pb-12 bg-gradient-warm">
        <div className="container-editorial">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
            <span className="badge-premium mb-4 inline-flex">💍 {t("Outils Mariés")}</span>
            <h1 className="font-serif text-chocolate mb-4">
              {t("Outils Mariés").split(" ")[0]} <span className="text-gradient-gold italic">{t("Outils Mariés").split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="font-body text-muted-foreground">
              {t("Outils Mariés") === "Wedding Tools"
                ? "A complete suite of tools to organize your wedding from A to Z."
                : "Une suite d'outils pour organiser votre mariage de A à Z."}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-gradient-warm !py-12">
        <div className="container-editorial">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {tools.map((tool, index) => (
              <motion.div key={tool.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Link to={`/outils-maries/${tool.slug}`} className="block card-premium p-6 text-center hover:shadow-elegant transition-all">
                  <div className="w-14 h-14 rounded-full bg-champagne/10 flex items-center justify-center mx-auto mb-4">
                    <tool.icon className="text-champagne" size={24} />
                  </div>
                  <h3 className="font-serif text-lg text-chocolate mb-2">{t(tool.nameKey)}</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {t("Outils Mariés") === "Wedding Tools" ? tool.description_en : tool.description_fr}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

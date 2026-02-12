import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Heart, CalendarDays, ListChecks, Calculator, Bell } from "lucide-react";

const tools = [
  { icon: CalendarDays, name: "Planning du mariage", description: "Organisez chaque étape avec un calendrier personnalisé." },
  { icon: ListChecks, name: "Checklist", description: "Ne rien oublier grâce à une liste de tâches complète." },
  { icon: Calculator, name: "Budget", description: "Gérez votre budget mariage et suivez vos dépenses." },
  { icon: Heart, name: "Liste de souhaits", description: "Créez votre liste de cadeaux en ligne." },
  { icon: Bell, name: "Rappels", description: "Recevez des notifications pour vos rendez-vous importants." },
];

export default function OutilsMaries() {
  return (
    <Layout>
      <section className="pt-32 pb-12 bg-gradient-warm">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="badge-premium mb-4 inline-flex">💍 Coming Soon</span>
            <h1 className="font-serif text-chocolate mb-4">
              Outils <span className="text-gradient-gold italic">Mariés</span>
            </h1>
            <p className="font-body text-muted-foreground">
              Bientôt disponible : une suite d'outils pour organiser votre mariage de A à Z.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-gradient-warm">
        <div className="container-editorial">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-premium p-6 text-center opacity-60"
              >
                <div className="w-14 h-14 rounded-full bg-champagne/10 flex items-center justify-center mx-auto mb-4">
                  <tool.icon className="text-champagne" size={24} />
                </div>
                <h3 className="font-serif text-lg text-chocolate mb-2">{tool.name}</h3>
                <p className="font-body text-sm text-muted-foreground">{tool.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <p className="font-body text-muted-foreground text-lg">
              Inscrivez-vous pour être notifié du lancement 🎉
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

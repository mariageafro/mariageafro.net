import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import {
  Heart, CalendarDays, ListChecks, Calculator, Bell, Clock,
  LayoutGrid, Users, Sparkles, ChevronRight, ArrowRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToolTranslations } from "@/hooks/use-tool-translations";
import { useAuthContext } from "@/contexts/auth-context";
import { useWeddingProfile } from "@/hooks/use-wedding-profile";
import { usePlanningTasks } from "@/hooks/use-planning-tasks";
import { ProgressRing } from "@/components/wedding/ProgressRing";
import { Button } from "@/components/ui/button";

const tools = [
  { icon: LayoutGrid, slug: "dashboard", nameKey: "Dashboard", description_fr: "Votre tableau de bord mariage : KPIs, timeline, budget, actions.", description_en: "Your wedding dashboard: KPIs, timeline, budget, actions.", accent: true },
  { icon: CalendarDays, slug: "planning", nameKey: "Planning du mariage", description_fr: "Organisez chaque étape avec un calendrier personnalisé.", description_en: "Organize each step with a personalized calendar." },
  { icon: ListChecks, slug: "checklist", nameKey: "Checklist", description_fr: "Ne rien oublier grâce à une liste de tâches complète.", description_en: "Never forget anything with a comprehensive task list." },
  { icon: Calculator, slug: "budget", nameKey: "Budget", description_fr: "Gérez votre budget mariage et suivez vos dépenses.", description_en: "Manage your wedding budget and track expenses." },
  { icon: Heart, slug: "liste-de-souhaits", nameKey: "Liste de souhaits", description_fr: "Créez votre liste de cadeaux en ligne.", description_en: "Create your gift list online." },
  { icon: Bell, slug: "rappels", nameKey: "Rappels", description_fr: "Recevez des notifications pour vos rendez-vous importants.", description_en: "Get notifications for your important appointments." },
  { icon: Clock, slug: "timeline", nameKey: "Timeline Jour J", description_fr: "Planifiez votre journée minute par minute.", description_en: "Plan your wedding day minute by minute." },
  { icon: Users, slug: "rsvp", nameKey: "RSVP Invités", description_fr: "Gérez les confirmations et les accompagnants.", description_en: "Manage confirmations and companions." },
];

export default function OutilsMaries() {
  const t = useToolTranslations();
  const { user } = useAuthContext();
  const { profile } = useWeddingProfile();
  const { tasks } = usePlanningTasks();
  const navigate = useNavigate();
  const isEn = t("Outils Mariés") === "Wedding Tools";

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.done).length;
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <Layout>
      {/* Hero Section with Progress Ring */}
      <section className="pt-32 pb-12 bg-gradient-warm relative">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto"
          >
            {/* Progress Ring (if logged in with profile) */}
            {user && profile && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-shrink-0"
              >
                <ProgressRing percent={progressPercent} size={80} strokeWidth={5} />
              </motion.div>
            )}

            <div className={`text-center ${user && profile ? "md:text-left" : ""}`}>
              <span className="badge-premium mb-4 inline-flex">
                <Sparkles size={14} className="mr-1" />
                {isEn ? "Wedding Planner" : "Assistant Mariage"}
              </span>
              <h1 className="font-serif text-chocolate mb-3">
                {isEn ? "Your " : "Votre "}
                <span className="text-gradient-gold italic">
                  {isEn ? "Wedding Planner" : "Wedding Planner"}
                </span>
              </h1>
              <p className="font-body text-muted-foreground max-w-lg">
                {isEn
                  ? "A complete suite of premium tools to plan your wedding from A to Z."
                  : "Une suite d'outils premium pour planifier votre mariage de A à Z."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 mt-5 justify-center md:justify-start">
                {user && profile ? (
                  <Button variant="gold" asChild>
                    <Link to="/outils-maries/dashboard">
                      {isEn ? "Open Dashboard" : "Ouvrir le Dashboard"} <ArrowRight size={16} />
                    </Link>
                  </Button>
                ) : user ? (
                  <Button variant="gold" asChild>
                    <Link to="/mon-mariage/onboarding">
                      {isEn ? "Start Planning" : "Commencer la planification"} <ArrowRight size={16} />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="gold" asChild>
                    <Link to="/auth">
                      {isEn ? "Sign in to start" : "Se connecter pour commencer"} <ArrowRight size={16} />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid with Glassmorphism */}
      <section className="section-padding bg-gradient-warm !py-12">
        <div className="container-editorial">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                {('coming' in tool && tool.coming) ? (
                  <div className="card-glass p-6 text-center h-full opacity-60 cursor-default relative">
                    <span className="absolute top-3 right-3 text-[10px] font-body font-medium uppercase tracking-wider text-champagne bg-champagne/10 px-2 py-0.5 rounded-full">
                      {isEn ? "Soon" : "Bientôt"}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-champagne/10 flex items-center justify-center mx-auto mb-4">
                      <tool.icon className="text-champagne" size={22} />
                    </div>
                    <h3 className="font-serif text-base text-chocolate mb-1.5">{t(tool.nameKey)}</h3>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">
                      {isEn ? tool.description_en : tool.description_fr}
                    </p>
                  </div>
                ) : (
                  <Link
                    to={tool.slug === "timeline" ? "/mon-mariage/jour-j" : tool.slug === "rsvp" ? "/mon-mariage/rsvp" : `/outils-maries/${tool.slug}`}
                    className={`block card-glass p-6 text-center h-full group relative ${
                      tool.accent ? "ring-1 ring-champagne/30" : ""
                    }`}
                  >
                    {tool.accent && (
                      <span className="absolute top-3 right-3 text-[10px] font-body font-medium uppercase tracking-wider text-champagne bg-champagne/10 px-2 py-0.5 rounded-full">
                        ★ Hub
                      </span>
                    )}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                      tool.accent
                        ? "bg-gradient-to-br from-champagne/20 to-gold/10 group-hover:from-champagne/30 group-hover:to-gold/20"
                        : "bg-champagne/10 group-hover:bg-champagne/20"
                    }`}>
                      <tool.icon className="text-champagne group-hover:scale-110 transition-transform duration-300" size={22} />
                    </div>
                    <h3 className="font-serif text-base text-chocolate mb-1.5">{t(tool.nameKey)}</h3>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">
                      {isEn ? tool.description_en : tool.description_fr}
                    </p>
                    <ChevronRight
                      size={14}
                      className="text-champagne/0 group-hover:text-champagne transition-all duration-300 mx-auto mt-3"
                    />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

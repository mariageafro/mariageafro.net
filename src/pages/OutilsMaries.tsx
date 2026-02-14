import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, CalendarDays, ListChecks, Calculator, Bell, Clock,
  LayoutGrid, Users, Sparkles, ChevronRight, ArrowRight,
  TrendingUp, Zap, MapPin, AlertCircle, FileDown, Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToolTranslations } from "@/hooks/use-tool-translations";
import { useAuthContext } from "@/contexts/auth-context";
import { useWeddingProfile } from "@/hooks/use-wedding-profile";
import { usePlanningTasks } from "@/hooks/use-planning-tasks";
import { ProgressRing } from "@/components/wedding/ProgressRing";
import { Button } from "@/components/ui/button";
import { differenceInDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  demoCouple, demoBudgetCategories, demoTasks, demoTimeline, demoRsvp,
  demoPayments, demoReminder,
  getDemoBudgetTotals, getDemoTaskStats, getDemoBudgetChartData, getDemoRsvpChartData,
} from "@/data/demo-wedding-data";

// ── Animation helpers ──
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

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

// ── Glassmorphism KPI card ──
function KpiCard({ icon: Icon, value, label, delay = 0, accent = false }: {
  icon: React.ElementType; value: string | number; label: string; delay?: number; accent?: boolean;
}) {
  return (
    <motion.div {...fadeUp(delay)} className={`card-glass p-4 md:p-5 text-center group transition-all duration-300 hover:-translate-y-1 ${accent ? "ring-1 ring-champagne/30" : ""}`}>
      <Icon size={20} className="text-champagne mx-auto mb-2 group-hover:scale-110 transition-transform" />
      <p className="font-serif text-2xl md:text-3xl text-foreground">{value}</p>
      <p className="font-body text-xs text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
}

// ── Main Page ──
export default function OutilsMaries() {
  const t = useToolTranslations();
  const { user } = useAuthContext();
  const { profile } = useWeddingProfile();
  const { tasks } = usePlanningTasks();
  const [showDemo, setShowDemo] = useState(false);
  const isEn = t("Outils Mariés") === "Wedding Tools";

  // Decide: show real data or demo
  const isDemo = showDemo || (!user || !profile);
  const displayMode = isDemo ? "demo" : "real";

  // Real data
  const realTotalTasks = tasks.length;
  const realDoneTasks = tasks.filter(t => t.done).length;
  const realProgress = realTotalTasks > 0 ? Math.round((realDoneTasks / realTotalTasks) * 100) : 0;

  // Demo data
  const demoStats = getDemoTaskStats();
  const demoBudget = getDemoBudgetTotals();

  // Unified data layer
  const coupleName = isDemo ? demoCouple.couple_display_name : (profile?.couple_display_name || "");
  const weddingDate = isDemo ? demoCouple.wedding_date : profile?.wedding_date;
  const city = isDemo ? demoCouple.city : profile?.city;
  const country = isDemo ? demoCouple.country : profile?.country;
  const guestCount = isDemo ? demoCouple.guest_count : (profile?.guest_count || 0);
  const budget = isDemo ? demoCouple.estimated_budget : (profile?.estimated_budget || 0);
  const progressPercent = isDemo ? demoStats.percent : realProgress;
  const totalTasks = isDemo ? demoStats.total : realTotalTasks;
  const doneTasks = isDemo ? demoStats.done : realDoneTasks;
  const daysUntilWedding = weddingDate ? differenceInDays(new Date(weddingDate), new Date()) : null;

  const budgetChartData = getDemoBudgetChartData();
  const rsvpChartData = getDemoRsvpChartData();

  const upcomingDemoTasks = demoTasks.filter(t => !t.done).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()).slice(0, 5);

  return (
    <Layout>
      {/* ══════ HERO ══════ */}
      <section className="pt-28 md:pt-32 pb-8 bg-gradient-warm relative overflow-hidden">
        {/* Subtle grain */}
        <div className="texture-grain absolute inset-0 pointer-events-none" />

        <div className="container-editorial relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="flex flex-col md:flex-row items-start md:items-center gap-6 max-w-5xl mx-auto"
          >
            {/* Progress Ring - large */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-shrink-0 hidden md:block"
            >
              <ProgressRing percent={progressPercent} size={100} strokeWidth={6} />
            </motion.div>

            <div className="flex-1">
              {isDemo && (
                <p className="font-body text-sm text-muted-foreground mb-1">
                  {isEn ? `Hi ${demoCouple.partner_one_first_name} & ${demoCouple.partner_two_first_name},` : `Salut ${demoCouple.partner_one_first_name} & ${demoCouple.partner_two_first_name},`}
                </p>
              )}
              {!isDemo && profile && (
                <p className="font-body text-sm text-muted-foreground mb-1">
                  {isEn ? `Hi ${profile.partner_one_first_name} & ${profile.partner_two_first_name},` : `Salut ${profile.partner_one_first_name} & ${profile.partner_two_first_name},`}
                </p>
              )}

              <h1 className="font-serif text-foreground text-3xl md:text-5xl lg:text-6xl font-light tracking-tight mb-2">
                {isEn ? "Welcome to your" : "Bienvenue sur votre"}
                <br />
                <span className="italic text-gradient-gold">
                  {isEn ? "Intelligent Wedding Planner" : "Assistant Mariage Intelligent"}
                </span>
              </h1>
              <p className="font-body text-muted-foreground text-sm md:text-base max-w-lg mb-5">
                {isEn
                  ? "Plan every moment, manage your budget and follow your guests easily."
                  : "Planifiez chaque moment, gérez votre budget et suivez vos invités facilement."}
              </p>

              {/* CTA Row */}
              <div className="flex flex-wrap gap-3 items-center">
                {user && profile ? (
                  <Button variant="gold" className="gap-2" onClick={async () => {
                    const { data: { session } } = await (await import("@/integrations/supabase/client")).supabase.auth.getSession();
                    if (!session) return;
                    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-book`;
                    const res = await fetch(url, { headers: { Authorization: `Bearer ${session.access_token}` } });
                    const html = await res.text();
                    const w = window.open("", "_blank");
                    if (w) { w.document.write(html); w.document.close(); }
                  }}>
                    <FileDown size={16} />
                    {isEn ? "Export Wedding Book" : "Exporter le Book Mariage"}
                  </Button>
                ) : user ? (
                  <Button variant="gold" asChild className="gap-2">
                    <Link to="/mon-mariage/onboarding">
                      <ArrowRight size={16} />
                      {isEn ? "Create my wedding space" : "Créer mon espace mariage"}
                    </Link>
                  </Button>
                ) : (
                  <Button variant="gold" asChild className="gap-2">
                    <Link to="/auth">
                      <ArrowRight size={16} />
                      {isEn ? "Sign in to start" : "Se connecter pour créer votre mariage"}
                    </Link>
                  </Button>
                )}

                {/* Demo Toggle */}
                {user && profile ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDemo(!showDemo)}
                    className="font-body text-xs gap-1.5 rounded-full"
                  >
                    <Eye size={14} />
                    {showDemo ? (isEn ? "My data" : "Mes données") : (isEn ? "See demo" : "Voir la démo")}
                  </Button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-body text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                    <Eye size={14} className="text-champagne" />
                    {isEn ? "Demo mode" : "Mode démo"}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ DEMO BANNER ══════ */}
      <AnimatePresence>
        {isDemo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-champagne/10 border-b border-champagne/20 overflow-hidden"
          >
            <div className="container-editorial py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-champagne" />
                <p className="font-body text-xs text-foreground">
                  {isEn
                    ? "You are viewing demo data. Sign in to create your own wedding planner."
                    : "Vous visualisez des données de démonstration. Connectez-vous pour créer votre espace."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!user && (
                  <Button variant="gold" size="sm" asChild className="font-body text-xs">
                    <Link to="/auth">{isEn ? "Sign in" : "Se connecter"}</Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild className="font-body text-xs gap-1.5">
                  <Link to="/demo-mariage">
                    <Eye size={12} />
                    {isEn ? "Full demo" : "Démo complète"}
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════ NEXT REMINDER ══════ */}
      {isDemo && (
        <motion.div {...fadeUp(0.15)} className="container-editorial mt-6">
          <div className="card-glass p-4 flex items-center gap-3 max-w-5xl mx-auto">
            <div className="w-8 h-8 rounded-full bg-champagne/10 flex items-center justify-center flex-shrink-0">
              <Bell size={14} className="text-champagne" />
            </div>
            <p className="font-body text-sm text-foreground flex-1">
              <span className="font-medium">{isEn ? "Next reminder:" : "Prochain rappel :"}</span>{" "}
              <span className="italic text-muted-foreground">{demoReminder.text}</span>
            </p>
          </div>
        </motion.div>
      )}

      {/* ══════ KPI ROW ══════ */}
      <section className="bg-gradient-warm py-6 md:py-8">
        <div className="container-editorial max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <KpiCard icon={TrendingUp} value={`${progressPercent}%`} label={isEn ? "Completion" : "Progression"} delay={0.1} accent />
            <KpiCard icon={Calculator} value={`${isDemo ? demoBudget.percent : 0}%`} label={isEn ? "Budget spent" : "Budget consommé"} delay={0.15} />
            <KpiCard icon={ListChecks} value={`${doneTasks}/${totalTasks}`} label={isEn ? "Tasks done" : "Tâches complétées"} delay={0.2} />
            {daysUntilWedding !== null && daysUntilWedding > 0 ? (
              <KpiCard icon={Heart} value={`J-${daysUntilWedding}`} label={isEn ? "Until the big day" : "Avant le Jour J"} delay={0.25} />
            ) : (
              <KpiCard icon={Users} value={isDemo ? `${demoRsvp.confirmed}/${demoRsvp.total}` : `0/${guestCount}`} label={isEn ? "RSVP confirmed" : "Invités confirmés"} delay={0.25} />
            )}
          </div>
        </div>
      </section>

      {/* ══════ MAIN DASHBOARD GRID ══════ */}
      <section className="bg-gradient-warm pb-12 md:pb-16">
        <div className="container-editorial max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ── Budget Card ── */}
            <motion.div {...fadeUp(0.2)} className="card-glass p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-foreground flex items-center gap-2">
                  <Calculator size={18} className="text-champagne" /> Budget
                </h3>
                <Link to="/outils-maries/budget" className="font-body text-xs text-primary hover:underline">Détails</Link>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-28 h-28 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={budgetChartData} innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value" stroke="none">
                        {budgetChartData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => `${value.toLocaleString()} €`}
                        contentStyle={{ background: "hsl(40, 30%, 97%)", border: "1px solid hsl(35, 20%, 85%)", borderRadius: "12px", fontFamily: "var(--font-body)", fontSize: "12px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-1.5">
                  {demoBudgetCategories.slice(0, 5).map(c => (
                    <div key={c.name} className="flex items-center gap-2 text-xs font-body">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                      <span className="text-muted-foreground">{c.name}</span>
                      <span className="ml-auto text-foreground font-medium">{Math.round((c.amount / demoBudget.total) * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 space-y-1.5">
                <div className="flex justify-between font-body text-xs">
                  <span className="text-muted-foreground">Budget cible</span>
                  <span className="text-foreground font-medium">{budget.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between font-body text-xs">
                  <span className="text-muted-foreground">Déjà engagé</span>
                  <span className="text-foreground font-medium">{isDemo ? demoBudget.paid.toLocaleString() : 0} €</span>
                </div>
                <div className="flex items-center gap-2 font-body text-xs">
                  <span className="text-muted-foreground">Reste estimé</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-champagne to-gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${isDemo ? demoBudget.percent : 0}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <span className="text-foreground font-medium">{isDemo ? demoBudget.remaining.toLocaleString() : budget.toLocaleString()} €</span>
                </div>
              </div>
            </motion.div>

            {/* ── Timeline du Mariage Card ── */}
            <motion.div {...fadeUp(0.25)} className="card-glass p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-foreground flex items-center gap-2">
                  <Clock size={18} className="text-champagne" /> Timeline du Mariage
                </h3>
              </div>

              <div className="space-y-0">
                {(isDemo ? demoTimeline.slice(0, 4) : []).map((item, i) => (
                  <div key={item.id} className="flex items-start gap-3 py-2.5 group">
                    <div className="flex flex-col items-center pt-0.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-champagne group-hover:scale-125 transition-transform" />
                      {i < 3 && <div className="w-px h-8 bg-champagne/20" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-body text-xs font-semibold text-champagne tabular-nums">{item.start_time}</span>
                        <span className="font-body text-sm text-foreground truncate">{item.title}</span>
                      </div>
                      <p className="font-body text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {item.address?.split(",")[0]}
                      </p>
                    </div>
                    {isDemo && (
                      <span className="font-body text-xs text-muted-foreground/60 tabular-nums hidden sm:block">
                        {demoBudgetCategories[i]?.paid.toLocaleString()} €
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-border/50">
                <Button variant="outline" size="sm" className="w-full font-body text-xs gap-1.5" asChild>
                  <Link to="/mon-mariage/jour-j">
                    <Clock size={12} /> {isEn ? "Manage timeline" : "Gérer timeline"}
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* ── RSVP & Payments Column ── */}
            <div className="space-y-5">
              {/* RSVP Status */}
              <motion.div {...fadeUp(0.3)} className="card-glass p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-base text-foreground flex items-center gap-2">
                    <Users size={16} className="text-champagne" /> {isEn ? "Invitation Status" : "Statut des Invitations"}
                  </h3>
                  <Link to="/mon-mariage/rsvp" className="font-body text-[10px] text-primary hover:underline px-2 py-1 rounded-full border border-border/50 hover:border-champagne/30 transition-colors">
                    {isEn ? "See responses" : "Revoir les réponses"}
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: demoRsvp.confirmed, label: isEn ? "Confirmed" : "Confirmés", color: "text-champagne" },
                    { value: demoRsvp.pending, label: isEn ? "Pending" : "En attente", color: "text-muted-foreground" },
                    { value: demoRsvp.declined, label: isEn ? "Declined" : "Désistés", color: "text-destructive" },
                  ].map(item => (
                    <div key={item.label} className="text-center">
                      <div className="w-12 h-12 mx-auto mb-1.5 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[{ value: item.value }, { value: demoRsvp.total - item.value }]}
                              innerRadius={16} outerRadius={22} startAngle={90} endAngle={-270}
                              dataKey="value" stroke="none"
                            >
                              <Cell fill={item.color === "text-champagne" ? "hsl(38,45%,50%)" : item.color === "text-destructive" ? "hsl(15,50%,40%)" : "hsl(35,20%,70%)"} />
                              <Cell fill="hsl(35,20%,90%)" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <span className="absolute inset-0 flex items-center justify-center font-serif text-xs text-foreground">{item.value}</span>
                      </div>
                      <p className={`font-body text-[10px] ${item.color}`}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Payments */}
              <motion.div {...fadeUp(0.35)} className="card-glass p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-base text-foreground flex items-center gap-2">
                    <AlertCircle size={16} className="text-champagne" /> {isEn ? "Upcoming Payments" : "Paiements à Venir"}
                  </h3>
                  <Link to="/prestataires" className="font-body text-[10px] text-primary hover:underline flex items-center gap-1">
                    {isEn ? "See vendors" : "Voir prestataires"} <ChevronRight size={10} />
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {demoPayments.slice(0, 3).map(p => (
                    <div key={p.vendor} className="flex items-center gap-3 py-1.5">
                      <div className="w-8 h-8 rounded-full bg-champagne/10 flex items-center justify-center flex-shrink-0">
                        <span className="font-serif text-xs text-champagne">{p.vendor.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs text-foreground truncate">{p.vendor}</p>
                        <p className="font-body text-[10px] text-muted-foreground">
                          {p.status === "confirmed" ? "✓ Confirmé" : p.status === "partial" ? "⏳ Partiel" : "⏳ En attente"} · ↓ {p.deposit.toLocaleString()} €
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-body text-xs text-foreground font-medium">{p.total.toLocaleString()} €</p>
                        <p className="font-body text-[10px] text-muted-foreground">
                          Solde: {format(new Date(p.dueDate), "d MMM", { locale: fr })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ TOOLS GRID ══════ */}
      <section className="bg-gradient-warm pb-16 md:pb-24">
        <div className="container-editorial max-w-5xl">
          <motion.div {...fadeUp(0.1)} className="text-center mb-8">
            <span className="badge-premium mb-3 inline-flex">
              <Sparkles size={14} className="mr-1" />
              {isEn ? "All your tools" : "Tous vos outils"}
            </span>
            <h2 className="font-serif text-foreground text-2xl md:text-3xl mb-2">
              {isEn ? "Your Premium Tools" : "Vos Outils Premium"}
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
              {isEn
                ? "A complete suite to plan your wedding from A to Z."
                : "Une suite complète pour planifier votre mariage de A à Z."}
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.slug}
                variants={{ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
              >
                <Link
                  to={tool.slug === "dashboard" ? "/outils-maries/dashboard"
                    : tool.slug === "timeline" ? "/mon-mariage/jour-j"
                    : tool.slug === "rsvp" ? "/mon-mariage/rsvp"
                    : `/outils-maries/${tool.slug}`}
                  className={`block card-glass p-5 md:p-6 text-center h-full group relative transition-all duration-300 hover:-translate-y-1 ${
                    tool.accent ? "ring-1 ring-champagne/30" : ""
                  }`}
                >
                  {tool.accent && (
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-body font-medium uppercase tracking-wider text-champagne bg-champagne/10 px-2 py-0.5 rounded-full">
                      ★ Hub
                    </span>
                  )}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${
                    tool.accent
                      ? "bg-gradient-to-br from-champagne/20 to-gold/10 group-hover:from-champagne/30 group-hover:to-gold/20"
                      : "bg-champagne/10 group-hover:bg-champagne/20"
                  }`}>
                    <tool.icon className="text-champagne group-hover:scale-110 transition-transform duration-300" size={20} />
                  </div>
                  <h3 className="font-serif text-sm text-foreground mb-1">{t(tool.nameKey)}</h3>
                  <p className="font-body text-[11px] text-muted-foreground leading-relaxed hidden sm:block">
                    {isEn ? tool.description_en : tool.description_fr}
                  </p>
                  <ChevronRight
                    size={14}
                    className="text-champagne/0 group-hover:text-champagne transition-all duration-300 mx-auto mt-2"
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════ CTA BOTTOM ══════ */}
      {!user && (
        <section className="bg-gradient-warm pb-20">
          <div className="container-editorial max-w-3xl text-center">
            <motion.div {...fadeUp(0.1)} className="card-glass p-8 md:p-12">
              <Sparkles size={24} className="text-champagne mx-auto mb-4" />
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
                {isEn ? "Ready to plan your wedding?" : "Prêt à planifier votre mariage ?"}
              </h2>
              <p className="font-body text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                {isEn
                  ? "Create your personalized wedding space for free and access all premium tools."
                  : "Créez votre espace mariage personnalisé gratuitement et accédez à tous les outils premium."}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="gold" asChild className="gap-2">
                  <Link to="/auth">
                    <ArrowRight size={16} />
                    {isEn ? "Create my wedding space" : "Créer mon espace mariage"}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="gap-2 font-body text-xs">
                  <Link to="/auth">
                    {isEn ? "Sign in" : "Se connecter"}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </Layout>
  );
}

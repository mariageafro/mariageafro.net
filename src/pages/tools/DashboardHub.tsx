import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useWeddingProfile } from "@/hooks/use-wedding-profile";
import { usePlanningTasks } from "@/hooks/use-planning-tasks";
import { useDayOfTimeline } from "@/hooks/use-day-of-timeline";
import { useAuthContext } from "@/contexts/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/wedding/ProgressRing";
import {
  Heart, CalendarDays, ListChecks, Calculator, Users, Clock,
  MapPin, Sparkles, ChevronRight, CheckCircle2, AlertCircle,
  ArrowRight, Share2, FileDown, TrendingUp, Zap
} from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { fr } from "date-fns/locale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function DashboardHub() {
  const { user } = useAuthContext();
  const { profile, loading: profileLoading } = useWeddingProfile();
  const { tasks, loading: tasksLoading } = usePlanningTasks();
  const { timeline, items: timelineItems } = useDayOfTimeline();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileLoading && !profile && user) {
      navigate("/mon-mariage/onboarding");
    }
  }, [profile, profileLoading, user, navigate]);

  if (!user) { navigate("/auth"); return null; }
  if (profileLoading || tasksLoading) {
    return (
      <Layout>
        <div className="pt-32 pb-16 bg-gradient-warm min-h-screen">
          <div className="container-editorial text-center">
            <div className="w-8 h-8 rounded-full border-2 border-champagne border-t-transparent animate-spin mx-auto" />
          </div>
        </div>
      </Layout>
    );
  }
  if (!profile) return null;

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.done).length;
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const daysUntilWedding = profile.wedding_date
    ? differenceInDays(new Date(profile.wedding_date), new Date())
    : null;
  const upcomingTasks = tasks
    .filter(t => !t.done && t.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5);
  const urgentTasks = tasks.filter(t => !t.done && t.priority === "urgent");
  const budgetUsed = 0; // placeholder until budget tracking

  return (
    <Layout>
      {/* Sticky Header Bar */}
      <section className="pt-28 pb-6 bg-gradient-warm">
        <div className="container-editorial">
          <div className="flex flex-col md:flex-row items-center gap-5">
            <ProgressRing percent={progressPercent} size={72} strokeWidth={5} />
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-serif text-chocolate text-2xl md:text-3xl mb-1">
                {profile.couple_display_name}
              </h1>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start font-body text-sm text-muted-foreground">
                {profile.wedding_date && (
                  <span className="flex items-center gap-1">
                    <CalendarDays size={14} />
                    {format(new Date(profile.wedding_date), "d MMMM yyyy", { locale: fr })}
                  </span>
                )}
                {profile.city && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {profile.city}, {profile.country}
                  </span>
                )}
                {daysUntilWedding !== null && daysUntilWedding > 0 && (
                  <span className="flex items-center gap-1 text-primary font-semibold">
                    <Heart size={14} />
                    J-{daysUntilWedding}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="font-body text-xs" asChild>
                <Link to="/mon-mariage/onboarding">Modifier profil</Link>
              </Button>
              <Button variant="gold-outline" size="sm" className="font-body text-xs">
                <Share2 size={14} className="mr-1" /> Partager
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-warm !py-8 md:!py-10">
        <div className="container-editorial max-w-6xl space-y-6">

          {/* KPI Row */}
          <motion.div {...fadeUp(0.1)} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="card-glass p-4 text-center">
              <TrendingUp size={18} className="text-champagne mx-auto mb-2" />
              <p className="font-serif text-2xl text-chocolate">{progressPercent}%</p>
              <p className="font-body text-xs text-muted-foreground">Progression</p>
            </div>
            <div className="card-glass p-4 text-center">
              <Calculator size={18} className="text-champagne mx-auto mb-2" />
              <p className="font-serif text-2xl text-chocolate">{profile.estimated_budget?.toLocaleString()} €</p>
              <p className="font-body text-xs text-muted-foreground">Budget cible</p>
            </div>
            <div className="card-glass p-4 text-center">
              <Users size={18} className="text-champagne mx-auto mb-2" />
              <p className="font-serif text-2xl text-chocolate">{profile.guest_count}</p>
              <p className="font-body text-xs text-muted-foreground">Invités estimés</p>
            </div>
            <div className="card-glass p-4 text-center">
              <ListChecks size={18} className="text-champagne mx-auto mb-2" />
              <p className="font-serif text-2xl text-chocolate">{doneTasks}/{totalTasks}</p>
              <p className="font-body text-xs text-muted-foreground">Tâches complétées</p>
            </div>
          </motion.div>

          {/* Main Grid: 2/3 + 1/3 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Left Column: Top Actions + Timeline */}
            <div className="lg:col-span-2 space-y-5">

              {/* Top 5 Actions */}
              <motion.div {...fadeUp(0.2)} className="card-glass p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-chocolate flex items-center gap-2">
                    <Zap size={18} className="text-champagne" />
                    Prochaines actions
                  </h3>
                  <Link to="/mon-mariage/planning" className="font-body text-xs text-primary hover:underline flex items-center gap-1">
                    Tout voir <ChevronRight size={12} />
                  </Link>
                </div>

                {urgentTasks.length > 0 && (
                  <div className="mb-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20 flex items-center gap-2">
                    <AlertCircle size={14} className="text-destructive flex-shrink-0" />
                    <p className="font-body text-xs text-destructive">
                      {urgentTasks.length} tâche{urgentTasks.length > 1 ? "s" : ""} urgente{urgentTasks.length > 1 ? "s" : ""} à traiter
                    </p>
                  </div>
                )}

                {upcomingTasks.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="text-primary mx-auto mb-2" size={24} />
                    <p className="font-body text-sm text-muted-foreground">Tout est sous contrôle ! 🎉</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {upcomingTasks.map(task => (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-champagne/5 transition-colors">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          task.priority === "urgent" ? "bg-destructive animate-pulse" :
                          task.priority === "high" ? "bg-primary" :
                          "bg-muted-foreground/40"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm text-foreground truncate">{task.title}</p>
                          <p className="font-body text-xs text-muted-foreground">
                            {task.due_date && format(new Date(task.due_date), "d MMM", { locale: fr })}
                            <span className="ml-2 text-champagne capitalize">{task.category}</span>
                          </p>
                        </div>
                        <ChevronRight size={14} className="text-muted-foreground/30" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Timeline Preview */}
              <motion.div {...fadeUp(0.3)} className="card-glass p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-chocolate flex items-center gap-2">
                    <Clock size={18} className="text-champagne" />
                    Timeline Jour J
                  </h3>
                  <Link to="/mon-mariage/jour-j" className="font-body text-xs text-primary hover:underline flex items-center gap-1">
                    Gérer <ChevronRight size={12} />
                  </Link>
                </div>

                {timelineItems.length === 0 ? (
                  <div className="text-center py-6">
                    <Clock className="text-muted-foreground/30 mx-auto mb-2" size={24} />
                    <p className="font-body text-sm text-muted-foreground mb-3">Aucun évènement planifié</p>
                    <Button variant="outline" size="sm" className="font-body text-xs" asChild>
                      <Link to="/mon-mariage/jour-j">
                        Créer la timeline <ArrowRight size={12} className="ml-1" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {timelineItems.slice(0, 5).map((item, i) => (
                      <div key={item.id} className="flex items-start gap-3 p-2">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-champagne mt-1.5" />
                          {i < Math.min(timelineItems.length, 5) - 1 && (
                            <div className="w-px h-8 bg-champagne/20" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm text-foreground">{item.title}</p>
                          <p className="font-body text-xs text-muted-foreground">
                            {item.start_time}{item.end_time ? ` — ${item.end_time}` : ""}
                            {item.address && <span className="ml-2">📍 {item.address}</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                    {timelineItems.length > 5 && (
                      <p className="font-body text-xs text-muted-foreground text-center pt-2">
                        + {timelineItems.length - 5} autres évènements
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column: Budget + Suggestions + Quick Links */}
            <div className="space-y-5">

              {/* Budget Summary */}
              <motion.div {...fadeUp(0.25)} className="card-glass p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-base text-chocolate flex items-center gap-2">
                    <Calculator size={16} className="text-champagne" />
                    Budget
                  </h3>
                  <Link to="/outils-maries/budget" className="font-body text-xs text-primary hover:underline">
                    Détails
                  </Link>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-body text-xs text-muted-foreground mb-1">
                      <span>Consommé</span>
                      <span>0 / {profile.estimated_budget?.toLocaleString()} €</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-champagne to-gold transition-all" style={{ width: "0%" }} />
                    </div>
                  </div>
                  <p className="font-body text-xs text-muted-foreground text-center">
                    Budget complet bientôt disponible
                  </p>
                </div>
              </motion.div>

              {/* Suggestions personnalisées */}
              <motion.div {...fadeUp(0.35)} className="card-glass p-5">
                <h3 className="font-serif text-base text-chocolate flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-champagne" />
                  Suggestions
                </h3>
                <div className="space-y-3">
                  <Link to="/prestataires" className="flex items-center gap-2 p-2 rounded-lg hover:bg-champagne/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-champagne/10 flex items-center justify-center flex-shrink-0">
                      <Heart size={14} className="text-champagne" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs text-foreground">Trouver des prestataires</p>
                      <p className="font-body text-[10px] text-muted-foreground">
                        {profile.city ? `À ${profile.city}` : "Près de chez vous"}
                      </p>
                    </div>
                    <ChevronRight size={12} className="text-muted-foreground/30 group-hover:text-champagne transition-colors" />
                  </Link>
                  <Link to="/outils-maries/checklist" className="flex items-center gap-2 p-2 rounded-lg hover:bg-champagne/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-champagne/10 flex items-center justify-center flex-shrink-0">
                      <ListChecks size={14} className="text-champagne" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs text-foreground">Compléter la checklist</p>
                      <p className="font-body text-[10px] text-muted-foreground">{totalTasks - doneTasks} restantes</p>
                    </div>
                    <ChevronRight size={12} className="text-muted-foreground/30 group-hover:text-champagne transition-colors" />
                  </Link>
                  {!timeline && (
                    <Link to="/mon-mariage/jour-j" className="flex items-center gap-2 p-2 rounded-lg hover:bg-champagne/5 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-champagne/10 flex items-center justify-center flex-shrink-0">
                        <Clock size={14} className="text-champagne" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs text-foreground">Créer la timeline Jour J</p>
                        <p className="font-body text-[10px] text-muted-foreground">Planifiez votre journée</p>
                      </div>
                      <ChevronRight size={12} className="text-muted-foreground/30 group-hover:text-champagne transition-colors" />
                    </Link>
                  )}
                </div>
              </motion.div>

              {/* Quick Navigation */}
              <motion.div {...fadeUp(0.4)} className="card-glass p-5">
                <h3 className="font-serif text-base text-chocolate mb-3">Accès rapide</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: CalendarDays, label: "Planning", href: "/mon-mariage/planning" },
                    { icon: Clock, label: "Jour J", href: "/mon-mariage/jour-j" },
                    { icon: Calculator, label: "Budget", href: "/outils-maries/budget" },
                    { icon: ListChecks, label: "Checklist", href: "/outils-maries/checklist" },
                    { icon: Heart, label: "Souhaits", href: "/outils-maries/liste-de-souhaits" },
                    { icon: Users, label: "RSVP", href: "/outils-maries" },
                  ].map(link => (
                    <Link key={link.label} to={link.href}
                      className="kpi-card p-3 hover:border-champagne/30 transition-all group">
                      <link.icon size={16} className="text-champagne mb-1 group-hover:scale-110 transition-transform" />
                      <span className="font-body text-[10px] text-foreground">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

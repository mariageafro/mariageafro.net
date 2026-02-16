import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useWeddingProfile } from "@/hooks/use-wedding-profile";
import { usePlanningTasks } from "@/hooks/use-planning-tasks";
import { useAuthContext } from "@/contexts/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Heart, CalendarDays, ListChecks, Calculator, Users, Clock,
  MapPin, Sparkles, ChevronRight, CheckCircle2, FileText, Globe
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RsvpLiveCounters } from "@/components/wedding/RsvpLiveCounters";
import { CulturalRecommendations } from "@/components/wedding/CulturalRecommendations";
import { differenceInDays, format } from "date-fns";
import { fr } from "date-fns/locale";

const quickLinks = [
  { icon: CalendarDays, label: "Planning", href: "/mon-mariage/planning" },
  { icon: Clock, label: "Jour J", href: "/mon-mariage/jour-j" },
  { icon: Calculator, label: "Budget", href: "/outils-maries/budget" },
  { icon: ListChecks, label: "Checklist", href: "/outils-maries/checklist" },
  { icon: Users, label: "RSVP", href: "/mon-mariage/rsvp" },
  { icon: Globe, label: "Mon site", href: "/mon-mariage/site" },
];

export default function WeddingDashboard() {
  const { user } = useAuthContext();
  const { profile, loading: profileLoading } = useWeddingProfile();
  const { tasks, loading: tasksLoading } = usePlanningTasks();
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
            <p className="font-body text-muted-foreground">Chargement...</p>
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

  const urgentTasks = tasks.filter(t => !t.done && t.priority === "urgent").length;

  return (
    <Layout>
      <section className="pt-28 pb-8 bg-gradient-warm">
        <div className="container-editorial">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center md:text-left">
            <span className="badge-premium mb-3 inline-flex"><Sparkles size={14} className="mr-1" /> Mon Mariage</span>
            <h1 className="font-serif text-chocolate text-3xl md:text-4xl mb-1">
              {profile.couple_display_name}
            </h1>
            {profile.couple_quote && (
              <p className="font-body text-muted-foreground italic text-sm">"{profile.couple_quote}"</p>
            )}
            <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start font-body text-sm text-muted-foreground">
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
                <span className="flex items-center gap-1 text-primary font-medium">
                  <Heart size={14} />
                  J-{daysUntilWedding}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-gradient-warm !py-8 md:!py-12">
        <div className="container-editorial max-w-5xl space-y-8">

          {/* Progress + Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="card-premium p-6 md:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-lg text-chocolate">Progression</h3>
                <span className="font-body text-2xl font-semibold text-primary">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-3 mb-3" />
              <p className="font-body text-sm text-muted-foreground">
                {doneTasks} / {totalTasks} tâches accomplies
                {urgentTasks > 0 && <span className="text-destructive ml-2">• {urgentTasks} urgente{urgentTasks > 1 ? "s" : ""}</span>}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="card-premium p-6 text-center">
              <p className="font-body text-sm text-muted-foreground mb-1">Budget estimé</p>
              <p className="font-serif text-2xl text-chocolate">{profile.estimated_budget?.toLocaleString()} €</p>
              <p className="font-body text-xs text-muted-foreground mt-1">{profile.guest_count} invités</p>
            </motion.div>
          </div>

          {/* Quick Access */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="font-serif text-lg text-chocolate mb-4">Accès rapide</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {quickLinks.map((link, i) => (
                <Link key={link.label} to={link.href}
                  className="card-premium p-4 text-center hover:shadow-elegant transition-all group">
                  <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-champagne/20 transition-colors">
                    <link.icon className="text-primary" size={18} />
                  </div>
                  <p className="font-body text-xs text-foreground">{link.label}</p>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* RSVP Live Counters */}
          <RsvpLiveCounters />

          {/* Cultural Recommendations */}
          {(profile.origin_partner_one || profile.origin_partner_two) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <h3 className="font-serif text-lg text-chocolate mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-primary" /> Recommandé pour votre culture
              </h3>
              <CulturalRecommendations
                originOne={profile.origin_partner_one || ""}
                originTwo={profile.origin_partner_two || ""}
                weddingType={profile.wedding_type || "mixte"}
                country={profile.country || "France"}
                budget={profile.estimated_budget || 15000}
                guestCount={profile.guest_count || 100}
                weddingStyle={profile.wedding_style || "moderne"}
                showVendorLinks={true}
              />
            </motion.div>
          )}

          {/* Upcoming Tasks */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-chocolate">Prochaines tâches</h3>
              <Link to="/mon-mariage/planning" className="font-body text-sm text-primary hover:underline flex items-center gap-1">
                Tout voir <ChevronRight size={14} />
              </Link>
            </div>
            {upcomingTasks.length === 0 ? (
              <div className="card-premium p-6 text-center">
                <CheckCircle2 className="text-primary mx-auto mb-2" size={24} />
                <p className="font-body text-sm text-muted-foreground">Aucune tâche à venir — tout est sous contrôle ! 🎉</p>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="card-premium p-4 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      task.priority === "urgent" ? "bg-destructive" :
                      task.priority === "high" ? "bg-primary" :
                      "bg-muted-foreground"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-foreground truncate">{task.title}</p>
                      <p className="font-body text-xs text-muted-foreground">
                        {task.due_date && format(new Date(task.due_date), "d MMM yyyy", { locale: fr })}
                        <span className="ml-2 capitalize">{task.category}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Export + Edit profile */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              variant="gold"
              className="font-body text-sm"
              onClick={async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;
                const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-book`;
                const res = await fetch(url, { headers: { Authorization: `Bearer ${session.access_token}` } });
                const html = await res.text();
                const blob = new Blob([html], { type: "text/html" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "book-mariage.html";
                a.click();
              }}
            >
              <FileText className="mr-2" size={16} /> Exporter mon Book Mariage
            </Button>
            <Link to="/mon-mariage/onboarding">
              <Button variant="outline" className="font-body text-sm">Modifier le profil du couple</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

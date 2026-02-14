import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Heart, CalendarDays, MapPin, Sparkles, Users, Calculator,
  ListChecks, Clock, ChevronRight, CheckCircle2, AlertTriangle,
  Gift, FileText, Crown, Star, Shield, TrendingUp, Printer
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  demoCouple, demoBudgetCategories, demoBudgetTarget, demoBudgetSpent, demoBudgetOverrun,
  demoVendors, demoRsvp, demoGuests, demoTimeline, demoWishlist, demoTasks,
  getDemoBudgetChartData, getDemoRsvpChartData, getDemoHealthScore, getDemoTaskStats,
} from "@/data/demo-wedding-data";

// ───────── Animated Counter ─────────
function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "" }: { end: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString("fr-FR")}{suffix}</span>;
}

// ───────── Section wrapper with scroll reveal ─────────
function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ───────── Glassmorphism card ─────────
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/30 bg-white/40 backdrop-blur-xl shadow-elegant p-6 ${className}`}>
      {children}
    </div>
  );
}

// ───────── MAIN PAGE ─────────
export default function DemoMariage() {
  const healthScore = getDemoHealthScore();
  const taskStats = getDemoTaskStats();
  const budgetChartData = getDemoBudgetChartData();
  const rsvpChartData = getDemoRsvpChartData();

  return (
    <Layout>
      {/* Demo banner */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-md text-primary-foreground text-center py-2.5 px-4 font-body text-sm">
        <Sparkles className="inline mr-2" size={14} />
        Vous visualisez un mariage de démonstration terminé
        <Link to="/mon-mariage/onboarding" className="ml-3 underline font-semibold hover:text-white transition-colors">
          Créer mon propre mariage →
        </Link>
      </div>

      {/* ═══════ HERO ═══════ */}
      <section className="pt-36 pb-16 bg-gradient-warm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a96e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container-editorial text-center relative">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <span className="badge-premium mb-4 inline-flex text-sm"><Crown size={14} className="mr-1.5" /> Mariage Terminé</span>
            <h1 className="font-serif text-chocolate text-4xl md:text-6xl lg:text-7xl mb-3 tracking-tight">
              {demoCouple.couple_display_name}
            </h1>
            <p className="font-body text-muted-foreground italic text-lg md:text-xl max-w-xl mx-auto mb-6">
              "{demoCouple.couple_quote}"
            </p>
            <div className="flex flex-wrap gap-4 justify-center font-body text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2">
                <CalendarDays size={14} className="text-primary" /> 12 août 2026
              </span>
              <span className="flex items-center gap-1.5 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2">
                <MapPin size={14} className="text-primary" /> Paris, France
              </span>
              <span className="flex items-center gap-1.5 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2">
                <Users size={14} className="text-primary" /> 250 invités
              </span>
              <span className="flex items-center gap-1.5 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2">
                <Heart size={14} className="text-primary" /> Congo × Cameroun
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ HEALTH SCORE ═══════ */}
      <section className="section-padding bg-gradient-warm !py-10">
        <div className="container-editorial max-w-5xl">
          <RevealSection>
            <GlassCard className="text-center">
              <h2 className="font-serif text-2xl text-chocolate mb-4">Santé du Mariage</h2>
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(35, 20%, 90%)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none" stroke="hsl(38, 45%, 50%)" strokeWidth="8"
                    strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 42}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    whileInView={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - healthScore / 100) }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-3xl text-chocolate"><AnimatedCounter end={healthScore} suffix="%" /></span>
                </div>
              </div>
              <p className="font-body text-muted-foreground text-sm max-w-md mx-auto">
                {healthScore >= 90
                  ? "✅ Mariage parfaitement orchestré !"
                  : `⚠️ Score global : ${healthScore}% — Mariage réussi avec dépassement budget`}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                {[
                  { label: "Budget", ok: demoBudgetOverrun <= 0, text: demoBudgetOverrun > 0 ? "Dépassé" : "OK" },
                  { label: "Prestataires", ok: true, text: "Tous confirmés" },
                  { label: "Paiements", ok: true, text: "Tous réglés" },
                  { label: "Invités", ok: demoRsvp.pending <= 10, text: `${demoRsvp.pending} en attente` },
                ].map(item => (
                  <div key={item.label} className={`rounded-xl p-3 text-center ${item.ok ? "bg-green-50/60" : "bg-orange-50/60"}`}>
                    <p className="font-body text-xs text-muted-foreground">{item.label}</p>
                    <p className={`font-body text-sm font-semibold ${item.ok ? "text-green-700" : "text-orange-700"}`}>
                      {item.ok ? <CheckCircle2 className="inline mr-1" size={12} /> : <AlertTriangle className="inline mr-1" size={12} />}
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ BUDGET ═══════ */}
      <section className="section-padding bg-gradient-warm !py-10">
        <div className="container-editorial max-w-5xl">
          <RevealSection>
            <h2 className="font-serif text-3xl text-chocolate text-center mb-8">
              <Calculator className="inline mr-2 text-primary" size={28} />
              Budget Complet
            </h2>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Budget cible", value: demoBudgetTarget, color: "text-chocolate" },
              { label: "Total dépensé", value: demoBudgetSpent, color: "text-primary" },
              { label: "Dépassement", value: demoBudgetOverrun, color: "text-destructive", prefix: "+" },
            ].map((item, i) => (
              <RevealSection key={item.label} delay={i * 0.1}>
                <GlassCard className="text-center">
                  <p className="font-body text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className={`font-serif text-3xl ${item.color}`}>
                    <AnimatedCounter end={item.value} prefix={item.prefix} suffix=" €" />
                  </p>
                </GlassCard>
              </RevealSection>
            ))}
          </div>

          {demoBudgetOverrun > 0 && (
            <RevealSection>
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center mb-6">
                <AlertTriangle className="inline mr-2 text-destructive" size={16} />
                <span className="font-body text-sm text-destructive font-semibold">
                  ⚠️ Budget dépassé de {demoBudgetOverrun.toLocaleString("fr-FR")} €
                </span>
              </div>
            </RevealSection>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevealSection>
              <GlassCard>
                <h3 className="font-serif text-lg text-chocolate mb-4 text-center">Répartition</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={budgetChartData} dataKey="value" cx="50%" cy="50%" outerRadius={110} innerRadius={60} paddingAngle={2} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                      {budgetChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v.toLocaleString("fr-FR")} €`} />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCard>
            </RevealSection>

            <RevealSection delay={0.2}>
              <GlassCard>
                <h3 className="font-serif text-lg text-chocolate mb-4 text-center">Par catégorie</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={demoBudgetCategories.slice(0, 10)} layout="vertical" margin={{ left: 80 }}>
                    <XAxis type="number" tickFormatter={(v) => `${v / 1000}k`} fontSize={11} />
                    <YAxis type="category" dataKey="name" fontSize={11} width={75} />
                    <Tooltip formatter={(v: number) => `${v.toLocaleString("fr-FR")} €`} />
                    <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                      {demoBudgetCategories.slice(0, 10).map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══════ PRESTATAIRES ═══════ */}
      <section className="section-padding bg-gradient-warm !py-10">
        <div className="container-editorial max-w-5xl">
          <RevealSection>
            <h2 className="font-serif text-3xl text-chocolate text-center mb-2">
              <Star className="inline mr-2 text-primary" size={28} />
              Prestataires du Mariage
            </h2>
            <p className="font-body text-muted-foreground text-center mb-8">{demoVendors.length} prestataires confirmés</p>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoVendors.map((v, i) => (
              <RevealSection key={v.id} delay={Math.min(i * 0.03, 0.3)}>
                <GlassCard className="!p-4 hover:shadow-elegant transition-all duration-300 group">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {v.photo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-body text-sm font-semibold text-foreground truncate">{v.name}</p>
                        <CheckCircle2 className="text-green-600 flex-shrink-0" size={14} />
                      </div>
                      <p className="font-body text-xs text-muted-foreground">{v.role}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs font-body text-muted-foreground">
                        <span>Acompte: {v.deposit.toLocaleString()}€</span>
                        <span className="text-primary font-medium">Total: {v.total.toLocaleString()}€</span>
                      </div>
                      <div className="mt-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-body bg-green-100/80 text-green-700">
                          <CheckCircle2 size={10} className="mr-1" /> {v.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ RSVP ═══════ */}
      <section className="section-padding bg-gradient-warm !py-10">
        <div className="container-editorial max-w-5xl">
          <RevealSection>
            <h2 className="font-serif text-3xl text-chocolate text-center mb-8">
              <Users className="inline mr-2 text-primary" size={28} />
              RSVP — Invités
            </h2>
          </RevealSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Confirmés", value: demoRsvp.confirmed, color: "text-green-700", bg: "bg-green-50/60" },
              { label: "En attente", value: demoRsvp.pending, color: "text-orange-700", bg: "bg-orange-50/60" },
              { label: "Désistés", value: demoRsvp.declined, color: "text-red-700", bg: "bg-red-50/60" },
              { label: "Accompagnants", value: demoRsvp.companions, color: "text-primary", bg: "bg-primary/5" },
            ].map((item, i) => (
              <RevealSection key={item.label} delay={i * 0.1}>
                <GlassCard className={`text-center !p-5 ${item.bg}`}>
                  <p className="font-body text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className={`font-serif text-3xl ${item.color}`}><AnimatedCounter end={item.value} /></p>
                </GlassCard>
              </RevealSection>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevealSection>
              <GlassCard>
                <h3 className="font-serif text-lg text-chocolate mb-4 text-center">Répartition</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={rsvpChartData} dataKey="value" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3} label={({ name, value }) => `${name}: ${value}`}>
                      {rsvpChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCard>
            </RevealSection>

            <RevealSection delay={0.2}>
              <GlassCard className="max-h-[350px] overflow-auto">
                <h3 className="font-serif text-lg text-chocolate mb-4">Invités (extrait)</h3>
                <div className="space-y-2">
                  {demoGuests.slice(0, 15).map(g => (
                    <div key={g.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        g.status === "confirmed" ? "bg-green-500" : g.status === "pending" ? "bg-orange-400" : "bg-red-400"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm truncate">{g.first_name} {g.last_name}</p>
                        <p className="font-body text-xs text-muted-foreground">{g.group}{g.companions > 0 && ` · +${g.companions}`}{g.dietary && ` · ${g.dietary}`}</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        {g.steps.mairie && <span className="text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5">Mairie</span>}
                        {g.steps.reception && <span className="text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5">Réception</span>}
                        {g.steps.brunch && <span className="text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5">Brunch</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══════ TIMELINE JOUR J ═══════ */}
      <section className="section-padding bg-gradient-warm !py-10">
        <div className="container-editorial max-w-3xl">
          <RevealSection>
            <h2 className="font-serif text-3xl text-chocolate text-center mb-8">
              <Clock className="inline mr-2 text-primary" size={28} />
              Timeline Jour J
            </h2>
          </RevealSection>

          <div className="relative">
            {/* Vertical golden line */}
            <motion.div
              className="absolute left-6 md:left-8 top-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/30"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeOut" }}
            />

            <div className="space-y-6">
              {demoTimeline.map((item, i) => (
                <RevealSection key={item.id} delay={i * 0.08}>
                  <div className="relative pl-16 md:pl-20 group">
                    {/* Glowing dot */}
                    <div className="absolute left-[18px] md:left-[26px] top-3 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg group-hover:scale-125 group-hover:shadow-[0_0_12px_hsl(38,45%,50%)] transition-all duration-300" />
                    <GlassCard className="!p-4 group-hover:border-primary/40 transition-all duration-300">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-body text-xs text-primary font-semibold mb-1">{item.start_time} — {item.end_time}</p>
                          <p className="font-serif text-lg text-chocolate">{item.title}</p>
                          <p className="font-body text-xs text-muted-foreground mt-1">{item.address}</p>
                          <p className="font-body text-xs text-muted-foreground">👤 {item.responsible}</p>
                        </div>
                        {item.budget > 0 && (
                          <span className="font-body text-xs text-primary font-semibold bg-primary/10 rounded-full px-2.5 py-1 flex-shrink-0">
                            {item.budget.toLocaleString()}€
                          </span>
                        )}
                      </div>
                    </GlassCard>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CHECKLIST ═══════ */}
      <section className="section-padding bg-gradient-warm !py-10">
        <div className="container-editorial max-w-4xl">
          <RevealSection>
            <h2 className="font-serif text-3xl text-chocolate text-center mb-2">
              <ListChecks className="inline mr-2 text-primary" size={28} />
              Checklist
            </h2>
            <p className="font-body text-muted-foreground text-center mb-8">
              {taskStats.done}/{taskStats.total} tâches accomplies — {taskStats.percent}%
            </p>
          </RevealSection>
          <RevealSection>
            <GlassCard>
              <Progress value={taskStats.percent} className="h-3 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {demoTasks.map(t => (
                  <div key={t.id} className="flex items-center gap-2.5 py-1.5">
                    <CheckCircle2 className="text-green-600 flex-shrink-0" size={16} />
                    <span className="font-body text-sm text-muted-foreground line-through">{t.title}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ WISHLIST ═══════ */}
      <section className="section-padding bg-gradient-warm !py-10">
        <div className="container-editorial max-w-3xl">
          <RevealSection>
            <h2 className="font-serif text-3xl text-chocolate text-center mb-8">
              <Gift className="inline mr-2 text-primary" size={28} />
              Liste de Souhaits
            </h2>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {demoWishlist.map((w, i) => (
              <RevealSection key={w.id} delay={i * 0.1}>
                <GlassCard className="!p-4 hover:shadow-elegant transition-all group">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-125 transition-transform">{w.icon}</span>
                    <div className="flex-1">
                      <p className="font-body text-sm font-semibold text-foreground">{w.title}</p>
                      <p className="font-body text-xs text-muted-foreground">
                        {w.amount > 0 ? `${w.amount.toLocaleString()} €` : "Montant libre"} · {w.payment}
                      </p>
                    </div>
                    <span className={`text-xs font-body px-2 py-1 rounded-full ${
                      w.status === "Acheté" ? "bg-green-100 text-green-700" :
                      w.status === "Réservé" ? "bg-primary/10 text-primary" :
                      "bg-muted text-muted-foreground"
                    }`}>{w.status}</span>
                  </div>
                </GlassCard>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA FINAL ═══════ */}
      <section className="section-padding bg-gradient-warm !py-16">
        <div className="container-editorial max-w-2xl text-center">
          <RevealSection>
            <GlassCard className="!p-10">
              <Crown className="text-primary mx-auto mb-4" size={40} />
              <h2 className="font-serif text-3xl text-chocolate mb-3">Impressionné(e) ?</h2>
              <p className="font-body text-muted-foreground mb-6 max-w-md mx-auto">
                Créez votre propre espace mariage et accédez à tous ces outils gratuitement. Planifiez, gérez et célébrez votre union avec élégance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/mon-mariage/onboarding">
                  <Button className="font-body text-sm px-8 py-3 bg-primary hover:bg-primary/90">
                    <Heart className="mr-2" size={16} /> Créer mon mariage
                  </Button>
                </Link>
                <Link to="/prestataires">
                  <Button variant="outline" className="font-body text-sm px-8 py-3">
                    Découvrir les prestataires
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </RevealSection>
        </div>
      </section>
    </Layout>
  );
}

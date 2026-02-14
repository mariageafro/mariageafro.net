import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Heart, CalendarDays, MapPin, Sparkles, Users, Calculator,
  ListChecks, Clock, ChevronRight, CheckCircle2, AlertTriangle,
  Gift, FileText, Crown, Star, Shield, TrendingUp, Printer,
  Hotel, Bus, UtensilsCrossed, ChevronDown, ChevronUp
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  demoCouple, demoBudgetCategories, demoBudgetTarget, demoBudgetSpent, demoBudgetOverrun,
  demoVendors, demoRsvp, demoGuests, demoTimeline, demoWishlist, demoTasks,
  getDemoBudgetChartData, getDemoRsvpChartData, getDemoHealthScore, getDemoTaskStats,
  getDemoRsvpStats,
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
function GlassCard({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-white/30 bg-white/40 backdrop-blur-xl shadow-elegant p-6 ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
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
  const rsvpStats = getDemoRsvpStats();
  const [expandedVendors, setExpandedVendors] = useState(false);
  const [expandedGuests, setExpandedGuests] = useState(false);

  const healthItems = [
    { label: "Budget", ok: demoBudgetOverrun <= 0, text: demoBudgetOverrun > 0 ? `Dépassé +${demoBudgetOverrun.toLocaleString("fr-FR")}€` : "Maîtrisé" },
    { label: "Prestataires", ok: demoVendors.every(v => v.confirmed), text: `${demoVendors.length} confirmés` },
    { label: "Paiements", ok: !demoVendors.some(v => v.remaining > 0), text: demoVendors.some(v => v.remaining > 0) ? "1 solde restant" : "Tous réglés" },
    { label: "Invités", ok: demoRsvp.pending <= 10, text: `${demoRsvp.pending} en attente` },
    { label: "Timeline", ok: true, text: "Complète" },
    { label: "Statut", ok: true, text: "🎉 Célébré" },
  ];

  return (
    <Layout>
      {/* Demo banner */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-md text-primary-foreground text-center py-2.5 px-4 font-body text-sm">
        <Sparkles className="inline mr-2" size={14} />
        Vous visualisez un mariage de démonstration — Expérience immersive
        <Link to="/mon-mariage/onboarding" className="ml-3 underline font-semibold hover:text-white transition-colors">
          Créer mon propre mariage →
        </Link>
      </div>

      {/* ═══════ HERO ═══════ */}
      <section className="pt-36 pb-16 bg-gradient-warm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a96e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container-editorial text-center relative">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <span className="badge-premium mb-4 inline-flex text-sm"><Crown size={14} className="mr-1.5" /> 🎉 Mariage célébré avec succès</span>
            <h1 className="font-serif text-chocolate text-4xl md:text-6xl lg:text-7xl mb-3 tracking-tight">
              {demoCouple.couple_display_name}
            </h1>
            <p className="font-body text-muted-foreground italic text-lg md:text-xl max-w-xl mx-auto mb-6">
              "{demoCouple.couple_quote}"
            </p>
            <div className="flex flex-wrap gap-3 justify-center font-body text-sm text-muted-foreground">
              {[
                { icon: CalendarDays, text: "12 août 2026" },
                { icon: MapPin, text: "Paris, France" },
                { icon: Users, text: "250 invités" },
                { icon: Heart, text: "Congo 🇨🇩 × Cameroun 🇨🇲" },
              ].map(item => (
                <span key={item.text} className="flex items-center gap-1.5 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2">
                  <item.icon size={14} className="text-primary" /> {item.text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ HEALTH SCORE ═══════ */}
      <section className="section-padding bg-gradient-warm !py-10">
        <div className="container-editorial max-w-5xl">
          <RevealSection>
            <GlassCard className="text-center">
              <h2 className="font-serif text-2xl text-chocolate mb-4">💍 Santé du Mariage</h2>
              <div className="relative w-44 h-44 mx-auto mb-4">
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
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-serif text-4xl text-chocolate"><AnimatedCounter end={healthScore} suffix="%" /></span>
                  <span className="font-body text-xs text-muted-foreground mt-0.5">Score global</span>
                </div>
              </div>

              {/* Dynamic health summary */}
              <div className="bg-white/30 rounded-xl p-4 mb-6 max-w-lg mx-auto text-left space-y-1.5 font-body text-sm">
                {demoBudgetOverrun > 0 && (
                  <p className="text-orange-700">⚠️ Budget à {Math.round((demoBudgetSpent / demoBudgetTarget) * 100)}% — dépassement de {demoBudgetOverrun.toLocaleString("fr-FR")} €</p>
                )}
                {demoVendors.some(v => v.remaining > 0) && (
                  <p className="text-orange-700">⚠️ 1 solde traiteur restant ({demoVendors.find(v => v.remaining > 0)?.remaining.toLocaleString("fr-FR")} €)</p>
                )}
                <p className="text-green-700">✅ Timeline Jour J complète ({demoTimeline.length} étapes)</p>
                <p className="text-green-700">✅ {demoRsvp.confirmed}/{demoRsvp.total} invités confirmés</p>
                <p className="text-green-700">✅ {demoVendors.length} prestataires confirmés</p>
                <p className="text-green-700">🎉 Mariage terminé et célébré</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {healthItems.map(item => (
                  <div key={item.label} className={`rounded-xl p-3 text-center transition-all duration-300 hover:scale-105 ${item.ok ? "bg-green-50/60" : "bg-orange-50/60"}`}>
                    <p className="font-body text-xs text-muted-foreground">{item.label}</p>
                    <p className={`font-body text-xs font-semibold ${item.ok ? "text-green-700" : "text-orange-700"}`}>
                      {item.ok ? <CheckCircle2 className="inline mr-1" size={10} /> : <AlertTriangle className="inline mr-1" size={10} />}
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
              Budget Complet — {demoBudgetCategories.length} postes
            </h2>
          </RevealSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Budget cible", value: demoBudgetTarget, color: "text-chocolate", icon: "🎯" },
              { label: "Total dépensé", value: demoBudgetSpent, color: "text-primary", icon: "💰" },
              { label: "Dépassement", value: demoBudgetOverrun, color: "text-destructive", prefix: "+", icon: "⚠️" },
              { label: "Solde restant", value: demoVendors.reduce((s, v) => s + v.remaining, 0), color: "text-orange-700", icon: "⏳" },
            ].map((item, i) => (
              <RevealSection key={item.label} delay={i * 0.1}>
                <GlassCard className="text-center hover:scale-105 transition-transform duration-300">
                  <span className="text-xl">{item.icon}</span>
                  <p className="font-body text-xs text-muted-foreground mb-1 mt-1">{item.label}</p>
                  <p className={`font-serif text-2xl md:text-3xl ${item.color}`}>
                    <AnimatedCounter end={item.value} prefix={item.prefix} suffix=" €" />
                  </p>
                </GlassCard>
              </RevealSection>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevealSection>
              <GlassCard>
                <h3 className="font-serif text-lg text-chocolate mb-4 text-center">Répartition par catégorie</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={budgetChartData.slice(0, 12)}
                      dataKey="value" cx="50%" cy="50%" outerRadius={120} innerRadius={65}
                      paddingAngle={1.5}
                      label={({ name, percent }) => `${name.length > 12 ? name.slice(0, 12) + '…' : name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false} fontSize={9}
                    >
                      {budgetChartData.slice(0, 12).map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v.toLocaleString("fr-FR")} €`} />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCard>
            </RevealSection>

            <RevealSection delay={0.2}>
              <GlassCard>
                <h3 className="font-serif text-lg text-chocolate mb-4 text-center">Top 12 dépenses</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={demoBudgetCategories.slice(0, 12)} layout="vertical" margin={{ left: 100 }}>
                    <XAxis type="number" tickFormatter={(v) => `${v / 1000}k`} fontSize={11} />
                    <YAxis type="category" dataKey="name" fontSize={10} width={95} />
                    <Tooltip formatter={(v: number) => `${v.toLocaleString("fr-FR")} €`} />
                    <Bar dataKey="amount" radius={[0, 6, 6, 0]} animationDuration={1500}>
                      {demoBudgetCategories.slice(0, 12).map((entry, i) => <Cell key={i} fill={entry.color} />)}
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
              {demoVendors.length} Prestataires Confirmés
            </h2>
            <p className="font-body text-muted-foreground text-center mb-8">
              Acomptes, soldes et échéances détaillés
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(expandedVendors ? demoVendors : demoVendors.slice(0, 12)).map((v, i) => (
              <RevealSection key={v.id} delay={Math.min(i * 0.03, 0.3)}>
                <GlassCard className="!p-4 hover:shadow-elegant transition-all duration-300 group hover:-translate-y-0.5">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                      {v.photo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-body text-sm font-semibold text-foreground truncate">{v.name}</p>
                        <CheckCircle2 className="text-green-600 flex-shrink-0" size={13} />
                      </div>
                      <p className="font-body text-xs text-muted-foreground">{v.role}</p>
                      <div className="grid grid-cols-3 gap-1 mt-2 text-[10px] font-body">
                        <div className="text-center bg-muted/30 rounded px-1 py-0.5">
                          <span className="text-muted-foreground block">Acompte</span>
                          <span className="font-medium">{v.deposit.toLocaleString()}€</span>
                        </div>
                        <div className="text-center bg-muted/30 rounded px-1 py-0.5">
                          <span className="text-muted-foreground block">Total</span>
                          <span className="font-medium text-primary">{v.total.toLocaleString()}€</span>
                        </div>
                        <div className="text-center bg-muted/30 rounded px-1 py-0.5">
                          <span className="text-muted-foreground block">Solde</span>
                          <span className={`font-medium ${v.remaining > 0 ? "text-orange-600" : "text-green-600"}`}>{v.remaining.toLocaleString()}€</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-body ${
                          v.status === "Payé" ? "bg-green-100/80 text-green-700" :
                          v.status === "Partiel" ? "bg-orange-100/80 text-orange-700" :
                          "bg-red-100/80 text-red-700"
                        }`}>
                          {v.status === "Payé" ? <CheckCircle2 size={9} className="mr-1" /> : <AlertTriangle size={9} className="mr-1" />}
                          {v.status}
                        </span>
                        <span className="font-body text-[10px] text-muted-foreground">Éch. {new Date(v.dueDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </RevealSection>
            ))}
          </div>

          {demoVendors.length > 12 && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={() => setExpandedVendors(!expandedVendors)}
                className="font-body text-sm gap-2"
              >
                {expandedVendors ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {expandedVendors ? "Réduire" : `Voir les ${demoVendors.length - 12} autres prestataires`}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ RSVP ═══════ */}
      <section className="section-padding bg-gradient-warm !py-10">
        <div className="container-editorial max-w-5xl">
          <RevealSection>
            <h2 className="font-serif text-3xl text-chocolate text-center mb-8">
              <Users className="inline mr-2 text-primary" size={28} />
              RSVP — 250 Invités
            </h2>
          </RevealSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {[
              { label: "Confirmés", value: demoRsvp.confirmed, color: "text-green-700", bg: "bg-green-50/60", icon: "✅" },
              { label: "En attente", value: demoRsvp.pending, color: "text-orange-700", bg: "bg-orange-50/60", icon: "⏳" },
              { label: "Désistés", value: demoRsvp.declined, color: "text-red-700", bg: "bg-red-50/60", icon: "❌" },
              { label: "Accompagnants", value: demoRsvp.companions, color: "text-primary", bg: "bg-primary/5", icon: "👥" },
              { label: "Hôtel réservé", value: rsvpStats.hotelCount, color: "text-chocolate", bg: "bg-muted/30", icon: "🏨" },
              { label: "Transport", value: rsvpStats.transportCount, color: "text-chocolate", bg: "bg-muted/30", icon: "🚌" },
            ].map((item, i) => (
              <RevealSection key={item.label} delay={i * 0.08}>
                <GlassCard className={`text-center !p-4 ${item.bg} hover:scale-105 transition-transform duration-300`}>
                  <span className="text-lg">{item.icon}</span>
                  <p className="font-body text-[10px] text-muted-foreground mt-1">{item.label}</p>
                  <p className={`font-serif text-2xl ${item.color}`}><AnimatedCounter end={item.value} /></p>
                </GlassCard>
              </RevealSection>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pie chart */}
            <RevealSection>
              <GlassCard>
                <h3 className="font-serif text-lg text-chocolate mb-4 text-center">Répartition</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={rsvpChartData} dataKey="value" cx="50%" cy="50%" outerRadius={85} innerRadius={50} paddingAngle={3} label={({ name, value }) => `${name}: ${value}`}>
                      {rsvpChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCard>
            </RevealSection>

            {/* Meal breakdown */}
            <RevealSection delay={0.1}>
              <GlassCard>
                <h3 className="font-serif text-lg text-chocolate mb-4 text-center flex items-center justify-center gap-2">
                  <UtensilsCrossed size={16} /> Choix repas
                </h3>
                <div className="space-y-3">
                  {Object.entries(rsvpStats.mealBreakdown).map(([meal, count]) => (
                    <div key={meal}>
                      <div className="flex justify-between font-body text-xs mb-1">
                        <span className="text-muted-foreground">{meal}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(count / demoRsvp.confirmed) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </RevealSection>

            {/* Guest list excerpt */}
            <RevealSection delay={0.2}>
              <GlassCard className="max-h-[350px] overflow-auto">
                <h3 className="font-serif text-lg text-chocolate mb-4">Invités (extrait)</h3>
                <div className="space-y-2">
                  {demoGuests.slice(0, expandedGuests ? 30 : 12).map(g => (
                    <div key={g.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        g.status === "confirmed" ? "bg-green-500" : g.status === "pending" ? "bg-orange-400" : "bg-red-400"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm truncate">{g.first_name} {g.last_name}</p>
                        <p className="font-body text-[10px] text-muted-foreground">
                          {g.group}
                          {g.companions > 0 && ` · +${g.companions}`}
                          {g.mealChoice && ` · ${g.mealChoice}`}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
                        {g.steps.mairie && <span className="text-[9px] bg-primary/10 text-primary rounded px-1 py-0.5">Mairie</span>}
                        {g.steps.religieux && <span className="text-[9px] bg-primary/10 text-primary rounded px-1 py-0.5">Religieux</span>}
                        {g.hotel && <span className="text-[9px] bg-muted text-muted-foreground rounded px-1 py-0.5">🏨</span>}
                        {g.transport && <span className="text-[9px] bg-muted text-muted-foreground rounded px-1 py-0.5">🚌</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setExpandedGuests(!expandedGuests)}
                  className="font-body text-xs text-primary hover:underline mt-2 w-full text-center"
                >
                  {expandedGuests ? "Réduire" : "Voir plus d'invités"}
                </button>
              </GlassCard>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══════ TIMELINE JOUR J ═══════ */}
      <section className="section-padding bg-gradient-warm !py-10">
        <div className="container-editorial max-w-3xl">
          <RevealSection>
            <h2 className="font-serif text-3xl text-chocolate text-center mb-2">
              <Clock className="inline mr-2 text-primary" size={28} />
              Timeline Jour J
            </h2>
            <p className="font-body text-muted-foreground text-center mb-8">{demoTimeline.length} étapes — 06:00 à 04:30</p>
          </RevealSection>

          <div className="relative">
            <motion.div
              className="absolute left-6 md:left-8 top-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/30"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2.5, ease: "easeOut" }}
            />

            <div className="space-y-4">
              {demoTimeline.map((item, i) => (
                <RevealSection key={item.id} delay={i * 0.06}>
                  <div className="relative pl-16 md:pl-20 group">
                    <div className="absolute left-[18px] md:left-[26px] top-3 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg group-hover:scale-125 group-hover:shadow-[0_0_12px_hsl(38,45%,50%)] transition-all duration-300" />
                    <GlassCard className="!p-4 group-hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{item.icon}</span>
                            <p className="font-body text-xs text-primary font-semibold">{item.start_time} — {item.end_time}</p>
                          </div>
                          <p className="font-serif text-lg text-chocolate">{item.title}</p>
                          <p className="font-body text-xs text-muted-foreground mt-1">📍 {item.address}</p>
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
                  <motion.div
                    key={t.id}
                    className="flex items-center gap-2.5 py-1.5"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle2 className="text-green-600 flex-shrink-0" size={16} />
                    <span className="font-body text-sm text-muted-foreground line-through">{t.title}</span>
                    <span className="ml-auto font-body text-[10px] text-muted-foreground/60 hidden sm:block">
                      {new Date(t.due_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </span>
                  </motion.div>
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
              <RevealSection key={w.id} delay={i * 0.08}>
                <GlassCard className="!p-4 hover:shadow-elegant transition-all group hover:-translate-y-0.5">
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
              <p className="font-body text-muted-foreground mb-2 max-w-md mx-auto">
                Si votre mariage ressemble à ça, inscrivez-vous !
              </p>
              <p className="font-body text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                Créez votre propre espace mariage et accédez à tous ces outils gratuitement. Planifiez, gérez et célébrez votre union avec élégance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/mon-mariage/onboarding">
                  <Button className="font-body text-sm px-8 py-3 bg-primary hover:bg-primary/90">
                    <Heart className="mr-2" size={16} /> Créer mon mariage
                  </Button>
                </Link>
                <Button
                  variant="gold-outline"
                  className="font-body text-sm px-8 py-3"
                  onClick={() => {
                    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-book?demo=true`;
                    window.open(url, "_blank");
                  }}
                >
                  <FileText className="mr-2" size={16} /> Télécharger le Book Mariage
                </Button>
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

import { useState } from "react";
import { ToolPageWrapper } from "@/components/tools/ToolPageWrapper";
import { useToolItems, useToolData } from "@/hooks/use-tool-items";
import { useToolTranslations } from "@/hooks/use-tool-translations";
import { useAuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, TrendingUp, Wallet, PiggyBank, CreditCard,
  AlertTriangle, ChevronDown, ChevronUp, BarChart3, Eye, EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const CATEGORIES = ["Lieu", "Traiteur", "Tenue", "Déco", "Photo & Vidéo", "Musique", "Fleurs", "Transport", "Autre"];
const STATUS_OPTIONS = ["prevu", "acompte", "payé"];
const CHART_COLORS = [
  "hsl(38, 45%, 50%)", "hsl(43, 75%, 55%)", "hsl(30, 35%, 45%)",
  "hsl(25, 30%, 60%)", "hsl(35, 40%, 65%)", "hsl(40, 50%, 45%)",
  "hsl(33, 25%, 70%)", "hsl(20, 40%, 50%)", "hsl(45, 30%, 55%)",
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.4, delay },
});

export default function BudgetPage() {
  const t = useToolTranslations();
  const { user } = useAuthContext();
  const { items, addItem, deleteItem, loading } = useToolItems("budget");
  const { data: toolData, saveData } = useToolData("budget");
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [category, setCategory] = useState("Autre");
  const [status, setStatus] = useState("prevu");
  const [targetInput, setTargetInput] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [showForm, setShowForm] = useState(false);

  const target = toolData.target || 0;
  const totalBudget = items.reduce((s, i) => s + (i.amount || 0), 0);
  const totalPaid = items.reduce((s, i) => s + (i.meta?.paid_amount || 0), 0);
  const remaining = Math.max(0, target - totalBudget);
  const totalRemaining = totalBudget - totalPaid;
  const pct = target > 0 ? Math.min(100, (totalBudget / target) * 100) : 0;
  const paidPct = totalBudget > 0 ? Math.min(100, (totalPaid / totalBudget) * 100) : 0;
  const isOverBudget = target > 0 && totalBudget > target;

  const handleAdd = async () => {
    if (!title.trim() || !amount) return;
    const pa = parseFloat(paidAmount) || 0;
    await addItem({
      title,
      amount: parseFloat(amount),
      meta: { category, status, paid_amount: pa, remaining: parseFloat(amount) - pa },
    });
    toast({ title: t("Élément ajouté") });
    setTitle(""); setAmount(""); setPaidAmount(""); setStatus("prevu");
  };

  const handleSetTarget = async () => {
    const v = parseFloat(targetInput);
    if (isNaN(v)) return;
    await saveData({ target: v });
    toast({ title: t("Sauvegardé") });
    setTargetInput("");
  };

  // Group by category
  const byCategory = items.reduce<Record<string, { total: number; paid: number }>>((acc, i) => {
    const cat = i.meta?.category || "Autre";
    if (!acc[cat]) acc[cat] = { total: 0, paid: 0 };
    acc[cat].total += (i.amount || 0);
    acc[cat].paid += (i.meta?.paid_amount || 0);
    return acc;
  }, {});

  const donutData = Object.entries(byCategory).map(([name, v]) => ({ name, value: v.total }));
  const barData = Object.entries(byCategory)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([name, v]) => ({ name, engagé: v.total, payé: v.paid, reste: v.total - v.paid }));

  const statusLabel = (s: string) =>
    s === "payé" ? "✓ Payé" : s === "acompte" ? "↓ Acompte" : "○ Prévu";
  const statusBg = (s: string) =>
    s === "payé" ? "bg-champagne/15 text-champagne-dark border-champagne/30"
    : s === "acompte" ? "bg-gold/10 text-gold border-gold/20"
    : "bg-muted/50 text-muted-foreground border-border/50";

  const tooltipStyle = {
    background: "hsl(40, 30%, 97%)",
    border: "1px solid hsl(35, 20%, 85%)",
    borderRadius: "12px",
    fontFamily: "var(--font-body)",
    fontSize: "12px",
  };

  return (
    <ToolPageWrapper title={t("Budget")}>
      {user && (
        <>
          {/* ── Target Input ── */}
          {target === 0 && (
            <motion.div {...fadeUp(0)} className="card-glass p-5 md:p-6 mb-6">
              <h3 className="font-serif text-lg text-foreground mb-1">
                {t("Budget cible")}
              </h3>
              <p className="font-body text-xs text-muted-foreground mb-3">
                Définissez votre budget global pour suivre vos dépenses.
              </p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Ex: 25000"
                  value={targetInput}
                  onChange={e => setTargetInput(e.target.value)}
                  className="max-w-[200px]"
                />
                <Button onClick={handleSetTarget} variant="outline" className="font-body text-sm">
                  {t("Enregistrer")}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── KPI Row ── */}
          {target > 0 && (
            <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { icon: Wallet, label: t("Budget cible"), value: `${target.toLocaleString()} €`, accent: false },
                { icon: TrendingUp, label: "Engagé", value: `${totalBudget.toLocaleString()} €`, accent: isOverBudget },
                { icon: CreditCard, label: t("Payé"), value: `${totalPaid.toLocaleString()} €`, accent: false },
                { icon: PiggyBank, label: "Reste à payer", value: `${totalRemaining.toLocaleString()} €`, accent: false },
              ].map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  {...fadeUp(0.05 + i * 0.05)}
                  className={`card-glass p-4 text-center group transition-all duration-300 hover:-translate-y-1 ${
                    kpi.accent ? "ring-1 ring-destructive/30" : ""
                  }`}
                >
                  <kpi.icon size={18} className={`mx-auto mb-2 ${kpi.accent ? "text-destructive" : "text-champagne"} group-hover:scale-110 transition-transform`} />
                  <p className={`font-serif text-xl md:text-2xl ${kpi.accent ? "text-destructive" : "text-foreground"}`}>
                    {kpi.value}
                  </p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── Over Budget Alert ── */}
          <AnimatePresence>
            {isOverBudget && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="card-glass p-4 border border-destructive/20 bg-destructive/5 flex items-center gap-3">
                  <AlertTriangle size={18} className="text-destructive flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-body text-sm text-destructive font-medium">
                      Dépassement de budget : +{(totalBudget - target).toLocaleString()} €
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      Vous avez engagé {((totalBudget / target) * 100).toFixed(0)}% de votre budget cible.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Progress Bars ── */}
          {target > 0 && (
            <motion.div {...fadeUp(0.15)} className="card-glass p-5 mb-6 space-y-4">
              {/* Budget engaged vs target */}
              <div>
                <div className="flex justify-between font-body text-xs text-muted-foreground mb-1.5">
                  <span>Budget engagé</span>
                  <span className={isOverBudget ? "text-destructive font-medium" : ""}>
                    {totalBudget.toLocaleString()} / {target.toLocaleString()} €
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${isOverBudget ? "bg-destructive" : "bg-gradient-to-r from-champagne to-gold"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pct, 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </div>

              {/* Paid vs engaged */}
              <div>
                <div className="flex justify-between font-body text-xs text-muted-foreground mb-1.5">
                  <span>Déjà payé</span>
                  <span>{totalPaid.toLocaleString()} / {totalBudget.toLocaleString()} €</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-champagne/60 to-champagne"
                    initial={{ width: 0 }}
                    animate={{ width: `${paidPct}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Edit target */}
              <div className="pt-2 border-t border-border/30 flex items-center gap-2">
                <Input
                  type="number"
                  placeholder={`${target} €`}
                  value={targetInput}
                  onChange={e => setTargetInput(e.target.value)}
                  className="max-w-[150px] h-8 text-xs"
                />
                <Button onClick={handleSetTarget} variant="outline" size="sm" className="font-body text-xs h-8">
                  Modifier cible
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Charts Grid ── */}
          {donutData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              {/* Donut */}
              <motion.div {...fadeUp(0.2)} className="card-glass p-5">
                <h3 className="font-serif text-base text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 size={16} className="text-champagne" />
                  Répartition par catégorie
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          dataKey="value"
                          innerRadius={35}
                          outerRadius={55}
                          paddingAngle={2}
                          stroke="none"
                        >
                          {donutData.map((_, idx) => (
                            <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => `${v.toLocaleString()} €`} contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {Object.entries(byCategory)
                      .sort((a, b) => b[1].total - a[1].total)
                      .map(([cat, v], idx) => (
                        <div key={cat} className="flex items-center gap-2 text-xs font-body">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CHART_COLORS[idx % CHART_COLORS.length] }} />
                          <span className="text-muted-foreground flex-1 truncate">{cat}</span>
                          <span className="text-foreground font-medium tabular-nums">{v.total.toLocaleString()} €</span>
                          {target > 0 && (
                            <span className="text-muted-foreground/60 tabular-nums">
                              {((v.total / target) * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>

              {/* Bar Chart: Engagé vs Payé */}
              <motion.div {...fadeUp(0.25)} className="card-glass p-5">
                <h3 className="font-serif text-base text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-champagne" />
                  Engagé vs Payé
                </h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 90%)" />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fontFamily: "var(--font-body)" }} />
                    <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 10, fontFamily: "var(--font-body)" }} />
                    <Tooltip formatter={(v: number) => `${v.toLocaleString()} €`} contentStyle={tooltipStyle} />
                    <Bar dataKey="payé" fill="hsl(38, 45%, 50%)" radius={[0, 4, 4, 0]} barSize={10} />
                    <Bar dataKey="reste" fill="hsl(35, 20%, 85%)" radius={[0, 4, 4, 0]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2 justify-center">
                  <span className="flex items-center gap-1.5 text-[10px] font-body text-muted-foreground">
                    <div className="w-2.5 h-2.5 rounded-sm bg-champagne" /> Payé
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-body text-muted-foreground">
                    <div className="w-2.5 h-2.5 rounded-sm bg-border" /> Reste à payer
                  </span>
                </div>
              </motion.div>
            </div>
          )}

          {/* ── Add Item (Collapsible) ── */}
          <motion.div {...fadeUp(0.3)} className="card-glass mb-6 overflow-hidden">
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full p-4 md:p-5 flex items-center justify-between hover:bg-champagne/5 transition-colors"
            >
              <h3 className="font-serif text-base text-foreground flex items-center gap-2">
                <Plus size={16} className="text-champagne" />
                Ajouter une dépense
              </h3>
              {showForm ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
            </button>

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 md:px-5 pb-5 space-y-3 border-t border-border/30 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input placeholder="Libellé (ex: Traiteur Chez Mama)" value={title} onChange={e => setTitle(e.target.value)} />
                      <Input type="number" placeholder="Montant total (€)" value={amount} onChange={e => setAmount(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input type="number" placeholder="Acompte versé (€)" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} />
                    </div>
                    <Button onClick={handleAdd} className="btn-gold gap-1.5">
                      <Plus size={14} /> {t("Ajouter")}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── View Toggle ── */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-foreground">
              Détail des dépenses
              {items.length > 0 && <span className="text-sm text-muted-foreground ml-2 font-body">({items.length})</span>}
            </h3>
            <div className="flex gap-1.5">
              <Button
                variant={viewMode === "card" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("card")}
                className="font-body text-xs h-7 px-3"
              >
                Cartes
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="font-body text-xs h-7 px-3"
              >
                Tableau
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ── Item List ── */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card-glass p-4 h-16 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <motion.div {...fadeUp(0)} className="card-glass p-8 text-center">
          <Wallet size={32} className="text-champagne/40 mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">{t("Aucun élément")}</p>
          <p className="font-body text-xs text-muted-foreground mt-1">
            Ajoutez votre première dépense pour commencer le suivi.
          </p>
        </motion.div>
      ) : viewMode === "table" ? (
        <motion.div {...fadeUp(0)} className="card-glass overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border/50 text-left">
                <th className="p-3 text-muted-foreground font-medium text-xs">Libellé</th>
                <th className="p-3 text-muted-foreground font-medium text-xs">Catégorie</th>
                <th className="p-3 text-muted-foreground font-medium text-xs text-right">Montant</th>
                <th className="p-3 text-muted-foreground font-medium text-xs text-right">Payé</th>
                <th className="p-3 text-muted-foreground font-medium text-xs text-right">Reste</th>
                <th className="p-3 text-muted-foreground font-medium text-xs">Statut</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const pa = item.meta?.paid_amount || 0;
                const rem = (item.amount || 0) - pa;
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/30 hover:bg-champagne/5 transition-colors"
                  >
                    <td className="p-3 text-foreground text-xs">{item.title}</td>
                    <td className="p-3 text-muted-foreground text-xs">{item.meta?.category}</td>
                    <td className="p-3 text-right text-foreground font-medium text-xs tabular-nums">{(item.amount || 0).toLocaleString()} €</td>
                    <td className="p-3 text-right text-xs tabular-nums">{pa.toLocaleString()} €</td>
                    <td className="p-3 text-right text-xs tabular-nums">{rem.toLocaleString()} €</td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusBg(item.meta?.status || "prevu")}`}>
                        {statusLabel(item.meta?.status || "prevu")}
                      </span>
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteItem(item.id)}>
                        <Trash2 size={13} className="text-destructive/60 hover:text-destructive" />
                      </Button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-champagne/20 bg-champagne/5">
                <td className="p-3 font-medium text-xs text-foreground" colSpan={2}>Total</td>
                <td className="p-3 text-right font-medium text-xs text-foreground tabular-nums">{totalBudget.toLocaleString()} €</td>
                <td className="p-3 text-right font-medium text-xs text-foreground tabular-nums">{totalPaid.toLocaleString()} €</td>
                <td className="p-3 text-right font-medium text-xs text-foreground tabular-nums">{totalRemaining.toLocaleString()} €</td>
                <td className="p-3" colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </motion.div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence>
            {items.map((item, i) => {
              const pa = item.meta?.paid_amount || 0;
              const rem = (item.amount || 0) - pa;
              const itemPct = (item.amount || 0) > 0 ? (pa / (item.amount || 1)) * 100 : 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04 }}
                  className="card-glass p-4 group hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    {/* Category dot */}
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                      style={{ background: CHART_COLORS[CATEGORIES.indexOf(item.meta?.category || "Autre") % CHART_COLORS.length] }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-body text-sm font-medium text-foreground truncate">{item.title}</p>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusBg(item.meta?.status || "prevu")}`}>
                          {statusLabel(item.meta?.status || "prevu")}
                        </span>
                      </div>

                      <div className="flex gap-3 text-xs text-muted-foreground font-body mb-2">
                        <span>{item.meta?.category}</span>
                        {pa > 0 && <span>Acompte: {pa.toLocaleString()} €</span>}
                        {rem > 0 && <span className="text-champagne">Reste: {rem.toLocaleString()} €</span>}
                      </div>

                      {/* Mini progress bar */}
                      <div className="h-1 rounded-full bg-muted overflow-hidden w-full max-w-[200px]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-champagne to-gold transition-all duration-500"
                          style={{ width: `${itemPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 flex items-center gap-2">
                      <span className="font-serif text-foreground whitespace-nowrap">
                        {(item.amount || 0).toLocaleString()} €
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 size={13} className="text-destructive/60" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </ToolPageWrapper>
  );
}

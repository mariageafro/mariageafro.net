import { useState } from "react";
import { ToolPageWrapper } from "@/components/tools/ToolPageWrapper";
import { useToolItems, useToolData } from "@/hooks/use-tool-items";
import { useToolTranslations } from "@/hooks/use-tool-translations";
import { useAuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, TrendingUp, Wallet, PiggyBank, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CATEGORIES = ["Lieu", "Traiteur", "Tenue", "Déco", "Photo & Vidéo", "Musique", "Fleurs", "Transport", "Autre"];
const STATUS_OPTIONS = ["prevu", "acompte", "payé"];
const DONUT_COLORS = [
  "hsl(36, 60%, 55%)", "hsl(24, 50%, 50%)", "hsl(48, 70%, 60%)",
  "hsl(12, 45%, 55%)", "hsl(60, 40%, 50%)", "hsl(200, 30%, 50%)",
  "hsl(150, 35%, 50%)", "hsl(280, 30%, 55%)", "hsl(0, 0%, 60%)",
];

export default function BudgetPage() {
  const t = useToolTranslations();
  const { user } = useAuthContext();
  const { items, addItem, updateItem, deleteItem, loading } = useToolItems("budget");
  const { data: toolData, saveData } = useToolData("budget");
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [category, setCategory] = useState("Autre");
  const [status, setStatus] = useState("prevu");
  const [targetInput, setTargetInput] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const target = toolData.target || 0;
  const totalBudget = items.reduce((s, i) => s + (i.amount || 0), 0);
  const totalPaid = items.reduce((s, i) => s + (i.meta?.paid_amount || 0), 0);
  const remaining = Math.max(0, target - totalBudget);
  const pct = target > 0 ? Math.min(100, (totalBudget / target) * 100) : 0;

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

  // Group by category for donut
  const byCategory = items.reduce<Record<string, number>>((acc, i) => {
    const cat = i.meta?.category || "Autre";
    acc[cat] = (acc[cat] || 0) + (i.amount || 0);
    return acc;
  }, {});
  const donutData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  const statusLabel = (s: string) =>
    s === "payé" ? t("Payé") : s === "acompte" ? "Acompte" : "Prévu";
  const statusColor = (s: string) =>
    s === "payé" ? "bg-emerald-100 text-emerald-800" : s === "acompte" ? "bg-amber-100 text-amber-800" : "bg-muted text-muted-foreground";

  return (
    <ToolPageWrapper title={t("Budget")}>
      {user && (
        <>
          {/* Target */}
          <div className="card-glass p-4 md:p-6 mb-4">
            <label className="font-body text-sm text-muted-foreground">{t("Budget cible")}</label>
            <div className="flex gap-2 mt-1">
              <Input type="number" placeholder={target ? `${target} €` : "15000"} value={targetInput} onChange={e => setTargetInput(e.target.value)} />
              <Button onClick={handleSetTarget} variant="outline">{t("Enregistrer")}</Button>
            </div>
          </div>

          {/* KPI Bar */}
          {target > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="kpi-card">
                <Wallet size={20} className="text-primary mb-1" />
                <p className="text-xs text-muted-foreground font-body">{t("Budget cible")}</p>
                <p className="font-serif text-xl text-foreground">{target.toLocaleString()} €</p>
              </div>
              <div className="kpi-card">
                <TrendingUp size={20} className="text-primary mb-1" />
                <p className="text-xs text-muted-foreground font-body">{t("Total dépensé")}</p>
                <p className="font-serif text-xl text-foreground">{totalBudget.toLocaleString()} €</p>
              </div>
              <div className="kpi-card">
                <PiggyBank size={20} className="text-primary mb-1" />
                <p className="text-xs text-muted-foreground font-body">{t("Reste")}</p>
                <p className="font-serif text-xl text-foreground">{remaining.toLocaleString()} €</p>
              </div>
              <div className="kpi-card">
                <CreditCard size={20} className="text-primary mb-1" />
                <p className="text-xs text-muted-foreground font-body">{t("Payé")}</p>
                <p className="font-serif text-xl text-foreground">{totalPaid.toLocaleString()} €</p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {target > 0 && (
            <div className="card-glass p-4 mb-6">
              <div className="flex justify-between text-xs font-body text-muted-foreground mb-1">
                <span>{pct.toFixed(0)}% consommé</span>
                <span>{totalBudget.toLocaleString()} / {target.toLocaleString()} €</span>
              </div>
              <Progress value={pct} className="h-3" />
            </div>
          )}

          {/* Donut Chart + Category Summary */}
          {donutData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="card-glass p-4 flex items-center justify-center" style={{ minHeight: 220 }}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {donutData.map((_, idx) => (
                        <Cell key={idx} fill={DONUT_COLORS[idx % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `${value.toLocaleString()} €`}
                      contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="card-glass p-4">
                <h3 className="font-serif text-lg text-foreground mb-3">{t("Catégorie")}</h3>
                <div className="space-y-2">
                  {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt], idx) => (
                    <div key={cat} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: DONUT_COLORS[idx % DONUT_COLORS.length] }} />
                      <span className="font-body text-sm flex-1">{cat}</span>
                      <span className="font-body text-sm text-muted-foreground">{amt.toLocaleString()} €</span>
                      {target > 0 && <span className="font-body text-xs text-muted-foreground">({((amt / target) * 100).toFixed(0)}%)</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Add item */}
          <div className="card-glass p-4 md:p-6 mb-6 space-y-3">
            <h3 className="font-serif text-lg text-foreground">{t("Ajouter")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder={t("Libellé")} value={title} onChange={e => setTitle(e.target.value)} />
              <Input type="number" placeholder={t("Montant")} value={amount} onChange={e => setAmount(e.target.value)} />
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
              <Input type="number" placeholder="Acompte payé (€)" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} />
            </div>
            <Button onClick={handleAdd} className="btn-gold"><Plus size={16} className="mr-1" />{t("Ajouter")}</Button>
          </div>

          {/* View toggle */}
          <div className="flex gap-2 mb-4">
            <Button variant={viewMode === "card" ? "default" : "outline"} size="sm" onClick={() => setViewMode("card")} className="font-body text-xs">Cartes</Button>
            <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")} className="font-body text-xs">Tableau</Button>
          </div>
        </>
      )}

      {loading ? (
        <p className="text-muted-foreground font-body text-center py-8">…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground font-body text-center py-8">{t("Aucun élément")}</p>
      ) : viewMode === "table" ? (
        <div className="card-glass overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-3 text-muted-foreground">{t("Libellé")}</th>
                <th className="p-3 text-muted-foreground">{t("Catégorie")}</th>
                <th className="p-3 text-muted-foreground text-right">{t("Montant")}</th>
                <th className="p-3 text-muted-foreground text-right">Acompte</th>
                <th className="p-3 text-muted-foreground text-right">{t("Reste")}</th>
                <th className="p-3 text-muted-foreground">Statut</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const pa = item.meta?.paid_amount || 0;
                const rem = (item.amount || 0) - pa;
                return (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-3 text-foreground">{item.title}</td>
                    <td className="p-3 text-muted-foreground">{item.meta?.category}</td>
                    <td className="p-3 text-right text-foreground">{(item.amount || 0).toLocaleString()} €</td>
                    <td className="p-3 text-right text-foreground">{pa.toLocaleString()} €</td>
                    <td className="p-3 text-right text-foreground">{rem.toLocaleString()} €</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(item.meta?.status || "prevu")}`}>
                        {statusLabel(item.meta?.status || "prevu")}
                      </span>
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}><Trash2 size={14} className="text-destructive" /></Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(item => {
            const pa = item.meta?.paid_amount || 0;
            const rem = (item.amount || 0) - pa;
            return (
              <div key={item.id} className="card-glass p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-body font-medium text-foreground">{item.title}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(item.meta?.status || "prevu")}`}>
                      {statusLabel(item.meta?.status || "prevu")}
                    </span>
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground font-body">
                    <span>{item.meta?.category}</span>
                    {pa > 0 && <span>Acompte: {pa.toLocaleString()} €</span>}
                    {rem > 0 && <span>Reste: {rem.toLocaleString()} €</span>}
                  </div>
                </div>
                <span className="font-serif text-foreground whitespace-nowrap">{(item.amount || 0).toLocaleString()} €</span>
                <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}><Trash2 size={16} className="text-destructive" /></Button>
              </div>
            );
          })}
        </div>
      )}
    </ToolPageWrapper>
  );
}

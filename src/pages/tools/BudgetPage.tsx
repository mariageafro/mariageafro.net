import { useState } from "react";
import { ToolPageWrapper } from "@/components/tools/ToolPageWrapper";
import { useToolItems, useToolData } from "@/hooks/use-tool-items";
import { useToolTranslations } from "@/hooks/use-tool-translations";
import { useAuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const CATEGORIES = ["Lieu", "Traiteur", "Tenue", "Déco", "Photo & Vidéo", "Musique", "Fleurs", "Transport", "Autre"];

export default function BudgetPage() {
  const t = useToolTranslations();
  const { user } = useAuthContext();
  const { items, addItem, updateItem, deleteItem, loading } = useToolItems("budget");
  const { data: toolData, saveData } = useToolData("budget");
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Autre");
  const [targetInput, setTargetInput] = useState("");

  const target = toolData.target || 0;
  const totalSpent = items.reduce((s, i) => s + (i.amount || 0), 0);
  const totalPaid = items.filter(i => i.meta?.paid).reduce((s, i) => s + (i.amount || 0), 0);
  const remaining = Math.max(0, target - totalSpent);
  const pct = target > 0 ? Math.min(100, (totalSpent / target) * 100) : 0;

  const handleAdd = async () => {
    if (!title.trim() || !amount) return;
    await addItem({ title, amount: parseFloat(amount), meta: { category, paid: false } });
    toast({ title: t("Élément ajouté") });
    setTitle(""); setAmount("");
  };

  const handleSetTarget = async () => {
    const v = parseFloat(targetInput);
    if (isNaN(v)) return;
    await saveData({ target: v });
    toast({ title: t("Sauvegardé") });
    setTargetInput("");
  };

  // Group by category
  const byCategory = items.reduce<Record<string, number>>((acc, i) => {
    const cat = i.meta?.category || "Autre";
    acc[cat] = (acc[cat] || 0) + (i.amount || 0);
    return acc;
  }, {});

  return (
    <ToolPageWrapper title={t("Budget")}>
      {user && (
        <>
          {/* Target */}
          <div className="card-premium p-4 md:p-6 mb-4">
            <label className="font-body text-sm text-muted-foreground">{t("Budget cible")}</label>
            <div className="flex gap-2 mt-1">
              <Input type="number" placeholder={target ? `${target} €` : "15000"} value={targetInput} onChange={e => setTargetInput(e.target.value)} />
              <Button onClick={handleSetTarget} variant="outline">{t("Enregistrer")}</Button>
            </div>
          </div>

          {/* Summary */}
          {target > 0 && (
            <div className="card-premium p-4 md:p-6 mb-4 space-y-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="font-body text-xs text-muted-foreground">{t("Total dépensé")}</p><p className="font-serif text-xl text-foreground">{totalSpent.toLocaleString()} €</p></div>
                <div><p className="font-body text-xs text-muted-foreground">{t("Reste")}</p><p className="font-serif text-xl text-foreground">{remaining.toLocaleString()} €</p></div>
                <div><p className="font-body text-xs text-muted-foreground">{t("Payé")}</p><p className="font-serif text-xl text-foreground">{totalPaid.toLocaleString()} €</p></div>
              </div>
              <Progress value={pct} className="h-3" />
              <p className="text-xs text-muted-foreground font-body text-center">{pct.toFixed(0)}%</p>
            </div>
          )}

          {/* By category */}
          {Object.keys(byCategory).length > 0 && (
            <div className="card-premium p-4 mb-4">
              <h3 className="font-serif text-lg text-foreground mb-2">{t("Catégorie")}</h3>
              <div className="space-y-1">
                {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
                  <div key={cat} className="flex justify-between font-body text-sm">
                    <span>{cat}</span><span className="text-muted-foreground">{amt.toLocaleString()} €</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add item */}
          <div className="card-premium p-4 md:p-6 mb-6 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input placeholder={t("Libellé")} value={title} onChange={e => setTitle(e.target.value)} />
              <Input type="number" placeholder={t("Montant")} value={amount} onChange={e => setAmount(e.target.value)} />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button onClick={handleAdd} className="btn-gold"><Plus size={16} className="mr-1" />{t("Ajouter")}</Button>
          </div>
        </>
      )}

      {loading ? (
        <p className="text-muted-foreground font-body text-center py-8">…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground font-body text-center py-8">{t("Aucun élément")}</p>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="card-premium p-4 flex items-center gap-3">
              <Checkbox checked={!!item.meta?.paid} onCheckedChange={v => updateItem(item.id, { meta: { ...item.meta, paid: !!v } })} />
              <div className="flex-1 min-w-0">
                <p className="font-body font-medium text-foreground">{item.title}</p>
                <span className="text-xs text-muted-foreground font-body">{item.meta?.category} · {item.meta?.paid ? t("Payé") : t("Non payé")}</span>
              </div>
              <span className="font-serif text-foreground whitespace-nowrap">{(item.amount || 0).toLocaleString()} €</span>
              <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}><Trash2 size={16} className="text-destructive" /></Button>
            </div>
          ))}
        </div>
      )}
    </ToolPageWrapper>
  );
}

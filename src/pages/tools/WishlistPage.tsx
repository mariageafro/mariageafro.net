import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolPageWrapper } from "@/components/tools/ToolPageWrapper";
import { useToolItems } from "@/hooks/use-tool-items";
import { useToolTranslations } from "@/hooks/use-tool-translations";
import { useAuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ExternalLink, ChevronDown, ChevronUp, Gift, ShoppingBag, Heart, Star, Link2, CreditCard, List, LayoutGrid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATUS_OPTIONS = [
  { value: "available", label: "Disponible", cls: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: "🎁" },
  { value: "reserved", label: "Réservé", cls: "bg-amber-100 text-amber-700 border-amber-200", icon: "🔒" },
  { value: "purchased", label: "Acheté", cls: "bg-primary/15 text-primary border-primary/20", icon: "✅" },
];

const PRIORITY_OPTIONS = [
  { value: "high", label: "Coup de cœur", cls: "bg-rose-100 text-rose-700 border-rose-200" },
  { value: "medium", label: "Envie", cls: "bg-primary/15 text-primary border-primary/20" },
  { value: "low", label: "Optionnel", cls: "bg-muted text-muted-foreground border-border" },
];

export default function WishlistPage() {
  const t = useToolTranslations();
  const { user } = useAuthContext();
  const { items, addItem, updateItem, deleteItem, loading } = useToolItems("wishlist");
  const { toast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [priority, setPriority] = useState("medium");
  const [paypalLink, setPaypalLink] = useState("");
  const [rib, setRib] = useState("");

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addItem({
      title,
      amount: price ? parseFloat(price) : null,
      meta: { url: url || null, imageUrl: imageUrl || null, priority, status: "available", paypalLink: paypalLink || null, rib: rib || null },
    });
    toast({ title: t("Élément ajouté") });
    setTitle(""); setUrl(""); setImageUrl(""); setPrice(""); setPriority("medium"); setPaypalLink(""); setRib("");
  };

  const cycleStatus = (item: any) => {
    const order = ["available", "reserved", "purchased"];
    const current = item.meta?.status || "available";
    const next = order[(order.indexOf(current) + 1) % order.length];
    updateItem(item.id, { meta: { ...item.meta, status: next } });
  };

  const totalValue = items.reduce((s, i) => s + (i.amount || 0), 0);
  const purchasedValue = items.filter(i => i.meta?.status === "purchased").reduce((s, i) => s + (i.amount || 0), 0);
  const reservedCount = items.filter(i => i.meta?.status === "reserved").length;
  const purchasedCount = items.filter(i => i.meta?.status === "purchased").length;

  return (
    <ToolPageWrapper title={t("Liste de souhaits")}>
      {/* KPI Row */}
      {items.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Cadeaux", value: items.length, icon: "🎁" },
            { label: "Réservés", value: reservedCount, icon: "🔒" },
            { label: "Achetés", value: purchasedCount, icon: "✅" },
            { label: "Valeur totale", value: `${totalValue.toLocaleString()} €`, icon: "💎" },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="kpi-card">
              <span className="text-lg mb-1">{kpi.icon}</span>
              <p className="font-serif text-xl text-foreground">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground font-body">{kpi.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Progress */}
      {items.length > 0 && totalValue > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-glass p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-serif text-sm text-foreground">Progression cadeaux</p>
            <span className="font-serif text-sm text-primary font-semibold">{purchasedValue.toLocaleString()} € / {totalValue.toLocaleString()} €</span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(38 45% 50%), hsl(43 75% 55%))" }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.round((purchasedValue / totalValue) * 100))}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
            />
          </div>
        </motion.div>
      )}

      {/* Add Form */}
      {user && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-4 md:p-5 mb-6">
          <button onClick={() => setFormOpen(!formOpen)} className="flex items-center justify-between w-full text-left">
            <span className="font-serif text-sm text-foreground flex items-center gap-2"><Plus size={16} className="text-primary" /> Ajouter un souhait</span>
            {formOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {formOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="pt-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input placeholder="Nom du cadeau" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} className="bg-background/60" />
                    <Input type="number" placeholder="Prix (€)" value={price} onChange={e => setPrice(e.target.value)} className="bg-background/60" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input placeholder="Lien produit (URL)" value={url} onChange={e => setUrl(e.target.value)} className="bg-background/60" />
                    <Input placeholder="Image URL (optionnel)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="bg-background/60" />
                  </div>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="bg-background/60"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input placeholder="Lien PayPal (optionnel)" value={paypalLink} onChange={e => setPaypalLink(e.target.value)} className="bg-background/60" />
                    <Input placeholder="RIB / IBAN (optionnel)" value={rib} onChange={e => setRib(e.target.value)} className="bg-background/60" />
                  </div>
                  <Button onClick={handleAdd} className="btn-gold w-full sm:w-auto"><Plus size={16} className="mr-1" />{t("Ajouter")}</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* View toggle */}
      <div className="flex items-center justify-end gap-1 mb-5">
        <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}><LayoutGrid size={14} /></Button>
        <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}><List size={14} /></Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card-glass p-4 animate-pulse"><div className="h-24 bg-muted rounded-lg mb-3" /><div className="h-4 bg-muted rounded w-2/3" /></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="text-4xl mb-3">🎁</p>
          <p className="text-muted-foreground font-body">{t("Aucun élément")}</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <WishCardGrid key={item.id} item={item} index={i} cycleStatus={cycleStatus} deleteItem={deleteItem} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <WishCardList key={item.id} item={item} index={i} cycleStatus={cycleStatus} deleteItem={deleteItem} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </ToolPageWrapper>
  );
}

function WishCardGrid({ item, index, cycleStatus, deleteItem }: any) {
  const st = STATUS_OPTIONS.find(s => s.value === (item.meta?.status || "available")) || STATUS_OPTIONS[0];
  const pr = PRIORITY_OPTIONS.find(p => p.value === (item.meta?.priority || "medium")) || PRIORITY_OPTIONS[1];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 400, damping: 30 }}
      className="card-glass overflow-hidden group"
    >
      {/* Image */}
      {item.meta?.imageUrl ? (
        <div className="h-32 overflow-hidden">
          <img src={item.meta.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-20 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(38 45% 50% / 0.08), hsl(43 75% 55% / 0.08))" }}>
          <Gift size={28} className="text-primary/40" />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className={`font-body font-medium text-sm leading-tight ${item.meta?.status === "purchased" ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.title}</p>
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteItem(item.id)}>
            <Trash2 size={12} className="text-destructive" />
          </Button>
        </div>

        {item.amount != null && item.amount > 0 && (
          <p className="font-serif text-lg text-primary mb-2">{item.amount.toLocaleString()} €</p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          <button onClick={() => cycleStatus(item)} className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border cursor-pointer hover:opacity-80 transition-opacity ${st.cls}`}>
            {st.icon} {st.label}
          </button>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${pr.cls}`}>
            {pr.value === "high" ? "❤️" : pr.value === "medium" ? "⭐" : "○"} {pr.label}
          </span>
        </div>

        <div className="flex gap-1.5">
          {item.meta?.url && (
            <a href={item.meta.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-body">
              <Link2 size={10} /> Voir
            </a>
          )}
          {item.meta?.paypalLink && (
            <a href={item.meta.paypalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-body">
              <CreditCard size={10} /> PayPal
            </a>
          )}
          {item.meta?.rib && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-body" title={item.meta.rib}>
              <CreditCard size={10} /> RIB
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function WishCardList({ item, index, cycleStatus, deleteItem }: any) {
  const st = STATUS_OPTIONS.find(s => s.value === (item.meta?.status || "available")) || STATUS_OPTIONS[0];
  const pr = PRIORITY_OPTIONS.find(p => p.value === (item.meta?.priority || "medium")) || PRIORITY_OPTIONS[1];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.03 }}
      className="card-glass p-4 flex items-center gap-3"
    >
      {item.meta?.imageUrl ? (
        <img src={item.meta.imageUrl} alt={item.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ background: "hsl(38 45% 50% / 0.08)" }}>
          <Gift size={18} className="text-primary/40" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p className={`font-body font-medium text-sm ${item.meta?.status === "purchased" ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.title}</p>
          {item.amount != null && item.amount > 0 && <span className="font-serif text-sm text-primary">{item.amount.toLocaleString()} €</span>}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => cycleStatus(item)} className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border cursor-pointer ${st.cls}`}>
            {st.icon} {st.label}
          </button>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${pr.cls}`}>
            {pr.label}
          </span>
          {item.meta?.url && (
            <a href={item.meta.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-body">
              <Link2 size={10} /> Lien
            </a>
          )}
          {item.meta?.paypalLink && (
            <a href={item.meta.paypalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-body">
              <CreditCard size={10} /> PayPal
            </a>
          )}
        </div>
      </div>
      <Button variant="ghost" size="icon" className="shrink-0 opacity-40 hover:opacity-100" onClick={() => deleteItem(item.id)}>
        <Trash2 size={16} className="text-destructive" />
      </Button>
    </motion.div>
  );
}

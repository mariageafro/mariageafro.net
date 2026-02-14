import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolPageWrapper } from "@/components/tools/ToolPageWrapper";
import { useToolItems } from "@/hooks/use-tool-items";
import { useToolTranslations } from "@/hooks/use-tool-translations";
import { useAuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Filter, LayoutGrid, List, ChevronDown, ChevronUp, CheckCircle2, Clock, ListTodo, Table2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const CATEGORIES = ["Mairie", "Religieux", "Réception", "Dot", "Voyage", "Tenues", "Prestataires", "Décoration", "Invités", "Autre"];
const CATEGORY_COLORS: Record<string, string> = {
  Mairie: "bg-blue-100 text-blue-700 border-blue-200",
  Religieux: "bg-purple-100 text-purple-700 border-purple-200",
  Réception: "bg-amber-100 text-amber-700 border-amber-200",
  Dot: "bg-rose-100 text-rose-700 border-rose-200",
  Voyage: "bg-cyan-100 text-cyan-700 border-cyan-200",
  Tenues: "bg-pink-100 text-pink-700 border-pink-200",
  Prestataires: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Décoration: "bg-orange-100 text-orange-700 border-orange-200",
  Invités: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Autre: "bg-stone-100 text-stone-700 border-stone-200",
};

const KANBAN_COLS = [
  { key: "todo", label: "À faire", icon: ListTodo, filter: (i: any) => !i.done && i.meta?.status !== "in_progress" },
  { key: "in_progress", label: "En cours", icon: Clock, filter: (i: any) => !i.done && i.meta?.status === "in_progress" },
  { key: "done", label: "Terminé", icon: CheckCircle2, filter: (i: any) => i.done },
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }) };

export default function ChecklistPage() {
  const t = useToolTranslations();
  const { user } = useAuthContext();
  const { items, addItem, updateItem, deleteItem, loading } = useToolItems("checklist");
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Autre");
  const [priority, setPriority] = useState("medium");
  const [filterCat, setFilterCat] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [viewMode, setViewMode] = useState<"kanban" | "list" | "table">("kanban");
  const [formOpen, setFormOpen] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addItem({ title, meta: { category, priority, status: "todo" } });
    toast({ title: t("Élément ajouté") });
    setTitle("");
  };

  const moveToColumn = (id: string, col: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (col === "done") updateItem(id, { done: true, meta: { ...item.meta, status: "done" } });
    else if (col === "in_progress") updateItem(id, { done: false, meta: { ...item.meta, status: "in_progress" } });
    else updateItem(id, { done: false, meta: { ...item.meta, status: "todo" } });
  };

  const filtered = items.filter(i => {
    if (filterCat !== "all" && i.meta?.category !== filterCat) return false;
    if (filterPriority !== "all" && i.meta?.priority !== filterPriority) return false;
    return true;
  });

  const doneCount = items.filter(i => i.done).length;
  const inProgressCount = items.filter(i => !i.done && i.meta?.status === "in_progress").length;
  const totalCount = items.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const priorityBadge = (p: string) => {
    if (p === "high") return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-destructive/15 text-destructive border border-destructive/20">Haute</span>;
    if (p === "medium") return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-primary/15 text-primary border border-primary/20">{t("Moyenne")}</span>;
    return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-muted text-muted-foreground border border-border">{t("Basse")}</span>;
  };

  const categoryTag = (cat: string) => (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${CATEGORY_COLORS[cat] || CATEGORY_COLORS.Autre}`}>
      {cat}
    </span>
  );

  return (
    <ToolPageWrapper title={t("Checklist")}>
      {/* KPI Row */}
      {totalCount > 0 && (
        <motion.div initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: t("Tous"), value: totalCount, icon: "📋" },
            { label: t("À faire"), value: totalCount - doneCount - inProgressCount, icon: "📝" },
            { label: "En cours", value: inProgressCount, icon: "⏳" },
            { label: t("Terminé"), value: doneCount, icon: "✅" },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} custom={i} variants={fadeUp} className="kpi-card">
              <span className="text-lg mb-1">{kpi.icon}</span>
              <p className="font-serif text-2xl text-foreground">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground font-body">{kpi.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Global Progress */}
      {totalCount > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-glass p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-serif text-sm text-foreground">Progression globale</p>
            <span className="font-serif text-lg text-primary font-semibold">{pct}%</span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(38 45% 50%), hsl(43 75% 55%))" }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>
      )}

      {/* Add Form */}
      {user && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-4 md:p-5 mb-6">
          <button onClick={() => setFormOpen(!formOpen)} className="flex items-center justify-between w-full text-left">
            <span className="font-serif text-sm text-foreground flex items-center gap-2"><Plus size={16} className="text-primary" /> Ajouter une tâche</span>
            {formOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {formOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="pt-4 space-y-3">
                  <Input placeholder={t("Titre")} value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} className="bg-background/60" />
                  <div className="grid grid-cols-2 gap-3">
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-background/60"><SelectValue /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className="bg-background/60"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t("Basse")}</SelectItem>
                        <SelectItem value="medium">{t("Moyenne")}</SelectItem>
                        <SelectItem value="high">{t("Haute")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAdd} className="btn-gold w-full sm:w-auto"><Plus size={16} className="mr-1" />{t("Ajouter")}</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Filters + View toggle */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Filter size={14} className="text-muted-foreground" />
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-[130px] h-8 text-xs bg-background/60"><SelectValue placeholder={t("Catégorie")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("Tous")}</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[110px] h-8 text-xs bg-background/60"><SelectValue placeholder={t("Priorité")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("Tous")}</SelectItem>
            <SelectItem value="low">{t("Basse")}</SelectItem>
            <SelectItem value="medium">{t("Moyenne")}</SelectItem>
            <SelectItem value="high">{t("Haute")}</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex gap-1">
          <Button variant={viewMode === "kanban" ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setViewMode("kanban")}><LayoutGrid size={14} /></Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}><List size={14} /></Button>
          <Button variant={viewMode === "table" ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setViewMode("table")}><Table2 size={14} /></Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card-glass p-4 animate-pulse"><div className="h-4 bg-muted rounded w-2/3" /><div className="h-3 bg-muted rounded w-1/3 mt-2" /></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-muted-foreground font-body">{t("Aucun élément")}</p>
        </div>
      ) : viewMode === "kanban" ? (
        <KanbanView items={filtered} moveToColumn={moveToColumn} deleteItem={deleteItem} priorityBadge={priorityBadge} categoryTag={categoryTag} t={t} />
      ) : viewMode === "table" ? (
        <TableView items={filtered} moveToColumn={moveToColumn} deleteItem={deleteItem} priorityBadge={priorityBadge} categoryTag={categoryTag} t={t} />
      ) : (
        <ListView items={filtered} moveToColumn={moveToColumn} deleteItem={deleteItem} priorityBadge={priorityBadge} categoryTag={categoryTag} t={t} />
      )}
    </ToolPageWrapper>
  );
}

/* ─── Kanban View ─── */
function KanbanView({ items, moveToColumn, deleteItem, priorityBadge, categoryTag, t }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {KANBAN_COLS.map(col => {
        const colItems = items.filter(col.filter);
        const Icon = col.icon;
        return (
          <div key={col.key} className="card-glass p-3 min-h-[200px]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/40">
              <Icon size={14} className="text-primary" />
              <h3 className="font-serif text-sm text-foreground">{col.label}</h3>
              <Badge variant="secondary" className="text-[10px] ml-auto">{colItems.length}</Badge>
            </div>
            <AnimatePresence mode="popLayout">
              {colItems.map((item: any, i: number) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30, delay: i * 0.03 }}
                  className="mb-2 rounded-xl p-3 border border-border/30 hover:border-primary/30 transition-all duration-300"
                  style={{ background: "hsla(var(--background) / 0.7)" }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className={`font-body text-sm font-medium leading-tight ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.title}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 opacity-40 hover:opacity-100" onClick={() => deleteItem(item.id)}><Trash2 size={12} className="text-destructive" /></Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {priorityBadge(item.meta?.priority || "medium")}
                    {categoryTag(item.meta?.category || "Autre")}
                  </div>
                  <div className="flex gap-1">
                    {col.key !== "todo" && <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 rounded-lg" onClick={() => moveToColumn(item.id, "todo")}>{t("À faire")}</Button>}
                    {col.key !== "in_progress" && <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 rounded-lg" onClick={() => moveToColumn(item.id, "in_progress")}>En cours</Button>}
                    {col.key !== "done" && <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 rounded-lg" onClick={() => moveToColumn(item.id, "done")}>{t("Terminé")}</Button>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ─── List View ─── */
function ListView({ items, moveToColumn, deleteItem, priorityBadge, categoryTag, t }: any) {
  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {items.map((item: any, i: number) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: i * 0.03 }}
            className="card-glass p-4 flex items-center gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className={`font-body font-medium text-sm ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.title}</p>
                {priorityBadge(item.meta?.priority || "medium")}
                {categoryTag(item.meta?.category || "Autre")}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              {!item.done && item.meta?.status !== "in_progress" && <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg" onClick={() => moveToColumn(item.id, "in_progress")}>En cours</Button>}
              {!item.done && <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg" onClick={() => moveToColumn(item.id, "done")}>{t("Terminé")}</Button>}
              {item.done && <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg" onClick={() => moveToColumn(item.id, "todo")}>{t("À faire")}</Button>}
            </div>
            <Button variant="ghost" size="icon" className="shrink-0 opacity-40 hover:opacity-100" onClick={() => deleteItem(item.id)}><Trash2 size={16} className="text-destructive" /></Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── Table View ─── */
function TableView({ items, moveToColumn, deleteItem, priorityBadge, categoryTag, t }: any) {
  return (
    <div className="card-glass overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40">
              <th className="text-left p-3 font-serif text-xs text-muted-foreground font-medium">Tâche</th>
              <th className="text-left p-3 font-serif text-xs text-muted-foreground font-medium">Catégorie</th>
              <th className="text-left p-3 font-serif text-xs text-muted-foreground font-medium">Priorité</th>
              <th className="text-left p-3 font-serif text-xs text-muted-foreground font-medium">Statut</th>
              <th className="text-right p-3 font-serif text-xs text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {items.map((item: any, i: number) => (
                <motion.tr
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-border/20 hover:bg-primary/5 transition-colors"
                >
                  <td className="p-3">
                    <p className={`font-body text-sm ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.title}</p>
                  </td>
                  <td className="p-3">{categoryTag(item.meta?.category || "Autre")}</td>
                  <td className="p-3">{priorityBadge(item.meta?.priority || "medium")}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.done ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : item.meta?.status === "in_progress" ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-muted text-muted-foreground border border-border"}`}>
                      {item.done ? t("Terminé") : item.meta?.status === "in_progress" ? "En cours" : t("À faire")}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex gap-1 justify-end">
                      {!item.done && item.meta?.status !== "in_progress" && <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 rounded-lg" onClick={() => moveToColumn(item.id, "in_progress")}>▶</Button>}
                      {!item.done && <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 rounded-lg" onClick={() => moveToColumn(item.id, "done")}>✓</Button>}
                      {item.done && <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 rounded-lg" onClick={() => moveToColumn(item.id, "todo")}>↩</Button>}
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-40 hover:opacity-100" onClick={() => deleteItem(item.id)}><Trash2 size={12} className="text-destructive" /></Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

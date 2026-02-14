import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolPageWrapper } from "@/components/tools/ToolPageWrapper";
import { useToolItems } from "@/hooks/use-tool-items";
import { useToolTranslations } from "@/hooks/use-tool-translations";
import { useAuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Filter, LayoutGrid, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["Mairie", "Religieux", "Réception", "Dot", "Voyage", "Tenues", "Prestataires", "Décoration", "Invités", "Autre"];
const PRIORITIES = ["low", "medium", "high"];
const KANBAN_COLS = [
  { key: "todo", label: "À faire", filter: (i: any) => !i.done && i.meta?.status !== "in_progress" },
  { key: "in_progress", label: "En cours", filter: (i: any) => !i.done && i.meta?.status === "in_progress" },
  { key: "done", label: "Terminé", filter: (i: any) => i.done },
];

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
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addItem({ title, meta: { category, priority, status: "todo" } });
    toast({ title: t("Élément ajouté") });
    setTitle("");
  };

  const moveToColumn = (id: string, col: string) => {
    if (col === "done") updateItem(id, { done: true, meta: { ...items.find(i => i.id === id)?.meta, status: "done" } });
    else if (col === "in_progress") updateItem(id, { done: false, meta: { ...items.find(i => i.id === id)?.meta, status: "in_progress" } });
    else updateItem(id, { done: false, meta: { ...items.find(i => i.id === id)?.meta, status: "todo" } });
  };

  const filtered = items.filter(i => {
    if (filterCat !== "all" && i.meta?.category !== filterCat) return false;
    if (filterPriority !== "all" && i.meta?.priority !== filterPriority) return false;
    return true;
  });

  const priorityBadge = (p: string) => {
    if (p === "high") return <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Haute</Badge>;
    if (p === "medium") return <Badge className="text-[10px] px-1.5 py-0 bg-primary/20 text-primary border-primary/30">{t("Moyenne")}</Badge>;
    return <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{t("Basse")}</Badge>;
  };

  const doneCount = items.filter(i => i.done).length;
  const totalCount = items.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <ToolPageWrapper title={t("Checklist")}>
      {/* KPI */}
      {totalCount > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="kpi-card"><p className="text-xs text-muted-foreground font-body">{t("Tous")}</p><p className="font-serif text-2xl text-foreground">{totalCount}</p></div>
          <div className="kpi-card"><p className="text-xs text-muted-foreground font-body">{t("Terminé")}</p><p className="font-serif text-2xl text-foreground">{doneCount}</p></div>
          <div className="kpi-card"><p className="text-xs text-muted-foreground font-body">Progrès</p><p className="font-serif text-2xl text-foreground">{pct}%</p></div>
        </div>
      )}

      {user && (
        <div className="card-glass p-4 md:p-6 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input className="sm:col-span-1" placeholder={t("Titre")} value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t("Basse")}</SelectItem>
                <SelectItem value="medium">{t("Moyenne")}</SelectItem>
                <SelectItem value="high">{t("Haute")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd} className="btn-gold"><Plus size={16} className="mr-1" />{t("Ajouter")}</Button>
        </div>
      )}

      {/* Filters + View toggle */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Filter size={14} className="text-muted-foreground" />
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder={t("Catégorie")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("Tous")}</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder={t("Priorité")} /></SelectTrigger>
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
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-body text-center py-8">…</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground font-body text-center py-8">{t("Aucun élément")}</p>
      ) : viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {KANBAN_COLS.map(col => {
            const colItems = filtered.filter(col.filter);
            return (
              <div key={col.key} className="card-glass p-3 min-h-[200px]">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-serif text-sm text-foreground">{col.label}</h3>
                  <Badge variant="secondary" className="text-[10px]">{colItems.length}</Badge>
                </div>
                <AnimatePresence mode="popLayout">
                  {colItems.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      className="bg-background/60 rounded-lg p-3 border border-border/40 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`font-body text-sm font-medium ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.title}</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => deleteItem(item.id)}><Trash2 size={12} className="text-destructive" /></Button>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {priorityBadge(item.meta?.priority || "medium")}
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{item.meta?.category || "Autre"}</Badge>
                      </div>
                      {/* Move buttons */}
                      <div className="flex gap-1">
                        {col.key !== "todo" && (
                          <Button variant="outline" size="sm" className="h-6 text-[10px] px-2" onClick={() => moveToColumn(item.id, "todo")}>{t("À faire")}</Button>
                        )}
                        {col.key !== "in_progress" && (
                          <Button variant="outline" size="sm" className="h-6 text-[10px] px-2" onClick={() => moveToColumn(item.id, "in_progress")}>En cours</Button>
                        )}
                        {col.key !== "done" && (
                          <Button variant="outline" size="sm" className="h-6 text-[10px] px-2" onClick={() => moveToColumn(item.id, "done")}>{t("Terminé")}</Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className="card-glass p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`font-body font-medium ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.title}</p>
                  {priorityBadge(item.meta?.priority || "medium")}
                </div>
                <Badge variant="outline" className="text-[10px]">{item.meta?.category || "Autre"}</Badge>
              </div>
              <div className="flex gap-1">
                {!item.done && item.meta?.status !== "in_progress" && (
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => moveToColumn(item.id, "in_progress")}>En cours</Button>
                )}
                {!item.done && (
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => moveToColumn(item.id, "done")}>{t("Terminé")}</Button>
                )}
                {item.done && (
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => moveToColumn(item.id, "todo")}>{t("À faire")}</Button>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}><Trash2 size={16} className="text-destructive" /></Button>
            </div>
          ))}
        </div>
      )}
    </ToolPageWrapper>
  );
}

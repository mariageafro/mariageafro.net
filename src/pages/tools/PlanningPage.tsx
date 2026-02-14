import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolPageWrapper } from "@/components/tools/ToolPageWrapper";
import { useToolItems } from "@/hooks/use-tool-items";
import { useToolTranslations } from "@/hooks/use-tool-translations";
import { useAuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays, Plus, Trash2, ChevronDown, ChevronUp, List, LayoutGrid, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { format, differenceInDays, isPast, isToday } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const PRIORITY_CONFIG: Record<string, { label: string; cls: string; icon: string }> = {
  high: { label: "Haute", cls: "bg-destructive/15 text-destructive border-destructive/20", icon: "🔴" },
  medium: { label: "Moyenne", cls: "bg-primary/15 text-primary border-primary/20", icon: "🟡" },
  low: { label: "Basse", cls: "bg-muted text-muted-foreground border-border", icon: "🟢" },
};

export default function PlanningPage() {
  const t = useToolTranslations();
  const { lang } = useLanguage();
  const { user } = useAuthContext();
  const { items, addItem, updateItem, deleteItem, loading } = useToolItems("planning");
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [priority, setPriority] = useState("medium");
  const [note, setNote] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline");

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addItem({ title, date: date?.toISOString() || null, meta: { priority, note } });
    toast({ title: t("Élément ajouté") });
    setTitle(""); setDate(undefined); setPriority("medium"); setNote("");
  };

  const sorted = [...items].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const doneCount = items.filter(i => i.done).length;
  const totalCount = items.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const overdueCount = items.filter(i => !i.done && i.date && isPast(new Date(i.date)) && !isToday(new Date(i.date))).length;
  const upcomingCount = items.filter(i => !i.done && i.date && !isPast(new Date(i.date))).length;

  const locale = lang === "fr" ? fr : enUS;

  const getDateBadge = (dateStr: string | null) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isToday(d)) return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-primary/15 text-primary border border-primary/20">Aujourd'hui</span>;
    if (isPast(d)) return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-destructive/15 text-destructive border border-destructive/20">En retard</span>;
    const days = differenceInDays(d, new Date());
    if (days <= 7) return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">J-{days}</span>;
    return null;
  };

  // Group by month for timeline view
  const groupedByMonth: Record<string, typeof sorted> = {};
  const noDateItems: typeof sorted = [];
  sorted.forEach(item => {
    if (!item.date) { noDateItems.push(item); return; }
    const key = format(new Date(item.date), "MMMM yyyy", { locale });
    if (!groupedByMonth[key]) groupedByMonth[key] = [];
    groupedByMonth[key].push(item);
  });

  return (
    <ToolPageWrapper title={t("Planning du mariage")}>
      {/* KPI Row */}
      {totalCount > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: totalCount, icon: "📋" },
            { label: t("Terminé"), value: doneCount, icon: "✅" },
            { label: "À venir", value: upcomingCount, icon: "📅" },
            { label: "En retard", value: overdueCount, icon: "⚠️" },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.4 }} className="kpi-card">
              <span className="text-lg mb-1">{kpi.icon}</span>
              <p className="font-serif text-2xl text-foreground">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground font-body">{kpi.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Global Progress */}
      {totalCount > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="card-glass p-4 mb-6">
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
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
            />
          </div>
        </motion.div>
      )}

      {/* Add Form */}
      {user && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-4 md:p-5 mb-6">
          <button onClick={() => setFormOpen(!formOpen)} className="flex items-center justify-between w-full text-left">
            <span className="font-serif text-sm text-foreground flex items-center gap-2"><Plus size={16} className="text-primary" /> Ajouter une étape</span>
            {formOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {formOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="pt-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input placeholder={t("Titre")} value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} className="bg-background/60" />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start font-body bg-background/60">
                          <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                          {date ? format(date, "PPP", { locale }) : t("Date")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} /></PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className="bg-background/60"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t("Basse")}</SelectItem>
                        <SelectItem value="medium">{t("Moyenne")}</SelectItem>
                        <SelectItem value="high">{t("Haute")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder={t("Note")} value={note} onChange={e => setNote(e.target.value)} className="bg-background/60" />
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
        <Button variant={viewMode === "timeline" ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setViewMode("timeline")}><LayoutGrid size={14} /></Button>
        <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}><List size={14} /></Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card-glass p-4 animate-pulse"><div className="h-4 bg-muted rounded w-2/3" /><div className="h-3 bg-muted rounded w-1/3 mt-2" /></div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-muted-foreground font-body">{t("Aucun élément")}</p>
        </div>
      ) : viewMode === "timeline" ? (
        /* ─── Timeline View ─── */
        <div className="space-y-6">
          {Object.entries(groupedByMonth).map(([month, monthItems], gi) => (
            <motion.div key={month} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.08 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-border/60" />
                <span className="font-serif text-sm text-primary capitalize">{month}</span>
                <div className="h-px flex-1 bg-border/60" />
              </div>
              <div className="space-y-2 relative">
                {/* Timeline line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-px hidden md:block" style={{ background: "linear-gradient(180deg, hsl(38 45% 50% / 0.3), hsl(38 45% 50% / 0.05))" }} />
                <AnimatePresence mode="popLayout">
                  {monthItems.map((item, i) => (
                    <TimelineItem key={item.id} item={item} index={i} locale={locale} updateItem={updateItem} deleteItem={deleteItem} getDateBadge={getDateBadge} t={t} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
          {noDateItems.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-border/60" />
                <span className="font-serif text-sm text-muted-foreground">Sans date</span>
                <div className="h-px flex-1 bg-border/60" />
              </div>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {noDateItems.map((item, i) => (
                    <TimelineItem key={item.id} item={item} index={i} locale={locale} updateItem={updateItem} deleteItem={deleteItem} getDateBadge={getDateBadge} t={t} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        /* ─── Simple List View ─── */
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {sorted.map((item, i) => (
              <TimelineItem key={item.id} item={item} index={i} locale={locale} updateItem={updateItem} deleteItem={deleteItem} getDateBadge={getDateBadge} t={t} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </ToolPageWrapper>
  );
}

/* ─── Timeline Item ─── */
function TimelineItem({ item, index, locale, updateItem, deleteItem, getDateBadge, t }: any) {
  const p = item.meta?.priority || "medium";
  const cfg = PRIORITY_CONFIG[p] || PRIORITY_CONFIG.medium;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ delay: index * 0.03, type: "spring", stiffness: 400, damping: 30 }}
      className="card-glass p-4 flex items-center gap-3 md:ml-6"
    >
      {/* Timeline dot */}
      <div className="hidden md:flex items-center justify-center w-5 h-5 -ml-9 rounded-full border-2 shrink-0" style={{ borderColor: "hsl(38 45% 50%)", background: item.done ? "hsl(38 45% 50%)" : "hsl(var(--background))" }}>
        {item.done && <CheckCircle2 size={10} className="text-primary-foreground" />}
      </div>

      <Checkbox checked={item.done} onCheckedChange={v => updateItem(item.id, { done: !!v })} className="shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p className={`font-body font-medium text-sm ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.title}</p>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${cfg.cls}`}>{t(cfg.label)}</span>
          {getDateBadge(item.date)}
        </div>
        <div className="flex gap-3 text-xs text-muted-foreground font-body">
          {item.date && (
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {format(new Date(item.date), "PPP", { locale })}
            </span>
          )}
          {item.meta?.note && <span className="truncate max-w-[200px]">{item.meta.note}</span>}
        </div>
      </div>

      <Button variant="ghost" size="icon" className="shrink-0 opacity-40 hover:opacity-100" onClick={() => deleteItem(item.id)}>
        <Trash2 size={16} className="text-destructive" />
      </Button>
    </motion.div>
  );
}

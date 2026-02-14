import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolPageWrapper } from "@/components/tools/ToolPageWrapper";
import { useToolItems } from "@/hooks/use-tool-items";
import { useToolTranslations } from "@/hooks/use-tool-translations";
import { useAuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays, Plus, Trash2, Bell, BellRing, ChevronDown, ChevronUp, Clock, Mail, CreditCard, Wallet, AlertTriangle } from "lucide-react";
import { format, differenceInDays, isPast, isToday } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";

const REMINDER_TYPES = [
  { value: "general", label: "Général", icon: "🔔" },
  { value: "acompte", label: "Acompte prestataire", icon: "💰" },
  { value: "solde", label: "Solde à payer", icon: "💳" },
  { value: "rdv", label: "Rendez-vous", icon: "📅" },
  { value: "deadline", label: "Deadline", icon: "⏰" },
  { value: "email", label: "Relance email", icon: "✉️" },
];

const TYPE_COLORS: Record<string, string> = {
  general: "bg-muted text-muted-foreground border-border",
  acompte: "bg-amber-100 text-amber-700 border-amber-200",
  solde: "bg-rose-100 text-rose-700 border-rose-200",
  rdv: "bg-blue-100 text-blue-700 border-blue-200",
  deadline: "bg-destructive/15 text-destructive border-destructive/20",
  email: "bg-primary/15 text-primary border-primary/20",
};

export default function RemindersPage() {
  const t = useToolTranslations();
  const { lang } = useLanguage();
  const { user } = useAuthContext();
  const { items, addItem, deleteItem, loading } = useToolItems("reminders");
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("09:00");
  const [note, setNote] = useState("");
  const [type, setType] = useState("general");
  const [amount, setAmount] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const locale = lang === "fr" ? fr : enUS;

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addItem({
      title,
      date: date?.toISOString() || null,
      amount: amount ? parseFloat(amount) : null,
      meta: { note, type, time, notifyEmail, emailSent: false },
    });
    toast({ title: t("Élément ajouté") });
    setTitle(""); setDate(undefined); setTime("09:00"); setNote(""); setType("general"); setAmount("");
  };

  const now = new Date();
  const sorted = [...items].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const pastCount = items.filter(i => i.date && isPast(new Date(i.date)) && !isToday(new Date(i.date))).length;
  const todayCount = items.filter(i => i.date && isToday(new Date(i.date))).length;
  const upcomingCount = items.filter(i => i.date && !isPast(new Date(i.date)) && !isToday(new Date(i.date))).length;
  const totalAmount = items.filter(i => i.amount && (i.meta?.type === "acompte" || i.meta?.type === "solde")).reduce((s, i) => s + (i.amount || 0), 0);

  const showAmountField = type === "acompte" || type === "solde";

  return (
    <ToolPageWrapper title={t("Rappels")}>
      {/* KPI Row */}
      {items.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: items.length, icon: "🔔" },
            { label: "Aujourd'hui", value: todayCount, icon: "📌" },
            { label: "À venir", value: upcomingCount, icon: "📅" },
            { label: "Paiements", value: `${totalAmount.toLocaleString()} €`, icon: "💰" },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="kpi-card">
              <span className="text-lg mb-1">{kpi.icon}</span>
              <p className="font-serif text-xl text-foreground">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground font-body">{kpi.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add Form */}
      {user && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-4 md:p-5 mb-6">
          <button onClick={() => setFormOpen(!formOpen)} className="flex items-center justify-between w-full text-left">
            <span className="font-serif text-sm text-foreground flex items-center gap-2"><Plus size={16} className="text-primary" /> Ajouter un rappel</span>
            {formOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {formOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="pt-4 space-y-3">
                  <Input placeholder={t("Titre")} value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} className="bg-background/60" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start font-body bg-background/60">
                          <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                          {date ? format(date, "PPP", { locale }) : t("Date")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} /></PopoverContent>
                    </Popover>
                    <div className="relative">
                      <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input type="time" value={time} onChange={e => setTime(e.target.value)} className="pl-9 bg-background/60" />
                    </div>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="bg-background/60"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {REMINDER_TYPES.map(rt => <SelectItem key={rt.value} value={rt.value}>{rt.icon} {rt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input placeholder={t("Note")} value={note} onChange={e => setNote(e.target.value)} className="bg-background/60" />
                    {showAmountField && (
                      <Input type="number" placeholder="Montant (€)" value={amount} onChange={e => setAmount(e.target.value)} className="bg-background/60" />
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs font-body text-muted-foreground cursor-pointer">
                      <input type="checkbox" checked={notifyEmail} onChange={e => setNotifyEmail(e.target.checked)} className="rounded border-border" />
                      <Mail size={12} /> Notification email
                    </label>
                  </div>
                  <Button onClick={handleAdd} className="btn-gold w-full sm:w-auto"><Plus size={16} className="mr-1" />{t("Ajouter")}</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Overdue Alert */}
      {pastCount > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-glass p-3 mb-4 flex items-center gap-3 border-destructive/30">
          <AlertTriangle size={18} className="text-destructive shrink-0" />
          <p className="font-body text-sm text-destructive">{pastCount} rappel(s) en retard</p>
        </motion.div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card-glass p-4 animate-pulse"><div className="h-4 bg-muted rounded w-2/3" /><div className="h-3 bg-muted rounded w-1/3 mt-2" /></div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="text-4xl mb-3">🔔</p>
          <p className="text-muted-foreground font-body">{t("Aucun élément")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {sorted.map((item, i) => {
              const itemDate = item.date ? new Date(item.date) : null;
              const isOverdue = itemDate ? isPast(itemDate) && !isToday(itemDate) : false;
              const isTodayItem = itemDate ? isToday(itemDate) : false;
              const daysLeft = itemDate && !isPast(itemDate) ? differenceInDays(itemDate, now) : null;
              const rt = REMINDER_TYPES.find(r => r.value === (item.meta?.type || "general")) || REMINDER_TYPES[0];
              const typeCls = TYPE_COLORS[item.meta?.type || "general"] || TYPE_COLORS.general;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03, type: "spring", stiffness: 400, damping: 30 }}
                  className={`card-glass p-4 flex items-center gap-3 ${isOverdue ? "border-destructive/30" : isTodayItem ? "border-primary/30" : ""}`}
                >
                  {isTodayItem ? (
                    <BellRing size={18} className="text-primary shrink-0 animate-pulse" />
                  ) : (
                    <Bell size={18} className={`shrink-0 ${isOverdue ? "text-destructive" : "text-muted-foreground"}`} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className={`font-body font-medium text-sm ${isOverdue ? "text-destructive" : "text-foreground"}`}>{item.title}</p>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${typeCls}`}>
                        {rt.icon} {rt.label}
                      </span>
                      {isOverdue && <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-destructive/15 text-destructive border border-destructive/20">En retard</span>}
                      {isTodayItem && <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-primary/15 text-primary border border-primary/20">Aujourd'hui</span>}
                      {daysLeft !== null && daysLeft <= 7 && daysLeft > 0 && <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">J-{daysLeft}</span>}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground font-body">
                      {itemDate && (
                        <span className="flex items-center gap-1">
                          <CalendarDays size={10} />
                          {format(itemDate, "PPP", { locale })}
                        </span>
                      )}
                      {item.meta?.time && (
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {item.meta.time}
                        </span>
                      )}
                      {item.amount != null && item.amount > 0 && (
                        <span className="flex items-center gap-1">
                          {item.meta?.type === "acompte" ? <Wallet size={10} /> : <CreditCard size={10} />}
                          {item.amount.toLocaleString()} €
                        </span>
                      )}
                      {item.meta?.notifyEmail && (
                        <span className="flex items-center gap-1 text-primary">
                          <Mail size={10} /> Email
                        </span>
                      )}
                      {item.meta?.note && <span className="truncate max-w-[180px]">{item.meta.note}</span>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 opacity-40 hover:opacity-100" onClick={() => deleteItem(item.id)}>
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </ToolPageWrapper>
  );
}

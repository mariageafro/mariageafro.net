import { useState } from "react";
import { ToolPageWrapper } from "@/components/tools/ToolPageWrapper";
import { useToolItems } from "@/hooks/use-tool-items";
import { useToolTranslations } from "@/hooks/use-tool-translations";
import { useAuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays, Plus, Trash2, Bell } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";

export default function RemindersPage() {
  const t = useToolTranslations();
  const { lang } = useLanguage();
  const { user } = useAuthContext();
  const { items, addItem, deleteItem, loading } = useToolItems("reminders");
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [note, setNote] = useState("");

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addItem({ title, date: date?.toISOString() || null, meta: { note, type: "email" } });
    toast({ title: t("Élément ajouté") });
    setTitle(""); setDate(undefined); setNote("");
  };

  const now = new Date();
  const sorted = [...items].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <ToolPageWrapper title={t("Rappels")}>
      {user && (
        <div className="card-premium p-4 md:p-6 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder={t("Titre")} value={title} onChange={e => setTitle(e.target.value)} />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start font-body">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: lang === "fr" ? fr : enUS }) : t("Date")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} /></PopoverContent>
            </Popover>
          </div>
          <Input placeholder={t("Note")} value={note} onChange={e => setNote(e.target.value)} />
          <Button onClick={handleAdd} className="btn-gold"><Plus size={16} className="mr-1" />{t("Ajouter")}</Button>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground font-body text-center py-8">…</p>
      ) : sorted.length === 0 ? (
        <p className="text-muted-foreground font-body text-center py-8">{t("Aucun élément")}</p>
      ) : (
        <div className="space-y-2">
          {sorted.map(item => {
            const isPast = item.date ? new Date(item.date) < now : false;
            return (
              <div key={item.id} className={`card-premium p-4 flex items-center gap-3 ${isPast ? "opacity-60" : ""}`}>
                <Bell size={18} className={isPast ? "text-muted-foreground" : "text-primary"} />
                <div className="flex-1 min-w-0">
                  <p className="font-body font-medium text-foreground">{item.title}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground font-body">
                    {item.date && <span>{format(new Date(item.date), "PPP", { locale: lang === "fr" ? fr : enUS })}</span>}
                    <span className={isPast ? "text-destructive" : "text-primary"}>{isPast ? t("Passé") : t("À venir")}</span>
                    {item.meta?.note && <span className="truncate">{item.meta.note}</span>}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}><Trash2 size={16} className="text-destructive" /></Button>
              </div>
            );
          })}
        </div>
      )}
    </ToolPageWrapper>
  );
}

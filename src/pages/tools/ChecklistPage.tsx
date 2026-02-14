import { useState } from "react";
import { ToolPageWrapper } from "@/components/tools/ToolPageWrapper";
import { useToolItems } from "@/hooks/use-tool-items";
import { useToolTranslations } from "@/hooks/use-tool-translations";
import { useAuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["Mairie", "Religieux", "Réception", "Déco", "Photo & Vidéo", "Traiteur", "Musique", "Autre"];

export default function ChecklistPage() {
  const t = useToolTranslations();
  const { user } = useAuthContext();
  const { items, addItem, updateItem, deleteItem, loading } = useToolItems("checklist");
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Autre");
  const [filter, setFilter] = useState("all");

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addItem({ title, meta: { category } });
    toast({ title: t("Élément ajouté") });
    setTitle("");
  };

  const filtered = items.filter(i => {
    if (filter === "todo") return !i.done;
    if (filter === "done") return i.done;
    return true;
  });

  return (
    <ToolPageWrapper title={t("Checklist")}>
      {user && (
        <div className="card-premium p-4 md:p-6 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input className="sm:col-span-2" placeholder={t("Titre")} value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd} className="btn-gold"><Plus size={16} className="mr-1" />{t("Ajouter")}</Button>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {["all", "todo", "done"].map(f => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="font-body text-xs">
            {f === "all" ? t("Tous") : f === "todo" ? t("À faire") : t("Terminé")}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground font-body text-center py-8">…</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground font-body text-center py-8">{t("Aucun élément")}</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className="card-premium p-4 flex items-center gap-3">
              <Checkbox checked={item.done} onCheckedChange={v => updateItem(item.id, { done: !!v })} />
              <div className="flex-1 min-w-0">
                <p className={`font-body font-medium ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.title}</p>
                <span className="text-xs text-muted-foreground font-body">{item.meta?.category}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}><Trash2 size={16} className="text-destructive" /></Button>
            </div>
          ))}
        </div>
      )}
    </ToolPageWrapper>
  );
}

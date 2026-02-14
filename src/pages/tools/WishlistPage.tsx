import { useState } from "react";
import { ToolPageWrapper } from "@/components/tools/ToolPageWrapper";
import { useToolItems } from "@/hooks/use-tool-items";
import { useToolTranslations } from "@/hooks/use-tool-translations";
import { useAuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WishlistPage() {
  const t = useToolTranslations();
  const { user } = useAuthContext();
  const { items, addItem, updateItem, deleteItem, loading } = useToolItems("wishlist");
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [price, setPrice] = useState("");

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addItem({ title, amount: price ? parseFloat(price) : null, meta: { url: url || null, reserved: false } });
    toast({ title: t("Élément ajouté") });
    setTitle(""); setUrl(""); setPrice("");
  };

  return (
    <ToolPageWrapper title={t("Liste de souhaits")}>
      {user && (
        <div className="card-premium p-4 md:p-6 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input placeholder={t("Titre")} value={title} onChange={e => setTitle(e.target.value)} />
            <Input placeholder={t("Lien URL")} value={url} onChange={e => setUrl(e.target.value)} />
            <Input type="number" placeholder={t("Prix")} value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <Button onClick={handleAdd} className="btn-gold"><Plus size={16} className="mr-1" />{t("Ajouter")}</Button>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground font-body text-center py-8">…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground font-body text-center py-8">{t("Aucun élément")}</p>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="card-premium p-4 flex items-center gap-3">
              <Checkbox checked={!!item.meta?.reserved} onCheckedChange={v => updateItem(item.id, { meta: { ...item.meta, reserved: !!v } })} />
              <div className="flex-1 min-w-0">
                <p className={`font-body font-medium ${item.meta?.reserved ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.title}</p>
                <div className="flex gap-2 text-xs text-muted-foreground font-body">
                  {item.amount && <span>{item.amount.toLocaleString()} €</span>}
                  {item.meta?.reserved && <span className="text-primary">{t("Réservé")}</span>}
                </div>
              </div>
              {item.meta?.url && (
                <a href={item.meta.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} className="text-primary" /></a>
              )}
              <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}><Trash2 size={16} className="text-destructive" /></Button>
            </div>
          ))}
        </div>
      )}
    </ToolPageWrapper>
  );
}

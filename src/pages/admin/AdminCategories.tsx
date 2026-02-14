import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logAdminAction } from "@/hooks/use-admin-log";

type Category = { id: string; name: string; slug: string; icon: string | null };

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", icon: "" });
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("name");
    setCats(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const add = async () => {
    if (!form.name.trim()) return;
    const slug = form.name.toLowerCase().replace(/[^a-z0-9àâäéèêëïîôùûüÿç]+/g, "-").replace(/(^-|-$)/g, "");
    const { error } = await supabase.from("categories").insert({ name: form.name.trim(), slug, icon: form.icon || null });
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { await logAdminAction("add_category", "categories"); setAddOpen(false); setForm({ name: "", icon: "" }); fetch(); }
  };

  const update = async () => {
    if (!editCat) return;
    const { error } = await supabase.from("categories").update({ name: form.name, icon: form.icon || null }).eq("id", editCat.id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { await logAdminAction("update_category", "categories", editCat.id); setEditCat(null); fetch(); }
  };

  const del = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { await logAdminAction("delete_category", "categories", id); fetch(); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-champagne" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-champagne">Catégories</h1>
        <Button onClick={() => { setForm({ name: "", icon: "" }); setAddOpen(true); }} className="bg-champagne text-chocolate"><Plus size={16} className="mr-1" /> Ajouter</Button>
      </div>

      <div className="rounded-xl border border-champagne/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-champagne/10 hover:bg-transparent">
              <TableHead className="text-champagne/70">Nom</TableHead>
              <TableHead className="text-champagne/70">Slug</TableHead>
              <TableHead className="text-champagne/70">Icône</TableHead>
              <TableHead className="text-champagne/70">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cats.map((c) => (
              <TableRow key={c.id} className="border-champagne/10 hover:bg-white/5">
                <TableCell className="text-ivory font-medium">{c.name}</TableCell>
                <TableCell className="text-ivory/50">{c.slug}</TableCell>
                <TableCell className="text-ivory/50">{c.icon || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-champagne" onClick={() => { setEditCat(c); setForm({ name: c.name, icon: c.icon || "" }); }}>
                      <Pencil size={14} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-red-400"><Trash2 size={14} /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Supprimer {c.name} ?</AlertDialogTitle><AlertDialogDescription>Les prestataires liés perdront cette catégorie.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del(c.id)} className="bg-red-600">Supprimer</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={addOpen || !!editCat} onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditCat(null); } }}>
        <DialogContent className="bg-[#1a1a2e] border-champagne/20 text-ivory">
          <DialogHeader><DialogTitle className="text-champagne">{editCat ? "Modifier" : "Ajouter"} une catégorie</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-[#0f0f23] border-champagne/20 text-ivory" />
            <Input placeholder="Icône (emoji ou lucide)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="bg-[#0f0f23] border-champagne/20 text-ivory" />
            <Button onClick={editCat ? update : add} className="w-full bg-champagne text-chocolate">{editCat ? "Enregistrer" : "Ajouter"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

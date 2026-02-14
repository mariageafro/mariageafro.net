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

type Country = { id: string; name: string; code: string; flag_emoji: string | null; priority: number | null };

export default function AdminCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Country | null>(null);
  const [form, setForm] = useState({ name: "", code: "", flag_emoji: "", priority: "" });
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("countries").select("*").order("priority", { ascending: true });
    setCountries(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const add = async () => {
    if (!form.name.trim() || !form.code.trim()) return;
    const { error } = await supabase.from("countries").insert({
      name: form.name.trim(), code: form.code.trim().toUpperCase(),
      flag_emoji: form.flag_emoji || "🌍", priority: parseInt(form.priority) || 999,
    });
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { await logAdminAction("add_country", "countries"); setAddOpen(false); resetForm(); fetchData(); }
  };

  const update = async () => {
    if (!editItem) return;
    const { error } = await supabase.from("countries").update({
      name: form.name, code: form.code.toUpperCase(),
      flag_emoji: form.flag_emoji || "🌍", priority: parseInt(form.priority) || 999,
    }).eq("id", editItem.id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { await logAdminAction("update_country", "countries", editItem.id); setEditItem(null); fetchData(); }
  };

  const del = async (id: string) => {
    const { error } = await supabase.from("countries").delete().eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { await logAdminAction("delete_country", "countries", id); fetchData(); }
  };

  const resetForm = () => setForm({ name: "", code: "", flag_emoji: "", priority: "" });

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-champagne" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-champagne">Pays</h1>
        <Button onClick={() => { resetForm(); setAddOpen(true); }} className="bg-champagne text-chocolate"><Plus size={16} className="mr-1" /> Ajouter</Button>
      </div>

      <div className="rounded-xl border border-champagne/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-champagne/10 hover:bg-transparent">
              <TableHead className="text-champagne/70">Drapeau</TableHead>
              <TableHead className="text-champagne/70">Nom</TableHead>
              <TableHead className="text-champagne/70">Code</TableHead>
              <TableHead className="text-champagne/70">Priorité</TableHead>
              <TableHead className="text-champagne/70">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.map((c) => (
              <TableRow key={c.id} className="border-champagne/10 hover:bg-white/5">
                <TableCell className="text-2xl">{c.flag_emoji}</TableCell>
                <TableCell className="text-ivory font-medium">{c.name}</TableCell>
                <TableCell className="text-ivory/50">{c.code}</TableCell>
                <TableCell className="text-ivory/50">{c.priority}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-champagne" onClick={() => { setEditItem(c); setForm({ name: c.name, code: c.code, flag_emoji: c.flag_emoji || "", priority: String(c.priority ?? "") }); }}>
                      <Pencil size={14} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-red-400"><Trash2 size={14} /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Supprimer {c.name} ?</AlertDialogTitle><AlertDialogDescription>Action irréversible.</AlertDialogDescription></AlertDialogHeader>
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

      <Dialog open={addOpen || !!editItem} onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditItem(null); } }}>
        <DialogContent className="bg-[#1a1a2e] border-champagne/20 text-ivory">
          <DialogHeader><DialogTitle className="text-champagne">{editItem ? "Modifier" : "Ajouter"} un pays</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-[#0f0f23] border-champagne/20 text-ivory" />
            <Input placeholder="Code (FR)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="bg-[#0f0f23] border-champagne/20 text-ivory" />
            <Input placeholder="Emoji 🇫🇷" value={form.flag_emoji} onChange={(e) => setForm({ ...form, flag_emoji: e.target.value })} className="bg-[#0f0f23] border-champagne/20 text-ivory" />
            <Input placeholder="Priorité" type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="bg-[#0f0f23] border-champagne/20 text-ivory" />
            <Button onClick={editItem ? update : add} className="w-full bg-champagne text-chocolate">{editItem ? "Enregistrer" : "Ajouter"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Plus, Pencil, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logAdminAction } from "@/hooks/use-admin-log";

type Page = { id: string; slug: string; title: string; title_fr: string | null; title_en: string | null; content: string | null; content_fr: string | null; content_en: string | null; hero_image_url: string | null; updated_at: string };

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPage, setEditPage] = useState<Page | null>(null);
  const [form, setForm] = useState({ slug: "", title: "", title_fr: "", title_en: "", content_fr: "", content_en: "", hero_image_url: "" });
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from("pages").select("*").order("updated_at", { ascending: false });
    setPages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const add = async () => {
    if (!form.slug.trim() || !form.title_fr.trim()) return;
    const { error } = await (supabase as any).from("pages").insert({
      slug: form.slug.trim(), title: form.title_fr.trim(),
      title_fr: form.title_fr.trim(), title_en: form.title_en || null,
      content: form.content_fr || null, content_fr: form.content_fr || null, content_en: form.content_en || null,
      hero_image_url: form.hero_image_url || null,
    });
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { await logAdminAction("add_page", "pages"); setAddOpen(false); resetForm(); fetchData(); }
  };

  const update = async () => {
    if (!editPage) return;
    const { error } = await (supabase as any).from("pages").update({
      title: form.title_fr, title_fr: form.title_fr, title_en: form.title_en || null,
      content: form.content_fr || null, content_fr: form.content_fr || null, content_en: form.content_en || null,
      hero_image_url: form.hero_image_url || null,
    }).eq("id", editPage.id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { await logAdminAction("update_page", "pages", editPage.id); setEditPage(null); fetchData(); }
  };

  const del = async (id: string) => {
    const { error } = await (supabase as any).from("pages").delete().eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { await logAdminAction("delete_page", "pages", id); fetchData(); }
  };

  const resetForm = () => setForm({ slug: "", title: "", title_fr: "", title_en: "", content_fr: "", content_en: "", hero_image_url: "" });
  const inputClass = "bg-[#0f0f23] border-champagne/20 text-ivory";

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-champagne" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-champagne">Pages CMS</h1>
        <Button onClick={() => { resetForm(); setAddOpen(true); }} className="bg-champagne text-chocolate"><Plus size={16} className="mr-1" /> Ajouter</Button>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-12 text-ivory/40"><FileText size={48} className="mx-auto mb-2 opacity-30" /><p>Aucune page créée</p></div>
      ) : (
        <div className="rounded-xl border border-champagne/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-champagne/10 hover:bg-transparent">
                <TableHead className="text-champagne/70">Titre FR</TableHead>
                <TableHead className="text-champagne/70">Titre EN</TableHead>
                <TableHead className="text-champagne/70">Slug</TableHead>
                <TableHead className="text-champagne/70">Modifié</TableHead>
                <TableHead className="text-champagne/70">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((p) => (
                <TableRow key={p.id} className="border-champagne/10 hover:bg-white/5">
                  <TableCell className="text-ivory font-medium">{p.title_fr || p.title}</TableCell>
                  <TableCell className="text-ivory/50">{p.title_en || "—"}</TableCell>
                  <TableCell className="text-ivory/50">/{p.slug}</TableCell>
                  <TableCell className="text-ivory/50 text-xs">{new Date(p.updated_at).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-champagne" onClick={() => {
                        setEditPage(p);
                        setForm({ slug: p.slug, title: p.title, title_fr: p.title_fr || p.title, title_en: p.title_en || "", content_fr: p.content_fr || p.content || "", content_en: p.content_en || "", hero_image_url: p.hero_image_url || "" });
                      }}><Pencil size={14} /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-red-400"><Trash2 size={14} /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Supprimer "{p.title}" ?</AlertDialogTitle><AlertDialogDescription>Action irréversible.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del(p.id)} className="bg-red-600">Supprimer</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={addOpen || !!editPage} onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditPage(null); } }}>
        <DialogContent className="bg-[#1a1a2e] border-champagne/20 text-ivory max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-champagne">{editPage ? "Modifier" : "Créer"} une page</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {!editPage && <Input placeholder="Slug (ex: a-propos)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} />}
            <div>
              <Label className="text-ivory/60 text-xs">Titre FR *</Label>
              <Input value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })} className={inputClass} />
            </div>
            <div>
              <Label className="text-ivory/60 text-xs">Titre EN</Label>
              <Input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className={inputClass} />
            </div>
            <Input placeholder="URL image hero" value={form.hero_image_url} onChange={(e) => setForm({ ...form, hero_image_url: e.target.value })} className={inputClass} />
            <div>
              <Label className="text-ivory/60 text-xs">Contenu FR</Label>
              <Textarea rows={8} value={form.content_fr} onChange={(e) => setForm({ ...form, content_fr: e.target.value })} className={`${inputClass} min-h-[150px]`} />
            </div>
            <div>
              <Label className="text-ivory/60 text-xs">Contenu EN</Label>
              <Textarea rows={8} value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })} className={`${inputClass} min-h-[150px]`} />
            </div>
            <Button onClick={editPage ? update : add} className="w-full bg-champagne text-chocolate">{editPage ? "Enregistrer" : "Créer"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

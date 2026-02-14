import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Trash2, Ban, CheckCircle2, ArrowUpDown, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logAdminAction } from "@/hooks/use-admin-log";

type Vendor = {
  id: string;
  nom_entreprise: string;
  ville: string | null;
  pays: string | null;
  statut: string;
  telephone: string | null;
  description: string | null;
  categorie_id: string | null;
  created_at: string;
  category_name?: string;
  subscription_type?: string;
};

type Category = { id: string; name: string };

export default function AdminVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSub, setFilterSub] = useState("all");
  const [sortAsc, setSortAsc] = useState(false);
  const [editVendor, setEditVendor] = useState<Vendor | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ nom_entreprise: "", ville: "", pays: "France", telephone: "", description: "", categorie_id: "" });
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const [vRes, cRes] = await Promise.all([
      supabase.from("prestataires").select("id, nom_entreprise, ville, pays, statut, telephone, description, categorie_id, created_at").order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name").order("name"),
    ]);

    const vendorsData = vRes.data ?? [];
    // Fetch subscriptions
    const ids = vendorsData.map((v) => v.id);
    let subs: Record<string, string> = {};
    if (ids.length > 0) {
      const { data: subData } = await supabase.from("abonnements").select("prestataire_id, type").in("prestataire_id", ids).eq("actif", true);
      (subData ?? []).forEach((s) => { subs[s.prestataire_id] = s.type; });
    }

    const catMap: Record<string, string> = {};
    (cRes.data ?? []).forEach((c) => { catMap[c.id] = c.name; });

    setVendors(vendorsData.map((v) => ({
      ...v,
      category_name: v.categorie_id ? catMap[v.categorie_id] : undefined,
      subscription_type: subs[v.id] || "gratuit",
    })));
    setCategories(cRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const cities = useMemo(() => [...new Set(vendors.map((v) => v.ville).filter(Boolean))].sort(), [vendors]);

  const filtered = useMemo(() => {
    let result = vendors;
    if (search) result = result.filter((v) => v.nom_entreprise.toLowerCase().includes(search.toLowerCase()));
    if (filterCity !== "all") result = result.filter((v) => v.ville === filterCity);
    if (filterCategory !== "all") result = result.filter((v) => v.categorie_id === filterCategory);
    if (filterStatus !== "all") result = result.filter((v) => v.statut === filterStatus);
    if (filterSub !== "all") result = result.filter((v) => v.subscription_type === filterSub);
    if (sortAsc) result = [...result].reverse();
    return result;
  }, [vendors, search, filterCity, filterCategory, filterStatus, filterSub, sortAsc]);

  const updateVendor = async (id: string, updates: Record<string, unknown>) => {
    const { error } = await supabase.rpc("admin_update_prestataire", {
      _prestataire_id: id,
      _updates: updates as any,
    });
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else {
      await logAdminAction("update_vendor", "prestataires", id, updates);
      toast({ title: "Succès", description: "Prestataire mis à jour." });
      fetchData();
    }
  };

  const deleteVendor = async (id: string) => {
    const { error } = await supabase.from("prestataires").delete().eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else {
      await logAdminAction("delete_vendor", "prestataires", id);
      toast({ title: "Supprimé" });
      fetchData();
    }
  };

  const changeSubscription = async (prestaId: string, newType: string) => {
    const { error } = await supabase.from("abonnements").update({ type: newType as any }).eq("prestataire_id", prestaId).eq("actif", true);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else {
      await logAdminAction("change_subscription", "abonnements", prestaId, { type: newType });
      toast({ title: "Abonnement mis à jour" });
      fetchData();
    }
  };

  const saveEdit = async () => {
    if (!editVendor) return;
    await updateVendor(editVendor.id, editForm);
    setEditVendor(null);
  };

  const addVendor = async () => {
    if (!addForm.nom_entreprise.trim()) return;
    const { error } = await supabase.rpc("admin_import_prestataire" as any, {
      _nom_entreprise: addForm.nom_entreprise,
      _ville: addForm.ville || null,
      _pays: addForm.pays || "France",
      _description: addForm.description || null,
      _telephone: addForm.telephone || null,
      _categorie_id: addForm.categorie_id || null,
    });
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else {
      await logAdminAction("add_vendor", "prestataires");
      toast({ title: "Prestataire ajouté" });
      setAddOpen(false);
      setAddForm({ nom_entreprise: "", ville: "", pays: "France", telephone: "", description: "", categorie_id: "" });
      fetchData();
    }
  };

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = { actif: "bg-green-500/20 text-green-400", en_attente: "bg-yellow-500/20 text-yellow-400", suspendu: "bg-red-500/20 text-red-400" };
    return <Badge className={`${colors[s] || ""} border-0`}>{s}</Badge>;
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-champagne" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-champagne">Prestataires</h1>
        <Button onClick={() => setAddOpen(true)} className="bg-champagne text-chocolate hover:bg-champagne/90">
          <Plus size={16} className="mr-1" /> Ajouter
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-[#1a1a2e] border-champagne/20 text-ivory placeholder:text-ivory/40" />
        <Select value={filterCity} onValueChange={setFilterCity}>
          <SelectTrigger className="bg-[#1a1a2e] border-champagne/20 text-ivory"><SelectValue placeholder="Ville" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Toutes les villes</SelectItem>{cities.map((c) => <SelectItem key={c} value={c!}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="bg-[#1a1a2e] border-champagne/20 text-ivory"><SelectValue placeholder="Catégorie" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Toutes</SelectItem>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="bg-[#1a1a2e] border-champagne/20 text-ivory"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tous</SelectItem><SelectItem value="actif">Actif</SelectItem><SelectItem value="en_attente">En attente</SelectItem><SelectItem value="suspendu">Suspendu</SelectItem></SelectContent>
        </Select>
        <Select value={filterSub} onValueChange={setFilterSub}>
          <SelectTrigger className="bg-[#1a1a2e] border-champagne/20 text-ivory"><SelectValue placeholder="Abonnement" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tous</SelectItem><SelectItem value="gratuit">Gratuit</SelectItem><SelectItem value="pro">Pro</SelectItem><SelectItem value="premium">Premium</SelectItem><SelectItem value="elite">Elite</SelectItem></SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-champagne/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-champagne/10 hover:bg-transparent">
              <TableHead className="text-champagne/70">Nom</TableHead>
              <TableHead className="text-champagne/70">Ville</TableHead>
              <TableHead className="text-champagne/70">Catégorie</TableHead>
              <TableHead className="text-champagne/70">Statut</TableHead>
              <TableHead className="text-champagne/70">Abo</TableHead>
              <TableHead className="text-champagne/70 cursor-pointer" onClick={() => setSortAsc(!sortAsc)}>
                <span className="flex items-center gap-1">Date <ArrowUpDown size={14} /></span>
              </TableHead>
              <TableHead className="text-champagne/70">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((v) => (
              <TableRow key={v.id} className="border-champagne/10 hover:bg-white/5">
                <TableCell className="text-ivory font-medium">{v.nom_entreprise}</TableCell>
                <TableCell className="text-ivory/70">{v.ville || "—"}</TableCell>
                <TableCell className="text-ivory/70">{v.category_name || "—"}</TableCell>
                <TableCell>{statusBadge(v.statut)}</TableCell>
                <TableCell>
                  <Select value={v.subscription_type} onValueChange={(val) => changeSubscription(v.id, val)}>
                    <SelectTrigger className="w-24 h-7 text-xs bg-transparent border-champagne/20 text-ivory"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="gratuit">Gratuit</SelectItem><SelectItem value="pro">Pro</SelectItem><SelectItem value="premium">Premium</SelectItem><SelectItem value="elite">Elite</SelectItem></SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-ivory/50 text-xs">{new Date(v.created_at).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-champagne" onClick={() => { setEditVendor(v); setEditForm({ statut: v.statut }); }}>
                      <Pencil size={14} />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-yellow-400" onClick={() => updateVendor(v.id, { statut: v.statut === "suspendu" ? "actif" : "suspendu" })}>
                      {v.statut === "suspendu" ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-red-400"><Trash2 size={14} /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer {v.nom_entreprise} ?</AlertDialogTitle>
                          <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteVendor(v.id)} className="bg-red-600">Supprimer</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-ivory/40 py-8">Aucun prestataire trouvé.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editVendor} onOpenChange={(o) => !o && setEditVendor(null)}>
        <DialogContent className="bg-[#1a1a2e] border-champagne/20 text-ivory">
          <DialogHeader><DialogTitle className="text-champagne">Modifier {editVendor?.nom_entreprise}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Select value={editForm.statut || ""} onValueChange={(v) => setEditForm({ ...editForm, statut: v })}>
              <SelectTrigger className="bg-[#0f0f23] border-champagne/20 text-ivory"><SelectValue placeholder="Statut" /></SelectTrigger>
              <SelectContent><SelectItem value="actif">Actif</SelectItem><SelectItem value="en_attente">En attente</SelectItem><SelectItem value="suspendu">Suspendu</SelectItem></SelectContent>
            </Select>
            <Button onClick={saveEdit} className="w-full bg-champagne text-chocolate">Enregistrer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-[#1a1a2e] border-champagne/20 text-ivory">
          <DialogHeader><DialogTitle className="text-champagne">Ajouter un prestataire</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nom entreprise *" value={addForm.nom_entreprise} onChange={(e) => setAddForm({ ...addForm, nom_entreprise: e.target.value })} className="bg-[#0f0f23] border-champagne/20 text-ivory" />
            <Input placeholder="Ville" value={addForm.ville} onChange={(e) => setAddForm({ ...addForm, ville: e.target.value })} className="bg-[#0f0f23] border-champagne/20 text-ivory" />
            <Input placeholder="Pays" value={addForm.pays} onChange={(e) => setAddForm({ ...addForm, pays: e.target.value })} className="bg-[#0f0f23] border-champagne/20 text-ivory" />
            <Input placeholder="Téléphone" value={addForm.telephone} onChange={(e) => setAddForm({ ...addForm, telephone: e.target.value })} className="bg-[#0f0f23] border-champagne/20 text-ivory" />
            <Select value={addForm.categorie_id} onValueChange={(v) => setAddForm({ ...addForm, categorie_id: v })}>
              <SelectTrigger className="bg-[#0f0f23] border-champagne/20 text-ivory"><SelectValue placeholder="Catégorie" /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
            <Textarea placeholder="Description" value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} className="bg-[#0f0f23] border-champagne/20 text-ivory" />
            <Button onClick={addVendor} className="w-full bg-champagne text-chocolate">Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

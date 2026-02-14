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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil, Trash2, Ban, CheckCircle2, ArrowUpDown, Plus, Crown, Star, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logAdminAction } from "@/hooks/use-admin-log";

const BADGE_TYPES = ["FOUNDER", "VIP", "AMBASSADOR", "PREMIUM", "FREE"] as const;
const BADGE_COLORS: Record<string, string> = {
  FOUNDER: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  VIP: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  AMBASSADOR: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  PREMIUM: "bg-champagne/20 text-champagne border-champagne/30",
  FREE: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

type Vendor = {
  id: string;
  nom_entreprise: string;
  ville: string | null;
  pays: string | null;
  statut: string;
  telephone: string | null;
  description: string | null;
  description_fr: string | null;
  description_en: string | null;
  photo_url: string | null;
  email: string | null;
  instagram: string | null;
  whatsapp: string | null;
  site_web: string | null;
  categorie_id: string | null;
  badge_type: string | null;
  free_until: string | null;
  is_featured: boolean | null;
  is_lifetime_featured: boolean | null;
  priority_score: number | null;
  import_batch: string | null;
  created_at: string;
  category_name?: string;
};

type Category = { id: string; name: string };

export default function AdminVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBadge, setFilterBadge] = useState("all");
  const [sortAsc, setSortAsc] = useState(false);
  const [editVendor, setEditVendor] = useState<Vendor | null>(null);
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    nom_entreprise: "", ville: "", pays: "France", telephone: "", description_fr: "", description_en: "",
    categorie_id: "", photo_url: "", email: "", instagram: "", whatsapp: "", site_web: "",
    badge_type: "FREE", free_until: "", is_featured: false, is_lifetime_featured: false, priority_score: "0",
  });
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const [vRes, cRes] = await Promise.all([
      (supabase as any).from("prestataires").select("id, nom_entreprise, ville, pays, statut, telephone, description, description_fr, description_en, photo_url, email, instagram, whatsapp, site_web, categorie_id, badge_type, free_until, is_featured, is_lifetime_featured, priority_score, import_batch, created_at").order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name").order("name"),
    ]);
    const catMap: Record<string, string> = {};
    (cRes.data ?? []).forEach((c) => { catMap[c.id] = c.name; });
    setVendors((vRes.data ?? []).map((v: any) => ({ ...v, category_name: v.categorie_id ? catMap[v.categorie_id] : undefined })));
    setCategories(cRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const cities = useMemo(() => [...new Set(vendors.map((v) => v.ville).filter(Boolean))].sort(), [vendors]);
  const countries = useMemo(() => [...new Set(vendors.map((v) => v.pays).filter(Boolean))].sort(), [vendors]);

  const filtered = useMemo(() => {
    let result = vendors;
    if (search) result = result.filter((v) => v.nom_entreprise.toLowerCase().includes(search.toLowerCase()));
    if (filterCity !== "all") result = result.filter((v) => v.ville === filterCity);
    if (filterCountry !== "all") result = result.filter((v) => v.pays === filterCountry);
    if (filterCategory !== "all") result = result.filter((v) => v.categorie_id === filterCategory);
    if (filterStatus !== "all") result = result.filter((v) => v.statut === filterStatus);
    if (filterBadge !== "all") result = result.filter((v) => v.badge_type === filterBadge);
    if (sortAsc) result = [...result].reverse();
    return result;
  }, [vendors, search, filterCity, filterCountry, filterCategory, filterStatus, filterBadge, sortAsc]);

  const updateVendor = async (id: string, updates: Record<string, unknown>) => {
    const { error } = await supabase.rpc("admin_update_prestataire", { _prestataire_id: id, _updates: updates as any });
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
    else { await logAdminAction("delete_vendor", "prestataires", id); toast({ title: "Supprimé" }); fetchData(); }
  };

  const saveEdit = async () => {
    if (!editVendor) return;
    await updateVendor(editVendor.id, editForm);
    setEditVendor(null);
  };

  const addVendor = async () => {
    if (!addForm.nom_entreprise.trim()) return;
    const { error } = await (supabase as any).rpc("admin_import_prestataire", {
      _nom_entreprise: addForm.nom_entreprise,
      _ville: addForm.ville || null, _pays: addForm.pays || "France",
      _description_fr: addForm.description_fr || null, _description_en: addForm.description_en || null,
      _telephone: addForm.telephone || null, _categorie_id: addForm.categorie_id || null,
      _photo_url: addForm.photo_url || null, _email: addForm.email || null,
      _instagram: addForm.instagram || null, _whatsapp: addForm.whatsapp || null,
      _site_web: addForm.site_web || null, _badge_type: addForm.badge_type || "FREE",
      _free_until: addForm.free_until || null,
      _is_featured: addForm.is_featured, _is_lifetime_featured: addForm.is_lifetime_featured,
      _priority_score: parseInt(addForm.priority_score) || 0,
      _statut: addForm.photo_url ? "actif" : "draft",
    });
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else {
      await logAdminAction("add_vendor", "prestataires");
      toast({ title: "Prestataire ajouté" });
      setAddOpen(false);
      fetchData();
    }
  };

  const openEdit = (v: Vendor) => {
    setEditVendor(v);
    setEditForm({
      statut: v.statut, nom_entreprise: v.nom_entreprise, ville: v.ville || "",
      pays: v.pays || "", telephone: v.telephone || "", description_fr: v.description_fr || "",
      description_en: v.description_en || "", photo_url: v.photo_url || "", email: v.email || "",
      instagram: v.instagram || "", whatsapp: v.whatsapp || "", site_web: v.site_web || "",
      badge_type: v.badge_type || "FREE", free_until: v.free_until || "",
      is_featured: v.is_featured ?? false, is_lifetime_featured: v.is_lifetime_featured ?? false,
      priority_score: String(v.priority_score ?? 0),
    });
  };

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = { actif: "bg-green-500/20 text-green-400", en_attente: "bg-yellow-500/20 text-yellow-400", suspendu: "bg-red-500/20 text-red-400", draft: "bg-gray-500/20 text-gray-400" };
    return <Badge className={`${colors[s] || ""} border-0`}>{s}</Badge>;
  };

  const badgeBadge = (b: string | null) => {
    const type = b || "FREE";
    const icon = type === "FOUNDER" ? <Crown size={12} /> : type === "VIP" ? <Star size={12} /> : type === "AMBASSADOR" ? <Award size={12} /> : null;
    return <Badge className={`${BADGE_COLORS[type] || ""} gap-1`}>{icon}{type}</Badge>;
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-champagne" /></div>;

  const inputClass = "bg-[#0f0f23] border-champagne/20 text-ivory";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-champagne">Prestataires ({vendors.length})</h1>
        <Button onClick={() => setAddOpen(true)} className="bg-champagne text-chocolate hover:bg-champagne/90"><Plus size={16} className="mr-1" /> Ajouter</Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
        <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-[#1a1a2e] border-champagne/20 text-ivory placeholder:text-ivory/40" />
        <Select value={filterCountry} onValueChange={setFilterCountry}>
          <SelectTrigger className="bg-[#1a1a2e] border-champagne/20 text-ivory"><SelectValue placeholder="Pays" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tous les pays</SelectItem>{countries.map((c) => <SelectItem key={c} value={c!}>{c}</SelectItem>)}</SelectContent>
        </Select>
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
          <SelectContent><SelectItem value="all">Tous</SelectItem><SelectItem value="actif">Actif</SelectItem><SelectItem value="en_attente">En attente</SelectItem><SelectItem value="suspendu">Suspendu</SelectItem><SelectItem value="draft">Brouillon</SelectItem></SelectContent>
        </Select>
        <Select value={filterBadge} onValueChange={setFilterBadge}>
          <SelectTrigger className="bg-[#1a1a2e] border-champagne/20 text-ivory"><SelectValue placeholder="Badge" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tous badges</SelectItem>{BADGE_TYPES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-champagne/10 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-champagne/10 hover:bg-transparent">
              <TableHead className="text-champagne/70">Photo</TableHead>
              <TableHead className="text-champagne/70">Nom</TableHead>
              <TableHead className="text-champagne/70">Pays/Ville</TableHead>
              <TableHead className="text-champagne/70">Catégorie</TableHead>
              <TableHead className="text-champagne/70">Statut</TableHead>
              <TableHead className="text-champagne/70">Badge</TableHead>
              <TableHead className="text-champagne/70">Score</TableHead>
              <TableHead className="text-champagne/70 cursor-pointer" onClick={() => setSortAsc(!sortAsc)}>
                <span className="flex items-center gap-1">Date <ArrowUpDown size={14} /></span>
              </TableHead>
              <TableHead className="text-champagne/70">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((v) => (
              <TableRow key={v.id} className="border-champagne/10 hover:bg-white/5">
                <TableCell>
                  {v.photo_url ? (
                    <img src={v.photo_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 text-xs">!</div>
                  )}
                </TableCell>
                <TableCell className="text-ivory font-medium">{v.nom_entreprise}</TableCell>
                <TableCell className="text-ivory/70 text-xs">{v.pays || "—"}<br/>{v.ville || ""}</TableCell>
                <TableCell className="text-ivory/70 text-xs">{v.category_name || "—"}</TableCell>
                <TableCell>{statusBadge(v.statut)}</TableCell>
                <TableCell>{badgeBadge(v.badge_type)}</TableCell>
                <TableCell className="text-ivory/50 text-xs">{v.priority_score ?? 0}</TableCell>
                <TableCell className="text-ivory/50 text-xs">{new Date(v.created_at).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-champagne" onClick={() => openEdit(v)}>
                      <Pencil size={14} />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-yellow-400" onClick={() => updateVendor(v.id, { statut: v.statut === "suspendu" ? "actif" : "suspendu" })}>
                      {v.statut === "suspendu" ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-red-400"><Trash2 size={14} /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Supprimer {v.nom_entreprise} ?</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => deleteVendor(v.id)} className="bg-red-600">Supprimer</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center text-ivory/40 py-8">Aucun prestataire trouvé.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editVendor} onOpenChange={(o) => !o && setEditVendor(null)}>
        <DialogContent className="bg-[#1a1a2e] border-champagne/20 text-ivory max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-champagne">Modifier {editVendor?.nom_entreprise}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-ivory/60 text-xs">Nom entreprise</Label>
              <Input value={editForm.nom_entreprise || ""} onChange={(e) => setEditForm({ ...editForm, nom_entreprise: e.target.value })} className={inputClass} />
            </div>
            <div>
              <Label className="text-ivory/60 text-xs">Pays</Label>
              <Input value={editForm.pays || ""} onChange={(e) => setEditForm({ ...editForm, pays: e.target.value })} className={inputClass} />
            </div>
            <div>
              <Label className="text-ivory/60 text-xs">Ville</Label>
              <Input value={editForm.ville || ""} onChange={(e) => setEditForm({ ...editForm, ville: e.target.value })} className={inputClass} />
            </div>
            <div>
              <Label className="text-ivory/60 text-xs">Photo URL *</Label>
              <Input value={editForm.photo_url || ""} onChange={(e) => setEditForm({ ...editForm, photo_url: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
            <div>
              <Label className="text-ivory/60 text-xs">Email</Label>
              <Input value={editForm.email || ""} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className={inputClass} />
            </div>
            <div>
              <Label className="text-ivory/60 text-xs">Téléphone</Label>
              <Input value={editForm.telephone || ""} onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })} className={inputClass} />
            </div>
            <div>
              <Label className="text-ivory/60 text-xs">WhatsApp</Label>
              <Input value={editForm.whatsapp || ""} onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })} className={inputClass} />
            </div>
            <div>
              <Label className="text-ivory/60 text-xs">Instagram</Label>
              <Input value={editForm.instagram || ""} onChange={(e) => setEditForm({ ...editForm, instagram: e.target.value })} className={inputClass} />
            </div>
            <div>
              <Label className="text-ivory/60 text-xs">Site web</Label>
              <Input value={editForm.site_web || ""} onChange={(e) => setEditForm({ ...editForm, site_web: e.target.value })} className={inputClass} />
            </div>
            <div>
              <Label className="text-ivory/60 text-xs">Statut</Label>
              <Select value={editForm.statut || ""} onValueChange={(v) => setEditForm({ ...editForm, statut: v })}>
                <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="actif">Actif</SelectItem><SelectItem value="en_attente">En attente</SelectItem><SelectItem value="suspendu">Suspendu</SelectItem><SelectItem value="draft">Brouillon</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-ivory/60 text-xs">Badge</Label>
              <Select value={editForm.badge_type || "FREE"} onValueChange={(v) => {
                const updates: any = { badge_type: v };
                if (v === "FOUNDER" || v === "VIP") { updates.is_lifetime_featured = true; }
                setEditForm({ ...editForm, ...updates });
              }}>
                <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                <SelectContent>{BADGE_TYPES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-ivory/60 text-xs">Premium gratuit jusqu'au</Label>
              <Input type="date" value={editForm.free_until || ""} onChange={(e) => setEditForm({ ...editForm, free_until: e.target.value })} className={inputClass} />
            </div>
            <div>
              <Label className="text-ivory/60 text-xs">Priority Score</Label>
              <Input type="number" value={editForm.priority_score ?? "0"} onChange={(e) => setEditForm({ ...editForm, priority_score: e.target.value })} className={inputClass} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={editForm.is_featured ?? false} onCheckedChange={(v) => setEditForm({ ...editForm, is_featured: v })} />
              <Label className="text-ivory/60 text-xs">Featured</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={editForm.is_lifetime_featured ?? false} onCheckedChange={(v) => setEditForm({ ...editForm, is_lifetime_featured: v })} />
              <Label className="text-ivory/60 text-xs">Lifetime Featured</Label>
            </div>
            <div className="col-span-2">
              <Label className="text-ivory/60 text-xs">Description FR</Label>
              <Textarea value={editForm.description_fr || ""} onChange={(e) => setEditForm({ ...editForm, description_fr: e.target.value })} className={inputClass} rows={3} />
            </div>
            <div className="col-span-2">
              <Label className="text-ivory/60 text-xs">Description EN</Label>
              <Textarea value={editForm.description_en || ""} onChange={(e) => setEditForm({ ...editForm, description_en: e.target.value })} className={inputClass} rows={3} />
            </div>
            <Button onClick={saveEdit} className="col-span-2 bg-champagne text-chocolate">Enregistrer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-[#1a1a2e] border-champagne/20 text-ivory max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-champagne">Ajouter un prestataire</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Nom entreprise *" value={addForm.nom_entreprise} onChange={(e) => setAddForm({ ...addForm, nom_entreprise: e.target.value })} className={inputClass} />
            <Input placeholder="Photo URL *" value={addForm.photo_url} onChange={(e) => setAddForm({ ...addForm, photo_url: e.target.value })} className={inputClass} />
            <Input placeholder="Pays" value={addForm.pays} onChange={(e) => setAddForm({ ...addForm, pays: e.target.value })} className={inputClass} />
            <Input placeholder="Ville" value={addForm.ville} onChange={(e) => setAddForm({ ...addForm, ville: e.target.value })} className={inputClass} />
            <Input placeholder="Email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} className={inputClass} />
            <Input placeholder="Téléphone" value={addForm.telephone} onChange={(e) => setAddForm({ ...addForm, telephone: e.target.value })} className={inputClass} />
            <Input placeholder="WhatsApp" value={addForm.whatsapp} onChange={(e) => setAddForm({ ...addForm, whatsapp: e.target.value })} className={inputClass} />
            <Input placeholder="Instagram" value={addForm.instagram} onChange={(e) => setAddForm({ ...addForm, instagram: e.target.value })} className={inputClass} />
            <Input placeholder="Site web" value={addForm.site_web} onChange={(e) => setAddForm({ ...addForm, site_web: e.target.value })} className={inputClass} />
            <Select value={addForm.categorie_id} onValueChange={(v) => setAddForm({ ...addForm, categorie_id: v })}>
              <SelectTrigger className={inputClass}><SelectValue placeholder="Catégorie" /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={addForm.badge_type} onValueChange={(v) => setAddForm({ ...addForm, badge_type: v, is_lifetime_featured: v === "FOUNDER" || v === "VIP" })}>
              <SelectTrigger className={inputClass}><SelectValue placeholder="Badge" /></SelectTrigger>
              <SelectContent>{BADGE_TYPES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="date" placeholder="Free until" value={addForm.free_until} onChange={(e) => setAddForm({ ...addForm, free_until: e.target.value })} className={inputClass} />
            <Textarea placeholder="Description FR" value={addForm.description_fr} onChange={(e) => setAddForm({ ...addForm, description_fr: e.target.value })} className={`${inputClass} col-span-2`} rows={3} />
            <Textarea placeholder="Description EN" value={addForm.description_en} onChange={(e) => setAddForm({ ...addForm, description_en: e.target.value })} className={`${inputClass} col-span-2`} rows={3} />
            <Button onClick={addVendor} className="col-span-2 bg-champagne text-chocolate">Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

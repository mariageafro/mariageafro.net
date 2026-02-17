import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, CreditCard, Ban, CheckCircle2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logAdminAction } from "@/hooks/use-admin-log";

const SUB_TYPES = ["gratuit", "pro", "premium", "elite"] as const;
const SUB_COLORS: Record<string, string> = {
  gratuit: "bg-gray-500/20 text-gray-400",
  pro: "bg-blue-500/20 text-blue-300",
  premium: "bg-champagne/20 text-champagne",
  elite: "bg-purple-500/20 text-purple-300",
};

type SubRow = {
  id: string;
  prestataire_id: string;
  type: string;
  actif: boolean;
  prix: number | null;
  date_debut: string;
  date_fin: string | null;
  stripe_subscription_id: string | null;
  nom_entreprise?: string;
};

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterActive, setFilterActive] = useState("all");
  const [editSub, setEditSub] = useState<SubRow | null>(null);
  const [editType, setEditType] = useState("gratuit");
  const { toast } = useToast();

  const fetchSubs = async () => {
    setLoading(true);
    const [subRes, prestaRes] = await Promise.all([
      supabase.from("abonnements").select("*").order("created_at", { ascending: false }),
      supabase.from("prestataires").select("id, nom_entreprise"),
    ]);
    const nameMap: Record<string, string> = {};
    (prestaRes.data ?? []).forEach((p) => { nameMap[p.id] = p.nom_entreprise; });
    setSubs((subRes.data ?? []).map((s) => ({ ...s, nom_entreprise: nameMap[s.prestataire_id] })));
    setLoading(false);
  };

  useEffect(() => { fetchSubs(); }, []);

  const filtered = useMemo(() => {
    let result = subs;
    if (search) result = result.filter((s) => (s.nom_entreprise || "").toLowerCase().includes(search.toLowerCase()));
    if (filterType !== "all") result = result.filter((s) => s.type === filterType);
    if (filterActive === "active") result = result.filter((s) => s.actif);
    if (filterActive === "inactive") result = result.filter((s) => !s.actif);
    return result;
  }, [subs, search, filterType, filterActive]);

  const toggleActive = async (sub: SubRow) => {
    const { error } = await supabase.from("abonnements").update({ actif: !sub.actif }).eq("id", sub.id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else {
      await logAdminAction(sub.actif ? "deactivate_subscription" : "activate_subscription", "abonnements", sub.id);
      toast({ title: sub.actif ? "Abonnement désactivé" : "Abonnement activé" });
      fetchSubs();
    }
  };

  const changeType = async () => {
    if (!editSub) return;
    const { error } = await supabase.from("abonnements").update({ type: editType as any }).eq("id", editSub.id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else {
      await logAdminAction("change_subscription_type", "abonnements", editSub.id, { new_type: editType });
      toast({ title: "Type d'abonnement modifié" });
      setEditSub(null);
      fetchSubs();
    }
  };

  const deleteSub = async (id: string) => {
    const { error } = await supabase.from("abonnements").delete().eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else {
      await logAdminAction("delete_subscription", "abonnements", id);
      toast({ title: "Abonnement supprimé" });
      fetchSubs();
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-champagne" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-champagne">Abonnements ({subs.length})</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <Input placeholder="Rechercher prestataire..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-[#1a1a2e] border-champagne/20 text-ivory placeholder:text-ivory/40" />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="bg-[#1a1a2e] border-champagne/20 text-ivory"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {SUB_TYPES.map((t) => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterActive} onValueChange={setFilterActive}>
          <SelectTrigger className="bg-[#1a1a2e] border-champagne/20 text-ivory"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="inactive">Inactifs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-champagne/10 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-champagne/10 hover:bg-transparent">
              <TableHead className="text-champagne/70">Prestataire</TableHead>
              <TableHead className="text-champagne/70">Type</TableHead>
              <TableHead className="text-champagne/70">Statut</TableHead>
              <TableHead className="text-champagne/70">Prix</TableHead>
              <TableHead className="text-champagne/70">Début</TableHead>
              <TableHead className="text-champagne/70">Fin</TableHead>
              <TableHead className="text-champagne/70">Stripe</TableHead>
              <TableHead className="text-champagne/70">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id} className="border-champagne/10 hover:bg-white/5">
                <TableCell className="text-ivory font-medium text-sm">{s.nom_entreprise || "—"}</TableCell>
                <TableCell><Badge className={`${SUB_COLORS[s.type] || ""} border-0`}>{s.type}</Badge></TableCell>
                <TableCell>
                  <Badge className={s.actif ? "bg-green-500/20 text-green-400 border-0" : "bg-red-500/20 text-red-400 border-0"}>
                    {s.actif ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-ivory/50 text-sm">{s.prix != null ? `${s.prix}€` : "—"}</TableCell>
                <TableCell className="text-ivory/50 text-xs">{new Date(s.date_debut).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell className="text-ivory/50 text-xs">{s.date_fin ? new Date(s.date_fin).toLocaleDateString("fr-FR") : "—"}</TableCell>
                <TableCell className="text-ivory/30 text-xs font-mono truncate max-w-[100px]">{s.stripe_subscription_id || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-champagne" onClick={() => { setEditSub(s); setEditType(s.type); }} title="Changer type">
                      <Pencil size={14} />
                    </Button>
                    <Button size="icon" variant="ghost" className={`h-8 w-8 ${s.actif ? "text-ivory/60 hover:text-red-400" : "text-ivory/60 hover:text-green-400"}`} onClick={() => toggleActive(s)} title={s.actif ? "Désactiver" : "Activer"}>
                      {s.actif ? <Ban size={14} /> : <CheckCircle2 size={14} />}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-red-400"><CreditCard size={14} /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cet abonnement ?</AlertDialogTitle>
                          <AlertDialogDescription>L'abonnement de {s.nom_entreprise} sera supprimé.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteSub(s.id)} className="bg-red-600">Supprimer</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center text-ivory/40 py-8">
                <CreditCard size={32} className="mx-auto mb-2 opacity-30" />
                Aucun abonnement trouvé.
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Change Type Dialog */}
      <Dialog open={!!editSub} onOpenChange={(o) => !o && setEditSub(null)}>
        <DialogContent className="bg-[#1a1a2e] border-champagne/20 text-ivory">
          <DialogHeader><DialogTitle className="text-champagne">Modifier l'abonnement de {editSub?.nom_entreprise}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Select value={editType} onValueChange={setEditType}>
              <SelectTrigger className="bg-[#0f0f23] border-champagne/20 text-ivory"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SUB_TYPES.map((t) => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={changeType} className="w-full bg-champagne text-chocolate">Enregistrer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

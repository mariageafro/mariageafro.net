import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Trash2, ShieldCheck, ShieldOff, UserX, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logAdminAction } from "@/hooks/use-admin-log";

type UserRow = {
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  role: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("user_id, email, first_name, last_name, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const rolesMap: Record<string, string> = {};
    (rolesRes.data ?? []).forEach((r) => { rolesMap[r.user_id] = r.role; });
    setUsers((profilesRes.data ?? []).map((p) => ({
      ...p,
      role: rolesMap[p.user_id] || "client",
    })));
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = useMemo(() => {
    let result = users;
    if (search) result = result.filter((u) =>
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.first_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.last_name || "").toLowerCase().includes(search.toLowerCase())
    );
    if (filterRole !== "all") result = result.filter((u) => u.role === filterRole);
    return result;
  }, [users, search, filterRole]);

  const deleteUser = async (userId: string) => {
    // Delete profile (cascade will handle related data)
    const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else {
      await logAdminAction("delete_user", "profiles", userId);
      toast({ title: "Profil utilisateur supprimé" });
      fetchUsers();
    }
  };

  const toggleSuspend = async (userId: string, currentRole: string) => {
    // For prestataires, suspend their profile
    if (currentRole === "prestataire") {
      const { data: presta } = await supabase.from("prestataires").select("id, statut").eq("user_id", userId).single();
      if (presta) {
        const newStatut = presta.statut === "suspendu" ? "actif" : "suspendu";
        await supabase.rpc("admin_update_prestataire", { _prestataire_id: presta.id, _updates: { statut: newStatut } });
        await logAdminAction(newStatut === "suspendu" ? "suspend_user" : "unsuspend_user", "prestataires", presta.id);
        toast({ title: newStatut === "suspendu" ? "Utilisateur suspendu" : "Utilisateur réactivé" });
        fetchUsers();
      }
    } else {
      toast({ title: "Info", description: "La suspension fonctionne pour les prestataires uniquement." });
    }
  };

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-500/20 text-red-300 border-red-500/30",
      prestataire: "bg-champagne/20 text-champagne border-champagne/30",
      client: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    };
    return <Badge className={`${colors[role] || ""} border`}>{role}</Badge>;
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-champagne" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-champagne">Utilisateurs ({users.length})</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <Input placeholder="Rechercher nom ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-[#1a1a2e] border-champagne/20 text-ivory placeholder:text-ivory/40" />
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="bg-[#1a1a2e] border-champagne/20 text-ivory"><SelectValue placeholder="Rôle" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="prestataire">Prestataire</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-champagne/10 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-champagne/10 hover:bg-transparent">
              <TableHead className="text-champagne/70">Email</TableHead>
              <TableHead className="text-champagne/70">Nom</TableHead>
              <TableHead className="text-champagne/70">Rôle</TableHead>
              <TableHead className="text-champagne/70">Inscription</TableHead>
              <TableHead className="text-champagne/70">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.user_id} className="border-champagne/10 hover:bg-white/5">
                <TableCell className="text-ivory text-sm">{u.email || "—"}</TableCell>
                <TableCell className="text-ivory/70 text-sm">{[u.first_name, u.last_name].filter(Boolean).join(" ") || "—"}</TableCell>
                <TableCell>{roleBadge(u.role)}</TableCell>
                <TableCell className="text-ivory/50 text-xs">{new Date(u.created_at).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {u.role !== "admin" && (
                      <>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-yellow-400" onClick={() => toggleSuspend(u.user_id, u.role)} title="Suspendre/Réactiver">
                          <ShieldOff size={14} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-ivory/60 hover:text-red-400"><Trash2 size={14} /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
                              <AlertDialogDescription>Le profil sera supprimé. Cette action est irréversible.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteUser(u.user_id)} className="bg-red-600">Supprimer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                    {u.role === "admin" && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 border text-xs">
                        <ShieldCheck size={12} className="mr-1" /> Protégé
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-ivory/40 py-8">
                <Users size={32} className="mx-auto mb-2 opacity-30" />
                Aucun utilisateur trouvé.
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

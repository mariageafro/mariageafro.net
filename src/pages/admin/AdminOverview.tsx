import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, Clock, Star, FolderTree, Globe, CreditCard, UserCog } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [prestaRes, reviewsRes, catRes, countryRes, usersRes, subsRes] = await Promise.all([
        supabase.from("prestataires").select("statut"),
        supabase.from("avis").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("countries").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("abonnements").select("actif"),
      ]);
      const all = prestaRes.data ?? [];
      const allSubs = subsRes.data ?? [];
      setStats({
        total: all.length,
        actif: all.filter((p) => p.statut === "actif").length,
        en_attente: all.filter((p) => p.statut === "en_attente").length,
        avis: reviewsRes.count ?? 0,
        categories: catRes.count ?? 0,
        countries: countryRes.count ?? 0,
        users: usersRes.count ?? 0,
        subs_active: allSubs.filter((s) => s.actif).length,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-champagne" /></div>;

  const cards = [
    { label: "Total prestataires", value: stats.total, icon: Users, color: "text-blue-400" },
    { label: "Actifs", value: stats.actif, icon: CheckCircle2, color: "text-green-400" },
    { label: "En attente", value: stats.en_attente, icon: Clock, color: "text-yellow-400" },
    { label: "Utilisateurs", value: stats.users, icon: UserCog, color: "text-indigo-400" },
    { label: "Abonnements actifs", value: stats.subs_active, icon: CreditCard, color: "text-emerald-400" },
    { label: "Avis", value: stats.avis, icon: Star, color: "text-champagne" },
    { label: "Catégories", value: stats.categories, icon: FolderTree, color: "text-purple-400" },
    { label: "Pays", value: stats.countries, icon: Globe, color: "text-cyan-400" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-serif text-champagne mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="bg-[#1a1a2e] border-champagne/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <c.icon className={`h-6 w-6 ${c.color}`} />
                <div>
                  <p className="text-2xl font-serif font-bold text-ivory">{c.value}</p>
                  <p className="text-xs text-ivory/50 font-body">{c.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

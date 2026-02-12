import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, XCircle, Users, Shield, Star, Plus, Trash2, ArrowUp, ArrowDown, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PendingPrestataire = {
  id: string;
  nom_entreprise: string;
  ville: string | null;
  pays: string | null;
  statut: string;
  created_at: string;
  user_id: string;
};

type Review = {
  id: string;
  commentaire: string | null;
  note: number;
  approved: boolean;
  created_at: string;
  prestataire_id: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
};

type Country = {
  id: string;
  name: string;
  code: string;
  flag_emoji: string | null;
  priority: number | null;
};

export default function AdminDashboard() {
  const [prestataires, setPrestataires] = useState<PendingPrestataire[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, active: 0, reviews: 0 });
  const [newCatName, setNewCatName] = useState("");
  const [newCountryName, setNewCountryName] = useState("");
  const [newCountryCode, setNewCountryCode] = useState("");
  const [newCountryEmoji, setNewCountryEmoji] = useState("");
  const { toast } = useToast();

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [prestaRes, reviewsRes, statsRes, catRes, countryRes] = await Promise.all([
      supabase.from("prestataires").select("id, nom_entreprise, ville, pays, statut, created_at, user_id").order("created_at", { ascending: false }),
      supabase.from("avis").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("prestataires").select("statut"),
      supabase.from("categories").select("*").order("name"),
      supabase.from("countries").select("*").order("priority", { ascending: true }),
    ]);

    setPrestataires(prestaRes.data ?? []);
    setReviews(reviewsRes.data ?? []);
    setCategoriesList(catRes.data ?? []);
    setCountriesList(countryRes.data ?? []);

    const all = statsRes.data ?? [];
    setStats({
      total: all.length,
      pending: all.filter((p) => p.statut === "en_attente").length,
      active: all.filter((p) => p.statut === "actif").length,
      reviews: reviewsRes.data?.length ?? 0,
    });
    setLoading(false);
  };

  const updatePrestataire = async (id: string, updates: Record<string, unknown>) => {
    const { error } = await supabase.from("prestataires").update(updates).eq("id", id);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Succès", description: "Prestataire mis à jour." }); fetchAll(); }
  };

  const approveReview = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("avis").update({ approved }).eq("id", id);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Succès", description: approved ? "Avis approuvé." : "Avis rejeté." }); fetchAll(); }
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    const slug = newCatName.toLowerCase().replace(/[^a-z0-9àâäéèêëïîôùûüÿç]+/g, '-').replace(/(^-|-$)/g, '');
    const { error } = await supabase.from("categories").insert({ name: newCatName.trim(), slug });
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
    else { setNewCatName(""); fetchAll(); }
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
    else fetchAll();
  };

  const addCountry = async () => {
    if (!newCountryName.trim() || !newCountryCode.trim()) return;
    const maxPriority = Math.max(...countriesList.map(c => c.priority ?? 0), 0);
    const { error } = await supabase.from("countries").insert({
      name: newCountryName.trim(),
      code: newCountryCode.trim().toUpperCase(),
      flag_emoji: newCountryEmoji.trim() || "🌍",
      priority: maxPriority + 1,
    });
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
    else { setNewCountryName(""); setNewCountryCode(""); setNewCountryEmoji(""); fetchAll(); }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center pt-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const pending = prestataires.filter((p) => p.statut === "en_attente");
  const pendingReviews = reviews.filter((r) => !r.approved);

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container-editorial">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif">Administration</h1>
            <p className="text-muted-foreground mt-2">Gérez la plateforme MariageAfro</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total prestataires", value: stats.total, icon: Users },
              { label: "En attente", value: stats.pending, icon: Shield },
              { label: "Actifs", value: stats.active, icon: CheckCircle2 },
              { label: "Avis", value: stats.reviews, icon: Star },
            ].map((s) => (
              <Card key={s.label} className="card-premium">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <s.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-serif font-semibold">{s.value}</p>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-2xl">
              <TabsTrigger value="pending">En attente ({pending.length})</TabsTrigger>
              <TabsTrigger value="all">Tous ({prestataires.length})</TabsTrigger>
              <TabsTrigger value="reviews">Avis ({pendingReviews.length})</TabsTrigger>
              <TabsTrigger value="categories">Catégories</TabsTrigger>
              <TabsTrigger value="countries">Pays</TabsTrigger>
            </TabsList>

            {/* Pending */}
            <TabsContent value="pending" className="space-y-4">
              {pending.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Aucun prestataire en attente.</p>
              ) : pending.map((p) => (
                <Card key={p.id} className="card-premium">
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg">{p.nom_entreprise}</h3>
                      <p className="text-sm text-muted-foreground">{p.ville}{p.pays ? `, ${p.pays}` : ""}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(p.created_at).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updatePrestataire(p.id, { statut: "actif", verified: true })}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Valider
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updatePrestataire(p.id, { statut: "suspendu" })}>
                        <XCircle className="h-4 w-4 mr-1" /> Refuser
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* All */}
            <TabsContent value="all" className="space-y-4">
              {prestataires.map((p) => (
                <Card key={p.id} className="card-premium">
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg">{p.nom_entreprise}</h3>
                      <p className="text-sm text-muted-foreground">{p.ville}{p.pays ? `, ${p.pays}` : ""}</p>
                    </div>
                    <Badge variant={p.statut === "actif" ? "default" : p.statut === "en_attente" ? "secondary" : "destructive"}>
                      {p.statut}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews" className="space-y-4">
              {pendingReviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Aucun avis en attente.</p>
              ) : pendingReviews.map((r) => (
                <Card key={r.id} className="card-premium">
                  <CardContent className="pt-6 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {Array.from({ length: r.note }).map((_, i) => (
                          <Star key={i} size={14} className="text-gold fill-gold" />
                        ))}
                      </div>
                      <p className="font-body text-sm">{r.commentaire || <em className="text-muted-foreground">Pas de commentaire</em>}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => approveReview(r.id, true)}><CheckCircle2 className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => approveReview(r.id, false)}><XCircle className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Categories Management */}
            <TabsContent value="categories" className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Nouvelle catégorie..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCategory()}
                />
                <Button onClick={addCategory}><Plus className="h-4 w-4 mr-1" /> Ajouter</Button>
              </div>
              {categoriesList.map((cat) => (
                <Card key={cat.id} className="card-premium">
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground">/{cat.slug}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => deleteCategory(cat.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Countries Management */}
            <TabsContent value="countries" className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Input placeholder="Nom du pays" value={newCountryName} onChange={(e) => setNewCountryName(e.target.value)} />
                <Input placeholder="Code (FR)" value={newCountryCode} onChange={(e) => setNewCountryCode(e.target.value)} className="w-24" />
                <Input placeholder="Emoji 🇫🇷" value={newCountryEmoji} onChange={(e) => setNewCountryEmoji(e.target.value)} className="w-24" />
                <Button onClick={addCountry}><Plus className="h-4 w-4 mr-1" /> Ajouter</Button>
              </div>
              {countriesList.map((country) => (
                <Card key={country.id} className="card-premium">
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{country.flag_emoji}</span>
                      <div>
                        <h3 className="font-serif text-lg">{country.name}</h3>
                        <p className="text-xs text-muted-foreground">{country.code} · Priorité: {country.priority}</p>
                      </div>
                    </div>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

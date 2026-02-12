import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Users, Shield, Star, Image } from "lucide-react";
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

export default function AdminDashboard() {
  const [prestataires, setPrestataires] = useState<PendingPrestataire[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, active: 0, reviews: 0 });
  const { toast } = useToast();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [prestaRes, reviewsRes, statsRes] = await Promise.all([
      supabase.from("prestataires").select("id, nom_entreprise, ville, pays, statut, created_at, user_id").order("created_at", { ascending: false }),
      supabase.from("avis").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("prestataires").select("statut"),
    ]);

    setPrestataires(prestaRes.data ?? []);
    setReviews(reviewsRes.data ?? []);

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
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Prestataire mis à jour." });
      fetchAll();
    }
  };

  const approveReview = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("avis").update({ approved }).eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: approved ? "Avis approuvé." : "Avis rejeté." });
      fetchAll();
    }
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
            <h1 className="text-3xl md:text-4xl">Administration</h1>
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
            <TabsList className="grid w-full grid-cols-3 max-w-lg">
              <TabsTrigger value="pending">
                En attente ({pending.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                Tous ({prestataires.length})
              </TabsTrigger>
              <TabsTrigger value="reviews">
                Avis ({pendingReviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pending.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Aucun prestataire en attente.</p>
              ) : (
                pending.map((p) => (
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
                ))
              )}
            </TabsContent>

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

            <TabsContent value="reviews" className="space-y-4">
              {pendingReviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Aucun avis en attente de modération.</p>
              ) : (
                pendingReviews.map((r) => (
                  <Card key={r.id} className="card-premium">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {Array.from({ length: r.note }).map((_, i) => (
                              <Star key={i} size={14} className="text-gold fill-gold" />
                            ))}
                          </div>
                          <p className="font-body text-sm">{r.commentaire || <em className="text-muted-foreground">Pas de commentaire</em>}</p>
                          <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleDateString("fr-FR")}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => approveReview(r.id, true)}>
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => approveReview(r.id, false)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

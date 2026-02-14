import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useDayOfTimeline } from "@/hooks/use-day-of-timeline";
import { useAuthContext } from "@/contexts/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Clock, MapPin, User, AlertTriangle, ArrowLeft, Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DayOfTimelinePage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { timeline, items, loading, createTimeline, addItem, updateItem, deleteItem, hasConflict } = useDayOfTimeline();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [address, setAddress] = useState("");
  const [responsible, setResponsible] = useState("");
  const [notes, setNotes] = useState("");

  if (!user) { navigate("/auth"); return null; }

  const handleCreateTimeline = async () => {
    await createTimeline("Jour J");
    toast({ title: "Timeline créée !" });
  };

  const handleAddItem = async () => {
    if (!title.trim() || !startTime) return;
    
    if (hasConflict(startTime, endTime || null)) {
      toast({ title: "⚠️ Conflit horaire détecté", description: "Ce créneau chevauche un élément existant.", variant: "destructive" });
    }

    await addItem({
      title,
      start_time: startTime,
      end_time: endTime || null,
      address: address || null,
      google_maps_link: address ? `https://www.google.com/maps/search/${encodeURIComponent(address)}` : null,
      responsible_person: responsible || null,
      notes: notes || null,
    });
    toast({ title: "Moment ajouté" });
    setTitle(""); setStartTime(""); setEndTime(""); setAddress(""); setResponsible(""); setNotes("");
  };

  const copyShareLink = () => {
    if (!timeline) return;
    const url = `${window.location.origin}/jour-j/${timeline.share_code}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Lien copié !" });
  };

  return (
    <Layout>
      <section className="pt-28 pb-8 bg-gradient-warm">
        <div className="container-editorial">
          <Link to="/mon-mariage" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Tableau de bord
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-chocolate text-3xl md:text-4xl">Timeline Jour J</h1>
            {timeline && (
              <Button variant="outline" size="sm" onClick={copyShareLink} className="font-body text-xs">
                <Share2 size={14} className="mr-1" /> Partager
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-warm !py-8 md:!py-12">
        <div className="container-editorial max-w-4xl space-y-6">

          {loading ? (
            <p className="text-muted-foreground font-body text-center py-8">Chargement...</p>
          ) : !timeline ? (
            <div className="card-premium p-8 text-center space-y-4">
              <Clock className="text-primary mx-auto" size={40} />
              <h3 className="font-serif text-lg text-chocolate">Créez votre timeline du Jour J</h3>
              <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
                Organisez chaque moment de votre journée de mariage, du maquillage au lancer de bouquet.
              </p>
              <Button onClick={handleCreateTimeline} className="btn-gold">
                <Plus size={16} className="mr-1" /> Créer la timeline
              </Button>
            </div>
          ) : (
            <>
              {/* Add item form */}
              <div className="card-premium p-4 md:p-6 space-y-3">
                <h3 className="font-serif text-lg text-chocolate">Ajouter un moment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input placeholder="Titre (ex: Arrivée des mariés)" value={title} onChange={e => setTitle(e.target.value)} />
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs font-body text-muted-foreground">Début</Label>
                      <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs font-body text-muted-foreground">Fin</Label>
                      <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                    </div>
                  </div>
                  <Input placeholder="Adresse" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input placeholder="Personne responsable" value={responsible} onChange={e => setResponsible(e.target.value)} />
                  <Textarea placeholder="Notes..." value={notes} onChange={e => setNotes(e.target.value)} className="min-h-[40px]" />
                </div>
                <Button onClick={handleAddItem} className="btn-gold text-sm"><Plus size={14} className="mr-1" />Ajouter</Button>
              </div>

              {/* Share toggle */}
              <div className="card-premium p-4 flex items-center justify-between">
                <div>
                  <p className="font-body text-sm font-medium text-foreground">Partage public</p>
                  <p className="font-body text-xs text-muted-foreground">
                    Partagez la timeline avec vos invités via un lien unique
                  </p>
                </div>
                <Switch checked={timeline.is_public} onCheckedChange={async (v) => {
                  const { supabase } = await import("@/integrations/supabase/client");
                  await supabase.from("day_of_timeline").update({ is_public: v }).eq("id", timeline.id);
                  // Optimistic update handled by refetch
                }} />
              </div>

              {/* Timeline items */}
              {items.length === 0 ? (
                <p className="text-muted-foreground font-body text-center py-8">Aucun moment ajouté</p>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-champagne/30" />

                  <div className="space-y-4">
                    {items.map((item, i) => {
                      const conflict = item.end_time && items.some((other, j) => {
                        if (j === i || !other.end_time) return false;
                        return item.start_time < other.end_time && (item.end_time || "23:59") > other.start_time;
                      });

                      return (
                        <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`card-premium p-4 ml-10 relative ${conflict ? "border border-destructive/30" : ""}`}>
                          {/* Timeline dot */}
                          <div className="absolute -left-[26px] top-5 w-3 h-3 rounded-full bg-primary border-2 border-background" />

                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-body text-xs font-medium text-primary">
                                  {item.start_time?.slice(0, 5)}{item.end_time ? ` → ${item.end_time.slice(0, 5)}` : ""}
                                </span>
                                {conflict && <AlertTriangle size={12} className="text-destructive" />}
                              </div>
                              <p className="font-body text-sm font-medium text-foreground">{item.title}</p>
                              <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground font-body">
                                {item.address && (
                                  <a href={item.google_maps_link || "#"} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:text-primary transition-colors">
                                    <MapPin size={10} /> {item.address}
                                  </a>
                                )}
                                {item.responsible_person && (
                                  <span className="flex items-center gap-1"><User size={10} /> {item.responsible_person}</span>
                                )}
                              </div>
                              {item.notes && <p className="font-body text-xs text-muted-foreground mt-1.5 italic">{item.notes}</p>}
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => deleteItem(item.id)}>
                              <Trash2 size={12} className="text-destructive" />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}

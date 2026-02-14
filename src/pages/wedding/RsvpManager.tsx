import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuthContext } from "@/contexts/auth-context";
import { useRsvpEvent, useRsvpGuests } from "@/hooks/use-rsvp";
import { useToolTranslations } from "@/hooks/use-tool-translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Link2, Copy, Users, CheckCircle2, XCircle, Clock, CalendarDays, MapPin, Send } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

const GROUPS = ["Famille", "Amis", "Collègues", "Voisins", "Autre"];

export default function RsvpManager() {
  const t = useToolTranslations();
  const { user, isLoading: authLoading } = useAuthContext();
  const { event, loading: eventLoading, upsertEvent } = useRsvpEvent();
  const { guests, loading: guestsLoading, addGuest, deleteGuest, generateLink } = useRsvpGuests(event?.id);
  const { toast } = useToast();

  // Event form
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [deadline, setDeadline] = useState("");

  // Guest form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [group, setGroup] = useState("Autre");
  const [maxCompanions, setMaxCompanions] = useState("0");

  // Link modal
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [sendingReminders, setSendingReminders] = useState(false);

  if (authLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const handleSaveEvent = async () => {
    await upsertEvent({
      title: eventTitle || event?.title || "Notre Mariage",
      event_date: eventDate || event?.event_date || null,
      event_location: eventLocation || event?.event_location || null,
      welcome_message: welcomeMsg || event?.welcome_message || null,
      deadline: deadline || event?.deadline || null,
    });
    toast({ title: "Événement sauvegardé !" });
  };

  const handleAddGuest = async () => {
    if (!firstName.trim()) return;
    await addGuest({ first_name: firstName, last_name: lastName, email, group_name: group, max_companions: parseInt(maxCompanions) || 0 });
    toast({ title: "Invité ajouté !" });
    setFirstName(""); setLastName(""); setEmail(""); setMaxCompanions("0");
  };

  const handleGenerateLink = async (guestId: string) => {
    const link = await generateLink(guestId);
    if (link) {
      const fullUrl = `${window.location.origin}/rsvp/${link}`;
      setGeneratedLink(fullUrl);
    }
  };

  const copyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast({ title: "Lien copié !" });
    }
  };

  const handleSendReminders = async () => {
    if (!event) return;
    setSendingReminders(true);
    try {
      const session = (await (await import("@/integrations/supabase/client")).supabase.auth.getSession()).data.session;
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rsvp-emails`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ action: "send-manual-reminders", event_id: event.id }),
        }
      );
      const data = await res.json();
      if (data.error) {
        toast({ title: "Erreur", description: data.error, variant: "destructive" });
      } else {
        toast({ title: `${data.sent} rappel(s) envoyé(s) !`, description: `Sur ${data.total_pending} invité(s) en attente avec email.` });
      }
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer les rappels", variant: "destructive" });
    } finally {
      setSendingReminders(false);
    }
  };

  const confirmed = guests.filter(g => g.status === "confirmed").length;
  const declined = guests.filter(g => g.status === "declined").length;
  const pending = guests.filter(g => g.status === "pending").length;
  const totalCompanions = guests.filter(g => g.status === "confirmed").reduce((sum, g) => sum + (g.companions?.length || 0), 0);

  return (
    <Layout>
      <section className="pt-28 pb-8 bg-gradient-warm">
        <div className="container-editorial">
          <Link to="/mon-mariage" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
            ← Retour au tableau de bord
          </Link>
          <h1 className="font-serif text-chocolate mt-2 text-3xl md:text-4xl">Gestion RSVP</h1>
        </div>
      </section>

      <section className="section-padding bg-gradient-warm !py-8 md:!py-12">
        <div className="container-editorial max-w-5xl space-y-8">

          {/* KPIs + Reminder Button */}
          {guests.length > 0 && (
            <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="kpi-card">
                <Users size={18} className="text-primary mb-1" />
                <p className="text-xs text-muted-foreground font-body">Total</p>
                <p className="font-serif text-2xl text-foreground">{guests.length}</p>
              </div>
              <div className="kpi-card">
                <CheckCircle2 size={18} className="text-primary mb-1" />
                <p className="text-xs text-muted-foreground font-body">Confirmés</p>
                <p className="font-serif text-2xl text-primary">{confirmed}</p>
              </div>
              <div className="kpi-card">
                <XCircle size={18} className="text-destructive mb-1" />
                <p className="text-xs text-muted-foreground font-body">Déclinés</p>
                <p className="font-serif text-2xl text-destructive">{declined}</p>
              </div>
              <div className="kpi-card">
                <Clock size={18} className="text-accent mb-1" />
                <p className="text-xs text-muted-foreground font-body">En attente</p>
                <p className="font-serif text-2xl text-accent">{pending}</p>
              </div>
              <div className="kpi-card col-span-2 md:col-span-1">
                <Users size={18} className="text-primary mb-1" />
                <p className="text-xs text-muted-foreground font-body">+ Accompagnants</p>
                <p className="font-serif text-2xl text-foreground">{confirmed + totalCompanions}</p>
              </div>
            </div>
            {pending > 0 && (
              <Button onClick={handleSendReminders} disabled={sendingReminders} variant="outline" className="w-full sm:w-auto gap-2">
                <Send size={14} />
                {sendingReminders ? "Envoi en cours..." : `Envoyer un rappel aux ${pending} invité(s) en attente`}
              </Button>
            )}
            </div>
          )}

          {/* Event Config */}
          <div className="card-glass p-4 md:p-6 space-y-4">
            <h2 className="font-serif text-xl text-foreground">Paramètres de l'événement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Titre (ex: Mariage de Ama & Kofi)" value={eventTitle || event?.title || ""} onChange={e => setEventTitle(e.target.value)} />
              <Input type="date" placeholder="Date" value={eventDate || event?.event_date || ""} onChange={e => setEventDate(e.target.value)} />
              <Input placeholder="Lieu" value={eventLocation || event?.event_location || ""} onChange={e => setEventLocation(e.target.value)} />
              <Input type="date" placeholder="Date limite RSVP" value={deadline || event?.deadline || ""} onChange={e => setDeadline(e.target.value)} />
            </div>
            <Textarea placeholder="Message d'accueil pour vos invités..." value={welcomeMsg || event?.welcome_message || ""} onChange={e => setWelcomeMsg(e.target.value)} className="min-h-[80px]" />
            <Button onClick={handleSaveEvent} className="btn-gold">{t("Enregistrer")}</Button>
          </div>

          {/* Add Guest */}
          {event && (
            <div className="card-glass p-4 md:p-6 space-y-4">
              <h2 className="font-serif text-xl text-foreground">Ajouter un invité</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Input placeholder="Prénom *" value={firstName} onChange={e => setFirstName(e.target.value)} />
                <Input placeholder="Nom" value={lastName} onChange={e => setLastName(e.target.value)} />
                <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <Select value={group} onValueChange={setGroup}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="number" min="0" max="10" placeholder="Accompagnants max" value={maxCompanions} onChange={e => setMaxCompanions(e.target.value)} />
              </div>
              <Button onClick={handleAddGuest} className="btn-gold"><Plus size={16} className="mr-1" />Ajouter l'invité</Button>
            </div>
          )}

          {/* Generated Link Modal */}
          {generatedLink && (
            <div className="card-glass p-4 md:p-6 border-2 border-primary/30">
              <h3 className="font-serif text-lg text-foreground mb-3">🔗 Lien RSVP généré</h3>
              <div className="flex gap-2">
                <Input value={generatedLink} readOnly className="text-xs" />
                <Button onClick={copyLink} variant="outline" size="icon"><Copy size={16} /></Button>
              </div>
              <p className="text-xs text-muted-foreground font-body mt-2">Envoyez ce lien à l'invité par WhatsApp, email ou SMS.</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setGeneratedLink(null)}>Fermer</Button>
            </div>
          )}

          {/* Guest List */}
          {event && (
            <div className="space-y-3">
              <h2 className="font-serif text-xl text-foreground">Liste des invités ({guests.length})</h2>
              {guestsLoading ? (
                <p className="text-muted-foreground font-body text-center py-8">…</p>
              ) : guests.length === 0 ? (
                <p className="text-muted-foreground font-body text-center py-8">Aucun invité pour le moment</p>
              ) : (
                guests.map(guest => (
                  <div key={guest.id} className="card-glass p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-body font-medium text-foreground">
                          {guest.first_name} {guest.last_name || ""}
                        </p>
                        <StatusBadge status={guest.status} />
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{guest.group_name}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground font-body">
                        {guest.email && <span>📧 {guest.email}</span>}
                        {guest.max_companions > 0 && <span>👥 +{guest.max_companions} max</span>}
                        {guest.companions && guest.companions.length > 0 && (
                          <span>✅ {guest.companions.length} accompagnant(s)</span>
                        )}
                        {guest.responded_at && <span>📅 Répondu le {new Date(guest.responded_at).toLocaleDateString("fr-FR")}</span>}
                      </div>
                      {guest.dietary_restrictions && (
                        <p className="text-xs text-muted-foreground font-body mt-1">🍽️ {guest.dietary_restrictions}</p>
                      )}
                      {guest.guest_message && (
                        <p className="text-xs text-muted-foreground font-body mt-1 italic">💬 "{guest.guest_message}"</p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => handleGenerateLink(guest.id)}>
                        <Link2 size={12} />Lien
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteGuest(guest.id)}>
                        <Trash2 size={14} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "confirmed") return <Badge className="text-[10px] px-1.5 py-0 bg-primary/20 text-primary border-primary/30">Confirmé</Badge>;
  if (status === "declined") return <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Décliné</Badge>;
  return <Badge variant="secondary" className="text-[10px] px-1.5 py-0">En attente</Badge>;
}

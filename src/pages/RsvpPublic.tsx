import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { verifyRsvpToken, submitRsvpResponse } from "@/hooks/use-rsvp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, Plus, Trash2, Heart, CalendarDays, MapPin, Users, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "welcome" | "attendance" | "companions" | "details" | "confirmation";

export default function RsvpPublic() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guest, setGuest] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [coupleName, setCoupleName] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("welcome");
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [status, setStatus] = useState<"confirmed" | "declined">("confirmed");
  const [companions, setCompanions] = useState<{ name: string; age_category: string }[]>([]);
  const [dietary, setDietary] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [menuChoice, setMenuChoice] = useState("");

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      const data = await verifyRsvpToken(token);
      if (data.error) {
        setError(data.error);
      } else {
        setGuest(data.guest);
        setEvent(data.event);
        setCoupleName(data.couple_name);
        setEmail(data.guest.email || "");
        setPhone(data.guest.phone || "");
        if (data.guest.companions?.length) setCompanions(data.guest.companions);
        if (data.guest.dietary_restrictions) setDietary(data.guest.dietary_restrictions);
        if (data.guest.guest_message) setMessage(data.guest.guest_message);
        if (data.guest.status !== "pending") {
          setStatus(data.guest.status);
          setStep("confirmation");
        }
      }
      setLoading(false);
    })();
  }, [token]);

  const addCompanion = () => {
    if (companions.length >= (guest?.max_companions || 0)) return;
    setCompanions(prev => [...prev, { name: "", age_category: "adult" }]);
  };

  const removeCompanion = (idx: number) => {
    setCompanions(prev => prev.filter((_, i) => i !== idx));
  };

  const updateCompanion = (idx: number, field: string, value: string) => {
    setCompanions(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const handleSubmit = async () => {
    if (!token) return;
    setSubmitting(true);
    const result = await submitRsvpResponse(token, {
      status,
      companions: status === "confirmed" ? companions.filter(c => c.name.trim()) : [],
      dietary_restrictions: dietary || undefined,
      guest_message: message || undefined,
      email: email || undefined,
      phone: phone || undefined,
      menu_choice: menuChoice || undefined,
    });
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      setStep("confirmation");
    }
  };

  const eventDate = event?.event_date
    ? new Date(event.event_date).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center">
          <Heart className="text-primary mx-auto mb-4 animate-pulse" size={48} />
          <p className="font-serif text-lg text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
        <div className="card-glass p-8 max-w-md text-center">
          <XCircle className="text-destructive mx-auto mb-4" size={48} />
          <h1 className="font-serif text-2xl text-foreground mb-2">Lien invalide</h1>
          <p className="font-body text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {/* STEP: Welcome */}
          {step === "welcome" && (
            <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card-glass p-6 md:p-10 text-center space-y-6">
              <Heart className="text-primary mx-auto" size={40} />
              <h1 className="font-serif text-3xl md:text-4xl text-foreground">
                {coupleName || event?.title || "Notre Mariage"}
              </h1>
              {event?.welcome_message && (
                <p className="font-body text-muted-foreground leading-relaxed">{event.welcome_message}</p>
              )}
              <div className="space-y-2">
                {eventDate && (
                  <div className="flex items-center justify-center gap-2 text-foreground font-body">
                    <CalendarDays size={16} className="text-primary" />
                    <span>{eventDate}</span>
                  </div>
                )}
                {event?.event_location && (
                  <div className="flex items-center justify-center gap-2 text-foreground font-body">
                    <MapPin size={16} className="text-primary" />
                    <span>{event.event_location}</span>
                  </div>
                )}
              </div>
              <div className="divider-gold" />
              <p className="font-body text-lg text-foreground">
                Bonjour <span className="font-semibold">{guest?.first_name}</span> ! 💛
              </p>
              <p className="font-body text-muted-foreground">Nous serions honorés de votre présence.</p>
              <Button onClick={() => setStep("attendance")} className="btn-gold w-full text-lg py-6">
                Répondre à l'invitation
              </Button>
            </motion.div>
          )}

          {/* STEP: Attendance */}
          {step === "attendance" && (
            <motion.div key="attendance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card-glass p-6 md:p-10 text-center space-y-6">
              <h2 className="font-serif text-2xl text-foreground">Serez-vous des nôtres ?</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setStatus("confirmed"); setStep(guest?.max_companions > 0 ? "companions" : "details"); }}
                  className={`card-glass p-6 flex flex-col items-center gap-3 transition-all cursor-pointer hover:border-primary/40 ${status === "confirmed" ? "border-primary/40 bg-primary/5" : ""}`}
                >
                  <CheckCircle2 size={32} className="text-primary" />
                  <span className="font-serif text-lg text-foreground">Oui, avec joie !</span>
                </button>
                <button
                  onClick={() => { setStatus("declined"); setStep("details"); }}
                  className={`card-glass p-6 flex flex-col items-center gap-3 transition-all cursor-pointer hover:border-destructive/40 ${status === "declined" ? "border-destructive/40 bg-destructive/5" : ""}`}
                >
                  <XCircle size={32} className="text-destructive" />
                  <span className="font-serif text-lg text-foreground">Désolé, non</span>
                </button>
              </div>
              <Button variant="ghost" onClick={() => setStep("welcome")} className="font-body">← Retour</Button>
            </motion.div>
          )}

          {/* STEP: Companions */}
          {step === "companions" && (
            <motion.div key="companions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card-glass p-6 md:p-10 space-y-6">
              <div className="text-center">
                <Users size={32} className="text-primary mx-auto mb-2" />
                <h2 className="font-serif text-2xl text-foreground">Vos accompagnants</h2>
                <p className="font-body text-sm text-muted-foreground">Vous pouvez inviter jusqu'à {guest?.max_companions} personne(s)</p>
              </div>
              <div className="space-y-3">
                {companions.map((c, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input placeholder="Nom complet" value={c.name} onChange={e => updateCompanion(idx, "name", e.target.value)} className="flex-1" />
                    <select value={c.age_category} onChange={e => updateCompanion(idx, "age_category", e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                      <option value="adult">Adulte</option>
                      <option value="child">Enfant</option>
                      <option value="baby">Bébé</option>
                    </select>
                    <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" onClick={() => removeCompanion(idx)}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              {companions.length < (guest?.max_companions || 0) && (
                <Button variant="outline" onClick={addCompanion} className="w-full">
                  <Plus size={16} className="mr-1" />Ajouter un accompagnant
                </Button>
              )}
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep("attendance")} className="font-body">← Retour</Button>
                <Button onClick={() => setStep("details")} className="btn-gold flex-1">Continuer</Button>
              </div>
            </motion.div>
          )}

          {/* STEP: Details */}
          {step === "details" && (
            <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card-glass p-6 md:p-10 space-y-6">
              <h2 className="font-serif text-2xl text-foreground text-center">Quelques détails</h2>
              <div className="space-y-4">
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-1 block">Email (pour la confirmation)</label>
                  <Input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-1 block">Téléphone</label>
                  <Input type="tel" placeholder="+33 6 ..." value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                {status === "confirmed" && (
                  <>
                    <div>
                      <label className="font-body text-sm text-muted-foreground mb-1 block">
                        <UtensilsCrossed size={14} className="inline mr-1" />Choix du menu
                      </label>
                      <Select value={menuChoice} onValueChange={setMenuChoice}>
                        <SelectTrigger><SelectValue placeholder="Sélectionnez votre menu" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="afro-fusion">Afro-fusion</SelectItem>
                          <SelectItem value="traditionnel">Traditionnel</SelectItem>
                          <SelectItem value="enfant">Menu Enfant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="font-body text-sm text-muted-foreground mb-1 block">Restrictions alimentaires</label>
                      <Input placeholder="Végétarien, sans gluten, halal..." value={dietary} onChange={e => setDietary(e.target.value)} />
                    </div>
                  </>
                )}
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-1 block">Un petit mot pour les mariés 💛</label>
                  <Textarea placeholder="Félicitations..." value={message} onChange={e => setMessage(e.target.value)} className="min-h-[80px]" />
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(status === "confirmed" && guest?.max_companions > 0 ? "companions" : "attendance")} className="font-body">← Retour</Button>
                <Button onClick={handleSubmit} className="btn-gold flex-1" disabled={submitting}>
                  {submitting ? "Envoi..." : "Confirmer ma réponse"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP: Confirmation */}
          {step === "confirmation" && (
            <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-glass p-6 md:p-10 text-center space-y-6">
              {status === "confirmed" ? (
                <>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                    <CheckCircle2 size={64} className="text-primary mx-auto" />
                  </motion.div>
                  <h2 className="font-serif text-3xl text-foreground">Merci {guest?.first_name} ! 🎉</h2>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    Votre présence est confirmée. Nous avons hâte de célébrer avec vous !
                  </p>
                  {companions.length > 0 && (
                    <div className="bg-background/60 rounded-xl p-4 border border-border/40 text-left">
                      <p className="font-body text-sm font-medium text-foreground mb-2">👥 Accompagnants :</p>
                      {companions.filter(c => c.name.trim()).map((c, i) => (
                        <p key={i} className="font-body text-sm text-muted-foreground">• {c.name} ({c.age_category === "child" ? "Enfant" : c.age_category === "baby" ? "Bébé" : "Adulte"})</p>
                      ))}
                    </div>
                  )}
                  {email && (
                    <p className="font-body text-sm text-muted-foreground">📧 Un email de confirmation a été envoyé à {email}</p>
                  )}
                </>
              ) : (
                <>
                  <XCircle size={64} className="text-muted-foreground mx-auto" />
                  <h2 className="font-serif text-3xl text-foreground">Merci {guest?.first_name}</h2>
                  <p className="font-body text-muted-foreground">
                    C'est noté. Nous espérons vous revoir bientôt ! 💛
                  </p>
                </>
              )}
              <div className="divider-gold" />
              <p className="font-body text-xs text-muted-foreground">Propulsé par MariageAfro ✨</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

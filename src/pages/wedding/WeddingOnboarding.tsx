import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useWeddingProfile } from "@/hooks/use-wedding-profile";
import { useAuthContext } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, Heart, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { CulturalRecommendations } from "@/components/wedding/CulturalRecommendations";

const STEPS = ["Couple", "Mariage", "Style", "Recommandations"];

export default function WeddingOnboarding() {
  const { user } = useAuthContext();
  const { saveProfile, generateTasks } = useWeddingProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    partner_one_first_name: "",
    partner_two_first_name: "",
    partner_one_last_name: "",
    partner_two_last_name: "",
    origin_partner_one: "",
    origin_partner_two: "",
    wedding_date: undefined as Date | undefined,
    city: "",
    country: "France",
    guest_count: 100,
    estimated_budget: 15000,
    wedding_type: "mixed",
    wedding_style: "mix",
    is_afro_wedding: true,
    couple_quote: "",
  });

  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSaveAndShowReco = async () => {
    if (!form.partner_one_first_name || !form.partner_two_first_name) {
      toast({ title: "Veuillez remplir les prénoms des deux partenaires", variant: "destructive" });
      return;
    }
    setSaving(true);
    const result = await saveProfile({
      ...form,
      wedding_date: form.wedding_date?.toISOString().split("T")[0] || null,
      partner_one_last_name: form.partner_one_last_name || null,
      partner_two_last_name: form.partner_two_last_name || null,
      origin_partner_one: form.origin_partner_one || null,
      origin_partner_two: form.origin_partner_two || null,
      couple_quote: form.couple_quote || null,
      onboarding_completed: true,
    } as any);
    if (result?.error) {
      toast({ title: "Erreur lors de la sauvegarde", variant: "destructive" });
      setSaving(false);
      return;
    }
    await generateTasks();
    toast({ title: "✨ Votre profil de couple est prêt !" });
    setSaving(false);
    // Show recommendations step if cultural origins are set
    if (form.origin_partner_one || form.origin_partner_two) {
      setStep(3);
    } else {
      navigate("/mon-mariage");
    }
  };

  const handleFinish = () => {
    navigate("/mon-mariage");
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <Layout>
      <section className="pt-28 pb-16 bg-gradient-warm min-h-screen">
        <div className="container-editorial max-w-2xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="badge-premium mb-4 inline-flex"><Heart size={14} className="mr-1" /> Créez votre mariage</span>
            <h1 className="font-serif text-chocolate text-3xl md:text-4xl mb-2">
              Votre <span className="text-gradient-gold italic">histoire</span> commence ici
            </h1>
            <p className="font-body text-muted-foreground">Remplissez ces informations pour personnaliser votre expérience</p>
          </motion.div>

          {/* Step indicator */}
          <div className="flex justify-center gap-3 mb-10">
            {STEPS.map((s, i) => (
              <button key={s} onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body transition-all ${
                  i === step ? "bg-primary text-primary-foreground" :
                  i < step ? "bg-champagne/20 text-foreground cursor-pointer" :
                  "bg-muted text-muted-foreground"
                }`}>
                <span className="w-5 h-5 rounded-full bg-background/30 flex items-center justify-center text-xs font-medium">{i + 1}</span>
                {s}
              </button>
            ))}
          </div>

          {/* Form steps */}
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }} className="card-premium p-6 md:p-8 space-y-6">

              {step === 0 && (
                <>
                  <h2 className="font-serif text-xl text-chocolate">Les futurs mariés</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Prénom partenaire 1 *</Label>
                      <Input value={form.partner_one_first_name} onChange={e => set("partner_one_first_name", e.target.value)} placeholder="Prénom" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Prénom partenaire 2 *</Label>
                      <Input value={form.partner_two_first_name} onChange={e => set("partner_two_first_name", e.target.value)} placeholder="Prénom" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Nom (optionnel)</Label>
                      <Input value={form.partner_one_last_name} onChange={e => set("partner_one_last_name", e.target.value)} placeholder="Nom de famille" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Nom (optionnel)</Label>
                      <Input value={form.partner_two_last_name} onChange={e => set("partner_two_last_name", e.target.value)} placeholder="Nom de famille" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Origine culturelle</Label>
                      <Input value={form.origin_partner_one} onChange={e => set("origin_partner_one", e.target.value)} placeholder="ex: Cameroun, Sénégal..." />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Origine culturelle</Label>
                      <Input value={form.origin_partner_two} onChange={e => set("origin_partner_two", e.target.value)} placeholder="ex: Congo, Côte d'Ivoire..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body text-sm">Citation du couple (optionnel)</Label>
                    <Input value={form.couple_quote} onChange={e => set("couple_quote", e.target.value)} placeholder="Notre amour est une histoire sans fin..." />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="font-serif text-xl text-chocolate">Le mariage</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Date du mariage</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start font-body">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {form.wedding_date ? format(form.wedding_date, "PPP", { locale: fr }) : "Choisir une date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={form.wedding_date} onSelect={d => set("wedding_date", d)} /></PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Type de cérémonie</Label>
                      <Select value={form.wedding_type} onValueChange={v => set("wedding_type", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="civil">Civil uniquement</SelectItem>
                          <SelectItem value="religious">Religieux</SelectItem>
                          <SelectItem value="traditional">Traditionnel</SelectItem>
                          <SelectItem value="mixed">Mixte (plusieurs cérémonies)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Ville</Label>
                      <Input value={form.city} onChange={e => set("city", e.target.value)} placeholder="Paris" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Pays</Label>
                      <Input value={form.country} onChange={e => set("country", e.target.value)} placeholder="France" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Nombre d'invités</Label>
                      <Input type="number" value={form.guest_count} onChange={e => set("guest_count", parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Budget estimé (€)</Label>
                      <Input type="number" value={form.estimated_budget} onChange={e => set("estimated_budget", parseInt(e.target.value) || 0)} />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="font-serif text-xl text-chocolate">Votre style</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-body text-sm">Style de mariage</Label>
                      <Select value={form.wedding_style} onValueChange={v => set("wedding_style", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="traditional">Traditionnel</SelectItem>
                          <SelectItem value="modern">Moderne</SelectItem>
                          <SelectItem value="luxury">Luxe</SelectItem>
                          <SelectItem value="mix">Mix des styles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-champagne/10 border border-champagne/20">
                      <Checkbox checked={form.is_afro_wedding} onCheckedChange={v => set("is_afro_wedding", !!v)} />
                      <div>
                        <p className="font-body font-medium text-sm text-foreground">Mariage afro</p>
                        <p className="font-body text-xs text-muted-foreground">Inclure les traditions et inspirations culturelles afro dans la planification</p>
                      </div>
                    </div>
                  </div>

                  {form.partner_one_first_name && form.partner_two_first_name && (
                    <div className="mt-6 p-4 rounded-xl bg-champagne/10 border border-champagne/20 text-center">
                      <p className="font-body text-xs text-muted-foreground mb-1">Aperçu de votre nom de couple</p>
                      <p className="font-serif text-xl text-chocolate">
                        {form.partner_one_first_name} & {form.partner_two_first_name}
                      </p>
                      {form.couple_quote && (
                        <p className="font-body text-sm text-muted-foreground mt-2 italic">"{form.couple_quote}"</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="font-serif text-xl text-chocolate">✨ Recommandé pour votre culture</h2>
                  <p className="font-body text-sm text-muted-foreground mb-4">
                    Suggestions personnalisées basées sur vos origines et votre style de mariage
                  </p>
                  <CulturalRecommendations
                    originOne={form.origin_partner_one || "Afrique"}
                    originTwo={form.origin_partner_two || "France"}
                    weddingType={form.wedding_type}
                    country={form.country}
                    budget={form.estimated_budget}
                    guestCount={form.guest_count}
                    weddingStyle={form.wedding_style}
                    autoLoad={true}
                    showVendorLinks={true}
                  />
                </>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t border-border">
                {step > 0 && step < 3 ? (
                  <Button variant="outline" onClick={() => setStep(step - 1)} className="font-body">
                    <ArrowLeft size={16} className="mr-1" /> Retour
                  </Button>
                ) : <div />}
                {step < 2 ? (
                  <Button onClick={() => setStep(step + 1)} className="btn-gold" disabled={step === 0 && (!form.partner_one_first_name || !form.partner_two_first_name)}>
                    Suivant <ArrowRight size={16} className="ml-1" />
                  </Button>
                ) : step === 2 ? (
                  <Button onClick={handleSaveAndShowReco} className="btn-gold" disabled={saving}>
                    <Sparkles size={16} className="mr-1" /> {saving ? "Création..." : "Créer mon mariage"}
                  </Button>
                ) : (
                  <Button onClick={handleFinish} className="btn-gold">
                    Accéder à mon mariage <ArrowRight size={16} className="ml-1" />
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}

import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { weddingThemes, getWeddingTheme } from "@/lib/wedding-themes";
import { Heart, ChevronDown, MapPin, Camera, Check, Church, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import heroImg from "@/assets/template-couple-hero.jpg";
import rsvpImg from "@/assets/template-couple-rsvp.jpg";

const demoData = {
  coupleName: "AMINA & KOFFI",
  initials: "A + K",
  weddingDate: "15 AOÛT 2026",
  deadlineDate: "30.06.2026",
  city: "Paris",
  country: "France",
  welcomeText:
    "Votre présence sur ce site est la preuve de votre considération envers notre union. Nous avons imaginé cette journée comme un temps de joie, de partage et d'émotion, entouré des personnes qui comptent pour nous.",
  timeline: [
    { title: "Bénédiction nuptiale", time: "13h30" },
    { title: "Vin d'honneur", time: "15h30 à 16h30" },
    { title: "Soirée dansante", time: "20h00" },
  ],
  addresses: [
    {
      title: "Cérémonie religieuse",
      address: "Église Notre-Dame de l'Assomption, 12 Rue Saint-Honoré, 75001 Paris",
      icon: Church,
    },
    {
      title: "Réception & Soirée",
      address: "Domaine de la Rose, 45 Avenue des Champs, 91000 Évry",
      icon: UtensilsCrossed,
    },
  ],
};

export default function WeddingTemplates() {
  const [selectedTheme, setSelectedTheme] = useState("classic");
  const theme = getWeddingTheme(selectedTheme);

  return (
    <Layout>
      {/* Header */}
      <section className="pt-28 pb-8 bg-gradient-warm">
        <div className="container-editorial text-center">
          <h1 className="font-serif text-chocolate text-3xl md:text-5xl">
            Nos templates de site de mariage
          </h1>
          <p className="font-body text-muted-foreground mt-3 max-w-xl mx-auto">
            Choisissez parmi nos thèmes élégants pour créer votre site de
            mariage unique. Chaque template est entièrement personnalisable.
          </p>
        </div>
      </section>

      {/* Theme Selector - Sticky */}
      <section className="bg-gradient-warm border-b border-border sticky top-16 z-40">
        <div className="container-editorial py-4">
          <div className="flex justify-center gap-3 flex-wrap">
            {Object.values(weddingThemes).map((t) => {
              const isSelected = selectedTheme === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setSelectedTheme(t.key)}
                  className={`px-5 py-2.5 rounded-full font-body text-sm transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-card border border-border text-foreground hover:border-primary/40"
                  }`}
                >
                  {t.emoji} {t.label}
                  {isSelected && <Check size={14} className="inline ml-1.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== LIVE PREVIEW ========== */}
      <section className="bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTheme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* ── Nav Bar ── */}
            <div className={`${theme.nav.bg} ${theme.nav.text}`}>
              <div className="text-center py-3">
                <p className="font-serif text-lg tracking-[0.3em]">{demoData.initials}</p>
              </div>
              <div className="flex justify-center gap-6 pb-3 text-xs tracking-[0.2em] uppercase">
                <span className={`pb-1 border-b ${theme.nav.activeBar} ${theme.nav.text}`}>BIENVENUE !</span>
                <span className={theme.nav.textMuted}>CONFIRMATION DE PRÉSENCE</span>
                <span className={theme.nav.textMuted}>ADRESSES</span>
              </div>
            </div>

            {/* ── HERO with real photo ── */}
            <div className="relative h-[75vh] flex items-center justify-center overflow-hidden">
              <img
                src={heroImg}
                alt="Couple de mariage"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className={`absolute inset-0 ${theme.hero.overlay}`} />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center text-white"
              >
                <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-wide">
                  {demoData.coupleName}
                </h2>
              </motion.div>
              <div className="absolute bottom-6 z-10 text-white/50 animate-bounce">
                <ChevronDown size={28} />
              </div>
            </div>

            {/* ── WELCOME / Bienvenue ── */}
            <div className={`py-20 px-4 ${theme.welcome.bg}`}>
              <div className="max-w-2xl mx-auto text-center space-y-6" style={{ maxWidth: "42rem" }}>
                <p className={`font-serif ${theme.welcome.scriptFont} ${theme.welcome.accent} text-3xl md:text-4xl`}>
                  our wedding
                </p>
                <p className={`font-serif text-lg ${theme.welcome.heading}`}>Nous nous marions !</p>
                <h3 className={`font-serif text-4xl md:text-5xl ${theme.welcome.heading} tracking-wider`}>
                  {demoData.weddingDate}
                </h3>
                <p className={`font-mono text-sm tracking-wider ${theme.welcome.body}`}>
                  {demoData.city}, {demoData.country}
                </p>
                <div className={`w-16 h-px ${theme.welcome.divider} mx-auto`} />
                <h4 className={`font-serif text-2xl ${theme.welcome.heading}`}>Bienvenue à notre mariage !</h4>

                {/* ── Moments Card ── */}
                <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden mt-8">
                  <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className={`absolute inset-0 ${theme.moments.overlay}`} />
                  <div className={`relative z-10 py-10 px-6 ${theme.moments.text} text-center space-y-6`}>
                    <h4 className="font-serif italic text-3xl">Moments</h4>
                    <div className={`w-12 h-px ${theme.moments.divider} mx-auto`} />
                    {demoData.timeline.map((item, i) => (
                      <div key={i} className="space-y-1">
                        <p className="font-serif font-semibold text-lg">{item.title}</p>
                        <p className={`font-serif italic ${theme.moments.textMuted}`}>{item.time}</p>
                      </div>
                    ))}
                    <div className={`pt-4 border-t ${theme.moments.divider.replace("bg-", "border-")}`}>
                      <p className="text-xs tracking-widest uppercase">Thème</p>
                      <p className={`font-serif italic ${theme.moments.textMuted}`}>Chic & élégant</p>
                    </div>
                  </div>
                </div>

                <p className={`font-body ${theme.welcome.body} leading-relaxed max-w-lg mx-auto`}>
                  {demoData.welcomeText}
                </p>
              </div>
            </div>

            {/* ── RSVP / Confirmation de présence with real photo ── */}
            <div className="relative py-20 px-4">
              <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className={`absolute inset-0 ${theme.rsvp.overlay}`} />
              <div className={`relative z-10 max-w-md mx-auto text-center ${theme.rsvp.text} space-y-6`}>
                <p className="font-serif text-4xl tracking-wider">
                  {demoData.initials.replace(" + ", "")}
                </p>
                <h3 className="font-serif text-3xl md:text-4xl font-bold">
                  Confirmation de présence
                </h3>
                <div className={`w-16 h-px ${theme.rsvp.divider} mx-auto`} />
                <p className={`font-serif text-xl ${theme.rsvp.textMuted}`}>
                  Avant le {demoData.deadlineDate}
                </p>
                <div className="bg-white rounded-xl p-4 inline-block mx-auto">
                  <QRCodeSVG value="https://mariageafro.com" size={140} level="M" />
                </div>
                <p className={`${theme.rsvp.textMuted} text-sm font-body`}>
                  Scannez le QR code ou utilisez le lien envoyé par les mariés
                </p>
              </div>
            </div>

            {/* ── RSVP Form Preview (like mariages.net) ── */}
            <div className="relative py-20 px-4">
              <img src={rsvpImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 max-w-md mx-auto">
                <div className="bg-white rounded-2xl p-8 space-y-5 shadow-xl">
                  <div className="text-center space-y-1">
                    <p className="font-mono text-sm tracking-wider text-muted-foreground">
                      {demoData.weddingDate}
                    </p>
                    <h3 className="font-serif text-2xl text-foreground">Amina & Koffi</h3>
                  </div>
                  <div className="space-y-4">
                    <Input placeholder="Prénom" className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0" readOnly />
                    <Input placeholder="Nom" className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0" readOnly />
                    <Input placeholder="E-mail" type="email" className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0" readOnly />
                  </div>
                  <div className="flex items-start gap-2">
                    <Checkbox id="terms-demo" disabled />
                    <label htmlFor="terms-demo" className="text-xs text-muted-foreground leading-tight font-body">
                      J'accepte les conditions d'utilisation et la Protection des données de MariageAfro
                    </label>
                  </div>
                  <div className="text-center">
                    <Button className="bg-[hsl(350,60%,55%)] hover:bg-[hsl(350,60%,50%)] text-white px-8">
                      Accédez
                    </Button>
                  </div>
                  <div className="text-center pt-2">
                    <p className="font-body text-xs text-muted-foreground">Fait avec amour sur</p>
                    <p className="font-serif text-sm text-foreground flex items-center justify-center gap-1">
                      <Heart size={12} className="text-primary fill-primary" /> MariageAfro
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── ADRESSES Section ── */}
            <div className={`py-20 px-4 ${theme.addresses.bg}`}>
              <div className="max-w-2xl mx-auto text-center space-y-8">
                <h3 className={`font-serif text-3xl ${theme.addresses.heading}`}>Adresses</h3>
                <div className="space-y-6">
                  {demoData.addresses.map((addr, i) => {
                    const Icon = addr.icon;
                    return (
                      <div key={i} className={`p-6 rounded-xl border ${theme.addresses.border} text-left`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            theme.key === "romantique"
                              ? "bg-[hsl(340,30%,93%)]"
                              : theme.key === "tropical"
                                ? "bg-[hsl(45,40%,90%)]"
                                : theme.key === "moderne"
                                  ? "bg-[hsl(0,0%,93%)]"
                                  : "bg-[hsl(25,15%,92%)]"
                          }`}>
                            <Icon size={18} className={theme.addresses.heading} />
                          </div>
                          <h4 className={`font-serif text-xl ${theme.addresses.heading}`}>{addr.title}</h4>
                        </div>
                        <div className={`flex items-start gap-2 ${theme.addresses.body} font-body text-sm`}>
                          <MapPin size={16} className="shrink-0 mt-0.5" />
                          <p>{addr.address}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 mt-3 text-sm font-body ${theme.addresses.link} cursor-pointer hover:underline`}>
                          <MapPin size={14} /> Voir sur Google Maps
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Wedshoots / Album Photo ── */}
            <div className={`py-16 px-4 ${theme.welcome.bg}`}>
              <div className="max-w-md mx-auto text-center space-y-4">
                <Camera size={36} className={`mx-auto ${theme.welcome.accent}`} />
                <h4 className={`font-serif text-2xl ${theme.welcome.heading}`}>Album photo partagé</h4>
                <p className={`font-body text-sm ${theme.welcome.body} leading-relaxed`}>
                  Retrouvez toutes les photos prises par les invités le jour J ! Téléchargez l'application et partagez vos plus beaux clichés dans l'album commun.
                </p>
                <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-body text-sm cursor-pointer transition-opacity hover:opacity-90 ${
                  theme.key === "romantique"
                    ? "bg-[hsl(340,35%,55%)] text-white"
                    : theme.key === "tropical"
                      ? "bg-[hsl(160,40%,35%)] text-white"
                      : theme.key === "moderne"
                        ? "bg-[hsl(45,80%,50%)] text-[hsl(0,0%,10%)]"
                        : "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                }`}>
                  <Camera size={16} /> Toutes les photos de vos invités
                </span>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className={`py-8 text-center ${theme.footer.bg} ${theme.footer.text}`}>
              <p className="font-body text-xs">
                Fait avec amour sur <span className={theme.footer.highlight}>MariageAfro</span> ✨
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-16 bg-gradient-warm text-center">
        <div className="container-editorial space-y-6">
          <h2 className="font-serif text-chocolate text-2xl md:text-3xl">
            Prêt(e) à créer votre site ?
          </h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Créez gratuitement votre site de mariage personnalisé avec le thème de votre choix, QR code et confirmation de présence intégrés.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/mon-mariage/onboarding">
              <Button className="btn-gold">Créer mon site gratuitement</Button>
            </Link>
            <Link to="/demo-mariage">
              <Button variant="outline">Voir la démo</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { weddingThemes, getWeddingTheme } from "@/lib/wedding-themes";
import { Heart, ChevronDown, MapPin, Camera, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const demoData = {
  coupleName: "AMINA & KOFFI",
  initials: "A + K",
  weddingDate: "15 AOÛT 2026",
  city: "Paris",
  country: "France",
  welcomeText:
    "Votre présence sur ce site est la preuve de votre considération envers notre union. Nous avons imaginé cette journée comme un temps de joie, de partage et d'émotion.",
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

      {/* Theme Selector */}
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

      {/* Live Preview */}
      <section className="bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTheme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Mini Hero */}
            <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-b ${theme.hero.fallbackGradient}`}
              />
              <div className={`absolute inset-0 ${theme.hero.overlay}`} />
              <div className="relative z-10 text-center text-white space-y-4">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="font-serif text-5xl md:text-7xl tracking-wide"
                >
                  {demoData.coupleName}
                </motion.h2>
              </div>
              <div className="absolute bottom-6 z-10 text-white/50 animate-bounce">
                <ChevronDown size={28} />
              </div>
            </div>

            {/* Nav Preview */}
            <div className={`${theme.nav.bg} ${theme.nav.text} py-3`}>
              <div className="text-center mb-2">
                <p className="font-serif text-lg tracking-[0.3em]">
                  {demoData.initials}
                </p>
              </div>
              <div className="flex justify-center gap-6 text-xs tracking-[0.2em] uppercase">
                <span
                  className={`pb-1 border-b ${theme.nav.activeBar} ${theme.nav.text}`}
                >
                  BIENVENUE !
                </span>
                <span className={theme.nav.textMuted}>
                  CONFIRMATION DE PRÉSENCE
                </span>
                <span className={theme.nav.textMuted}>ADRESSES</span>
              </div>
            </div>

            {/* Welcome Preview */}
            <div className={`py-20 px-4 ${theme.welcome.bg}`}>
              <div className="max-w-2xl mx-auto text-center space-y-6">
                <p
                  className={`font-serif ${theme.welcome.scriptFont} ${theme.welcome.accent} text-3xl md:text-4xl`}
                >
                  our wedding
                </p>
                <p className={`font-serif text-lg ${theme.welcome.heading}`}>
                  Nous nous marions !
                </p>
                <h3
                  className={`font-serif text-4xl md:text-5xl ${theme.welcome.heading} tracking-wider`}
                >
                  {demoData.weddingDate}
                </h3>
                <p
                  className={`font-mono text-sm tracking-wider ${theme.welcome.body}`}
                >
                  {demoData.city}, {demoData.country}
                </p>
                <div
                  className={`w-16 h-px ${theme.welcome.divider} mx-auto`}
                />
                <h4
                  className={`font-serif text-2xl ${theme.welcome.heading}`}
                >
                  Bienvenue à notre mariage !
                </h4>
                <p
                  className={`font-body ${theme.welcome.body} leading-relaxed max-w-lg mx-auto`}
                >
                  {demoData.welcomeText}
                </p>
              </div>
            </div>

            {/* RSVP Preview */}
            <div className="relative py-20 px-4">
              <div
                className={`absolute inset-0 bg-gradient-to-b ${theme.rsvp.fallbackGradient}`}
              />
              <div className={`absolute inset-0 ${theme.rsvp.overlay}`} />
              <div
                className={`relative z-10 max-w-md mx-auto text-center ${theme.rsvp.text} space-y-6`}
              >
                <p className="font-serif text-4xl tracking-wider">
                  {demoData.initials.replace(" + ", "")}
                </p>
                <h3 className="font-serif text-3xl font-bold">
                  Confirmation de présence
                </h3>
                <div
                  className={`w-16 h-px ${theme.rsvp.divider} mx-auto`}
                />
                <p className={`font-serif text-xl ${theme.rsvp.textMuted}`}>
                  Avant le 15.06.2026
                </p>
                <p className={`${theme.rsvp.textMuted} text-sm font-body`}>
                  QR code et lien de confirmation personnalisé
                </p>
              </div>
            </div>

            {/* Addresses Preview */}
            <div className={`py-20 px-4 ${theme.addresses.bg}`}>
              <div className="max-w-2xl mx-auto text-center space-y-6">
                <h3
                  className={`font-serif text-3xl ${theme.addresses.heading}`}
                >
                  Adresses
                </h3>
                <div
                  className={`p-6 rounded-xl border ${theme.addresses.border} text-left max-w-md mx-auto`}
                >
                  <h4
                    className={`font-serif text-xl ${theme.addresses.heading} mb-2`}
                  >
                    Cérémonie religieuse
                  </h4>
                  <div
                    className={`flex items-start gap-2 ${theme.addresses.body} font-body text-sm`}
                  >
                    <MapPin size={16} className="shrink-0 mt-0.5" />
                    <p>Église Saint-Pierre, 12 Rue de l'Exemple, Paris</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 mt-3 text-sm font-body ${theme.addresses.link}`}
                  >
                    <MapPin size={14} /> Voir sur Google Maps
                  </span>
                </div>
              </div>
            </div>

            {/* Wedshoots Preview */}
            <div className={`py-16 px-4 ${theme.welcome.bg}`}>
              <div className="max-w-md mx-auto text-center space-y-4">
                <Camera
                  size={36}
                  className={`mx-auto ${theme.welcome.accent}`}
                />
                <h4
                  className={`font-serif text-2xl ${theme.welcome.heading}`}
                >
                  Album photo partagé
                </h4>
                <p
                  className={`font-body text-sm ${theme.welcome.body} leading-relaxed`}
                >
                  Retrouvez toutes les photos prises par les invités le jour J
                  !
                </p>
              </div>
            </div>

            {/* Footer Preview */}
            <div
              className={`py-8 text-center ${theme.footer.bg} ${theme.footer.text}`}
            >
              <p className="font-body text-xs">
                Fait avec amour sur{" "}
                <span className={theme.footer.highlight}>MariageAfro</span> ✨
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-warm text-center">
        <div className="container-editorial space-y-6">
          <h2 className="font-serif text-chocolate text-2xl md:text-3xl">
            Prêt(e) à créer votre site ?
          </h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Créez gratuitement votre site de mariage personnalisé avec le thème
            de votre choix, QR code et confirmation de présence intégrés.
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

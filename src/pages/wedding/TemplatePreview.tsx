import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { getWeddingTheme } from "@/lib/wedding-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Heart, Menu } from "lucide-react";
import heroImg from "@/assets/template-couple-hero.jpg";
import rsvpImg from "@/assets/template-couple-rsvp.jpg";

const demoCouple = "AMINA & KOFFI";
const demoDate = "15 AOÛT 2026";
const demoInitials = "A + K";

const NAV_TABS = [
  { id: "welcome", label: "BIENVENUE !" },
  { id: "events", label: "ÉVÉNEMENTS" },
  { id: "rsvp", label: "CONFIRMER SA PRÉSENCE" },
  { id: "photos", label: "VOS PHOTOS" },
];

export default function TemplatePreview() {
  const { themeKey } = useParams<{ themeKey: string }>();
  const theme = getWeddingTheme(themeKey);
  const [activeTab, setActiveTab] = useState("welcome");

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <Layout>
      <section className="pt-24 pb-16 bg-muted/30 min-h-screen">
        <div className="container-editorial">
          {/* Back link */}
          <Link
            to="/templates-mariage"
            className="inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Voir plus de thèmes
          </Link>

          {/* Mobile CTA — shown above the preview on small screens */}
          <div className="lg:hidden mb-6">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="font-serif text-foreground text-xl leading-snug">
                Bon choix <span className="text-primary">{theme.emoji} {theme.label}</span> !
              </h2>
              <p className="font-body text-muted-foreground text-sm mt-1">
                Avec qui allez-vous vous marier ?
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Votre prénom"
                    className="flex-1 border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 font-body"
                  />
                  <span className="font-serif text-muted-foreground text-lg">&</span>
                  <Input
                    placeholder="Votre partenaire"
                    className="flex-1 border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 font-body"
                  />
                </div>

                <Input
                  type="date"
                  className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 font-body text-muted-foreground"
                />
              </div>

              <Link to="/mon-mariage/onboarding" className="block mt-5">
                <Button className="w-full btn-gold text-sm py-5 shadow-md">
                  Créer mon site de mariage
                </Button>
              </Link>

              <p className="text-center font-body text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
                <Heart size={12} className="text-primary fill-primary" /> Gratuit & personnalisable
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Left: Large Preview (Desktop + Mobile) */}
            <div className="flex items-end justify-center gap-4">
              {/* Desktop preview */}
              <div className="relative w-full max-w-[580px] rounded-xl overflow-hidden shadow-2xl border border-border bg-card">
                {/* Nav — interactive tabs */}
                <div className={`${theme.nav.bg} py-3 px-4`}>
                  <p className={`${theme.nav.text} text-xs tracking-[0.25em] text-center font-serif`}>
                    {demoInitials}
                  </p>
                  <div className="flex justify-center gap-3 md:gap-5 mt-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {NAV_TABS.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`text-[8px] md:text-[9px] tracking-[0.12em] md:tracking-[0.15em] uppercase whitespace-nowrap pb-1 transition-colors ${
                          activeTab === tab.id
                            ? `${theme.nav.text} border-b ${theme.nav.activeBar}`
                            : `${theme.nav.textMuted} hover:${theme.nav.text}`
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hero */}
                <div ref={el => { sectionRefs.current.welcome = el; }} className="relative aspect-[16/9]">
                  <img
                    src={heroImg}
                    alt="Couple"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  <div className={`absolute inset-0 ${theme.hero.overlay}`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-white font-serif text-2xl md:text-3xl tracking-[0.15em] text-center drop-shadow-lg">
                      {demoCouple}
                    </h2>
                  </div>
                </div>

                {/* Welcome */}
                <div ref={el => { sectionRefs.current.events = el; }} className={`${theme.welcome.bg} py-8 px-6 text-center`}>
                  <p className={`font-serif ${theme.welcome.heading} text-sm`}>
                    Nous nous marions !
                  </p>
                  <h3 className={`font-serif ${theme.welcome.heading} text-2xl tracking-wider mt-2`}>
                    {demoDate}
                  </h3>
                  <p className={`font-mono text-xs tracking-wider ${theme.welcome.body} mt-1`}>
                    Paris, France
                  </p>
                  <div className={`w-12 h-px ${theme.welcome.divider} mx-auto mt-4`} />
                  <p className={`font-body ${theme.welcome.body} text-xs mt-4 leading-relaxed max-w-md mx-auto`}>
                    Votre présence sur ce site est la preuve de votre considération envers notre union. Nous avons imaginé cette journée comme un temps de joie et de partage.
                  </p>
                </div>

                {/* RSVP band */}
                <div ref={el => { sectionRefs.current.rsvp = el; }} className="relative h-32">
                  <img
                    src={rsvpImg}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 ${theme.rsvp.overlay}`} />
                  <div className={`absolute inset-0 flex flex-col items-center justify-center ${theme.rsvp.text}`}>
                    <p className="font-serif text-lg tracking-wider">Confirmation de présence</p>
                    <p className={`text-xs ${theme.rsvp.textMuted} mt-1`}>Avant le 30.06.2026</p>
                  </div>
                </div>

                {/* Photos placeholder */}
                <div ref={el => { sectionRefs.current.photos = el; }} className={`${theme.welcome.bg} py-6 px-4 text-center`}>
                  <p className={`font-serif ${theme.welcome.heading} text-sm tracking-wider`}>📸 Vos Photos</p>
                  <p className={`font-body ${theme.welcome.body} text-xs mt-1`}>Partagez vos plus beaux souvenirs</p>
                </div>

                {/* Footer */}
                <div className={`${theme.footer.bg} py-3 text-center`}>
                  <p className={`${theme.footer.text} text-[10px]`}>
                    Fait avec amour sur <span className={theme.footer.highlight}>MariageAfro</span> ✨
                  </p>
                </div>
              </div>

              {/* Mobile preview (hidden on small screens) */}
              <div className="relative w-[140px] shrink-0 rounded-xl overflow-hidden shadow-2xl border-2 border-border bg-card hidden md:block">
                <div className={`${theme.nav.bg} py-2 px-2 flex items-center justify-between`}>
                  <p className={`${theme.nav.text} text-[7px] tracking-[0.2em] font-serif`}>
                    {demoInitials}
                  </p>
                  <Menu size={10} className={theme.nav.textMuted} />
                </div>
                <div className="relative h-24">
                  <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
                  <div className={`absolute inset-0 ${theme.hero.overlay}`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white font-serif text-[9px] tracking-wider text-center">{demoCouple}</p>
                  </div>
                </div>
                <div className={`${theme.welcome.bg} py-3 px-2 text-center`}>
                  <p className={`font-serif ${theme.welcome.heading} text-[6px]`}>Nous nous marions !</p>
                  <h4 className={`font-serif ${theme.welcome.heading} text-[8px] tracking-wider mt-1`}>{demoDate}</h4>
                  <p className={`font-body ${theme.welcome.body} text-[5px] mt-1`}>We are waiting for you!</p>
                </div>
                <div className="relative h-14">
                  <img src={rsvpImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className={`absolute inset-0 ${theme.rsvp.overlay}`} />
                  <div className={`absolute inset-0 flex items-center justify-center ${theme.rsvp.text}`}>
                    <p className="font-serif text-[7px]">RSVP</p>
                  </div>
                </div>
                <div className={`${theme.footer.bg} py-1.5 text-center`}>
                  <p className={`${theme.footer.text} text-[4px]`}>MariageAfro ✨</p>
                </div>
              </div>
            </div>

            {/* Right: CTA Sidebar — desktop only */}
            <div className="hidden lg:block bg-card rounded-2xl border border-border p-8 shadow-sm sticky top-24">
              <h2 className="font-serif text-foreground text-2xl leading-snug">
                Bon choix <span className="text-primary">{theme.emoji} {theme.label}</span> ! Avec qui allez-vous vous marier ?
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Votre prénom"
                    className="flex-1 border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 font-body"
                  />
                  <span className="font-serif text-muted-foreground text-lg">&</span>
                  <Input
                    placeholder="Votre partenaire"
                    className="flex-1 border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 font-body"
                  />
                </div>

                <Input
                  type="date"
                  className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 font-body text-muted-foreground"
                />
              </div>

              <Link to="/mon-mariage/onboarding" className="block mt-8">
                <Button className="w-full btn-gold text-base py-6 shadow-md">
                  Créer mon site de mariage
                </Button>
              </Link>

              <p className="text-center font-body text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                <Heart size={12} className="text-primary fill-primary" /> Gratuit & personnalisable
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

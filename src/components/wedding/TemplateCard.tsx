import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { WeddingTheme } from "@/lib/wedding-themes";
import heroImg from "@/assets/template-couple-hero.jpg";
import rsvpImg from "@/assets/template-couple-rsvp.jpg";

interface TemplateCardProps {
  theme: WeddingTheme;
}

const demoCouple = "AMINA & KOFFI";
const demoDate = "15 AOÛT 2026";
const demoInitials = "A & K";

export function TemplateCard({ theme }: TemplateCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card container */}
      <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-card border border-border">
        {/* Desktop + Mobile preview composite */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* Desktop preview (main) */}
          <div className="absolute inset-0">
            {/* Nav bar mini */}
            <div className={`${theme.nav.bg} py-2 px-3`}>
              <p className={`${theme.nav.text} text-[8px] tracking-[0.2em] text-center font-serif`}>
                {demoInitials}
              </p>
              <div className="flex justify-center gap-3 mt-1">
                <span className={`text-[5px] tracking-[0.15em] uppercase ${theme.nav.text} border-b ${theme.nav.activeBar} pb-0.5`}>
                  BIENVENUE
                </span>
                <span className={`text-[5px] tracking-[0.15em] uppercase ${theme.nav.textMuted}`}>
                  CONFIRMATION
                </span>
                <span className={`text-[5px] tracking-[0.15em] uppercase ${theme.nav.textMuted}`}>
                  ADRESSES
                </span>
              </div>
            </div>

            {/* Hero section */}
            <div className="relative h-[45%]">
              <img
                src={heroImg}
                alt="Couple"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className={`absolute inset-0 ${theme.hero.overlay}`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white font-serif text-sm md:text-base tracking-wider text-center leading-tight">
                  {demoCouple}
                </h3>
              </div>
            </div>

            {/* Welcome section */}
            <div className={`${theme.welcome.bg} py-3 px-4 text-center`}>
              <p className={`font-serif ${theme.welcome.accent} text-[7px] ${theme.welcome.scriptFont}`}>
                our wedding
              </p>
              <p className={`font-serif ${theme.welcome.heading} text-[6px] mt-0.5`}>
                Nous nous marions !
              </p>
              <h4 className={`font-serif ${theme.welcome.heading} text-[9px] tracking-wider mt-1`}>
                {demoDate}
              </h4>
              <div className={`w-6 h-px ${theme.welcome.divider} mx-auto mt-1.5`} />
              <p className={`font-body ${theme.welcome.body} text-[5px] mt-1.5 leading-relaxed max-w-[80%] mx-auto`}>
                Votre présence est la preuve de votre considération envers notre union...
              </p>
            </div>

            {/* RSVP section */}
            <div className="relative h-[20%]">
              <img
                src={rsvpImg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className={`absolute inset-0 ${theme.rsvp.overlay}`} />
              <div className={`absolute inset-0 flex flex-col items-center justify-center ${theme.rsvp.text}`}>
                <p className="font-serif text-[8px] tracking-wider">Confirmation</p>
                <p className={`text-[5px] ${theme.rsvp.textMuted} mt-0.5`}>Avant le 30.06.2026</p>
              </div>
            </div>

            {/* Footer */}
            <div className={`${theme.footer.bg} py-1.5 text-center`}>
              <p className={`${theme.footer.text} text-[4px]`}>
                Fait avec amour sur <span className={theme.footer.highlight}>MariageAfro</span> ✨
              </p>
            </div>
          </div>

          {/* Mobile preview (floating, right side) */}
          <div className="absolute right-2 bottom-3 w-[35%] rounded-lg overflow-hidden shadow-2xl border-2 border-white/80 z-10">
            <div className={`${theme.nav.bg} py-1 px-1`}>
              <p className={`${theme.nav.text} text-[5px] tracking-[0.15em] text-center font-serif`}>
                {demoInitials}
              </p>
            </div>
            <div className="relative h-16">
              <img
                src={heroImg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className={`absolute inset-0 ${theme.hero.overlay}`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white font-serif text-[6px] tracking-wider">{demoCouple}</p>
              </div>
            </div>
            <div className={`${theme.welcome.bg} py-2 px-1 text-center`}>
              <p className={`font-serif ${theme.welcome.heading} text-[5px] tracking-wider`}>
                {demoDate}
              </p>
              <p className={`font-body ${theme.welcome.body} text-[4px] mt-0.5`}>
                Nous nous marions !
              </p>
            </div>
            <div className="relative h-10">
              <img src={rsvpImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className={`absolute inset-0 ${theme.rsvp.overlay}`} />
              <div className={`absolute inset-0 flex items-center justify-center ${theme.rsvp.text}`}>
                <p className="font-serif text-[5px]">RSVP</p>
              </div>
            </div>
            <div className={`${theme.footer.bg} py-1 text-center`}>
              <p className={`${theme.footer.text} text-[3px]`}>MariageAfro ✨</p>
            </div>
          </div>

          {/* Hover overlay with CTA */}
          <div
            className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <Link to={`/templates-mariage/${theme.key}`}>
                <Button className="btn-gold shadow-lg text-sm px-6">
                  Choisir ce thème
                </Button>
              </Link>
              <Link to={`/templates-mariage/${theme.key}`}>
                <Button variant="outline" size="sm" className="bg-white/90 hover:bg-white text-xs gap-1.5">
                  <Eye size={14} /> Aperçu complet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Theme name below card */}
      <div className="mt-3 text-center">
        <h3 className="font-serif text-foreground text-base font-semibold">
          {theme.emoji} {theme.label}
        </h3>
        <p className="font-body text-muted-foreground text-xs mt-0.5">
          {theme.description}
        </p>
      </div>
    </div>
  );
}

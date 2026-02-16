import { useState, useEffect, useRef } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, CalendarDays, MapPin, Clock, Sparkles, Camera, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Section = "bienvenue" | "rsvp" | "adresses";

interface SiteProfile {
  partner_one_first_name: string;
  partner_two_first_name: string;
  couple_display_name: string | null;
  couple_quote: string | null;
  wedding_date: string | null;
  city: string | null;
  country: string | null;
  site_hero_image_url: string | null;
  site_theme: string | null;
  site_welcome_text: string | null;
  site_share_code: string | null;
}

interface TimelineEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string | null;
  address: string | null;
  google_maps_link: string | null;
}

export default function WeddingSite() {
  const { code } = useParams<{ code: string }>();
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("bienvenue");
  const sectionsRef = useRef<Record<Section, HTMLElement | null>>({ bienvenue: null, rsvp: null, adresses: null });

  useEffect(() => {
    if (!code) return;
    (async () => {
      const { data: wp } = await supabase
        .from("user_wedding_profile")
        .select("partner_one_first_name, partner_two_first_name, couple_display_name, couple_quote, wedding_date, city, country, site_hero_image_url, site_theme, site_welcome_text, site_share_code, user_id")
        .eq("site_share_code", code)
        .maybeSingle();

      if (!wp) { setError(true); setLoading(false); return; }
      setProfile(wp as any);

      // Fetch day-of timeline if available
      const { data: tl } = await supabase
        .from("day_of_timeline")
        .select("id")
        .eq("user_id", (wp as any).user_id)
        .eq("is_public", true)
        .maybeSingle();

      if (tl) {
        const { data: items } = await supabase
          .from("day_of_timeline_items")
          .select("id, title, start_time, end_time, address, google_maps_link")
          .eq("timeline_id", tl.id)
          .order("start_time", { ascending: true });
        if (items) setTimeline(items as TimelineEvent[]);
      }
      setLoading(false);
    })();
  }, [code]);

  const scrollTo = (section: Section) => {
    setActiveSection(section);
    sectionsRef.current[section]?.scrollIntoView({ behavior: "smooth" });
  };

  const coupleName = profile?.couple_display_name ||
    (profile ? `${profile.partner_one_first_name} & ${profile.partner_two_first_name}` : "");

  const initials = profile
    ? `${profile.partner_one_first_name.charAt(0)} + ${profile.partner_two_first_name.charAt(0)}`
    : "";

  const weddingDateFormatted = profile?.wedding_date
    ? format(new Date(profile.wedding_date), "d MMMM yyyy", { locale: fr }).toUpperCase()
    : null;

  const rsvpUrl = typeof window !== "undefined"
    ? `${window.location.origin}/rsvp/${code}`
    : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Heart className="text-white animate-pulse" size={48} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-center p-8">
        <div>
          <h1 className="font-serif text-3xl mb-4">Page introuvable</h1>
          <p className="text-white/60">Ce site de mariage n'existe pas ou n'est plus disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[hsl(0,0%,10%)] text-white">
        <div className="text-center py-3">
          <p className="font-serif text-lg tracking-[0.3em]">{initials}</p>
        </div>
        <div className="flex justify-center gap-6 pb-3 text-xs tracking-[0.2em] uppercase">
          {[
            { key: "bienvenue" as Section, label: "BIENVENUE !" },
            { key: "rsvp" as Section, label: "CONFIRMATION DE PRÉSENCE" },
            { key: "adresses" as Section, label: "ADRESSES" },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => scrollTo(item.key)}
              className={`pb-1 transition-all hover:text-white/80 ${
                activeSection === item.key ? "border-b border-white text-white" : "text-white/60"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* HERO Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {profile.site_hero_image_url ? (
          <img
            src={profile.site_hero_image_url}
            alt={coupleName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(25,20%,25%)] to-[hsl(25,15%,15%)]" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 text-center text-white"
        >
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-wide">
            {coupleName.toUpperCase()}
          </h1>
        </motion.div>
        <button
          onClick={() => scrollTo("bienvenue")}
          className="absolute bottom-8 z-10 text-white/60 animate-bounce"
        >
          <ChevronDown size={32} />
        </button>
      </section>

      {/* BIENVENUE Section */}
      <section ref={el => { sectionsRef.current.bienvenue = el; }} className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Decorative script */}
          <p className="font-serif italic text-[hsl(var(--muted-foreground))] text-3xl md:text-4xl">
            our wedding
          </p>

          <p className="font-serif text-lg text-[hsl(var(--foreground))]">Nous nous marions !</p>

          {weddingDateFormatted && (
            <h2 className="font-serif text-4xl md:text-5xl text-[hsl(var(--foreground))] tracking-wider">
              {weddingDateFormatted}
            </h2>
          )}

          {profile.city && (
            <p className="font-mono text-sm tracking-wider text-[hsl(var(--muted-foreground))]">
              {profile.city}, {profile.country}
            </p>
          )}

          <div className="w-16 h-px bg-[hsl(var(--border))] mx-auto" />

          <h3 className="font-serif text-2xl text-[hsl(var(--foreground))]">Bienvenue à notre mariage !</h3>

          {/* Moments / Timeline */}
          {timeline.length > 0 && (
            <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden mt-8">
              {profile.site_hero_image_url ? (
                <img src={profile.site_hero_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-[hsl(25,20%,20%)] to-[hsl(25,15%,12%)]" />
              )}
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative z-10 py-10 px-6 text-white text-center space-y-6">
                <h4 className="font-serif italic text-3xl">Moments</h4>
                <div className="w-12 h-px bg-white/40 mx-auto" />
                {timeline.map(item => (
                  <div key={item.id} className="space-y-1">
                    <p className="font-serif font-semibold text-lg">{item.title}</p>
                    <p className="font-serif italic text-white/80">
                      {item.start_time?.slice(0, 5).replace(":", "h")}
                      {item.end_time ? ` à ${item.end_time.slice(0, 5).replace(":", "h")}` : ""}
                    </p>
                  </div>
                ))}
                <div className="pt-4 border-t border-white/20">
                  <p className="text-xs tracking-widest uppercase">Thème</p>
                  <p className="font-serif italic text-white/70">Chic & élégant</p>
                </div>
              </div>
            </div>
          )}

          {profile.site_welcome_text && (
            <p className="font-body text-[hsl(var(--muted-foreground))] leading-relaxed max-w-lg mx-auto">
              {profile.site_welcome_text}
            </p>
          )}

          {!profile.site_welcome_text && (
            <p className="font-body text-[hsl(var(--muted-foreground))] leading-relaxed max-w-lg mx-auto">
              Votre présence sur ce site est la preuve de votre considération envers notre union.
              Nous avons imaginé cette journée comme un temps de joie, de partage et d'émotion,
              entouré des personnes qui comptent pour nous.
            </p>
          )}
        </div>
      </section>

      {/* RSVP / Confirmation de présence Section */}
      <section ref={el => { sectionsRef.current.rsvp = el; }} className="relative py-20 px-4">
        {profile.site_hero_image_url ? (
          <img src={profile.site_hero_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(25,15%,18%)] to-[hsl(25,10%,12%)]" />
        )}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-md mx-auto text-center text-white space-y-8">
          {/* Monogram */}
          <p className="font-serif text-4xl tracking-wider">{initials.replace(" + ", "")}</p>

          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Confirmation de présence
          </h2>

          <div className="w-16 h-px bg-white/40 mx-auto" />

          {profile.wedding_date && (
            <p className="font-serif text-xl text-white/80">
              Avant le {format(new Date(new Date(profile.wedding_date).getTime() - 60 * 24 * 60 * 60 * 1000), "dd.MM.yyyy")}
            </p>
          )}

          {/* QR Code */}
          <div className="bg-white rounded-xl p-4 inline-block mx-auto">
            <QRCodeSVG
              value={rsvpUrl || `${window.location.origin}/site/${code}`}
              size={160}
              level="M"
              includeMargin={false}
            />
          </div>

          <p className="text-white/60 text-sm font-body">
            Scannez le QR code ou utilisez le lien envoyé par les mariés
          </p>
        </div>
      </section>

      {/* ADRESSES Section */}
      <section ref={el => { sectionsRef.current.adresses = el; }} className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="font-serif text-3xl text-[hsl(var(--foreground))]">Adresses</h2>

          {timeline.filter(t => t.address).length > 0 ? (
            <div className="space-y-6">
              {timeline.filter(t => t.address).map(item => (
                <div key={item.id} className="p-6 rounded-xl border border-[hsl(var(--border))] text-left">
                  <h3 className="font-serif text-xl text-[hsl(var(--foreground))] mb-2">{item.title}</h3>
                  <div className="flex items-start gap-2 text-[hsl(var(--muted-foreground))] font-body text-sm">
                    <MapPin size={16} className="shrink-0 mt-0.5" />
                    <p>{item.address}</p>
                  </div>
                  {item.google_maps_link && (
                    <a
                      href={item.google_maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-sm font-body text-[hsl(var(--primary))] hover:underline"
                    >
                      <MapPin size={14} /> Voir sur Google Maps
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl border border-[hsl(var(--border))]">
              <MapPin size={32} className="mx-auto mb-4 text-[hsl(var(--muted-foreground))]" />
              <p className="font-body text-[hsl(var(--muted-foreground))]">
                {profile.city
                  ? `Le mariage se déroulera à ${profile.city}, ${profile.country}. Les adresses exactes seront communiquées prochainement.`
                  : "Les adresses seront communiquées prochainement."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Wedshoots Promo Section */}
      <section className="py-16 px-4 bg-[hsl(var(--secondary))]">
        <div className="max-w-md mx-auto text-center space-y-6">
          <Camera size={40} className="mx-auto text-[hsl(var(--primary))]" />
          <h3 className="font-serif text-2xl text-[hsl(var(--foreground))]">
            Album photo partagé
          </h3>
          <p className="font-body text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
            Retrouvez toutes les photos prises par les invités le jour J !
            Téléchargez l'application Wedshoots et partagez vos plus beaux clichés dans l'album commun du mariage.
          </p>
          <a
            href="https://www.wedshoots.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-body text-sm hover:opacity-90 transition-opacity"
          >
            <Camera size={16} />
            Toutes les photos prises par vos invités
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center bg-[hsl(0,0%,10%)] text-white/40">
        <p className="font-body text-xs">
          Fait avec amour sur <span className="text-white/60">MariageAfro</span> ✨
        </p>
      </footer>
    </div>
  );
}

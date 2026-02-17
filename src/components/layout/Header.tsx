import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, Shield, Globe, ChevronDown, ChevronRight, MapPin, Shirt, Heart, Camera, Music, Utensils, Palette, Sparkles, Scissors, Church, Car } from "lucide-react";
import { mainCategories } from "@/components/layout/MegaMenuData";
import { plannerItems } from "@/components/layout/MegaMenuPlannerData";
import { marieeItems } from "@/components/layout/MegaMenuMarieeData";
import { marieItems } from "@/components/layout/MegaMenuMarieData";
import { robesCategories } from "@/components/layout/MegaMenuRobesData";
import { ideesItems } from "@/components/layout/MegaMenuIdeesData";
import { communauteThemes, communauteNewItems } from "@/components/layout/MegaMenuCommunauteData";
import { lieuxItems } from "@/components/layout/MegaMenuLieuxData";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/contexts/auth-context";
import { useUserRole } from "@/hooks/use-user-role";
import { useLanguage, translateUI } from "@/contexts/language-context";
import { useFavorites } from "@/hooks/use-favorites";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MegaMenuPlanner } from "@/components/layout/MegaMenuPlanner";
import { MegaMenuMariee } from "@/components/layout/MegaMenuMariee";
import { MegaMenuMarie } from "@/components/layout/MegaMenuMarie";
import { MegaMenuRobes } from "@/components/layout/MegaMenuRobes";
import { MegaMenuIdees } from "@/components/layout/MegaMenuIdees";
import { MegaMenuCommunaute } from "@/components/layout/MegaMenuCommunaute";
import { MegaMenuPays } from "@/components/layout/MegaMenuPays";
import { MegaMenuLieux } from "@/components/layout/MegaMenuLieux";
import logo from "@/assets/logo-mariageafro.png";

type MegaMenuKey = "prestataires" | "planner" | "mariee" | "marie" | "robes" | "idees" | "communaute" | "pays" | "lieux" | null;

const navLinks = [
  { key: "Accueil", href: "/" },
  { key: "Prestataires", href: "/prestataires", megaMenu: "prestataires" as const },
  { key: "Lieux", href: "/categories/salle-lieu", megaMenu: "lieux" as const },
  { key: "Mariée", href: "/categories/tenues-couture", megaMenu: "mariee" as const },
  { key: "Marié", href: "/categories/tenues-couture", megaMenu: "marie" as const },
  { key: "Robes", href: "/categories/tenues-couture", megaMenu: "robes" as const },
  { key: "Mon Mariage", href: "/mon-mariage", megaMenu: "planner" as const },
  { key: "Idées", href: "/blog", megaMenu: "idees" as const },
  { key: "Communauté", href: "/blog", megaMenu: "communaute" as const },
  { key: "Par Pays", href: "/trouver-par-pays", megaMenu: "pays" as const },
  { key: "Premium", href: "/prestataires-premium" },
  { key: "✨ Démo", href: "/demo-mariage" },
];

const featuredCategories = [
  { name: "📸 Image & Souvenirs", slug: "image-souvenirs" },
  { name: "🎶 Animation & Ambiance", slug: "animation-ambiance" },
  { name: "👗 Mode & Tenues", slug: "mode-tenues" },
  { name: "💄 Beauté", slug: "beaute" },
  { name: "🍽️ Traiteurs & Gastronomie", slug: "traiteurs-gastronomie" },
  { name: "🌸 Décoration & Lieux", slug: "decoration-lieux" },
  { name: "⛪ Cérémonies & Coutumes", slug: "ceremonies-coutumes" },
];

const megaMenuComponents: Record<Exclude<MegaMenuKey, null>, React.FC> = {
  prestataires: MegaMenu,
  planner: MegaMenuPlanner,
  mariee: MegaMenuMariee,
  marie: MegaMenuMarie,
  robes: MegaMenuRobes,
  idees: MegaMenuIdees,
  communaute: MegaMenuCommunaute,
  pays: MegaMenuPays,
  lieux: MegaMenuLieux,
};

export function Header() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<MegaMenuKey>(null);
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const { isAuthenticated, user, signOut } = useAuthContext();
  const { role } = useUserRole(user?.id);
  const { lang, setLang } = useLanguage();
  const { count: favCount } = useFavorites();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolled = scrollY > 100;
  const isHomePage = location.pathname === "/";
  const showSolid = isScrolled || !isHomePage;

  const openMegaMenu = (key: MegaMenuKey) => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setActiveMegaMenu(key);
  };

  const closeMegaMenuDelayed = () => {
    megaMenuTimeout.current = setTimeout(() => setActiveMegaMenu(null), 200);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          showSolid
            ? "bg-ivory/80 backdrop-blur-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_4px_16px_-2px_rgba(0,0,0,0.06)] border-b border-border/40"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container-editorial">
          <div className={`flex items-center justify-between transition-all duration-500 ease-out ${
            isScrolled ? "h-14" : "h-20"
          }`}>
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="MariageAfro"
                className={`w-auto transition-all duration-500 ease-out ${
                  isScrolled ? "h-9" : "h-16"
                }`}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-5">
              {navLinks.map((link) => {
                const hasMegaMenu = !!(link as any).megaMenu;
                if (hasMegaMenu) {
                  const menuKey = (link as any).megaMenu as Exclude<MegaMenuKey, null>;
                  return (
                    <div
                      key={link.key}
                      className="flex items-center"
                      onMouseEnter={() => openMegaMenu(menuKey)}
                      onMouseLeave={closeMegaMenuDelayed}
                    >
                      <Link
                        to={link.href}
                        className={`font-body text-[11px] xl:text-[12px] tracking-widest uppercase transition-all duration-300 hover:text-champagne flex items-center gap-1 ${
                          showSolid ? "text-chocolate" : "text-ivory"
                        } ${
                          activeMegaMenu === menuKey ? "text-champagne" : ""
                        } ${
                          location.pathname === link.href ? "text-champagne font-medium" : "font-normal"
                        }`}
                      >
                        {translateUI(link.key, lang)}
                        <ChevronDown className="w-3 h-3" />
                      </Link>
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.key}
                    to={link.href}
                    className={`font-body text-[11px] xl:text-[12px] tracking-widest uppercase transition-all duration-300 hover:text-champagne ${
                      showSolid ? "text-chocolate" : "text-ivory"
                    } ${
                      location.pathname === link.href ? "text-champagne font-medium" : "font-normal"
                    }`}
                  >
                    {translateUI(link.key, lang)}
                  </Link>
                );
              })}
            </nav>

             {/* Right side: Lang + Auth + Mobile toggle */}
             <div className="flex items-center gap-3">
               {/* Language Switcher */}
               <div className="hidden sm:flex items-center gap-0.5 rounded-full bg-secondary/50 p-0.5">
                <button
                  onClick={() => setLang("fr")}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                    lang === "fr"
                      ? "bg-champagne text-primary-foreground shadow-sm"
                      : showSolid ? "text-chocolate hover:text-champagne" : "text-ivory hover:text-champagne"
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                    lang === "en"
                      ? "bg-champagne text-primary-foreground shadow-sm"
                      : showSolid ? "text-chocolate hover:text-champagne" : "text-ivory hover:text-champagne"
                  }`}
                >
                  EN
                </button>
              </div>

                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <NotificationBell showSolid={showSolid} />
                   {role === 'admin' && (
                      <Link
                        to="/admin"
                        className={`text-sm font-medium px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
                          showSolid ? "text-chocolate hover:bg-champagne/10" : "text-ivory hover:bg-white/10"
                        }`}
                      >
                        <Shield className="w-4 h-4" />
                        <span className="hidden xl:inline">Admin</span>
                      </Link>
                    )}
                    {role === 'prestataire' ? (
                      <Link
                        to="/dashboard"
                        className={`text-sm font-medium px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
                          showSolid ? "text-chocolate hover:bg-champagne/10" : "text-ivory hover:bg-white/10"
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="hidden xl:inline">Espace Pro</span>
                      </Link>
                    ) : role !== 'admin' ? (
                      <Link
                        to="/mes-favoris"
                        className={`relative text-sm font-medium px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
                          showSolid ? "text-chocolate hover:bg-champagne/10" : "text-ivory hover:bg-white/10"
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                        {favCount > 0 && (
                          <span className="absolute -top-1 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-champagne text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                            {favCount > 99 ? '99+' : favCount}
                          </span>
                        )}
                        <span className="hidden xl:inline">Favoris</span>
                      </Link>
                    ) : null}
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={signOut}
                     className={`transition-all duration-500 ${isScrolled ? "text-xs" : ""}`}
                   >
                     <LogOut className="w-4 h-4" />
                   </Button>
                 </div>
               ) : (
                 <Button
                   variant={showSolid ? "gold-outline" : "hero-outline"}
                   size="sm"
                   className={`transition-all duration-500 ${isScrolled ? "text-xs px-3 h-8" : ""}`}
                   asChild
                 >
                   <Link to="/auth">{translateUI("Connexion", lang)}</Link>
                 </Button>
               )}

               {/* Mobile Menu Toggle */}
               <button
                 className={`lg:hidden p-2 transition-colors duration-300 z-[200] relative ${showSolid ? "text-chocolate" : isMobileMenuOpen ? "text-chocolate" : "text-ivory"}`}
                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               >
                 {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
               </button>
             </div>
          </div>
        </div>

        {/* Mega Menu Panels */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div
              key={activeMegaMenu}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:block"
              onMouseEnter={() => openMegaMenu(activeMegaMenu)}
              onMouseLeave={closeMegaMenuDelayed}
            >
              {(() => {
                const Component = megaMenuComponents[activeMegaMenu];
                return <Component />;
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu — rendered OUTSIDE header to avoid stacking context issues */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className={`lg:hidden fixed inset-0 z-[100] bg-ivory overflow-y-auto ${isScrolled ? "top-14" : "top-20"}`}
          >
            <MobileMenuContent
              lang={lang}
              setLang={setLang}
              location={location}
              isAuthenticated={isAuthenticated}
              user={user}
              role={role}
              signOut={signOut}
              close={() => setIsMobileMenuOpen(false)}
              favCount={favCount}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ───────── Mobile Menu with Expandable Sub-menus ───────── */

interface MobileMenuContentProps {
  lang: "fr" | "en";
  setLang: (l: "fr" | "en") => void;
  location: ReturnType<typeof useLocation>;
  isAuthenticated: boolean;
  user: any;
  role: string | null;
  signOut: () => void;
  close: () => void;
  favCount: number;
}

function MobileMenuContent({ lang, setLang, location, isAuthenticated, user, role, signOut, close, favCount }: MobileMenuContentProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggle = (key: string, href: string) => {
    if (expandedSection === key) {
      // Already open → navigate to the section page
      close();
      navigate(href);
    } else {
      setExpandedSection(key);
    }
  };

  const mobileNavItems = [
    { key: "Prestataires", href: "/prestataires", hasChildren: true },
    { key: "Mon Mariage", href: "/mon-mariage", hasChildren: true },
    { key: "Lieux", href: "/categories/salle-lieu", hasChildren: true },
    { key: "Mariée", href: "/categories/tenues-couture", hasChildren: true },
    { key: "Marié", href: "/categories/tenues-couture", hasChildren: true },
    { key: "Robes", href: "/categories/tenues-couture", hasChildren: true },
    { key: "Idées", href: "/blog", hasChildren: true },
    { key: "Communauté", href: "/blog", hasChildren: true },
    { key: "Par Pays", href: "/trouver-par-pays", hasChildren: true },
    { key: "Premium", href: "/prestataires-premium" },
    { key: "Blog", href: "/blog" },
    { key: "✨ Voir la démo", href: "/demo-mariage" },
    { key: "Devenir Prestataire", href: "/devenir-prestataire" },
  ];

  return (
    <nav className="flex flex-col">
      {/* Nav items */}
      <div className="flex flex-col pt-2">
        {mobileNavItems.map((item) => (
          <div key={item.key} className="border-b border-border/50">
            {item.hasChildren ? (
              <>
                <button
                   onClick={() => toggle(item.key, item.href)}
                   className="w-full flex items-center justify-between px-6 py-4 font-body text-base text-chocolate hover:text-champagne transition-colors"
                >
                  <span>{translateUI(item.key, lang)}</span>
                  <ChevronRight
                    size={18}
                    className={`text-muted-foreground transition-transform duration-200 ${
                      expandedSection === item.key ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {expandedSection === item.key && (
                  <div className="bg-muted/30">
                    {item.key === "Prestataires" && (
                      <div className="px-6 py-3 space-y-1">
                        <p className="text-[11px] uppercase tracking-widest text-muted-foreground px-3 pb-1 font-semibold">Les essentiels</p>
                        {[
                          { label: "Photographe", href: "/categories/image-souvenirs?sub=photographe", icon: Camera },
                          { label: "Vidéaste", href: "/categories/image-souvenirs?sub=videaste", icon: Camera },
                          { label: "DJ Mariage", href: "/categories/animation-ambiance?sub=dj-mariage", icon: Music },
                          { label: "Traiteur africain", href: "/categories/traiteurs-gastronomie?sub=traiteur-africain", icon: Utensils },
                          { label: "Décorateur", href: "/categories/decoration-lieux?sub=decorateur", icon: Palette },
                          { label: "Maquilleuse afro", href: "/categories/beaute?sub=maquilleuse-afro", icon: Sparkles },
                          { label: "Coiffeuse afro", href: "/categories/beaute?sub=coiffeuse-afro", icon: Scissors },
                          { label: "Wedding Cake", href: "/categories/traiteurs-gastronomie?sub=wedding-cake", icon: Utensils },
                          { label: "Wedding Planner", href: "/categories/ceremonies-coutumes?sub=wedding-planner", icon: Church },
                          { label: "Transport", href: "/categories/logistique-services?sub=transport-mariage", icon: Car },
                        ].map(cat => (
                          <Link
                            key={cat.href}
                            to={cat.href}
                            onClick={close}
                            className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-chocolate hover:bg-champagne/10 transition-colors"
                          >
                            <cat.icon size={16} className="text-champagne shrink-0" />
                            {cat.label}
                          </Link>
                        ))}
                        <Link to="/prestataires" onClick={close} className="block text-center text-xs text-champagne font-medium py-2 mt-1 border-t border-border/30 pt-3">
                          Voir toutes les catégories →
                        </Link>
                      </div>
                    )}

                    {item.key === "Lieux" && (
                      <div className="px-6 py-3 space-y-1">
                        {lieuxItems.map(li => (
                          <Link
                            key={li.label}
                            to={li.href}
                            onClick={close}
                            className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-chocolate hover:bg-champagne/10 transition-colors"
                          >
                            {li.icon && <li.icon size={14} className="text-champagne shrink-0" />}
                            {li.label}
                          </Link>
                        ))}
                      </div>
                    )}

                    {item.key === "Mon Mariage" && (
                      <div className="px-6 py-3 space-y-1">
                        {plannerItems.map(pi => (
                          <Link
                            key={pi.href + pi.label}
                            to={pi.href}
                            onClick={close}
                            className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-chocolate hover:bg-champagne/10 transition-colors"
                          >
                            <pi.icon size={16} className="text-champagne shrink-0" />
                            <div>
                              <span className="block">{pi.label}</span>
                              <span className="block text-[11px] text-muted-foreground">{pi.description}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {item.key === "Mariée" && (
                      <div className="px-6 py-3 space-y-1">
                        {marieeItems.map(mi => (
                          <Link key={mi.label} to={mi.href} onClick={close} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-chocolate hover:bg-champagne/10 transition-colors">
                            <Shirt size={14} className="text-champagne shrink-0" />
                            {mi.label}
                          </Link>
                        ))}
                      </div>
                    )}

                    {item.key === "Marié" && (
                      <div className="px-6 py-3 space-y-1">
                        {marieItems.map(mi => (
                          <Link key={mi.label} to={mi.href} onClick={close} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-chocolate hover:bg-champagne/10 transition-colors">
                            <Shirt size={14} className="text-champagne shrink-0" />
                            {mi.label}
                          </Link>
                        ))}
                      </div>
                    )}

                    {item.key === "Robes" && (
                      <div className="px-6 py-3 space-y-1">
                        {robesCategories.map(r => (
                          <Link key={r.label} to={r.href} onClick={close} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-chocolate hover:bg-champagne/10 transition-colors">
                            <Shirt size={14} className="text-champagne shrink-0" />
                            {r.label}
                          </Link>
                        ))}
                      </div>
                    )}

                    {item.key === "Idées" && (
                      <div className="px-6 py-3 space-y-1">
                        {ideesItems.map(i => (
                          <Link key={i.label} to={i.href} onClick={close} className="block py-2.5 px-3 rounded-lg text-sm text-chocolate hover:bg-champagne/10 transition-colors">
                            {i.label}
                          </Link>
                        ))}
                      </div>
                    )}

                    {item.key === "Communauté" && (
                      <div className="px-6 py-3 space-y-1">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground px-3 py-1">Groupes par thème</p>
                        {communauteThemes.slice(0, 8).map(c => (
                          <Link key={c.label} to={c.href} onClick={close} className="block py-2.5 px-3 rounded-lg text-sm text-chocolate hover:bg-champagne/10 transition-colors">
                            {c.label}
                          </Link>
                        ))}
                        <p className="text-xs uppercase tracking-widest text-muted-foreground px-3 py-1 mt-2">Nouveautés</p>
                        {communauteNewItems.map(c => (
                          <Link key={c.label} to={c.href} onClick={close} className="block py-2.5 px-3 rounded-lg text-sm text-chocolate hover:bg-champagne/10 transition-colors">
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}

                    {item.key === "Par Pays" && (
                      <div className="px-6 py-3 space-y-1">
                        {[
                          { flag: "🇨🇩", name: "Congo", code: "cd" },
                          { flag: "🇨🇲", name: "Cameroun", code: "cm" },
                          { flag: "🇸🇳", name: "Sénégal", code: "sn" },
                          { flag: "🇨🇮", name: "Côte d'Ivoire", code: "ci" },
                          { flag: "🇳🇬", name: "Nigeria", code: "ng" },
                          { flag: "🇬🇭", name: "Ghana", code: "gh" },
                          { flag: "🇫🇷", name: "France", code: "fr" },
                          { flag: "🇧🇪", name: "Belgique", code: "be" },
                          { flag: "🇬🇧", name: "Royaume-Uni", code: "gb" },
                          { flag: "🇩🇪", name: "Allemagne", code: "de" },
                        ].map(country => (
                          <Link
                            key={country.code}
                            to={`/trouver-par-pays?pays=${country.code}`}
                            onClick={close}
                            className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-chocolate hover:bg-champagne/10 transition-colors"
                          >
                            <span className="text-lg shrink-0">{country.flag}</span>
                            {country.name}
                          </Link>
                        ))}
                        <Link to="/trouver-par-pays" onClick={close} className="flex items-center gap-2 text-center text-xs text-champagne font-medium py-2 mt-1 justify-center">
                          <MapPin size={12} /> Voir tous les pays →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.href}
                onClick={close}
                className={`block px-6 py-4 font-body text-base text-chocolate hover:text-champagne transition-colors ${
                  location.pathname === item.href ? "text-champagne font-medium" : ""
                }`}
              >
                {translateUI(item.key, lang)}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Separator + extras */}
      <div className="px-6 py-4 border-t border-border mt-2">
        {/* Language */}
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <button onClick={() => setLang("fr")} className={`px-3 py-1 rounded text-sm ${lang === "fr" ? "bg-champagne text-primary-foreground" : "text-muted-foreground"}`}>Français</button>
          <button onClick={() => setLang("en")} className={`px-3 py-1 rounded text-sm ${lang === "en" ? "bg-champagne text-primary-foreground" : "text-muted-foreground"}`}>English</button>
        </div>

        {isAuthenticated ? (
          <div className="flex flex-col gap-3">
            {role === 'admin' && (
              <Link to="/admin" onClick={close} className="font-body text-base py-2 text-chocolate hover:text-champagne flex items-center gap-2">
                <Shield className="w-4 h-4" /> Admin
              </Link>
            )}
            {role === 'prestataire' && (
              <Link to="/dashboard" onClick={close} className="font-body text-base py-2 text-chocolate hover:text-champagne flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Espace Pro
              </Link>
            )}
            <Link to="/mes-favoris" onClick={close} className="font-body text-base py-2 text-chocolate hover:text-champagne flex items-center gap-2">
              <Heart className="w-4 h-4" /> Mes Favoris
              {favCount > 0 && (
                <span className="min-w-[20px] h-[20px] rounded-full bg-champagne text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                  {favCount}
                </span>
              )}
            </Link>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => { signOut(); close(); }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {translateUI("Déconnexion", lang)}
            </Button>
          </div>
        ) : (
          <Button variant="gold" className="w-full" asChild>
            <Link to="/auth" onClick={close}>{translateUI("Connexion", lang)}</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}

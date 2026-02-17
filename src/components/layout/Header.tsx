import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, Shield, Globe, ChevronDown, ChevronRight, MapPin, Shirt, Heart } from "lucide-react";
import { mainCategories, otherCategories } from "@/components/layout/MegaMenuData";
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
  { name: "Vidéaste", slug: "videaste" },
  { name: "Photographe", slug: "photographe" },
  { name: "DJ & Musique", slug: "dj-musique" },
  { name: "Wedding Planner", slug: "wedding-planner" },
  { name: "Animation", slug: "animation" },
  { name: "Beauté", slug: "coiffure-beaute" },
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
                      className={`text-sm font-medium px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
                        showSolid ? "text-chocolate hover:bg-champagne/10" : "text-ivory hover:bg-white/10"
                      }`}
                    >
                      <Heart className="w-4 h-4" />
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
               className={`lg:hidden p-2 transition-colors duration-300 ${showSolid ? "text-chocolate" : "text-ivory"}`}
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

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-0 top-[56px] z-50 bg-ivory overflow-y-auto"
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
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
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
}

function MobileMenuContent({ lang, setLang, location, isAuthenticated, user, role, signOut, close }: MobileMenuContentProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggle = (key: string) => {
    setExpandedSection(prev => prev === key ? null : key);
  };

  const mobileNavItems = [
    { key: "Mon Mariage", href: "/mon-mariage", hasChildren: true },
    { key: "Prestataires", href: "/prestataires", hasChildren: true },
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
      {/* Close button */}
      <div className="flex justify-end px-5 pt-4">
        <button onClick={close} className="text-chocolate p-1">
          <X size={24} />
        </button>
      </div>

      {/* Nav items */}
      <div className="flex flex-col">
        {mobileNavItems.map((item) => (
          <div key={item.key} className="border-b border-border/50">
            {item.hasChildren ? (
              <>
                <button
                  onClick={() => toggle(item.key)}
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
                        {mainCategories.slice(0, 8).map(cat => (
                          <Link
                            key={cat.href + cat.label}
                            to={cat.href}
                            onClick={close}
                            className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-chocolate hover:bg-champagne/10 transition-colors"
                          >
                            <cat.icon size={16} className="text-champagne shrink-0" />
                            {cat.label}
                          </Link>
                        ))}
                        <Link to="/prestataires" onClick={close} className="block text-center text-xs text-champagne font-medium py-2 mt-1">
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

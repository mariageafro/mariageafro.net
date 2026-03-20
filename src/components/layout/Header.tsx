import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, Shield, Globe, ChevronDown, ChevronRight, Heart, Camera, Music, Utensils, Palette, Sparkles, Scissors, Church, Car, Gem, Search, MapPin } from "lucide-react";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/contexts/auth-context";
import { useUserRole } from "@/hooks/use-user-role";
import { useLanguage, translateUI } from "@/contexts/language-context";
import { useFavorites } from "@/hooks/use-favorites";
import logo from "@/assets/logo-mariageafro.png";

/* ── Lightweight category list for dropdown ── */
const categoryFamilies = [
  { label: "Photographie & Vidéo", href: "/explorer?cat=image-souvenirs", icon: Camera },
  { label: "DJ & Animation", href: "/explorer?cat=animation-ambiance", icon: Music },
  { label: "Beauté", href: "/explorer?cat=beaute", icon: Sparkles },
  { label: "Traiteurs & Gastronomie", href: "/explorer?cat=traiteurs-gastronomie", icon: Utensils },
  { label: "Décoration & Lieux", href: "/explorer?cat=decoration-lieux", icon: Palette },
  { label: "Mode & Tenues", href: "/explorer?cat=mode-tenues", icon: Scissors },
  { label: "Coordination & Cérémonie", href: "/explorer?cat=ceremonies-coutumes", icon: Church },
  { label: "Bijoux & Accessoires", href: "/explorer?cat=bijoux-accessoires", icon: Gem },
  { label: "Logistique & Services", href: "/explorer?cat=logistique-services", icon: Car },
];

const origins = [
  { flag: "🇨🇩", name: "Congo", code: "cd" },
  { flag: "🇨🇲", name: "Cameroun", code: "cm" },
  { flag: "🇸🇳", name: "Sénégal", code: "sn" },
  { flag: "🇨🇮", name: "Côte d'Ivoire", code: "ci" },
  { flag: "🇲🇱", name: "Mali", code: "ml" },
  { flag: "🇬🇳", name: "Guinée", code: "gn" },
  { flag: "🇧🇯", name: "Bénin", code: "bj" },
  { flag: "🇬🇭", name: "Ghana", code: "gh" },
  { flag: "🇳🇬", name: "Nigeria", code: "ng" },
  { flag: "🇭🇹", name: "Haïti", code: "ht" },
  { flag: "🏝️", name: "Antilles", code: "antilles" },
];

type DropdownKey = "categories" | "origines" | null;

const navLinks = [
  { key: "Prestataires", href: "/explorer", dropdown: null as DropdownKey },
  { key: "Catégories", href: "/explorer", dropdown: "categories" as DropdownKey },
  { key: "Origines & cultures", href: "/trouver-par-pays", dropdown: "origines" as DropdownKey },
  { key: "Devenir Prestataire", href: "/devenir-prestataire", dropdown: null as DropdownKey },
];

export function Header() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const openDropdown = (key: DropdownKey) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(key);
  };

  const closeDropdownDelayed = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
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
                const hasDropdown = !!link.dropdown;
                if (hasDropdown) {
                  const menuKey = link.dropdown as Exclude<DropdownKey, null>;
                  return (
                    <div
                      key={link.key}
                      className="flex items-center"
                      onMouseEnter={() => openDropdown(menuKey)}
                      onMouseLeave={closeDropdownDelayed}
                    >
                      <Link
                        to={link.href}
                        className={`font-body text-[11px] xl:text-[12px] tracking-widest uppercase transition-all duration-300 hover:text-champagne flex items-center gap-1 ${
                          showSolid ? "text-chocolate" : "text-ivory"
                        } ${
                          activeDropdown === menuKey ? "text-champagne" : ""
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

        {/* Lightweight Dropdown Panels */}
        <AnimatePresence>
          {activeDropdown && (
            <motion.div
              key={activeDropdown}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:block"
              onMouseEnter={() => openDropdown(activeDropdown)}
              onMouseLeave={closeDropdownDelayed}
            >
              {activeDropdown === "categories" && <CategoriesDropdown />}
              {activeDropdown === "origines" && <OriginesDropdown />}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
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

/* ───────── Lightweight Categories Dropdown ───────── */
function CategoriesDropdown() {
  return (
    <div className="w-full bg-popover/95 backdrop-blur-lg shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] border-b border-border/40">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <h3 className="font-serif text-base text-chocolate mb-4">Nos catégories</h3>
        <div className="grid grid-cols-3 gap-x-6 gap-y-0.5">
          {categoryFamilies.map((cat) => (
            <Link
              key={cat.href}
              to={cat.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-muted-foreground hover:text-champagne-dark hover:bg-champagne/5 transition-all group"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-champagne/8 text-champagne group-hover:bg-champagne/15 transition-colors shrink-0">
                <cat.icon size={13} />
              </span>
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── Lightweight Origines Dropdown ───────── */
function OriginesDropdown() {
  return (
    <div className="w-full bg-popover/95 backdrop-blur-lg shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] border-b border-border/40">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <h3 className="font-serif text-base text-chocolate mb-4">Explorer par origine & culture</h3>
        <div className="grid grid-cols-4 gap-x-4 gap-y-0.5">
          {origins.map((o) => (
            <Link
              key={o.code}
              to={`/trouver-par-pays?pays=${o.code}`}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-body text-muted-foreground hover:text-champagne-dark hover:bg-champagne/5 transition-all"
            >
              <span className="text-base shrink-0">{o.flag}</span>
              {o.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── Mobile Menu ───────── */

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

  const toggle = (key: string) => {
    setExpandedSection(expandedSection === key ? null : key);
  };

  const mobileNavItems = [
    { key: "Prestataires", href: "/explorer" },
    { key: "Catégories", href: "/explorer", hasChildren: true },
    { key: "Origines & cultures", href: "/trouver-par-pays", hasChildren: true },
    { key: "Devenir Prestataire", href: "/devenir-prestataire" },
  ];

  return (
    <nav className="flex flex-col">
      <div className="flex flex-col pt-2">
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
                    {item.key === "Catégories" && (
                      <div className="px-6 py-3 space-y-0.5">
                        {categoryFamilies.map(cat => (
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
                      </div>
                    )}

                    {item.key === "Origines & cultures" && (
                      <div className="px-6 py-3 space-y-0.5">
                        {origins.map(origin => (
                          <Link
                            key={origin.code}
                            to={`/trouver-par-pays?pays=${origin.code}`}
                            onClick={close}
                            className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-chocolate hover:bg-champagne/10 transition-colors"
                          >
                            <span className="text-lg shrink-0">{origin.flag}</span>
                            {origin.name}
                          </Link>
                        ))}
                        <Link to="/trouver-par-pays" onClick={close} className="block text-center text-xs text-champagne font-medium py-2 mt-1 border-t border-border/30 pt-3">
                          Toutes les origines →
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

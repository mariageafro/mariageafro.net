import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/contexts/auth-context";
import { useUserRole } from "@/hooks/use-user-role";
import { useLanguage, translateUI } from "@/contexts/language-context";
import logo from "@/assets/logo-mariageafro.png";

const navLinks = [
  { key: "Accueil", href: "/" },
  { key: "Prestataires", href: "/prestataires" },
  { key: "Par Pays", href: "/trouver-par-pays" },
  { key: "Premium", href: "/prestataires-premium" },
  { key: "Blog", href: "/blog" },
  { key: "💍 Outils Mariés", href: "/outils-maries" },
  { key: "Devenir Prestataire", href: "/devenir-prestataire" },
];

const featuredCategories = [
  { name: "Vidéaste", slug: "videaste" },
  { name: "Photographe", slug: "photographe" },
  { name: "DJ & Musique", slug: "dj-musique" },
  { name: "Wedding Planner", slug: "wedding-planner" },
  { name: "Animation", slug: "animation" },
  { name: "Beauté", slug: "coiffure-beaute" },
];

export function Header() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.href}
                className={`font-body text-[12px] tracking-widest uppercase transition-all duration-300 hover:text-champagne ${
                  showSolid ? "text-chocolate" : "text-ivory"
                } ${
                  location.pathname === link.href ? "text-champagne font-medium" : "font-normal"
                }`}
              >
                {translateUI(link.key, lang)}
              </Link>
            ))}
          </nav>

           {/* Featured categories quick links + Right side */}
           <div className="hidden xl:flex items-center gap-2 mx-6 border-l border-champagne/20 pl-6">
             {featuredCategories.slice(0, 3).map((cat) => (
               <Link
                 key={cat.slug}
                 to={`/categories/${cat.slug}`}
                 className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                   showSolid ? "text-chocolate hover:bg-champagne/10" : "text-ivory hover:bg-white/10"
                 }`}
               >
                 {cat.name}
               </Link>
             ))}
           </div>

           {/* Right side: Lang + Auth + Mobile toggle */}
           <div className="flex items-center gap-3">
             {/* Language Switcher */}
             <div className="flex items-center gap-0.5 rounded-full bg-secondary/50 p-0.5">
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
                    <span className={`text-sm px-3 py-1.5 hidden xl:inline ${showSolid ? "text-chocolate" : "text-ivory"}`}>
                      {user?.email}
                    </span>
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-ivory border-t border-border"
          >
            <nav className="container-editorial py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                 <Link
                   key={link.key}
                   to={link.href}
                   onClick={() => setIsMobileMenuOpen(false)}
                   className={`font-body text-base py-2 text-chocolate hover:text-champagne transition-colors ${
                     location.pathname === link.href ? "text-champagne font-medium" : ""
                   }`}
                 >
                   {translateUI(link.key, lang)}
                 </Link>
               ))}

               {/* Mobile language switcher */}
               <div className="flex items-center gap-2 py-2 border-t border-border mt-2 pt-4">
                 <Globe className="w-4 h-4 text-muted-foreground" />
                 <button onClick={() => { setLang("fr"); }} className={`px-3 py-1 rounded text-sm ${lang === "fr" ? "bg-champagne text-primary-foreground" : "text-muted-foreground"}`}>Français</button>
                 <button onClick={() => { setLang("en"); }} className={`px-3 py-1 rounded text-sm ${lang === "en" ? "bg-champagne text-primary-foreground" : "text-muted-foreground"}`}>English</button>
               </div>

               {isAuthenticated ? (
                 <div className="flex flex-col gap-3 mt-4 border-t border-border pt-4">
                   {role === 'admin' && (
                     <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="font-body text-base py-2 text-chocolate hover:text-champagne flex items-center gap-2">
                       <Shield className="w-4 h-4" /> Admin
                     </Link>
                   )}
                   {role === 'prestataire' && (
                     <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="font-body text-base py-2 text-chocolate hover:text-champagne flex items-center gap-2">
                       <LayoutDashboard className="w-4 h-4" /> Espace Pro
                     </Link>
                   )}
                   <div className="text-sm text-muted-foreground">{user?.email}</div>
                   <Button
                     variant="outline"
                     className="w-full justify-start"
                     onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                   >
                     <LogOut className="w-4 h-4 mr-2" />
                     {translateUI("Déconnexion", lang)}
                   </Button>
                 </div>
               ) : (
                 <Button variant="gold" className="mt-4 w-full" asChild>
                   <Link to="/auth">{translateUI("Connexion", lang)}</Link>
                 </Button>
               )}
             </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

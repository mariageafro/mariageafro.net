import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/contexts/auth-context";
import logo from "@/assets/logo-mariageafro.png";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "Prestataires", href: "/prestataires" },
  { name: "Inspiration", href: "/inspiration" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, signOut } = useAuthContext();

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
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-body text-[13px] tracking-widest uppercase transition-all duration-300 hover:text-champagne ${
                  showSolid ? "text-chocolate" : "text-ivory"
                } ${
                  location.pathname === link.href ? "text-champagne font-medium" : "font-normal"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

           {/* Right side: Auth + Mobile toggle */}
           <div className="flex items-center gap-3">
             {isAuthenticated ? (
               <div className="flex items-center gap-2">
                 <Link
                   to="/espace-pro"
                   className={`text-sm font-medium px-3 py-1 rounded transition-colors ${
                     showSolid ? "text-chocolate hover:bg-champagne/10" : "text-ivory hover:bg-white/10"
                   }`}
                 >
                   {user?.email}
                 </Link>
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
                 <Link to="/auth">Connexion</Link>
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
                   key={link.name}
                   to={link.href}
                   onClick={() => setIsMobileMenuOpen(false)}
                   className={`font-body text-base py-2 text-chocolate hover:text-champagne transition-colors ${
                     location.pathname === link.href ? "text-champagne font-medium" : ""
                   }`}
                 >
                   {link.name}
                 </Link>
               ))}
               {isAuthenticated ? (
                 <div className="flex flex-col gap-3 mt-4 border-t border-border pt-4">
                   <div className="text-sm text-muted-foreground">{user?.email}</div>
                   <Button
                     variant="outline"
                     className="w-full justify-start"
                     onClick={() => {
                       signOut();
                       setIsMobileMenuOpen(false);
                     }}
                   >
                     <LogOut className="w-4 h-4 mr-2" />
                     Déconnexion
                   </Button>
                 </div>
               ) : (
                 <Button variant="gold" className="mt-4 w-full" asChild>
                   <Link to="/auth">Connexion</Link>
                 </Button>
               )}
             </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

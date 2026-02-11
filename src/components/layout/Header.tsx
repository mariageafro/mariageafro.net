import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-mariageafro.png";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "Prestataires", href: "/prestataires" },
  { name: "Inspiration", href: "/inspiration" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";
  const headerBg = isScrolled || !isHomePage
    ? "bg-ivory/95 backdrop-blur-md shadow-soft"
    : "bg-transparent";
  const textColor = isScrolled || !isHomePage ? "text-chocolate" : "text-ivory";
  const logoFilter = "";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
    >
      <div className="container-editorial">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="MariageAfro"
              className={`h-16 w-auto transition-all duration-300 ${logoFilter}`}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-body text-sm tracking-wide transition-colors duration-300 hover:text-champagne ${textColor} ${
                  location.pathname === link.href ? "text-champagne font-medium" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              variant={isScrolled || !isHomePage ? "gold-outline" : "hero-outline"}
              size="sm"
              asChild
            >
              <Link to="/espace-pro">Espace Pro</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`lg:hidden p-2 ${textColor}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
              <Button variant="gold" className="mt-4" asChild>
                <Link to="/espace-pro">Espace Pro</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

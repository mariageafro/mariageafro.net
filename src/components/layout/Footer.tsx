import { Link } from "react-router-dom";
import { Heart, Instagram, Facebook, Youtube, Mail } from "lucide-react";
import logo from "@/assets/logo-mariageafro.png";

const footerLinks = {
  navigation: [
    { name: "Accueil", href: "/" },
    { name: "Prestataires", href: "/prestataires" },
    { name: "Par Pays", href: "/trouver-par-pays" },
    { name: "Premium", href: "/prestataires-premium" },
    { name: "Blog", href: "/blog" },
  ],
  services: [
    { name: "DJ & Musique", href: "/prestataires?category=dj" },
    { name: "Photographes", href: "/prestataires?category=photo" },
    { name: "Traiteurs", href: "/prestataires?category=traiteur" },
    { name: "Décoration", href: "/prestataires?category=deco" },
  ],
  legal: [
    { name: "Mentions légales", href: "/mentions-legales" },
    { name: "Politique de confidentialité", href: "/confidentialite" },
    { name: "CGU", href: "/cgu" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/mariageafro", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/mariageafro", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com/mariageafro", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-chocolate text-ivory/90">
      {/* Main Footer */}
      <div className="container-editorial section-padding pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src={logo} alt="MariageAfro" className="h-20 w-auto mb-6 brightness-0 invert" />
            <p className="font-body text-sm leading-relaxed text-ivory/70 mb-6">
              La plateforme de référence pour votre mariage afro. Trouvez les meilleurs prestataires qui comprennent vos traditions et célèbrent votre culture.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-ivory/10 flex items-center justify-center hover:bg-champagne hover:text-chocolate transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-lg font-medium text-ivory mb-6">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="font-body text-sm text-ivory/70 hover:text-champagne transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-medium text-ivory mb-6">Catégories</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="font-body text-sm text-ivory/70 hover:text-champagne transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-serif text-lg font-medium text-ivory mb-6">Contact</h4>
            <a
              href="mailto:contact@mariageafro.com"
              className="flex items-center gap-2 font-body text-sm text-ivory/70 hover:text-champagne transition-colors mb-4"
            >
              <Mail size={16} />
              contact@mariageafro.com
            </a>
            <p className="font-body text-sm text-ivory/70 mb-4">
              Paris, France & International
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-champagne hover:text-champagne-light transition-colors font-body text-sm"
            >
              Nous contacter →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ivory/10">
        <div className="container-editorial py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-ivory/50 flex items-center gap-1">
            © 2024 MariageAfro. Fait avec <Heart size={12} className="text-champagne" /> pour la communauté afro.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="font-body text-xs text-ivory/50 hover:text-ivory/80 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

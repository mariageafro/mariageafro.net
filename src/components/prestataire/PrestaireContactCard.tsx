import { motion } from 'framer-motion';
import { Phone, MessageCircle, Globe, Instagram, Globe as WebIcon, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/contexts/auth-context';
import { useLanguage, translateUI } from '@/contexts/language-context';
import type { Tables } from '@/integrations/supabase/types';

interface PrestaireContactCardProps {
  prestataire: Tables<'prestataires'>;
}

export function PrestaireContactCard({ prestataire }: PrestaireContactCardProps) {
  const { isAuthenticated } = useAuthContext();
  const { lang } = useLanguage();

  const handleWhatsApp = () => {
    if (prestataire.whatsapp) {
      const message = encodeURIComponent(lang === 'en' ? 'Hello, I am interested in your services for my wedding.' : 'Bonjour, je suis intéressé(e) par vos services pour mon mariage.');
      window.open(`https://wa.me/${prestataire.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
    }
  };

  const handleCall = () => {
    if (prestataire.telephone) {
      window.location.href = `tel:${prestataire.telephone}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="sticky top-28 space-y-6"
    >
      {/* Contact Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-champagne/10 to-gold/10 border border-champagne/20">
        <h3 className="font-serif text-xl text-chocolate mb-6">{translateUI("Entrez en contact", lang)}</h3>

        {isAuthenticated ? (
          <>
            <div className="space-y-4 mb-6">
              {prestataire.telephone && (
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gold" />
                  <span className="font-body text-sm">{prestataire.telephone}</span>
                </div>
              )}
              {prestataire.whatsapp && (
                <div className="flex items-center gap-3">
                  <MessageCircle size={18} className="text-gold" />
                  <span className="font-body text-sm">{prestataire.whatsapp}</span>
                </div>
              )}
              {(prestataire as any).email && (
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-gold" />
                  <span className="font-body text-sm">{(prestataire as any).email}</span>
                </div>
              )}
              {prestataire.langues && prestataire.langues.length > 0 && (
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-gold" />
                  <span className="font-body text-sm">{prestataire.langues.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {prestataire.whatsapp && (
                <Button variant="gold" className="w-full" size="lg" onClick={handleWhatsApp}>
                  <MessageCircle size={18} /> WhatsApp
                </Button>
              )}
              {prestataire.telephone && (
                <Button variant="outline" className="w-full" size="lg" onClick={handleCall}>
                  <Phone size={18} /> {translateUI("Appeler", lang)}
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <Lock size={24} className="mx-auto text-muted-foreground mb-3" />
            <p className="font-body text-sm text-muted-foreground mb-4">
              {translateUI("Connectez-vous pour voir les coordonnées", lang)}
            </p>
            <Button variant="gold" className="w-full" asChild>
              <Link to="/auth">{translateUI("Connexion", lang)}</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Social Links - always visible */}
      <div className="p-6 rounded-2xl bg-secondary space-y-4">
        <h4 className="font-body text-sm text-muted-foreground font-medium">{translateUI("Suivez-nous", lang)}</h4>
        <div className="space-y-3">
          {prestataire.site_web && (
            <a href={prestataire.site_web} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors">
              <WebIcon size={18} className="text-chocolate" />
              <span className="font-body text-sm text-chocolate hover:underline">{translateUI("Site web", lang)}</span>
            </a>
          )}
          {prestataire.instagram && (
            <a href={`https://instagram.com/${prestataire.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors">
              <Instagram size={18} className="text-chocolate" />
              <span className="font-body text-sm text-chocolate hover:underline">@{prestataire.instagram}</span>
            </a>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="p-6 rounded-2xl bg-secondary">
        <h4 className="font-body text-sm text-muted-foreground mb-3">{translateUI("À propos", lang)}</h4>
        <div className="space-y-3 font-body text-sm">
          {prestataire.ville && (
            <p>
              <span className="text-muted-foreground">{translateUI("Localisation", lang)}:</span><br />
              <span className="text-chocolate font-medium">{prestataire.ville}{prestataire.pays ? `, ${prestataire.pays}` : ''}</span>
            </p>
          )}
          {prestataire.origine_culturelle && (
            <p>
              <span className="text-muted-foreground">{translateUI("Tradition", lang)}:</span><br />
              <span className="text-chocolate font-medium">{prestataire.origine_culturelle}</span>
            </p>
          )}
          {prestataire.verified && (
            <div className="pt-3 border-t border-border">
              <span className="inline-block px-3 py-1 rounded-full bg-champagne/20 text-champagne-dark font-body text-xs font-semibold">
                {translateUI("Professionnel vérifié", lang)}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

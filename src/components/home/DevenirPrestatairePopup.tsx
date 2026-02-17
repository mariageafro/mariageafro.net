import { useState, useEffect } from "react";
import { X, Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "devenir-presta-popup-dismissed";
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes before showing again

export function DevenirPrestatairePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedAt = sessionStorage.getItem(STORAGE_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < COOLDOWN_MS) return;
    sessionStorage.removeItem(STORAGE_KEY);
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-lg z-50"
        >
          <div className="relative bg-gradient-to-br from-chocolate via-chocolate to-chocolate/95 rounded-2xl p-7 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] border-2 border-champagne/30 overflow-hidden ring-1 ring-champagne/10">
            {/* Decorative accents */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-champagne/25 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-champagne/10 to-transparent rounded-tr-full" />

            <button
              onClick={dismiss}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-ivory/10 hover:bg-ivory/20 flex items-center justify-center transition-colors"
              aria-label="Fermer"
            >
              <X size={14} className="text-ivory" />
            </button>

            <div className="flex items-start gap-5">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-champagne via-gold to-champagne flex items-center justify-center shadow-lg animate-pulse">
                <Crown size={26} className="text-chocolate" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl text-ivory mb-1.5">
                  🎉 Vous êtes prestataire ?
                </h3>
                <p className="font-body text-sm text-ivory/80 mb-5 leading-relaxed">
                  Rejoignez <strong className="text-champagne">MariageAfro</strong> et boostez votre visibilité auprès de milliers de futurs mariés.
                </p>
                <Link
                  to="/devenir-prestataire"
                  onClick={dismiss}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-champagne via-gold to-champagne font-body text-sm font-bold text-chocolate hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] hover:scale-105 transition-all duration-300"
                >
                  Devenir Prestataire
                  <ArrowRight size={16} className="animate-bounce" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

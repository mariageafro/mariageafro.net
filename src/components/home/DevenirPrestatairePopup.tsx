import { useState, useEffect } from "react";
import { X, Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "devenir-presta-popup-dismissed";

export function DevenirPrestatairePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50"
        >
          <div className="relative bg-chocolate rounded-2xl p-6 shadow-2xl border border-champagne/20 overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-champagne/20 to-transparent rounded-bl-full" />

            <button
              onClick={dismiss}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-ivory/10 hover:bg-ivory/20 flex items-center justify-center transition-colors"
              aria-label="Fermer"
            >
              <X size={14} className="text-ivory" />
            </button>

            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-champagne to-gold flex items-center justify-center">
                <Crown size={22} className="text-chocolate" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-ivory mb-1">
                  Vous êtes prestataire ?
                </h3>
                <p className="font-body text-sm text-ivory/70 mb-4">
                  Rejoignez MariageAfro et boostez votre visibilité auprès de milliers de futurs mariés.
                </p>
                <Link
                  to="/devenir-prestataire"
                  onClick={dismiss}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-champagne to-gold font-body text-sm font-semibold text-chocolate hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Devenir Prestataire
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

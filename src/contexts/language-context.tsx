import React, { createContext, useContext, useState, useEffect } from "react";

type Lang = "fr" | "en";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (fr: string | null | undefined, en: string | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  setLang: () => {},
  t: (fr) => fr || "",
});

export const useLanguage = () => useContext(LanguageContext);

// Common UI translations
const UI_TRANSLATIONS: Record<string, Record<Lang, string>> = {
  "Accueil": { fr: "Accueil", en: "Home" },
  "Prestataires": { fr: "Prestataires", en: "Vendors" },
  "Par Pays": { fr: "Par Pays", en: "By Country" },
  "Premium": { fr: "Premium", en: "Premium" },
  "Blog": { fr: "Blog", en: "Blog" },
  "💍 Outils Mariés": { fr: "💍 Outils Mariés", en: "💍 Wedding Tools" },
  "💒 Mon Mariage": { fr: "💒 Mon Mariage", en: "💒 My Wedding" },
  "Devenir Prestataire": { fr: "Devenir Prestataire", en: "Become a Vendor" },
  "Connexion": { fr: "Connexion", en: "Sign In" },
  "Déconnexion": { fr: "Déconnexion", en: "Sign Out" },
  "Rechercher un prestataire...": { fr: "Rechercher un prestataire...", en: "Search a vendor..." },
  "Toutes les villes": { fr: "Toutes les villes", en: "All cities" },
  "Toutes les catégories": { fr: "Toutes les catégories", en: "All categories" },
  "Toutes les cultures": { fr: "Toutes les cultures", en: "All cultures" },
  "Toutes les langues": { fr: "Toutes les langues", en: "All languages" },
  "Pertinence": { fr: "Pertinence", en: "Relevance" },
  "Distance": { fr: "Distance", en: "Distance" },
  "Note": { fr: "Note (décroissant)", en: "Rating (descending)" },
  "Avis": { fr: "Avis (décroissant)", en: "Reviews (descending)" },
  "Réinitialiser": { fr: "Réinitialiser", en: "Reset" },
  "Tous": { fr: "Tous", en: "All" },
  "Autour de moi": { fr: "Autour de moi", en: "Near me" },
  "Catégories vedettes": { fr: "Catégories vedettes", en: "Featured Categories" },
  "Entrez en contact": { fr: "Entrez en contact", en: "Get in touch" },
  "Suivez-nous": { fr: "Suivez-nous", en: "Follow us" },
  "À propos": { fr: "À propos", en: "About" },
  "Localisation": { fr: "Localisation", en: "Location" },
  "Tradition": { fr: "Tradition", en: "Tradition" },
  "Professionnel vérifié": { fr: "✓ Professionnel vérifié", en: "✓ Verified Professional" },
  "Site web": { fr: "Site web", en: "Website" },
  "Appeler": { fr: "Appeler", en: "Call" },
  "prestataires trouvés": { fr: "prestataires trouvés", en: "vendors found" },
  "Aucun prestataire trouvé": { fr: "Aucun prestataire trouvé", en: "No vendors found" },
  "Réinitialiser les filtres": { fr: "Réinitialiser les filtres", en: "Reset filters" },
  "Nos Prestataires": { fr: "Nos Prestataires", en: "Our Vendors" },
  "Connectez-vous pour voir les coordonnées": { fr: "Connectez-vous pour voir les coordonnées", en: "Sign in to see contact details" },
};

export function translateUI(key: string, lang: Lang): string {
  return UI_TRANSLATIONS[key]?.[lang] || key;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("app_lang");
    return (saved === "en" ? "en" : "fr") as Lang;
  });

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  const t = (fr: string | null | undefined, en: string | null | undefined): string => {
    if (lang === "en") return en || fr || "";
    return fr || en || "";
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

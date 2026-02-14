// ============================================================
// Centralized COMPLETE demo data for the Wedding Planner
// Couple: Nadia & Junior — Mariage terminé — Afro-luxe moderne
// ============================================================

export const demoCouple = {
  partner_one_first_name: "Nadia",
  partner_two_first_name: "Junior",
  couple_display_name: "Nadia & Junior",
  wedding_date: "2026-08-12",
  city: "Paris",
  country: "France",
  guest_count: 250,
  estimated_budget: 35000,
  wedding_style: "Afro-luxe moderne",
  couple_quote: "Notre amour est une alliance de cultures et d'élégance.",
  origin_partner_one: "Congo (Kinshasa)",
  origin_partner_two: "Cameroun",
  is_completed: true,
};

// ───────────── BUDGET ─────────────
export const demoBudgetCategories = [
  { name: "Salle & Domaine", amount: 8000, paid: 8000, color: "hsl(38, 45%, 50%)" },
  { name: "Traiteur congolais", amount: 9500, paid: 9500, color: "hsl(43, 75%, 55%)" },
  { name: "Wedding Planner", amount: 3000, paid: 3000, color: "hsl(30, 35%, 45%)" },
  { name: "Photographe", amount: 2500, paid: 2500, color: "hsl(25, 30%, 60%)" },
  { name: "Vidéaste", amount: 3000, paid: 3000, color: "hsl(35, 40%, 65%)" },
  { name: "DJ + MC Atalaku", amount: 2000, paid: 2000, color: "hsl(40, 50%, 45%)" },
  { name: "Groupe live rumba", amount: 1200, paid: 1200, color: "hsl(33, 25%, 70%)" },
  { name: "Chorale gospel", amount: 800, paid: 800, color: "hsl(28, 30%, 55%)" },
  { name: "Son & Lumière", amount: 1800, paid: 1800, color: "hsl(42, 40%, 50%)" },
  { name: "Décoration florale", amount: 2200, paid: 2200, color: "hsl(36, 35%, 60%)" },
  { name: "Location trône royal", amount: 600, paid: 600, color: "hsl(30, 20%, 50%)" },
  { name: "Robe mariée sur mesure", amount: 2000, paid: 2000, color: "hsl(32, 45%, 55%)" },
  { name: "Costume sur mesure", amount: 900, paid: 900, color: "hsl(38, 55%, 60%)" },
  { name: "Location tenues traditionnelles", amount: 1200, paid: 1200, color: "hsl(35, 20%, 65%)" },
  { name: "Maquilleuse", amount: 450, paid: 450, color: "hsl(25, 15%, 45%)" },
  { name: "Coiffeuse", amount: 350, paid: 350, color: "hsl(40, 30%, 55%)" },
  { name: "Wedding Cake 5 étages", amount: 850, paid: 850, color: "hsl(33, 30%, 60%)" },
  { name: "Location voiture Bentley", amount: 800, paid: 800, color: "hsl(37, 25%, 50%)" },
  { name: "Voiturier", amount: 700, paid: 700, color: "hsl(42, 35%, 65%)" },
  { name: "Sécurité", amount: 600, paid: 600, color: "hsl(28, 25%, 60%)" },
  { name: "Transport invités", amount: 1100, paid: 1100, color: "hsl(35, 30%, 50%)" },
  { name: "Hôtel mariés", amount: 600, paid: 600, color: "hsl(30, 40%, 55%)" },
  { name: "Hôtel invités VIP", amount: 1000, paid: 1000, color: "hsl(38, 35%, 60%)" },
  { name: "Photobooth 360", amount: 750, paid: 750, color: "hsl(33, 45%, 50%)" },
  { name: "Drone", amount: 600, paid: 600, color: "hsl(40, 25%, 65%)" },
  { name: "Impression faire-part", amount: 500, paid: 500, color: "hsl(28, 30%, 55%)" },
  { name: "Création site mariage", amount: 300, paid: 300, color: "hsl(35, 20%, 60%)" },
  { name: "Animation enfants", amount: 400, paid: 400, color: "hsl(42, 40%, 55%)" },
  { name: "Bar à cocktails", amount: 800, paid: 800, color: "hsl(30, 35%, 50%)" },
  { name: "Serveurs extra", amount: 600, paid: 600, color: "hsl(38, 25%, 60%)" },
  { name: "Hôtesses accueil", amount: 400, paid: 400, color: "hsl(33, 30%, 55%)" },
  { name: "Coordonnateur logistique", amount: 500, paid: 500, color: "hsl(35, 40%, 50%)" },
  { name: "Éclairage architectural", amount: 450, paid: 450, color: "hsl(40, 35%, 60%)" },
];

export const demoBudgetTarget = 35000;
export const demoBudgetSpent = demoBudgetCategories.reduce((s, c) => s + c.amount, 0);
export const demoBudgetOverrun = demoBudgetSpent - demoBudgetTarget;

// ───────────── PRESTATAIRES ─────────────
export type DemoVendor = {
  id: string;
  name: string;
  role: string;
  photo: string;
  confirmed: boolean;
  deposit: number;
  total: number;
  paid: number;
  remaining: number;
  dueDate: string;
  status: "Payé" | "Partiel" | "Solde à régler";
};

export const demoVendors: DemoVendor[] = [
  { id: "v1", name: "Grâce Events", role: "Wedding Planner", photo: "🎯", confirmed: true, deposit: 1000, total: 3000, paid: 3000, remaining: 0, dueDate: "2026-06-01", status: "Payé" },
  { id: "v2", name: "Sandra N.", role: "Coordinatrice Jour J", photo: "📋", confirmed: true, deposit: 300, total: 800, paid: 800, remaining: 0, dueDate: "2026-08-01", status: "Payé" },
  { id: "v3", name: "Chez Mama Afrika", role: "Traiteur congolais", photo: "🍛", confirmed: true, deposit: 3000, total: 9500, paid: 8500, remaining: 1000, dueDate: "2026-08-05", status: "Solde à régler" },
  { id: "v4", name: "Cake by Fanta", role: "Wedding Cake 5 étages", photo: "🎂", confirmed: true, deposit: 200, total: 850, paid: 850, remaining: 0, dueDate: "2026-08-10", status: "Payé" },
  { id: "v5", name: "Marc Visuals", role: "Photographe", photo: "📸", confirmed: true, deposit: 800, total: 2500, paid: 2500, remaining: 0, dueDate: "2026-08-12", status: "Payé" },
  { id: "v6", name: "Cinéma Afro", role: "Vidéaste", photo: "🎬", confirmed: true, deposit: 1000, total: 3000, paid: 3000, remaining: 0, dueDate: "2026-08-12", status: "Payé" },
  { id: "v7", name: "SkyView Pro", role: "Drone", photo: "🚁", confirmed: true, deposit: 300, total: 600, paid: 600, remaining: 0, dueDate: "2026-08-12", status: "Payé" },
  { id: "v8", name: "DJ Kofi", role: "DJ + MC Atalaku", photo: "🎧", confirmed: true, deposit: 500, total: 1500, paid: 1500, remaining: 0, dueDate: "2026-07-15", status: "Payé" },
  { id: "v9", name: "Papa Wemba Jr", role: "MC Atalaku", photo: "🎤", confirmed: true, deposit: 200, total: 500, paid: 500, remaining: 0, dueDate: "2026-08-01", status: "Payé" },
  { id: "v10", name: "Seben All Stars", role: "Groupe live rumba", photo: "🎵", confirmed: true, deposit: 400, total: 1200, paid: 1200, remaining: 0, dueDate: "2026-07-20", status: "Payé" },
  { id: "v11", name: "Gospel Voices", role: "Chorale gospel", photo: "🎶", confirmed: true, deposit: 300, total: 800, paid: 800, remaining: 0, dueDate: "2026-08-01", status: "Payé" },
  { id: "v12", name: "Dance Empire", role: "Chorégraphe", photo: "💃", confirmed: true, deposit: 150, total: 400, paid: 400, remaining: 0, dueDate: "2026-08-01", status: "Payé" },
  { id: "v13", name: "LightShow Pro", role: "Son & Lumière", photo: "💡", confirmed: true, deposit: 500, total: 1800, paid: 1800, remaining: 0, dueDate: "2026-08-10", status: "Payé" },
  { id: "v14", name: "Flora Luxe", role: "Décoration florale", photo: "🌸", confirmed: true, deposit: 600, total: 2200, paid: 2200, remaining: 0, dueDate: "2026-08-10", status: "Payé" },
  { id: "v15", name: "Royal Thrones", role: "Location trône royal", photo: "👑", confirmed: true, deposit: 200, total: 600, paid: 600, remaining: 0, dueDate: "2026-08-05", status: "Payé" },
  { id: "v16", name: "Atelier Nadège", role: "Robe mariée sur mesure", photo: "👗", confirmed: true, deposit: 800, total: 2000, paid: 2000, remaining: 0, dueDate: "2026-06-15", status: "Payé" },
  { id: "v17", name: "Prestige Homme", role: "Costume sur mesure", photo: "🤵", confirmed: true, deposit: 300, total: 900, paid: 900, remaining: 0, dueDate: "2026-07-01", status: "Payé" },
  { id: "v18", name: "Wax Prestige", role: "Location tenues traditionnelles", photo: "🧵", confirmed: true, deposit: 400, total: 1200, paid: 1200, remaining: 0, dueDate: "2026-08-01", status: "Payé" },
  { id: "v19", name: "Glam by Aïcha", role: "Maquilleuse", photo: "💄", confirmed: true, deposit: 150, total: 450, paid: 450, remaining: 0, dueDate: "2026-08-12", status: "Payé" },
  { id: "v20", name: "Hair by Caro", role: "Coiffeuse", photo: "💇‍♀️", confirmed: true, deposit: 100, total: 350, paid: 350, remaining: 0, dueDate: "2026-08-12", status: "Payé" },
  { id: "v21", name: "Rolls & Class", role: "Location voiture Bentley", photo: "🏎️", confirmed: true, deposit: 300, total: 800, paid: 800, remaining: 0, dueDate: "2026-08-10", status: "Payé" },
  { id: "v22", name: "VIP Parking", role: "Voiturier", photo: "🚗", confirmed: true, deposit: 200, total: 700, paid: 700, remaining: 0, dueDate: "2026-08-10", status: "Payé" },
  { id: "v23", name: "SecuEvent", role: "Sécurité", photo: "🛡️", confirmed: true, deposit: 200, total: 600, paid: 600, remaining: 0, dueDate: "2026-08-10", status: "Payé" },
  { id: "v24", name: "TransAfro", role: "Transport invités", photo: "🚌", confirmed: true, deposit: 300, total: 1100, paid: 1100, remaining: 0, dueDate: "2026-08-10", status: "Payé" },
  { id: "v25", name: "Hôtel Renaissance", role: "Hôtel mariés", photo: "🏨", confirmed: true, deposit: 200, total: 600, paid: 600, remaining: 0, dueDate: "2026-08-11", status: "Payé" },
  { id: "v26", name: "Hôtel Étoile", role: "Hôtel invités VIP", photo: "⭐", confirmed: true, deposit: 300, total: 1000, paid: 1000, remaining: 0, dueDate: "2026-08-11", status: "Payé" },
  { id: "v27", name: "360 Booth Paris", role: "Photobooth 360", photo: "📷", confirmed: true, deposit: 200, total: 750, paid: 750, remaining: 0, dueDate: "2026-08-10", status: "Payé" },
  { id: "v28", name: "PrintLuxe", role: "Impression faire-part", photo: "🖨️", confirmed: true, deposit: 200, total: 500, paid: 500, remaining: 0, dueDate: "2026-05-01", status: "Payé" },
  { id: "v29", name: "WebWedding", role: "Création site mariage", photo: "💻", confirmed: true, deposit: 100, total: 300, paid: 300, remaining: 0, dueDate: "2026-04-01", status: "Payé" },
  { id: "v30", name: "Kids Party", role: "Animation enfants", photo: "🎈", confirmed: true, deposit: 100, total: 400, paid: 400, remaining: 0, dueDate: "2026-08-05", status: "Payé" },
  { id: "v31", name: "Cocktail Royal", role: "Bar à cocktails", photo: "🍸", confirmed: true, deposit: 300, total: 800, paid: 800, remaining: 0, dueDate: "2026-08-10", status: "Payé" },
  { id: "v32", name: "Staff Premium", role: "Serveurs extra", photo: "🍽️", confirmed: true, deposit: 200, total: 600, paid: 600, remaining: 0, dueDate: "2026-08-10", status: "Payé" },
  { id: "v33", name: "Accueil VIP", role: "Hôtesses accueil", photo: "👋", confirmed: true, deposit: 100, total: 400, paid: 400, remaining: 0, dueDate: "2026-08-10", status: "Payé" },
  { id: "v34", name: "LogiWed", role: "Coordonnateur logistique", photo: "📊", confirmed: true, deposit: 150, total: 500, paid: 500, remaining: 0, dueDate: "2026-08-01", status: "Payé" },
  { id: "v35", name: "Lumière d'Or", role: "Éclairage architectural", photo: "✨", confirmed: true, deposit: 150, total: 450, paid: 450, remaining: 0, dueDate: "2026-08-10", status: "Payé" },
];

// ───────────── RSVP ─────────────
export const demoRsvp = {
  total: 250,
  confirmed: 212,
  pending: 28,
  declined: 10,
  companions: 146,
};

export type DemoGuest = {
  id: string;
  first_name: string;
  last_name: string;
  group: string;
  status: "confirmed" | "pending" | "declined";
  companions: number;
  dietary?: string;
  hotel?: boolean;
  transport?: boolean;
  mealChoice?: string;
  steps: { mairie: boolean; religieux: boolean; reception: boolean; brunch: boolean };
};

const guestNames: [string, string, string][] = [
  ["Amina", "Diallo", "Famille Nadia"], ["Patrick", "Mbeki", "Famille Junior"], ["Fatou", "Sow", "Amis Paris"],
  ["Christian", "Nkosi", "Famille Junior"], ["Aïssatou", "Bah", "Famille Nadia"], ["Yves", "Kamga", "Collègues"],
  ["Mariama", "Touré", "Famille Nadia"], ["Éric", "Lukaku", "Amis Paris"], ["Carine", "Moussavou", "Amis Paris"],
  ["David", "Okafor", "Famille Junior"], ["Bintou", "Keita", "Famille Nadia"], ["Paul", "Essomba", "Collègues"],
  ["Awa", "Ndiaye", "Famille Nadia"], ["Serge", "Bokassa", "Famille Junior"], ["Rachel", "Fofana", "Amis Paris"],
  ["Thierry", "Nzamba", "Collègues"], ["Khadija", "Camara", "Famille Nadia"], ["Hervé", "Tshimanga", "Famille Junior"],
  ["Salamata", "Balde", "Famille Nadia"], ["Jules", "Onana", "Amis Paris"], ["Clarisse", "Mboyo", "Collègues"],
  ["Moussa", "Sylla", "Famille Nadia"], ["Gervais", "Eto'o", "Famille Junior"], ["Nafissatou", "Dia", "Amis Paris"],
  ["Blaise", "Mutombo", "Famille Junior"], ["Hawa", "Barry", "Famille Nadia"], ["Alain", "Tchami", "Collègues"],
  ["Adama", "Konaté", "Famille Nadia"], ["Roger", "Lumu", "Famille Junior"], ["Mariam", "Coulibaly", "Amis Paris"],
];

const mealChoices = ["Poulet Yassa", "Mafé Bœuf", "Poisson braisé", "Végétarien", "Menu enfant"];

export const demoGuests: DemoGuest[] = guestNames.map(([fn, ln, grp], i) => ({
  id: `g${i + 1}`,
  first_name: fn,
  last_name: ln,
  group: grp,
  status: i < 22 ? "confirmed" : i < 27 ? "pending" : "declined",
  companions: i < 22 ? Math.floor(Math.random() * 3) : 0,
  dietary: i % 7 === 0 ? "Halal" : i % 11 === 0 ? "Végétarien" : undefined,
  hotel: i < 10 || i % 5 === 0,
  transport: i < 15 || i % 4 === 0,
  mealChoice: i < 22 ? mealChoices[i % mealChoices.length] : undefined,
  steps: {
    mairie: i < 22,
    religieux: i < 20,
    reception: i < 25,
    brunch: i < 15,
  },
}));

// ───────────── TIMELINE JOUR J ─────────────
export const demoTimeline = [
  { id: "tl0", start_time: "06:00", end_time: "08:00", title: "Préparatifs mariée", address: "Suite Présidentielle, Hôtel Renaissance", responsible: "Glam by Aïcha & Hair by Caro", budget: 800, icon: "💄" },
  { id: "tl1", start_time: "07:00", end_time: "08:30", title: "Préparatifs marié", address: "Suite VIP, Hôtel Renaissance", responsible: "Prestige Homme", budget: 300, icon: "🤵" },
  { id: "tl2", start_time: "08:30", end_time: "10:30", title: "Cérémonie de la Dot", address: "Résidence familiale Nadia, Montreuil", responsible: "Familles + Grâce Events", budget: 1200, icon: "🎁" },
  { id: "tl3", start_time: "10:00", end_time: "11:00", title: "Mairie du 8ème", address: "Mairie du 8ème, 3 Rue de Lisbonne, Paris", responsible: "Coordinatrice Sandra", budget: 0, icon: "🏛️" },
  { id: "tl4", start_time: "11:30", end_time: "12:30", title: "Cérémonie religieuse", address: "Église Saint-Sulpice, Paris", responsible: "Gospel Voices + Coordinatrice", budget: 800, icon: "⛪" },
  { id: "tl5", start_time: "13:00", end_time: "14:30", title: "Photos couple", address: "Pont Alexandre III & Jardin des Tuileries", responsible: "Marc Visuals + SkyView Pro", budget: 500, icon: "📸" },
  { id: "tl6", start_time: "15:00", end_time: "16:30", title: "Vin d'honneur", address: "Jardins de la Salle Renaissance", responsible: "Cocktail Royal + Hôtesses", budget: 1200, icon: "🥂" },
  { id: "tl7", start_time: "17:00", end_time: "17:30", title: "Entrée des mariés", address: "Grande Salle Renaissance", responsible: "MC Papa Wemba Jr + Dance Empire", budget: 400, icon: "👑" },
  { id: "tl8", start_time: "18:00", end_time: "18:30", title: "Danse traditionnelle congolaise", address: "Grande Salle Renaissance", responsible: "Dance Empire + Seben All Stars", budget: 500, icon: "💃" },
  { id: "tl9", start_time: "19:00", end_time: "20:30", title: "Dîner gastronomique afro", address: "Grande Salle Renaissance", responsible: "Chez Mama Afrika + Serveurs", budget: 9500, icon: "🍛" },
  { id: "tl10", start_time: "19:30", end_time: "20:00", title: "Show Atalaku", address: "Grande Salle Renaissance", responsible: "Papa Wemba Jr + DJ Kofi", budget: 500, icon: "🎤" },
  { id: "tl11", start_time: "21:00", end_time: "21:30", title: "Coupure du gâteau", address: "Grande Salle Renaissance", responsible: "Cake by Fanta", budget: 850, icon: "🎂" },
  { id: "tl12", start_time: "22:00", end_time: "23:00", title: "Ouverture de bal", address: "Grande Salle Renaissance", responsible: "DJ Kofi + Lumière d'Or", budget: 450, icon: "🎵" },
  { id: "tl13", start_time: "23:00", end_time: "01:00", title: "After Party", address: "Grande Salle Renaissance", responsible: "DJ Kofi", budget: 0, icon: "🎉" },
  { id: "tl14", start_time: "01:00", end_time: "03:00", title: "Seben live", address: "Grande Salle Renaissance", responsible: "Seben All Stars", budget: 1200, icon: "🎸" },
  { id: "tl15", start_time: "04:00", end_time: "04:30", title: "Clôture & départ", address: "Grande Salle Renaissance", responsible: "Grâce Events", budget: 0, icon: "🌙" },
];

// ───────────── WISHLIST ─────────────
export const demoWishlist = [
  { id: "w1", title: "Voyage Zanzibar", amount: 3000, payment: "PayPal", icon: "✈️", status: "Réservé" },
  { id: "w2", title: "Participation lune de miel", amount: 0, payment: "RIB", icon: "🌴", status: "Libre" },
  { id: "w3", title: "TV Samsung 65\"", amount: 1200, payment: "Amazon", icon: "📺", status: "Acheté" },
  { id: "w4", title: "Salon design", amount: 2400, payment: "Virement", icon: "🛋️", status: "Disponible" },
  { id: "w5", title: "Machine à café Nespresso", amount: 450, payment: "Revolut", icon: "☕", status: "Acheté" },
  { id: "w6", title: "Service de table Villeroy", amount: 800, payment: "Stripe", icon: "🍽️", status: "Réservé" },
];

// ───────────── CHECKLIST (all done) ─────────────
export const demoTasks = [
  { id: "t1", title: "Réserver la salle de réception", category: "lieu", done: true, priority: "urgent", due_date: "2025-12-15" },
  { id: "t2", title: "Choisir le traiteur", category: "traiteur", done: true, priority: "high", due_date: "2026-02-01" },
  { id: "t3", title: "Réserver le photographe", category: "photo", done: true, priority: "high", due_date: "2026-02-15" },
  { id: "t4", title: "Commander les faire-part", category: "papeterie", done: true, priority: "medium", due_date: "2026-04-01" },
  { id: "t5", title: "Choisir la robe", category: "tenues", done: true, priority: "high", due_date: "2026-03-01" },
  { id: "t6", title: "Réserver le DJ", category: "musique", done: true, priority: "medium", due_date: "2026-03-15" },
  { id: "t7", title: "Organiser la dot", category: "tradition", done: true, priority: "high", due_date: "2026-04-15" },
  { id: "t8", title: "Envoyer les faire-part", category: "papeterie", done: true, priority: "high", due_date: "2026-06-01" },
  { id: "t9", title: "Finaliser le plan de table", category: "organisation", done: true, priority: "high", due_date: "2026-07-01" },
  { id: "t10", title: "Confirmer tous les prestataires", category: "general", done: true, priority: "urgent", due_date: "2026-07-15" },
  { id: "t11", title: "Préparer le planning Jour J", category: "organisation", done: true, priority: "high", due_date: "2026-07-20" },
  { id: "t12", title: "Relancer les RSVP manquants", category: "invites", done: true, priority: "high", due_date: "2026-07-25" },
  { id: "t13", title: "Derniers essayages", category: "tenues", done: true, priority: "medium", due_date: "2026-08-01" },
  { id: "t14", title: "Commander les pagnes", category: "tradition", done: true, priority: "medium", due_date: "2026-06-15" },
  { id: "t15", title: "Réserver le groupe live", category: "musique", done: true, priority: "high", due_date: "2026-04-01" },
  { id: "t16", title: "Organiser le transport", category: "logistique", done: true, priority: "medium", due_date: "2026-07-01" },
  { id: "t17", title: "Réserver le photobooth", category: "animation", done: true, priority: "low", due_date: "2026-06-01" },
  { id: "t18", title: "Sécuriser la salle", category: "logistique", done: true, priority: "high", due_date: "2026-07-15" },
  { id: "t19", title: "Réserver la chorale gospel", category: "musique", done: true, priority: "high", due_date: "2026-05-01" },
  { id: "t20", title: "Commander le wedding cake", category: "traiteur", done: true, priority: "medium", due_date: "2026-07-01" },
];

// ───────────── COMPUTED HELPERS ─────────────
export function getDemoBudgetTotals() {
  const total = demoBudgetSpent;
  const paid = demoBudgetCategories.reduce((s, c) => s + c.paid, 0);
  const remaining = demoVendors.reduce((s, v) => s + v.remaining, 0);
  return { total: demoBudgetSpent, target: demoBudgetTarget, paid, remaining, percent: Math.round((paid / total) * 100), overrun: demoBudgetOverrun };
}

export function getDemoTaskStats() {
  const total = demoTasks.length;
  const done = demoTasks.filter(t => t.done).length;
  return { total, done, remaining: total - done, percent: Math.round((done / total) * 100) };
}

export function getDemoBudgetChartData() {
  return demoBudgetCategories.map(c => ({
    name: c.name,
    value: c.amount,
    fill: c.color,
  }));
}

export function getDemoRsvpChartData() {
  return [
    { name: "Confirmés", value: demoRsvp.confirmed, fill: "hsl(38, 45%, 50%)" },
    { name: "En attente", value: demoRsvp.pending, fill: "hsl(35, 20%, 85%)" },
    { name: "Désistés", value: demoRsvp.declined, fill: "hsl(15, 50%, 40%)" },
  ];
}

// Legacy exports for OutilsMaries compatibility
export const demoPayments = [
  { vendor: "Chez Mama Afrika", total: 9500, paid: 8500, deposit: 3000, dueDate: "2026-08-05", status: "partial" as const },
  { vendor: "DJ Kofi", total: 1500, paid: 1500, deposit: 500, dueDate: "2026-07-15", status: "confirmed" as const },
  { vendor: "Marc Visuals", total: 2500, paid: 2500, deposit: 800, dueDate: "2026-08-10", status: "confirmed" as const },
  { vendor: "Flora Luxe", total: 2200, paid: 2200, deposit: 600, dueDate: "2026-08-10", status: "confirmed" as const },
];

export const demoReminder = {
  text: "⚠️ Solde traiteur de 1 000 € à régler avant le 5 août",
  type: "payment" as const,
};

export function getDemoHealthScore() {
  let score = 100;
  // Budget overspent
  if (demoBudgetOverrun > 0) score -= 12;
  // Pending guests > 10
  if (demoRsvp.pending > 10) score -= 3;
  // Outstanding payments
  const hasOutstanding = demoVendors.some(v => v.remaining > 0);
  if (hasOutstanding) score -= 3;
  // All vendors confirmed
  const allConfirmed = demoVendors.every(v => v.confirmed);
  if (!allConfirmed) score -= 10;
  return Math.max(0, Math.min(100, score));
}

// ───────── RSVP Stats enrichies ─────────
export function getDemoRsvpStats() {
  const hotelCount = demoGuests.filter(g => g.hotel && g.status === "confirmed").length;
  const transportCount = demoGuests.filter(g => g.transport && g.status === "confirmed").length;
  const mealBreakdown = demoGuests
    .filter(g => g.mealChoice)
    .reduce((acc, g) => {
      acc[g.mealChoice!] = (acc[g.mealChoice!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  return { hotelCount, transportCount, mealBreakdown };
}

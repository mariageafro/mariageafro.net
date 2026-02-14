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
  { name: "Salle & Lieu", amount: 8000, paid: 8000, color: "hsl(38, 45%, 50%)" },
  { name: "Traiteur africain", amount: 9500, paid: 9500, color: "hsl(43, 75%, 55%)" },
  { name: "Wedding Planner", amount: 3000, paid: 3000, color: "hsl(30, 35%, 45%)" },
  { name: "Photo", amount: 2500, paid: 2500, color: "hsl(25, 30%, 60%)" },
  { name: "Vidéo", amount: 3000, paid: 3000, color: "hsl(35, 40%, 65%)" },
  { name: "DJ", amount: 1500, paid: 1500, color: "hsl(40, 50%, 45%)" },
  { name: "Groupe Live Seben", amount: 1200, paid: 1200, color: "hsl(33, 25%, 70%)" },
  { name: "Son & Lumière", amount: 1800, paid: 1800, color: "hsl(28, 30%, 55%)" },
  { name: "Décoration florale", amount: 2200, paid: 2200, color: "hsl(42, 40%, 50%)" },
  { name: "Robe mariée", amount: 2000, paid: 2000, color: "hsl(36, 35%, 60%)" },
  { name: "Costume", amount: 900, paid: 900, color: "hsl(30, 20%, 50%)" },
  { name: "Pagnes famille", amount: 1200, paid: 1200, color: "hsl(32, 45%, 55%)" },
  { name: "Wedding Cake", amount: 850, paid: 850, color: "hsl(38, 55%, 60%)" },
  { name: "Voiturier", amount: 700, paid: 700, color: "hsl(35, 20%, 65%)" },
  { name: "Sécurité", amount: 600, paid: 600, color: "hsl(25, 15%, 45%)" },
  { name: "Hôtel VIP", amount: 1600, paid: 1600, color: "hsl(40, 30%, 55%)" },
  { name: "Transport", amount: 1100, paid: 1100, color: "hsl(33, 30%, 60%)" },
  { name: "Papeterie", amount: 800, paid: 800, color: "hsl(37, 25%, 50%)" },
  { name: "Photobooth 360", amount: 750, paid: 750, color: "hsl(42, 35%, 65%)" },
  { name: "Effets spéciaux", amount: 450, paid: 450, color: "hsl(28, 25%, 60%)" },
];

export const demoBudgetTarget = 35000;
export const demoBudgetSpent = 39850;
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
  status: "Terminé" | "Confirmé" | "En attente";
};

export const demoVendors: DemoVendor[] = [
  { id: "v1", name: "Grâce Events", role: "Wedding Planner", photo: "🎯", confirmed: true, deposit: 1000, total: 3000, paid: 3000, status: "Terminé" },
  { id: "v2", name: "Sandra N.", role: "Coordinatrice Jour J", photo: "📋", confirmed: true, deposit: 300, total: 800, paid: 800, status: "Terminé" },
  { id: "v3", name: "Chez Mama Afrika", role: "Traiteur africain", photo: "🍛", confirmed: true, deposit: 3000, total: 9500, paid: 9500, status: "Terminé" },
  { id: "v4", name: "Cake by Fanta", role: "Chef Wedding Cake", photo: "🎂", confirmed: true, deposit: 200, total: 850, paid: 850, status: "Terminé" },
  { id: "v5", name: "Marc Visuals", role: "Photographe", photo: "📸", confirmed: true, deposit: 800, total: 2500, paid: 2500, status: "Terminé" },
  { id: "v6", name: "Cinéma Afro", role: "Vidéaste", photo: "🎬", confirmed: true, deposit: 1000, total: 3000, paid: 3000, status: "Terminé" },
  { id: "v7", name: "SkyView Pro", role: "Drone operator", photo: "🚁", confirmed: true, deposit: 300, total: 600, paid: 600, status: "Terminé" },
  { id: "v8", name: "DJ Kofi", role: "DJ", photo: "🎧", confirmed: true, deposit: 500, total: 1500, paid: 1500, status: "Terminé" },
  { id: "v9", name: "Seben All Stars", role: "Groupe live", photo: "🎵", confirmed: true, deposit: 400, total: 1200, paid: 1200, status: "Terminé" },
  { id: "v10", name: "Papa Wemba Jr", role: "MC Atalaku", photo: "🎤", confirmed: true, deposit: 200, total: 500, paid: 500, status: "Terminé" },
  { id: "v11", name: "Dance Empire", role: "Chorégraphe", photo: "💃", confirmed: true, deposit: 150, total: 400, paid: 400, status: "Terminé" },
  { id: "v12", name: "LightShow Pro", role: "Son & Lumière", photo: "💡", confirmed: true, deposit: 500, total: 1800, paid: 1800, status: "Terminé" },
  { id: "v13", name: "Flora Luxe", role: "Décoration florale", photo: "🌸", confirmed: true, deposit: 600, total: 2200, paid: 2200, status: "Terminé" },
  { id: "v14", name: "Events Déco", role: "Location mobilier", photo: "🪑", confirmed: true, deposit: 400, total: 1200, paid: 1200, status: "Terminé" },
  { id: "v15", name: "Arc en Fleurs", role: "Arche cérémonie", photo: "🏛️", confirmed: true, deposit: 200, total: 600, paid: 600, status: "Terminé" },
  { id: "v16", name: "Atelier Nadège", role: "Robe sur mesure", photo: "👗", confirmed: true, deposit: 800, total: 2000, paid: 2000, status: "Terminé" },
  { id: "v17", name: "Prestige Homme", role: "Costume", photo: "🤵", confirmed: true, deposit: 300, total: 900, paid: 900, status: "Terminé" },
  { id: "v18", name: "Glam by Aïcha", role: "Maquilleuse", photo: "💄", confirmed: true, deposit: 150, total: 450, paid: 450, status: "Terminé" },
  { id: "v19", name: "Hair by Caro", role: "Coiffeuse", photo: "💇‍♀️", confirmed: true, deposit: 100, total: 350, paid: 350, status: "Terminé" },
  { id: "v20", name: "Wax Prestige", role: "Location pagnes", photo: "🧵", confirmed: true, deposit: 400, total: 1200, paid: 1200, status: "Terminé" },
  { id: "v21", name: "VIP Parking", role: "Voiturier", photo: "🚗", confirmed: true, deposit: 200, total: 700, paid: 700, status: "Terminé" },
  { id: "v22", name: "SecuEvent", role: "Sécurité", photo: "🛡️", confirmed: true, deposit: 200, total: 600, paid: 600, status: "Terminé" },
  { id: "v23", name: "TransAfro", role: "Transport", photo: "🚌", confirmed: true, deposit: 300, total: 1100, paid: 1100, status: "Terminé" },
  { id: "v24", name: "Rolls & Class", role: "Location voiture mariés", photo: "🏎️", confirmed: true, deposit: 300, total: 800, paid: 800, status: "Terminé" },
  { id: "v25", name: "Hôtel Renaissance", role: "Hôtel", photo: "🏨", confirmed: true, deposit: 500, total: 1600, paid: 1600, status: "Terminé" },
  { id: "v26", name: "360 Booth Paris", role: "Photobooth", photo: "📷", confirmed: true, deposit: 200, total: 750, paid: 750, status: "Terminé" },
  { id: "v27", name: "DigiBook", role: "Livre d'or digital", photo: "📖", confirmed: true, deposit: 100, total: 300, paid: 300, status: "Terminé" },
  { id: "v28", name: "PrintLuxe", role: "Impression menus", photo: "🖨️", confirmed: true, deposit: 200, total: 500, paid: 500, status: "Terminé" },
  { id: "v29", name: "Cadeaux d'Or", role: "Cadeaux invités", photo: "🎁", confirmed: true, deposit: 300, total: 750, paid: 750, status: "Terminé" },
];

// ───────────── RSVP ─────────────
export const demoRsvp = {
  total: 250,
  confirmed: 212,
  pending: 20,
  declined: 18,
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
  steps: { mairie: boolean; ceremonie: boolean; reception: boolean; brunch: boolean };
};

const guestNames = [
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

export const demoGuests: DemoGuest[] = guestNames.map(([fn, ln, grp], i) => ({
  id: `g${i + 1}`,
  first_name: fn,
  last_name: ln,
  group: grp,
  status: i < 22 ? "confirmed" : i < 27 ? "pending" : "declined",
  companions: i < 22 ? Math.floor(Math.random() * 3) : 0,
  dietary: i % 7 === 0 ? "Halal" : i % 11 === 0 ? "Végétarien" : undefined,
  steps: {
    mairie: i < 22,
    ceremonie: i < 22,
    reception: i < 25,
    brunch: i < 15,
  },
}));

// ───────────── TIMELINE JOUR J ─────────────
export const demoTimeline = [
  { id: "tl1", start_time: "08:30", end_time: "10:00", title: "Préparation mariée", address: "Hôtel Renaissance, Paris", responsible: "Glam by Aïcha & Hair by Caro", budget: 800 },
  { id: "tl2", start_time: "10:30", end_time: "12:00", title: "Préparation marié", address: "Suite VIP, Hôtel Renaissance", responsible: "Prestige Homme", budget: 300 },
  { id: "tl3", start_time: "13:00", end_time: "14:30", title: "Mairie", address: "Mairie du 8ème, Paris", responsible: "Coordinatrice Sandra", budget: 0 },
  { id: "tl4", start_time: "15:30", end_time: "17:00", title: "Photos couple", address: "Pont Alexandre III & Tuileries", responsible: "Marc Visuals + SkyView Pro", budget: 500 },
  { id: "tl5", start_time: "18:00", end_time: "19:00", title: "Accueil invités", address: "Salle Renaissance", responsible: "Grâce Events", budget: 200 },
  { id: "tl6", start_time: "19:30", end_time: "20:00", title: "Entrée mariés", address: "Salle Renaissance", responsible: "MC Papa Wemba Jr + Dance Empire", budget: 400 },
  { id: "tl7", start_time: "20:00", end_time: "21:30", title: "Dîner", address: "Salle Renaissance", responsible: "Chez Mama Afrika", budget: 9500 },
  { id: "tl8", start_time: "22:00", end_time: "23:00", title: "Ouverture de bal", address: "Salle Renaissance", responsible: "DJ Kofi + Dance Empire", budget: 500 },
  { id: "tl9", start_time: "23:30", end_time: "00:00", title: "Gâteau", address: "Salle Renaissance", responsible: "Cake by Fanta", budget: 850 },
  { id: "tl10", start_time: "01:00", end_time: "03:00", title: "Seben live", address: "Salle Renaissance", responsible: "Seben All Stars", budget: 1200 },
  { id: "tl11", start_time: "04:00", end_time: "04:30", title: "Clôture", address: "Salle Renaissance", responsible: "Grâce Events", budget: 0 },
];

// ───────────── WISHLIST ─────────────
export const demoWishlist = [
  { id: "w1", title: "Voyage Zanzibar", amount: 3000, payment: "PayPal", icon: "✈️", status: "Réservé" },
  { id: "w2", title: "Participation lune de miel", amount: 0, payment: "RIB", icon: "🌴", status: "Libre" },
  { id: "w3", title: "TV Samsung 65\"", amount: 1200, payment: "Amazon", icon: "📺", status: "Acheté" },
  { id: "w4", title: "Salon design", amount: 2400, payment: "Virement", icon: "🛋️", status: "Disponible" },
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
];

// ───────────── COMPUTED HELPERS ─────────────
export function getDemoBudgetTotals() {
  const total = demoBudgetSpent;
  const paid = demoBudgetCategories.reduce((s, c) => s + c.paid, 0);
  return { total: demoBudgetSpent, target: demoBudgetTarget, paid, remaining: 0, percent: 100, overrun: demoBudgetOverrun };
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
  { vendor: "Chez Mama Afrika", total: 9500, paid: 9500, deposit: 3000, dueDate: "2026-08-01", status: "confirmed" as const },
  { vendor: "DJ Kofi", total: 1500, paid: 1500, deposit: 500, dueDate: "2026-07-15", status: "confirmed" as const },
  { vendor: "Marc Visuals", total: 2500, paid: 2500, deposit: 800, dueDate: "2026-08-10", status: "confirmed" as const },
  { vendor: "Flora Luxe", total: 2200, paid: 2200, deposit: 600, dueDate: "2026-08-05", status: "confirmed" as const },
];

export const demoReminder = {
  text: "Mariage terminé — tous les paiements ont été effectués ! 🎉",
  type: "payment" as const,
};

export function getDemoHealthScore() {
  let score = 100;
  // Budget overspent
  if (demoBudgetOverrun > 0) score -= 15;
  // Pending guests > 10
  if (demoRsvp.pending > 10) score -= 3;
  // All vendors confirmed
  const allConfirmed = demoVendors.every(v => v.confirmed);
  if (!allConfirmed) score -= 10;
  // All paid
  const allPaid = demoVendors.every(v => v.paid >= v.total);
  if (!allPaid) score -= 10;
  return Math.max(0, Math.min(100, score));
}

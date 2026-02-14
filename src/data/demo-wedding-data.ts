// Centralized demo data for the Wedding Planner demo mode
// Used when user is not authenticated or clicks "Voir la démo"

export const demoCouple = {
  partner_one_first_name: "Nadia",
  partner_two_first_name: "Junior",
  couple_display_name: "Nadia & Junior",
  wedding_date: "2026-10-17",
  city: "Paris",
  country: "France",
  guest_count: 150,
  estimated_budget: 25000,
  wedding_style: "Afro-Chic",
  couple_quote: "L'amour n'a pas de frontières",
  origin_partner_one: "Cameroun",
  origin_partner_two: "Congo",
};

export const demoBudgetCategories = [
  { name: "Salle & Lieu", amount: 8000, paid: 5000, color: "hsl(38, 45%, 50%)" },
  { name: "Traiteur", amount: 5500, paid: 2000, color: "hsl(43, 75%, 55%)" },
  { name: "Photo/Vidéo", amount: 3000, paid: 1500, color: "hsl(30, 35%, 45%)" },
  { name: "Tenues", amount: 2500, paid: 800, color: "hsl(25, 30%, 60%)" },
  { name: "Décoration", amount: 2000, paid: 600, color: "hsl(35, 40%, 65%)" },
  { name: "DJ & Musique", amount: 1800, paid: 500, color: "hsl(40, 50%, 45%)" },
  { name: "Autres", amount: 2200, paid: 480, color: "hsl(33, 25%, 70%)" },
];

export const demoTasks = [
  { id: "t1", title: "Réserver la salle de réception", category: "lieu", done: true, priority: "urgent", due_date: "2025-12-15" },
  { id: "t2", title: "Choisir le traiteur", category: "traiteur", done: true, priority: "high", due_date: "2026-02-01" },
  { id: "t3", title: "Réserver le photographe", category: "photo", done: true, priority: "high", due_date: "2026-02-15" },
  { id: "t4", title: "Commander les faire-part", category: "papeterie", done: true, priority: "medium", due_date: "2026-04-01" },
  { id: "t5", title: "Choisir la robe", category: "tenues", done: true, priority: "high", due_date: "2026-03-01" },
  { id: "t6", title: "Réserver le DJ", category: "musique", done: true, priority: "medium", due_date: "2026-03-15" },
  { id: "t7", title: "Organiser la cérémonie traditionnelle (dot)", category: "tradition", done: true, priority: "high", due_date: "2026-04-15" },
  { id: "t8", title: "Envoyer les faire-part", category: "papeterie", done: false, priority: "high", due_date: "2026-06-01" },
  { id: "t9", title: "Finaliser le plan de table", category: "organisation", done: false, priority: "high", due_date: "2026-09-01" },
  { id: "t10", title: "Confirmer tous les prestataires", category: "general", done: false, priority: "urgent", due_date: "2026-09-15" },
  { id: "t11", title: "Préparer le planning Jour J", category: "organisation", done: false, priority: "high", due_date: "2026-09-20" },
  { id: "t12", title: "Relancer les RSVP manquants", category: "invites", done: false, priority: "high", due_date: "2026-09-25" },
  { id: "t13", title: "Derniers essayages", category: "tenues", done: false, priority: "medium", due_date: "2026-10-01" },
  { id: "t14", title: "Commander les tissus / pagnes", category: "tradition", done: false, priority: "medium", due_date: "2026-06-15" },
];

export const demoTimeline = [
  { id: "tl1", start_time: "08:30", end_time: "09:30", title: "Préparation mariée", address: "Hôtel Renaissance, Paris", responsible: "Marie (témoin)" },
  { id: "tl2", start_time: "10:00", end_time: "10:30", title: "Arrivée à la Mairie", address: "Mairie du 8ème, Paris", responsible: "Junior" },
  { id: "tl3", start_time: "10:30", end_time: "11:30", title: "Cérémonie civile", address: "Mairie du 8ème, Paris", responsible: "Couple" },
  { id: "tl4", start_time: "12:00", end_time: "13:00", title: "Photos couple", address: "Jardin des Tuileries", responsible: "Photographe Marc" },
  { id: "tl5", start_time: "14:30", end_time: "15:30", title: "Cérémonie traditionnelle", address: "Salle Renaissance", responsible: "Famille Nadia" },
  { id: "tl6", start_time: "16:00", end_time: "17:00", title: "Vin d'honneur", address: "Salle Renaissance", responsible: "Traiteur Chez Mama" },
  { id: "tl7", start_time: "19:00", end_time: "01:00", title: "Soirée & animations", address: "Salle Renaissance", responsible: "DJ Kofi" },
];

export const demoRsvp = {
  total: 150,
  confirmed: 112,
  pending: 30,
  declined: 8,
};

export const demoPayments = [
  { vendor: "Photographe Marc", total: 3000, paid: 1500, deposit: 500, dueDate: "2026-10-01", status: "confirmed" as const },
  { vendor: "DJ Kofi", total: 1800, paid: 500, deposit: 500, dueDate: "2026-09-15", status: "confirmed" as const },
  { vendor: "Traiteur Chez Mama", total: 5500, paid: 2000, deposit: 2000, dueDate: "2026-10-10", status: "confirmed" as const },
  { vendor: "Décoration Flora", total: 2000, paid: 600, deposit: 600, dueDate: "2026-10-05", status: "pending" as const },
];

export const demoReminder = {
  text: "Photographe : régler le solde de 1 500 € avant le 1er octobre 2026.",
  type: "payment" as const,
};

// Computed helpers
export function getDemoBudgetTotals() {
  const total = demoBudgetCategories.reduce((s, c) => s + c.amount, 0);
  const paid = demoBudgetCategories.reduce((s, c) => s + c.paid, 0);
  return { total, paid, remaining: total - paid, percent: Math.round((paid / total) * 100) };
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
    { name: "Déclinés", value: demoRsvp.declined, fill: "hsl(15, 50%, 40%)" },
  ];
}

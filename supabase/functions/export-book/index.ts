import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function supaAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const supa = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authErr } = await supa.auth.getUser();
    if (authErr || !user) return json({ error: "Unauthorized" }, 401);

    const admin = supaAdmin();
    const userId = user.id;

    // Fetch all data in parallel
    const [profileRes, budgetItemsRes, checklistRes, planningRes, rsvpEventsRes, timelineRes, seatingRes, vendorsRes] = await Promise.all([
      admin.from("user_wedding_profile").select("*").eq("user_id", userId).maybeSingle(),
      admin.from("user_tool_items").select("*").eq("user_id", userId).eq("tool_slug", "budget").order("created_at"),
      admin.from("user_tool_items").select("*").eq("user_id", userId).eq("tool_slug", "checklist").order("created_at"),
      admin.from("user_tool_items").select("*").eq("user_id", userId).eq("tool_slug", "planning").order("created_at"),
      admin.from("rsvp_events").select("*, rsvp_guests(*)").eq("user_id", userId).order("created_at"),
      admin.from("day_of_timeline").select("*, day_of_timeline_items(*)").eq("user_id", userId).maybeSingle(),
      admin.from("user_tools").select("data").eq("user_id", userId).eq("tool_slug", "seating-chart").maybeSingle(),
      admin.from("user_tool_items").select("*").eq("user_id", userId).eq("tool_slug", "wishlist").order("created_at"),
    ]);

    const profile = profileRes.data;
    const budgetItems = budgetItemsRes.data || [];
    const checklist = checklistRes.data || [];
    const planning = planningRes.data || [];
    const rsvpEvents = rsvpEventsRes.data || [];
    const timeline = timelineRes.data;
    const seatingData = seatingRes.data?.data as any;
    const wishlistItems = vendorsRes.data || [];

    const coupleName = profile?.couple_display_name || 
      `${profile?.partner_one_first_name || ""} & ${profile?.partner_two_first_name || ""}`;
    const weddingDate = profile?.wedding_date 
      ? new Date(profile.wedding_date).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      : "";
    const quote = profile?.couple_quote || "";
    const city = profile?.city || "";
    const country = profile?.country || "";
    const guestCount = profile?.guest_count || 0;
    const estimatedBudget = profile?.estimated_budget || 0;
    const style = profile?.wedding_style || "";
    const origin1 = profile?.origin_partner_one || "";
    const origin2 = profile?.origin_partner_two || "";

    // Budget stats
    const totalBudget = budgetItems.reduce((s: number, i: any) => s + (i.amount || 0), 0);
    const paidBudget = budgetItems.filter((i: any) => i.meta?.status === "paid").reduce((s: number, i: any) => s + (i.amount || 0), 0);
    const depositBudget = budgetItems.filter((i: any) => i.meta?.status === "deposit").reduce((s: number, i: any) => s + (i.amount || 0), 0);
    const budgetDiff = totalBudget - estimatedBudget;

    // Checklist stats
    const checkDone = checklist.filter((i: any) => i.done).length;

    // RSVP stats
    const allGuests = rsvpEvents.flatMap((e: any) => e.rsvp_guests || []);
    const confirmedGuests = allGuests.filter((g: any) => g.status === "confirmed").length;
    const declinedGuests = allGuests.filter((g: any) => g.status === "declined").length;
    const pendingGuests = allGuests.filter((g: any) => g.status === "pending").length;

    // Build premium HTML
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Lora', Georgia, serif; color: #3d2e1e; background: #faf8f5; }
  h1, h2, h3 { font-family: 'Cormorant Garamond', serif; }
  
  /* Cover page */
  .cover { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: linear-gradient(180deg, #faf8f5 0%, #f0e8dc 40%, #e8ddd0 100%); padding: 60px; page-break-after: always; position: relative; overflow: hidden; }
  .cover::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a96e' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); opacity: 0.5; }
  .cover .inner { position: relative; z-index: 1; }
  .cover h1 { font-size: 56px; font-weight: 300; color: #5a3e1b; margin-bottom: 12px; letter-spacing: 2px; }
  .cover .subtitle { font-size: 18px; color: #c5a55a; font-family: 'Lora', serif; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px; }
  .cover .date { font-size: 22px; color: #8b7355; margin-bottom: 20px; font-style: italic; }
  .cover .quote { font-style: italic; color: #7a6b5b; font-size: 17px; max-width: 450px; line-height: 1.6; }
  .cover .divider { width: 100px; height: 2px; background: linear-gradient(90deg, transparent, #c5a55a, transparent); margin: 28px auto; }
  .cover .meta { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin-top: 32px; }
  .cover .meta span { font-size: 13px; color: #8b7355; padding: 6px 16px; border: 1px solid #d4c4a8; border-radius: 20px; background: rgba(255,255,255,0.5); }
  
  /* Sections */
  .section { padding: 48px 56px; page-break-inside: avoid; }
  .section-title { font-size: 30px; color: #5a3e1b; margin-bottom: 24px; padding-bottom: 10px; border-bottom: 2px solid #e8ddd0; display: flex; align-items: center; gap: 12px; }
  .section-title .emoji { font-size: 26px; }
  
  /* Couple info */
  .couple-info { background: linear-gradient(135deg, #faf8f5, #f0e8dc); border-radius: 16px; padding: 32px; margin-bottom: 24px; border: 1px solid #e8ddd0; }
  .couple-info .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .couple-info .item { padding: 12px; }
  .couple-info .item-label { font-size: 11px; color: #9b8b7a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .couple-info .item-value { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #5a3e1b; }
  
  /* KPIs */
  .kpi-row { display: flex; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
  .kpi { flex: 1; min-width: 140px; background: linear-gradient(135deg, #fff, #faf8f5); border-radius: 14px; padding: 20px; text-align: center; border: 1px solid #e8ddd0; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
  .kpi .value { font-family: 'Cormorant Garamond', serif; font-size: 32px; color: #5a3e1b; font-weight: 600; }
  .kpi .label { font-size: 11px; color: #9b8b7a; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .kpi.alert { border-color: #e8a87c; background: linear-gradient(135deg, #fef3e8, #fdf0e0); }
  .kpi.alert .value { color: #c0392b; }
  
  /* Tables */
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th { text-align: left; padding: 10px 14px; background: linear-gradient(135deg, #f5f0e8, #ede5d8); color: #5a3e1b; font-family: 'Cormorant Garamond', serif; font-size: 13px; font-weight: 600; border-bottom: 2px solid #e0d5c5; }
  td { padding: 10px 14px; border-bottom: 1px solid #f0e8dc; font-size: 13px; color: #4a3c2e; }
  tr:nth-child(even) { background: #faf8f5; }
  
  /* Badges */
  .badge { display: inline-block; padding: 3px 10px; border-radius: 14px; font-size: 11px; font-weight: 600; }
  .badge-done { background: #d1fae5; color: #065f46; }
  .badge-pending { background: #fef3c7; color: #92400e; }
  .badge-high { background: #fee2e2; color: #991b1b; }
  .badge-declined { background: #fecaca; color: #991b1b; }
  .badge-confirmed { background: #d1fae5; color: #065f46; }
  
  /* Timeline */
  .timeline-item { display: flex; gap: 16px; margin-bottom: 16px; padding: 14px 18px; border-radius: 12px; background: #fff; border: 1px solid #e8ddd0; }
  .timeline-time { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: #c5a55a; font-weight: 600; min-width: 100px; }
  .timeline-content h4 { font-family: 'Cormorant Garamond', serif; font-size: 18px; color: #5a3e1b; margin-bottom: 4px; }
  .timeline-content p { font-size: 12px; color: #8b7355; }
  
  /* Footer */
  .footer { text-align: center; padding: 40px; color: #9b8b7a; font-size: 12px; border-top: 2px solid #e8ddd0; margin-top: 40px; }
  .footer .brand { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #c5a55a; margin-bottom: 8px; }
  
  @media print {
    .section { padding: 32px 40px; }
    .cover { height: auto; min-height: 100vh; }
  }
</style>
</head>
<body>

<!-- ═══════ COVER ═══════ -->
<div class="cover">
  <div class="inner">
    <div class="subtitle">Book Mariage Premium</div>
    <h1>${coupleName}</h1>
    <div class="divider"></div>
    ${weddingDate ? `<p class="date">${weddingDate}</p>` : ""}
    ${quote ? `<p class="quote">"${quote}"</p>` : ""}
    <div class="meta">
      ${city ? `<span>📍 ${city}${country ? `, ${country}` : ""}</span>` : ""}
      ${guestCount ? `<span>👥 ${guestCount} invités</span>` : ""}
      ${style ? `<span>✨ ${style}</span>` : ""}
      ${origin1 || origin2 ? `<span>💕 ${[origin1, origin2].filter(Boolean).join(" × ")}</span>` : ""}
    </div>
  </div>
</div>

<!-- ═══════ COUPLE ═══════ -->
<div class="section">
  <h2 class="section-title"><span class="emoji">💍</span> Présentation du couple</h2>
  <div class="couple-info">
    <div class="grid">
      <div class="item">
        <div class="item-label">Partenaire 1</div>
        <div class="item-value">${profile?.partner_one_first_name || ""} ${profile?.partner_one_last_name || ""}</div>
      </div>
      <div class="item">
        <div class="item-label">Partenaire 2</div>
        <div class="item-value">${profile?.partner_two_first_name || ""} ${profile?.partner_two_last_name || ""}</div>
      </div>
      <div class="item">
        <div class="item-label">Origines</div>
        <div class="item-value">${[origin1, origin2].filter(Boolean).join(" & ") || "—"}</div>
      </div>
      <div class="item">
        <div class="item-label">Style</div>
        <div class="item-value">${style || "—"}</div>
      </div>
      <div class="item">
        <div class="item-label">Ville</div>
        <div class="item-value">${city || "—"}${country ? `, ${country}` : ""}</div>
      </div>
      <div class="item">
        <div class="item-label">Invités prévus</div>
        <div class="item-value">${guestCount || "—"}</div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════ BUDGET ═══════ -->
<div class="section">
  <h2 class="section-title"><span class="emoji">💰</span> Budget détaillé</h2>
  <div class="kpi-row">
    <div class="kpi"><div class="value">${estimatedBudget.toLocaleString("fr-FR")} €</div><div class="label">Budget estimé</div></div>
    <div class="kpi"><div class="value">${totalBudget.toLocaleString("fr-FR")} €</div><div class="label">Total dépenses</div></div>
    <div class="kpi"><div class="value">${paidBudget.toLocaleString("fr-FR")} €</div><div class="label">Payé</div></div>
    <div class="kpi"><div class="value">${depositBudget.toLocaleString("fr-FR")} €</div><div class="label">Acomptes</div></div>
    <div class="kpi ${budgetDiff > 0 ? 'alert' : ''}"><div class="value">${budgetDiff > 0 ? "+" : ""}${budgetDiff.toLocaleString("fr-FR")} €</div><div class="label">${budgetDiff > 0 ? "Dépassement" : "Restant"}</div></div>
  </div>
  ${budgetItems.length > 0 ? `
  <table>
    <thead><tr><th>Dépense</th><th>Catégorie</th><th>Montant</th><th>Statut</th></tr></thead>
    <tbody>${budgetItems.map((i: any) => `
      <tr>
        <td>${i.title}</td>
        <td>${i.meta?.category || "—"}</td>
        <td style="font-weight:600;">${(i.amount || 0).toLocaleString("fr-FR")} €</td>
        <td><span class="badge ${i.meta?.status === "paid" ? "badge-done" : "badge-pending"}">${i.meta?.status === "paid" ? "Payé" : i.meta?.status === "deposit" ? "Acompte" : "Prévu"}</span></td>
      </tr>`).join("")}
    </tbody>
  </table>` : "<p style='color:#9b8b7a;font-style:italic;'>Aucune dépense enregistrée.</p>"}
</div>

<!-- ═══════ CHECKLIST ═══════ -->
<div class="section">
  <h2 class="section-title"><span class="emoji">✅</span> Checklist (${checkDone}/${checklist.length})</h2>
  ${checklist.length > 0 ? `
  <table>
    <thead><tr><th>Tâche</th><th>Catégorie</th><th>Priorité</th><th>Statut</th></tr></thead>
    <tbody>${checklist.map((i: any) => `
      <tr>
        <td>${i.done ? "✓ " : "○ "}${i.title}</td>
        <td>${i.meta?.category || "—"}</td>
        <td><span class="badge ${i.meta?.priority === "high" ? "badge-high" : ""}">${i.meta?.priority === "high" ? "Haute" : i.meta?.priority === "low" ? "Basse" : "Moyenne"}</span></td>
        <td><span class="badge ${i.done ? "badge-done" : "badge-pending"}">${i.done ? "Terminé" : i.meta?.status === "in_progress" ? "En cours" : "À faire"}</span></td>
      </tr>`).join("")}
    </tbody>
  </table>` : "<p style='color:#9b8b7a;font-style:italic;'>Aucune tâche enregistrée.</p>"}
</div>

<!-- ═══════ PLANNING ═══════ -->
<div class="section">
  <h2 class="section-title"><span class="emoji">📅</span> Planning</h2>
  ${planning.length > 0 ? `
  <table>
    <thead><tr><th>Étape</th><th>Date</th><th>Priorité</th><th>Statut</th></tr></thead>
    <tbody>${planning.map((i: any) => `
      <tr>
        <td>${i.title}</td>
        <td>${i.date ? new Date(i.date).toLocaleDateString("fr-FR") : "—"}</td>
        <td>${i.meta?.priority === "high" ? "Haute" : i.meta?.priority === "low" ? "Basse" : "Moyenne"}</td>
        <td><span class="badge ${i.done ? "badge-done" : "badge-pending"}">${i.done ? "Fait" : "À faire"}</span></td>
      </tr>`).join("")}
    </tbody>
  </table>` : "<p style='color:#9b8b7a;font-style:italic;'>Aucune étape enregistrée.</p>"}
</div>

<!-- ═══════ TIMELINE JOUR J ═══════ -->
${timeline && timeline.day_of_timeline_items?.length > 0 ? `
<div class="section">
  <h2 class="section-title"><span class="emoji">⏰</span> Timeline Jour J</h2>
  ${(timeline.day_of_timeline_items as any[]).sort((a: any, b: any) => a.start_time.localeCompare(b.start_time)).map((i: any) => `
    <div class="timeline-item">
      <div class="timeline-time">${i.start_time}${i.end_time ? ` — ${i.end_time}` : ""}</div>
      <div class="timeline-content">
        <h4>${i.title}</h4>
        <p>${[i.address, i.responsible_person].filter(Boolean).join(" · ")}</p>
        ${i.notes ? `<p style="margin-top:4px;font-style:italic;">${i.notes}</p>` : ""}
      </div>
    </div>`).join("")}
</div>` : ""}

<!-- ═══════ RSVP ═══════ -->
<div class="section">
  <h2 class="section-title"><span class="emoji">💌</span> RSVP</h2>
  <div class="kpi-row">
    <div class="kpi"><div class="value">${allGuests.length}</div><div class="label">Total invités</div></div>
    <div class="kpi"><div class="value" style="color:#065f46;">${confirmedGuests}</div><div class="label">Confirmés</div></div>
    <div class="kpi"><div class="value" style="color:#92400e;">${pendingGuests}</div><div class="label">En attente</div></div>
    <div class="kpi"><div class="value" style="color:#991b1b;">${declinedGuests}</div><div class="label">Déclinés</div></div>
  </div>
  ${allGuests.length > 0 ? `
  <table>
    <thead><tr><th>Invité</th><th>Groupe</th><th>Statut</th><th>Accompagnants</th><th>Régime</th></tr></thead>
    <tbody>${allGuests.map((g: any) => `
      <tr>
        <td style="font-weight:500;">${g.first_name} ${g.last_name || ""}</td>
        <td>${g.group_name || "—"}</td>
        <td><span class="badge ${g.status === "confirmed" ? "badge-confirmed" : g.status === "declined" ? "badge-declined" : "badge-pending"}">${g.status === "confirmed" ? "Confirmé" : g.status === "declined" ? "Décliné" : "En attente"}</span></td>
        <td>${(g.companions || []).length > 0 ? (g.companions as any[]).map((c: any) => c.name).join(", ") : "—"}</td>
        <td>${g.dietary_restrictions || "—"}</td>
      </tr>`).join("")}
    </tbody>
  </table>` : "<p style='color:#9b8b7a;font-style:italic;'>Aucun invité enregistré.</p>"}
</div>

<!-- ═══════ LISTE DE SOUHAITS ═══════ -->
${wishlistItems.length > 0 ? `
<div class="section">
  <h2 class="section-title"><span class="emoji">🎁</span> Liste de souhaits</h2>
  <table>
    <thead><tr><th>Souhait</th><th>Montant</th><th>Statut</th></tr></thead>
    <tbody>${wishlistItems.map((i: any) => `
      <tr>
        <td>${i.title}</td>
        <td>${i.amount ? `${i.amount.toLocaleString("fr-FR")} €` : "Libre"}</td>
        <td><span class="badge ${i.done ? "badge-done" : "badge-pending"}">${i.done ? "Offert" : "Disponible"}</span></td>
      </tr>`).join("")}
    </tbody>
  </table>
</div>` : ""}

<!-- ═══════ FOOTER ═══════ -->
<div class="footer">
  <div class="brand">MariageAfro</div>
  <p>Book Mariage généré le ${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
  <p style="margin-top:8px;">mariageafro.com · La plateforme de référence pour votre mariage afro</p>
</div>

</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });

  } catch (e) {
    console.error("export-book error:", e);
    return json({ error: "Internal server error" }, 500);
  }
});

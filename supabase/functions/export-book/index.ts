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
    const [profileRes, budgetItemsRes, checklistRes, planningRes, rsvpEventsRes, timelineRes] = await Promise.all([
      admin.from("user_wedding_profile").select("*").eq("user_id", userId).maybeSingle(),
      admin.from("user_tool_items").select("*").eq("user_id", userId).eq("tool_slug", "budget").order("created_at"),
      admin.from("user_tool_items").select("*").eq("user_id", userId).eq("tool_slug", "checklist").order("created_at"),
      admin.from("user_tool_items").select("*").eq("user_id", userId).eq("tool_slug", "planning").order("created_at"),
      admin.from("rsvp_events").select("*, rsvp_guests(*)").eq("user_id", userId).order("created_at"),
      admin.from("day_of_timeline").select("*, day_of_timeline_items(*)").eq("user_id", userId).maybeSingle(),
    ]);

    const profile = profileRes.data;
    const budgetItems = budgetItemsRes.data || [];
    const checklist = checklistRes.data || [];
    const planning = planningRes.data || [];
    const rsvpEvents = rsvpEventsRes.data || [];
    const timeline = timelineRes.data;

    const coupleName = profile?.couple_display_name || 
      `${profile?.partner_one_first_name || ""} & ${profile?.partner_two_first_name || ""}`;
    const weddingDate = profile?.wedding_date 
      ? new Date(profile.wedding_date).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      : "";
    const quote = profile?.couple_quote || "";

    // Budget stats
    const totalBudget = budgetItems.reduce((s: number, i: any) => s + (i.amount || 0), 0);
    const paidBudget = budgetItems.filter((i: any) => i.meta?.status === "paid").reduce((s: number, i: any) => s + (i.amount || 0), 0);

    // Checklist stats
    const checkDone = checklist.filter((i: any) => i.done).length;

    // RSVP stats
    const allGuests = rsvpEvents.flatMap((e: any) => e.rsvp_guests || []);
    const confirmedGuests = allGuests.filter((g: any) => g.status === "confirmed").length;

    // Build HTML
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Lora:wght@400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Lora', Georgia, serif; color: #3d2e1e; background: #faf8f5; }
  h1, h2, h3 { font-family: 'Cormorant Garamond', serif; }
  .cover { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: linear-gradient(180deg, #faf8f5, #f0e8dc); padding: 60px; }
  .cover h1 { font-size: 52px; font-weight: 300; color: #5a3e1b; margin-bottom: 16px; }
  .cover .date { font-size: 20px; color: #9b8b7a; margin-bottom: 24px; }
  .cover .quote { font-style: italic; color: #7a6b5b; font-size: 16px; max-width: 400px; }
  .cover .divider { width: 80px; height: 2px; background: linear-gradient(90deg, transparent, #c5a55a, transparent); margin: 24px auto; }
  .section { padding: 40px 50px; page-break-inside: avoid; }
  .section-title { font-size: 28px; color: #5a3e1b; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #e8ddd0; }
  .kpi-row { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
  .kpi { flex: 1; min-width: 120px; background: white; border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #e8ddd0; }
  .kpi .value { font-family: 'Cormorant Garamond', serif; font-size: 28px; color: #5a3e1b; }
  .kpi .label { font-size: 12px; color: #9b8b7a; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th { text-align: left; padding: 8px 12px; background: #f5f0e8; color: #5a3e1b; font-family: 'Cormorant Garamond', serif; font-size: 13px; border-bottom: 1px solid #e8ddd0; }
  td { padding: 8px 12px; border-bottom: 1px solid #f0e8dc; font-size: 13px; color: #4a3c2e; }
  tr:hover { background: #faf8f5; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
  .badge-done { background: #d1fae5; color: #065f46; }
  .badge-pending { background: #fef3c7; color: #92400e; }
  .badge-high { background: #fee2e2; color: #991b1b; }
  .footer { text-align: center; padding: 30px; color: #9b8b7a; font-size: 12px; border-top: 1px solid #e8ddd0; }
</style>
</head>
<body>

<!-- Cover -->
<div class="cover">
  <h1>${coupleName}</h1>
  <div class="divider"></div>
  ${weddingDate ? `<p class="date">${weddingDate}</p>` : ""}
  ${quote ? `<p class="quote">"${quote}"</p>` : ""}
  <p style="color:#c5a55a;margin-top:40px;font-size:14px;">Book Mariage Premium</p>
</div>

<!-- Budget -->
<div class="section">
  <h2 class="section-title">💰 Budget</h2>
  <div class="kpi-row">
    <div class="kpi"><div class="value">${totalBudget.toLocaleString("fr-FR")} €</div><div class="label">Budget total</div></div>
    <div class="kpi"><div class="value">${paidBudget.toLocaleString("fr-FR")} €</div><div class="label">Payé</div></div>
    <div class="kpi"><div class="value">${(totalBudget - paidBudget).toLocaleString("fr-FR")} €</div><div class="label">Restant</div></div>
  </div>
  ${budgetItems.length > 0 ? `
  <table>
    <thead><tr><th>Dépense</th><th>Catégorie</th><th>Montant</th><th>Statut</th></tr></thead>
    <tbody>${budgetItems.map((i: any) => `
      <tr>
        <td>${i.title}</td>
        <td>${i.meta?.category || "-"}</td>
        <td>${(i.amount || 0).toLocaleString("fr-FR")} €</td>
        <td><span class="badge ${i.meta?.status === "paid" ? "badge-done" : "badge-pending"}">${i.meta?.status === "paid" ? "Payé" : i.meta?.status === "deposit" ? "Acompte" : "Prévu"}</span></td>
      </tr>`).join("")}
    </tbody>
  </table>` : "<p>Aucune dépense enregistrée.</p>"}
</div>

<!-- Checklist -->
<div class="section">
  <h2 class="section-title">✅ Checklist (${checkDone}/${checklist.length})</h2>
  ${checklist.length > 0 ? `
  <table>
    <thead><tr><th>Tâche</th><th>Catégorie</th><th>Priorité</th><th>Statut</th></tr></thead>
    <tbody>${checklist.map((i: any) => `
      <tr>
        <td>${i.done ? "✓ " : "○ "}${i.title}</td>
        <td>${i.meta?.category || "-"}</td>
        <td><span class="badge ${i.meta?.priority === "high" ? "badge-high" : ""}">${i.meta?.priority === "high" ? "Haute" : i.meta?.priority === "low" ? "Basse" : "Moyenne"}</span></td>
        <td><span class="badge ${i.done ? "badge-done" : "badge-pending"}">${i.done ? "Terminé" : i.meta?.status === "in_progress" ? "En cours" : "À faire"}</span></td>
      </tr>`).join("")}
    </tbody>
  </table>` : "<p>Aucune tâche enregistrée.</p>"}
</div>

<!-- Planning -->
<div class="section">
  <h2 class="section-title">📅 Planning</h2>
  ${planning.length > 0 ? `
  <table>
    <thead><tr><th>Étape</th><th>Date</th><th>Priorité</th><th>Statut</th></tr></thead>
    <tbody>${planning.map((i: any) => `
      <tr>
        <td>${i.title}</td>
        <td>${i.date ? new Date(i.date).toLocaleDateString("fr-FR") : "-"}</td>
        <td>${i.meta?.priority === "high" ? "Haute" : i.meta?.priority === "low" ? "Basse" : "Moyenne"}</td>
        <td><span class="badge ${i.done ? "badge-done" : "badge-pending"}">${i.done ? "Fait" : "À faire"}</span></td>
      </tr>`).join("")}
    </tbody>
  </table>` : "<p>Aucune étape enregistrée.</p>"}
</div>

<!-- Timeline Jour J -->
${timeline && timeline.day_of_timeline_items?.length > 0 ? `
<div class="section">
  <h2 class="section-title">⏰ Timeline Jour J</h2>
  <table>
    <thead><tr><th>Heure</th><th>Événement</th><th>Lieu</th><th>Responsable</th></tr></thead>
    <tbody>${(timeline.day_of_timeline_items as any[]).sort((a: any, b: any) => a.start_time.localeCompare(b.start_time)).map((i: any) => `
      <tr>
        <td>${i.start_time}${i.end_time ? ` - ${i.end_time}` : ""}</td>
        <td>${i.title}</td>
        <td>${i.address || "-"}</td>
        <td>${i.responsible_person || "-"}</td>
      </tr>`).join("")}
    </tbody>
  </table>
</div>` : ""}

<!-- RSVP -->
<div class="section">
  <h2 class="section-title">💌 RSVP (${confirmedGuests}/${allGuests.length} confirmés)</h2>
  ${allGuests.length > 0 ? `
  <table>
    <thead><tr><th>Invité</th><th>Statut</th><th>Accompagnants</th><th>Régime</th></tr></thead>
    <tbody>${allGuests.map((g: any) => `
      <tr>
        <td>${g.first_name} ${g.last_name || ""}</td>
        <td><span class="badge ${g.status === "confirmed" ? "badge-done" : g.status === "declined" ? "badge-high" : "badge-pending"}">${g.status === "confirmed" ? "Confirmé" : g.status === "declined" ? "Décliné" : "En attente"}</span></td>
        <td>${(g.companions || []).length > 0 ? (g.companions as any[]).map((c: any) => c.name).join(", ") : "-"}</td>
        <td>${g.dietary_restrictions || "-"}</td>
      </tr>`).join("")}
    </tbody>
  </table>` : "<p>Aucun invité enregistré.</p>"}
</div>

<div class="footer">
  <p>Généré par MariageAfro · ${new Date().toLocaleDateString("fr-FR")} · mariageafro.com</p>
</div>

</body>
</html>`;

    // Return HTML (client will use browser print-to-PDF)
    return new Response(html, {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });

  } catch (e) {
    console.error("export-book error:", e);
    return json({ error: "Internal server error" }, 500);
  }
});

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
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) return json({ error: "RESEND_API_KEY not configured" }, 500);

    const { action } = await req.json();
    const admin = supaAdmin();

    // ── SEND REMINDERS (called by cron or manually) ──
    if (action === "send-reminders") {
      const now = new Date();
      const remindDays = [14, 7]; // J-14 and J-7

      // Get all events with deadlines
      const { data: events } = await admin.from("rsvp_events").select("*, rsvp_guests(*)");
      if (!events) return json({ sent: 0 });

      let sentCount = 0;

      for (const event of events) {
        const guests = (event as any).rsvp_guests || [];
        const pendingGuests = guests.filter((g: any) => g.status === "pending" && g.email);
        if (pendingGuests.length === 0) continue;

        // Check if we should send a reminder based on deadline
        const deadline = event.deadline ? new Date(event.deadline) : null;
        if (!deadline) continue;

        const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const shouldRemind = remindDays.includes(daysUntilDeadline);
        if (!shouldRemind) continue;

        // Get couple name
        const { data: wp } = await admin
          .from("user_wedding_profile")
          .select("couple_display_name, partner_one_first_name, partner_two_first_name")
          .eq("user_id", event.user_id)
          .maybeSingle();

        const coupleName = wp?.couple_display_name || 
          `${wp?.partner_one_first_name || ""} & ${wp?.partner_two_first_name || ""}`;

        const eventDate = event.event_date
          ? new Date(event.event_date).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
          : "Date à confirmer";

        const deadlineStr = deadline.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

        for (const guest of pendingGuests) {
          try {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${resendKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "MariageAfro <noreply@mariageafro.com>",
                to: guest.email,
                subject: `💌 Rappel : ${coupleName} attend votre réponse !`,
                html: `
                  <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf8f5;padding:40px 30px;border-radius:16px;">
                    <div style="text-align:center;margin-bottom:24px;">
                      <p style="font-size:32px;margin:0;">💌</p>
                    </div>
                    <h1 style="color:#5a3e1b;font-size:24px;text-align:center;margin-bottom:16px;font-weight:300;">
                      ${guest.first_name}, nous attendons votre réponse
                    </h1>
                    <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,#c5a55a,transparent);margin:16px auto;"></div>
                    <p style="color:#6b5c4c;font-size:15px;line-height:1.8;text-align:center;">
                      ${coupleName} serai${coupleName.includes("&") ? "ent" : "t"} ravi${coupleName.includes("&") ? "s" : ""} de vous compter parmi leurs invités pour célébrer leur union.
                    </p>
                    <div style="background:white;border-radius:12px;padding:24px;margin:24px 0;border:1px solid #e8ddd0;">
                      <p style="margin:8px 0;color:#5a3e1b;"><strong>🎉 Événement :</strong> ${event.title || "Mariage"}</p>
                      <p style="margin:8px 0;color:#5a3e1b;"><strong>📅 Date :</strong> ${eventDate}</p>
                      ${event.event_location ? `<p style="margin:8px 0;color:#5a3e1b;"><strong>📍 Lieu :</strong> ${event.event_location}</p>` : ""}
                      <p style="margin:8px 0;color:#c0392b;"><strong>⏰ Répondre avant le :</strong> ${deadlineStr}</p>
                    </div>
                    <p style="color:#6b5c4c;font-size:14px;text-align:center;">
                      Plus que <strong>${daysUntilDeadline} jour${daysUntilDeadline > 1 ? "s" : ""}</strong> pour confirmer votre présence.
                    </p>
                    <div style="text-align:center;margin-top:24px;">
                      <p style="color:#9b8b7a;font-size:12px;">
                        Vous avez reçu un lien de réponse personnalisé. Si vous ne le retrouvez plus, contactez ${coupleName}.
                      </p>
                    </div>
                    <div style="text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #e8ddd0;">
                      <p style="color:#c5a55a;font-size:12px;">Avec amour · MariageAfro ✨</p>
                    </div>
                  </div>
                `,
              }),
            });
            sentCount++;
          } catch (e) {
            console.error(`Failed to send reminder to ${guest.email}:`, e);
          }
        }
      }

      return json({ sent: sentCount, action: "reminders" });
    }

    // ── MANUAL REMINDER for a specific event ──
    if (action === "send-manual-reminders") {
      const body = await req.clone().json().catch(() => ({}));
      const eventId = body.event_id;
      if (!eventId) return json({ error: "event_id required" }, 400);

      const { data: event } = await admin.from("rsvp_events").select("*").eq("id", eventId).maybeSingle();
      if (!event) return json({ error: "Event not found" }, 404);

      const { data: guests } = await admin.from("rsvp_guests").select("*").eq("event_id", eventId).eq("status", "pending");
      const pendingWithEmail = (guests || []).filter((g: any) => g.email);
      if (pendingWithEmail.length === 0) return json({ sent: 0, message: "No pending guests with email" });

      const { data: wp } = await admin
        .from("user_wedding_profile")
        .select("couple_display_name, partner_one_first_name, partner_two_first_name")
        .eq("user_id", event.user_id)
        .maybeSingle();

      const coupleName = wp?.couple_display_name || 
        `${wp?.partner_one_first_name || ""} & ${wp?.partner_two_first_name || ""}`;

      const eventDate = event.event_date
        ? new Date(event.event_date).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
        : "Date à confirmer";

      const deadlineStr = event.deadline
        ? new Date(event.deadline).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })
        : null;

      let sentCount = 0;
      for (const guest of pendingWithEmail) {
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "MariageAfro <noreply@mariageafro.com>",
              to: guest.email,
              subject: `💌 Rappel : ${coupleName} attend votre réponse !`,
              html: `
                <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf8f5;padding:40px 30px;border-radius:16px;">
                  <div style="text-align:center;margin-bottom:24px;"><p style="font-size:32px;margin:0;">💌</p></div>
                  <h1 style="color:#5a3e1b;font-size:24px;text-align:center;margin-bottom:16px;font-weight:300;">
                    ${guest.first_name}, nous attendons votre réponse
                  </h1>
                  <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,#c5a55a,transparent);margin:16px auto;"></div>
                  <p style="color:#6b5c4c;font-size:15px;line-height:1.8;text-align:center;">
                    ${coupleName} serai${coupleName.includes("&") ? "ent" : "t"} ravi${coupleName.includes("&") ? "s" : ""} de vous compter parmi leurs invités.
                  </p>
                  <div style="background:white;border-radius:12px;padding:24px;margin:24px 0;border:1px solid #e8ddd0;">
                    <p style="margin:8px 0;color:#5a3e1b;"><strong>🎉</strong> ${event.title || "Mariage"}</p>
                    <p style="margin:8px 0;color:#5a3e1b;"><strong>📅</strong> ${eventDate}</p>
                    ${event.event_location ? `<p style="margin:8px 0;color:#5a3e1b;"><strong>📍</strong> ${event.event_location}</p>` : ""}
                    ${deadlineStr ? `<p style="margin:8px 0;color:#c0392b;"><strong>⏰ Répondre avant le :</strong> ${deadlineStr}</p>` : ""}
                  </div>
                  <div style="text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #e8ddd0;">
                    <p style="color:#c5a55a;font-size:12px;">Avec amour · MariageAfro ✨</p>
                  </div>
                </div>
              `,
            }),
          });
          sentCount++;
        } catch (e) {
          console.error(`Failed to send reminder to ${guest.email}:`, e);
        }
      }

      return json({ sent: sentCount, total_pending: pendingWithEmail.length, action: "manual-reminders" });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error("rsvp-emails error:", e);
    return json({ error: "Internal server error" }, 500);
  }
});

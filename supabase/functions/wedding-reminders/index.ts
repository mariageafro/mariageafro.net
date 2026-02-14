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

// Cultural milestones templates based on months before wedding
const CULTURAL_MILESTONES = [
  { months: 10, title: "Réserver le lieu de culte", icon: "⛪", type: "cultural", category: "ceremonie" },
  { months: 8, title: "Organiser la cérémonie traditionnelle (dot)", icon: "🤝", type: "cultural", category: "tradition", afroOnly: true },
  { months: 7, title: "Choisir les tenues traditionnelles", icon: "👗", type: "cultural", category: "tenues", afroOnly: true },
  { months: 6, title: "Commander les tissus et pagnes", icon: "🧵", type: "cultural", category: "tradition", afroOnly: true },
  { months: 6, title: "Réserver le groupe musical traditionnel", icon: "🥁", type: "cultural", category: "musique", afroOnly: true },
  { months: 5, title: "Confirmer le traiteur spécialisé", icon: "🍽️", type: "cultural", category: "traiteur" },
  { months: 4, title: "Organiser les essayages de tenues", icon: "✂️", type: "cultural", category: "tenues" },
  { months: 3, title: "Finaliser la liste des traditions à intégrer", icon: "📋", type: "cultural", category: "tradition", afroOnly: true },
  { months: 2, title: "Confirmer le déroulé des cérémonies", icon: "📝", type: "cultural", category: "organisation" },
  { months: 1, title: "Dernière répétition des entrées et danses", icon: "💃", type: "cultural", category: "tradition", afroOnly: true },
  { months: 1, title: "Vérifier tous les prestataires culturels", icon: "✅", type: "reminder", category: "general" },
];

// Reminder windows in days before the milestone
const REMINDER_WINDOWS = [30, 14, 7];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const sb = supaAdmin();
    const resendKey = Deno.env.get("RESEND_API_KEY");

    // Get all wedding profiles with dates
    const { data: profiles, error: profileErr } = await sb
      .from("user_wedding_profile")
      .select("user_id, wedding_date, is_afro_wedding, partner_one_first_name, partner_two_first_name, origin_partner_one, origin_partner_two, wedding_type")
      .not("wedding_date", "is", null)
      .eq("onboarding_completed", true);

    if (profileErr) throw profileErr;
    if (!profiles || profiles.length === 0) return json({ sent: 0, notifications: 0 });

    const today = new Date();
    let emailsSent = 0;
    let notificationsCreated = 0;

    for (const profile of profiles) {
      const weddingDate = new Date(profile.wedding_date!);
      if (weddingDate <= today) continue; // Wedding already passed

      const daysUntilWedding = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Filter milestones relevant to this couple
      const relevantMilestones = CULTURAL_MILESTONES.filter(m => {
        if (m.afroOnly && !profile.is_afro_wedding) return false;
        return true;
      });

      for (const milestone of relevantMilestones) {
        const milestoneDaysBeforeWedding = milestone.months * 30;
        const milestoneDateApprox = milestoneDaysBeforeWedding;

        for (const reminderDaysBefore of REMINDER_WINDOWS) {
          const triggerAt = milestoneDateApprox + reminderDaysBefore;
          
          // Check if today matches the trigger day (±1 day tolerance)
          if (Math.abs(daysUntilWedding - triggerAt) > 1) continue;

          // Check if we already sent this notification
          const notifKey = `${milestone.title}-${reminderDaysBefore}d`;
          const { data: existing } = await sb
            .from("wedding_notifications")
            .select("id")
            .eq("user_id", profile.user_id)
            .eq("meta->>key", notifKey)
            .maybeSingle();

          if (existing) continue; // Already sent

          const urgencyLabel = reminderDaysBefore <= 7 ? "🔴 Urgent" : reminderDaysBefore <= 14 ? "🟡 Bientôt" : "🟢 À planifier";
          const message = `${urgencyLabel} — ${milestone.title} dans ${reminderDaysBefore} jours. ${
            milestone.afroOnly ? `Tradition importante pour votre mariage ${profile.origin_partner_one || ""} × ${profile.origin_partner_two || ""}.` : ""
          }`;

          // Create in-app notification
          const { error: notifErr } = await sb
            .from("wedding_notifications")
            .insert({
              user_id: profile.user_id,
              title: `${milestone.icon} ${milestone.title}`,
              message,
              type: milestone.type,
              icon: milestone.icon,
              action_url: "/mon-mariage/planning",
              meta: { key: notifKey, category: milestone.category, days_before: reminderDaysBefore },
            });

          if (!notifErr) notificationsCreated++;

          // Send email if Resend is configured
          if (resendKey) {
            const { data: userProfile } = await sb
              .from("profiles")
              .select("email, first_name")
              .eq("user_id", profile.user_id)
              .maybeSingle();

            if (userProfile?.email) {
              const coupleName = `${profile.partner_one_first_name} & ${profile.partner_two_first_name}`;
              
              try {
                await fetch("https://api.resend.com/emails", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${resendKey}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    from: "MariageAfro <notifications@mariageafro.com>",
                    to: [userProfile.email],
                    subject: `${milestone.icon} Rappel : ${milestone.title} — Mariage ${coupleName}`,
                    html: `
                      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 30px;">
                        <h1 style="color: #3C2415; font-size: 24px;">${milestone.icon} ${milestone.title}</h1>
                        <p style="color: #6B5744; font-size: 16px; line-height: 1.6;">
                          Bonjour ${userProfile.first_name || coupleName},
                        </p>
                        <p style="color: #6B5744; font-size: 16px; line-height: 1.6;">
                          ${message}
                        </p>
                        <div style="background: linear-gradient(135deg, #D4A574, #C4956A); padding: 15px 25px; border-radius: 12px; text-align: center; margin: 20px 0;">
                          <a href="https://afro-heritage-vows.lovable.app/mon-mariage/planning" style="color: white; text-decoration: none; font-size: 16px; font-weight: bold;">
                            Voir mon planning →
                          </a>
                        </div>
                        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                          MariageAfro — La plateforme de votre mariage culturel ✨
                        </p>
                      </div>
                    `,
                  }),
                });
                emailsSent++;
              } catch (emailErr) {
                console.error("Email send error:", emailErr);
              }
            }
          }
        }
      }
    }

    return json({ sent: emailsSent, notifications: notificationsCreated });
  } catch (e) {
    console.error("wedding-reminders error:", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

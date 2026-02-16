import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as djwt from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function getJwtKey() {
  const secret = Deno.env.get("RSVP_JWT_SECRET")!;
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function supaAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  try {
    // ── GENERATE LINK (authenticated) ──
    if (path === "generate-link" && req.method === "POST") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

      const supa = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );

      const token = authHeader.replace("Bearer ", "");
      const { data: claims, error: clErr } = await supa.auth.getClaims(token);
      if (clErr || !claims?.claims) return json({ error: "Unauthorized" }, 401);

      const { guest_id } = await req.json();
      if (!guest_id) return json({ error: "guest_id required" }, 400);

      // Verify guest belongs to user's event
      const admin = supaAdmin();
      const { data: guest, error: gErr } = await admin
        .from("rsvp_guests")
        .select("*, rsvp_events!inner(user_id)")
        .eq("id", guest_id)
        .single();

      if (gErr || !guest) return json({ error: "Guest not found" }, 404);
      if ((guest as any).rsvp_events.user_id !== claims.claims.sub) {
        return json({ error: "Forbidden" }, 403);
      }

      const key = await getJwtKey();
      const jwt = await djwt.create(
        { alg: "HS256", typ: "JWT" },
        { guest_token: guest.token, exp: djwt.getNumericDate(365 * 24 * 60 * 60) },
        key
      );

      return json({ link: jwt });
    }

    // ── VERIFY TOKEN + GET GUEST DATA (public) ──
    if (path === "verify" && req.method === "POST") {
      const { token } = await req.json();
      if (!token) return json({ error: "token required" }, 400);

      const key = await getJwtKey();
      let payload: any;
      try {
        payload = await djwt.verify(token, key);
      } catch {
        return json({ error: "Invalid or expired token" }, 401);
      }

      const admin = supaAdmin();
      const { data: guest, error } = await admin
        .from("rsvp_guests")
        .select("id, first_name, last_name, email, phone, group_name, max_companions, status, companions, dietary_restrictions, guest_message, responded_at, event_id")
        .eq("token", payload.guest_token)
        .single();

      if (error || !guest) return json({ error: "Guest not found" }, 404);

      const { data: event } = await admin
        .from("rsvp_events")
        .select("title, event_date, event_location, welcome_message, deadline")
        .eq("id", guest.event_id)
        .single();

      // Get couple display name
      const { data: eventFull } = await admin
        .from("rsvp_events")
        .select("user_id")
        .eq("id", guest.event_id)
        .single();

      let couple_name = null;
      if (eventFull) {
        const { data: wp } = await admin
          .from("user_wedding_profile")
          .select("couple_display_name, partner_one_first_name, partner_two_first_name")
          .eq("user_id", eventFull.user_id)
          .maybeSingle();
        if (wp) {
          couple_name = wp.couple_display_name || `${wp.partner_one_first_name} & ${wp.partner_two_first_name}`;
        }
      }

      return json({ guest, event, couple_name });
    }

    // ── RESPOND (public) ──
    if (path === "respond" && req.method === "POST") {
      const { token, status, companions, dietary_restrictions, guest_message, email, phone, menu_choice } = await req.json();
      if (!token || !status) return json({ error: "token and status required" }, 400);
      if (!["confirmed", "declined"].includes(status)) return json({ error: "Invalid status" }, 400);

      const key = await getJwtKey();
      let payload: any;
      try {
        payload = await djwt.verify(token, key);
      } catch {
        return json({ error: "Invalid or expired token" }, 401);
      }

      const admin = supaAdmin();

      // Check deadline
      const { data: guest } = await admin
        .from("rsvp_guests")
        .select("id, event_id, max_companions")
        .eq("token", payload.guest_token)
        .single();

      if (!guest) return json({ error: "Guest not found" }, 404);

      const { data: event } = await admin
        .from("rsvp_events")
        .select("deadline")
        .eq("id", guest.event_id)
        .single();

      if (event?.deadline && new Date(event.deadline) < new Date()) {
        return json({ error: "RSVP deadline has passed" }, 400);
      }

      // Validate companions count
      const companionsList = companions || [];
      if (companionsList.length > guest.max_companions) {
        return json({ error: `Maximum ${guest.max_companions} companions allowed` }, 400);
      }

      const { error } = await admin
        .from("rsvp_guests")
        .update({
          status,
          companions: companionsList,
          dietary_restrictions: dietary_restrictions || null,
          guest_message: guest_message || null,
          email: email || null,
          phone: phone || null,
          menu_choice: menu_choice || null,
          responded_at: new Date().toISOString(),
        })
        .eq("token", payload.guest_token);

      if (error) return json({ error: error.message }, 500);

      // Send confirmation email if email provided and Resend key exists
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (resendKey && email && status === "confirmed") {
        try {
          const { data: evt } = await admin
            .from("rsvp_events")
            .select("title, event_date, event_location")
            .eq("id", guest.event_id)
            .single();

          const { data: guestFull } = await admin
            .from("rsvp_guests")
            .select("first_name, last_name")
            .eq("token", payload.guest_token)
            .single();

          const eventDate = evt?.event_date
            ? new Date(evt.event_date).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
            : "Date à confirmer";

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "MariageAfro <noreply@mariageafro.com>",
              to: email,
              subject: `✨ Confirmation RSVP - ${evt?.title || "Mariage"}`,
              html: `
                <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf8f5;padding:40px 30px;border-radius:16px;">
                  <h1 style="color:#5a3e1b;font-size:28px;text-align:center;margin-bottom:24px;">
                    Merci ${guestFull?.first_name || ""} ! 🎉
                  </h1>
                  <p style="color:#6b5c4c;font-size:16px;line-height:1.8;text-align:center;">
                    Votre présence à <strong>${evt?.title || "notre mariage"}</strong> est confirmée.
                  </p>
                  <div style="background:white;border-radius:12px;padding:24px;margin:24px 0;border:1px solid #e8ddd0;">
                    <p style="margin:8px 0;color:#5a3e1b;"><strong>📅 Date :</strong> ${eventDate}</p>
                    <p style="margin:8px 0;color:#5a3e1b;"><strong>📍 Lieu :</strong> ${evt?.event_location || "À confirmer"}</p>
                    ${companionsList.length > 0 ? `<p style="margin:8px 0;color:#5a3e1b;"><strong>👥 Accompagnants :</strong> ${companionsList.map((c: any) => c.name).join(", ")}</p>` : ""}
                    ${dietary_restrictions ? `<p style="margin:8px 0;color:#5a3e1b;"><strong>🍽️ Régime :</strong> ${dietary_restrictions}</p>` : ""}
                  </div>
                  <p style="color:#9b8b7a;font-size:14px;text-align:center;margin-top:24px;">
                    Avec amour, MariageAfro ✨
                  </p>
                </div>
              `,
            }),
          });
        } catch (e) {
          console.error("Email send error:", e);
        }
      }

      return json({ success: true });
    }

    return json({ error: "Not found" }, 404);
  } catch (e) {
    console.error("RSVP error:", e);
    return json({ error: "Internal server error" }, 500);
  }
});

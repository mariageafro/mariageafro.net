import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const allowedOrigins = [
  "https://afro-heritage-vows.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

const logStep = (step: string, details?: any) => {
  console.log(`[CHECK-SUBSCRIPTION] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

// Map Stripe product IDs to subscription types
const PRODUCT_TO_TYPE: Record<string, string> = {
  "prod_TyKotN8DNRtubG": "pro",
  "prod_TyKpvjs8f8k6U8": "premium",
  "prod_TyKqPM9m3M5qOa": "elite",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  const corsHeaders = getCorsHeaders(req);

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { email: user.email });

    // Get prestataire for this user
    const { data: prestataire } = await supabaseClient
      .from("prestataires")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!prestataire) {
      return new Response(JSON.stringify({ subscribed: false, type: "gratuit" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      return new Response(JSON.stringify({ subscribed: false, type: "gratuit" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 1 });

    if (subscriptions.data.length === 0) {
      // Deactivate any active abonnement and set to gratuit
      await supabaseClient.from("abonnements").update({ actif: false }).eq("prestataire_id", prestataire.id).eq("actif", true);
      await supabaseClient.from("abonnements").upsert({
        prestataire_id: prestataire.id, type: "gratuit", actif: true, prix: 0, date_debut: new Date().toISOString(),
      }, { onConflict: "prestataire_id" }).select();

      return new Response(JSON.stringify({ subscribed: false, type: "gratuit" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sub = subscriptions.data[0];
    const productId = sub.items.data[0].price.product as string;
    const subType = PRODUCT_TO_TYPE[productId] || "pro";
    const subscriptionEnd = new Date(sub.current_period_end * 1000).toISOString();
    logStep("Active subscription found", { subType, subscriptionEnd });

    // Sync to abonnements table
    await supabaseClient.from("abonnements").update({ actif: false }).eq("prestataire_id", prestataire.id).eq("actif", true).neq("stripe_subscription_id", sub.id);
    
    const { data: existing } = await supabaseClient.from("abonnements").select("id").eq("stripe_subscription_id", sub.id).maybeSingle();
    
    if (existing) {
      await supabaseClient.from("abonnements").update({
        type: subType, actif: true, date_fin: subscriptionEnd, stripe_customer_id: customerId,
      }).eq("id", existing.id);
    } else {
      await supabaseClient.from("abonnements").update({ actif: false }).eq("prestataire_id", prestataire.id);
      await supabaseClient.from("abonnements").insert({
        prestataire_id: prestataire.id, type: subType, actif: true,
        stripe_subscription_id: sub.id, stripe_customer_id: customerId,
        date_debut: new Date(sub.current_period_start * 1000).toISOString(),
        date_fin: subscriptionEnd,
        prix: (sub.items.data[0].price.unit_amount || 0) / 100,
      });
    }

    return new Response(JSON.stringify({ subscribed: true, type: subType, subscription_end: subscriptionEnd, product_id: productId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

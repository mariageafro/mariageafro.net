import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { origin_one, origin_two, wedding_type, country, budget, guest_count, wedding_style } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Tu es un expert en mariages multiculturels de la diaspora africaine et caribéenne. Tu génères des recommandations personnalisées pour des couples selon leurs origines culturelles.

IMPORTANT: Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans backticks, sans texte avant ou après.

Le JSON doit avoir cette structure exacte:
{
  "cultural_profile": {
    "complexity_score": number (1-100),
    "complexity_label": "Fluide" | "Modéré" | "Complexe",
    "estimated_duration_hours": number,
    "traditions_count": number
  },
  "recommended_budget": {
    "ideal_total": number,
    "breakdown": [
      { "category": string, "percent": number, "amount": number, "reason": string }
    ],
    "budget_assessment": string
  },
  "traditions": [
    { "name": string, "description": string, "timing": string, "importance": "essentiel" | "recommandé" | "optionnel", "icon": string }
  ],
  "vendor_recommendations": [
    { "role": string, "why": string, "cultural_score": number, "badge": string, "icon": string }
  ],
  "personalized_tips": [
    { "tip": string, "category": string, "icon": string }
  ],
  "timeline_additions": [
    { "title": string, "suggested_time": string, "duration_min": number, "description": string, "icon": string }
  ],
  "style_suggestions": {
    "visual_intensity": "épuré" | "modéré" | "intense",
    "animation_level": "minimal" | "dynamique" | "spectaculaire",
    "color_accent": string,
    "ambiance": string
  }
}`;

    const userPrompt = `Couple:
- Origine partenaire 1: ${origin_one || "Congo (Kinshasa)"}
- Origine partenaire 2: ${origin_two || "Cameroun"}
- Type de mariage: ${wedding_type || "mixte (civil + religieux + traditionnel)"}
- Pays du mariage: ${country || "France"}
- Budget: ${budget || 35000} €
- Nombre d'invités: ${guest_count || 250}
- Style souhaité: ${wedding_style || "Afro-luxe moderne"}

Génère des recommandations culturelles ultra-personnalisées pour ce couple. Inclus les traditions spécifiques à leurs origines, les types de prestataires adaptés, le budget recommandé par catégorie (au moins 10 catégories), au moins 5 traditions, au moins 8 recommandations prestataires, au moins 6 conseils personnalisés, et au moins 4 ajouts timeline.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      console.error("AI gateway error:", status, text);
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans un instant." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Crédits insuffisants." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Erreur du service de recommandation." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response, handling potential markdown wrapping
    let recommendations;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      recommendations = JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Réponse invalide du moteur de recommandation.", raw: content }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("cultural-recommendations error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

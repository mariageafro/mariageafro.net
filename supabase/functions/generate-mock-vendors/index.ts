import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CATEGORIES = [
  { id: "11111111-0001-0001-0001-000000000001", slug: "image-souvenirs", count: 120 },
  { id: "11111111-0001-0001-0001-000000000002", slug: "animation-ambiance", count: 80 },
  { id: "11111111-0001-0001-0001-000000000003", slug: "mode-tenues", count: 50 },
  { id: "11111111-0001-0001-0001-000000000009", slug: "beaute", count: 60 },
  { id: "11111111-0001-0001-0001-000000000004", slug: "traiteurs-gastronomie", count: 40 },
  { id: "11111111-0001-0001-0001-000000000005", slug: "decoration-lieux", count: 60 },
  { id: "11111111-0001-0001-0001-000000000006", slug: "ceremonies-coutumes", count: 50 },
  { id: "11111111-0001-0001-0001-000000000007", slug: "logistique-services", count: 40 },
  { id: "11111111-0001-0001-0001-000000000008", slug: "bijoux-accessoires", count: 40 },
];

const VILLES = [
  { ville: "Paris", pays: "France", lat: 48.8566, lng: 2.3522 },
  { ville: "Lyon", pays: "France", lat: 45.764, lng: 4.8357 },
  { ville: "Marseille", pays: "France", lat: 43.2965, lng: 5.3698 },
  { ville: "Toulouse", pays: "France", lat: 43.6047, lng: 1.4442 },
  { ville: "Bordeaux", pays: "France", lat: 44.8378, lng: -0.5792 },
  { ville: "Lille", pays: "France", lat: 50.6292, lng: 3.0573 },
  { ville: "Nantes", pays: "France", lat: 47.2184, lng: -1.5536 },
  { ville: "Strasbourg", pays: "France", lat: 48.5734, lng: 7.7521 },
  { ville: "Montpellier", pays: "France", lat: 43.6108, lng: 3.8767 },
  { ville: "Bruxelles", pays: "Belgique", lat: 50.8503, lng: 4.3517 },
  { ville: "Liège", pays: "Belgique", lat: 50.6292, lng: 5.5797 },
  { ville: "Anvers", pays: "Belgique", lat: 51.2194, lng: 4.4025 },
  { ville: "Berlin", pays: "Allemagne", lat: 52.52, lng: 13.405 },
  { ville: "Francfort", pays: "Allemagne", lat: 50.1109, lng: 8.6821 },
  { ville: "Londres", pays: "Royaume-Uni", lat: 51.5074, lng: -0.1278 },
  { ville: "Manchester", pays: "Royaume-Uni", lat: 53.4808, lng: -2.2426 },
  { ville: "Birmingham", pays: "Royaume-Uni", lat: 52.4862, lng: -1.8904 },
];

const CULTURES = [
  "Congolaise", "Camerounaise", "Sénégalaise", "Ivoirienne", "Béninoise",
  "Togolaise", "Malienne", "Guinéenne", "Nigériane", "Ghanéenne",
  "Antillaise", "Haïtienne", "Cap-Verdienne", "Rwandaise", "Gabonaise",
  "Centrafricaine", "Burkinabè", "Malgache",
];

const LANGUES_OPTIONS = [
  ["Français"], ["Français", "Anglais"], ["Français", "Lingala"],
  ["Français", "Wolof"], ["Français", "Bambara"], ["Français", "Anglais", "Portugais"],
  ["Anglais"], ["Français", "Créole"], ["Français", "Anglais", "Lingala"],
  ["Français", "Yoruba"],
];

const BADGES = ["FREE", "FREE", "FREE", "FREE", "FREE", "PREMIUM", "PREMIUM", "VIP", "AMBASSADOR"];

const PHOTO_SETS: Record<string, string[]> = {
  "image-souvenirs": [
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600",
  ],
  "animation-ambiance": [
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600",
    "https://images.unsplash.com/photo-1501612780327-45045538702b?w=600",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600",
    "https://images.unsplash.com/photo-1571266028243-3716f02d2d58?w=600",
  ],
  "mode-tenues": [
    "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=600",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600",
    "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=600",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600",
  ],
  "beaute": [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600",
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600",
    "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600",
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600",
  ],
  "traiteurs-gastronomie": [
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=600",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600",
  ],
  "decoration-lieux": [
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600",
    "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
    "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=600",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600",
  ],
  "ceremonies-coutumes": [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=600",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600",
    "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600",
  ],
  "logistique-services": [
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600",
  ],
  "bijoux-accessoires": [
    "https://images.unsplash.com/photo-1515562141589-67f0d727b750?w=600",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600",
    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600",
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600",
  ],
};

const NAMES: Record<string, string[]> = {
  "image-souvenirs": [
    "Objectif Mariage", "AfroLens Studio", "Kongo Films", "Vision Afrique", "Click & Love",
    "Diamant Photo", "Lumière d'Afrique", "Black Memories", "Flash d'Or", "MomentCapture",
    "CinéWedding", "Pixels Sacrés", "Photo Éternelle", "Studio Wazobia", "AfroShot",
    "CaptureJoy", "DiasporaLens", "Golden Frame", "NubiaPix", "SahelVision",
    "EdenPhoto", "TamTam Films", "Celeste Studio", "Mariage en Images", "Heritage Lens",
  ],
  "animation-ambiance": [
    "DJ Kongo Vibes", "Afrobeat Mix", "Gospel Harmony", "Tam-Tam Events", "Soirée d'Or",
    "DJ Mboa", "MC Africa", "Rythm Nation", "Chorale Grâce", "Beat Master",
    "Percussion d'Afrique", "Son du Sahel", "Live Band Africa", "DJ Wazobia", "Musique Royale",
    "Ambiance Totale", "Son Divin", "Groove Africa", "DJ Kinshasa", "Festival Sound",
  ],
  "mode-tenues": [
    "Wax & Élégance", "Couture Royale", "Atelier Nkembo", "Mode Afro Chic", "La Mariée d'Afrique",
    "Bogolan Couture", "Style Impérial", "Kente Design", "Ankara Bride", "Dashiki Dreams",
    "Tissu d'Or", "Adinkra Style", "Faso Dan Fani", "Prestige Couture", "Robe Éternelle",
  ],
  "beaute": [
    "Glow Afro Beauty", "Nappy Queen", "Beauty by Amara", "Maquillage d'Afrique", "Afro Glam",
    "Beauté Royale", "Locks & Beauty", "Shine Studio", "Éclat d'Ébène", "Beauty Diaspor",
    "Noire et Belle", "Afrochic Beauty", "Maquilleuse d'Or", "Style Afro", "Beauté Naturelle",
    "Glow Up Pro", "Ébène Beauty", "Melanin Magic", "Curl Queen", "Braids & Beyond",
  ],
  "traiteurs-gastronomie": [
    "Saveurs du Congo", "Maman Africa Traiteur", "Taste of Naija", "Délices d'Abidjan", "Chef Baobab",
    "Banquet Royal", "Cuisine Sacrée", "Mafé d'Or", "Festin Afro", "Saveurs Métissées",
    "Le Goût du Pays", "Chez Maman Cuisine", "Tropical Feast", "Cuisine Royale", "Gastro Africa",
  ],
  "decoration-lieux": [
    "Déco Harmonie", "Fleurs d'Afrique", "Événement Royal", "Éden Déco", "AfroFloral",
    "Lumières & Merveilles", "Décor de Rêve", "Style & Scène", "Mariage en Couleurs", "Oasis Déco",
    "Fleuriste d'Exception", "Ambiance Florale", "Espace Magique", "Décoration Prestige", "L'Atelier Déco",
  ],
  "ceremonies-coutumes": [
    "Wedding Planner Afro", "Coordination d'Or", "Cérémonie Sacrée", "Le Grand Jour", "Traditions & Joie",
    "Organisation Premium", "Mariage Express", "Planner Prestige", "Coutume & Classe", "Alliance Cérémonie",
    "Planificateur Royal", "L'Art du Mariage", "Mariage Parfait", "Officiant Prestige", "Cérémonie Divine",
  ],
  "logistique-services": [
    "Transport VIP", "Limousine Royale", "Wedding Cars", "Conciergerie Mariage", "Guard & Style",
    "Accueil & Prestige", "Kids Fun Wedding", "Travel Wedding", "Shuttle Service", "Hébergement Invités",
    "Service Premium", "VIP Event", "Sécurité d'Or", "Transport de Luxe", "Wedding Logistics",
  ],
  "bijoux-accessoires": [
    "Bijoux Heritage", "Or d'Afrique", "Alliance Éternelle", "Perles & Diamants", "Accessoire Royal",
    "Bijouterie Prestige", "Collier d'Or", "Bague de Rêve", "Trésor d'Ébène", "Parure Royale",
    "Bijoux Tradition", "Gemmes d'Afrique", "Cristal & Or", "Bijoutier Artisan", "Perles Sacrées",
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomFloat(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const userId = "bc978468-7f5c-417f-8bb6-51f793f5db98"; // test user
    let totalInserted = 0;

    for (const cat of CATEGORIES) {
      const photos = PHOTO_SETS[cat.slug] || PHOTO_SETS["image-souvenirs"];
      const names = NAMES[cat.slug] || NAMES["image-souvenirs"];

      const vendors = [];
      for (let i = 0; i < cat.count; i++) {
        const loc = pick(VILLES);
        const name = `${pick(names)} ${loc.ville.slice(0, 3)}${Math.floor(Math.random() * 999)}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + crypto.randomUUID().slice(0, 8);
        const badge = pick(BADGES);
        const verified = Math.random() > 0.3;
        const isLifetime = badge === "VIP" || badge === "FOUNDER";
        const isFeatured = badge !== "FREE" && Math.random() > 0.4;

        vendors.push({
          user_id: userId,
          nom_entreprise: name,
          slug,
          ville: loc.ville,
          pays: loc.pays,
          lat: loc.lat + randomFloat(-0.05, 0.05),
          lng: loc.lng + randomFloat(-0.05, 0.05),
          categorie_id: cat.id,
          statut: "actif" as const,
          verified,
          photo_url: pick(photos),
          origine_culturelle: pick(CULTURES),
          langues: pick(LANGUES_OPTIONS),
          badge_type: badge,
          is_featured: isFeatured,
          is_lifetime_featured: isLifetime,
          priority_score: Math.floor(Math.random() * 50),
          score_ranking: Math.floor(Math.random() * 500),
          import_batch: "mock-marketplace-v2",
          description: `Professionnel du mariage spécialisé en culture afro. Basé à ${loc.ville}, ${loc.pays}. Service premium et personnalisé.`,
          description_fr: `Prestataire de mariage afro basé à ${loc.ville}. Expérience de plus de ${3 + Math.floor(Math.random() * 12)} ans.`,
        });
      }

      // Insert in batches of 50
      for (let b = 0; b < vendors.length; b += 50) {
        const batch = vendors.slice(b, b + 50);
        const { error } = await supabase.from("prestataires").insert(batch);
        if (error) {
          console.error(`Error inserting batch for ${cat.slug}:`, error);
          return new Response(JSON.stringify({ error: error.message, category: cat.slug }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        totalInserted += batch.length;
      }
    }

    // Now generate reviews for some vendors
    const { data: newVendors } = await supabase
      .from("prestataires")
      .select("id")
      .eq("import_batch", "mock-marketplace-v2")
      .limit(500);

    if (newVendors) {
      const reviews = [];
      for (const v of newVendors) {
        if (Math.random() > 0.3) {
          const reviewCount = 1 + Math.floor(Math.random() * 8);
          for (let r = 0; r < reviewCount; r++) {
            reviews.push({
              prestataire_id: v.id,
              client_id: userId,
              note: [4, 4, 4.5, 4.5, 5, 5, 4, 3.5, 4.8, 4.2][Math.floor(Math.random() * 10)],
              commentaire: pick([
                "Excellent service, très professionnel !",
                "Je recommande à 100%, une vraie perle !",
                "Très satisfait, résultat magnifique.",
                "Top qualité, rapport qualité-prix imbattable.",
                "Magnifique travail, merci beaucoup !",
                "Super prestation, équipe au top !",
                "Service impeccable du début à la fin.",
                "Créatif et à l'écoute, parfait !",
              ]),
              approved: true,
            });
          }
        }
      }

      // Insert reviews in batches
      for (let b = 0; b < reviews.length; b += 100) {
        const batch = reviews.slice(b, b + 100);
        await supabase.from("avis").insert(batch);
      }
    }

    return new Response(JSON.stringify({ success: true, totalInserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

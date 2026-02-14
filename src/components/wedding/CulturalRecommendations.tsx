import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sparkles, Globe, Wand2, Star, Lightbulb, Clock, Palette,
  BarChart3, ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";

interface CulturalRecommendationsProps {
  originOne: string;
  originTwo: string;
  weddingType?: string;
  country?: string;
  budget?: number;
  guestCount?: number;
  weddingStyle?: string;
  autoLoad?: boolean;
  showVendorLinks?: boolean;
}

function buildCacheKey(props: Omit<CulturalRecommendationsProps, 'autoLoad' | 'showVendorLinks'>) {
  return `${props.originOne}|${props.originTwo}|${props.weddingType || 'mixte'}|${props.country || 'France'}|${props.budget || 15000}|${props.guestCount || 100}|${props.weddingStyle || 'moderne'}`;
}

export function CulturalRecommendations({
  originOne, originTwo, weddingType, country, budget, guestCount, weddingStyle,
  autoLoad = false, showVendorLinks = true,
}: CulturalRecommendationsProps) {
  const { user } = useAuthContext();
  const [reco, setReco] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  const cacheKey = buildCacheKey({ originOne, originTwo, weddingType, country, budget, guestCount, weddingStyle });

  // Try loading from cache first
  useEffect(() => {
    if (!user || !autoLoad) return;
    const loadCached = async () => {
      const { data } = await supabase
        .from("cultural_recommendations_cache")
        .select("recommendations, expires_at")
        .eq("user_id", user.id)
        .eq("cache_key", cacheKey)
        .maybeSingle();
      if (data && new Date(data.expires_at) > new Date()) {
        setReco(data.recommendations);
        setFromCache(true);
      } else if (autoLoad && originOne && originTwo) {
        loadRecommendations();
      }
    };
    loadCached();
  }, [user, autoLoad, cacheKey]);

  // Auto-load for non-authenticated users (demo)
  useEffect(() => {
    if (!user && autoLoad && originOne && originTwo && !reco && !loading) {
      loadRecommendations();
    }
  }, [autoLoad, originOne, originTwo]);

  const saveToCache = async (data: any) => {
    if (!user) return;
    await supabase
      .from("cultural_recommendations_cache")
      .upsert({
        user_id: user.id,
        cache_key: cacheKey,
        recommendations: data,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: "user_id,cache_key" });
  };

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);
    setFromCache(false);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("cultural-recommendations", {
        body: {
          origin_one: originOne,
          origin_two: originTwo,
          wedding_type: weddingType || "mixte",
          country: country || "France",
          budget: budget || 15000,
          guest_count: guestCount || 100,
          wedding_style: weddingStyle || "moderne",
        },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setReco(data);
      await saveToCache(data);
    } catch (e: any) {
      setError(e.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  if (!reco && !loading) {
    return (
      <div className="rounded-2xl border border-white/30 bg-white/40 backdrop-blur-xl shadow-elegant p-8 text-center">
        <Globe className="text-primary mx-auto mb-3" size={40} />
        <h3 className="font-serif text-lg text-chocolate mb-2">Recommandations culturelles</h3>
        <p className="font-body text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
          Découvrez des suggestions personnalisées pour un mariage {originOne} × {originTwo}
        </p>
        <Button onClick={loadRecommendations} className="font-body gap-2">
          <Wand2 size={14} /> Générer mes recommandations
        </Button>
        {error && <p className="font-body text-xs text-destructive mt-3">{error}</p>}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/30 bg-white/40 backdrop-blur-xl shadow-elegant p-8 text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="inline-block mb-3">
          <Sparkles className="text-primary" size={32} />
        </motion.div>
        <p className="font-serif text-lg text-chocolate">Analyse culturelle en cours…</p>
        <p className="font-body text-sm text-muted-foreground">Traditions, budget et prestataires adaptés à votre profil</p>
      </div>
    );
  }

  if (!reco) return null;

  return (
    <div className="space-y-4">
      {/* Complexity + Budget summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reco.cultural_profile && (
          <div className="rounded-2xl border border-white/30 bg-white/40 backdrop-blur-xl shadow-elegant p-5">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(35, 20%, 90%)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={reco.cultural_profile.complexity_score > 70 ? "hsl(15, 70%, 50%)" : reco.cultural_profile.complexity_score > 40 ? "hsl(38, 70%, 50%)" : "hsl(140, 50%, 40%)"}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - reco.cultural_profile.complexity_score / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-lg text-chocolate">{reco.cultural_profile.complexity_score}</span>
                </div>
              </div>
              <div>
                <p className="font-body text-xs text-muted-foreground">Complexité</p>
                <p className="font-body text-sm font-semibold">
                  {reco.cultural_profile.complexity_score > 70 ? "🔴" : reco.cultural_profile.complexity_score > 40 ? "🟡" : "🟢"}{" "}
                  {reco.cultural_profile.complexity_label}
                </p>
                <p className="font-body text-[10px] text-muted-foreground mt-1">
                  ~{reco.cultural_profile.estimated_duration_hours}h · {reco.cultural_profile.traditions_count} traditions
                </p>
              </div>
            </div>
          </div>
        )}

        {reco.recommended_budget && (
          <div className="rounded-2xl border border-white/30 bg-white/40 backdrop-blur-xl shadow-elegant p-5">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={16} className="text-primary" />
              <p className="font-body text-sm font-semibold">Budget optimisé</p>
            </div>
            <div className="flex gap-4 mb-2">
              <div>
                <p className="font-body text-[10px] text-muted-foreground">Conseillé</p>
                <p className="font-serif text-lg text-primary">{reco.recommended_budget.ideal_total?.toLocaleString("fr-FR")} €</p>
              </div>
              <div>
                <p className="font-body text-[10px] text-muted-foreground">Votre budget</p>
                <p className="font-serif text-lg text-chocolate">{(budget || 15000).toLocaleString("fr-FR")} €</p>
              </div>
            </div>
            <p className="font-body text-xs text-muted-foreground">{reco.recommended_budget.budget_assessment}</p>
          </div>
        )}
      </div>

      {/* Vendor recommendations with marketplace links */}
      {reco.vendor_recommendations?.length > 0 && (
        <div className="rounded-2xl border border-white/30 bg-white/40 backdrop-blur-xl shadow-elegant p-5">
          <h3 className="font-serif text-lg text-chocolate mb-3 flex items-center gap-2">
            <Star size={16} className="text-primary" /> Prestataires adaptés à votre tradition
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {reco.vendor_recommendations.slice(0, expanded ? undefined : 6).map((v: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 bg-muted/10 rounded-xl hover:bg-muted/20 transition-all"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">{v.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold truncate">{v.role}</p>
                    <span className="text-[9px] font-body bg-primary/10 text-primary rounded-full px-1.5 py-0.5">{v.badge}</span>
                  </div>
                </div>
                <p className="font-body text-[10px] text-muted-foreground mb-1.5">{v.why}</p>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${v.cultural_score}%` }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.05 }}
                    />
                  </div>
                  <span className="font-body text-[10px] font-semibold text-primary">{v.cultural_score}%</span>
                </div>
                {showVendorLinks && (
                  <Link
                    to={`/prestataires?search=${encodeURIComponent(v.role)}`}
                    className="font-body text-[10px] text-primary hover:underline flex items-center gap-1"
                  >
                    <ExternalLink size={9} /> Voir les prestataires
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
          {reco.vendor_recommendations.length > 6 && (
            <button onClick={() => setExpanded(!expanded)} className="font-body text-xs text-primary hover:underline mt-2 w-full text-center flex items-center justify-center gap-1">
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {expanded ? "Réduire" : `Voir les ${reco.vendor_recommendations.length - 6} autres`}
            </button>
          )}
        </div>
      )}

      {/* Traditions + Tips compact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reco.traditions?.length > 0 && (
          <div className="rounded-2xl border border-white/30 bg-white/40 backdrop-blur-xl shadow-elegant p-5">
            <h3 className="font-serif text-base text-chocolate mb-3">🌍 Traditions à intégrer</h3>
            <div className="space-y-2">
              {reco.traditions.slice(0, 5).map((t: any, i: number) => (
                <div key={i} className="flex items-start gap-2 py-1.5 border-b border-border/20 last:border-0">
                  <span className="text-sm flex-shrink-0">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-body text-xs font-semibold truncate">{t.name}</p>
                      <span className={`text-[8px] px-1 py-0.5 rounded-full font-body ${
                        t.importance === "essentiel" ? "bg-primary/15 text-primary" :
                        t.importance === "recommandé" ? "bg-accent/20 text-accent-foreground" :
                        "bg-muted text-muted-foreground"
                      }`}>{t.importance}</span>
                    </div>
                    <p className="font-body text-[10px] text-muted-foreground">{t.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reco.personalized_tips?.length > 0 && (
          <div className="rounded-2xl border border-white/30 bg-white/40 backdrop-blur-xl shadow-elegant p-5">
            <h3 className="font-serif text-base text-chocolate mb-3 flex items-center gap-2">
              <Lightbulb size={14} className="text-primary" /> Conseils personnalisés
            </h3>
            <div className="space-y-2">
              {reco.personalized_tips.slice(0, 5).map((tip: any, i: number) => (
                <div key={i} className="flex items-start gap-2 py-1.5 border-b border-border/20 last:border-0">
                  <span className="text-sm flex-shrink-0">{tip.icon}</span>
                  <div>
                    <p className="font-body text-xs">{tip.tip}</p>
                    <span className="font-body text-[9px] text-muted-foreground">{tip.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Regenerate */}
      <div className="text-center flex items-center justify-center gap-3">
        <Button variant="outline" size="sm" onClick={loadRecommendations} className="font-body text-xs gap-1.5">
          <Wand2 size={12} /> Régénérer
        </Button>
        {fromCache && (
          <span className="font-body text-[10px] text-muted-foreground">✓ Chargé instantanément</span>
        )}
      </div>
    </div>
  );
}

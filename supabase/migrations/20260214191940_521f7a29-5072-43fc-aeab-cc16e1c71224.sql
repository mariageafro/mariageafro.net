
-- Cache table for AI cultural recommendations
CREATE TABLE public.cultural_recommendations_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cache_key TEXT NOT NULL,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  UNIQUE(user_id, cache_key)
);

ALTER TABLE public.cultural_recommendations_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cached recommendations"
ON public.cultural_recommendations_cache FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cached recommendations"
ON public.cultural_recommendations_cache FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cached recommendations"
ON public.cultural_recommendations_cache FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cached recommendations"
ON public.cultural_recommendations_cache FOR DELETE
USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_cultural_reco_cache_lookup ON public.cultural_recommendations_cache (user_id, cache_key);

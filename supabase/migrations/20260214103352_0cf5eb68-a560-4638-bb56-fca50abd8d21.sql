
-- 1. Add 'draft' to prestataire_statut enum
ALTER TYPE public.prestataire_statut ADD VALUE IF NOT EXISTS 'draft';

-- 2. Add new columns to prestataires
ALTER TABLE public.prestataires
ADD COLUMN IF NOT EXISTS description_fr text,
ADD COLUMN IF NOT EXISTS description_en text,
ADD COLUMN IF NOT EXISTS photo_url text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS badge_type text DEFAULT 'FREE',
ADD COLUMN IF NOT EXISTS free_until date,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_lifetime_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS priority_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS import_batch text;

-- 3. Validation trigger: force draft if no photo_url when activating
CREATE OR REPLACE FUNCTION public.validate_prestataire_photo()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.statut = 'actif' AND (NEW.photo_url IS NULL OR trim(NEW.photo_url) = '') THEN
    NEW.statut := 'draft';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_photo_for_active
BEFORE INSERT OR UPDATE ON public.prestataires
FOR EACH ROW
EXECUTE FUNCTION public.validate_prestataire_photo();

-- 4. Updated ranking score function using badge tiers
CREATE OR REPLACE FUNCTION public.calculate_ranking_score(_prestataire_id uuid)
RETURNS numeric
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  badge text;
  p_free_until date;
  badge_weight numeric := 0;
  p_is_lifetime boolean := false;
  p_is_featured boolean := false;
  p_priority integer := 0;
  avg_note numeric := 0;
BEGIN
  SELECT badge_type, free_until, is_lifetime_featured, is_featured, priority_score
  INTO badge, p_free_until, p_is_lifetime, p_is_featured, p_priority
  FROM public.prestataires WHERE id = _prestataire_id;

  -- Badge weight
  CASE badge
    WHEN 'FOUNDER' THEN badge_weight := 1000;
    WHEN 'VIP' THEN badge_weight := 900;
    WHEN 'PREMIUM' THEN badge_weight := 200;
    WHEN 'AMBASSADOR' THEN
      IF p_free_until >= CURRENT_DATE THEN badge_weight := 150;
      ELSE badge_weight := 0;
      END IF;
    ELSE badge_weight := 0;
  END CASE;

  -- Average rating bonus
  SELECT COALESCE(AVG(note), 0) INTO avg_note
  FROM public.avis WHERE prestataire_id = _prestataire_id AND approved = true;

  -- Composite score: lifetime flag (10000) + priority*10 + featured(500) + badge_weight + rating*2
  RETURN (CASE WHEN COALESCE(p_is_lifetime, false) THEN 10000 ELSE 0 END)
       + COALESCE(p_priority, 0) * 10
       + (CASE WHEN COALESCE(p_is_featured, false) THEN 500 ELSE 0 END)
       + badge_weight
       + (avg_note * 2);
END;
$$;

-- 5. Ambassador auto-downgrade function
CREATE OR REPLACE FUNCTION public.downgrade_expired_ambassadors()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.prestataires
  SET badge_type = 'FREE',
      is_featured = false,
      priority_score = 0,
      updated_at = now()
  WHERE badge_type = 'AMBASSADOR'
    AND free_until < CURRENT_DATE;
END;
$$;

-- 6. Sub-categories admin write policies (SECURITY FIX)
CREATE POLICY "Admins can manage sub-categories"
ON public.sub_categories
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 7. Pages table i18n columns
ALTER TABLE public.pages
ADD COLUMN IF NOT EXISTS title_fr text,
ADD COLUMN IF NOT EXISTS title_en text,
ADD COLUMN IF NOT EXISTS content_fr text,
ADD COLUMN IF NOT EXISTS content_en text;

-- Copy existing data to FR columns
UPDATE public.pages SET title_fr = title WHERE title_fr IS NULL;
UPDATE public.pages SET content_fr = content WHERE content_fr IS NULL;

-- 8. Updated admin_import_prestataire to support all new fields
CREATE OR REPLACE FUNCTION public.admin_import_prestataire(
  _nom_entreprise text,
  _ville text DEFAULT NULL,
  _pays text DEFAULT 'France',
  _description text DEFAULT NULL,
  _telephone text DEFAULT NULL,
  _categorie_id uuid DEFAULT NULL,
  _statut prestataire_statut DEFAULT 'en_attente',
  _description_fr text DEFAULT NULL,
  _description_en text DEFAULT NULL,
  _photo_url text DEFAULT NULL,
  _email text DEFAULT NULL,
  _instagram text DEFAULT NULL,
  _whatsapp text DEFAULT NULL,
  _site_web text DEFAULT NULL,
  _badge_type text DEFAULT 'FREE',
  _free_until date DEFAULT NULL,
  _is_featured boolean DEFAULT false,
  _is_lifetime_featured boolean DEFAULT false,
  _priority_score integer DEFAULT 0,
  _import_batch text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_id uuid;
  new_slug text;
  final_statut prestataire_statut;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  new_slug := lower(regexp_replace(_nom_entreprise, '[^a-zA-Z0-9]+', '-', 'g'));
  new_slug := new_slug || '-' || substr(gen_random_uuid()::text, 1, 8);

  -- Force draft if no photo and trying to set active
  IF _statut = 'actif' AND (_photo_url IS NULL OR trim(_photo_url) = '') THEN
    final_statut := 'draft';
  ELSE
    final_statut := _statut;
  END IF;

  INSERT INTO public.prestataires (
    user_id, nom_entreprise, slug, ville, pays, description, telephone,
    categorie_id, statut, verified, description_fr, description_en,
    photo_url, email, instagram, whatsapp, site_web, badge_type,
    free_until, is_featured, is_lifetime_featured, priority_score, import_batch
  ) VALUES (
    auth.uid(), _nom_entreprise, new_slug, _ville, _pays,
    COALESCE(_description_fr, _description), _telephone, _categorie_id,
    final_statut, true, _description_fr, _description_en, _photo_url,
    _email, _instagram, _whatsapp, _site_web,
    COALESCE(_badge_type, 'FREE'), _free_until,
    COALESCE(_is_featured, false), COALESCE(_is_lifetime_featured, false),
    COALESCE(_priority_score, 0), _import_batch
  ) RETURNING id INTO new_id;

  -- Set lifetime featured for FOUNDER/VIP
  IF _badge_type IN ('FOUNDER', 'VIP') THEN
    UPDATE public.prestataires
    SET is_lifetime_featured = true
    WHERE id = new_id;
  END IF;

  -- Calculate ranking score
  UPDATE public.prestataires
  SET score_ranking = public.calculate_ranking_score(new_id)
  WHERE id = new_id;

  RETURN new_id;
END;
$$;

-- 9. Updated admin_update_prestataire to handle all new fields
CREATE OR REPLACE FUNCTION public.admin_update_prestataire(_prestataire_id uuid, _updates jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  UPDATE public.prestataires
  SET
    statut = COALESCE((_updates->>'statut')::prestataire_statut, statut),
    verified = COALESCE((_updates->>'verified')::boolean, verified),
    nom_entreprise = COALESCE(_updates->>'nom_entreprise', nom_entreprise),
    description = COALESCE(_updates->>'description', description),
    description_fr = COALESCE(_updates->>'description_fr', description_fr),
    description_en = COALESCE(_updates->>'description_en', description_en),
    photo_url = COALESCE(_updates->>'photo_url', photo_url),
    email = COALESCE(_updates->>'email', email),
    telephone = COALESCE(_updates->>'telephone', telephone),
    instagram = COALESCE(_updates->>'instagram', instagram),
    whatsapp = COALESCE(_updates->>'whatsapp', whatsapp),
    site_web = COALESCE(_updates->>'site_web', site_web),
    ville = COALESCE(_updates->>'ville', ville),
    pays = COALESCE(_updates->>'pays', pays),
    badge_type = COALESCE(_updates->>'badge_type', badge_type),
    free_until = CASE WHEN _updates ? 'free_until' THEN (_updates->>'free_until')::date ELSE free_until END,
    is_featured = COALESCE((_updates->>'is_featured')::boolean, is_featured),
    is_lifetime_featured = COALESCE((_updates->>'is_lifetime_featured')::boolean, is_lifetime_featured),
    priority_score = COALESCE((_updates->>'priority_score')::integer, priority_score),
    import_batch = COALESCE(_updates->>'import_batch', import_batch),
    updated_at = now()
  WHERE id = _prestataire_id;

  -- Recalculate ranking
  UPDATE public.prestataires
  SET score_ranking = public.calculate_ranking_score(_prestataire_id)
  WHERE id = _prestataire_id;
END;
$$;

-- 10. Index for ranking queries
CREATE INDEX IF NOT EXISTS idx_prestataires_ranking
ON public.prestataires (is_lifetime_featured DESC NULLS LAST, score_ranking DESC NULLS LAST, created_at DESC);

-- 11. Index for badge type filtering
CREATE INDEX IF NOT EXISTS idx_prestataires_badge ON public.prestataires (badge_type);

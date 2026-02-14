
-- ============================================================
-- P0 SECURITY: Extract contact info from prestataires to prestataire_contacts
-- ============================================================

-- Step 1: Create prestataire_contacts table
CREATE TABLE public.prestataire_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prestataire_id uuid NOT NULL UNIQUE REFERENCES public.prestataires(id) ON DELETE CASCADE,
  telephone text,
  whatsapp text,
  email text,
  instagram text,
  site_web text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Step 2: Enable RLS
ALTER TABLE public.prestataire_contacts ENABLE ROW LEVEL SECURITY;

-- Step 3: Migrate ALL existing data
INSERT INTO public.prestataire_contacts (prestataire_id, telephone, whatsapp, email, instagram, site_web)
SELECT id, telephone, whatsapp, email, instagram, site_web
FROM public.prestataires;

-- Step 4: RLS Policies
-- Authenticated users can view contacts (no anonymous/public access)
CREATE POLICY "Authenticated users can view contacts"
  ON public.prestataire_contacts FOR SELECT
  TO authenticated
  USING (true);

-- Owner can insert their own contacts
CREATE POLICY "Owner can insert contacts"
  ON public.prestataire_contacts FOR INSERT
  TO authenticated
  WITH CHECK (owns_prestataire(prestataire_id, auth.uid()) OR has_role(auth.uid(), 'admin'));

-- Owner can update their own contacts
CREATE POLICY "Owner can update contacts"
  ON public.prestataire_contacts FOR UPDATE
  TO authenticated
  USING (owns_prestataire(prestataire_id, auth.uid()) OR has_role(auth.uid(), 'admin'));

-- Owner can delete their own contacts
CREATE POLICY "Owner can delete contacts"
  ON public.prestataire_contacts FOR DELETE
  TO authenticated
  USING (owns_prestataire(prestataire_id, auth.uid()) OR has_role(auth.uid(), 'admin'));

-- Step 5: Trigger for updated_at
CREATE TRIGGER update_prestataire_contacts_updated_at
  BEFORE UPDATE ON public.prestataire_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Step 6: Drop BOTH overloads of admin_import_prestataire
DROP FUNCTION IF EXISTS public.admin_import_prestataire(text, text, text, text, text, uuid, prestataire_statut);
DROP FUNCTION IF EXISTS public.admin_import_prestataire(text, text, text, text, text, uuid, prestataire_statut, text, text, text, text, text, text, text, text, date, boolean, boolean, integer, text);

-- Step 7: Recreate admin_import_prestataire (single version, contacts go to new table)
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

  IF _statut = 'actif' AND (_photo_url IS NULL OR trim(_photo_url) = '') THEN
    final_statut := 'draft';
  ELSE
    final_statut := _statut;
  END IF;

  INSERT INTO public.prestataires (
    user_id, nom_entreprise, slug, ville, pays, description,
    categorie_id, statut, verified, description_fr, description_en,
    photo_url, badge_type, free_until, is_featured, is_lifetime_featured,
    priority_score, import_batch
  ) VALUES (
    auth.uid(), _nom_entreprise, new_slug, _ville, _pays,
    COALESCE(_description_fr, _description), _categorie_id,
    final_statut, true, _description_fr, _description_en, _photo_url,
    COALESCE(_badge_type, 'FREE'), _free_until,
    COALESCE(_is_featured, false), COALESCE(_is_lifetime_featured, false),
    COALESCE(_priority_score, 0), _import_batch
  ) RETURNING id INTO new_id;

  -- Insert contacts into separate table
  INSERT INTO public.prestataire_contacts (prestataire_id, telephone, whatsapp, email, instagram, site_web)
  VALUES (new_id, _telephone, _whatsapp, _email, _instagram, _site_web);

  IF _badge_type IN ('FOUNDER', 'VIP') THEN
    UPDATE public.prestataires SET is_lifetime_featured = true WHERE id = new_id;
  END IF;

  UPDATE public.prestataires
  SET score_ranking = public.calculate_ranking_score(new_id)
  WHERE id = new_id;

  RETURN new_id;
END;
$$;

-- Step 8: Update admin_update_prestataire to route contacts to new table
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

  -- Upsert contacts in separate table
  INSERT INTO public.prestataire_contacts (prestataire_id)
  VALUES (_prestataire_id)
  ON CONFLICT (prestataire_id) DO NOTHING;

  UPDATE public.prestataire_contacts
  SET
    email = CASE WHEN _updates ? 'email' THEN _updates->>'email' ELSE email END,
    telephone = CASE WHEN _updates ? 'telephone' THEN _updates->>'telephone' ELSE telephone END,
    instagram = CASE WHEN _updates ? 'instagram' THEN _updates->>'instagram' ELSE instagram END,
    whatsapp = CASE WHEN _updates ? 'whatsapp' THEN _updates->>'whatsapp' ELSE whatsapp END,
    site_web = CASE WHEN _updates ? 'site_web' THEN _updates->>'site_web' ELSE site_web END
  WHERE prestataire_id = _prestataire_id;

  UPDATE public.prestataires
  SET score_ranking = public.calculate_ranking_score(_prestataire_id)
  WHERE id = _prestataire_id;
END;
$$;

-- Step 9: Also create trigger for new prestataires to auto-create contacts row
CREATE OR REPLACE FUNCTION public.handle_new_prestataire()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.abonnements (prestataire_id, type, prix, actif)
  VALUES (NEW.id, 'gratuit', 0, true);
  
  -- Auto-create contacts row
  INSERT INTO public.prestataire_contacts (prestataire_id)
  VALUES (NEW.id)
  ON CONFLICT (prestataire_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Step 10: Drop contact columns from prestataires
ALTER TABLE public.prestataires
  DROP COLUMN IF EXISTS telephone,
  DROP COLUMN IF EXISTS whatsapp,
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS instagram,
  DROP COLUMN IF EXISTS site_web;

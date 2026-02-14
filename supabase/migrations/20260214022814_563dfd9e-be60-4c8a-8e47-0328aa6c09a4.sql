
-- Pages table for CMS content management
CREATE TABLE IF NOT EXISTS public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text,
  hero_image_url text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pages are publicly readable" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Admins can manage pages" ON public.pages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Admin action logs
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action text NOT NULL,
  target_table text,
  target_id text,
  details jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view logs" ON public.admin_logs FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert logs" ON public.admin_logs FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to manage countries (currently only SELECT exists)
CREATE POLICY "Admins can manage countries" ON public.countries FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RPC for admin to import prestataires (bypasses user_id constraint)
CREATE OR REPLACE FUNCTION public.admin_import_prestataire(
  _nom_entreprise text,
  _ville text DEFAULT NULL,
  _pays text DEFAULT 'France',
  _description text DEFAULT NULL,
  _telephone text DEFAULT NULL,
  _categorie_id uuid DEFAULT NULL,
  _statut prestataire_statut DEFAULT 'en_attente'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_id uuid;
  new_slug text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  new_slug := lower(regexp_replace(_nom_entreprise, '[^a-zA-Z0-9]+', '-', 'g'));
  new_slug := new_slug || '-' || substr(gen_random_uuid()::text, 1, 8);

  INSERT INTO public.prestataires (user_id, nom_entreprise, slug, ville, pays, description, telephone, categorie_id, statut, verified)
  VALUES (auth.uid(), _nom_entreprise, new_slug, _ville, _pays, _description, _telephone, _categorie_id, _statut, true)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

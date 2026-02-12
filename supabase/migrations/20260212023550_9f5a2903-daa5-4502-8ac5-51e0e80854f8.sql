
-- =============================================
-- MariageAfro Database Schema
-- =============================================

-- 1. ENUM TYPES
CREATE TYPE public.app_role AS ENUM ('admin', 'client', 'prestataire');
CREATE TYPE public.subscription_type AS ENUM ('gratuit', 'pro', 'premium', 'elite');
CREATE TYPE public.prestataire_statut AS ENUM ('actif', 'suspendu', 'en_attente');
CREATE TYPE public.media_type AS ENUM ('photo', 'video');

-- 2. USER ROLES TABLE (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 5. PRESTATAIRES
CREATE TABLE public.prestataires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nom_entreprise TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  ville TEXT,
  pays TEXT DEFAULT 'France',
  origine_culturelle TEXT,
  langues TEXT[] DEFAULT '{"Français"}',
  categorie_id UUID REFERENCES public.categories(id),
  sous_categorie TEXT,
  description TEXT,
  telephone TEXT,
  whatsapp TEXT,
  site_web TEXT,
  instagram TEXT,
  statut prestataire_statut NOT NULL DEFAULT 'en_attente',
  verified BOOLEAN NOT NULL DEFAULT false,
  score_ranking NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.prestataires ENABLE ROW LEVEL SECURITY;

-- 6. ABONNEMENTS (Subscriptions)
CREATE TABLE public.abonnements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestataire_id UUID NOT NULL REFERENCES public.prestataires(id) ON DELETE CASCADE,
  type subscription_type NOT NULL DEFAULT 'gratuit',
  prix NUMERIC DEFAULT 0,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  date_debut TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_fin TIMESTAMPTZ,
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.abonnements ENABLE ROW LEVEL SECURITY;

-- 7. MEDIAS
CREATE TABLE public.medias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestataire_id UUID NOT NULL REFERENCES public.prestataires(id) ON DELETE CASCADE,
  type media_type NOT NULL DEFAULT 'photo',
  url TEXT NOT NULL,
  titre TEXT,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.medias ENABLE ROW LEVEL SECURITY;

-- 8. AVIS (Reviews)
CREATE TABLE public.avis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestataire_id UUID NOT NULL REFERENCES public.prestataires(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note INTEGER NOT NULL CHECK (note >= 1 AND note <= 5),
  commentaire TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS (SECURITY DEFINER)
-- =============================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Get prestataire_id for current user
CREATE OR REPLACE FUNCTION public.get_prestataire_id_for_user(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.prestataires WHERE user_id = _user_id LIMIT 1
$$;

-- Check if user owns a prestataire record
CREATE OR REPLACE FUNCTION public.owns_prestataire(_prestataire_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.prestataires WHERE id = _prestataire_id AND user_id = _user_id
  )
$$;

-- Get subscription type for a prestataire
CREATE OR REPLACE FUNCTION public.get_subscription_type(_prestataire_id UUID)
RETURNS subscription_type
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT type FROM public.abonnements
  WHERE prestataire_id = _prestataire_id AND actif = true
  ORDER BY created_at DESC LIMIT 1
$$;

-- Check media upload limit
CREATE OR REPLACE FUNCTION public.can_upload_media(_prestataire_id UUID, _media_type media_type)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sub_type subscription_type;
  current_count INTEGER;
  max_allowed INTEGER;
BEGIN
  sub_type := public.get_subscription_type(_prestataire_id);
  IF sub_type IS NULL THEN sub_type := 'gratuit'; END IF;

  SELECT COUNT(*) INTO current_count
  FROM public.medias
  WHERE prestataire_id = _prestataire_id AND type = _media_type;

  IF _media_type = 'photo' THEN
    CASE sub_type
      WHEN 'gratuit' THEN max_allowed := 1;
      WHEN 'pro' THEN max_allowed := 10;
      WHEN 'premium' THEN max_allowed := 30;
      WHEN 'elite' THEN max_allowed := 9999;
    END CASE;
  ELSIF _media_type = 'video' THEN
    CASE sub_type
      WHEN 'gratuit' THEN max_allowed := 0;
      WHEN 'pro' THEN max_allowed := 2;
      WHEN 'premium' THEN max_allowed := 5;
      WHEN 'elite' THEN max_allowed := 9999;
    END CASE;
  END IF;

  RETURN current_count < max_allowed;
END;
$$;

-- Ranking score calculation
CREATE OR REPLACE FUNCTION public.calculate_ranking_score(_prestataire_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sub_score NUMERIC := 0;
  avg_note NUMERIC := 0;
  activity_score NUMERIC := 0;
  seniority_score NUMERIC := 0;
  sub_type subscription_type;
  media_count INTEGER;
  days_since_creation INTEGER;
BEGIN
  -- Subscription score (x3)
  sub_type := public.get_subscription_type(_prestataire_id);
  CASE sub_type
    WHEN 'gratuit' THEN sub_score := 1;
    WHEN 'pro' THEN sub_score := 2;
    WHEN 'premium' THEN sub_score := 3;
    WHEN 'elite' THEN sub_score := 4;
    ELSE sub_score := 1;
  END CASE;

  -- Average rating (x2)
  SELECT COALESCE(AVG(note), 0) INTO avg_note
  FROM public.avis WHERE prestataire_id = _prestataire_id AND approved = true;

  -- Activity score (x1) - based on media count
  SELECT COUNT(*) INTO media_count
  FROM public.medias WHERE prestataire_id = _prestataire_id;
  activity_score := LEAST(media_count::NUMERIC / 10.0, 5.0);

  -- Seniority (x1) - months on platform, capped at 5
  SELECT EXTRACT(DAY FROM (now() - created_at))::INTEGER INTO days_since_creation
  FROM public.prestataires WHERE id = _prestataire_id;
  seniority_score := LEAST((COALESCE(days_since_creation, 0)::NUMERIC / 30.0), 5.0);

  RETURN (sub_score * 3) + (avg_note * 2) + (activity_score * 1) + (seniority_score * 1);
END;
$$;

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  -- Default role: client
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_prestataires_updated_at BEFORE UPDATE ON public.prestataires FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_abonnements_updated_at BEFORE UPDATE ON public.abonnements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_avis_updated_at BEFORE UPDATE ON public.avis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-update ranking score when avis or media changes
CREATE OR REPLACE FUNCTION public.update_prestataire_ranking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.prestataires
  SET score_ranking = public.calculate_ranking_score(COALESCE(NEW.prestataire_id, OLD.prestataire_id))
  WHERE id = COALESCE(NEW.prestataire_id, OLD.prestataire_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_ranking_on_avis AFTER INSERT OR UPDATE OR DELETE ON public.avis FOR EACH ROW EXECUTE FUNCTION public.update_prestataire_ranking();
CREATE TRIGGER update_ranking_on_media AFTER INSERT OR DELETE ON public.medias FOR EACH ROW EXECUTE FUNCTION public.update_prestataire_ranking();

-- Auto-create free subscription for new prestataire
CREATE OR REPLACE FUNCTION public.handle_new_prestataire()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.abonnements (prestataire_id, type, prix, actif)
  VALUES (NEW.id, 'gratuit', 0, true);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_prestataire_created
  AFTER INSERT ON public.prestataires
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_prestataire();

-- =============================================
-- RLS POLICIES
-- =============================================

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- USER ROLES
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- CATEGORIES
CREATE POLICY "Categories are public" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- PRESTATAIRES
CREATE POLICY "Active prestataires are public" ON public.prestataires FOR SELECT USING (statut = 'actif' OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can create prestataire" ON public.prestataires FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update prestataire" ON public.prestataires FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete prestataires" ON public.prestataires FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- ABONNEMENTS
CREATE POLICY "Owners can view own subscription" ON public.abonnements FOR SELECT USING (public.owns_prestataire(prestataire_id, auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert subscriptions" ON public.abonnements FOR INSERT WITH CHECK (public.owns_prestataire(prestataire_id, auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can update subscriptions" ON public.abonnements FOR UPDATE USING (public.owns_prestataire(prestataire_id, auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete subscriptions" ON public.abonnements FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- MEDIAS
CREATE POLICY "Medias of active prestataires are public" ON public.medias FOR SELECT USING (true);
CREATE POLICY "Owners can insert media" ON public.medias FOR INSERT WITH CHECK (public.owns_prestataire(prestataire_id, auth.uid()) AND public.can_upload_media(prestataire_id, type));
CREATE POLICY "Owners can update media" ON public.medias FOR UPDATE USING (public.owns_prestataire(prestataire_id, auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners can delete media" ON public.medias FOR DELETE USING (public.owns_prestataire(prestataire_id, auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- AVIS
CREATE POLICY "Approved reviews are public" ON public.avis FOR SELECT USING (approved = true OR auth.uid() = client_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can create reviews" ON public.avis FOR INSERT WITH CHECK (auth.uid() = client_id AND public.has_role(auth.uid(), 'client'));
CREATE POLICY "Clients can update own reviews" ON public.avis FOR UPDATE USING (auth.uid() = client_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete reviews" ON public.avis FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_prestataires_ville ON public.prestataires(ville);
CREATE INDEX idx_prestataires_pays ON public.prestataires(pays);
CREATE INDEX idx_prestataires_categorie ON public.prestataires(categorie_id);
CREATE INDEX idx_prestataires_origine ON public.prestataires(origine_culturelle);
CREATE INDEX idx_prestataires_statut ON public.prestataires(statut);
CREATE INDEX idx_prestataires_ranking ON public.prestataires(score_ranking DESC);
CREATE INDEX idx_prestataires_slug ON public.prestataires(slug);
CREATE INDEX idx_medias_prestataire ON public.medias(prestataire_id);
CREATE INDEX idx_avis_prestataire ON public.avis(prestataire_id);
CREATE INDEX idx_abonnements_prestataire ON public.abonnements(prestataire_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);

-- =============================================
-- SEED CATEGORIES
-- =============================================
INSERT INTO public.categories (name, slug, icon) VALUES
  ('DJ & Musique', 'dj-musique', 'Music'),
  ('Traiteur', 'traiteur', 'UtensilsCrossed'),
  ('Photographe', 'photographe', 'Camera'),
  ('Vidéaste', 'videaste', 'Video'),
  ('Décoration', 'decoration', 'Palette'),
  ('Wedding Planner', 'wedding-planner', 'CalendarHeart'),
  ('Tenues & Couture', 'tenues-couture', 'Shirt'),
  ('Coiffure & Beauté', 'coiffure-beaute', 'Sparkles'),
  ('Salle & Lieu', 'salle-lieu', 'Building'),
  ('Faire-part & Papeterie', 'faire-part', 'Mail'),
  ('Animation', 'animation', 'PartyPopper'),
  ('Transport', 'transport', 'Car');

-- =============================================
-- STORAGE BUCKET
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

CREATE POLICY "Anyone can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Authenticated users can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own media" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

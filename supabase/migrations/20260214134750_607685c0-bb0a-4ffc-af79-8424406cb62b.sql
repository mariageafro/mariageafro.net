
-- =============================================
-- PHASE 1: Wedding Planner Foundations
-- =============================================

-- 1. Couple Profile
CREATE TABLE public.user_wedding_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  wedding_date date,
  city text,
  country text DEFAULT 'France',
  partner_one_first_name text NOT NULL,
  partner_two_first_name text NOT NULL,
  partner_one_last_name text,
  partner_two_last_name text,
  couple_display_name text GENERATED ALWAYS AS (
    CASE 
      WHEN partner_one_last_name IS NOT NULL AND partner_two_last_name IS NOT NULL 
        THEN partner_one_first_name || ' ' || partner_one_last_name || ' & ' || partner_two_first_name || ' ' || partner_two_last_name
      ELSE partner_one_first_name || ' & ' || partner_two_first_name
    END
  ) STORED,
  couple_quote text,
  origin_partner_one text,
  origin_partner_two text,
  wedding_type text DEFAULT 'mixed' CHECK (wedding_type IN ('civil', 'religious', 'traditional', 'mixed')),
  guest_count integer DEFAULT 100,
  estimated_budget numeric DEFAULT 0,
  wedding_style text DEFAULT 'mix' CHECK (wedding_style IN ('traditional', 'modern', 'luxury', 'mix')),
  is_afro_wedding boolean DEFAULT true,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_wedding_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wedding profile"
  ON public.user_wedding_profile FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wedding profile"
  ON public.user_wedding_profile FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wedding profile"
  ON public.user_wedding_profile FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wedding profile"
  ON public.user_wedding_profile FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_wedding_profile_updated_at
  BEFORE UPDATE ON public.user_wedding_profile
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 2. Planning Tasks (smart timeline)
CREATE TABLE public.planning_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text DEFAULT 'general',
  due_date date,
  done boolean DEFAULT false,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  auto_generated boolean DEFAULT false,
  linked_vendor_id uuid,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.planning_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own planning tasks"
  ON public.planning_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own planning tasks"
  ON public.planning_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own planning tasks"
  ON public.planning_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own planning tasks"
  ON public.planning_tasks FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_planning_tasks_updated_at
  BEFORE UPDATE ON public.planning_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 3. Day-of Timeline
CREATE TABLE public.day_of_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Jour J',
  event_date date,
  share_code text UNIQUE DEFAULT substr(gen_random_uuid()::text, 1, 8),
  is_public boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.day_of_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own day-of timeline"
  ON public.day_of_timeline FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can insert own day-of timeline"
  ON public.day_of_timeline FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own day-of timeline"
  ON public.day_of_timeline FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own day-of timeline"
  ON public.day_of_timeline FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_day_of_timeline_updated_at
  BEFORE UPDATE ON public.day_of_timeline
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 4. Day-of Timeline Items
CREATE TABLE public.day_of_timeline_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timeline_id uuid NOT NULL REFERENCES public.day_of_timeline(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  title text NOT NULL,
  start_time time NOT NULL,
  end_time time,
  address text,
  google_maps_link text,
  responsible_person text,
  notes text,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.day_of_timeline_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own timeline items"
  ON public.day_of_timeline_items FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.day_of_timeline t WHERE t.id = timeline_id AND t.is_public = true
  ));
CREATE POLICY "Users can insert own timeline items"
  ON public.day_of_timeline_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own timeline items"
  ON public.day_of_timeline_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own timeline items"
  ON public.day_of_timeline_items FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_planning_tasks_user_id ON public.planning_tasks(user_id);
CREATE INDEX idx_planning_tasks_due_date ON public.planning_tasks(user_id, due_date);
CREATE INDEX idx_day_of_timeline_user_id ON public.day_of_timeline(user_id);
CREATE INDEX idx_day_of_timeline_share_code ON public.day_of_timeline(share_code);
CREATE INDEX idx_day_of_timeline_items_timeline ON public.day_of_timeline_items(timeline_id);

-- Function to auto-generate planning tasks based on wedding profile
CREATE OR REPLACE FUNCTION public.generate_planning_tasks(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile record;
  months_until integer;
  task_templates jsonb;
BEGIN
  SELECT * INTO profile FROM public.user_wedding_profile WHERE user_id = _user_id;
  IF NOT FOUND THEN RETURN; END IF;
  
  -- Delete old auto-generated tasks
  DELETE FROM public.planning_tasks WHERE user_id = _user_id AND auto_generated = true AND done = false;
  
  months_until := GREATEST(0, EXTRACT(MONTH FROM AGE(profile.wedding_date, CURRENT_DATE))::integer 
    + EXTRACT(YEAR FROM AGE(profile.wedding_date, CURRENT_DATE))::integer * 12);

  -- Core tasks always generated
  task_templates := '[
    {"title": "Définir le budget global", "category": "budget", "months_before": 12, "priority": "high"},
    {"title": "Choisir la date du mariage", "category": "general", "months_before": 12, "priority": "urgent"},
    {"title": "Réserver la salle de réception", "category": "lieu", "months_before": 10, "priority": "urgent"},
    {"title": "Choisir le traiteur", "category": "traiteur", "months_before": 8, "priority": "high"},
    {"title": "Réserver le photographe", "category": "photo", "months_before": 8, "priority": "high"},
    {"title": "Réserver le DJ / musiciens", "category": "musique", "months_before": 7, "priority": "medium"},
    {"title": "Commander les faire-part", "category": "papeterie", "months_before": 6, "priority": "medium"},
    {"title": "Choisir la robe / le costume", "category": "tenues", "months_before": 6, "priority": "high"},
    {"title": "Réserver le fleuriste", "category": "decoration", "months_before": 5, "priority": "medium"},
    {"title": "Envoyer les faire-part", "category": "papeterie", "months_before": 4, "priority": "high"},
    {"title": "Organiser les essayages", "category": "tenues", "months_before": 3, "priority": "medium"},
    {"title": "Finaliser le plan de table", "category": "organisation", "months_before": 2, "priority": "high"},
    {"title": "Confirmer tous les prestataires", "category": "general", "months_before": 1, "priority": "urgent"},
    {"title": "Préparer le planning Jour J", "category": "organisation", "months_before": 1, "priority": "high"},
    {"title": "Derniers essayages", "category": "tenues", "months_before": 1, "priority": "medium"},
    {"title": "Relancer les RSVP manquants", "category": "invites", "months_before": 1, "priority": "high"}
  ]'::jsonb;

  -- Add cultural tasks if afro wedding
  IF profile.is_afro_wedding THEN
    task_templates := task_templates || '[
      {"title": "Organiser la cérémonie traditionnelle (dot)", "category": "tradition", "months_before": 6, "priority": "high"},
      {"title": "Choisir les tenues traditionnelles", "category": "tenues", "months_before": 5, "priority": "high"},
      {"title": "Réserver le groupe musical traditionnel", "category": "musique", "months_before": 5, "priority": "medium"},
      {"title": "Commander les tissus / pagnes", "category": "tradition", "months_before": 4, "priority": "medium"}
    ]'::jsonb;
  END IF;

  -- Religious tasks
  IF profile.wedding_type IN ('religious', 'mixed') THEN
    task_templates := task_templates || '[
      {"title": "Contacter le lieu de culte", "category": "ceremonie", "months_before": 10, "priority": "high"},
      {"title": "Préparer le dossier de mariage religieux", "category": "ceremonie", "months_before": 8, "priority": "medium"},
      {"title": "Organiser la préparation au mariage", "category": "ceremonie", "months_before": 6, "priority": "medium"}
    ]'::jsonb;
  END IF;

  -- Insert tasks
  INSERT INTO public.planning_tasks (user_id, title, category, due_date, priority, auto_generated, sort_order)
  SELECT
    _user_id,
    elem->>'title',
    elem->>'category',
    CASE 
      WHEN profile.wedding_date IS NOT NULL 
        THEN (profile.wedding_date - ((elem->>'months_before')::integer * INTERVAL '1 month'))::date
      ELSE NULL
    END,
    CASE 
      WHEN months_until <= 6 AND (elem->>'priority') = 'medium' THEN 'high'
      WHEN months_until <= 3 THEN 'urgent'
      ELSE elem->>'priority'
    END,
    true,
    (elem->>'months_before')::integer
  FROM jsonb_array_elements(task_templates) AS elem;
END;
$$;

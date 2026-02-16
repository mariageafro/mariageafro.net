
-- Add menu_choice to rsvp_guests for meal selection
ALTER TABLE public.rsvp_guests ADD COLUMN IF NOT EXISTS menu_choice text;

-- Add wedding site fields to user_wedding_profile
ALTER TABLE public.user_wedding_profile ADD COLUMN IF NOT EXISTS site_share_code text UNIQUE;
ALTER TABLE public.user_wedding_profile ADD COLUMN IF NOT EXISTS site_hero_image_url text;
ALTER TABLE public.user_wedding_profile ADD COLUMN IF NOT EXISTS site_theme text DEFAULT 'classic';
ALTER TABLE public.user_wedding_profile ADD COLUMN IF NOT EXISTS site_welcome_text text;

-- Auto-generate share code for new profiles
CREATE OR REPLACE FUNCTION public.generate_site_share_code()
RETURNS trigger AS $$
BEGIN
  IF NEW.site_share_code IS NULL THEN
    NEW.site_share_code := substr(md5(random()::text || clock_timestamp()::text), 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_site_share_code
  BEFORE INSERT ON public.user_wedding_profile
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_site_share_code();

-- Generate codes for existing profiles that don't have one
UPDATE public.user_wedding_profile
SET site_share_code = substr(md5(random()::text || clock_timestamp()::text), 1, 8)
WHERE site_share_code IS NULL;

-- Allow public read access for wedding sites via share_code
CREATE POLICY "Public can view wedding site by share_code"
  ON public.user_wedding_profile
  FOR SELECT
  USING (site_share_code IS NOT NULL);

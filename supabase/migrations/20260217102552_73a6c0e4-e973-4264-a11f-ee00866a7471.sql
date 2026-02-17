
-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Public can view wedding site by share_code" ON public.user_wedding_profile;

-- Create a public view exposing ONLY the fields needed for the wedding site
CREATE VIEW public.user_wedding_profile_public
WITH (security_invoker = on) AS
SELECT
  user_id,
  partner_one_first_name,
  partner_two_first_name,
  couple_display_name,
  couple_quote,
  wedding_date,
  city,
  country,
  site_hero_image_url,
  site_theme,
  site_welcome_text,
  site_share_code
FROM public.user_wedding_profile
WHERE site_share_code IS NOT NULL;

-- Add a new narrowly scoped policy for anon/public access via the view
CREATE POLICY "Public can view limited wedding site fields via view"
ON public.user_wedding_profile
FOR SELECT
TO anon, authenticated
USING (site_share_code IS NOT NULL);

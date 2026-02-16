
-- Add new customization columns to wedding profile
ALTER TABLE public.user_wedding_profile 
ADD COLUMN IF NOT EXISTS site_accent_color text DEFAULT null,
ADD COLUMN IF NOT EXISTS site_font_style text DEFAULT null,
ADD COLUMN IF NOT EXISTS site_sections_config jsonb DEFAULT '{"countdown": true, "program": true, "dresscode": false, "rsvp_qr": true, "photo_album": true}'::jsonb;

-- Create storage bucket for wedding site images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('wedding-sites', 'wedding-sites', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own images
CREATE POLICY "Users can upload wedding site images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'wedding-sites' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update wedding site images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'wedding-sites' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete wedding site images"
ON storage.objects FOR DELETE
USING (bucket_id = 'wedding-sites' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access for wedding site images
CREATE POLICY "Wedding site images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'wedding-sites');

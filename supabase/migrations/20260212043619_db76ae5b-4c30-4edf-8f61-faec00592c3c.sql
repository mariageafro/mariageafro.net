
-- Add geolocation fields to prestataires
ALTER TABLE public.prestataires
ADD COLUMN IF NOT EXISTS lat double precision,
ADD COLUMN IF NOT EXISTS lng double precision;

-- Add caribbean fields to prestataires
ALTER TABLE public.prestataires
ADD COLUMN IF NOT EXISTS caribbean_styles text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS caribbean_origins text[] DEFAULT '{}';

-- Add indexes for geolocation and location filtering
CREATE INDEX IF NOT EXISTS idx_prestataires_country_city ON public.prestataires (country_id, ville);
CREATE INDEX IF NOT EXISTS idx_prestataires_lat_lng ON public.prestataires (lat, lng);

-- Insert Caraïbes as a top-level category
INSERT INTO public.categories (name, slug, icon) 
VALUES ('Caraïbes', 'caraibes', '🌴')
ON CONFLICT DO NOTHING;

-- Insert Caraïbes subcategories
INSERT INTO public.sub_categories (category_id, name, slug, description)
SELECT c.id, sub.name, sub.slug, sub.description
FROM public.categories c
CROSS JOIN (VALUES
  ('DJ Caraïbes', 'dj-caraibes', 'Zouk, Kompa, Bouyon, Dancehall, Soca'),
  ('MC / Animateur Caraïbes', 'mc-caraibes', 'Animation de mariages caribéens'),
  ('Groupes live Caraïbes', 'groupes-live-caraibes', 'Groupes musicaux caribéens'),
  ('Traiteur Caribéen', 'traiteur-caribeen', 'Cuisine caribéenne pour mariages'),
  ('Décoration Caraïbes', 'deco-caraibes', 'Décoration d''inspiration caribéenne'),
  ('Tenues traditionnelles Caraïbes', 'tenues-caraibes', 'Tenues traditionnelles caribéennes')
) AS sub(name, slug, description)
WHERE c.slug = 'caraibes'
ON CONFLICT DO NOTHING;

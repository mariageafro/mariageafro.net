-- Create countries table
CREATE TABLE public.countries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  flag_emoji TEXT,
  priority INTEGER DEFAULT 999,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sub_categories table (many-to-one with categories)
CREATE TABLE public.sub_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category_id, slug)
);

-- Add country_id to prestataires (allow NULL for now, populate gradually)
ALTER TABLE public.prestataires 
ADD COLUMN country_id UUID REFERENCES public.countries(id) ON DELETE SET NULL;

-- Create index for country filtering
CREATE INDEX idx_prestataires_country_id ON public.prestataires(country_id);

-- Enable RLS on new tables
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Countries are publicly readable
CREATE POLICY "Countries are publicly readable"
ON public.countries
FOR SELECT
USING (true);

-- RLS Policy: Sub-categories are publicly readable
CREATE POLICY "Sub-categories are publicly readable"
ON public.sub_categories
FOR SELECT
USING (true);

-- Insert priority countries (Congo, Cameroon, Ivory Coast, Senegal, Nigeria, Others)
INSERT INTO public.countries (name, code, flag_emoji, priority) VALUES
('Congo', 'CD', '🇨🇩', 1),
('Cameroon', 'CM', '🇨🇲', 2),
('Ivory Coast', 'CI', '🇨🇮', 3),
('Senegal', 'SN', '🇸🇳', 4),
('Nigeria', 'NG', '🇳🇬', 5),
('Angola', 'AO', '🇦🇴', 6),
('Ghana', 'GH', '🇬🇭', 7),
('Maghreb (Morocco, Algeria, Tunisia)', 'MA', '🌍', 8),
('East Africa (Kenya, Uganda, Tanzania)', 'KE', '🌍', 9),
('Other', 'OTHER', '🌍', 10)
ON CONFLICT DO NOTHING;
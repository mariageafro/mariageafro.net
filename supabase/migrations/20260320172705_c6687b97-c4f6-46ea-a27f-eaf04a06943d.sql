
-- Add zone_disponibilite column to prestataires table
ALTER TABLE public.prestataires
ADD COLUMN zone_disponibilite text DEFAULT NULL;

-- Add a comment for clarity
COMMENT ON COLUMN public.prestataires.zone_disponibilite IS 'Where the vendor is willing to travel/work: france, belgique, france_belgique, europe, international';

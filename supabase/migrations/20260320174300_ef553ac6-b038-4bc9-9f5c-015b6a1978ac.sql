-- Add vendor_metadata JSONB column for profession-specific data
ALTER TABLE public.prestataires
ADD COLUMN vendor_metadata jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.prestataires.vendor_metadata IS 'Flexible profession-specific metadata (styles, equipment, capacities, etc.)';

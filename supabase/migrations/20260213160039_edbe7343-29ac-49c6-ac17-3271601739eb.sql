-- Fix medias policy: only show media for active prestataires
DROP POLICY IF EXISTS "Medias of active prestataires are public" ON public.medias;

CREATE POLICY "Medias of active prestataires are public"
ON public.medias
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.prestataires
    WHERE prestataires.id = medias.prestataire_id
    AND prestataires.statut = 'actif'
  )
);

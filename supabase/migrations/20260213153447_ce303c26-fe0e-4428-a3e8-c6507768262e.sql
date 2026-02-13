
-- Admin-only function to update prestataire status/verified
CREATE OR REPLACE FUNCTION public.admin_update_prestataire(
  _prestataire_id UUID,
  _updates JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  UPDATE public.prestataires
  SET 
    statut = COALESCE((_updates->>'statut')::prestataire_statut, statut),
    verified = COALESCE((_updates->>'verified')::BOOLEAN, verified),
    updated_at = now()
  WHERE id = _prestataire_id;
END;
$$;

-- Admin-only function to approve/reject reviews
CREATE OR REPLACE FUNCTION public.admin_approve_review(
  _review_id UUID,
  _approved BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  UPDATE public.avis
  SET approved = _approved, updated_at = now()
  WHERE id = _review_id;
END;
$$;

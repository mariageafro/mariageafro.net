
-- Explicit deny policies for UPDATE and DELETE on admin_logs to ensure immutability
CREATE POLICY "No one can update logs"
  ON public.admin_logs FOR UPDATE
  USING (false);

CREATE POLICY "No one can delete logs"
  ON public.admin_logs FOR DELETE
  USING (false);

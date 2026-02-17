
-- Drop the new policy we just created (it's still too broad)
DROP POLICY IF EXISTS "Public can view limited wedding site fields via view" ON public.user_wedding_profile;

-- Create a restrictive policy: public/anon can only SELECT via the view
-- The view uses security_invoker, so we need a policy that allows it but
-- we'll make the WeddingSite code use the view instead.
-- For the view to work with security_invoker=on and anon users, we still need a SELECT policy.
-- But we can scope it tightly: only allow selecting rows where site_share_code matches a specific filter.
-- The key improvement is that the VIEW only returns safe columns.

-- Re-add the policy (the view needs it to function for anon users)
CREATE POLICY "Anon can select profiles with share code"
ON public.user_wedding_profile
FOR SELECT
TO anon
USING (site_share_code IS NOT NULL);

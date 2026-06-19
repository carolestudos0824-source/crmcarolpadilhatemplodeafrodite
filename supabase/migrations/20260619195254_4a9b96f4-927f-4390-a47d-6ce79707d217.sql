
-- Harden gift_codes: replace broad ALL policy with SELECT-only for admins.
-- Mutations must go through SECURITY DEFINER RPCs (admin_create_gift_code,
-- admin_set_gift_code_active) which bypass RLS as definer and audit the action.
-- Public redemption keeps working via redeem_gift_code (SECURITY DEFINER, also bypasses RLS).

DROP POLICY IF EXISTS "Admins can manage gift codes" ON public.gift_codes;

CREATE POLICY "Admins can view gift codes"
ON public.gift_codes
FOR SELECT
TO authenticated
USING (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role));

-- No INSERT / UPDATE / DELETE policies for gift_codes from the Data API.
-- This means: direct supabase.from('gift_codes').insert/update/delete from the
-- frontend will be denied by RLS. All mutations must use the audited RPCs.

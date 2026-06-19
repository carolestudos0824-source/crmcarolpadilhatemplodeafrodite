
-- Align admin gate for gift_codes & gift_redemptions with the rest of the admin panel.
-- The /admin/acessos page and admin RPCs use public.is_admin() (admin_users table),
-- but these tables were checking only public.has_role(auth.uid(),'admin') (user_roles).
-- We accept BOTH so existing user_roles admins keep working AND admin_users admins are unblocked.

DROP POLICY IF EXISTS "Admins can manage gift codes" ON public.gift_codes;
CREATE POLICY "Admins can manage gift codes"
ON public.gift_codes
FOR ALL
TO authenticated
USING (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can view all redemptions" ON public.gift_redemptions;
CREATE POLICY "Admins can view all redemptions"
ON public.gift_redemptions
FOR SELECT
TO authenticated
USING (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role));

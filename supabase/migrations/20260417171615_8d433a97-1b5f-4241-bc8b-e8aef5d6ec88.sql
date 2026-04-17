-- Allow moderators to read the admin audit log (read-only).
-- INSERT remains restricted to admins, so moderators can observe but not mutate.
DROP POLICY IF EXISTS "Admins can view audit log" ON public.admin_audit_log;

CREATE POLICY "Staff can view audit log"
  ON public.admin_audit_log
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR public.has_role(auth.uid(), 'moderator'::public.app_role)
  );
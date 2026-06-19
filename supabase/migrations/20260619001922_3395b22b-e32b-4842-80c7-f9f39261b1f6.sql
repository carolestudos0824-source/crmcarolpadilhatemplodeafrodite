
-- Lock down EXECUTE privileges on SECURITY DEFINER functions
-- All functions already have SET search_path = 'public' (verified).

-- Admin-only RPCs: only authenticated callers; internal is_admin() check enforces admin
REVOKE ALL ON FUNCTION public.admin_set_access(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_access(uuid, boolean) TO authenticated;

REVOKE ALL ON FUNCTION public.admin_lookup_user(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_lookup_user(text) TO authenticated;

-- Gift code redemption: authenticated only; uses auth.uid() internally
REVOKE ALL ON FUNCTION public.redeem_gift_code(text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_gift_code(text, uuid) TO authenticated;

-- Role checks: authenticated + service_role (used by RLS via SECURITY DEFINER)
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, service_role;

-- Admin-only editorial backfill (service_role + admin)
REVOKE ALL ON FUNCTION public.apply_arcano_backfill(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.apply_arcano_backfill(jsonb) TO authenticated, service_role;

-- Trigger / utility functions (invoked by triggers, not by clients)
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.enforce_arcano_publish_threshold() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.enforce_arcano_editorial_status() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.enforce_quiz_publish_threshold() FROM PUBLIC, anon;

-- Lock down SECURITY DEFINER functions from anonymous execution
REVOKE EXECUTE ON FUNCTION public.apply_arcano_backfill(jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.redeem_gift_code(text, uuid) FROM PUBLIC, anon;
-- redeem_gift_code stays callable by authenticated users (it's the legitimate API)
GRANT EXECUTE ON FUNCTION public.redeem_gift_code(text, uuid) TO authenticated;
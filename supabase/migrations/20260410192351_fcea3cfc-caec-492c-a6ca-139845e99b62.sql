
-- 1. FIX PROFILES: restrict user self-update to safe fields only
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own safe fields"
ON public.profiles
FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND is_premium IS NOT DISTINCT FROM (SELECT p.is_premium FROM public.profiles p WHERE p.user_id = auth.uid())
  AND premium_until IS NOT DISTINCT FROM (SELECT p.premium_until FROM public.profiles p WHERE p.user_id = auth.uid())
  AND premium_source IS NOT DISTINCT FROM (SELECT p.premium_source FROM public.profiles p WHERE p.user_id = auth.uid())
);

-- 2. FIX GIFT_CODES: remove public read access
DROP POLICY IF EXISTS "Users can read active codes" ON public.gift_codes;

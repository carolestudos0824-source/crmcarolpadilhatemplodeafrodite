
-- 1) Fix search_path on handle_updated_at
ALTER FUNCTION public.handle_updated_at() SET search_path = public;

-- 2) Revoke EXECUTE on SECURITY DEFINER functions from anon/public; keep authenticated only where needed.
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.apply_arcano_backfill(jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.redeem_gift_code(text, uuid) FROM PUBLIC, anon;

-- redeem_gift_code is intentionally callable by signed-in users via RPC
GRANT EXECUTE ON FUNCTION public.redeem_gift_code(text, uuid) TO authenticated;

-- has_role used inside SQL/policies executes under definer rights regardless of EXECUTE grants;
-- leaving it without public/authenticated EXECUTE prevents enumeration via RPC.

-- 3) Logos bucket: scope uploads/updates/deletes to per-user folder and remove broad listing.
DROP POLICY IF EXISTS "Logos are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Only authenticated users can upload logos" ON storage.objects;

CREATE POLICY "Users upload logos to own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'logos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users update own logos"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'logos'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'logos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users delete own logos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'logos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Public files in the logos bucket remain reachable via their direct public URL
-- (Supabase serves public buckets without RLS for direct file fetches), but
-- listing/enumeration via the API now requires authentication and ownership.

-- 4) Waitlist: avoid USING/WITH CHECK (true) by requiring a non-empty email.
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
CREATE POLICY "Anyone can join waitlist"
ON public.waitlist FOR INSERT
TO anon, authenticated
WITH CHECK (email IS NOT NULL AND length(trim(email)) > 3);

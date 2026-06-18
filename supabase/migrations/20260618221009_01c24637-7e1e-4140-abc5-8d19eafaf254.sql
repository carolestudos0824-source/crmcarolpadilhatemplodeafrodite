
-- 1. admin_users table (locked: only service_role + is_admin() reads it)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.admin_users TO service_role;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
-- intentionally no policies for anon/authenticated; readable only via is_admin() (SECURITY DEFINER)

-- 2. is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 3. Ensure user_access.user_id is unique so we can upsert per buyer
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_access_user_id_unique'
  ) THEN
    ALTER TABLE public.user_access
      ADD CONSTRAINT user_access_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- 4. Admin policy on user_access (in addition to existing self-read policy)
DROP POLICY IF EXISTS "Admins (admin_users) manage access" ON public.user_access;
CREATE POLICY "Admins (admin_users) manage access"
ON public.user_access
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. RPC: lookup auth user + access by email
CREATE OR REPLACE FUNCTION public.admin_lookup_user(_email text)
RETURNS TABLE(
  user_id uuid,
  email text,
  has_access boolean,
  source text,
  access_created_at timestamptz,
  access_exists boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid;
  _uemail text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT u.id, u.email INTO _uid, _uemail
  FROM auth.users u
  WHERE lower(u.email) = lower(trim(_email))
  LIMIT 1;

  IF _uid IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT _uid,
         _uemail,
         ua.has_access,
         ua.source,
         ua.created_at,
         (ua.id IS NOT NULL)
  FROM (SELECT 1) s
  LEFT JOIN public.user_access ua ON ua.user_id = _uid;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_lookup_user(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_lookup_user(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_lookup_user(text) TO authenticated;

-- 6. RPC: grant / revoke / create-manual access
CREATE OR REPLACE FUNCTION public.admin_set_access(_user_id uuid, _has_access boolean)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _email text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT email INTO _email FROM auth.users WHERE id = _user_id;
  IF _email IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Usuário não encontrado no Auth');
  END IF;

  INSERT INTO public.user_access (user_id, email, has_access, source)
  VALUES (_user_id, _email, _has_access, 'manual')
  ON CONFLICT (user_id) DO UPDATE
    SET has_access = EXCLUDED.has_access,
        email = EXCLUDED.email;

  RETURN json_build_object('success', true, 'has_access', _has_access);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_set_access(uuid, boolean) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_set_access(uuid, boolean) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_set_access(uuid, boolean) TO authenticated;


CREATE OR REPLACE FUNCTION public.has_program_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT CASE
    WHEN _user_id IS NULL THEN false
    WHEN auth.role() = 'service_role'
      OR auth.uid() = _user_id
      OR COALESCE(public.is_admin(auth.uid()), false)
    THEN
      COALESCE(public.is_admin(_user_id), false)
      OR EXISTS (
        SELECT 1
        FROM public.user_access ua
        WHERE ua.user_id = _user_id
          AND ua.has_access = true
          AND (ua.access_expires_at IS NULL OR ua.access_expires_at > now())
      )
    ELSE false
  END;
$$;

REVOKE ALL ON FUNCTION public.has_program_access(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.has_program_access(uuid) TO authenticated, service_role;

COMMENT ON FUNCTION public.has_program_access(uuid) IS
  'Retorna acesso ao programa. Autorização do chamador: service_role, próprio usuário, ou admin. Regra do alvo: admin OU has_access=true com access_expires_at NULL/futuro.';

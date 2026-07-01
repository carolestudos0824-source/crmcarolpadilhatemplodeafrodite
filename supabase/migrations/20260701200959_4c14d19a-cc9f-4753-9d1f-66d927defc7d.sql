
-- 1) Nova coluna opcional de expiração (nullable = acesso perpétuo, preserva usuários existentes)
ALTER TABLE public.user_access
  ADD COLUMN IF NOT EXISTS access_expires_at timestamptz NULL;

COMMENT ON COLUMN public.user_access.access_expires_at IS
  'Data/hora de expiração do acesso. NULL = acesso sem expiração (perpétuo). Introduzido para suportar oferta de 1 ano.';

-- 2) RPC unificada de verificação de acesso ao programa
CREATE OR REPLACE FUNCTION public.has_program_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT
    COALESCE(public.is_admin(_user_id), false)
    OR EXISTS (
      SELECT 1
      FROM public.user_access ua
      WHERE ua.user_id = _user_id
        AND ua.has_access = true
        AND (ua.access_expires_at IS NULL OR ua.access_expires_at > now())
    );
$$;

REVOKE ALL ON FUNCTION public.has_program_access(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.has_program_access(uuid) TO authenticated, service_role;

COMMENT ON FUNCTION public.has_program_access(uuid) IS
  'Retorna true se o usuário é admin OU tem user_access.has_access = true com access_expires_at NULL ou futuro. Não altera comportamento atual do frontend (Rodada 1).';

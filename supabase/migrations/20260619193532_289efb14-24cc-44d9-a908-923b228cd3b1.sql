
CREATE OR REPLACE FUNCTION public.admin_list_buyers(_limit int DEFAULT 50)
RETURNS TABLE(
  user_id uuid,
  email text,
  display_name text,
  has_access boolean,
  source text,
  is_admin boolean,
  user_created_at timestamptz,
  access_created_at timestamptz
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  SELECT
    u.id AS user_id,
    u.email::text AS email,
    p.display_name,
    COALESCE(ua.has_access, false) AS has_access,
    ua.source,
    (au.user_id IS NOT NULL OR ur.user_id IS NOT NULL) AS is_admin,
    u.created_at AS user_created_at,
    ua.created_at AS access_created_at
  FROM auth.users u
  LEFT JOIN public.user_access ua ON ua.user_id = u.id
  LEFT JOIN public.profiles p ON p.user_id = u.id
  LEFT JOIN public.admin_users au ON au.user_id = u.id
  LEFT JOIN LATERAL (
    SELECT user_id FROM public.user_roles WHERE user_id = u.id AND role = 'admin'::app_role LIMIT 1
  ) ur ON true
  ORDER BY u.created_at DESC NULLS LAST
  LIMIT GREATEST(1, LEAST(COALESCE(_limit, 50), 200));
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_buyers(int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_buyers(int) TO authenticated, service_role;


-- Reuse existing public.admin_audit_log (id, admin_id, admin_email, action, target_type, target_id, target_label, details jsonb, created_at).
-- 1) Update admin_set_access to record an access-change entry.
CREATE OR REPLACE FUNCTION public.admin_set_access(_user_id uuid, _has_access boolean)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _email text;
  _prev boolean;
  _admin_email text;
  _action text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT email INTO _email FROM auth.users WHERE id = _user_id;
  IF _email IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Usuário não encontrado no Auth');
  END IF;

  SELECT has_access INTO _prev FROM public.user_access WHERE user_id = _user_id;

  INSERT INTO public.user_access (user_id, email, has_access, source)
  VALUES (_user_id, _email, _has_access, 'manual')
  ON CONFLICT (user_id) DO UPDATE
    SET has_access = EXCLUDED.has_access,
        email = EXCLUDED.email;

  SELECT email INTO _admin_email FROM auth.users WHERE id = auth.uid();

  _action := CASE
    WHEN _user_id = auth.uid() AND _has_access THEN 'self_grant'
    WHEN _has_access THEN 'grant_access'
    ELSE 'revoke_access'
  END;

  BEGIN
    INSERT INTO public.admin_audit_log (
      admin_id, admin_email, action, target_type, target_id, target_label, details
    ) VALUES (
      auth.uid(), _admin_email, _action, 'user_access', _user_id::text, _email,
      jsonb_build_object(
        'previous_has_access', _prev,
        'new_has_access', _has_access,
        'source', 'manual'
      )
    );
  EXCEPTION WHEN OTHERS THEN
    -- Never fail the access change because of audit insert problems.
    NULL;
  END;

  RETURN json_build_object('success', true, 'has_access', _has_access);
END;
$$;

-- 2) RPC to list access logs (admin only). Returns flattened, safe fields.
CREATE OR REPLACE FUNCTION public.admin_list_access_logs(_limit int DEFAULT 50)
RETURNS TABLE(
  id uuid,
  target_email text,
  admin_email text,
  admin_id uuid,
  action text,
  previous_has_access boolean,
  new_has_access boolean,
  source text,
  note text,
  created_at timestamptz
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
    l.id,
    l.target_label AS target_email,
    l.admin_email,
    l.admin_id,
    l.action,
    NULLIF(l.details->>'previous_has_access','')::boolean AS previous_has_access,
    NULLIF(l.details->>'new_has_access','')::boolean AS new_has_access,
    l.details->>'source' AS source,
    l.details->>'note' AS note,
    l.created_at
  FROM public.admin_audit_log l
  WHERE l.target_type = 'user_access'
  ORDER BY l.created_at DESC
  LIMIT GREATEST(1, LEAST(COALESCE(_limit, 50), 200));
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_access_logs(int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_access_logs(int) TO authenticated, service_role;

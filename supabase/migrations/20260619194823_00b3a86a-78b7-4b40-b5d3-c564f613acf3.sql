
-- ============================================================
-- Admin audit log expansion: gift_codes operations + general listing
-- Reuses public.admin_audit_log (already has RLS).
-- ============================================================

-- 1) Create gift code
CREATE OR REPLACE FUNCTION public.admin_create_gift_code(
  _code text,
  _duration_days int,
  _max_uses int,
  _is_active boolean DEFAULT true,
  _expires_at timestamptz DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _admin_email text;
  _new_id uuid;
  _norm text := lower(trim(coalesce(_code, '')));
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  IF _norm = '' THEN
    RETURN json_build_object('success', false, 'error', 'Informe um código.');
  END IF;
  IF _duration_days IS NULL OR _duration_days < 1 THEN
    RETURN json_build_object('success', false, 'error', 'Dias de acesso inválido.');
  END IF;
  IF _max_uses IS NULL OR _max_uses < 1 THEN
    RETURN json_build_object('success', false, 'error', 'Limite de usos inválido.');
  END IF;

  BEGIN
    INSERT INTO public.gift_codes (code, duration_days, max_uses, is_active, expires_at, created_by)
    VALUES (_norm, _duration_days, _max_uses, COALESCE(_is_active, true), _expires_at, auth.uid())
    RETURNING id INTO _new_id;
  EXCEPTION WHEN unique_violation THEN
    RETURN json_build_object('success', false, 'error', 'Já existe um código com esse valor.');
  END;

  SELECT email INTO _admin_email FROM auth.users WHERE id = auth.uid();

  BEGIN
    INSERT INTO public.admin_audit_log (
      admin_id, admin_email, action, target_type, target_id, target_label, details
    ) VALUES (
      auth.uid(), _admin_email, 'create_gift_code', 'gift_code', _new_id::text,
      left(_norm, 2) || '••••',
      jsonb_build_object(
        'code_id', _new_id,
        'code_masked', left(_norm, 2) || '••••' || right(_norm, 2),
        'duration_days', _duration_days,
        'max_uses', _max_uses,
        'is_active', COALESCE(_is_active, true),
        'expires_at', _expires_at
      )
    );
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  RETURN json_build_object('success', true, 'id', _new_id);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_create_gift_code(text,int,int,boolean,timestamptz) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_create_gift_code(text,int,int,boolean,timestamptz) TO authenticated, service_role;

-- 2) Activate / deactivate gift code
CREATE OR REPLACE FUNCTION public.admin_set_gift_code_active(_code_id uuid, _is_active boolean)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _row public.gift_codes%ROWTYPE;
  _admin_email text;
  _prev boolean;
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT * INTO _row FROM public.gift_codes WHERE id = _code_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Código não encontrado.');
  END IF;
  _prev := _row.is_active;

  UPDATE public.gift_codes SET is_active = _is_active WHERE id = _code_id;

  SELECT email INTO _admin_email FROM auth.users WHERE id = auth.uid();

  BEGIN
    INSERT INTO public.admin_audit_log (
      admin_id, admin_email, action, target_type, target_id, target_label, details
    ) VALUES (
      auth.uid(), _admin_email,
      CASE WHEN _is_active THEN 'activate_gift_code' ELSE 'deactivate_gift_code' END,
      'gift_code', _code_id::text,
      left(_row.code, 2) || '••••',
      jsonb_build_object(
        'code_id', _code_id,
        'code_masked', left(_row.code, 2) || '••••' || right(_row.code, 2),
        'duration_days', _row.duration_days,
        'max_uses', _row.max_uses,
        'current_uses', _row.current_uses,
        'previous_is_active', _prev,
        'new_is_active', _is_active,
        'expires_at', _row.expires_at
      )
    );
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  RETURN json_build_object('success', true, 'is_active', _is_active);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_set_gift_code_active(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_gift_code_active(uuid, boolean) TO authenticated, service_role;

-- 3) General audit log listing (admin only)
CREATE OR REPLACE FUNCTION public.admin_list_admin_audit_logs(_limit int DEFAULT 50)
RETURNS TABLE(
  id uuid,
  admin_id uuid,
  admin_email text,
  action text,
  target_type text,
  target_id text,
  target_label text,
  details jsonb,
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
  SELECT l.id, l.admin_id, l.admin_email, l.action, l.target_type, l.target_id,
         l.target_label, l.details, l.created_at
  FROM public.admin_audit_log l
  ORDER BY l.created_at DESC
  LIMIT GREATEST(1, LEAST(COALESCE(_limit, 50), 200));
END;
$$;
REVOKE ALL ON FUNCTION public.admin_list_admin_audit_logs(int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_admin_audit_logs(int) TO authenticated, service_role;

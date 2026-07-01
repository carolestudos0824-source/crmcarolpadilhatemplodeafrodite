
CREATE OR REPLACE FUNCTION public.admin_set_access(
  _user_id uuid,
  _has_access boolean,
  _duration_days int DEFAULT NULL
)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _email text;
  _prev boolean;
  _admin_email text;
  _action text;
  _expires_at timestamptz := NULL;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF _duration_days IS NOT NULL AND _duration_days < 1 THEN
    RETURN json_build_object('success', false, 'error', 'Duração inválida: use NULL ou valor >= 1.');
  END IF;

  SELECT email INTO _email FROM auth.users WHERE id = _user_id;
  IF _email IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Usuário não encontrado no Auth');
  END IF;

  SELECT has_access INTO _prev FROM public.user_access WHERE user_id = _user_id;

  IF _has_access AND _duration_days IS NOT NULL THEN
    _expires_at := now() + (_duration_days || ' days')::interval;
  END IF;

  -- Regra: quando concedendo acesso, access_expires_at reflete o parâmetro
  --   _duration_days = NULL  -> access_expires_at = NULL (perpétuo, igual ao antigo)
  --   _duration_days >= 1    -> access_expires_at = now() + N dias
  -- Quando revogando (has_access=false), preserva o valor existente (histórico).
  INSERT INTO public.user_access (user_id, email, has_access, source, access_expires_at)
  VALUES (_user_id, _email, _has_access, 'manual', _expires_at)
  ON CONFLICT (user_id) DO UPDATE
    SET has_access = EXCLUDED.has_access,
        email = EXCLUDED.email,
        access_expires_at = CASE
          WHEN EXCLUDED.has_access = true THEN EXCLUDED.access_expires_at
          ELSE public.user_access.access_expires_at
        END;

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
        'source', 'manual',
        'duration_days', _duration_days,
        'access_expires_at', _expires_at
      )
    );
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  RETURN json_build_object('success', true, 'has_access', _has_access, 'access_expires_at', _expires_at);
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_set_access(uuid, boolean, int) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_access(uuid, boolean, int) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.admin_grant_access_from_sale(
  _sale_id uuid,
  _duration_days int DEFAULT NULL
)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _row public.manual_sales%ROWTYPE;
  _uid uuid;
  _admin_email text;
  _prev_has_access boolean := NULL;
  _previous_access_existed boolean := false;
  _expires_at timestamptz := NULL;
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF _duration_days IS NOT NULL AND _duration_days < 1 THEN
    RETURN json_build_object('success', false, 'error', 'Duração inválida: use NULL ou valor >= 1.');
  END IF;

  SELECT * INTO _row FROM public.manual_sales WHERE id = _sale_id;
  IF NOT FOUND THEN RETURN json_build_object('success', false, 'error', 'Venda não encontrada.'); END IF;

  SELECT id INTO _uid FROM auth.users WHERE lower(email) = lower(_row.buyer_email) LIMIT 1;
  IF _uid IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Comprador ainda não criou conta com este e-mail. Peça para acessar /login com o mesmo e-mail e tente novamente.');
  END IF;

  SELECT has_access INTO _prev_has_access
    FROM public.user_access
   WHERE user_id = _uid;
  _previous_access_existed := FOUND;

  IF _duration_days IS NOT NULL THEN
    _expires_at := now() + (_duration_days || ' days')::interval;
  END IF;

  -- Regra: sempre concedendo acesso aqui (has_access = true).
  --   _duration_days = NULL -> access_expires_at = NULL (perpétuo, igual ao antigo)
  --   _duration_days >= 1   -> access_expires_at = now() + N dias
  INSERT INTO public.user_access (user_id, email, has_access, source, access_expires_at)
  VALUES (_uid, _row.buyer_email, true, 'manual_sale', _expires_at)
  ON CONFLICT (user_id) DO UPDATE
    SET has_access = true,
        email = EXCLUDED.email,
        source = 'manual_sale',
        access_expires_at = EXCLUDED.access_expires_at;

  UPDATE public.manual_sales
     SET access_status = 'access_granted',
         access_granted_at = now(),
         access_revoked_at = NULL,
         access_source = 'manual_sale'
   WHERE id = _sale_id;

  SELECT email INTO _admin_email FROM auth.users WHERE id = auth.uid();
  BEGIN
    INSERT INTO public.admin_audit_log (admin_id, admin_email, action, target_type, target_id, target_label, details)
    VALUES (auth.uid(), _admin_email, 'grant_access', 'user_access', _uid::text, _row.buyer_email,
      jsonb_build_object(
        'previous_has_access', _prev_has_access,
        'previous_access_existed', _previous_access_existed,
        'new_has_access', true,
        'source', 'manual_sale',
        'sale_id', _sale_id,
        'duration_days', _duration_days,
        'access_expires_at', _expires_at
      ));
  EXCEPTION WHEN OTHERS THEN NULL; END;

  RETURN json_build_object('success', true, 'user_id', _uid, 'access_expires_at', _expires_at);
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_grant_access_from_sale(uuid, int) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_grant_access_from_sale(uuid, int) TO authenticated, service_role;

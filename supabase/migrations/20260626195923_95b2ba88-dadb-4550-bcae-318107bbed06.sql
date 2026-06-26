CREATE OR REPLACE FUNCTION public.admin_grant_access_from_sale(_sale_id uuid)
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
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  SELECT * INTO _row FROM public.manual_sales WHERE id = _sale_id;
  IF NOT FOUND THEN RETURN json_build_object('success', false, 'error', 'Venda não encontrada.'); END IF;

  SELECT id INTO _uid FROM auth.users WHERE lower(email) = lower(_row.buyer_email) LIMIT 1;
  IF _uid IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Comprador ainda não criou conta com este e-mail. Peça para acessar /login com o mesmo e-mail e tente novamente.');
  END IF;

  -- Estado real anterior do acesso (antes do upsert)
  SELECT has_access INTO _prev_has_access
    FROM public.user_access
   WHERE user_id = _uid;
  _previous_access_existed := FOUND;

  INSERT INTO public.user_access (user_id, email, has_access, source)
  VALUES (_uid, _row.buyer_email, true, 'manual_sale')
  ON CONFLICT (user_id) DO UPDATE
    SET has_access = true, email = EXCLUDED.email, source = 'manual_sale';

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
        'sale_id', _sale_id
      ));
  EXCEPTION WHEN OTHERS THEN NULL; END;

  RETURN json_build_object('success', true, 'user_id', _uid);
END;
$function$;
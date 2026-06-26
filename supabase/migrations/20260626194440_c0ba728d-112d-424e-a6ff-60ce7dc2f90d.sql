CREATE OR REPLACE FUNCTION public.admin_revoke_access_from_sale(_sale_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _row public.manual_sales%ROWTYPE;
  _uid uuid;
  _admin_email text;
  _prev_has_access boolean := false;
  _other_active_count integer := 0;
  _access_kept boolean := false;
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT * INTO _row FROM public.manual_sales WHERE id = _sale_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Venda não encontrada.');
  END IF;

  SELECT id INTO _uid FROM auth.users WHERE lower(email) = lower(_row.buyer_email) LIMIT 1;

  IF _uid IS NOT NULL THEN
    SELECT COALESCE(has_access, false) INTO _prev_has_access
      FROM public.user_access WHERE user_id = _uid;
    _prev_has_access := COALESCE(_prev_has_access, false);
  END IF;

  -- Conta outras vendas ativas do mesmo comprador (mesmo e-mail normalizado)
  SELECT count(*) INTO _other_active_count
  FROM public.manual_sales s
  WHERE s.id <> _sale_id
    AND lower(s.buyer_email) = lower(_row.buyer_email)
    AND s.payment_status = 'paid_confirmed'
    AND s.access_status = 'access_granted';

  IF _other_active_count > 0 THEN
    _access_kept := true;
    -- Não mexer em user_access; manter acesso geral
  ELSE
    IF _uid IS NOT NULL THEN
      UPDATE public.user_access SET has_access = false WHERE user_id = _uid;
    END IF;
  END IF;

  UPDATE public.manual_sales
     SET access_status = 'access_revoked', access_revoked_at = now()
   WHERE id = _sale_id;

  SELECT email INTO _admin_email FROM auth.users WHERE id = auth.uid();
  BEGIN
    INSERT INTO public.admin_audit_log (admin_id, admin_email, action, target_type, target_id, target_label, details)
    VALUES (
      auth.uid(), _admin_email, 'revoke_access', 'user_access',
      COALESCE(_uid::text, _sale_id::text), _row.buyer_email,
      jsonb_build_object(
        'previous_has_access', _prev_has_access,
        'new_has_access', CASE WHEN _access_kept THEN _prev_has_access ELSE false END,
        'source', 'manual_sale',
        'sale_id', _sale_id,
        'access_kept', _access_kept,
        'other_active_sales', _other_active_count,
        'reason', CASE WHEN _access_kept THEN 'another_active_sale_exists' ELSE NULL END
      )
    );
  EXCEPTION WHEN OTHERS THEN NULL; END;

  RETURN json_build_object(
    'success', true,
    'access_kept', _access_kept,
    'other_active_sales', _other_active_count,
    'reason', CASE WHEN _access_kept THEN 'another_active_sale_exists' ELSE NULL END
  );
END;
$function$;
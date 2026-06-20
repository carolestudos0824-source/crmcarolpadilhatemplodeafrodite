-- Phase 1: manual sales backend
CREATE TABLE IF NOT EXISTS public.manual_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_email text NOT NULL,
  buyer_name text,
  product_name text NOT NULL DEFAULT 'Fábrica de Apps com IA',
  amount numeric NOT NULL DEFAULT 47,
  currency text NOT NULL DEFAULT 'BRL',
  payment_status text NOT NULL DEFAULT 'paid_confirmed',
  access_status text NOT NULL DEFAULT 'pending_access',
  access_source text NOT NULL DEFAULT 'manual_sale',
  payment_method text,
  payment_reference text,
  admin_notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  access_granted_at timestamptz,
  access_revoked_at timestamptz,
  CONSTRAINT manual_sales_payment_status_chk CHECK (payment_status IN ('paid_confirmed','pending_confirmation','refunded','cancelled')),
  CONSTRAINT manual_sales_access_status_chk CHECK (access_status IN ('pending_access','access_granted','access_revoked'))
);

CREATE INDEX IF NOT EXISTS manual_sales_buyer_email_idx ON public.manual_sales (lower(buyer_email));
CREATE INDEX IF NOT EXISTS manual_sales_created_at_idx ON public.manual_sales (created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.manual_sales TO authenticated;
GRANT ALL ON public.manual_sales TO service_role;

ALTER TABLE public.manual_sales ENABLE ROW LEVEL SECURITY;

-- Only admins can read or write manual sales (RLS). Frontend will use RPCs.
CREATE POLICY "Admins read manual sales"
  ON public.manual_sales FOR SELECT TO authenticated
  USING (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins insert manual sales"
  ON public.manual_sales FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update manual sales"
  ON public.manual_sales FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete manual sales"
  ON public.manual_sales FOR DELETE TO authenticated
  USING (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role));

-- updated_at trigger
DROP TRIGGER IF EXISTS manual_sales_set_updated_at ON public.manual_sales;
CREATE TRIGGER manual_sales_set_updated_at
  BEFORE UPDATE ON public.manual_sales
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ RPCs ============

CREATE OR REPLACE FUNCTION public.admin_create_manual_sale(
  _buyer_email text,
  _buyer_name text DEFAULT NULL,
  _amount numeric DEFAULT 47,
  _payment_status text DEFAULT 'paid_confirmed',
  _payment_method text DEFAULT NULL,
  _payment_reference text DEFAULT NULL,
  _admin_notes text DEFAULT NULL
) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _new_id uuid;
  _admin_email text;
  _norm_email text := lower(trim(coalesce(_buyer_email, '')));
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  IF _norm_email = '' OR position('@' in _norm_email) = 0 THEN
    RETURN json_build_object('success', false, 'error', 'E-mail do comprador inválido.');
  END IF;
  IF _amount IS NULL OR _amount < 0 THEN
    RETURN json_build_object('success', false, 'error', 'Valor inválido.');
  END IF;
  IF _payment_status NOT IN ('paid_confirmed','pending_confirmation','refunded','cancelled') THEN
    RETURN json_build_object('success', false, 'error', 'Status de pagamento inválido.');
  END IF;

  INSERT INTO public.manual_sales (
    buyer_email, buyer_name, amount, payment_status,
    payment_method, payment_reference, admin_notes, created_by
  ) VALUES (
    _norm_email, NULLIF(trim(coalesce(_buyer_name,'')),''), _amount, _payment_status,
    _payment_method, _payment_reference, _admin_notes, auth.uid()
  ) RETURNING id INTO _new_id;

  SELECT email INTO _admin_email FROM auth.users WHERE id = auth.uid();
  BEGIN
    INSERT INTO public.admin_audit_log (admin_id, admin_email, action, target_type, target_id, target_label, details)
    VALUES (auth.uid(), _admin_email, 'create_manual_sale', 'manual_sale', _new_id::text, _norm_email,
      jsonb_build_object('amount', _amount, 'payment_status', _payment_status, 'payment_method', _payment_method));
  EXCEPTION WHEN OTHERS THEN NULL; END;

  RETURN json_build_object('success', true, 'id', _new_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_manual_sale(
  _sale_id uuid,
  _buyer_name text DEFAULT NULL,
  _amount numeric DEFAULT NULL,
  _payment_status text DEFAULT NULL,
  _payment_method text DEFAULT NULL,
  _payment_reference text DEFAULT NULL,
  _admin_notes text DEFAULT NULL
) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _admin_email text;
  _row public.manual_sales%ROWTYPE;
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  SELECT * INTO _row FROM public.manual_sales WHERE id = _sale_id;
  IF NOT FOUND THEN RETURN json_build_object('success', false, 'error', 'Venda não encontrada.'); END IF;

  IF _payment_status IS NOT NULL
     AND _payment_status NOT IN ('paid_confirmed','pending_confirmation','refunded','cancelled') THEN
    RETURN json_build_object('success', false, 'error', 'Status de pagamento inválido.');
  END IF;

  UPDATE public.manual_sales SET
    buyer_name = COALESCE(_buyer_name, buyer_name),
    amount = COALESCE(_amount, amount),
    payment_status = COALESCE(_payment_status, payment_status),
    payment_method = COALESCE(_payment_method, payment_method),
    payment_reference = COALESCE(_payment_reference, payment_reference),
    admin_notes = COALESCE(_admin_notes, admin_notes)
  WHERE id = _sale_id;

  SELECT email INTO _admin_email FROM auth.users WHERE id = auth.uid();
  BEGIN
    INSERT INTO public.admin_audit_log (admin_id, admin_email, action, target_type, target_id, target_label, details)
    VALUES (auth.uid(), _admin_email, 'update_manual_sale', 'manual_sale', _sale_id::text, _row.buyer_email,
      jsonb_build_object('payment_status', _payment_status, 'amount', _amount));
  EXCEPTION WHEN OTHERS THEN NULL; END;

  RETURN json_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_manual_sales(
  _limit integer DEFAULT 100,
  _search text DEFAULT NULL,
  _payment_status text DEFAULT NULL,
  _access_status text DEFAULT NULL
) RETURNS TABLE (
  id uuid, buyer_email text, buyer_name text, product_name text,
  amount numeric, currency text, payment_status text, access_status text,
  access_source text, payment_method text, payment_reference text,
  admin_notes text, created_at timestamptz, updated_at timestamptz,
  access_granted_at timestamptz, access_revoked_at timestamptz
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  RETURN QUERY
  SELECT s.id, s.buyer_email, s.buyer_name, s.product_name, s.amount, s.currency,
         s.payment_status, s.access_status, s.access_source, s.payment_method,
         s.payment_reference, s.admin_notes, s.created_at, s.updated_at,
         s.access_granted_at, s.access_revoked_at
  FROM public.manual_sales s
  WHERE (_search IS NULL OR _search = ''
         OR lower(s.buyer_email) LIKE '%' || lower(_search) || '%'
         OR lower(coalesce(s.buyer_name,'')) LIKE '%' || lower(_search) || '%')
    AND (_payment_status IS NULL OR s.payment_status = _payment_status)
    AND (_access_status IS NULL OR s.access_status = _access_status)
  ORDER BY s.created_at DESC
  LIMIT GREATEST(1, LEAST(COALESCE(_limit, 100), 500));
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_manual_sale(_sale_id uuid)
RETURNS json
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE _row public.manual_sales%ROWTYPE;
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  SELECT * INTO _row FROM public.manual_sales WHERE id = _sale_id;
  IF NOT FOUND THEN RETURN json_build_object('success', false, 'error', 'Venda não encontrada.'); END IF;
  RETURN json_build_object('success', true, 'sale', row_to_json(_row));
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_grant_access_from_sale(_sale_id uuid)
RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _row public.manual_sales%ROWTYPE;
  _uid uuid;
  _admin_email text;
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
      jsonb_build_object('previous_has_access', false, 'new_has_access', true, 'source', 'manual_sale', 'sale_id', _sale_id));
  EXCEPTION WHEN OTHERS THEN NULL; END;

  RETURN json_build_object('success', true, 'user_id', _uid);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_revoke_access_from_sale(_sale_id uuid)
RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _row public.manual_sales%ROWTYPE;
  _uid uuid;
  _admin_email text;
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  SELECT * INTO _row FROM public.manual_sales WHERE id = _sale_id;
  IF NOT FOUND THEN RETURN json_build_object('success', false, 'error', 'Venda não encontrada.'); END IF;

  SELECT id INTO _uid FROM auth.users WHERE lower(email) = lower(_row.buyer_email) LIMIT 1;
  IF _uid IS NOT NULL THEN
    UPDATE public.user_access SET has_access = false WHERE user_id = _uid;
  END IF;

  UPDATE public.manual_sales
     SET access_status = 'access_revoked', access_revoked_at = now()
   WHERE id = _sale_id;

  SELECT email INTO _admin_email FROM auth.users WHERE id = auth.uid();
  BEGIN
    INSERT INTO public.admin_audit_log (admin_id, admin_email, action, target_type, target_id, target_label, details)
    VALUES (auth.uid(), _admin_email, 'revoke_access', 'user_access', COALESCE(_uid::text, _sale_id::text), _row.buyer_email,
      jsonb_build_object('previous_has_access', true, 'new_has_access', false, 'source', 'manual_sale', 'sale_id', _sale_id));
  EXCEPTION WHEN OTHERS THEN NULL; END;

  RETURN json_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_create_manual_sale(text,text,numeric,text,text,text,text) FROM public, anon;
REVOKE ALL ON FUNCTION public.admin_update_manual_sale(uuid,text,numeric,text,text,text,text) FROM public, anon;
REVOKE ALL ON FUNCTION public.admin_list_manual_sales(integer,text,text,text) FROM public, anon;
REVOKE ALL ON FUNCTION public.admin_get_manual_sale(uuid) FROM public, anon;
REVOKE ALL ON FUNCTION public.admin_grant_access_from_sale(uuid) FROM public, anon;
REVOKE ALL ON FUNCTION public.admin_revoke_access_from_sale(uuid) FROM public, anon;

GRANT EXECUTE ON FUNCTION public.admin_create_manual_sale(text,text,numeric,text,text,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_manual_sale(uuid,text,numeric,text,text,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_manual_sales(integer,text,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_manual_sale(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_grant_access_from_sale(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_revoke_access_from_sale(uuid) TO authenticated;
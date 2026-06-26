-- Drop assinatura antiga para evitar overload ambíguo no PostgREST
DROP FUNCTION IF EXISTS public.admin_list_manual_sales(integer, text, text, text);

CREATE OR REPLACE FUNCTION public.admin_list_manual_sales(
  _limit integer DEFAULT 100,
  _search text DEFAULT NULL,
  _payment_status text DEFAULT NULL,
  _access_status text DEFAULT NULL,
  _before_created_at timestamptz DEFAULT NULL,
  _before_id uuid DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  buyer_email text,
  buyer_name text,
  product_name text,
  amount numeric,
  currency text,
  payment_status text,
  access_status text,
  access_source text,
  payment_method text,
  payment_reference text,
  admin_notes text,
  created_at timestamptz,
  updated_at timestamptz,
  access_granted_at timestamptz,
  access_revoked_at timestamptz
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    AND (
      _before_created_at IS NULL
      OR s.created_at < _before_created_at
      OR (s.created_at = _before_created_at AND s.id < _before_id)
    )
  ORDER BY s.created_at DESC, s.id DESC
  LIMIT GREATEST(1, LEAST(COALESCE(_limit, 100), 500));
END;
$function$;

-- Garante permissão de execução para o papel usado pelo frontend (guard interno continua restrito a admin)
GRANT EXECUTE ON FUNCTION public.admin_list_manual_sales(
  integer, text, text, text, timestamptz, uuid
) TO authenticated;
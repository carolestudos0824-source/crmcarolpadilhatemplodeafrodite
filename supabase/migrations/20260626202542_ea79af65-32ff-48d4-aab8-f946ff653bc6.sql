
-- =====================================================================
-- New RPC: admin_list_buyers_overview
-- Server-side aggregation + pagination + filters for Admin → Compradores.
-- No existing object is modified. No RLS / policy / grant changes elsewhere.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.admin_list_buyers_overview(
  _limit           int          DEFAULT 50,
  _search          text         DEFAULT NULL,
  _payment_status  text         DEFAULT NULL,   -- paid_confirmed | pending_confirmation | refunded | cancelled
  _access_filter   text         DEFAULT NULL,   -- granted | awaiting_login | awaiting_grant | revoked | none
  _source          text         DEFAULT NULL,   -- user_access.source filter
  _period_days     int          DEFAULT NULL,   -- window over sort_at
  _before_sort_at  timestamptz  DEFAULT NULL,   -- cursor sort_at
  _before_email    text         DEFAULT NULL    -- cursor tiebreaker (lower(email))
)
RETURNS TABLE(
  email                 text,
  buyer_name            text,
  user_id               uuid,
  has_access            boolean,
  access_source         text,
  -- NOTE: user_access has no updated_at column; we use user_access.created_at
  -- as the "last access change" timestamp. Documented here on purpose.
  access_updated_at     timestamptz,
  user_created_at       timestamptz,
  origin                text,             -- 'sale_only' | 'user_only' | 'mixed'
  sales_count           int,
  paid_confirmed_count  int,
  pending_count         int,
  refunded_count        int,
  cancelled_count       int,
  total_paid_confirmed  numeric,
  last_sale_id          uuid,
  last_sale_at          timestamptz,
  last_payment_status   text,
  last_access_status    text,
  sort_at               timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _eff_limit int := GREATEST(1, LEAST(COALESCE(_limit, 50), 200));
  _q text := NULLIF(lower(trim(COALESCE(_search, ''))), '');
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  WITH sales_agg AS (
    SELECT
      lower(s.buyer_email)                                                          AS email_key,
      max(s.buyer_name)                                                             AS buyer_name,
      count(*)::int                                                                 AS sales_count,
      count(*) FILTER (WHERE s.payment_status = 'paid_confirmed')::int              AS paid_confirmed_count,
      count(*) FILTER (WHERE s.payment_status = 'pending_confirmation')::int        AS pending_count,
      count(*) FILTER (WHERE s.payment_status = 'refunded')::int                    AS refunded_count,
      count(*) FILTER (WHERE s.payment_status = 'cancelled')::int                   AS cancelled_count,
      coalesce(sum(s.amount) FILTER (WHERE s.payment_status = 'paid_confirmed'), 0) AS total_paid_confirmed,
      max(s.created_at)                                                             AS last_sale_at
    FROM public.manual_sales s
    GROUP BY lower(s.buyer_email)
  ),
  last_sale AS (
    SELECT DISTINCT ON (lower(s.buyer_email))
      lower(s.buyer_email) AS email_key,
      s.id                 AS last_sale_id,
      s.payment_status     AS last_payment_status,
      s.access_status      AS last_access_status,
      s.created_at         AS last_sale_at
    FROM public.manual_sales s
    ORDER BY lower(s.buyer_email), s.created_at DESC, s.id DESC
  ),
  users_agg AS (
    SELECT
      lower(u.email)                                  AS email_key,
      u.email::text                                   AS email_real,
      u.id                                            AS user_id,
      u.created_at                                    AS user_created_at,
      coalesce(ua.has_access, false)                  AS has_access,
      ua.source                                       AS access_source,
      ua.created_at                                   AS access_updated_at
    FROM auth.users u
    LEFT JOIN public.user_access ua ON ua.user_id = u.id
  ),
  combined AS (
    SELECT
      coalesce(ua.email_real, sa.email_key)                                  AS email,
      coalesce(ua.user_id, NULL)                                             AS user_id,
      sa.buyer_name,
      coalesce(ua.has_access, false)                                         AS has_access,
      ua.access_source,
      ua.access_updated_at,
      ua.user_created_at,
      CASE
        WHEN sa.email_key IS NOT NULL AND ua.email_key IS NOT NULL THEN 'mixed'
        WHEN sa.email_key IS NOT NULL THEN 'sale_only'
        ELSE 'user_only'
      END                                                                    AS origin,
      coalesce(sa.sales_count, 0)                                            AS sales_count,
      coalesce(sa.paid_confirmed_count, 0)                                   AS paid_confirmed_count,
      coalesce(sa.pending_count, 0)                                          AS pending_count,
      coalesce(sa.refunded_count, 0)                                         AS refunded_count,
      coalesce(sa.cancelled_count, 0)                                        AS cancelled_count,
      coalesce(sa.total_paid_confirmed, 0)                                   AS total_paid_confirmed,
      ls.last_sale_id,
      ls.last_sale_at,
      ls.last_payment_status,
      ls.last_access_status,
      -- sort_at is guaranteed non-null because every row has at least one of:
      -- last_sale_at, access_updated_at (user_access.created_at), or user_created_at.
      coalesce(ls.last_sale_at, ua.access_updated_at, ua.user_created_at)    AS sort_at,
      coalesce(ua.email_key, sa.email_key)                                   AS email_key
    FROM sales_agg sa
    FULL OUTER JOIN users_agg ua ON ua.email_key = sa.email_key
    LEFT JOIN last_sale ls       ON ls.email_key = sa.email_key
  )
  SELECT
    c.email,
    c.buyer_name,
    c.user_id,
    c.has_access,
    c.access_source,
    c.access_updated_at,
    c.user_created_at,
    c.origin,
    c.sales_count,
    c.paid_confirmed_count,
    c.pending_count,
    c.refunded_count,
    c.cancelled_count,
    c.total_paid_confirmed,
    c.last_sale_id,
    c.last_sale_at,
    c.last_payment_status,
    c.last_access_status,
    c.sort_at
  FROM combined c
  WHERE
    -- search
    (_q IS NULL
       OR c.email_key LIKE '%' || _q || '%'
       OR lower(coalesce(c.buyer_name, '')) LIKE '%' || _q || '%')
    -- payment status: at least one sale in that status
    AND (
      _payment_status IS NULL
      OR (_payment_status = 'paid_confirmed'       AND c.paid_confirmed_count > 0)
      OR (_payment_status = 'pending_confirmation' AND c.pending_count > 0)
      OR (_payment_status = 'refunded'             AND c.refunded_count > 0)
      OR (_payment_status = 'cancelled'            AND c.cancelled_count > 0)
    )
    -- access filter
    AND (
      _access_filter IS NULL
      OR (_access_filter = 'granted'        AND c.has_access = true)
      OR (_access_filter = 'awaiting_login' AND c.user_id IS NULL AND c.paid_confirmed_count > 0)
      OR (_access_filter = 'awaiting_grant' AND c.user_id IS NOT NULL AND c.has_access = false AND c.paid_confirmed_count > 0)
      OR (_access_filter = 'revoked'        AND c.last_access_status = 'access_revoked' AND c.has_access = false)
      OR (_access_filter = 'none'           AND c.has_access = false AND c.paid_confirmed_count = 0)
    )
    -- access source filter
    AND (_source IS NULL OR c.access_source = _source)
    -- period window (over sort_at)
    AND (_period_days IS NULL OR c.sort_at >= (now() - make_interval(days => _period_days)))
    -- keyset cursor
    AND (
      _before_sort_at IS NULL
      OR c.sort_at < _before_sort_at
      OR (c.sort_at = _before_sort_at AND c.email_key > coalesce(_before_email, ''))
    )
  ORDER BY c.sort_at DESC, c.email_key ASC
  LIMIT _eff_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_buyers_overview(
  int, text, text, text, text, int, timestamptz, text
) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.admin_list_buyers_overview(
  int, text, text, text, text, int, timestamptz, text
) TO authenticated, service_role;

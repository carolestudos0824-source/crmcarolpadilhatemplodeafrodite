
-- =========================================
-- TABELAS
-- =========================================
CREATE TABLE public.user_presence (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  last_route text,
  last_module text,
  session_id uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.user_presence TO authenticated;
GRANT ALL ON public.user_presence TO service_role;

ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Usuário só lê o próprio registro. Escrita só via RPC SECURITY DEFINER.
CREATE POLICY "user_presence_self_select"
  ON public.user_presence FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_presence_admin_select"
  ON public.user_presence FOR SELECT
  TO authenticated
  USING (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.user_activity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  route text NOT NULL,
  module text,
  event_type text NOT NULL CHECK (event_type IN ('page_view','module_open','session_start')),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.user_activity_events TO authenticated;
GRANT ALL ON public.user_activity_events TO service_role;

ALTER TABLE public.user_activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_activity_events_self_select"
  ON public.user_activity_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_activity_events_admin_select"
  ON public.user_activity_events FOR SELECT
  TO authenticated
  USING (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================
-- ÍNDICES
-- =========================================
CREATE INDEX idx_user_presence_last_seen ON public.user_presence (last_seen_at DESC);
CREATE INDEX idx_uae_user_created ON public.user_activity_events (user_id, created_at DESC);
CREATE INDEX idx_uae_created ON public.user_activity_events (created_at DESC);
CREATE INDEX idx_uae_module_created ON public.user_activity_events (module, created_at DESC);
CREATE INDEX idx_uae_event_created ON public.user_activity_events (event_type, created_at DESC);

-- =========================================
-- HELPER: sanitizar rota (remove querystring e hash, limita tamanho)
-- =========================================
CREATE OR REPLACE FUNCTION public._sanitize_route(_route text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path TO public
AS $$
  SELECT CASE
    WHEN _route IS NULL THEN NULL
    ELSE left(split_part(split_part(_route, '?', 1), '#', 1), 200)
  END
$$;

-- =========================================
-- RPCs DE ESCRITA (usuário autenticado)
-- =========================================
CREATE OR REPLACE FUNCTION public.update_user_presence(
  _route text,
  _module text,
  _session_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _r text := public._sanitize_route(_route);
  _m text := NULLIF(left(coalesce(_module, ''), 100), '');
BEGIN
  IF _uid IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'unauthenticated');
  END IF;

  INSERT INTO public.user_presence (user_id, last_seen_at, last_route, last_module, session_id, updated_at)
  VALUES (_uid, now(), _r, _m, _session_id, now())
  ON CONFLICT (user_id) DO UPDATE
    SET last_seen_at = now(),
        last_route = EXCLUDED.last_route,
        last_module = EXCLUDED.last_module,
        session_id = COALESCE(EXCLUDED.session_id, public.user_presence.session_id),
        updated_at = now();

  RETURN json_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.track_user_activity(
  _route text,
  _module text,
  _event_type text
)
RETURNS json
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _r text := public._sanitize_route(_route);
  _m text := NULLIF(left(coalesce(_module, ''), 100), '');
BEGIN
  IF _uid IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'unauthenticated');
  END IF;

  IF _event_type NOT IN ('page_view','module_open','session_start') THEN
    RETURN json_build_object('success', false, 'error', 'invalid_event_type');
  END IF;

  IF _r IS NULL OR _r = '' THEN
    RETURN json_build_object('success', false, 'error', 'invalid_route');
  END IF;

  INSERT INTO public.user_activity_events (user_id, route, module, event_type)
  VALUES (_uid, _r, _m, _event_type);

  RETURN json_build_object('success', true);
END;
$$;

-- =========================================
-- RPCs ADMINISTRATIVAS (leitura)
-- =========================================
CREATE OR REPLACE FUNCTION public.admin_get_program_metrics()
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  _online_now int;
  _today_views int;
  _views_7d int;
  _views_30d int;
  _active_today int;
  _active_7d int;
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT count(*) INTO _online_now
    FROM public.user_presence
    WHERE last_seen_at >= now() - interval '5 minutes';

  SELECT count(*) INTO _today_views
    FROM public.user_activity_events
    WHERE event_type = 'page_view' AND created_at >= date_trunc('day', now());

  SELECT count(*) INTO _views_7d
    FROM public.user_activity_events
    WHERE event_type = 'page_view' AND created_at >= now() - interval '7 days';

  SELECT count(*) INTO _views_30d
    FROM public.user_activity_events
    WHERE event_type = 'page_view' AND created_at >= now() - interval '30 days';

  SELECT count(DISTINCT user_id) INTO _active_today
    FROM public.user_activity_events
    WHERE created_at >= date_trunc('day', now());

  SELECT count(DISTINCT user_id) INTO _active_7d
    FROM public.user_activity_events
    WHERE created_at >= now() - interval '7 days';

  RETURN json_build_object(
    'online_now', _online_now,
    'today_views', _today_views,
    'views_7d', _views_7d,
    'views_30d', _views_30d,
    'active_today', _active_today,
    'active_7d', _active_7d
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_online_users(
  _window_minutes int DEFAULT 5,
  _limit int DEFAULT 100
)
RETURNS TABLE(
  user_id uuid,
  email text,
  last_seen_at timestamptz,
  last_route text,
  last_module text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  _w int := GREATEST(1, LEAST(COALESCE(_window_minutes, 5), 60));
  _l int := GREATEST(1, LEAST(COALESCE(_limit, 100), 200));
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  SELECT p.user_id, u.email::text, p.last_seen_at, p.last_route, p.last_module
  FROM public.user_presence p
  LEFT JOIN auth.users u ON u.id = p.user_id
  WHERE p.last_seen_at >= now() - make_interval(mins => _w)
  ORDER BY p.last_seen_at DESC
  LIMIT _l;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_recent_activity(
  _limit int DEFAULT 50,
  _module text DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  email text,
  route text,
  module text,
  event_type text,
  created_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  _l int := GREATEST(1, LEAST(COALESCE(_limit, 50), 200));
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  SELECT e.id, e.user_id, u.email::text, e.route, e.module, e.event_type, e.created_at
  FROM public.user_activity_events e
  LEFT JOIN auth.users u ON u.id = e.user_id
  WHERE (_module IS NULL OR e.module = _module)
  ORDER BY e.created_at DESC
  LIMIT _l;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_top_modules(
  _period_days int DEFAULT 30,
  _limit int DEFAULT 10
)
RETURNS TABLE(module text, total bigint)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  _p int := GREATEST(1, LEAST(COALESCE(_period_days, 30), 365));
  _l int := GREATEST(1, LEAST(COALESCE(_limit, 10), 50));
BEGIN
  IF NOT (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  SELECT e.module, count(*)::bigint AS total
  FROM public.user_activity_events e
  WHERE e.module IS NOT NULL
    AND e.created_at >= now() - make_interval(days => _p)
  GROUP BY e.module
  ORDER BY total DESC
  LIMIT _l;
END;
$$;

-- =========================================
-- GRANTs nas RPCs
-- =========================================
REVOKE ALL ON FUNCTION public.update_user_presence(text, text, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.track_user_activity(text, text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_get_program_metrics() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_list_online_users(int, int) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_list_recent_activity(int, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_top_modules(int, int) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.update_user_presence(text, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.track_user_activity(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_program_metrics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_online_users(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_recent_activity(int, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_top_modules(int, int) TO authenticated;

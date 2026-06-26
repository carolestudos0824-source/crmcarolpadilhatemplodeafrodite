import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const TRACKED_PREFIXES = ["/entrega", "/arquiteto"];
const EXCLUDED_PREFIXES = ["/admin", "/login", "/checkout", "/obrigado", "/auth", "/reset-password"];
const HEARTBEAT_MS = 60_000;
const THROTTLE_MS = 60_000;
const SESSION_ID_KEY = "fabrica_apps_session_id";
const SESSION_START_KEY = "fabrica_apps_session_started";

function isTracked(pathname: string): boolean {
  if (EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) return false;
  return TRACKED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function moduleFromPath(pathname: string): string {
  if (pathname.startsWith("/entrega")) return "entrega";
  if (pathname.startsWith("/arquiteto")) return "arquiteto";
  return "programa";
}

function sanitizePath(pathname: string): string {
  return pathname.split("?")[0].split("#")[0].slice(0, 200);
}

function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_ID_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_ID_KEY, id);
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

async function safePresence(route: string, mod: string, sessionId: string) {
  try {
    await supabase.rpc("update_user_presence", {
      _route: route,
      _module: mod,
      _session_id: sessionId,
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn("[presence]", err);
  }
}

async function safeActivity(route: string, mod: string, eventType: "page_view" | "session_start") {
  try {
    await supabase.rpc("track_user_activity", {
      _route: route,
      _module: mod,
      _event_type: eventType,
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn("[activity]", err);
  }
}

/**
 * Heartbeat + tracker mínimo de presença na área interna.
 * - Roda apenas com usuário autenticado e em rotas internas permitidas.
 * - Heartbeat de 60s, pausa em visibilitychange="hidden".
 * - page_view com throttle de 60s por rota.
 * - session_start uma única vez por aba (sessionStorage).
 */
export function usePresenceHeartbeat() {
  const { pathname } = useLocation();
  const intervalRef = useRef<number | null>(null);
  const lastViewByRouteRef = useRef<Map<string, number>>(new Map());
  const authedRef = useRef<boolean>(false);

  // Track auth state
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) authedRef.current = !!data.session?.user;
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      authedRef.current = !!session?.user;
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const route = sanitizePath(pathname);
    if (!isTracked(route)) return;

    let cancelled = false;
    const mod = moduleFromPath(route);
    const sessionId = getOrCreateSessionId();

    const tick = () => {
      if (cancelled || !authedRef.current) return;
      if (document.visibilityState !== "visible") return;
      void safePresence(route, mod, sessionId);
    };

    const sendPageView = () => {
      if (!authedRef.current) return;
      const now = Date.now();
      const last = lastViewByRouteRef.current.get(route) ?? 0;
      if (now - last < THROTTLE_MS) return;
      lastViewByRouteRef.current.set(route, now);
      void safeActivity(route, mod, "page_view");
    };

    // Initial: presence + page_view + session_start (once per tab)
    const initial = async () => {
      // wait briefly for auth bootstrap if needed
      if (!authedRef.current) {
        const { data } = await supabase.auth.getSession();
        authedRef.current = !!data.session?.user;
      }
      if (!authedRef.current || cancelled) return;
      void safePresence(route, mod, sessionId);
      sendPageView();
      try {
        if (!sessionStorage.getItem(SESSION_START_KEY)) {
          sessionStorage.setItem(SESSION_START_KEY, "1");
          void safeActivity(route, mod, "session_start");
        }
      } catch {
        /* noop */
      }
    };
    void initial();

    // Heartbeat
    intervalRef.current = window.setInterval(tick, HEARTBEAT_MS);

    // Visibility: ping when returning to visible
    const onVisibility = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pathname]);
}

export default usePresenceHeartbeat;

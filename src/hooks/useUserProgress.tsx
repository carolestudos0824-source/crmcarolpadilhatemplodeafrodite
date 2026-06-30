import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { useAppProjects } from "@/hooks/useAppProjects";

/**
 * Centralizes the student's progress, persisted in `public.user_progress_state`
 * scoped by (user_id, project_id). Each project has its own independent
 * progress row — no leakage between projects.
 *
 * Any DB or network failure is swallowed (only `console.warn`) so the UI never
 * breaks for the student. While auth/projects are loading or the initial DB
 * read is in flight, `loading` is true and consumers should show a skeleton.
 */

type ProgressSnapshot = {
  active_module: string | null;
  modules_done: Record<string, boolean>;
  checklist: Record<string, boolean>;
  commands_done: Record<string, boolean>;
};

type Updater<T> = T | ((prev: T) => T);

type Ctx = {
  loading: boolean;
  active: string | null;
  setActive: (v: string | null) => void;
  moduleDone: Record<string, boolean>;
  setModuleDone: (updater: Updater<Record<string, boolean>>) => void;
  checklist: Record<string, boolean>;
  setChecklist: (updater: Updater<Record<string, boolean>>) => void;
  commands: Record<string, boolean>;
  toggleCommand: (key: string) => void;
  isCommandDone: (key: string) => boolean;
  commandsDoneCount: number;
};

const EMPTY: ProgressSnapshot = {
  active_module: null,
  modules_done: {},
  checklist: {},
  commands_done: {},
};

const UserProgressContext = createContext<Ctx | null>(null);

const cleanupLegacyKeys = () => {
  try {
    localStorage.removeItem("fabrica_apps_active_module_v1");
    localStorage.removeItem("fabrica_apps_module_done_v1");
    localStorage.removeItem("fabrica_apps_checklist_v1");
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("fabrica_apps_cmd_done_")) toRemove.push(k);
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
};

export const UserProgressProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthState();
  const { activeId: activeProjectId, loading: projectsLoading } = useAppProjects();
  const [state, setState] = useState<ProgressSnapshot>(EMPTY);
  const [loading, setLoading] = useState(true);
  const stateRef = useRef(state);
  stateRef.current = state;
  const timerRef = useRef<number | null>(null);

  // Hydration flag: only saves are allowed AFTER initial fetch for the
  // current project completes. Prevents the empty reset on project switch
  // from upserting a wipe back to the database.
  const hydratedProjectRef = useRef<string | null>(null);
  // Tracks the project_id of the currently in-flight fetch, so a slow fetch
  // from project A landing after a switch to project B is dropped.
  const fetchTokenRef = useRef<string | null>(null);

  const userId = auth.status === "authed" ? auth.userId : null;

  // Initial / per-project load
  useEffect(() => {
    let cancelled = false;
    if (auth.status === "loading" || projectsLoading) {
      setLoading(true);
      return;
    }
    if (!userId) {
      hydratedProjectRef.current = null;
      fetchTokenRef.current = null;
      setState(EMPTY);
      setLoading(false);
      return;
    }
    // Reset to EMPTY immediately on project switch so the UI doesn't flicker
    // with previous project's progress. Mark as un-hydrated to block saves.
    hydratedProjectRef.current = null;
    setState(EMPTY);

    if (!activeProjectId) {
      // Logged-in user with no active project yet — show empty without I/O.
      fetchTokenRef.current = null;
      setLoading(false);
      return;
    }

    setLoading(true);
    cleanupLegacyKeys();
    const token = activeProjectId;
    fetchTokenRef.current = token;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("user_progress_state")
          .select("active_module, modules_done, checklist, commands_done")
          .eq("user_id", userId)
          .eq("project_id", token)
          .maybeSingle();
        if (cancelled || fetchTokenRef.current !== token) return;
        if (error) {
          console.warn("[useUserProgress] load error", error);
          setState(EMPTY);
        } else if (data) {
          setState({
            active_module: data.active_module ?? null,
            modules_done:
              (data.modules_done as Record<string, boolean> | null) ?? {},
            checklist:
              (data.checklist as Record<string, boolean> | null) ?? {},
            commands_done:
              (data.commands_done as Record<string, boolean> | null) ?? {},
          });
        } else {
          setState(EMPTY);
        }
        hydratedProjectRef.current = token;
      } catch (e) {
        if (!cancelled && fetchTokenRef.current === token) {
          console.warn("[useUserProgress] load failed", e);
          hydratedProjectRef.current = token;
        }
      } finally {
        if (!cancelled && fetchTokenRef.current === token) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [auth.status, userId, activeProjectId, projectsLoading]);

  const scheduleUpsert = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(async () => {
      try {
        const { data: sess } = await supabase.auth.getSession();
        const uid = sess.session?.user?.id;
        if (!uid) return;
        const pid = activeProjectId;
        // Block saves if no active project OR if hydration hasn't completed
        // for this project yet (prevents empty-state overwrite on switch).
        if (!pid) return;
        if (hydratedProjectRef.current !== pid) return;
        const snap = stateRef.current;
        const { error } = await supabase.from("user_progress_state").upsert(
          {
            user_id: uid,
            project_id: pid,
            active_module: snap.active_module,
            modules_done: snap.modules_done,
            checklist: snap.checklist,
            commands_done: snap.commands_done,
          },
          { onConflict: "user_id,project_id" },
        );
        if (error) console.warn("[useUserProgress] upsert error", error);
      } catch (e) {
        console.warn("[useUserProgress] upsert failed", e);
      }
    }, 400);
  }, [activeProjectId]);

  const setActive = useCallback(
    (v: string | null) => {
      setState((prev) =>
        prev.active_module === v ? prev : { ...prev, active_module: v },
      );
      scheduleUpsert();
    },
    [scheduleUpsert],
  );

  const setModuleDone = useCallback(
    (updater: Updater<Record<string, boolean>>) => {
      setState((prev) => ({
        ...prev,
        modules_done:
          typeof updater === "function" ? updater(prev.modules_done) : updater,
      }));
      scheduleUpsert();
    },
    [scheduleUpsert],
  );

  const setChecklist = useCallback(
    (updater: Updater<Record<string, boolean>>) => {
      setState((prev) => ({
        ...prev,
        checklist:
          typeof updater === "function" ? updater(prev.checklist) : updater,
      }));
      scheduleUpsert();
    },
    [scheduleUpsert],
  );

  const toggleCommand = useCallback(
    (key: string) => {
      setState((prev) => ({
        ...prev,
        commands_done: {
          ...prev.commands_done,
          [key]: !prev.commands_done[key],
        },
      }));
      scheduleUpsert();
    },
    [scheduleUpsert],
  );

  const isCommandDone = useCallback(
    (key: string) => !!state.commands_done[key],
    [state.commands_done],
  );

  const commandsDoneCount = useMemo(
    () => Object.values(state.commands_done).filter(Boolean).length,
    [state.commands_done],
  );

  const value: Ctx = {
    loading: loading || auth.status === "loading" || projectsLoading,
    active: state.active_module,
    setActive,
    moduleDone: state.modules_done,
    setModuleDone,
    checklist: state.checklist,
    setChecklist,
    commands: state.commands_done,
    toggleCommand,
    isCommandDone,
    commandsDoneCount,
  };

  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = (): Ctx => {
  const ctx = useContext(UserProgressContext);
  if (!ctx) {
    throw new Error("useUserProgress must be used within UserProgressProvider");
  }
  return ctx;
};

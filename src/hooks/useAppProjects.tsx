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
import type { Database } from "@/integrations/supabase/types";
import {
  EMPTY_PROJECT_CONTEXT,
  useProjectContext,
  type ProjectContext,
  type YesNo,
} from "@/hooks/useProjectContext";

/**
 * Verifica se um ProjectContext contém dados úteis nos campos principais
 * que alimentam os prompts. Usado para evitar que um projeto vazio
 * sobrescreva em memória o contexto preenchido do Projeto em Foco.
 */
export const hasUsefulProjectContext = (c: ProjectContext): boolean => {
  const keys: (keyof ProjectContext)[] = [
    "appDoes",
    "audience",
    "problem",
    "promise",
    "mainAction",
  ];
  return keys.some((k) => {
    const v = c[k];
    return typeof v === "string" && v.trim().length > 0;
  });
};

/**
 * Mescla preservando campos preenchidos: valores não-vazios de `incoming`
 * substituem `current`; valores vazios de `incoming` NÃO apagam campos
 * preenchidos em `current`. Não cria dados fictícios.
 */
const mergePreservingFilled = (
  current: ProjectContext,
  incoming: ProjectContext,
): ProjectContext => {
  const out: ProjectContext = { ...current };
  (Object.keys(incoming) as (keyof ProjectContext)[]).forEach((k) => {
    const v = incoming[k];
    if (typeof v === "string" && v.trim().length > 0) {
      (out as Record<string, string>)[k] = v;
    }
  });
  return out;
};

/**
 * "Meus Apps em Construção" — fonte real agora é Supabase (RLS por auth.uid()).
 * localStorage só é usado para:
 *  - cache do id do app ativo: `fabrica_apps_active_project_id`
 *  - migração dos projetos antigos: `fabrica_apps_projects`
 *  - migração do contexto temporário: `fabrica_apps_project_context`
 */

export type AppProjectStatus =
  | "ideia"
  | "planejando"
  | "construindo"
  | "revisando"
  | "publicado"
  | "vendendo"
  | "escalando"
  | "pausado"
  | "arquivado";

export const APP_PROJECT_STATUSES: AppProjectStatus[] = [
  "ideia",
  "planejando",
  "construindo",
  "revisando",
  "publicado",
  "vendendo",
  "escalando",
  "pausado",
  "arquivado",
];

export type AppProject = {
  id: string;
  name: string;
  status: AppProjectStatus;
  currentModuleId: string | null;
  completedModuleIds: string[];
  context: ProjectContext;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SavedPrompt = {
  id: string;
  projectId: string;
  moduleId: string | null;
  moduleTitle: string | null;
  promptType: string;
  title: string | null;
  promptText: string;
  source: string;
  createdAt: string;
};

const PROJECTS_KEY = "fabrica_apps_projects";
const ACTIVE_KEY = "fabrica_apps_active_project_id";
const LOCAL_CONTEXT_KEY = "fabrica_apps_project_context";
const LOCAL_CONTEXT_SAVED_MARKER_KEY = "fabrica_apps_project_context_saved_at";
const BLOCKED_UNMARKED_CONTEXT_NAMES = new Set([["jogo", "do", "amor"].join(" ")]);

type DbRow = Database["public"]["Tables"]["user_app_projects"]["Row"];
type DbInsert = Database["public"]["Tables"]["user_app_projects"]["Insert"];
type DbUpdate = Database["public"]["Tables"]["user_app_projects"]["Update"];
type DbPromptRow = Database["public"]["Tables"]["user_app_project_prompts"]["Row"];

const ynToBool = (v: YesNo) => v === "sim";
const boolToYn = (v: boolean): YesNo => (v ? "sim" : "nao");

const rowToProject = (r: DbRow): AppProject => ({
  id: r.id,
  name: r.app_name,
  status: (APP_PROJECT_STATUSES.includes(r.status as AppProjectStatus)
    ? (r.status as AppProjectStatus)
    : "ideia"),
  currentModuleId: r.current_module_id,
  completedModuleIds: r.completed_module_ids ?? [],
  archivedAt: r.archived_at,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
  context: {
    appName: r.app_name,
    appDoes: r.app_description ?? "",
    audience: r.target_audience ?? "",
    problem: r.problem_solved ?? "",
    promise: r.main_promise ?? "",
    mainAction: r.main_user_action ?? "",
    productSold: r.product_or_service ?? "",
    pricingModel: r.pricing_model ?? "",
    needsLogin: boolToYn(r.needs_login),
    needsDatabase: boolToYn(r.needs_database),
    needsPaidArea: boolToYn(r.needs_paid_area),
    needsAdmin: boolToYn(r.needs_admin),
    needsCheckout: boolToYn(r.needs_checkout),
    visualStyle: r.visual_style ?? "",
    notes: r.notes ?? "",
  },
});

const contextToColumns = (c: ProjectContext) => ({
  app_name: (c.appName || "").trim() || "Meu app",
  app_description: c.appDoes?.trim() ? c.appDoes : null,
  target_audience: c.audience?.trim() ? c.audience : null,
  problem_solved: c.problem?.trim() ? c.problem : null,
  main_promise: c.promise?.trim() ? c.promise : null,
  main_user_action: c.mainAction?.trim() ? c.mainAction : null,
  product_or_service: c.productSold?.trim() ? c.productSold : null,
  pricing_model: c.pricingModel?.trim() ? c.pricingModel : null,
  needs_login: ynToBool(c.needsLogin),
  needs_database: ynToBool(c.needsDatabase),
  needs_paid_area: ynToBool(c.needsPaidArea),
  needs_admin: ynToBool(c.needsAdmin),
  needs_checkout: ynToBool(c.needsCheckout),
  visual_style: c.visualStyle?.trim() ? c.visualStyle : null,
  notes: c.notes?.trim() ? c.notes : null,
});

const readActiveId = (): string | null => {
  try {
    return localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
};
const writeActiveId = (id: string | null) => {
  try {
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else localStorage.removeItem(ACTIVE_KEY);
  } catch {
    /* ignore */
  }
};

const readLegacyProjects = (): unknown[] => {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
const readLocalContext = (): ProjectContext | null => {
  try {
    const raw = localStorage.getItem(LOCAL_CONTEXT_KEY);
    if (!raw) return null;
    const hasSavedMarker = Boolean(localStorage.getItem(LOCAL_CONTEXT_SAVED_MARKER_KEY));
    const parsed = JSON.parse(raw);
    const merged = { ...EMPTY_PROJECT_CONTEXT, ...parsed } as ProjectContext;
    const hasAny = Object.values(merged).some(
      (v) => typeof v === "string" && v.trim().length > 0,
    );
    if (!hasSavedMarker && BLOCKED_UNMARKED_CONTEXT_NAMES.has(merged.appName.trim().toLowerCase())) {
      return null;
    }
    return hasAny ? merged : null;
  } catch {
    return null;
  }
};

const sortProjects = (list: AppProject[]) =>
  [...list].sort((a, b) => {
    const aArch = a.archivedAt || a.status === "arquivado" ? 1 : 0;
    const bArch = b.archivedAt || b.status === "arquivado" ? 1 : 0;
    if (aArch !== bArch) return aArch - bArch;
    const av = new Date(a.updatedAt).getTime();
    const bv = new Date(b.updatedAt).getTime();
    return bv - av;
  });

export const pickAutoActive = (list: AppProject[]): AppProject | null => {
  if (!list.length) return null;
  const active = list.filter((p) => !p.archivedAt && p.status !== "arquivado");
  const pool = active.length ? active : list;
  const ts = (p: AppProject) => {
    const u = Date.parse(p.updatedAt || "");
    if (!Number.isNaN(u)) return u;
    const c = Date.parse(p.createdAt || "");
    return Number.isNaN(c) ? 0 : c;
  };
  return [...pool].sort((a, b) => ts(b) - ts(a))[0] ?? pool[0] ?? null;
};

type Ctx = {
  projects: AppProject[];
  activeId: string | null;
  activeProject: AppProject | null;
  loading: boolean;
  error: string | null;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  refreshProjects: () => Promise<void>;
  createProject: (input: { name: string; context?: ProjectContext }) => Promise<AppProject | null>;
  selectProject: (id: string) => void;
  duplicateProject: (id: string) => Promise<AppProject | null>;
  deleteProject: (id: string) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
  updateProject: (
    id: string,
    patch: Partial<Pick<AppProject, "name" | "status" | "currentModuleId">> & {
      context?: ProjectContext;
    },
  ) => Promise<void>;
  saveActiveFromCurrent: () => boolean;
  saveContextToActiveProject: (context: ProjectContext) => Promise<boolean>;
  createProjectFromContext: (context: ProjectContext, name?: string) => Promise<AppProject | null>;
  setCurrentModule: (moduleId: string) => void;
  markModuleDone: (moduleId: string) => void;
  savePromptToActiveProject: (payload: {
    promptType: string;
    promptText: string;
    source: string;
    moduleId?: string | null;
    moduleTitle?: string | null;
    title?: string | null;
  }) => Promise<SavedPrompt | null>;
  listPrompts: (projectId: string) => Promise<SavedPrompt[]>;
  deletePrompt: (promptId: string) => Promise<void>;
  // Migration helpers
  hasLocalProjectsToImport: boolean;
  hasLocalContextToImport: boolean;
  importLocalProjects: () => Promise<number>;
  createProjectFromLocalContext: () => Promise<AppProject | null>;
};

const AppProjectsContext = createContext<Ctx | null>(null);

export const AppProjectsProvider = ({ children }: { children: ReactNode }) => {
  const { context, setRuntimeContext, restoreTemporaryContext } = useProjectContext();
  const [userId, setUserId] = useState<string | null>(null);
  const [projects, setProjects] = useState<AppProject[]>([]);
  const [activeId, setActiveIdState] = useState<string | null>(readActiveId());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [hasLocalProjectsToImport, setHasLocalProjectsToImport] = useState(false);
  const [hasLocalContextToImport, setHasLocalContextToImport] = useState(false);

  const lastModuleSavedRef = useRef<{ id: string; mod: string } | null>(null);

  // Mantém sempre o último contexto vivo do useProjectContext para que a
  // mesclagem segura saiba quais campos já estão preenchidos antes de
  // aplicar um contexto vindo de um projeto.
  const liveContextRef = useRef<ProjectContext>(context);
  useEffect(() => {
    liveContextRef.current = context;
  }, [context]);

  /**
   * Aplica o contexto de um projeto preservando dados já preenchidos.
   * - Se o contexto do projeto tiver dados úteis, ele é aplicado integralmente
   *   (o projeto "dono" do contexto manda).
   * - Se vier praticamente vazio, mesclamos: campos preenchidos do projeto
   *   substituem; campos vazios NÃO apagam o que já estava em memória.
   * Isso evita que abrir/trocar para um projeto sem contexto faça os prompts
   * voltarem ao modo genérico.
   */
  const applyProjectContextSafely = useCallback(
    (incoming: ProjectContext) => {
      if (hasUsefulProjectContext(incoming)) {
        setRuntimeContext(incoming);
        return;
      }
      const merged = mergePreservingFilled(liveContextRef.current, incoming);
      setRuntimeContext(merged);
    },
    [setRuntimeContext],
  );

  // Auth bootstrap
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const setActiveId = useCallback((id: string | null) => {
    setActiveIdState(id);
    writeActiveId(id);
  }, []);

  const fetchProjects = useCallback(async (uid: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("user_app_projects")
        .select("*")
        .eq("user_id", uid);
      if (err) throw err;
      const list = sortProjects((data ?? []).map(rowToProject));
      setProjects(list);
      // Active id reconciliation
      const aid = readActiveId();
      const valid = aid ? list.find((p) => p.id === aid) : null;
      if (valid) {
        applyProjectContextSafely(valid.context);
      } else if (aid) {
        setActiveId(null);
        restoreTemporaryContext();
      } else {
        restoreTemporaryContext();
      }
      // migration flags
      setHasLocalProjectsToImport(list.length === 0 && readLegacyProjects().length > 0);
      setHasLocalContextToImport(list.length === 0 && readLocalContext() !== null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar seus apps.");
    } finally {
      setLoading(false);
    }
  }, [setRuntimeContext, restoreTemporaryContext, setActiveId]);

  useEffect(() => {
    if (!userId) {
      setProjects([]);
      setHasLocalProjectsToImport(readLegacyProjects().length > 0);
      setHasLocalContextToImport(readLocalContext() !== null);
      return;
    }
    void fetchProjects(userId);
  }, [userId, fetchProjects]);

  const refreshProjects = useCallback(async () => {
    if (userId) await fetchProjects(userId);
  }, [userId, fetchProjects]);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeId) ?? null,
    [projects, activeId],
  );

  const upsertLocal = useCallback((p: AppProject) => {
    setProjects((prev) => {
      const exists = prev.some((x) => x.id === p.id);
      const next = exists ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev];
      return sortProjects(next);
    });
  }, []);

  const removeLocal = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const createProject = useCallback<Ctx["createProject"]>(
    async ({ name, context: initialContext }) => {
      if (!userId) {
        setError("Faça login para salvar seus apps.");
        return null;
      }
      const ctx: ProjectContext = {
        ...EMPTY_PROJECT_CONTEXT,
        ...(initialContext ?? {}),
        appName: (name?.trim() || initialContext?.appName?.trim() || "Meu app"),
      };
      const insert: DbInsert = {
        user_id: userId,
        ...contextToColumns(ctx),
        status: "ideia",
        last_opened_at: new Date().toISOString(),
      };
      const { data, error: err } = await supabase
        .from("user_app_projects")
        .insert(insert)
        .select("*")
        .single();
      if (err || !data) {
        setError(err?.message || "Não foi possível criar o app.");
        return null;
      }
      const proj = rowToProject(data);
      upsertLocal(proj);
      setActiveId(proj.id);
      applyProjectContextSafely(proj.context);
      return proj;
    },
    [userId, upsertLocal, setActiveId, setRuntimeContext],
  );

  const createProjectFromContext = useCallback<Ctx["createProjectFromContext"]>(
    async (ctx, name) => createProject({ name: name ?? ctx.appName, context: ctx }),
    [createProject],
  );

  const selectProject = useCallback(
    (id: string) => {
      const proj = projects.find((p) => p.id === id);
      if (!proj) return;
      setActiveId(id);
      applyProjectContextSafely(proj.context);
      // bump last_opened_at (fire and forget)
      if (userId) {
        void supabase
          .from("user_app_projects")
          .update({ last_opened_at: new Date().toISOString() })
          .eq("id", id)
          .eq("user_id", userId);
      }
    },
    [projects, setActiveId, setRuntimeContext, userId],
  );

  const updateProject = useCallback<Ctx["updateProject"]>(
    async (id, patch) => {
      if (!userId) return;
      const current = projects.find((p) => p.id === id);
      if (!current) return;
      const update: DbUpdate = {};
      if (patch.name !== undefined) update.app_name = patch.name.trim() || "Meu app";
      if (patch.status !== undefined) update.status = patch.status;
      if (patch.currentModuleId !== undefined) update.current_module_id = patch.currentModuleId;
      if (patch.context !== undefined) Object.assign(update, contextToColumns(patch.context));
      const { data, error: err } = await supabase
        .from("user_app_projects")
        .update(update)
        .eq("id", id)
        .eq("user_id", userId)
        .select("*")
        .single();
      if (err || !data) {
        setError(err?.message || "Não foi possível salvar o app.");
        return;
      }
      const proj = rowToProject(data);
      upsertLocal(proj);
      if (id === activeId && patch.context !== undefined) applyProjectContextSafely(proj.context);
    },
    [userId, projects, activeId, upsertLocal, setRuntimeContext],
  );

  const saveContextToActiveProject = useCallback<Ctx["saveContextToActiveProject"]>(
    async (ctx) => {
      if (!activeId || !userId) return false;
      const { data, error: err } = await supabase
        .from("user_app_projects")
        .update({ ...contextToColumns(ctx), last_opened_at: new Date().toISOString() })
        .eq("id", activeId)
        .eq("user_id", userId)
        .select("*")
        .single();
      if (err || !data) {
        setError(err?.message || "Não foi possível salvar o contexto neste app.");
        return false;
      }
      const proj = rowToProject(data);
      upsertLocal(proj);
      applyProjectContextSafely(proj.context);
      return true;
    },
    [activeId, userId, upsertLocal, setRuntimeContext],
  );

  // Legacy alias kept for compat (uses currently loaded context from provider).
  const saveActiveFromCurrent = useCallback(() => {
    if (!activeId) return false;
    void saveContextToActiveProject(context);
    return true;
  }, [activeId, context, saveContextToActiveProject]);

  const duplicateProject = useCallback<Ctx["duplicateProject"]>(
    async (id) => {
      if (!userId) return null;
      const src = projects.find((p) => p.id === id);
      if (!src) return null;
      const copyName = `${src.name} — cópia`;
      const insert: DbInsert = {
        user_id: userId,
        ...contextToColumns({ ...src.context, appName: copyName }),
        status: src.status,
        current_module_id: src.currentModuleId,
        completed_module_ids: src.completedModuleIds,
        last_opened_at: new Date().toISOString(),
      };
      const { data, error: err } = await supabase
        .from("user_app_projects")
        .insert(insert)
        .select("*")
        .single();
      if (err || !data) {
        setError(err?.message || "Não foi possível duplicar.");
        return null;
      }
      const proj = rowToProject(data);
      upsertLocal(proj);
      return proj;
    },
    [userId, projects, upsertLocal],
  );

  const deleteProject = useCallback<Ctx["deleteProject"]>(
    async (id) => {
      if (!userId) return;
      const { error: err } = await supabase
        .from("user_app_projects")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (err) {
        setError(err.message);
        return;
      }
      removeLocal(id);
      if (activeId === id) {
        const remaining = projects.filter((p) => p.id !== id);
        const next = pickAutoActive(remaining);
        if (next) {
          setActiveId(next.id);
          applyProjectContextSafely(next.context);
        } else {
          setActiveId(null);
          restoreTemporaryContext();
        }
      }
    },
    [userId, activeId, projects, removeLocal, setActiveId, setRuntimeContext, restoreTemporaryContext],
  );

  const archiveProject = useCallback<Ctx["archiveProject"]>(
    async (id) => {
      if (!userId) return;
      const { data, error: err } = await supabase
        .from("user_app_projects")
        .update({ status: "arquivado", archived_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", userId)
        .select("*")
        .single();
      if (err || !data) {
        setError(err?.message || "Não foi possível arquivar.");
        return;
      }
      upsertLocal(rowToProject(data));
    },
    [userId, upsertLocal],
  );

  const setCurrentModule = useCallback(
    (moduleId: string) => {
      if (!activeId || !userId) return;
      // dedupe: skip if same as last persisted module for this project
      const last = lastModuleSavedRef.current;
      if (last && last.id === activeId && last.mod === moduleId) return;
      const current = projects.find((p) => p.id === activeId);
      if (current && current.currentModuleId === moduleId) {
        lastModuleSavedRef.current = { id: activeId, mod: moduleId };
        return;
      }
      lastModuleSavedRef.current = { id: activeId, mod: moduleId };
      // optimistic local update
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeId ? { ...p, currentModuleId: moduleId } : p,
        ),
      );
      void supabase
        .from("user_app_projects")
        .update({
          current_module_id: moduleId,
          last_opened_at: new Date().toISOString(),
        })
        .eq("id", activeId)
        .eq("user_id", userId);
    },
    [activeId, userId, projects],
  );

  const markModuleDone = useCallback(
    (moduleId: string) => {
      if (!activeId || !userId) return;
      const current = projects.find((p) => p.id === activeId);
      if (!current) return;
      if (current.completedModuleIds.includes(moduleId)) return;
      const next = [...current.completedModuleIds, moduleId];
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeId ? { ...p, completedModuleIds: next } : p,
        ),
      );
      void supabase
        .from("user_app_projects")
        .update({ completed_module_ids: next })
        .eq("id", activeId)
        .eq("user_id", userId);
    },
    [activeId, userId, projects],
  );

  const savePromptToActiveProject = useCallback<Ctx["savePromptToActiveProject"]>(
    async (payload) => {
      if (!activeId || !userId) return null;
      const { data, error: err } = await supabase
        .from("user_app_project_prompts")
        .insert({
          user_id: userId,
          project_id: activeId,
          prompt_type: payload.promptType,
          prompt_text: payload.promptText,
          source: payload.source,
          module_id: payload.moduleId ?? null,
          module_title: payload.moduleTitle ?? null,
          title: payload.title ?? null,
        })
        .select("*")
        .single();
      if (err || !data) {
        setError(err?.message || "Não foi possível salvar este prompt.");
        return null;
      }
      const row = data as DbPromptRow;
      return {
        id: row.id,
        projectId: row.project_id,
        moduleId: row.module_id,
        moduleTitle: row.module_title,
        promptType: row.prompt_type,
        title: row.title,
        promptText: row.prompt_text,
        source: row.source,
        createdAt: row.created_at,
      };
    },
    [activeId, userId],
  );

  const listPrompts = useCallback<Ctx["listPrompts"]>(
    async (projectId) => {
      if (!userId) return [];
      const { data, error: err } = await supabase
        .from("user_app_project_prompts")
        .select("*")
        .eq("user_id", userId)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (err || !data) return [];
      return data.map((row) => ({
        id: row.id,
        projectId: row.project_id,
        moduleId: row.module_id,
        moduleTitle: row.module_title,
        promptType: row.prompt_type,
        title: row.title,
        promptText: row.prompt_text,
        source: row.source,
        createdAt: row.created_at,
      }));
    },
    [userId],
  );

  const deletePrompt = useCallback<Ctx["deletePrompt"]>(
    async (promptId) => {
      if (!userId) return;
      await supabase
        .from("user_app_project_prompts")
        .delete()
        .eq("id", promptId)
        .eq("user_id", userId);
    },
    [userId],
  );

  const importLocalProjects = useCallback<Ctx["importLocalProjects"]>(async () => {
    if (!userId) return 0;
    const legacy = readLegacyProjects();
    if (legacy.length === 0) return 0;
    const inserts: DbInsert[] = legacy.map((raw) => {
      const r = (raw ?? {}) as {
        name?: string;
        status?: string;
        currentModuleId?: string | null;
        context?: Partial<ProjectContext>;
        createdAt?: string;
        updatedAt?: string;
      };
      const ctx: ProjectContext = {
        ...EMPTY_PROJECT_CONTEXT,
        ...(r.context ?? {}),
        appName: r.name || r.context?.appName || "Meu app",
      };
      return {
        user_id: userId,
        ...contextToColumns(ctx),
        status: APP_PROJECT_STATUSES.includes(r.status as AppProjectStatus)
          ? (r.status as AppProjectStatus)
          : "ideia",
        current_module_id: r.currentModuleId ?? null,
        last_opened_at: new Date().toISOString(),
      };
    });
    const { data, error: err } = await supabase
      .from("user_app_projects")
      .insert(inserts)
      .select("*");
    if (err || !data) {
      setError(err?.message || "Não foi possível importar os apps locais.");
      return 0;
    }
    const projs = data.map(rowToProject);
    setProjects((prev) => sortProjects([...projs, ...prev]));
    // try to map old active id by name to first imported
    const oldActiveId = readActiveId();
    const match =
      legacy.findIndex((r) => (r as { id?: string })?.id === oldActiveId) ?? -1;
    if (match >= 0 && projs[match]) {
      setActiveId(projs[match].id);
      applyProjectContextSafely(projs[match].context);
    }
    setHasLocalProjectsToImport(false);
    return projs.length;
  }, [userId, setActiveId, setRuntimeContext]);

  const createProjectFromLocalContext = useCallback<Ctx["createProjectFromLocalContext"]>(async () => {
    const ctx = readLocalContext();
    if (!ctx) return null;
    const proj = await createProject({
      name: ctx.appName?.trim() || "Meu app em construção",
      context: ctx,
    });
    if (proj) setHasLocalContextToImport(false);
    return proj;
  }, [createProject]);

  const value = useMemo<Ctx>(
    () => ({
      projects,
      activeId,
      activeProject,
      loading,
      error,
      isDrawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      refreshProjects,
      createProject,
      selectProject,
      duplicateProject,
      deleteProject,
      archiveProject,
      updateProject,
      saveActiveFromCurrent,
      saveContextToActiveProject,
      createProjectFromContext,
      setCurrentModule,
      markModuleDone,
      savePromptToActiveProject,
      listPrompts,
      deletePrompt,
      hasLocalProjectsToImport,
      hasLocalContextToImport,
      importLocalProjects,
      createProjectFromLocalContext,
    }),
    [
      projects,
      activeId,
      activeProject,
      loading,
      error,
      isDrawerOpen,
      refreshProjects,
      createProject,
      selectProject,
      duplicateProject,
      deleteProject,
      archiveProject,
      updateProject,
      saveActiveFromCurrent,
      saveContextToActiveProject,
      createProjectFromContext,
      setCurrentModule,
      markModuleDone,
      savePromptToActiveProject,
      listPrompts,
      deletePrompt,
      hasLocalProjectsToImport,
      hasLocalContextToImport,
      importLocalProjects,
      createProjectFromLocalContext,
    ],
  );

  return (
    <AppProjectsContext.Provider value={value}>{children}</AppProjectsContext.Provider>
  );
};

export const useAppProjects = (): Ctx => {
  const ctx = useContext(AppProjectsContext);
  if (!ctx) {
    return {
      projects: [],
      activeId: null,
      activeProject: null,
      loading: false,
      error: null,
      isDrawerOpen: false,
      openDrawer: () => {},
      closeDrawer: () => {},
      refreshProjects: async () => {},
      createProject: async () => null,
      selectProject: () => {},
      duplicateProject: async () => null,
      deleteProject: async () => {},
      archiveProject: async () => {},
      updateProject: async () => {},
      saveActiveFromCurrent: () => false,
      saveContextToActiveProject: async () => false,
      createProjectFromContext: async () => null,
      setCurrentModule: () => {},
      markModuleDone: () => {},
      savePromptToActiveProject: async () => null,
      listPrompts: async () => [],
      deletePrompt: async () => {},
      hasLocalProjectsToImport: false,
      hasLocalContextToImport: false,
      importLocalProjects: async () => 0,
      createProjectFromLocalContext: async () => null,
    };
  }
  return ctx;
};

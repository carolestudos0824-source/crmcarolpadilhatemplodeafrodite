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
import {
  EMPTY_PROJECT_CONTEXT,
  useProjectContext,
  type ProjectContext,
} from "@/hooks/useProjectContext";

/**
 * "Meus Apps em Construção" — permite gerenciar múltiplos projetos de app.
 * Persistido apenas no navegador (localStorage). Não toca em banco/auth.
 *
 * Cada projeto carrega seu próprio ProjectContext. Ao selecionar, o contexto
 * do projeto vira o contexto ativo no useProjectContext. Para sincronizar de
 * volta, use saveActiveFromCurrent().
 */

export type AppProjectStatus =
  | "ideia"
  | "planejando"
  | "construindo"
  | "revisando"
  | "publicado"
  | "vendendo"
  | "pausado";

export const APP_PROJECT_STATUSES: AppProjectStatus[] = [
  "ideia",
  "planejando",
  "construindo",
  "revisando",
  "publicado",
  "vendendo",
  "pausado",
];

export type AppProject = {
  id: string;
  name: string;
  status: AppProjectStatus;
  currentModuleId: string | null;
  context: ProjectContext;
  createdAt: string;
  updatedAt: string;
};

const PROJECTS_KEY = "fabrica_apps_projects";
const ACTIVE_KEY = "fabrica_apps_active_project_id";

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const readProjects = (): AppProject[] => {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((p) => ({
      ...p,
      context: { ...EMPTY_PROJECT_CONTEXT, ...(p?.context ?? {}) },
    }));
  } catch {
    return [];
  }
};

const writeProjects = (projects: AppProject[]) => {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch {
    /* ignore quota errors */
  }
};

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

type Ctx = {
  projects: AppProject[];
  activeId: string | null;
  activeProject: AppProject | null;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  createProject: (input: { name: string; context?: ProjectContext }) => AppProject;
  selectProject: (id: string) => void;
  duplicateProject: (id: string) => AppProject | null;
  deleteProject: (id: string) => void;
  updateProject: (id: string, patch: Partial<Omit<AppProject, "id" | "createdAt">>) => void;
  saveActiveFromCurrent: () => boolean;
  setCurrentModule: (moduleId: string) => void;
};

const AppProjectsContext = createContext<Ctx | null>(null);

export const AppProjectsProvider = ({ children }: { children: ReactNode }) => {
  const { context, setContext } = useProjectContext();
  const [projects, setProjects] = useState<AppProject[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const bootstrapped = useRef(false);

  // Bootstrap once
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    const list = readProjects();
    const aid = readActiveId();
    setProjects(list);
    if (aid && list.some((p) => p.id === aid)) {
      setActiveId(aid);
      const proj = list.find((p) => p.id === aid);
      if (proj) setContext(proj.context);
    }
  }, [setContext]);

  const persist = useCallback((next: AppProject[]) => {
    setProjects(next);
    writeProjects(next);
  }, []);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeId) ?? null,
    [projects, activeId],
  );

  const createProject = useCallback<Ctx["createProject"]>(
    ({ name, context: initialContext }) => {
      const now = new Date().toISOString();
      const proj: AppProject = {
        id: newId(),
        name: name.trim() || "Meu app",
        status: "ideia",
        currentModuleId: null,
        context: {
          ...EMPTY_PROJECT_CONTEXT,
          ...(initialContext ?? {}),
          appName: name.trim() || initialContext?.appName || "Meu app",
        },
        createdAt: now,
        updatedAt: now,
      };
      const next = [proj, ...projects];
      persist(next);
      setActiveId(proj.id);
      writeActiveId(proj.id);
      setContext(proj.context);
      return proj;
    },
    [projects, persist, setContext],
  );

  const selectProject = useCallback(
    (id: string) => {
      const proj = projects.find((p) => p.id === id);
      if (!proj) return;
      setActiveId(id);
      writeActiveId(id);
      setContext(proj.context);
    },
    [projects, setContext],
  );

  const updateProject = useCallback<Ctx["updateProject"]>(
    (id, patch) => {
      const next = projects.map((p) =>
        p.id === id
          ? { ...p, ...patch, updatedAt: new Date().toISOString() }
          : p,
      );
      persist(next);
    },
    [projects, persist],
  );

  const duplicateProject = useCallback(
    (id: string): AppProject | null => {
      const src = projects.find((p) => p.id === id);
      if (!src) return null;
      const now = new Date().toISOString();
      const copy: AppProject = {
        ...src,
        id: newId(),
        name: `${src.name} (cópia)`,
        context: { ...src.context, appName: `${src.context.appName} (cópia)` },
        createdAt: now,
        updatedAt: now,
      };
      persist([copy, ...projects]);
      return copy;
    },
    [projects, persist],
  );

  const deleteProject = useCallback(
    (id: string) => {
      const next = projects.filter((p) => p.id !== id);
      persist(next);
      if (activeId === id) {
        setActiveId(null);
        writeActiveId(null);
      }
    },
    [projects, persist, activeId],
  );

  const saveActiveFromCurrent = useCallback(() => {
    if (!activeId) return false;
    const next = projects.map((p) =>
      p.id === activeId
        ? {
            ...p,
            context,
            name: context.appName.trim() || p.name,
            updatedAt: new Date().toISOString(),
          }
        : p,
    );
    persist(next);
    return true;
  }, [activeId, projects, context, persist]);

  const setCurrentModule = useCallback(
    (moduleId: string) => {
      if (!activeId) return;
      const next = projects.map((p) =>
        p.id === activeId
          ? { ...p, currentModuleId: moduleId, updatedAt: new Date().toISOString() }
          : p,
      );
      persist(next);
    },
    [activeId, projects, persist],
  );

  const value = useMemo<Ctx>(
    () => ({
      projects,
      activeId,
      activeProject,
      isDrawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      createProject,
      selectProject,
      duplicateProject,
      deleteProject,
      updateProject,
      saveActiveFromCurrent,
      setCurrentModule,
    }),
    [
      projects,
      activeId,
      activeProject,
      isDrawerOpen,
      createProject,
      selectProject,
      duplicateProject,
      deleteProject,
      updateProject,
      saveActiveFromCurrent,
      setCurrentModule,
    ],
  );

  return (
    <AppProjectsContext.Provider value={value}>{children}</AppProjectsContext.Provider>
  );
};

export const useAppProjects = (): Ctx => {
  const ctx = useContext(AppProjectsContext);
  if (!ctx) {
    // Fallback seguro: permite uso fora do provider sem quebrar.
    return {
      projects: [],
      activeId: null,
      activeProject: null,
      isDrawerOpen: false,
      openDrawer: () => {},
      closeDrawer: () => {},
      createProject: () => ({
        id: "",
        name: "",
        status: "ideia",
        currentModuleId: null,
        context: EMPTY_PROJECT_CONTEXT,
        createdAt: "",
        updatedAt: "",
      }),
      selectProject: () => {},
      duplicateProject: () => null,
      deleteProject: () => {},
      updateProject: () => {},
      saveActiveFromCurrent: () => false,
      setCurrentModule: () => {},
    };
  }
  return ctx;
};

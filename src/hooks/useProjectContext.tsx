import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * "Contexto do meu app" — informações que a pessoa preenche UMA vez para que
 * todo prompt copiado (Lovable ou Agente) saia enriquecido e funcione para o
 * app DELA, não para a Fábrica de Apps.
 *
 * Persistido apenas no navegador (localStorage). Não toca em banco, RLS, RPCs
 * ou auth. Não interfere em useUserProgress, vendas, admin ou segurança.
 */

export type YesNo = "sim" | "nao" | "";

export type ProjectContext = {
  appName: string;
  appDoes: string;
  audience: string;
  problem: string;
  promise: string;
  mainAction: string;
  productSold: string;
  pricingModel: string;
  needsLogin: YesNo;
  needsDatabase: YesNo;
  needsPaidArea: YesNo;
  needsAdmin: YesNo;
  needsCheckout: YesNo;
  visualStyle: string;
  notes: string;
};

export const EMPTY_PROJECT_CONTEXT: ProjectContext = {
  appName: "",
  appDoes: "",
  audience: "",
  problem: "",
  promise: "",
  mainAction: "",
  productSold: "",
  pricingModel: "",
  needsLogin: "",
  needsDatabase: "",
  needsPaidArea: "",
  needsAdmin: "",
  needsCheckout: "",
  visualStyle: "",
  notes: "",
};

const STORAGE_KEY = "fabrica_apps_project_context";
const LEGACY_STORAGE_KEY = "fabrica_project_context";
const SAVED_MARKER_KEY = "fabrica_apps_project_context_saved_at";
const TEMPORARY_CONTEXT_KEYS = [
  STORAGE_KEY,
  LEGACY_STORAGE_KEY,
  SAVED_MARKER_KEY,
  "fabrica_apps_project_context_draft",
  "fabrica_project_context_draft",
  "fabrica_apps_temporary_project_context",
  "fabrica_apps_saved_context",
  "fabrica_apps_app_context",
];

const DEMO_APP_NAMES = new Set(["jogo do amor"]);

type Ctx = {
  context: ProjectContext;
  setContext: (next: ProjectContext) => void;
  setRuntimeContext: (next: ProjectContext) => void;
  clearTemporaryContext: () => void;
  restoreTemporaryContext: () => ProjectContext;
  isFilled: boolean;
  openEditor: () => void;
  closeEditor: () => void;
  isEditorOpen: boolean;
};

const ProjectContextContext = createContext<Ctx | null>(null);

const normalizeContext = (value: unknown): ProjectContext => {
  const raw = (value ?? {}) as Partial<Record<keyof ProjectContext, unknown>>;
  return {
    appName: typeof raw.appName === "string" ? raw.appName : "",
    appDoes: typeof raw.appDoes === "string" ? raw.appDoes : "",
    audience: typeof raw.audience === "string" ? raw.audience : "",
    problem: typeof raw.problem === "string" ? raw.problem : "",
    promise: typeof raw.promise === "string" ? raw.promise : "",
    mainAction: typeof raw.mainAction === "string" ? raw.mainAction : "",
    productSold: typeof raw.productSold === "string" ? raw.productSold : "",
    pricingModel: typeof raw.pricingModel === "string" ? raw.pricingModel : "",
    needsLogin: raw.needsLogin === "sim" || raw.needsLogin === "nao" ? raw.needsLogin : "",
    needsDatabase: raw.needsDatabase === "sim" || raw.needsDatabase === "nao" ? raw.needsDatabase : "",
    needsPaidArea: raw.needsPaidArea === "sim" || raw.needsPaidArea === "nao" ? raw.needsPaidArea : "",
    needsAdmin: raw.needsAdmin === "sim" || raw.needsAdmin === "nao" ? raw.needsAdmin : "",
    needsCheckout: raw.needsCheckout === "sim" || raw.needsCheckout === "nao" ? raw.needsCheckout : "",
    visualStyle: typeof raw.visualStyle === "string" ? raw.visualStyle : "",
    notes: typeof raw.notes === "string" ? raw.notes : "",
  };
};

const hasAnyMeaningful = (c: ProjectContext) =>
  Object.values(c).some((v) => typeof v === "string" && v.trim().length > 0);

const isBlockedDemoContext = (c: ProjectContext, hasSavedMarker: boolean) => {
  const appName = c.appName.trim().toLowerCase();
  return !hasSavedMarker && DEMO_APP_NAMES.has(appName);
};

const parseStoredContext = (raw: string | null, hasSavedMarker: boolean) => {
  if (!raw) return null;
  try {
    const parsed = normalizeContext(JSON.parse(raw));
    if (!hasAnyMeaningful(parsed)) return null;
    if (isBlockedDemoContext(parsed, hasSavedMarker)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const readStored = (): ProjectContext => {
  try {
    const hasSavedMarker = Boolean(localStorage.getItem(SAVED_MARKER_KEY));
    const current = parseStoredContext(localStorage.getItem(STORAGE_KEY), hasSavedMarker);
    if (current) return current;

    const legacy = parseStoredContext(localStorage.getItem(LEGACY_STORAGE_KEY), hasSavedMarker);
    if (legacy) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
      localStorage.setItem(SAVED_MARKER_KEY, new Date().toISOString());
      return legacy;
    }

    return EMPTY_PROJECT_CONTEXT;
  } catch {
    return EMPTY_PROJECT_CONTEXT;
  }
};

const removeTemporaryContextStorage = () => {
  try {
    TEMPORARY_CONTEXT_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    /* ignore storage errors */
  }
};

export const ProjectContextProvider = ({ children }: { children: ReactNode }) => {
  const [context, setContextState] = useState<ProjectContext>(EMPTY_PROJECT_CONTEXT);
  const [isEditorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    setContextState(readStored());
  }, []);

  const setContext = useCallback((next: ProjectContext) => {
    setContextState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      localStorage.setItem(SAVED_MARKER_KEY, new Date().toISOString());
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      /* ignore quota errors */
    }
  }, []);

  const setRuntimeContext = useCallback((next: ProjectContext) => {
    setContextState(next);
  }, []);

  const clearTemporaryContext = useCallback(() => {
    removeTemporaryContextStorage();
    setContextState(EMPTY_PROJECT_CONTEXT);
  }, []);

  const restoreTemporaryContext = useCallback(() => {
    const next = readStored();
    setContextState(next);
    return next;
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      context,
      setContext,
      setRuntimeContext,
      clearTemporaryContext,
      restoreTemporaryContext,
      isFilled: hasAnyMeaningful(context),
      openEditor: () => setEditorOpen(true),
      closeEditor: () => setEditorOpen(false),
      isEditorOpen,
    }),
    [context, setContext, setRuntimeContext, clearTemporaryContext, restoreTemporaryContext, isEditorOpen],
  );

  return (
    <ProjectContextContext.Provider value={value}>
      {children}
    </ProjectContextContext.Provider>
  );
};

export const useProjectContext = () => {
  const ctx = useContext(ProjectContextContext);
  if (!ctx) {
    // Fallback seguro: permite uso fora do provider sem quebrar.
    return {
      context: EMPTY_PROJECT_CONTEXT,
      setContext: () => {},
      setRuntimeContext: () => {},
      clearTemporaryContext: () => {},
      restoreTemporaryContext: () => EMPTY_PROJECT_CONTEXT,
      isFilled: false,
      openEditor: () => {},
      closeEditor: () => {},
      isEditorOpen: false,
    } satisfies Ctx;
  }
  return ctx;
};

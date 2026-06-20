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

type Ctx = {
  context: ProjectContext;
  setContext: (next: ProjectContext) => void;
  isFilled: boolean;
  openEditor: () => void;
  closeEditor: () => void;
  isEditorOpen: boolean;
};

const ProjectContextContext = createContext<Ctx | null>(null);

const readStored = (): ProjectContext => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROJECT_CONTEXT;
    const parsed = JSON.parse(raw);
    return { ...EMPTY_PROJECT_CONTEXT, ...parsed };
  } catch {
    return EMPTY_PROJECT_CONTEXT;
  }
};

const hasAnyMeaningful = (c: ProjectContext) =>
  Boolean(
    c.appName.trim() ||
      c.appDoes.trim() ||
      c.audience.trim() ||
      c.problem.trim() ||
      c.promise.trim(),
  );

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
    } catch {
      /* ignore quota errors */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      context,
      setContext,
      isFilled: hasAnyMeaningful(context),
      openEditor: () => setEditorOpen(true),
      closeEditor: () => setEditorOpen(false),
      isEditorOpen,
    }),
    [context, setContext, isEditorOpen],
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
      isFilled: false,
      openEditor: () => {},
      closeEditor: () => {},
      isEditorOpen: false,
    } satisfies Ctx;
  }
  return ctx;
};

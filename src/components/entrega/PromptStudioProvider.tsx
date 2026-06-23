import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { PromptReviewDialog } from "./PromptReviewDialog";

export type PromptStudioOptions = {
  stepName: string;
  stepObjective?: string;
  command?: string;
  moduleId?: string;
  customPrompts?: { lovable: string; agent: string };
};

type Ctx = {
  openPromptStudio: (opts: PromptStudioOptions) => void;
  closePromptStudio: () => void;
};

const PromptStudioContext = createContext<Ctx | null>(null);

export function PromptStudioProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<PromptStudioOptions | null>(null);

  const openPromptStudio = useCallback((next: PromptStudioOptions) => {
    setOpts(next);
  }, []);
  const closePromptStudio = useCallback(() => setOpts(null), []);

  const value = useMemo(() => ({ openPromptStudio, closePromptStudio }), [openPromptStudio, closePromptStudio]);

  return (
    <PromptStudioContext.Provider value={value}>
      {children}
      {opts && (
        <PromptReviewDialog
          open
          onClose={closePromptStudio}
          stepName={opts.stepName}
          stepObjective={opts.stepObjective}
          command={opts.command}
          moduleId={opts.moduleId}
          customPrompts={opts.customPrompts}
        />
      )}
    </PromptStudioContext.Provider>
  );
}

export function usePromptStudio(): Ctx {
  const ctx = useContext(PromptStudioContext);
  if (ctx) return ctx;
  // Graceful no-op fallback so components that render outside provider (e.g. tests)
  // don't crash. Logs a warning so callers notice missing provider.
  return {
    openPromptStudio: () => {
      if (typeof console !== "undefined") {
        console.warn("[PromptStudio] openPromptStudio called outside <PromptStudioProvider/>.");
      }
    },
    closePromptStudio: () => {},
  };
}

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type AgentChatOpenArgs = {
  moduleKey?: string | null;
  stepKey?: string | null;
  /** Mensagem inicial sugerida no composer (não envia, apenas pré-preenche). */
  initialDraft?: string | null;
  /** Título visível ("Etapa: Definir o MVP") */
  stepTitle?: string | null;
};

type Ctx = {
  isOpen: boolean;
  args: AgentChatOpenArgs;
  open: (a?: AgentChatOpenArgs) => void;
  close: () => void;
};

const AgentChatCtx = createContext<Ctx | null>(null);

export const AgentChatProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setOpen] = useState(false);
  const [args, setArgs] = useState<AgentChatOpenArgs>({});

  const open = useCallback((a?: AgentChatOpenArgs) => {
    setArgs(a ?? {});
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo<Ctx>(() => ({ isOpen, args, open, close }), [isOpen, args, open, close]);
  return <AgentChatCtx.Provider value={value}>{children}</AgentChatCtx.Provider>;
};

export const useAgentChat = (): Ctx => {
  const ctx = useContext(AgentChatCtx);
  if (!ctx) throw new Error("useAgentChat must be used inside AgentChatProvider");
  return ctx;
};

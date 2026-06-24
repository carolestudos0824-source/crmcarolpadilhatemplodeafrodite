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
import { toast } from "sonner";
import { useAppProjects } from "@/hooks/useAppProjects";
import {
  loadProjectMessages,
  saveAsProjectDecision,
  sendAgentMessage,
  type AgentMessage,
} from "@/lib/agentChat";

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
  activeProjectId: string | null;
  selectedConversationId: string | null;
  messages: AgentMessage[];
  loadingHistory: boolean;
  sending: boolean;
  savingMessageId: string | null;
  applyingMessageId: string | null;
  appliedMessageIds: string[];
  input: string;
  setInput: (value: string) => void;
  open: (a?: AgentChatOpenArgs) => void;
  close: () => void;
  send: (text: string) => Promise<void>;
  saveDecision: (message: AgentMessage, title?: string | null) => Promise<void>;
  applySuggestion: (message: AgentMessage) => Promise<void>;
};

const AgentChatCtx = createContext<Ctx | null>(null);

export const AgentChatProvider = ({ children }: { children: ReactNode }) => {
  const { activeProject } = useAppProjects();
  const activeProjectId = activeProject?.id ?? null;
  const [isOpen, setOpen] = useState(false);
  const [args, setArgs] = useState<AgentChatOpenArgs>({});
  const [argsProjectId, setArgsProjectId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [messagesProjectId, setMessagesProjectId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [savingMessageId, setSavingMessageId] = useState<string | null>(null);
  const [applyingMessageId, setApplyingMessageId] = useState<string | null>(null);
  const [appliedMessageIds, setAppliedMessageIds] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const loadVersionRef = useRef(0);
  const activeProjectIdRef = useRef<string | null>(activeProjectId);
  const previousProjectIdRef = useRef<string | null>(activeProjectId);
  activeProjectIdRef.current = activeProjectId;

  const open = useCallback((a?: AgentChatOpenArgs) => {
    setArgs(a ?? {});
    setArgsProjectId(activeProjectIdRef.current);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    loadVersionRef.current += 1;
    const version = loadVersionRef.current;
    const projectChanged = previousProjectIdRef.current !== activeProjectId;
    previousProjectIdRef.current = activeProjectId;

    setMessages([]);
    setSelectedConversationId(null);
    setMessagesProjectId(activeProjectId);
    setSending(false);
    setSavingMessageId(null);

    if (projectChanged) {
      setArgs({});
      setArgsProjectId(activeProjectId);
      setInput("");
    }

    if (!isOpen || !activeProjectId) {
      setLoadingHistory(false);
      return;
    }

    setLoadingHistory(true);
    loadProjectMessages(activeProjectId)
      .then(({ conversationId, messages: loadedMessages }) => {
        if (loadVersionRef.current !== version || activeProjectIdRef.current !== activeProjectId) return;
        setSelectedConversationId(conversationId);
        setMessages(loadedMessages);
        setMessagesProjectId(activeProjectId);
      })
      .catch(() => {
        if (loadVersionRef.current !== version || activeProjectIdRef.current !== activeProjectId) return;
        setSelectedConversationId(null);
        setMessages([]);
      })
      .finally(() => {
        if (loadVersionRef.current === version && activeProjectIdRef.current === activeProjectId) {
          setLoadingHistory(false);
        }
      });
  }, [activeProjectId, isOpen]);

  const assertCurrentProject = useCallback((projectIdAtStart: string, versionAtStart: number) => {
    if (activeProjectIdRef.current !== projectIdAtStart || loadVersionRef.current !== versionAtStart) {
      throw new Error("project_changed");
    }
  }, []);

  const send = useCallback(
    async (text: string) => {
      const msg = text.trim();
      const projectIdAtStart = activeProjectIdRef.current;
      const versionAtStart = loadVersionRef.current;
      const isLoadingScope = loadingHistory || messagesProjectId !== projectIdAtStart;
      if (!msg || !projectIdAtStart || sending || isLoadingScope) return;

      const moduleKey = args.moduleKey ?? activeProject?.currentModuleId ?? null;
      const stepKey = args.stepKey ?? null;
      const optimisticUser: AgentMessage = {
        id: `optimistic-${Date.now()}`,
        role: "user",
        content: msg,
        created_at: new Date().toISOString(),
        module_key: moduleKey,
        step_key: stepKey,
      };

      setSending(true);
      setMessagesProjectId(projectIdAtStart);
      setMessages((prev) => [...prev, optimisticUser]);
      setInput("");

      try {
        const res = await sendAgentMessage({
          projectId: projectIdAtStart,
          userMessage: msg,
          moduleKey,
          stepKey,
        });
        assertCurrentProject(projectIdAtStart, versionAtStart);
        setSelectedConversationId(res.conversationId);
        setMessages((prev) => [
          ...prev,
          {
            id: res.assistant.id,
            role: "assistant",
            content: res.assistant.content,
            created_at: res.assistant.created_at,
            module_key: moduleKey,
            step_key: stepKey,
          },
        ]);
      } catch (e) {
        if (activeProjectIdRef.current !== projectIdAtStart || loadVersionRef.current !== versionAtStart) return;
        const detail = e instanceof Error ? e.message : "Erro desconhecido";
        if (/credits_exhausted|402/i.test(detail)) {
          toast.error("Créditos da Lovable AI esgotados.", {
            description: "Adicione créditos em Configurações → Plano e créditos.",
          });
        } else if (/rate_limited|429/i.test(detail)) {
          toast.error("Muitas requisições. Aguarde alguns segundos e tente novamente.");
        } else {
          toast.error("Falha ao consultar o Agente", { description: detail });
        }
        setMessages((prev) => prev.filter((m) => m.id !== optimisticUser.id));
      } finally {
        if (activeProjectIdRef.current === projectIdAtStart && loadVersionRef.current === versionAtStart) {
          setSending(false);
        }
      }
    },
    [activeProject?.currentModuleId, args.moduleKey, args.stepKey, assertCurrentProject, loadingHistory, messagesProjectId, sending],
  );

  const saveDecision = useCallback(
    async (message: AgentMessage, title?: string | null) => {
      const projectIdAtStart = activeProjectIdRef.current;
      const versionAtStart = loadVersionRef.current;
      const moduleKey = args.moduleKey ?? activeProject?.currentModuleId ?? null;
      const stepKey = args.stepKey ?? null;
      if (!projectIdAtStart || !moduleKey || loadingHistory || messagesProjectId !== projectIdAtStart) {
        toast.error("Precisa de projeto, módulo e contexto carregado para salvar como decisão.");
        return;
      }

      setSavingMessageId(message.id);
      try {
        await saveAsProjectDecision(
          {
            projectId: projectIdAtStart,
            moduleKey,
            stepKey,
            title: title ?? `Decisão em ${moduleKey}`,
            content: message.content,
          },
          {
            assertCurrentProject: () => assertCurrentProject(projectIdAtStart, versionAtStart),
          },
        );
        assertCurrentProject(projectIdAtStart, versionAtStart);
        toast.success("Salvo como decisão do projeto.", {
          description: "O Agente vai lembrar disso nos próximos módulos.",
        });
      } catch (e) {
        if (activeProjectIdRef.current !== projectIdAtStart || loadVersionRef.current !== versionAtStart) return;
        toast.error("Não foi possível salvar a decisão", {
          description: e instanceof Error ? e.message : "Erro desconhecido",
        });
      } finally {
        if (activeProjectIdRef.current === projectIdAtStart && loadVersionRef.current === versionAtStart) {
          setSavingMessageId(null);
        }
      }
    },
    [activeProject?.currentModuleId, args.moduleKey, args.stepKey, assertCurrentProject, loadingHistory, messagesProjectId],
  );

  const scopedMessages = messagesProjectId === activeProjectId ? messages : [];
  const scopedArgs = argsProjectId === activeProjectId ? args : {};
  const scopedInput = messagesProjectId === activeProjectId ? input : "";
  const scopedLoadingHistory = Boolean(isOpen && activeProjectId && (loadingHistory || messagesProjectId !== activeProjectId));

  const value = useMemo<Ctx>(
    () => ({
      isOpen,
      args: scopedArgs,
      activeProjectId,
      selectedConversationId: messagesProjectId === activeProjectId ? selectedConversationId : null,
      messages: scopedMessages,
      loadingHistory: scopedLoadingHistory,
      sending,
      savingMessageId,
      input: scopedInput,
      setInput,
      open,
      close,
      send,
      saveDecision,
    }),
    [
      isOpen,
      args,
      argsProjectId,
      activeProjectId,
      messagesProjectId,
      selectedConversationId,
      scopedMessages,
      scopedArgs,
      scopedInput,
      scopedLoadingHistory,
      sending,
      savingMessageId,
      input,
      open,
      close,
      send,
      saveDecision,
    ],
  );
  return <AgentChatCtx.Provider value={value}>{children}</AgentChatCtx.Provider>;
};

export const useAgentChat = (): Ctx => {
  const ctx = useContext(AgentChatCtx);
  if (!ctx) throw new Error("useAgentChat must be used inside AgentChatProvider");
  return ctx;
};

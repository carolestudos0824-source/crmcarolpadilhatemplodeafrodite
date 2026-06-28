import { useEffect, useRef, useState } from "react";
import { Bot, X, Send, Sparkles, BookmarkPlus, ArrowRight, Loader2, MessagesSquare, CheckCircle2, Wand2, ClipboardCheck, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useAgentChat } from "@/components/entrega/AgentChatProvider";
import { useAppProjects } from "@/hooks/useAppProjects";

const MODULE_LABELS: Record<string, string> = {
  comece: "Comece aqui",
  ideias: "Ideias prontas",
  planejar: "Planejar o App",
  mvp: "MVP e Arquitetura",
  telas: "Telas e Fluxo",
  construir: "Construir App",
  login: "Login e Banco",
  seguranca: "Segurança do App",
  teste: "Teste Final do App",
  validacao: "Validação",
  monetizacao: "Monetização",
  campanhas: "Campanhas",
  publicar: "Publicar e Domínio",
  legal: "Legal e Confiança",
  metricas: "Métricas",
  melhorias: "Melhorias e Versões",
};

const QUICK_ACTIONS: { label: string; text: (ctx: { stepTitle?: string | null; moduleLabel?: string }) => string }[] = [
  {
    label: "Continuar raciocínio",
    text: () => "Continue de onde paramos. Use o que já está salvo no projeto e avance o raciocínio sem repetir o que já foi decidido.",
  },
  {
    label: "Revisar esta etapa",
    text: ({ stepTitle, moduleLabel }) =>
      `Revise minha etapa atual${stepTitle ? ` "${stepTitle}"` : ""} dentro do módulo ${moduleLabel ?? "atual"}. Aponte lacunas, riscos e o que falta para considerar concluída.`,
  },
  {
    label: "Aplicar sugestão",
    text: ({ stepTitle }) =>
      `Transforme sua última sugestão em um plano aplicável agora${stepTitle ? ` na etapa "${stepTitle}"` : ""}. Dê passo a passo objetivo.`,
  },
  {
    label: "Gerar próxima etapa",
    text: ({ moduleLabel }) =>
      `Com base no contexto salvo e nos outputs anteriores, diga qual é a próxima etapa do módulo ${moduleLabel ?? "atual"} e o que entregar nela.`,
  },
];

export const AgentChatDrawer = () => {
  const {
    isOpen,
    args,
    close,
    messages,
    loadingHistory,
    sending,
    savingMessageId,
    applyingMessageId,
    appliedMessageIds,
    appliedDecisions,
    isLoadingAppliedDecisions,
    appliedDecisionsError,
    input,
    setInput,
    send,
    saveDecision,
    applySuggestion,
  } = useAgentChat();
  const { activeProject, openDrawer: openMyApps } = useAppProjects();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [expandedDecisionId, setExpandedDecisionId] = useState<string | null>(null);
  const [copiedDecisionId, setCopiedDecisionId] = useState<string | null>(null);

  const moduleKey = args.moduleKey ?? activeProject?.currentModuleId ?? null;
  const moduleLabel = moduleKey ? MODULE_LABELS[moduleKey] ?? moduleKey : "—";
  const stepTitle = args.stepTitle ?? null;

  // Pré-preencher draft quando abrir
  useEffect(() => {
    if (isOpen && args.initialDraft) setInput(args.initialDraft);
  }, [isOpen, args.initialDraft, setInput]);

  // Foco no textarea ao abrir
  useEffect(() => {
    if (isOpen) setTimeout(() => textareaRef.current?.focus(), 50);
  }, [isOpen]);

  // Auto-scroll para o fim
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, sending]);

  if (!isOpen) return null;

  const chatBusy = sending || loadingHistory;

  return (
    <div className="fixed inset-0 z-[80] flex" role="dialog" aria-modal="true" aria-label="Assistente rápido da Fábrica">
      <button
        type="button"
        aria-label="Fechar"
        onClick={close}
        className="flex-1 bg-black/60 backdrop-blur-sm"
      />
      <aside className="w-full sm:w-[480px] md:w-[560px] max-w-full bg-[#0B1020] border-l border-white/10 flex flex-col shadow-2xl">
        {/* Header */}
        <header className="px-4 py-3 border-b border-white/10 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shrink-0">
            <Bot size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-heading font-semibold">Assistente rápido da Fábrica</h2>
              <span className="text-[10px] uppercase tracking-wider text-accent/80">Apoio rápido · não substitui o Agente Arquiteto</span>
            </div>
            {activeProject ? (
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                <strong className="text-foreground/90">{activeProject.name}</strong> · {moduleLabel}
                {stepTitle ? ` · ${stepTitle}` : ""}
              </p>
            ) : (
              <p className="text-[11px] text-amber-300/90 mt-0.5">Nenhum projeto ativo selecionado.</p>
            )}
            <p className="text-[10px] text-muted-foreground/80 mt-1 leading-snug">
              Use este assistente para dúvidas rápidas dentro da Fábrica. Para revisar estratégia, prompts, erros e decisões do app, use o Agente Arquiteto oficial.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 inline-flex items-center justify-center"
            aria-label="Fechar chat"
          >
            <X size={16} />
          </button>
        </header>

        {/* Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {!activeProject && (
            <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
              <p className="text-sm text-amber-100 mb-3">
                Escolha ou crie um projeto antes de conversar com o Agente. Sem projeto ativo, ele não consegue manter
                memória contextual.
              </p>
              <button
                type="button"
                onClick={() => {
                  close();
                  openMyApps();
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold"
              >
                <Sparkles size={14} /> Escolher ou criar projeto
              </button>
            </div>
          )}

          {activeProject && (
            <section
              aria-label="Decisões aplicadas nesta etapa"
              className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-3 space-y-2"
            >
              <div className="flex items-center gap-2 text-emerald-200/90">
                <ClipboardCheck size={13} />
                <span className="text-[11px] uppercase tracking-wider font-medium">
                  Decisões aplicadas nesta etapa
                </span>
                {!isLoadingAppliedDecisions && appliedDecisions.length > 0 && (
                  <span className="text-[10px] text-emerald-200/70">({appliedDecisions.length})</span>
                )}
              </div>

              {isLoadingAppliedDecisions ? (
                <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                  <Loader2 size={12} className="animate-spin" /> Carregando decisões desta etapa...
                </div>
              ) : appliedDecisionsError ? (
                <p className="text-[11px] text-amber-300/90">
                  Não foi possível carregar as decisões agora.
                </p>
              ) : appliedDecisions.length === 0 ? (
                <p className="text-[11px] text-muted-foreground/85 leading-relaxed">
                  Nenhuma decisão aplicada nesta etapa ainda. Quando o Agente sugerir algo útil, clique em
                  {" "}<strong className="text-emerald-200/90">Aplicar sugestão nesta etapa</strong>.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {appliedDecisions.map((d) => {
                    const isExpanded = expandedDecisionId === d.id;
                    const summary = d.content.length > 160 ? `${d.content.slice(0, 160).trim()}…` : d.content;
                    const formattedDate = new Date(d.created_at).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <li
                        key={d.id}
                        className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] text-foreground/95 font-medium truncate">
                              {d.title || "Decisão aplicada"}
                            </p>
                            <p className="text-[10px] text-muted-foreground/80 mt-0.5">{formattedDate}</p>
                            {!isExpanded && (
                              <p className="text-[11px] text-foreground/75 mt-1 whitespace-pre-wrap leading-snug">
                                {summary}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setExpandedDecisionId(isExpanded ? null : d.id)}
                            className="shrink-0 inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-foreground/80"
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                            {isExpanded ? "Ocultar" : "Ver decisão"}
                          </button>
                        </div>
                        {isExpanded && (
                          <div className="mt-2 pt-2 border-t border-white/5 space-y-2">
                            <p className="text-[12px] text-foreground/90 whitespace-pre-wrap leading-relaxed">
                              {d.content}
                            </p>
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(d.content);
                                  setCopiedDecisionId(d.id);
                                  toast.success("Conteúdo copiado.");
                                  setTimeout(() => {
                                    setCopiedDecisionId((cur) => (cur === d.id ? null : cur));
                                  }, 1500);
                                } catch {
                                  toast.error("Não foi possível copiar agora.");
                                }
                              }}
                              className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-foreground/80"
                            >
                              {copiedDecisionId === d.id ? <Check size={11} /> : <Copy size={11} />}
                              {copiedDecisionId === d.id ? "Copiado" : "Copiar conteúdo"}
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}

          {activeProject && loadingHistory && (
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Carregando contexto deste projeto...
            </div>
          )}

          {activeProject && !loadingHistory && messages.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <MessagesSquare size={14} />
                <span className="text-[11px] uppercase tracking-wider">Comece a conversa</span>
              </div>
              <p className="text-sm text-foreground/85">
                O Agente já tem o contexto do seu projeto <strong>{activeProject.name}</strong>. Você pode perguntar
                diretamente sobre <strong>{moduleLabel}</strong>{stepTitle ? <> · <strong>{stepTitle}</strong></> : null}.
              </p>
              <p className="text-xs text-muted-foreground">
                Dica: use os botões abaixo para ações rápidas.
              </p>
            </div>
          )}

          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={isUser ? "flex justify-end" : ""}>
                <div
                  className={
                    isUser
                      ? "max-w-[85%] rounded-2xl bg-primary text-primary-foreground px-3.5 py-2.5 text-sm whitespace-pre-wrap"
                      : "max-w-full text-sm text-foreground/95 whitespace-pre-wrap leading-relaxed"
                  }
                >
                  {m.content}
                  {!isUser && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(() => {
                        const isApplied = appliedMessageIds.includes(m.id);
                        const isApplying = applyingMessageId === m.id;
                        return (
                          <button
                            type="button"
                            onClick={() => applySuggestion(m)}
                            disabled={isApplying || isApplied || Boolean(applyingMessageId) || loadingHistory}
                            className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-md border border-accent/40 bg-accent/15 text-accent hover:bg-accent/25 disabled:opacity-50"
                          >
                            {isApplying ? <Loader2 size={11} className="animate-spin" /> : isApplied ? <CheckCircle2 size={11} /> : <Wand2 size={11} />}
                            {isApplied ? "Sugestão aplicada nesta etapa" : isApplying ? "Aplicando..." : "Aplicar sugestão nesta etapa"}
                          </button>
                        );
                      })()}
                      <button
                        type="button"
                        onClick={() => saveDecision(m, stepTitle ?? `Decisão em ${moduleLabel}`)}
                        disabled={savingMessageId === m.id || loadingHistory}
                        className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-md border border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20 disabled:opacity-50"
                      >
                        {savingMessageId === m.id ? <Loader2 size={11} className="animate-spin" /> : <BookmarkPlus size={11} />}
                        Salvar como decisão do projeto
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {sending && (
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Agente pensando...
            </div>
          )}
        </div>

        {/* Quick actions */}
        {activeProject && (
          <div className="px-4 py-2 border-t border-white/10 flex flex-wrap gap-1.5">
            {QUICK_ACTIONS.map((qa) => (
              <button
                key={qa.label}
                type="button"
                disabled={chatBusy}
                onClick={() => send(qa.text({ stepTitle, moduleLabel }))}
                className="text-[11px] px-2.5 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-foreground/80 disabled:opacity-50 inline-flex items-center gap-1"
              >
                <ArrowRight size={10} /> {qa.label}
              </button>
            ))}
          </div>
        )}

        {/* Composer */}
        <div className="px-4 py-3 border-t border-white/10">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              rows={2}
              disabled={!activeProject || chatBusy}
              placeholder={
                activeProject ? "Pergunte ao Agente sobre este projeto..." : "Escolha um projeto para conversar."
              }
              className="flex-1 resize-none rounded-lg bg-white/5 border border-white/10 focus:border-accent/50 focus:outline-none px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => void send(input)}
              disabled={!activeProject || chatBusy || !input.trim()}
              className="h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40"
              aria-label="Enviar"
            >
              {chatBusy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/70 mt-1.5">
            Enter envia · Shift+Enter quebra linha · usa créditos da Lovable AI
          </p>
        </div>
      </aside>
    </div>
  );
};

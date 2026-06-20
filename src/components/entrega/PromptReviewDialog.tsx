import { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Copy,
  Check,
  RotateCcw,
  Bot,
  Code2,
  ExternalLink,
  Pencil,
  MousePointerClick,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Settings2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { APP_CONFIG } from "@/config/appConfig";
import { useProjectContext } from "@/hooks/useProjectContext";
import { buildAgentPrompt, buildLovablePrompt } from "@/lib/promptBuilder";
import { useAppProjects } from "@/hooks/useAppProjects";

type Props = {
  open: boolean;
  onClose: () => void;
  stepName: string;
  stepObjective?: string;
  command?: string;
  /**
   * Optional pre-built prompts. When passed, the dialog uses them as-is
   * instead of generating from `command`. Useful for ModuleReviewCard.
   */
  customPrompts?: { lovable: string; agent: string };
};

type Mode = "lovable" | "agent";

function buildAgentImprovePrompt(currentText: string) {
  return `Estou usando a Fábrica de Apps com IA como guia para criar meu próprio aplicativo no Lovable.

Quero melhorar este prompt antes de enviar ao Lovable.

Meu objetivo é evitar prompt fraco, retrabalho e gasto errado de créditos no Lovable.

Prompt atual que quero melhorar:

${currentText}

Analise e melhore este prompt com foco em:

1. Clareza
2. Completude
3. Ordem lógica
4. Segurança
5. Preservação do que já funciona
6. Escopo correto da etapa
7. Evitar comandos vagos
8. Evitar pedir coisas demais de uma vez
9. Evitar quebrar login, banco, acesso, admin, checkout, entrega, layout ou progresso
10. Incluir o que testar depois

Regras:

- Preserve a intenção original.
- Não transforme a Fábrica de Apps com IA no app final.
- O app final é o projeto que estou criando no Lovable.
- Se faltar contexto, me pergunte antes ou faça suposições claras.
- Não prometa resultado financeiro garantido.
- Não prometa segurança 100%.
- Entregue uma versão final pronta para colar no Lovable.
- Depois explique rapidamente o que você melhorou.`;
}


const QUALITY_CHECKS: { label: string; match: (text: string) => boolean }[] = [
  { label: "Contexto do app incluído", match: (t) => /Contexto do meu app:/i.test(t) },
  { label: "Etapa atual incluída", match: (t) => /Etapa atual:/i.test(t) },
  { label: "Objetivo da etapa incluído", match: (t) => /Objetivo desta etapa:/i.test(t) },
  { label: "Tarefa específica incluída", match: (t) => /Tarefa:|Comando que pretendo enviar|Pedido:|Revisão/i.test(t) },
  { label: "Regras de preservação incluídas", match: (t) => /Regras:|Preserve o que já está funcionando|Não trate a Fábrica/i.test(t) },
  { label: "O que testar depois incluído", match: (t) => /testar|teste|relatório|riscos/i.test(t) },
];

/**
 * "Estúdio de Prompt" — área profissional de revisão e edição do prompt
 * antes de copiar para o Lovable ou para o Agente Arquiteto. Edição é
 * preservada por aba enquanto o modal está aberto e o texto copiado é
 * exatamente o texto editado.
 */
export const PromptReviewDialog = ({
  open,
  onClose,
  stepName,
  stepObjective,
  command,
  customPrompts,
}: Props) => {
  const { context, isFilled, openEditor } = useProjectContext();
  const { activeProject } = useAppProjects();
  const [mode, setMode] = useState<Mode>("lovable");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const originals = useMemo(
    () =>
      customPrompts
        ? { lovable: customPrompts.lovable, agent: customPrompts.agent }
        : {
            lovable: buildLovablePrompt({ context, stepName, stepObjective, command: command ?? "" }),
            agent: buildAgentPrompt({ context, stepName, stepObjective, command: command ?? "" }),
          },
    [context, stepName, stepObjective, command, customPrompts],
  );


  const [drafts, setDrafts] = useState<{ lovable: string; agent: string }>(originals);

  useEffect(() => {
    if (open) {
      setDrafts(originals);
    }
  }, [open, originals]);

  if (!open) return null;

  const text = drafts[mode];
  const setText = (next: string) => setDrafts((d) => ({ ...d, [mode]: next }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Prompt copiado. Revise no Lovable antes de executar.");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Não foi possível copiar agora. Selecione o texto manualmente.");
    }
  };

  const copyAgent = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Prompt copiado para o Agente Arquiteto.");
    } catch {
      toast.error("Não foi possível copiar agora. Selecione o texto manualmente.");
    }
  };

  const restore = () => {
    setDrafts((d) => ({ ...d, [mode]: originals[mode] }));
    toast("Versão original restaurada.");
  };

  const selectAll = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    el.select();
  };

  const handleImproveWithAgent = async () => {
    const improvePrompt = buildAgentImprovePrompt(text);
    try {
      await navigator.clipboard.writeText(improvePrompt);
      toast.success("Prompt copiado para melhorar com o Agente.");
    } catch {
      toast.error("Não foi possível copiar agora. Selecione o texto manualmente.");
    }
  };



  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-white/10 rounded-2xl max-w-3xl w-full max-h-[95vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-white/10">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Settings2 size={16} className="text-accent" />
              <h3 className="font-heading font-bold text-lg">Estúdio de Prompt</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Revise, edite e ajuste o comando antes de gastar créditos no Lovable.
            </p>
            <p className="text-[11px] text-muted-foreground/90 mt-1 truncate">
              {activeProject ? `App ativo: ${activeProject.name}` : "App ativo: contexto temporário"}
            </p>

          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 shrink-0"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-4 space-y-2">
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setMode("lovable")}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border ${
                mode === "lovable"
                  ? "text-accent border-accent/50 bg-accent/10"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
              }`}
            >
              <Code2 size={12} /> Prompt para Lovable
            </button>
            <button
              type="button"
              onClick={() => setMode("agent")}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border ${
                mode === "agent"
                  ? "text-amber-200 border-amber-400/50 bg-amber-400/10"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
              }`}
            >
              <Bot size={12} /> Prompt para o Agente
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground/90">
            {mode === "lovable"
              ? "Use este quando quiser aplicar direto no projeto do seu app no Lovable."
              : "Use este quando quiser conversar com o Agente Arquiteto, melhorar o comando e depois levar a versão final ao Lovable."}
          </p>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-auto space-y-3">
          {/* Valor / antes de copiar */}
          <div className="rounded-lg border border-accent/25 bg-accent/[0.06] p-3">
            <p className="text-sm font-medium text-foreground/95">
              Antes de copiar, revise
            </p>
            <p className="text-[12px] text-muted-foreground leading-snug mt-1">
              Prompt incompleto pode gerar erro, retrabalho e gasto de créditos.
              Use este estúdio para ajustar o comando ao app que você está
              criando antes de enviar ao Lovable ou ao Agente.
            </p>
          </div>

          {/* Indicador de contexto */}
          <div
            className={`rounded-lg border p-3 flex items-center justify-between gap-3 flex-wrap ${
              isFilled
                ? "border-emerald-400/30 bg-emerald-400/[0.06]"
                : "border-amber-400/30 bg-amber-400/[0.06]"
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold ${
                  isFilled
                    ? "bg-emerald-400/15 text-emerald-200 border border-emerald-400/30"
                    : "bg-amber-400/15 text-amber-200 border border-amber-400/30"
                }`}
              >
                {isFilled ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                {isFilled ? "Contexto do app preenchido" : "Contexto incompleto"}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Quanto mais completo o contexto, melhor o prompt.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                openEditor();
              }}
              className="text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/15 hover:bg-white/5 text-foreground/90"
            >
              <Settings2 size={12} /> Editar contexto
            </button>
          </div>

          {!isFilled && (
            <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-3 text-[12px]">
              <p className="text-foreground/90">
                Seu contexto do app ainda está vazio. O prompt vai funcionar,
                mas pode ficar genérico. Preencha o contexto para gerar comandos
                mais precisos.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openEditor();
                  }}
                  className="px-3 py-1.5 rounded-md border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15 text-[11px]"
                >
                  Preencher contexto
                </button>
                <button
                  type="button"
                  onClick={() => toast("Sem problema, continue editando o prompt.")}
                  className="px-3 py-1.5 rounded-md border border-white/15 hover:bg-white/5 text-[11px] text-muted-foreground"
                >
                  Continuar assim
                </button>
              </div>
            </div>
          )}

          {/* Editor */}
          <div className="rounded-lg border border-amber-400/25 bg-amber-400/5 p-3 flex items-start gap-2">
            <Pencil size={14} className="text-amber-300 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground/95">
                Edite seu prompt aqui
              </p>
              <p className="text-[12px] text-muted-foreground leading-snug">
                Você pode apagar, escrever, reorganizar ou deixar o comando mais
                específico antes de copiar.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label
              htmlFor="prompt-final-textarea"
              className="text-[11px] uppercase tracking-wider text-foreground/80"
            >
              Edite seu prompt aqui
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={selectAll}
                className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-md border border-white/15 hover:bg-white/5 text-muted-foreground"
              >
                <MousePointerClick size={12} /> Selecionar tudo
              </button>
              <button
                type="button"
                onClick={handleImprove}
                disabled={improving}
                className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-md border border-violet-400/50 bg-violet-500/15 text-violet-100 hover:bg-violet-500/25 disabled:opacity-60"
                title="Melhorar com IA"
              >
                {improving ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Melhorando prompt…
                  </>
                ) : (
                  <>
                    <Sparkles size={12} /> Melhorar com IA
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground/90">
            Use <strong className="text-violet-200">Melhorar com IA</strong> para lapidar o prompt antes de gastar créditos no Lovable.
          </p>

          <textarea
            id="prompt-final-textarea"
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            placeholder="Escreva ou edite o prompt aqui antes de copiar…"
            className="w-full min-h-[300px] rounded-xl border border-accent/40 focus:border-accent bg-black/40 p-4 text-xs md:text-[13px] font-mono text-foreground/95 leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y caret-accent"
          />

          {/* Painel: erro / fallback */}
          {improveError && (
            <div className="rounded-lg border border-red-400/40 bg-red-500/10 p-3 space-y-2">
              <p className="text-[13px] text-red-100 font-medium">
                {improveError}
              </p>
              <p className="text-[11px] text-red-100/80">
                Use o Agente Arquiteto para revisar este prompt.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={copyAgent}
                  className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-md border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
                >
                  <Bot size={12} /> Copiar para o Agente
                </button>
                <a
                  href={APP_CONFIG.GPT_AGENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-md border border-white/15 hover:bg-white/5"
                >
                  <ExternalLink size={12} /> Abrir Agente
                </a>
              </div>
            </div>
          )}

          {/* Painel: versão melhorada */}
          {improvement && (
            <div className="rounded-xl border border-violet-400/40 bg-violet-500/10 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-violet-200" />
                <p className="text-sm font-heading font-semibold text-violet-100">
                  Versão melhorada
                </p>
              </div>
              <p className="text-[11px] text-violet-100/80">
                Revise antes de copiar. Um prompt melhor reduz retrabalho no Lovable.
              </p>
              <textarea
                value={improvement.improvedPrompt}
                readOnly
                className="w-full min-h-[200px] rounded-lg border border-violet-400/30 bg-black/40 p-3 text-xs md:text-[13px] font-mono text-foreground/95 leading-relaxed resize-y"
              />
              {improvement.improvements.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-violet-100/90 mb-1">
                    O que foi melhorado
                  </p>
                  <ul className="space-y-1">
                    {improvement.improvements.map((it, i) => (
                      <li key={i} className="text-[12px] text-foreground/90 flex items-start gap-2">
                        <CheckCircle2 size={12} className="text-emerald-300 shrink-0 mt-0.5" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {improvement.warnings.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-amber-200 mb-1">
                    Atenções
                  </p>
                  <ul className="space-y-1">
                    {improvement.warnings.map((it, i) => (
                      <li key={i} className="text-[12px] text-foreground/90 flex items-start gap-2">
                        <AlertTriangle size={12} className="text-amber-300 shrink-0 mt-0.5" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={applyImprovement}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-md border border-violet-300/50 bg-violet-500/30 text-white hover:bg-violet-500/40 font-medium"
                >
                  <Check size={13} /> Aplicar melhoria
                </button>
                <button
                  type="button"
                  onClick={discardImprovement}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-md border border-white/15 hover:bg-white/5 text-foreground/90"
                >
                  Manter minha versão
                </button>
                <button
                  type="button"
                  onClick={copyImprovement}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-md border border-white/15 hover:bg-white/5 text-foreground/90"
                >
                  <Copy size={13} /> Copiar versão melhorada
                </button>
              </div>
            </div>
          )}

          {/* Checklist de qualidade */}
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[11px] uppercase tracking-wider text-foreground/80 mb-2">
              Qualidade do prompt
            </p>
            <ul className="grid sm:grid-cols-2 gap-1.5">
              {QUALITY_CHECKS.map((c) => {
                const ok = c.match(text);
                return (
                  <li
                    key={c.label}
                    className="flex items-center gap-2 text-[12px]"
                  >
                    {ok ? (
                      <CheckCircle2 size={13} className="text-emerald-300 shrink-0" />
                    ) : (
                      <Circle size={13} className="text-muted-foreground shrink-0" />
                    )}
                    <span className={ok ? "text-foreground/90" : "text-muted-foreground"}>
                      {c.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Como usar */}
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-[12px] text-muted-foreground leading-relaxed">
            <p className="text-foreground/90 font-medium mb-1">Como usar</p>
            <ol className="list-decimal pl-5 space-y-0.5">
              <li>Revise o texto.</li>
              <li>Edite o que precisar.</li>
              <li>Opcional: clique em Melhorar com IA para lapidar antes de copiar.</li>
              <li>Escolha Lovable para executar ou Agente para melhorar.</li>
              <li>
                Depois de aplicar, volte ao módulo e use “Revisar esta etapa
                no app”.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer / botões */}
        <div className="flex flex-wrap gap-2 justify-end p-4 border-t border-white/10 bg-background/95">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm"
          >
            <X size={14} /> Fechar
          </button>
          <button
            type="button"
            onClick={restore}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm"
          >
            <RotateCcw size={14} /> Restaurar versão original
          </button>
          <a
            href={APP_CONFIG.GPT_AGENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm"
          >
            <ExternalLink size={14} /> Abrir Agente
          </a>
          <button
            type="button"
            onClick={copyAgent}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15 text-sm"
          >
            <Bot size={14} /> Copiar para o Agente
          </button>
          <button
            type="button"
            onClick={copy}
            className="btn-primary text-sm"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            Copiar para o Lovable
          </button>
        </div>
      </div>
    </div>
  );
};

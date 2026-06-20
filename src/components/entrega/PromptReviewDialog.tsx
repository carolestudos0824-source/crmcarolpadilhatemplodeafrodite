import { useEffect, useMemo, useRef, useState } from "react";
import { X, Copy, Check, RotateCcw, Bot, Code2, ExternalLink, Pencil, MousePointerClick } from "lucide-react";
import { toast } from "sonner";
import { APP_CONFIG } from "@/config/appConfig";
import { useProjectContext } from "@/hooks/useProjectContext";
import { buildAgentPrompt, buildLovablePrompt } from "@/lib/promptBuilder";

type Props = {
  open: boolean;
  onClose: () => void;
  stepName: string;
  stepObjective?: string;
  command: string;
};

type Mode = "lovable" | "agent";

/**
 * Editor "Meu prompt final". Mostra o prompt completo (com contexto do app,
 * etapa, objetivo, comando e regras) e permite ajustar antes de copiar.
 *
 * Edições são preservadas por aba (Lovable/Agente) enquanto o modal está
 * aberto. "Restaurar versão original" reverte apenas a aba ativa.
 */
export const PromptReviewDialog = ({
  open,
  onClose,
  stepName,
  stepObjective,
  command,
}: Props) => {
  const { context } = useProjectContext();
  const [mode, setMode] = useState<Mode>("lovable");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const originals = useMemo(
    () => ({
      lovable: buildLovablePrompt({ context, stepName, stepObjective, command }),
      agent: buildAgentPrompt({ context, stepName, stepObjective, command }),
    }),
    [context, stepName, stepObjective, command],
  );

  const [drafts, setDrafts] = useState<{ lovable: string; agent: string }>(originals);

  // Sempre que o modal abrir ou os dados-fonte mudarem, resetar drafts.
  useEffect(() => {
    if (open) setDrafts(originals);
  }, [open, originals]);

  if (!open) return null;

  const text = drafts[mode];
  const setText = (next: string) =>
    setDrafts((d) => ({ ...d, [mode]: next }));

  const copy = async (label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(label);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Não foi possível copiar.");
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

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-white/10 rounded-2xl max-w-3xl w-full max-h-[95vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b border-white/10">
          <div className="min-w-0">
            <h3 className="font-heading font-bold text-lg">Meu prompt final</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Revise, edite e ajuste o comando antes de copiar para o Lovable ou
              para o Agente.
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
            Use Lovable quando quiser aplicar no app. Use Agente quando quiser
            revisar e melhorar antes de enviar ao Lovable.
          </p>
        </div>

        <div className="p-5 flex-1 overflow-auto space-y-3">
          <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-3 flex items-start gap-2">
            <Pencil size={14} className="text-amber-300 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground/95">
                Você pode editar este texto
              </p>
              <p className="text-[12px] text-muted-foreground leading-snug">
                Altere qualquer parte do prompt antes de copiar. Use isso para
                adaptar o comando ao seu app, corrigir detalhes ou deixar a
                instrução mais específica.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="prompt-final-textarea"
              className="text-[11px] uppercase tracking-wider text-foreground/80"
            >
              Edite seu prompt aqui
            </label>
            <button
              type="button"
              onClick={selectAll}
              className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-md border border-white/15 hover:bg-white/5 text-muted-foreground"
            >
              <MousePointerClick size={12} /> Selecionar tudo
            </button>
          </div>

          <textarea
            id="prompt-final-textarea"
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            placeholder="Escreva ou edite o prompt aqui antes de copiar…"
            className="w-full min-h-[340px] rounded-xl border border-accent/40 focus:border-accent bg-black/40 p-4 text-xs md:text-[13px] font-mono text-foreground/95 leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y caret-accent"
          />
        </div>

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
            onClick={() => copy("Copiado para o Agente Arquiteto.")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15 text-sm"
          >
            <Bot size={14} /> Copiar para o Agente
          </button>
          <button
            type="button"
            onClick={() => copy("Copiado para o Lovable.")}
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

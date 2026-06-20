import { useEffect, useMemo, useState } from "react";
import { X, Copy, Check, RotateCcw, Bot, Code2, ExternalLink } from "lucide-react";
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

/**
 * Editor "Meu prompt final". Mostra o prompt completo (com contexto do app,
 * etapa, objetivo, comando e regras) e permite ajustar antes de copiar para
 * o Lovable ou para o Agente Arquiteto.
 */
export const PromptReviewDialog = ({
  open,
  onClose,
  stepName,
  stepObjective,
  command,
}: Props) => {
  const { context } = useProjectContext();
  const [mode, setMode] = useState<"lovable" | "agent">("lovable");
  const original = useMemo(
    () =>
      mode === "lovable"
        ? buildLovablePrompt({ context, stepName, stepObjective, command })
        : buildAgentPrompt({ context, stepName, stepObjective, command }),
    [mode, context, stepName, stepObjective, command],
  );
  const [text, setText] = useState(original);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) setText(original);
  }, [open, original]);

  if (!open) return null;

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
    setText(original);
    toast("Versão original restaurada.");
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b border-white/10">
          <div>
            <h3 className="font-heading font-bold text-lg">Meu prompt final</h3>
            <p className="text-xs text-muted-foreground">
              Revise o comando completo antes de enviar ao Lovable ou ao Agente.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2 px-5 pt-4">
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

        <div className="p-5 flex-1 overflow-auto">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-h-[320px] rounded-xl border border-white/10 bg-black/40 p-4 text-xs md:text-[13px] font-mono text-foreground/90 focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-end p-4 border-t border-white/10 bg-background/95">
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

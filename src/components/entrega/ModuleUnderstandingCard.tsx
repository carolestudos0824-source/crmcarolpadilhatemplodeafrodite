import { useState } from "react";
import { Check, Bot, BookOpenCheck } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useProjectContext } from "@/hooks/useProjectContext";
import { buildReviewAgentPrompt } from "@/lib/promptBuilder";
import { copyPromptAndOpenAgent } from "@/lib/agenteArquiteto";
import { AgentClipboardFallback } from "@/components/entrega/AgentClipboardFallback";

type Props = {
  moduleName: string;
  moduleId?: string;
  title?: string;
  description?: string;
  points?: string[];
};

const DEFAULT_POINTS = [
  "Entendi que devo copiar um comando por vez.",
  "Entendi que a Fábrica orienta e o Lovable executa.",
  "Entendi que preciso esperar o Lovable terminar.",
  "Entendi que devo revisar antes de avançar.",
  "Entendi que não devo pedir o app inteiro de uma vez.",
];

export function ModuleUnderstandingCard({
  moduleName,
  moduleId,
  title = "Confirmar entendimento antes de avançar",
  description = "Antes de avançar, confirme que você entendeu como usar a Fábrica junto com o Lovable.",
  points = DEFAULT_POINTS,
}: Props) {
  const [ok, setOk] = useState(false);
  const [fallback, setFallback] = useState<string | null>(null);
  const { context } = useProjectContext();

  const handleAgente = () => {
    setOk(true);
    setTimeout(() => setOk(false), 1600);
    const prompt = buildReviewAgentPrompt({
      context,
      stepName: moduleName,
      stepObjective:
        "Confirmar entendimento conceitual desta etapa antes de avançar. Não aplicar mudanças no app nesta etapa.",
      moduleId,
    });
    void copyPromptAndOpenAgent({
      prompt,
      successMessage:
        "Prompt copiado. Abra o Agente Arquiteto e cole com Ctrl+V para revisar seu entendimento.",
      onClipboardFail: (p) => setFallback(p),
    });
  };

  return (
    <>
      <GlassCard className="mt-8 p-5 md:p-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
            <BookOpenCheck size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
              {title}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {description}
            </p>
          </div>
        </div>

        <ul className="space-y-2 mb-4">
          {points.map((p) => (
            <li
              key={p}
              className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-foreground/90"
            >
              <Check size={14} className="text-accent shrink-0 mt-0.5" />
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleAgente}
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg border text-sm font-semibold transition ${
            ok
              ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
              : "border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
          }`}
        >
          {ok ? <Check size={14} /> : <Bot size={14} />}
          {ok ? "Copiado!" : "Revisar entendimento com o Agente Arquiteto"}
        </button>
      </GlassCard>
      <AgentClipboardFallback prompt={fallback} onClose={() => setFallback(null)} />
    </>
  );
}

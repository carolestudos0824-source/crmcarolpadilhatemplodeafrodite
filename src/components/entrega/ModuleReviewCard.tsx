import { useState } from "react";
import { toast } from "sonner";
import { SearchCheck, Copy, Check, ClipboardCheck, ListChecks, CheckCircle, Bot, Settings2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useProjectContext } from "@/hooks/useProjectContext";
import {
  buildReviewAgentPrompt,
  buildReviewLovablePrompt,
} from "@/lib/promptBuilder";
import { PromptReviewDialog } from "@/components/entrega/PromptReviewDialog";

export function ModuleReviewCard({
  moduleName,
  isSecurity = false,
  objective,
  moduleId,
}: {
  moduleName: string;
  isSecurity?: boolean;
  objective?: string;
  moduleId?: string;
}) {
  const [okAgent, setOkAgent] = useState(false);
  const [okLovable, setOkLovable] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const { context } = useProjectContext();

  const agentText = buildReviewAgentPrompt({
    context,
    stepName: moduleName,
    stepObjective: objective,
    isSecurity,
    moduleId,
  });
  const lovableText = buildReviewLovablePrompt({
    context,
    stepName: moduleName,
    stepObjective: objective,
    isSecurity,
    moduleId,
  });

  const copyTo = async (
    text: string,
    setOk: (v: boolean) => void,
    label: string,
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      toast.success(`Revisão copiada! Cole no ${label}.`);
      setTimeout(() => setOk(false), 1600);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const blocks = [
    {
      icon: ClipboardCheck,
      title: "O que este módulo pediu?",
      text: "Revise os comandos, telas, regras ou ajustes trabalhados nesta etapa.",
    },
    {
      icon: ListChecks,
      title: "O que foi aplicado no app?",
      text: "Confira se as mudanças aparecem no aplicativo e se estão funcionando de verdade.",
    },
    {
      icon: CheckCircle,
      title: "O que ainda precisa corrigir?",
      text: "Identifique o que ficou incompleto, confuso, quebrado ou precisa de novo comando.",
    },
  ];

  return (
    <>
      <GlassCard className="mt-8 p-5 md:p-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
            <SearchCheck size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
              Revisar esta etapa no app
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Depois de aplicar os comandos, revise se esta etapa realmente
              apareceu no app. Você pode editar o prompt no Estúdio antes de
              copiar, pedir ajuda ao Agente Arquiteto ou ao próprio Lovable.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mb-4">
          {blocks.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="rounded-lg border border-white/10 bg-white/5 p-3"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon size={14} className="text-accent shrink-0" />
                  <h4 className="text-sm font-semibold">{b.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{b.text}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setStudioOpen(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition border-white/20 bg-white/[0.03] text-foreground hover:bg-white/10"
          >
            <Settings2 size={14} />
            Revisar prompt antes de copiar
          </button>
          <button
            onClick={() => copyTo(agentText, setOkAgent, "Agente Arquiteto")}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition ${
              okAgent
                ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
                : "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
            }`}
          >
            {okAgent ? <Check size={14} /> : <Bot size={14} />}
            {okAgent ? "Copiado!" : "Revisar com o Agente"}
          </button>
          <button
            onClick={() => copyTo(lovableText, setOkLovable, "Lovable")}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition ${
              okLovable
                ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
                : "border-white/15 bg-white/5 text-foreground hover:bg-white/10"
            }`}
          >
            {okLovable ? <Check size={14} /> : <Copy size={14} />}
            {okLovable ? "Copiado!" : "Pedir revisão ao Lovable"}
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
          Revise o prompt antes de copiar, converse com o Agente se quiser
          melhorar a análise, ou peça ao Lovable para revisar o projeto atual.
        </p>
      </GlassCard>

      <PromptReviewDialog
        open={studioOpen}
        onClose={() => setStudioOpen(false)}
        stepName={moduleName}
        stepObjective={objective}
        customPrompts={{ lovable: lovableText, agent: agentText }}
      />
    </>
  );
}

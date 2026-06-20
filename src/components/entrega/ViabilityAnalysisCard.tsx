import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Compass, Bot, Copy, Check, Settings2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useProjectContext } from "@/hooks/useProjectContext";
import { PromptReviewDialog } from "@/components/entrega/PromptReviewDialog";

const placeholder = (v?: string, fallback = "[preencha aqui]") =>
  v && v.trim() ? v.trim() : fallback;

export function buildViabilityPrompt(ctx: {
  appName?: string;
  appDoes?: string;
  audience?: string;
  problem?: string;
  promise?: string;
  pricingModel?: string;
  notes?: string;
}) {
  return `Estou usando a Fábrica de Apps com IA para transformar uma ideia em aplicativo.

Quero avaliar a viabilidade desta ideia antes de construir no Lovable.

Ideia do app:
${placeholder(ctx.appDoes, "[descreva sua ideia]")}

Nome provisório do app:
${placeholder(ctx.appName, "[escreva o nome, se já tiver]")}

Público-alvo:
${placeholder(ctx.audience, "[quem usaria ou compraria]")}

Problema que resolve:
${placeholder(ctx.problem, "[qual dor essa ideia resolve]")}

Como pretendo ganhar dinheiro:
${placeholder(ctx.pricingModel, "[assinatura, venda única, comissão, mensalidade, serviço, anúncio, marketplace ou outro]")}

Observações:
${placeholder(ctx.notes, "[opcional]")}

Contexto:
Antes de gastar créditos no Lovable, preciso entender se essa ideia tem potencial real, quais riscos existem e qual seria a primeira versão mais simples para validar.

Faça uma análise completa e prática com:

1. Clareza da ideia
- A ideia está clara?
- O problema é forte?
- O público entende rapidamente o valor?

2. Tamanho e força do mercado
- Existe demanda para esse tipo de app?
- O mercado parece pequeno, médio ou grande?
- Que sinais indicam oportunidade?

3. Público-alvo
- Quem compraria ou usaria?
- Esse público tem dor urgente?
- Esse público pagaria por uma solução?

4. Concorrentes
- Quais tipos de concorrentes já existem?
- O que eles entregam?
- Onde eles são fortes?
- Onde eles deixam lacunas?

5. Diferencial
- O que esse app pode fazer melhor, mais simples ou mais específico?
- Qual posicionamento tornaria a ideia mais vendável?

6. Análise SWOT
- Forças
- Fraquezas
- Oportunidades
- Ameaças

7. Custos e dificuldade de entrada
- O que seria simples de construir?
- O que pode ficar caro ou complexo?
- O que deve ficar fora da primeira versão?

8. Riscos principais
- Risco de ninguém pagar
- Risco técnico
- Risco de concorrência
- Risco de marketing
- Risco de manutenção
- Risco jurídico ou de dados, se existir

9. MVP recomendado
Monte uma primeira versão com no máximo 5 funcionalidades essenciais.

10. O que cortar agora
Liste tudo que não deve entrar na primeira versão.

11. Teste de validação
Sugira uma forma simples de testar a ideia com possíveis usuários antes de construir tudo.

12. Nota de viabilidade
Dê uma nota de 0 a 10 para:
- clareza
- dor do público
- potencial de venda
- facilidade de construir
- potencial de escala

13. Veredito final
- vale construir agora?
- precisa ajustar antes?
- qual seria o primeiro passo?

14. Formato de apresentação
Monte a resposta como uma apresentação estruturada em slides, com títulos curtos e bullets objetivos:

Slide 1: Nome da ideia e resumo
Slide 2: Problema
Slide 3: Público-alvo
Slide 4: Mercado
Slide 5: Concorrentes
Slide 6: Diferencial
Slide 7: SWOT
Slide 8: Custos e dificuldade
Slide 9: Riscos
Slide 10: MVP recomendado
Slide 11: Teste de validação
Slide 12: Veredito e próximos passos

Depois da análise, entregue também um prompt final pronto para o Lovable construir apenas o MVP, caso a ideia seja viável.

Não prometa venda garantida.
Não diga que a ideia vai dar certo sem validação.
Se faltarem dados, faça suposições claras e diga o que precisa ser confirmado.`;
}

export function ViabilityAnalysisCard() {
  const { context } = useProjectContext();
  const [studioOpen, setStudioOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const promptText = useMemo(
    () =>
      buildViabilityPrompt({
        appName: context.appName,
        appDoes: context.appDoes,
        audience: context.audience,
        problem: context.problem,
        promise: context.promise,
        pricingModel: context.pricingModel,
        notes: context.notes,
      }),
    [context],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      toast.success("Prompt copiado! Cole no Agente Arquiteto.");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <>
      <GlassCard className="mt-6 p-5 md:p-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
            <Compass size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
              Análise de Viabilidade da Ideia
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Descobrir se a ideia tem mercado, concorrência, diferencial, riscos e caminho realista antes de construir.
            </p>
            <p className="text-[11px] text-muted-foreground mt-2">
              <strong className="text-foreground/80">Quando usar:</strong> antes de investir tempo e créditos no Lovable, principalmente se você ainda não sabe se a ideia é forte. Este prompt é feito para o <strong className="text-foreground/80">Agente Arquiteto</strong>.
            </p>
          </div>
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
            onClick={() => setStudioOpen(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
          >
            <Bot size={14} />
            Revisar com o Agente
          </button>
          <button
            onClick={copy}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition ${
              copied
                ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
                : "border-white/15 bg-white/5 text-foreground hover:bg-white/10"
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copiado!" : "Copiar para o Agente"}
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
          Use o Estúdio para editar ideia, público e modelo de monetização antes de copiar. Esta análise não promete venda garantida — é um diagnóstico para reduzir risco antes de construir.
        </p>
      </GlassCard>

      <PromptReviewDialog
        open={studioOpen}
        onClose={() => setStudioOpen(false)}
        stepName="Análise de Viabilidade da Ideia"
        stepObjective="Avaliar mercado, concorrência, riscos, SWOT, MVP e validação antes de construir no Lovable."
        customPrompts={{ lovable: promptText, agent: promptText }}
      />
    </>
  );
}

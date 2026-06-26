import { useMemo } from "react";
import { Megaphone, AlertTriangle, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useProjectContext, type ProjectContext } from "@/hooks/useProjectContext";

/**
 * Resumo comercial seguro da oferta baseado no Contexto do Projeto em foco.
 *
 * Não altera nada do app, login, banco, checkout, admin, área paga ou
 * progresso. Apenas exibe sugestões a partir do que a pessoa já preencheu
 * em "Contexto do meu app" para evitar prompts genéricos e promessas
 * exageradas na Página de venda.
 */

const SENSITIVE_NICHES: Array<{ key: string; label: string; words: string[] }> = [
  { key: "relacionamento", label: "Relacionamento e amor", words: ["amor", "relacionament", "casal", "namor", "afetiv", "casamento", "ex "] },
  { key: "saude", label: "Saúde e bem-estar", words: ["saúde", "saude", "emagrec", "cura", "doenç", "doenca", "ansiedad", "depress", "terap", "psico"] },
  { key: "dinheiro", label: "Dinheiro e investimento", words: ["dinheiro", "lucro", "renda", "investim", "trader", "trading", "cripto", "bitcoin", "rico", "milhõ", "milho"] },
  { key: "carreira", label: "Carreira e trabalho", words: ["carreira", "emprego", "vaga", "promoç", "demiss", "concurs"] },
  { key: "espiritual", label: "Espiritualidade e fé", words: ["espirit", "tarô", "taro", "oráculo", "oraculo", "anjo", "energ", "manifestaç", "fé ", "fe "] },
];

const norm = (s: string) => s.toLowerCase();

function detectSensitive(ctx: ProjectContext) {
  const hay = norm([ctx.appName, ctx.appDoes, ctx.audience, ctx.problem, ctx.promise, ctx.productSold, ctx.notes].join(" "));
  return SENSITIVE_NICHES.filter((n) => n.words.some((w) => hay.includes(w)));
}

type Suggestion = {
  tipo: string;
  publico: string;
  dor: string;
  resultado: string;
  oferta: string;
  cta: string;
  preco: string;
  naoPrometer: string[];
};

const GENERIC_SAFE_AVOIDS = [
  "resultado garantido",
  "promessa absoluta de transformação",
  "qualquer ganho financeiro garantido",
];

function buildSuggestion(ctx: ProjectContext): Suggestion {
  const hay = norm(`${ctx.appName} ${ctx.appDoes} ${ctx.audience} ${ctx.problem} ${ctx.promise} ${ctx.productSold}`);
  const has = (...w: string[]) => w.some((x) => hay.includes(x));

  // Jogo do Amor / nicho amor & relacionamento
  if (has("jogo do amor", "amor", "relacionament", "casal", "namor")) {
    return {
      tipo: ctx.appDoes?.trim() || "jogo/quiz interativo de relacionamento",
      publico: ctx.audience?.trim() || "solteiros, casais ou pessoas interessadas em autoconhecimento amoroso",
      dor: ctx.problem?.trim() || "falta de clareza sobre o relacionamento, compatibilidade ou dinâmica amorosa",
      resultado: ctx.promise?.trim() || "um diagnóstico, reflexão ou recomendação personalizada sobre o tema",
      oferta: ctx.productSold?.trim() || "desbloquear o resultado completo ou a experiência completa",
      cta: ctx.mainAction?.trim() || "Ver meu resultado completo",
      preco: ctx.pricingModel?.trim() || "R$ 17 a R$ 47 para teste inicial",
      naoPrometer: [
        "encontrar o amor da vida garantido",
        "salvar qualquer relacionamento",
        "diagnóstico clínico ou psicológico",
        ...GENERIC_SAFE_AVOIDS,
      ],
    };
  }

  // Quiz / diagnóstico genérico
  if (has("quiz", "diagnóstic", "diagnostic", "teste", "avaliaç")) {
    return {
      tipo: ctx.appDoes?.trim() || "quiz/diagnóstico interativo",
      publico: ctx.audience?.trim() || "pessoas que querem se autoconhecer melhor sobre o tema",
      dor: ctx.problem?.trim() || "falta de clareza sobre a própria situação",
      resultado: ctx.promise?.trim() || "um resultado personalizado com recomendações iniciais",
      oferta: ctx.productSold?.trim() || "desbloquear o resultado completo",
      cta: ctx.mainAction?.trim() || "Ver meu resultado",
      preco: ctx.pricingModel?.trim() || "R$ 9 a R$ 47 como faixa de teste",
      naoPrometer: GENERIC_SAFE_AVOIDS,
    };
  }

  // Fallback honesto baseado no que a pessoa já escreveu
  return {
    tipo: ctx.appDoes?.trim() || "(descreva o que seu app faz no Contexto do meu app)",
    publico: ctx.audience?.trim() || "(defina o público no Contexto do meu app)",
    dor: ctx.problem?.trim() || "(defina a dor principal no Contexto do meu app)",
    resultado: ctx.promise?.trim() || "(defina a promessa segura no Contexto do meu app)",
    oferta: ctx.productSold?.trim() || "(defina o que vende: acesso, plano, sessão, diagnóstico, etc.)",
    cta: ctx.mainAction?.trim() || "Começar agora",
    preco: ctx.pricingModel?.trim() || "(defina uma faixa inicial de teste)",
    naoPrometer: GENERIC_SAFE_AVOIDS,
  };
}

export function OfertaResumoCard() {
  const { context, isFilled, openEditor } = useProjectContext();
  const suggestion = useMemo(() => buildSuggestion(context), [context]);
  const sensitive = useMemo(() => detectSensitive(context), [context]);

  return (
    <GlassCard className="mb-6 p-5 md:p-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
          <Megaphone size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
            Resumo da oferta {context.appName ? `— ${context.appName}` : ""}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Use este resumo antes de pedir a landing page ao Lovable. Ele
            usa o Contexto do seu app para evitar prompts genéricos e
            promessas exageradas.
          </p>
        </div>
        {!isFilled && (
          <button
            type="button"
            onClick={openEditor}
            className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/15"
          >
            Preencher contexto
          </button>
        )}
      </div>

      <dl className="grid sm:grid-cols-2 gap-3 text-sm">
        {[
          ["Tipo de app", suggestion.tipo],
          ["Público", suggestion.publico],
          ["Dor que resolve", suggestion.dor],
          ["Promessa segura (resultado)", suggestion.resultado],
          ["Oferta principal", suggestion.oferta],
          ["CTA sugerido", suggestion.cta],
          ["Preço / faixa de teste", suggestion.preco],
        ].map(([term, def]) => (
          <div key={term} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <dt className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">{term}</dt>
            <dd className="text-foreground/90 leading-relaxed">{def}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-[13px] text-amber-100 flex items-start gap-2">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">O que não prometer nesta página:</div>
          <ul className="list-disc list-inside space-y-0.5">
            {suggestion.naoPrometer.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      {sensitive.length > 0 && (
        <div className="mt-3 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-[13px] text-rose-100 flex items-start gap-2">
          <ShieldCheck size={14} className="shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold mb-1">
              Nicho sensível detectado: {sensitive.map((s) => s.label).join(", ")}
            </div>
            Evite promessas absolutas de cura, ganho, sucesso, salvação,
            previsão ou transformação garantida. Use linguagem honesta:
            clareza, reflexão, autoconhecimento, organização, experiência.
          </div>
        </div>
      )}

      <p className="mt-3 text-[12px] text-muted-foreground leading-relaxed">
        <strong className="text-foreground/90">Orientação comercial:</strong>{" "}
        não venda certeza de resultado. Venda clareza, utilidade, economia
        de tempo, organização, acesso, diagnóstico, experiência ou
        transformação possível.
      </p>
    </GlassCard>
  );
}

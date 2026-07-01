import { useMemo } from "react";
import { Scale, AlertTriangle, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useProjectContext, type ProjectContext } from "@/hooks/useProjectContext";

/**
 * Resumo seguro de Legal e Confiança baseado no Contexto do Projeto em
 * foco. Não altera login, banco, área paga, admin ou checkout. Apenas
 * exibe orientações para a pessoa preparar termos, privacidade, suporte e
 * reembolso do APP DELA. Não substitui revisão jurídica.
 */

const SENSITIVE_NICHES: Array<{ key: string; label: string; words: string[] }> = [
  { key: "relacionamento", label: "Relacionamento e amor", words: ["amor", "relacionament", "casal", "namor", "afetiv", "casamento"] },
  { key: "saude", label: "Saúde e bem-estar", words: ["saúde", "saude", "emagrec", "cura", "doenç", "doenca", "ansiedad", "depress", "terap", "psico"] },
  { key: "dinheiro", label: "Dinheiro e investimento", words: ["dinheiro", "lucro", "renda", "investim", "trader", "trading", "cripto", "bitcoin"] },
  { key: "espiritual", label: "Espiritualidade e fé", words: ["espirit", "tarô", "taro", "oráculo", "oraculo", "anjo", "manifestaç"] },
  { key: "menores", label: "Conteúdo para menores", words: ["criança", "crianc", "infantil", "menores", "kids"] },
];

const norm = (s: string) => s.toLowerCase();

function detectSensitive(ctx: ProjectContext) {
  const hay = norm([ctx.appName, ctx.appDoes, ctx.audience, ctx.problem, ctx.promise, ctx.productSold, ctx.notes].join(" "));
  return SENSITIVE_NICHES.filter((n) => n.words.some((w) => hay.includes(w)));
}

type Suggestion = {
  tipo: string;
  dados: string;
  riscoSensivel: string;
  promessaSegura: string;
  documentos: string[];
  suporte: string;
  reembolso: string;
  naoPrometer: string[];
};

const DEFAULT_DOCS = [
  "Termos de Uso",
  "Política de Privacidade",
  "Política de Reembolso",
  "Página de Suporte",
  "Aviso de limitação de responsabilidade",
  "Página de Confiança",
];

const GENERIC_AVOIDS = [
  "resultado garantido",
  "vendas garantidas",
  "qualquer promessa absoluta de transformação",
];

function buildSuggestion(ctx: ProjectContext): Suggestion {
  const hay = norm(`${ctx.appName} ${ctx.appDoes} ${ctx.audience} ${ctx.problem} ${ctx.promise} ${ctx.productSold}`);
  const has = (...w: string[]) => w.some((x) => hay.includes(x));

  if (has("jogo do amor", "amor", "relacionament", "casal", "namor")) {
    return {
      tipo: ctx.appDoes?.trim() || "jogo/quiz interativo de relacionamento",
      dados: "nome, e-mail, respostas do quiz, preferências, resultado gerado e dados de pagamento quando houver checkout externo",
      riscoSensivel: "relacionamento, expectativa emocional e promessa afetiva",
      promessaSegura: ctx.promise?.trim() || "experiência simbólica, reflexiva, informativa ou de entretenimento",
      documentos: DEFAULT_DOCS,
      suporte: "e-mail, WhatsApp ou formulário (escolher um e informar prazo de resposta)",
      reembolso: "explicar condição e prazo conforme regra do produto (ex.: 7 dias para arrependimento, conforme CDC quando aplicável)",
      naoPrometer: [
        "encontrar amor garantido",
        "salvar qualquer relacionamento",
        "prever o futuro",
        "diagnóstico clínico ou psicológico",
        "compatibilidade garantida",
        ...GENERIC_AVOIDS,
      ],
    };
  }

  return {
    tipo: ctx.appDoes?.trim() || "(descreva o que seu app faz em Contexto do meu app)",
    dados:
      "dados informados pelo usuário (ex.: nome, e-mail, respostas), dados de uso e, quando houver compra, dados de pagamento processados pelo gateway externo",
    riscoSensivel: ctx.problem?.trim()
      ? `tema sensível possível ao redor de: ${ctx.problem.trim()}`
      : "(defina o problema no Contexto do meu app para avaliar risco sensível)",
    promessaSegura: ctx.promise?.trim() || "(defina uma promessa segura — clareza, organização, experiência, reflexão)",
    documentos: DEFAULT_DOCS,
    suporte: "e-mail, WhatsApp ou formulário (escolher um e informar prazo de resposta)",
    reembolso: "explicar condição e prazo conforme regra do produto (ex.: 7 dias para arrependimento, conforme CDC quando aplicável)",
    naoPrometer: GENERIC_AVOIDS,
  };
}

export function ResumoLegalCard() {
  const { context, isFilled, openEditor } = useProjectContext();
  const suggestion = useMemo(() => buildSuggestion(context), [context]);
  const sensitive = useMemo(() => detectSensitive(context), [context]);

  return (
    <GlassCard className="mb-6 p-5 md:p-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
          <Scale size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
            Resumo legal e confiança{context.appName ? ` — ${context.appName}` : ""}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Use este resumo antes de pedir termos, privacidade, suporte e
            reembolso ao Lovable. Ele orienta o conteúdo a partir do seu
            contexto para evitar textos genéricos.
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
          ["Dados possíveis", suggestion.dados],
          ["Risco sensível", suggestion.riscoSensivel],
          ["Promessa segura", suggestion.promessaSegura],
          ["Canal de suporte", suggestion.suporte],
          ["Reembolso", suggestion.reembolso],
        ].map(([term, def]) => (
          <div key={term} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <dt className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">{term}</dt>
            <dd className="text-foreground/90 leading-relaxed">{def}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-[13px]">
        <div className="text-[11px] uppercase tracking-wider text-accent/90 mb-2">
          Documentos recomendados
        </div>
        <ul className="grid sm:grid-cols-2 gap-1.5 list-disc list-inside text-foreground/85">
          {suggestion.documentos.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-[13px] text-amber-100 flex items-start gap-2">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">O que não prometer nas páginas legais e de confiança:</div>
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
            Reforce avisos de limitação de responsabilidade. Não substitua
            atendimento profissional (psicólogo, médico, advogado, contador).
            Use linguagem honesta: experiência, reflexão, informação,
            entretenimento.
          </div>
        </div>
      )}

      <p className="mt-3 text-[12px] text-muted-foreground leading-relaxed">
        <strong className="text-foreground/90">Aviso:</strong> os textos
        gerados nesta etapa são <em>rascunhos orientativos</em>. Revise com
        profissional jurídico quando houver venda, dados sensíveis, saúde,
        finanças, menores de idade ou alto risco. Este módulo não substitui
        advogado, contador ou consultoria jurídica.
      </p>
    </GlassCard>
  );
}

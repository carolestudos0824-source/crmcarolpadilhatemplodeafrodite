import { useMemo } from "react";
import { Search, AlertTriangle, ShieldCheck, Bot } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useProjectContext, type ProjectContext } from "@/hooks/useProjectContext";

/**
 * Resumo SEO e GEO baseado no Contexto do Projeto em foco. Orienta a
 * pessoa participante a preparar páginas, perguntas e marcações que ajudem pessoas,
 * buscadores e ferramentas de IA a entenderem o APP DELA — sem prometer
 * ranqueamento, tráfego ou vendas garantidas. Não altera SEO real da
 * Fábrica de Apps.
 */

const norm = (s: string) => s.toLowerCase();

type Suggestion = {
  tipo: string;
  publico: string;
  intencao: string;
  palavras: string;
  perguntas: string[];
  paginasPublicas: string;
  paginasNoIndex: string;
  promessaSegura: string;
  naoProm: string[];
};

const GENERIC_NAO_PROM = [
  "ranqueamento garantido no Google",
  "tráfego ou vendas garantidas",
  "resultado garantido",
  "diagnóstico clínico ou solução milagrosa",
  "avaliações, notas ou depoimentos inventados",
];

function buildSuggestion(ctx: ProjectContext): Suggestion {
  const hay = norm(
    `${ctx.appName} ${ctx.appDoes} ${ctx.audience} ${ctx.problem} ${ctx.promise} ${ctx.productSold}`,
  );
  const has = (...w: string[]) => w.some((x) => hay.includes(x));

  if (has("jogo do amor", "amor", "relacionament", "casal", "namor")) {
    return {
      tipo: "jogo/quiz interativo de relacionamento",
      publico:
        "pessoas interessadas em relacionamento, autoconhecimento amoroso, reflexão afetiva, compatibilidade simbólica ou dinâmica de casal",
      intencao:
        "fazer um quiz, entender uma situação amorosa, refletir sobre o relacionamento ou desbloquear uma leitura simbólica",
      palavras:
        "jogo do amor, quiz de relacionamento, teste de compatibilidade, leitura amorosa, autoconhecimento amoroso, dinâmica de casal",
      perguntas: [
        "Como funciona o Jogo do Amor?",
        "Para quem é o Jogo do Amor?",
        "O resultado é garantido?",
        "O que recebo no resultado completo?",
        "Meus dados ficam protegidos?",
      ],
      paginasPublicas:
        "home, como funciona, FAQ, página de venda, termos e privacidade",
      paginasNoIndex:
        "resultado completo, área paga, entrega, admin, checkout interno, dados de usuário",
      promessaSegura:
        "experiência simbólica, reflexiva, informativa e de entretenimento",
      naoProm: [
        "amor garantido ou salvar relacionamento",
        "previsão do futuro",
        "diagnóstico clínico ou terapia",
        "compatibilidade garantida",
        ...GENERIC_NAO_PROM,
      ],
    };
  }

  return {
    tipo: ctx.appDoes?.trim() || "(descreva o que seu app faz em Contexto do meu app)",
    publico: ctx.audience?.trim() || "(descreva o público)",
    intencao:
      ctx.mainAction?.trim()
        ? `${ctx.mainAction.trim()} ou entender se este app resolve o problema`
        : "entender o que o app faz e decidir se vale usar/comprar",
    palavras:
      "(liste 5–10 termos que seu público realmente digitaria; evite termos genéricos demais)",
    perguntas: [
      "Como funciona este app?",
      "Para quem é?",
      "O que recebo se comprar/usar?",
      "Quanto custa e como pago?",
      "Meus dados ficam protegidos?",
    ],
    paginasPublicas:
      "home, como funciona, FAQ, página de venda, termos e privacidade",
    paginasNoIndex:
      "área paga, entrega, painel admin, checkout interno e qualquer página com dado de usuário",
    promessaSegura:
      ctx.promise?.trim() || "experiência útil, clara e responsável (sem garantir resultado)",
    naoProm: GENERIC_NAO_PROM,
  };
}

export function ResumoSeoGeoCard() {
  const { context, isFilled, openEditor } = useProjectContext();
  const s = useMemo(() => buildSuggestion(context), [context]);

  return (
    <GlassCard className="mb-6 p-5 md:p-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
          <Search size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
            Resumo SEO e GEO{context.appName ? ` — ${context.appName}` : ""}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Crie páginas públicas úteis, responda dúvidas reais e deixe
            claro para buscadores e IA o que seu app faz, para quem é e
            quais limites ele tem.
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
          ["Tipo de app", s.tipo],
          ["Público buscador", s.publico],
          ["Intenção de busca", s.intencao],
          ["Palavras iniciais sugeridas", s.palavras],
          ["Páginas públicas recomendadas", s.paginasPublicas],
          ["Páginas que NÃO devem ser indexadas", s.paginasNoIndex],
        ].map(([term, def]) => (
          <div key={term} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <dt className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">{term}</dt>
            <dd className="text-foreground/90 leading-relaxed">{def}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 rounded-lg border border-sky-400/30 bg-sky-400/10 p-3 text-[13px] text-sky-100 flex items-start gap-2">
        <Bot size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Perguntas que o app pode responder (FAQ e GEO):</div>
          <ul className="list-disc list-inside space-y-0.5">
            {s.perguntas.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-[13px] text-emerald-100 flex items-start gap-2">
        <ShieldCheck size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Promessa segura:</div>
          {s.promessaSegura}
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-[13px] text-rose-100 flex items-start gap-2">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">O que NÃO prometer no SEO/GEO:</div>
          <ul className="list-disc list-inside space-y-0.5">
            {s.naoProm.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-3 text-[12px] text-muted-foreground leading-relaxed">
        Esta etapa não garante ranqueamento, tráfego nem vendas. Ela
        organiza seu conteúdo para que pessoas, buscadores e ferramentas
        de IA entendam seu app com clareza e sem distorção.
      </p>
    </GlassCard>
  );
}

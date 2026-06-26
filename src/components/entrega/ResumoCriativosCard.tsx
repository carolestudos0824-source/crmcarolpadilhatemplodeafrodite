import { useMemo } from "react";
import { Image as ImageIcon, AlertTriangle, ShieldCheck, Sparkles, Layers } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useProjectContext, type ProjectContext } from "@/hooks/useProjectContext";

/**
 * Resumo estratégico de criativos para o app em foco.
 * Não cria anúncio real, não integra Meta/Google Ads, não promete resultado.
 */

const norm = (s: string) => s.toLowerCase();

type Suggestion = {
  tipo: string;
  oferta: string;
  publico: string;
  angulo: string;
  formatos: string;
  formatosPagos: string;
  cta: string;
  preco: string;
  gatilho: string;
  metrica: string;
  naoProm: string[];
  angulosSugeridos: [string, string][];
};

const ANTES_ANUNCIO_PAGO = [
  "oferta clara",
  "página funcionando",
  "checkout ou próximo passo testado",
  "entrega protegida",
  "promessa segura",
  "pelo menos 3 variações de criativo",
  "métrica principal definida",
  "verba inicial controlada",
  "critério de pausa definido",
];

const GENERIC_NAO_PROM = [
  "vendas garantidas",
  "ROI garantido",
  "tráfego garantido",
  "resultado garantido",
  "depoimento, avaliação ou print inventado",
];

const NAO_PUBLICAR = [
  "promete resultado garantido",
  "usa medo ou manipulação emocional",
  "expõe dados pessoais",
  "usa print falso",
  "inventa depoimento",
  "parece diagnóstico profissional",
  "o CTA não está claro",
  "a oferta não aparece",
  "o criativo não funciona no celular",
];

function buildSuggestion(ctx: ProjectContext): Suggestion {
  const hay = norm(
    `${ctx.appName} ${ctx.appDoes} ${ctx.audience} ${ctx.problem} ${ctx.promise} ${ctx.productSold}`,
  );
  const has = (...w: string[]) => w.some((x) => hay.includes(x));

  if (has("jogo do amor", "amor", "relacionament", "casal", "namor")) {
    return {
      tipo: "jogo/quiz interativo de relacionamento",
      oferta: "desbloquear o resultado completo do Jogo do Amor",
      publico:
        "pessoas interessadas em relacionamento, autoconhecimento amoroso, reflexão afetiva, compatibilidade simbólica ou dinâmica de casal",
      angulo:
        "curiosidade, reflexão, diversão, autoconhecimento e experiência simbólica",
      formatos:
        "Story, Reels curto, post carrossel, card estático e direct/WhatsApp",
      formatosPagos:
        "criativo estático para Meta Ads, vídeo curto para anúncio, variação de headline, variação de CTA e criativo para teste A/B",
      cta: '"Começar o jogo", "Ver meu resultado completo" ou "Fazer o teste agora"',
      preco: "R$ 17 a R$ 47 para teste inicial, quando fizer sentido",
      gatilho:
        "depois que a pessoa responde parte do jogo e quer ver o resultado completo",
      metrica:
        "clique no CTA, resposta no direct, início do jogo, lead, compra, CTR ou custo por resultado",
      naoProm: [
        "amor garantido ou salvar relacionamento",
        "prever futuro",
        "diagnóstico clínico ou terapia",
        "compatibilidade garantida",
        ...GENERIC_NAO_PROM,
      ],
      angulosSugeridos: [
        ["Curiosidade", "O que seu jeito de amar revela?"],
        ["Reflexão", "Responda e veja uma leitura simbólica sobre sua vida amorosa."],
        ["Diversão", "Faça o jogo e descubra uma perspectiva diferente sobre relacionamento."],
        ["Resultado completo", "Comece grátis e desbloqueie sua leitura completa."],
        ["Casal", "Use como ponto de partida para uma conversa leve."],
      ],
    };
  }

  return {
    tipo: ctx.appDoes?.trim() || "(descreva o que seu app faz em Contexto do meu app)",
    oferta: ctx.productSold?.trim() || "(defina a oferta principal em Contexto do meu app)",
    publico: ctx.audience?.trim() || "(descreva o público em Contexto do meu app)",
    angulo:
      "curiosidade, clareza, dor real e prova honesta (sem promessa exagerada)",
    formatos: "Story, Reels curto, post carrossel, card estático e direct/WhatsApp",
    formatosPagos:
      "criativo estático para Meta Ads, vídeo curto para anúncio, variação de headline, variação de CTA e criativo para teste A/B",
    cta: ctx.mainAction?.trim()
      ? `"${ctx.mainAction.trim()}"`
      : '"Testar agora" ou "Quero saber mais"',
    preco:
      ctx.pricingModel?.trim() ||
      "use um preço pequeno de teste antes de definir o final",
    gatilho:
      "quando a pessoa entende a oferta e percebe valor — não force compra antes disso",
    metrica:
      "cliques no CTA, respostas, leads, dúvidas repetidas, compras, CTR ou custo por resultado",
    naoProm: GENERIC_NAO_PROM,
    angulosSugeridos: [
      ["Curiosidade", "Use uma pergunta forte sobre a dor do público."],
      ["Reflexão", "Mostre o problema sob um ângulo novo."],
      ["Prova honesta", "Mostre como o app funciona de verdade, sem inventar resultado."],
      ["Convite", "Convide para testar grátis ou começar pequeno."],
      ["Bastidor", "Mostre quem você é e por que criou o app."],
    ],
  };
}

export function ResumoCriativosCard() {
  const { context, isFilled, openEditor } = useProjectContext();
  const s = useMemo(() => buildSuggestion(context), [context]);

  return (
    <GlassCard className="mb-6 p-5 md:p-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
          <ImageIcon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
            Resumo de criativos{context.appName ? ` — ${context.appName}` : ""}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Use este resumo como base para criar peças, copies e variações
            que gerem curiosidade, cliques e respostas reais — sem prometer
            resultado garantido.
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
          ["Oferta principal", s.oferta],
          ["Público inicial", s.publico],
          ["Ângulo criativo seguro", s.angulo],
          ["Formatos orgânicos recomendados", s.formatos],
          ["Formatos pagos recomendados", s.formatosPagos],
          ["CTA sugerido", s.cta],
          ["Preço sugerido", s.preco],
          ["Gatilho de compra", s.gatilho],
        ].map(([term, def]) => (
          <div key={term} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <dt className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">{term}</dt>
            <dd className="text-foreground/90 leading-relaxed">{def}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 rounded-lg border border-sky-400/30 bg-sky-400/10 p-3 text-[13px] text-sky-100 flex items-start gap-2">
        <ShieldCheck size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Métrica principal:</div>
          {s.metrica}
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-accent/30 bg-accent/10 p-3 text-[13px] text-foreground/90">
        <div className="flex items-center gap-2 font-semibold mb-2 text-accent">
          <Sparkles size={14} /> Ângulos sugeridos para testar
        </div>
        <ul className="space-y-1">
          {s.angulosSugeridos.map(([k, v]) => (
            <li key={k}>
              <span className="text-accent font-semibold">{k}:</span> {v}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-[13px] text-emerald-100">
        <div className="flex items-center gap-2 font-semibold mb-2">
          <Layers size={14} /> Diferencie os termos
        </div>
        <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-0.5">
          <li><b>Criativo:</b> a peça inteira (imagem ou vídeo).</li>
          <li><b>Copy:</b> o texto que acompanha a peça.</li>
          <li><b>Headline:</b> a frase principal de impacto.</li>
          <li><b>Gancho:</b> os primeiros segundos/linhas que prendem.</li>
          <li><b>CTA:</b> a ação clara que você pede.</li>
          <li><b>Ângulo:</b> a perspectiva escolhida (dor, curiosidade…).</li>
          <li><b>Variação:</b> mesma ideia com mudança pontual.</li>
          <li><b>Teste A/B:</b> comparação entre duas versões.</li>
          <li><b>Peça orgânica:</b> publicada sem pagar mídia.</li>
          <li><b>Peça paga:</b> impulsionada via anúncio.</li>
          <li><b>CTR:</b> taxa de clique (cliques ÷ impressões).</li>
          <li><b>Custo por resultado:</b> quanto custou cada ação medida (clique, lead, compra).</li>
        </ul>
      </div>

      <div className="mt-3 rounded-lg border border-sky-400/30 bg-sky-400/10 p-3 text-[13px] text-sky-100 flex items-start gap-2">
        <ShieldCheck size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Antes de usar em anúncio pago:</div>
          <ul className="list-disc list-inside space-y-0.5">
            {ANTES_ANUNCIO_PAGO.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-[13px] text-amber-100 flex items-start gap-2">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Não publicar criativo se…</div>
          <ul className="list-disc list-inside space-y-0.5">
            {NAO_PUBLICAR.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-[13px] text-rose-100 flex items-start gap-2">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">O que NÃO prometer:</div>
          <ul className="list-disc list-inside space-y-0.5">
            {s.naoProm.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-3 text-[12px] text-muted-foreground leading-relaxed">
        Esta etapa orienta você a criar criativos para o SEU app. Não cria
        campanha paga real, não integra Meta/Google Ads e não promete
        vendas, tráfego ou ROI garantidos.
      </p>
    </GlassCard>
  );
}

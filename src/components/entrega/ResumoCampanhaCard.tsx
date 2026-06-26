import { useMemo } from "react";
import { Megaphone, AlertTriangle, ShieldCheck, CalendarDays } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useProjectContext, type ProjectContext } from "@/hooks/useProjectContext";

/**
 * Resumo de campanha baseado no Contexto do Projeto em foco. Orienta a
 * aluna a rodar uma PRIMEIRA campanha pequena, segura e mensurável para
 * o APP DELA. Não cria campanha paga real, não integra Meta/Google Ads,
 * não altera checkout real da Fábrica de Apps.
 */

const norm = (s: string) => s.toLowerCase();

type Suggestion = {
  tipo: string;
  oferta: string;
  publico: string;
  canal: string;
  mensagem: string;
  cta: string;
  precoSugerido: string;
  gatilho: string;
  metrica: string;
  naoProm: string[];
};

const GENERIC_NAO_PROM = [
  "vendas garantidas",
  "ROI garantido",
  "tráfego garantido",
  "resultado garantido",
  "avaliações, notas ou depoimentos inventados",
];

const PLANO_7_DIAS: [string, string][] = [
  ["Dia 1", "Revisar oferta, promessa e CTA."],
  ["Dia 2", "Criar 3 mensagens (WhatsApp/direct/post)."],
  ["Dia 3", "Criar 3 criativos simples (imagem, story, vídeo curto)."],
  ["Dia 4", "Enviar para um grupo pequeno e real."],
  ["Dia 5", "Medir cliques, respostas e dúvidas repetidas."],
  ["Dia 6", "Ajustar promessa, CTA ou preço a partir do que ouviu."],
  ["Dia 7", "Decidir: continuar, pausar ou melhorar antes de escalar."],
];

const NAO_ESCALAR = [
  "ninguém entende a oferta",
  "ninguém clica no CTA",
  "muitas pessoas perguntam a mesma dúvida (sinal de copy confusa)",
  "checkout ou link de pagamento está quebrado",
  "entrega não está clara",
  "promessa parece exagerada para quem viu",
  "experiência no celular está ruim",
  "preço gera rejeição sem você entender o porquê",
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
      canal: "Instagram, WhatsApp, direct, Reels curto, Stories ou lista pequena",
      mensagem:
        "experiência simbólica, reflexiva e divertida sobre vida amorosa",
      cta: '"Começar o jogo" ou "Ver meu resultado completo"',
      precoSugerido: "R$ 17 a R$ 47 para teste inicial (ajuste conforme resposta real)",
      gatilho:
        "depois que a pessoa responde parte do jogo e quer ver o resultado completo",
      metrica:
        "cliques no CTA, respostas no direct/WhatsApp, leads, compras ou pedidos de acesso",
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
    oferta:
      ctx.productSold?.trim() || "(defina a oferta principal em Contexto do meu app)",
    publico: ctx.audience?.trim() || "(descreva o público em Contexto do meu app)",
    canal: "Instagram, WhatsApp, direct, Stories ou lista pequena (comece por 1 só)",
    mensagem: ctx.promise?.trim() || "(use sua promessa real, sem garantir resultado)",
    cta: ctx.mainAction?.trim() ? `"${ctx.mainAction.trim()}"` : '"Testar agora" ou "Quero saber mais"',
    precoSugerido:
      ctx.pricingModel?.trim() ||
      "use um preço pequeno de teste antes de definir o final",
    gatilho:
      "quando a pessoa entende a oferta e percebe valor — não force compra antes disso",
    metrica:
      "cliques no CTA, respostas, leads, dúvidas repetidas, compras ou pedidos de acesso",
    naoProm: GENERIC_NAO_PROM,
  };
}

export function ResumoCampanhaCard() {
  const { context, isFilled, openEditor } = useProjectContext();
  const s = useMemo(() => buildSuggestion(context), [context]);

  return (
    <GlassCard className="mb-6 p-5 md:p-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
          <Megaphone size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
            Resumo de campanha{context.appName ? ` — ${context.appName}` : ""}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Crie uma campanha pequena para testar se pessoas reais
            entendem, clicam e demonstram interesse pela sua oferta.
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
          ["Canal recomendado", s.canal],
          ["Mensagem principal", s.mensagem],
          ["CTA sugerido", s.cta],
          ["Preço inicial sugerido", s.precoSugerido],
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

      <div className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-[13px] text-emerald-100">
        <div className="flex items-center gap-2 font-semibold mb-2">
          <CalendarDays size={14} /> Plano de teste de 7 dias
        </div>
        <ul className="space-y-0.5">
          {PLANO_7_DIAS.map(([d, t]) => (
            <li key={d}>
              <span className="text-emerald-200 font-semibold">{d}:</span> {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-[13px] text-amber-100 flex items-start gap-2">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Não escalar se…</div>
          <ul className="list-disc list-inside space-y-0.5">
            {NAO_ESCALAR.map((x) => (
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
        Esta etapa não promete vendas, tráfego nem ROI garantidos. Ela
        ajuda você a testar pequeno, ouvir pessoas reais e decidir com
        base em dado, não em empolgação.
      </p>
    </GlassCard>
  );
}

import { useMemo } from "react";
import {
  BarChart3,
  AlertTriangle,
  ShieldCheck,
  Route,
  TrendingDown,
  Lock,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useProjectContext, type ProjectContext } from "@/hooks/useProjectContext";

/**
 * Resumo estratégico de métricas para o app em foco.
 * Não instala analytics real, não cria eventos no banco e não promete crescimento.
 */

const norm = (s: string) => s.toLowerCase();

type Suggestion = {
  tipo: string;
  acao: string;
  funil: string[];
  essenciais: string[];
  campanha: string[];
  venda: string[];
  entrega: string[];
  pontoCritico: string;
  decisao: string;
};

function buildSuggestion(ctx: ProjectContext): Suggestion {
  const hay = norm(
    `${ctx.appName} ${ctx.appDoes} ${ctx.audience} ${ctx.problem} ${ctx.promise} ${ctx.productSold}`,
  );
  const has = (...w: string[]) => w.some((x) => hay.includes(x));

  if (has("jogo do amor", "amor", "relacionament", "casal", "namor", "quiz")) {
    return {
      tipo: "jogo/quiz interativo de relacionamento",
      acao: "responder o quiz e desbloquear o resultado completo",
      funil: [
        "visita",
        "começa o jogo",
        "responde perguntas",
        "vê prévia",
        "clica no CTA",
        "vai para checkout",
        "compra",
        "acessa resultado completo",
      ],
      essenciais: [
        "visitas",
        "início do jogo",
        "conclusão do quiz",
        "clique no CTA",
        "checkout iniciado",
        "compra",
        "acesso à entrega",
        "abandono",
        "suporte",
      ],
      campanha: [
        "clique",
        "CTR",
        "resposta",
        "lead",
        "custo por resultado",
        "criativo vencedor",
        "objeções",
      ],
      venda: [
        "clique no botão de compra",
        "checkout iniciado",
        "compra concluída",
        "taxa de conversão",
        "abandono no checkout",
      ],
      entrega: [
        "comprador acessou resultado",
        "recuperação de acesso",
        "pedido de suporte",
        "problema de entrega",
      ],
      pontoCritico:
        "pessoas podem abandonar antes de ver a prévia, antes de clicar no CTA ou no checkout",
      decisao:
        "medir antes de mudar layout, preço, promessa ou campanha",
    };
  }

  return {
    tipo: ctx.appDoes?.trim() || "(descreva o app em Contexto do meu app)",
    acao:
      ctx.mainAction?.trim() ||
      "(defina a ação principal em Contexto do meu app)",
    funil: [
      "entrada",
      "primeira ação",
      "etapa intermediária",
      "CTA",
      "checkout",
      "compra",
      "entrega",
      "retenção ou retorno",
    ],
    essenciais: [
      "visitas",
      "cliques",
      "início do fluxo",
      "conclusão do fluxo",
      "clique no CTA",
      "lead",
      "checkout iniciado",
      "compra",
      "entrega acessada",
      "abandono",
      "suporte",
    ],
    campanha: [
      "clique",
      "CTR",
      "lead",
      "custo por resultado",
      "criativo vencedor",
      "objeções",
    ],
    venda: [
      "clique no botão de compra",
      "checkout iniciado",
      "compra concluída",
      "taxa de conversão",
      "abandono no checkout",
    ],
    entrega: [
      "comprador acessou a entrega",
      "recuperação de acesso",
      "pedido de suporte",
      "problema de entrega",
    ],
    pontoCritico:
      "as pessoas costumam parar entre o primeiro acesso, o CTA e o checkout — observe esses três pontos primeiro",
    decisao:
      "medir antes de mudar layout, preço, promessa ou campanha",
  };
}

const QUEDAS: [string, string][] = [
  ["Poucas visitas", "problema de divulgação ou criativo"],
  ["Poucos inícios do fluxo", "promessa ou primeira tela fraca"],
  ["Muito abandono no meio do fluxo", "fluxo longo, confuso ou pouco interessante"],
  ["Poucos cliques no CTA", "prévia ou oferta fraca"],
  ["Muitos cliques e poucas compras", "preço, confiança, checkout ou promessa desalinhada"],
  ["Comprou e não acessou", "problema de entrega, login ou suporte"],
];

const NAO_DECIDA = [
  "não refaça o app inteiro com poucos dados",
  "não mude preço sem entender abandono",
  "não troque promessa sem olhar cliques e CTA",
  "não escale campanha sem conversão mínima",
  "não culpe o criativo se a página ou checkout estão quebrados",
  "não prometa resultado garantido",
];

const MINIMAS = [
  "pelo menos algumas dezenas de visitas antes de mudar a página",
  "pelo menos alguns cliques no CTA antes de julgar a oferta",
  "pelo menos algumas tentativas de checkout antes de julgar preço",
  "feedback qualitativo se o volume ainda for baixo",
];

export function ResumoMetricasCard() {
  const { context, isFilled, openEditor } = useProjectContext();
  const s = useMemo(() => buildSuggestion(context), [context]);

  return (
    <GlassCard className="mb-6 p-5 md:p-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
          <BarChart3 size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
            Resumo de métricas{context.appName ? ` — ${context.appName}` : ""}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Meça o caminho real do usuário antes de mudar layout, promessa,
            preço ou campanha.
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
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <dt className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">Tipo de app</dt>
          <dd className="text-foreground/90 leading-relaxed">{s.tipo}</dd>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <dt className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">Ação principal</dt>
          <dd className="text-foreground/90 leading-relaxed">{s.acao}</dd>
        </div>
      </dl>

      <div className="mt-3 rounded-lg border border-accent/30 bg-accent/10 p-3 text-[13px] text-foreground/90">
        <div className="flex items-center gap-2 font-semibold mb-2 text-accent">
          <Route size={14} /> Funil principal
        </div>
        <div className="flex flex-wrap gap-1.5">
          {s.funil.map((step, i) => (
            <span key={step} className="inline-flex items-center gap-1">
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">{step}</span>
              {i < s.funil.length - 1 && <span className="text-muted-foreground">→</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 grid sm:grid-cols-2 gap-3 text-[13px]">
        {[
          ["Métricas essenciais", s.essenciais],
          ["Métricas de campanha/criativo", s.campanha],
          ["Métricas de venda", s.venda],
          ["Métricas de entrega", s.entrega],
        ].map(([title, list]) => (
          <div key={title as string} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">{title}</div>
            <ul className="list-disc list-inside space-y-0.5 text-foreground/90">
              {(list as string[]).map((m) => <li key={m}>{m}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-[13px] text-amber-100 flex items-start gap-2">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Ponto crítico provável:</div>
          {s.pontoCritico}
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-sky-400/30 bg-sky-400/10 p-3 text-[13px] text-sky-100 flex items-start gap-2">
        <ShieldCheck size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Decisão recomendada:</div>
          {s.decisao}
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-[13px] text-rose-100">
        <div className="flex items-center gap-2 font-semibold mb-2">
          <TrendingDown size={14} /> O que cada queda significa
        </div>
        <ul className="space-y-1">
          {QUEDAS.map(([k, v]) => (
            <li key={k}><b>{k}:</b> {v}</li>
          ))}
        </ul>
      </div>

      <div className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-[13px] text-amber-100">
        <div className="flex items-center gap-2 font-semibold mb-2">
          <AlertTriangle size={14} /> Não decida cedo demais
        </div>
        <ul className="list-disc list-inside space-y-0.5">
          {NAO_DECIDA.map((x) => <li key={x}>{x}</li>)}
        </ul>
      </div>

      <div className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-[13px] text-emerald-100">
        <div className="font-semibold mb-2">Métricas mínimas antes de decidir</div>
        <ul className="list-disc list-inside space-y-0.5">
          {MINIMAS.map((x) => <li key={x}>{x}</li>)}
        </ul>
      </div>

      <div className="mt-3 rounded-lg border border-sky-400/30 bg-sky-400/10 p-3 text-[13px] text-sky-100 flex items-start gap-2">
        <Lock size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Privacidade:</div>
          Meça comportamento de uso sem expor dados pessoais sensíveis. Não
          registre respostas íntimas, dados de pagamento ou informações
          privadas em eventos públicos.
        </div>
      </div>

      <p className="mt-3 text-[12px] text-muted-foreground leading-relaxed">
        Esta etapa orienta você a medir o SEU app. Não instala analytics real,
        não cria eventos no banco e não promete crescimento, conversão ou
        vendas garantidas.
      </p>
    </GlassCard>
  );
}

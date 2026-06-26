import { useMemo } from "react";
import {
  Users,
  AlertTriangle,
  ShieldCheck,
  Route,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Target,
  Lock,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useProjectContext, type ProjectContext } from "@/hooks/useProjectContext";

/**
 * Resumo estratégico de validação para o app em foco.
 * Não promete validação, vendas ou aceitação garantida.
 */

const norm = (s: string) => s.toLowerCase();

type Suggestion = {
  tipo: string;
  acao: string;
  publico: string;
  hipotese: string;
  oferta: string;
  preco: string;
  sinaisFortes: string[];
  sinaisFracos: string[];
  objecoes: string[];
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
      publico:
        "pessoas interessadas em relacionamento, autoconhecimento amoroso, reflexão afetiva, compatibilidade simbólica ou dinâmica de casal",
      hipotese:
        "as pessoas entendem o jogo, começam o fluxo, querem ver a prévia e consideram desbloquear o resultado completo",
      oferta: "prévia gratuita + resultado completo pago",
      preco: "R$ 17 a R$ 47 para teste",
      sinaisFortes: [
        "pessoa começa o jogo",
        "termina as perguntas",
        "clica no CTA",
        "pergunta preço",
        "tenta comprar",
        "deixa contato",
        "indica para alguém",
      ],
      sinaisFracos: [
        "diz 'gostei' mas não clica",
        "não termina o quiz",
        "não pergunta nada",
        "não demonstra intenção",
      ],
      objecoes: [
        "privacidade",
        "confiança na marca",
        "preço",
        "promessa",
        "curiosidade insuficiente",
        "medo de parecer previsão ou diagnóstico",
      ],
      decisao:
        "validar com 10 pessoas reais antes de ampliar divulgação",
    };
  }

  return {
    tipo: ctx.appDoes?.trim() || "(descreva o app em Contexto do meu app)",
    acao:
      ctx.mainAction?.trim() ||
      "(defina a ação principal em Contexto do meu app)",
    publico: ctx.audience?.trim() || "(descreva o público em Contexto do meu app)",
    hipotese:
      "as pessoas entendem a promessa, completam a ação principal e demonstram interesse no próximo passo",
    oferta:
      ctx.productSold?.trim() || "(defina a oferta em Contexto do meu app)",
    preco: "definir faixa pequena de teste antes de escalar",
    sinaisFortes: [
      "completa a ação principal",
      "clica no CTA",
      "pergunta preço",
      "pede acesso",
      "volta",
      "indica",
    ],
    sinaisFracos: [
      "elogio sem ação",
      "abandono cedo",
      "resposta vaga",
      "'eu usaria' sem teste",
    ],
    objecoes: ["preço", "confiança", "clareza da promessa", "privacidade"],
    decisao: "validar com 10 pessoas reais antes de ampliar divulgação",
  };
}

const E_VALIDACAO = [
  "pessoa entende a promessa",
  "pessoa começa o app",
  "pessoa completa a ação principal",
  "pessoa entende o que recebe",
  "pessoa demonstra interesse no próximo passo",
  "pessoa aceita deixar contato, pagar, pedir acesso ou compartilhar",
  "pessoa dá objeção concreta",
];

const NAO_E_VALIDACAO = [
  "elogio educado",
  "opinião de amigo sem teste",
  "curtida em post",
  "visualização sem clique",
  "resposta vaga",
  "'eu usaria' sem ação",
  "uma única opinião isolada",
];

const CRITERIOS_AVANCAR = [
  "pelo menos 10 pessoas convidadas",
  "pelo menos 5 testaram de verdade",
  "pelo menos 3 chegaram até a prévia ou ação principal",
  "pelo menos 2 demonstraram intenção real",
  "objeções principais anotadas",
  "próximo ajuste definido",
];

const SE_NAO_VALIDAR = [
  "revisar promessa",
  "revisar primeira tela",
  "encurtar ou clarear fluxo",
  "melhorar CTA",
  "melhorar oferta",
  "ajustar preço",
  "corrigir checkout ou entrega",
  "testar novamente com poucas pessoas",
];

const NAO_FAZER = [
  "não prometer validação, vendas ou aceitação garantida",
  "não decidir com base em uma única opinião isolada",
  "não pedir dados sensíveis ou respostas íntimas",
  "não ampliar divulgação antes de validar com poucas pessoas",
];

export function ResumoValidacaoCard() {
  const { context, isFilled, openEditor } = useProjectContext();
  const s = useMemo(() => buildSuggestion(context), [context]);

  return (
    <GlassCard className="mb-6 p-5 md:p-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
          <Users size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
            Resumo de validação{context.appName ? ` — ${context.appName}` : ""}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Valide com comportamento real, não com elogio educado. Teste com
            poucas pessoas antes de ampliar divulgação.
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
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 sm:col-span-2">
          <dt className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">Público inicial</dt>
          <dd className="text-foreground/90 leading-relaxed">{s.publico}</dd>
        </div>
      </dl>

      <div className="mt-3 rounded-lg border border-accent/30 bg-accent/10 p-3 text-[13px] text-foreground/90 flex items-start gap-2">
        <Target size={14} className="text-accent shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-accent mb-1">Hipótese a validar</div>
          {s.hipotese}
        </div>
      </div>

      <div className="mt-3 grid sm:grid-cols-2 gap-3 text-[13px]">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">Oferta a validar</div>
          <div className="text-foreground/90">{s.oferta}</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">Preço inicial sugerido</div>
          <div className="text-foreground/90">{s.preco}</div>
        </div>
      </div>

      <div className="mt-3 grid sm:grid-cols-2 gap-3 text-[13px]">
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-emerald-100">
          <div className="flex items-center gap-2 font-semibold mb-2">
            <CheckCircle2 size={14} /> Sinal forte
          </div>
          <ul className="list-disc list-inside space-y-0.5">
            {s.sinaisFortes.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
        <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-amber-100">
          <div className="flex items-center gap-2 font-semibold mb-2">
            <XCircle size={14} /> Sinal fraco
          </div>
          <ul className="list-disc list-inside space-y-0.5">
            {s.sinaisFracos.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-[13px] text-rose-100">
        <div className="flex items-center gap-2 font-semibold mb-2">
          <AlertTriangle size={14} /> Objeções esperadas
        </div>
        <ul className="list-disc list-inside space-y-0.5">
          {s.objecoes.map((x) => <li key={x}>{x}</li>)}
        </ul>
      </div>

      <div className="mt-3 rounded-lg border border-sky-400/30 bg-sky-400/10 p-3 text-[13px] text-sky-100 flex items-start gap-2">
        <ShieldCheck size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Decisão recomendada</div>
          {s.decisao}
        </div>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-3 text-[13px]">
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-emerald-100">
          <div className="flex items-center gap-2 font-semibold mb-2">
            <CheckCircle2 size={14} /> O que é validação de verdade
          </div>
          <ul className="list-disc list-inside space-y-0.5">
            {E_VALIDACAO.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
        <div className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-rose-100">
          <div className="flex items-center gap-2 font-semibold mb-2">
            <XCircle size={14} /> O que NÃO é validação
          </div>
          <ul className="list-disc list-inside space-y-0.5">
            {NAO_E_VALIDACAO.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-3 grid sm:grid-cols-2 gap-3 text-[13px]">
        <div className="rounded-lg border border-accent/30 bg-accent/10 p-3 text-foreground/90">
          <div className="flex items-center gap-2 font-semibold mb-2 text-accent">
            <Route size={14} /> Critérios para avançar
          </div>
          <ul className="list-disc list-inside space-y-0.5">
            {CRITERIOS_AVANCAR.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
        <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-amber-100">
          <div className="flex items-center gap-2 font-semibold mb-2">
            <Lightbulb size={14} /> Se não validar, o que fazer
          </div>
          <ul className="list-disc list-inside space-y-0.5">
            {SE_NAO_VALIDAR.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-sky-400/30 bg-sky-400/10 p-3 text-[13px] text-sky-100 flex items-start gap-2">
        <Lock size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Aviso de privacidade</div>
          Não peça respostas íntimas, dados sensíveis ou informações privadas
          desnecessárias durante a validação. Colete apenas o necessário para
          entender clareza, interesse e objeções.
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-[13px] text-amber-100">
        <div className="flex items-center gap-2 font-semibold mb-2">
          <AlertTriangle size={14} /> O que NÃO fazer
        </div>
        <ul className="list-disc list-inside space-y-0.5">
          {NAO_FAZER.map((x) => <li key={x}>{x}</li>)}
        </ul>
      </div>

      <p className="mt-3 text-[12px] text-muted-foreground leading-relaxed">
        Esta etapa orienta você a validar o SEU app com comportamento real.
        Não promete validação, vendas ou aceitação garantida.
      </p>
    </GlassCard>
  );
}

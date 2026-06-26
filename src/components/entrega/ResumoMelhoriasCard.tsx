import { useMemo } from "react";
import {
  GitBranch,
  AlertTriangle,
  ShieldCheck,
  Route,
  Bug,
  Sparkles,
  Layers,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useProjectContext, type ProjectContext } from "@/hooks/useProjectContext";

/**
 * Resumo estratégico de melhorias e versões para o app em foco.
 * Não altera sistemas reais, não promete melhoria garantida.
 */

const norm = (s: string) => s.toLowerCase();

type Suggestion = {
  tipo: string;
  acao: string;
  funil: string[];
  metricas: string[];
  melhorias: string[];
  bugs: string[];
  proximaVersao: string;
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
        "checkout",
        "compra",
        "acessa resultado completo",
      ],
      metricas: [
        "início do jogo",
        "conclusão do quiz",
        "clique no CTA",
        "checkout iniciado",
        "compra",
        "entrega acessada",
        "abandono",
        "objeções",
      ],
      melhorias: [
        "primeira tela",
        "perguntas do quiz",
        "prévia do resultado",
        "CTA",
        "checkout",
        "entrega protegida",
        "mobile",
        "promessa responsável",
      ],
      bugs: [
        "login quebrado",
        "checkout errado",
        "resultado não liberado",
        "entrega pública sem proteção",
        "erro mobile",
        "botão principal quebrado",
      ],
      proximaVersao:
        "corrigir primeiro o maior gargalo identificado nas métricas (provavelmente CTA, checkout ou entrega)",
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
      "retorno",
    ],
    metricas: [
      "início do fluxo",
      "conclusão do fluxo",
      "clique no CTA",
      "checkout iniciado",
      "compra",
      "entrega acessada",
      "abandono",
      "objeções",
    ],
    melhorias: [
      "primeira tela",
      "fluxo principal",
      "CTA",
      "checkout",
      "entrega",
      "mobile",
      "promessa responsável",
    ],
    bugs: [
      "login quebrado",
      "checkout com erro",
      "entrega não liberada",
      "erro mobile",
      "botão principal sem ação",
    ],
    proximaVersao:
      "corrigir primeiro o maior gargalo identificado nas métricas",
  };
}

const DECIDIR: [string, string][] = [
  ["Ninguém começa o fluxo", "revisar promessa, primeira tela ou criativo"],
  ["Começam e abandonam", "revisar fluxo, perguntas ou clareza"],
  ["Veem a prévia e não clicam", "revisar CTA, oferta ou valor percebido"],
  ["Clicam e não compram", "revisar preço, confiança ou checkout"],
  ["Compram e não acessam", "revisar entrega, login ou suporte"],
  ["Muitos bugs", "corrigir bug antes de criar função nova"],
];

const TIPOS_MUDANCA = [
  "bug crítico",
  "ajuste pequeno",
  "melhoria de conversão",
  "melhoria de experiência",
  "melhoria visual",
  "nova funcionalidade",
  "versão maior",
  "dívida técnica",
];

const VERSOES: [string, string][] = [
  ["v1.0", "versão publicada"],
  ["v1.1", "correção pequena ou bug"],
  ["v1.2", "melhoria de conversão ou clareza"],
  ["v1.3", "melhoria de experiência/mobile"],
  ["v2.0", "mudança grande somente após validação"],
];

const NAO_FAZER = [
  "não refazer o app inteiro",
  "não mudar preço, promessa ou layout sem dado",
  "não mexer em login, checkout, entrega ou banco sem necessidade",
  "não prometer melhoria, conversão ou vendas garantidas",
];

export function ResumoMelhoriasCard() {
  const { context, isFilled, openEditor } = useProjectContext();
  const s = useMemo(() => buildSuggestion(context), [context]);

  return (
    <GlassCard className="mb-6 p-5 md:p-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
          <GitBranch size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
            Resumo de melhorias{context.appName ? ` — ${context.appName}` : ""}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Use métricas para priorizar a próxima versão. Melhore uma coisa por
            vez, teste e registre.
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
          <Route size={14} /> Funil crítico
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
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">
            Métricas que devem orientar melhorias
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-foreground/90">
            {s.metricas.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">
            Melhorias prováveis
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-foreground/90">
            {s.melhorias.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-[13px] text-rose-100">
        <div className="flex items-center gap-2 font-semibold mb-2">
          <Bug size={14} /> Bugs críticos possíveis
        </div>
        <ul className="list-disc list-inside space-y-0.5">
          {s.bugs.map((b) => <li key={b}>{b}</li>)}
        </ul>
      </div>

      <div className="mt-3 rounded-lg border border-sky-400/30 bg-sky-400/10 p-3 text-[13px] text-sky-100 flex items-start gap-2">
        <ShieldCheck size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Próxima versão sugerida:</div>
          {s.proximaVersao}
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-accent/30 bg-accent/10 p-3 text-[13px] text-foreground/90">
        <div className="flex items-center gap-2 font-semibold mb-2 text-accent">
          <Sparkles size={14} /> Como decidir o que melhorar primeiro
        </div>
        <ul className="space-y-1">
          {DECIDIR.map(([k, v]) => (
            <li key={k}><b>{k}:</b> {v}.</li>
          ))}
        </ul>
      </div>

      <div className="mt-3 grid sm:grid-cols-2 gap-3 text-[13px]">
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-emerald-100">
          <div className="flex items-center gap-2 font-semibold mb-2">
            <Layers size={14} /> Tipos de mudança
          </div>
          <ul className="list-disc list-inside space-y-0.5">
            {TIPOS_MUDANCA.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-emerald-100">
          <div className="flex items-center gap-2 font-semibold mb-2">
            <GitBranch size={14} /> Regra de versão segura
          </div>
          <ul className="space-y-0.5">
            {VERSOES.map(([v, d]) => (
              <li key={v}><b>{v}:</b> {d}</li>
            ))}
            <li className="text-[12px] text-emerald-200/80 mt-1">
              Sempre registrar o que mudou, por que mudou e o que testar.
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-sky-400/30 bg-sky-400/10 p-3 text-[13px] text-sky-100 flex items-start gap-2">
        <ShieldCheck size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Regra de segurança:</div>
          Antes de pedir uma melhoria ao Lovable, confirme o que deve ser
          preservado. Mudanças pequenas e testadas reduzem o risco de quebrar
          login, checkout, entrega ou dados.
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
        Esta etapa orienta você a evoluir o SEU app. Não altera sistemas reais,
        não cria nova feature automática e não promete melhoria, conversão ou
        vendas garantidas.
      </p>
    </GlassCard>
  );
}

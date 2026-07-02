import { useMemo } from "react";
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  ShieldCheck,
  Rocket,
  TestTube2,
  Megaphone,
  Ban,
  ArrowRight,
  Sparkles,
  Target,
  Globe,
  Smartphone,
  Store,
  Apple,
  Compass,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { AgentArchitectCard } from "@/components/entrega/AgentArchitectCard";
import { AGENT_MODULE_GUIDANCE } from "@/lib/agentModuleGuidance";
import { useProjectContext } from "@/hooks/useProjectContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { CHECKLIST_PHASES, type ModuleId } from "@/data/entregaModules";
import { PromptsExecutarEtapa } from "@/components/entrega/PromptsExecutarEtapa";
import { PROMPTS_CHECKLIST } from "@/data/promptsPosAppPronto";



type Props = {
  goTo: (id: ModuleId) => void;
};

const READINESS_LEVELS = [
  {
    min: 0,
    max: 49,
    label: "Não pronto",
    message: "Ainda não avance. Resolva os bloqueadores principais.",
    cls: "border-red-400/40 bg-red-500/10 text-red-200",
  },
  {
    min: 50,
    max: 69,
    label: "Pronto para teste pequeno",
    message: "Você pode testar com poucas pessoas, mas ainda não deve divulgar com força.",
    cls: "border-amber-400/40 bg-amber-500/10 text-amber-200",
  },
  {
    min: 70,
    max: 84,
    label: "Pronto para venda inicial",
    message: "Você pode fazer venda/teste inicial com cautela.",
    cls: "border-sky-400/40 bg-sky-500/10 text-sky-200",
  },
  {
    min: 85,
    max: 100,
    label: "Pronto para divulgação controlada",
    message: "Você está pronto para divulgar de forma controlada, mantendo testes e métricas.",
    cls: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  },
] as const;

function getReadiness(pct: number) {
  return (
    READINESS_LEVELS.find((l) => pct >= l.min && pct <= l.max) ??
    READINESS_LEVELS[0]
  );
}

const BLOQUEADOR_PREFIX = "blocker__";
const BLOQUEADORES = [
  "Login não funciona",
  "Checkout não foi testado",
  "Entrega paga está pública",
  "Acesso ao resultado não está protegido",
  "Botão principal quebrado",
  "App ruim no celular",
  "Promessa exagerada ou sensível",
  "Falta de Termos, Privacidade ou aviso de não garantia",
  "Usuário não entende qual é o próximo passo",
  "Comprador não sabe como acessar depois de pagar",
];

const PODE_TESTAR = [
  "Ideia e promessa estão claras",
  "MVP abre no celular",
  "Ação principal funciona",
  "CTA principal existe",
  "Entrega básica está compreensível",
  "Não há promessa exagerada",
  "Suporte ou contato existe",
];

const PODE_VENDER = [
  "Oferta clara",
  "Preço definido",
  "Checkout testado",
  "Página de obrigado existe",
  "Entrega protegida",
  "Comprador acessa o que comprou",
  "Recuperação de acesso existe",
  "Termos e Privacidade publicados",
  "Promessa responsável",
];

const PODE_DIVULGAR = [
  "App publicado e testado fora do editor",
  "Mobile aprovado",
  "Criativos prontos",
  "Métricas mínimas definidas",
  "Validação inicial feita",
  "Objeções principais anotadas",
  "Próximo ajuste definido",
];

const NAO_AVANCE = [
  "Ainda há erro crítico",
  "Checkout não foi testado",
  "Entrega está pública",
  "Usuário não entende o app",
  "CTA não está claro",
  "Promessa parece garantida",
  "App não funciona no celular",
  "Você ainda não testou com ninguém",
];

const JOGO_AMOR_ITEMS = [
  "Usuário entende que é uma experiência simbólica",
  "Pessoa consegue começar o jogo",
  "Pessoa consegue responder perguntas",
  "Pessoa vê prévia ou resultado parcial",
  "CTA para resultado completo aparece",
  "Checkout ou próximo passo está claro",
  "Resultado completo não fica público",
  "Promessa não garante amor, futuro ou compatibilidade",
  "Mobile funciona",
  "Suporte ou contato existe",
];

// Mapeamento fase → módulo da próxima ação recomendada
const PHASE_TO_NEXT_ACTION: { phaseIdx: number; moduleId: ModuleId; label: string }[] = [
  { phaseIdx: 0, moduleId: "planejar", label: "Revisar Planejar o App" },
  { phaseIdx: 1, moduleId: "construir", label: "Revisar Construir app" },
  { phaseIdx: 2, moduleId: "venda", label: "Revisar Página de venda" },
  { phaseIdx: 3, moduleId: "checkout", label: "Revisar Checkout e entrega" },
  { phaseIdx: 4, moduleId: "campanhas", label: "Revisar Campanhas e SEO" },
  { phaseIdx: 5, moduleId: "validacao", label: "Revisar Validação" },
];

function isGameLike(appDoes: string, appName: string, notes: string): boolean {
  const blob = `${appDoes} ${appName} ${notes}`.toLowerCase();
  return /jogo|quiz|game/.test(blob);
}

export function PainelProntidaoModule({ goTo }: Props) {
  const { context, isFilled } = useProjectContext();
  const { checklist, setChecklist } = useUserProgress();

  const appName = context.appName?.trim() || "seu app";
  const gameLike = isGameLike(context.appDoes, context.appName, context.notes);

  const phasesStats = useMemo(
    () =>
      CHECKLIST_PHASES.map((p, idx) => {
        const total = p.items.length;
        const done = p.items.filter((i) => !!checklist[`${p.phase}__${i}`]).length;
        return { idx, ...p, total, done };
      }),
    [checklist],
  );

  const overallDone = phasesStats.reduce((a, p) => a + p.done, 0);
  const overallTotal = phasesStats.reduce((a, p) => a + p.total, 0);
  const pct = overallTotal === 0 ? 0 : Math.round((overallDone / overallTotal) * 100);
  const hasCriticalBlocker = useMemo(
    () => BLOQUEADORES.some((item) => !!checklist[`${BLOQUEADOR_PREFIX}${item}`]),
    [checklist],
  );
  const readiness = hasCriticalBlocker ? READINESS_LEVELS[0] : getReadiness(pct);

  const firstIncompletePhase = phasesStats.find((p) => p.done < p.total);
  const nextAction = firstIncompletePhase
    ? PHASE_TO_NEXT_ACTION[firstIncompletePhase.idx]
    : null;


  const toggle = (key: string) =>
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <section>
      <AgentArchitectCard
        className="mb-5"
        variant="compact"
        eyebrow={AGENT_MODULE_GUIDANCE.prontidao.eyebrow}
        title={AGENT_MODULE_GUIDANCE.prontidao.title}
        subtitle={AGENT_MODULE_GUIDANCE.prontidao.subtitle}
        ctaLabel={AGENT_MODULE_GUIDANCE.prontidao.ctaLabel}
        prompt={AGENT_MODULE_GUIDANCE.prontidao.prompt}
        successMessage={AGENT_MODULE_GUIDANCE.prontidao.successMessage}
      />

      {/* Resumo de prontidão */}
      <GlassCard className="p-5 md:p-6 mb-5 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">
        <div className="flex items-start gap-3 mb-3">

          <Sparkles size={18} className="text-accent shrink-0 mt-1" />
          <div>
            <div className="text-[11px] uppercase tracking-wider text-accent/80 mb-1">
              Painel de Prontidão
            </div>
            <h2 className="text-xl md:text-2xl font-heading font-bold">
              Resumo de prontidão — {appName}
            </h2>
            {!isFilled && (
              <p className="text-xs text-muted-foreground mt-1">
                Preencha o contexto do projeto para personalizar este painel.
              </p>
            )}
          </div>
        </div>

        {gameLike && isFilled && (
          <dl className="grid sm:grid-cols-2 gap-3 mt-3">
            <ResumoItem label="Tipo de app" value="Jogo/quiz interativo de relacionamento" />
            <ResumoItem
              label="Ação principal"
              value="Responder o quiz e desbloquear o resultado completo"
            />
            <ResumoItem
              label="Oferta principal"
              value="Prévia gratuita + resultado completo pago"
            />
            <ResumoItem
              label="Modelo recomendado"
              value="Teste com poucas pessoas antes de ampliar divulgação"
            />
            <ResumoItem
              label="Risco principal"
              value="Promessa sensível, clareza do CTA, checkout, entrega protegida e privacidade"
            />
            <ResumoItem
              label="Próxima decisão"
              value="Testar, vender, divulgar ou corrigir bloqueadores"
            />
            <ResumoItem
              className="sm:col-span-2"
              label="Critério de segurança"
              value="Não vender/divulgar se login, checkout, entrega ou promessa estiverem frágeis"
            />
          </dl>
        )}
      </GlassCard>

      {/* Indicador de prontidão */}
      <GlassCard className={`p-5 mb-5 border ${readiness.cls}`}>
        <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
          <div className="flex items-center gap-2">
            <Target size={18} />
            <h3 className="font-heading font-semibold text-base">
              Indicador de prontidão: {readiness.label}
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full border border-current/30 bg-black/30">
            {pct}% concluído · {overallDone}/{overallTotal}
          </span>
        </div>
        <div className="h-2 rounded-full bg-black/40 overflow-hidden mb-3">
          <div
            className="h-full bg-current/70 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">{readiness.message}</p>
      </GlassCard>

      {/* Frase de orientação preservada */}
      <GlassCard className="p-4 mb-5 border-accent/30">
        <p className="text-sm text-foreground/90">
          Você não precisa estar com tudo perfeito para validar, mas precisa ter o básico
          funcionando antes de divulgar.
        </p>
      </GlassCard>

      {/* Aviso checkout — orientação neutra sobre o app do aluno.
          Esta página avalia a prontidão do app do aluno, não o checkout da Fábrica,
          então não usamos CHECKOUT_FABRICA_URL para acionar alerta forte aqui. */}
      <GlassCard className="p-4 mb-5 border-white/10">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="shrink-0 mt-0.5 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-foreground/90">
            Antes de vender, confirme se o checkout real e a entrega estão funcionando.
          </p>
        </div>
      </GlassCard>


      {/* Próxima ação recomendada */}
      <GlassCard className="p-5 mb-6 border-sky-400/30 bg-sky-400/5">
        <div className="flex items-center gap-2 mb-2">
          <ArrowRight size={16} className="text-sky-300" />
          <h3 className="font-heading font-semibold text-base">Próxima ação recomendada</h3>
        </div>
        {nextAction ? (
          <>
            <p className="text-sm text-foreground/90 mb-3">
              Maior bloqueador atual:{" "}
              <strong className="text-foreground">{firstIncompletePhase?.phase}</strong>. Resolva
              esta fase antes de avançar para venda ou divulgação.
            </p>
            <button
              onClick={() => goTo(nextAction.moduleId)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-sky-400/40 bg-sky-400/10 text-sky-200 hover:bg-sky-400/20 text-sm font-semibold transition"
            >
              {nextAction.label} →
            </button>
          </>
        ) : (
          <p className="text-sm text-foreground/90">
            Todas as fases estão concluídas no painel. Mantenha testes e métricas reais antes de
            ampliar divulgação.
          </p>
        )}
      </GlassCard>

      {/* Fases (mantém checklist existente, preserva progresso) */}
      <div className="space-y-5 mb-6">
        {phasesStats.map((p) => {
          let status: { label: string; cls: string };
          if (p.done === 0)
            status = {
              label: "Pendente",
              cls: "bg-white/10 text-muted-foreground border-white/15",
            };
          else if (p.done < p.total)
            status = {
              label: "Parcial",
              cls: "bg-accent/15 text-accent border-accent/30",
            };
          else
            status = {
              label: "Pronto",
              cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
            };

          return (
            <GlassCard key={p.phase} className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <h3 className="font-heading font-semibold">{p.phase}</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${status.cls}`}>
                  {status.label} · {p.done}/{p.total}
                </span>
              </div>
              <ul className="space-y-2">
                {p.items.map((item) => {
                  const key = `${p.phase}__${item}`;
                  const done = !!checklist[key];
                  return (
                    <li key={item}>
                      <label className="flex items-center gap-3 p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => toggle(key)}
                          className="accent-accent w-4 h-4"
                        />
                        <span
                          className={`text-sm ${
                            done ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {item}
                        </span>
                        {done ? (
                          <CheckCircle2
                            size={14}
                            className="text-emerald-400 shrink-0 ml-auto"
                          />
                        ) : (
                          <Circle
                            size={14}
                            className="text-muted-foreground/40 shrink-0 ml-auto"
                          />
                        )}
                      </label>
                    </li>
                  );
                })}
              </ul>
              {p.moduleId && p.moduleLabel && (
                <div className="mt-4">
                  <button
                    onClick={() => goTo(p.moduleId as ModuleId)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-foreground/90 transition"
                  >
                    {p.moduleLabel} →
                  </button>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* Itens contextualizados para Jogo do Amor */}
      {gameLike && (
        <GlassCard className="p-5 mb-6 border-accent/30">
          <h3 className="font-heading font-semibold mb-3">
            Checklist específico — {appName}
          </h3>
          <ul className="space-y-2">
            {JOGO_AMOR_ITEMS.map((item) => {
              const key = `painel_prontidao__contexto__${item}`;
              const done = !!checklist[key];
              return (
                <li key={item}>
                  <label className="flex items-center gap-3 p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggle(key)}
                      className="accent-accent w-4 h-4"
                    />
                    <span
                      className={`text-sm ${
                        done ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {item}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </GlassCard>
      )}

      {/* Blocos de decisão */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <BlocoLista
          icon={AlertTriangle}
          title="Bloqueadores críticos"
          tone="danger"
          items={BLOQUEADORES}
          note="Qualquer item acima ativo deve parar venda e divulgação até ser resolvido."
        />
        <BlocoLista
          icon={TestTube2}
          title="Pode testar com pessoas reais se..."
          tone="info"
          items={PODE_TESTAR}
        />
        <BlocoLista
          icon={Rocket}
          title="Pode vender se..."
          tone="success"
          items={PODE_VENDER}
        />
        <BlocoLista
          icon={Megaphone}
          title="Pode divulgar com mais força se..."
          tone="accent"
          items={PODE_DIVULGAR}
        />
      </div>

      <GlassCard className="p-5 mb-6 border-red-400/30 bg-red-500/5">
        <div className="flex items-center gap-2 mb-3">
          <Ban size={16} className="text-red-300" />
          <h3 className="font-heading font-semibold text-base">Não avance se...</h3>
        </div>
        <ul className="space-y-1.5 text-sm text-foreground/90 list-disc list-inside">
          {NAO_AVANCE.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </GlassCard>

      <CaminhoDecisao checklist={checklist} toggle={toggle} />

      <PromptsExecutarEtapa prompts={PROMPTS_CHECKLIST} />

      <GlassCard className="p-5 border-sky-400/30 bg-sky-400/5">

        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={16} className="text-sky-300" />
          <h3 className="font-heading font-semibold text-base">Lembrete final</h3>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">

          Este painel é uma ferramenta de decisão, não uma promessa. Ele não garante app perfeito,
          segurança 100%, vendas ou validação. Avance com cautela e volte ao módulo correspondente
          sempre que algo crítico estiver pendente.
        </p>
      </GlassCard>
    </section>
  );
}

function ResumoItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-white/10 bg-black/30 p-3 ${className ?? ""}`}
    >
      <div className="text-[10px] uppercase tracking-wider text-accent/80 mb-1">{label}</div>
      <div className="text-sm text-foreground/90 leading-snug">{value}</div>
    </div>
  );
}

function BlocoLista({
  icon: Icon,
  title,
  items,
  tone,
  note,
}: {
  icon: typeof AlertTriangle;
  title: string;
  items: string[];
  tone: "danger" | "info" | "success" | "accent";
  note?: string;
}) {
  const toneCls = {
    danger: "border-red-400/30 bg-red-500/5 text-red-200",
    info: "border-sky-400/30 bg-sky-400/5 text-sky-200",
    success: "border-emerald-400/30 bg-emerald-500/5 text-emerald-200",
    accent: "border-accent/30 bg-accent/5 text-accent",
  }[tone];
  return (
    <GlassCard className={`p-5 border ${toneCls}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} />
        <h3 className="font-heading font-semibold text-base text-foreground">{title}</h3>
      </div>
      <ul className="space-y-1.5 text-sm text-foreground/90 list-disc list-inside">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      {note && (
        <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">{note}</p>
      )}
    </GlassCard>
  );
}

const CAMINHO_PREFIX = "checklist_caminho__";

const CAMINHOS: {
  id: string;
  icon: typeof Globe;
  tag: string;
  title: string;
  tone: "info" | "accent" | "success" | "amber" | "violet";
  items: string[];
  recomendacao: string;
}[] = [
  {
    id: "web",
    icon: Globe,
    tag: "Caminho 1",
    title: "Continue como web app se…",
    tone: "info",
    items: [
      "O app ainda está em validação",
      "Você ainda não tem pessoas reais usando",
      "A oferta ainda está sendo ajustada",
      "O app funciona bem por link",
      "Você ainda precisa corrigir bugs importantes",
      "Você quer vender ou testar antes de investir em loja",
    ],
    recomendacao:
      "Esse é o caminho mais seguro para a maioria das pessoas no começo.",
  },
  {
    id: "pwa",
    icon: Smartphone,
    tag: "Caminho 2",
    title: "Considere PWA se…",
    tone: "accent",
    items: [
      "O app já funciona bem no celular",
      "As pessoas acessam com frequência",
      "Faz sentido ter ícone na tela inicial",
      "Você quer uma experiência mais parecida com app instalado",
      "Você ainda não quer passar pelo processo da App Store ou Google Play",
    ],
    recomendacao: "PWA pode ser o próximo passo antes de pensar em loja.",
  },
  {
    id: "play",
    icon: Store,
    tag: "Caminho 3",
    title: "Considere Google Play se…",
    tone: "success",
    items: [
      "O app já foi validado",
      "Existem pessoas reais usando",
      "O público usa principalmente Android",
      "Existe motivo claro para estar na loja",
      "O app tem boa experiência mobile",
      "Você já tem suporte, política de privacidade e estrutura mínima de manutenção",
    ],
    recomendacao:
      "Google Play pode fazer sentido quando o app já tem validação e uso real.",
  },
  {
    id: "appstore",
    icon: Apple,
    tag: "Caminho 4",
    title: "Considere App Store se…",
    tone: "amber",
    items: [
      "O app já está maduro",
      "A experiência no celular está muito boa",
      "O público usa iPhone",
      "Existe política de privacidade",
      "Existe suporte",
      "O app oferece valor claro além de uma página simples",
      "Você está preparada para análise, ajustes e possível reprovação",
    ],
    recomendacao:
      "App Store é um caminho mais exigente e deve ser considerado com cautela.",
  },
  {
    id: "nativo",
    icon: Rocket,
    tag: "Caminho 5",
    title: "Considere nativo no futuro se…",
    tone: "violet",
    items: [
      "O app já tem demanda real",
      "Existem pessoas ativas usando",
      "Existe receita ou estratégia clara",
      "O app precisa de recursos avançados do celular",
      "Performance, notificações, câmera, GPS ou integrações nativas são realmente importantes",
      "Você está pronta para um projeto mais avançado",
    ],
    recomendacao:
      "Nativo é uma evolução futura, não o primeiro passo obrigatório.",
  },
];

const TONE_CLS: Record<string, string> = {
  info: "border-sky-400/30 bg-sky-400/5",
  accent: "border-accent/30 bg-accent/5",
  success: "border-emerald-400/30 bg-emerald-500/5",
  amber: "border-amber-400/30 bg-amber-400/5",
  violet: "border-violet-400/30 bg-violet-400/5",
};

const TONE_ICON: Record<string, string> = {
  info: "text-sky-300 bg-sky-400/15 border-sky-400/30",
  accent: "text-accent bg-accent/15 border-accent/30",
  success: "text-emerald-300 bg-emerald-500/15 border-emerald-400/30",
  amber: "text-amber-300 bg-amber-400/15 border-amber-400/30",
  violet: "text-violet-300 bg-violet-400/15 border-violet-400/30",
};

function CaminhoDecisao({
  checklist,
  toggle,
}: {
  checklist: Record<string, boolean>;
  toggle: (key: string) => void;
}) {
  const scores = CAMINHOS.map((c) => {
    const done = c.items.filter((it) => !!checklist[`${CAMINHO_PREFIX}${c.id}__${it}`]).length;
    return { id: c.id, title: c.title, done, total: c.items.length };
  });
  const best = scores.reduce((a, b) => (b.done / b.total > a.done / a.total ? b : a), scores[0]);
  const hasSignal = best && best.done >= Math.ceil(best.total / 2);

  return (
    <GlassCard className="p-5 md:p-6 mb-6 border-accent/30">
      <div className="flex items-center gap-2 mb-3">
        <Compass size={18} className="text-accent" />
        <span className="text-[11px] uppercase tracking-wider text-accent">
          Diagnóstico de próximo passo
        </span>
      </div>
      <h2 className="text-xl md:text-2xl font-heading font-bold leading-tight mb-2">
        Meu app está pronto para qual caminho?
      </h2>
      <p className="text-sm md:text-base text-foreground/85 leading-relaxed mb-5">
        Depois de construir, publicar, testar e melhorar seu app, use esta checklist
        para decidir o próximo passo. A melhor escolha não é sempre ir para loja —
        é o caminho que combina com o estágio real do seu app.
      </p>

      <div className="grid md:grid-cols-2 gap-3 mb-4">
        {CAMINHOS.map((c) => {
          const CIcon = c.icon;
          const done = c.items.filter((it) => !!checklist[`${CAMINHO_PREFIX}${c.id}__${it}`]).length;
          return (
            <div
              key={c.id}
              className={`rounded-xl border p-4 ${TONE_CLS[c.tone]}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${TONE_ICON[c.tone]}`}>
                  <CIcon size={15} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-foreground/60 font-semibold">
                    {c.tag}
                  </div>
                  <h4 className="font-heading font-semibold text-sm md:text-base leading-tight">
                    {c.title}
                  </h4>
                </div>
                <span className="ml-auto text-[10px] text-muted-foreground shrink-0">
                  {done}/{c.items.length}
                </span>
              </div>
              <ul className="space-y-1.5 mb-3">
                {c.items.map((it) => {
                  const key = `${CAMINHO_PREFIX}${c.id}__${it}`;
                  const checked = !!checklist[key];
                  return (
                    <li key={it}>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(key)}
                          className="accent-accent w-3.5 h-3.5 mt-0.5 shrink-0"
                        />
                        <span
                          className={`text-xs md:text-[13px] leading-snug ${
                            checked ? "line-through text-muted-foreground" : "text-foreground/85"
                          }`}
                        >
                          {it}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <p className="text-[11px] md:text-xs text-foreground/70 border-t border-white/10 pt-2 leading-relaxed">
                <strong className="text-foreground/90">Recomendação: </strong>
                {c.recomendacao}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-white/10 bg-black/30 p-4 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Target size={15} className="text-accent" />
          <h4 className="font-heading font-semibold text-sm md:text-base">
            Resultado sugerido
          </h4>
        </div>
        <ul className="space-y-1.5 text-xs md:text-sm text-foreground/85 mb-3">
          <li>• Se ainda há dúvidas, bugs ou pouca validação: continue como web app.</li>
          <li>• Se o app está bom no celular e precisa parecer instalado: considere PWA.</li>
          <li>• Se há pessoas reais usando e motivo claro para loja: prepare Google Play ou App Store.</li>
          <li>• Se há demanda avançada e estrutura para investir: considere nativo no futuro.</li>
          <li>• Se a vontade de loja vem só por aparência ou vaidade: valide mais antes.</li>
        </ul>
        {hasSignal ? (
          <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3 text-xs md:text-sm text-emerald-100">
            <strong>Sinal atual:</strong> você marcou mais itens em “{best.title.replace(/ se…$/, "")}”.
            Considere esse caminho como próximo passo — mas valide com dados reais antes de investir.
          </div>
        ) : (
          <div className="rounded-lg border border-sky-400/30 bg-sky-400/10 p-3 text-xs md:text-sm text-sky-100">
            <strong>Ainda sem sinal claro:</strong> continue como web app e volte aqui quando tiver
            mais uso real, feedback e experiência mobile validada.
          </div>
        )}
      </div>

      <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <AlertTriangle size={15} className="text-amber-300" />
          <h4 className="font-heading font-semibold text-sm text-amber-100">Alerta</h4>
        </div>
        <p className="text-xs md:text-sm text-foreground/85 leading-relaxed">
          Estar na App Store ou Google Play não garante vendas, downloads, aprovação ou sucesso.
          A loja é um canal possível, não uma garantia. A decisão mais segura é evoluir com base
          em validação real.
        </p>
      </div>
    </GlassCard>
  );
}


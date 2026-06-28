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
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { AgentArchitectCard } from "@/components/entrega/AgentArchitectCard";
import { AGENT_MODULE_GUIDANCE } from "@/lib/agentModuleGuidance";
import { useProjectContext } from "@/hooks/useProjectContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { CHECKLIST_PHASES, type ModuleId } from "@/data/entregaModules";



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
  const readiness = getReadiness(pct);

  const firstIncompletePhase = phasesStats.find((p) => p.done < p.total);
  const nextAction = firstIncompletePhase
    ? PHASE_TO_NEXT_ACTION[firstIncompletePhase.idx]
    : null;


  const toggle = (key: string) =>
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <section>
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

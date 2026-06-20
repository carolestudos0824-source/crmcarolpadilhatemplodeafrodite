import { useEffect, useState } from "react";
import { Rocket, FolderKanban, ClipboardList, Play, ArrowRight, Compass, X, Check } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useAppProjects } from "@/hooks/useAppProjects";
import { useProjectContext } from "@/hooks/useProjectContext";
import { MODULES, type ModuleId } from "@/data/entregaModules";

const WIZARD_DISMISS_KEY = "fabrica_apps_wizard_dismissed_v1";

type Props = {
  active: ModuleId;
  goTo: (id: ModuleId) => void;
  effectiveModuleDone: Record<ModuleId, boolean>;
};

export function JourneyStartGuide({ active, goTo, effectiveModuleDone }: Props) {
  const { activeProject, openDrawer, projects } = useAppProjects();
  const { isFilled, openEditor } = useProjectContext();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(WIZARD_DISMISS_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const hasApp = !!activeProject || projects.length > 0;
  const showWizard = !dismissed && !hasApp;

  const dismissWizard = () => {
    setDismissed(true);
    try {
      localStorage.setItem(WIZARD_DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  // ===== Próximo passo recomendado (regra simples, sem IA) =====
  type NextStep = { text: string; cta: string; action: () => void; tone?: "accent" | "amber" };

  const completedAny = Object.values(effectiveModuleDone).some(Boolean);
  const currentModuleId = (activeProject?.currentModuleId as ModuleId | undefined) ?? active;
  const currentModuleLabel =
    MODULES.find((m) => m.id === currentModuleId)?.label ?? "etapa atual";
  const currentDone = !!effectiveModuleDone[currentModuleId];
  const currentIndex = MODULES.findIndex((m) => m.id === currentModuleId);
  const nextModule = currentIndex >= 0 ? MODULES[currentIndex + 1] : undefined;

  let next: NextStep;
  if (!activeProject) {
    next = {
      text: "Crie ou selecione um app para organizar sua jornada.",
      cta: "Meus Apps",
      action: openDrawer,
      tone: "amber",
    };
  } else if (!isFilled) {
    next = {
      text: "Preencha o contexto do app para gerar prompts mais precisos.",
      cta: "Preencher contexto",
      action: openEditor,
      tone: "amber",
    };
  } else if (!completedAny) {
    next = {
      text: "Comece entendendo o Lovable antes de construir.",
      cta: "Ir para Comece pelo Lovable",
      action: () => goTo("fundamentos"),
    };
  } else if (currentDone && nextModule) {
    next = {
      text: "Avance para a próxima etapa da jornada.",
      cta: `Próximo módulo: ${nextModule.label}`,
      action: () => goTo(nextModule.id),
    };
  } else {
    next = {
      text: `Continue em: ${currentModuleLabel}`,
      cta: "Ir para etapa",
      action: () => goTo(currentModuleId),
    };
  }

  return (
    <div className="space-y-3 mb-6">
      {showWizard && (
        <GlassCard className="p-4 md:p-5 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
                <Rocket size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
                  Comece seu primeiro app
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  3 passos rápidos para você sair do zero com clareza.
                </p>
              </div>
            </div>
            <button
              onClick={dismissWizard}
              className="shrink-0 p-1.5 rounded-md hover:bg-white/5 text-muted-foreground"
              aria-label="Dispensar"
              title="Já entendi"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <WizardStep
              n={1}
              icon={<FolderKanban size={14} />}
              title="Crie ou selecione seu app"
              text="Cada aplicativo que você construir fica organizado em Meus Apps."
              cta="Criar meu primeiro app"
              onClick={openDrawer}
              done={hasApp}
            />
            <WizardStep
              n={2}
              icon={<ClipboardList size={14} />}
              title="Preencha o contexto"
              text="O contexto faz os prompts saírem mais precisos para o app que você está criando."
              cta="Preencher contexto"
              onClick={openEditor}
              done={isFilled}
            />
            <WizardStep
              n={3}
              icon={<Play size={14} />}
              title="Comece pelo prompt certo"
              text="Use o Estúdio de Prompt para revisar antes de copiar para o Lovable ou para o Agente."
              cta="Ir para primeira etapa"
              onClick={() => goTo("fundamentos")}
              done={completedAny}
            />
          </div>
        </GlassCard>
      )}

      {/* Próximo passo recomendado */}
      <GlassCard
        className={`p-4 ${
          next.tone === "amber"
            ? "border-amber-400/30 bg-amber-400/[0.06]"
            : "border-accent/30 bg-accent/[0.06]"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-foreground/80 mb-1">
              Próximo passo recomendado
            </div>
            <p className="text-sm text-foreground/95">{next.text}</p>
          </div>
          <button
            onClick={next.action}
            className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold transition ${
              next.tone === "amber"
                ? "border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
                : "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
            }`}
          >
            {next.cta} <ArrowRight size={12} />
          </button>
        </div>
      </GlassCard>

      {/* Atalho discreto de Validação */}
      {active !== "validacao" && (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
          <div className="flex items-start gap-2 min-w-0">
            <Compass size={14} className="text-amber-300 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[13px] text-foreground/90 leading-snug">
                <strong className="text-foreground">Antes de construir, valide a ideia.</strong>{" "}
                <span className="text-muted-foreground">
                  Use o Agente Arquiteto para analisar mercado, concorrentes, riscos e MVP antes de gastar créditos no Lovable.
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => goTo("validacao")}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15 text-[11px] font-semibold"
          >
            Analisar viabilidade
          </button>
        </div>
      )}
    </div>
  );
}

function WizardStep({
  n,
  icon,
  title,
  text,
  cta,
  onClick,
  done,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  text: string;
  cta: string;
  onClick: () => void;
  done: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        done
          ? "border-emerald-400/30 bg-emerald-400/[0.06]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center border ${
            done
              ? "bg-emerald-400/15 border-emerald-400/40 text-emerald-200"
              : "bg-accent/15 border-accent/30 text-accent"
          }`}
        >
          {done ? <Check size={12} /> : n}
        </span>
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
          {icon} Passo {n}
        </span>
      </div>
      <h4 className="text-sm font-heading font-bold text-foreground/95">{title}</h4>
      <p className="text-[12px] text-muted-foreground mt-1 leading-snug">{text}</p>
      <button
        onClick={onClick}
        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 text-xs font-semibold"
      >
        {cta} <ArrowRight size={11} />
      </button>
    </div>
  );
}

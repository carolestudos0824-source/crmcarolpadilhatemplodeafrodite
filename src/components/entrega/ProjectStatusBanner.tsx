import { Factory, UserCog, FolderKanban, Compass } from "lucide-react";
import { useAppProjects } from "@/hooks/useAppProjects";
import { useAuthState } from "@/hooks/useAuthState";
import { isFabricaSelfProject } from "@/lib/promptBuilder";
import { useProjectJourney, JOURNEY_PHASE_LABELS } from "@/lib/journey";

/**
 * Indicação visual conceitual da Fábrica de Apps com IA:
 * - Produto principal (sempre): Fábrica de Apps com IA
 * - Modo atual: Admin (quando isAdmin e Projeto em foco é a própria Fábrica) ou Usuário
 * - Projeto em foco: nome do projeto ativo (ou "nenhum")
 * - Fase atual: derivada da JORNADA escolhida no projeto ativo (fonte única).
 *   Fallback heurístico apenas quando a jornada ainda não foi escolhida.
 *
 * Não altera nenhuma lógica de auth, banco, progresso ou prompts — apenas
 * mostra a separação conceitual entre PRODUTO PRINCIPAL e PROJETO EM FOCO.
 */
export const ProjectStatusBanner = () => {
  const { activeProject } = useAppProjects();
  const auth = useAuthState();
  const [journey] = useProjectJourney(activeProject?.id ?? null);

  const isAdmin = auth.status === "authed" && auth.isAdmin;
  const adminOnSelf =
    isAdmin && !!activeProject && isFabricaSelfProject(activeProject.context);
  const mode = adminOnSelf ? "Admin (melhorando a Fábrica)" : isAdmin ? "Admin" : "Usuário";

  const phase = (() => {
    if (!activeProject) return "Sem projeto selecionado";
    if (journey) return JOURNEY_PHASE_LABELS[journey];
    const s = activeProject.status;
    if (["publicado", "vendendo", "escalando"].includes(s)) return "Já tenho um app";
    const mod = activeProject.currentModuleId ?? "";
    if (["comece", "ideias", "validacao"].includes(mod)) return "Começando do zero";
    return "Construindo por versões";
  })();


  return (
    <section
      aria-label="Estado conceitual do programa"
      className="mb-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
        <Field
          icon={<Factory size={12} />}
          label="Produto principal"
          value="Fábrica de Apps com IA"
          highlight
        />
        <Field
          icon={<UserCog size={12} />}
          label="Modo atual"
          value={mode}
        />
        <Field
          icon={<FolderKanban size={12} />}
          label="Projeto em foco"
          value={activeProject?.name ?? "Nenhum projeto selecionado"}
        />
        <Field
          icon={<Compass size={12} />}
          label="Fase atual"
          value={phase}
        />
      </div>
    </section>
  );
};

const Field = ({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="min-w-0">
    <div className="flex items-center gap-1 uppercase tracking-wider text-muted-foreground/80">
      <span className="text-accent">{icon}</span>
      <span>{label}</span>
    </div>
    <div
      className={`mt-0.5 text-sm font-medium truncate ${
        highlight ? "text-accent" : "text-foreground"
      }`}
      title={value}
    >
      {value}
    </div>
  </div>
);

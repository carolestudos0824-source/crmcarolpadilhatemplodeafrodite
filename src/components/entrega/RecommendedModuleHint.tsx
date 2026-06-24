import { ArrowRight } from "lucide-react";
import { MODULES, type ModuleId } from "@/data/entregaModules";
import { useRecommendedModuleId } from "@/hooks/useRecommendedModuleId";

type Props = {
  active: ModuleId;
  goTo: (id: ModuleId) => void;
};

/**
 * Microcopy discreta exibida no topo do conteúdo de um módulo quando o
 * usuário está vendo um módulo diferente do próximo passo recomendado pelo
 * Estado Atual do Projeto.
 *
 * Não cria card novo, não muda lógica do Estado Atual, não altera progresso.
 */
export const RecommendedModuleHint = ({ active, goTo }: Props) => {
  const recommended = useRecommendedModuleId();
  if (!recommended || recommended === active) return null;

  const currentLabel = MODULES.find((m) => m.id === active)?.label ?? active;
  const recommendedLabel =
    MODULES.find((m) => m.id === recommended)?.label ?? recommended;

  return (
    <p
      role="note"
      className="mb-4 text-xs text-muted-foreground flex items-start gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02]"
    >
      <span className="flex-1">
        Você está vendo <span className="text-foreground/90">{currentLabel}</span>,
        mas seu próximo passo recomendado é{" "}
        <button
          type="button"
          onClick={() => goTo(recommended)}
          className="text-accent underline underline-offset-2 hover:text-accent/80 inline-flex items-center gap-1"
        >
          {recommendedLabel} <ArrowRight size={12} />
        </button>
        . Para evitar retrabalho, conclua o passo recomendado antes de avançar.
      </span>
    </p>
  );
};

import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAppProjects } from "@/hooks/useAppProjects";
import {
  JOURNEY_LABELS,
  useProjectJourney,
  type JourneyId,
} from "@/lib/journey";
import type { ModuleId } from "@/data/entregaModules";

type Props = {
  onGoToModule: (id: ModuleId) => void;
  /**
   * "full" (default): mostra o bloco grande de escolha quando jornada vazia.
   *   Use apenas em "Comece Aqui" ou tela inicial.
   * "compact": em páginas avançadas — se já houver jornada, mostra a pílula;
   *   se vazia, mostra apenas aviso discreto com botão "Escolher jornada".
   */
  variant?: "full" | "compact";
};


type JourneyCard = {
  id: JourneyId;
  title: string;
  desc: string;
  ctaLabel: string;
  next: ModuleId;
};

const CARDS: JourneyCard[] = [
  {
    id: "comecando_do_zero",
    title: "Começando do zero",
    desc: "Tenho uma ideia ou estou começando minha primeira versão.",
    ctaLabel: "Definir o MVP",
    next: "mvp",
  },
  {
    id: "app_completo_por_versoes",
    title: "Quero um app completo",
    desc: "Quero construir por versões, sem jogar tudo de uma vez no Lovable.",
    ctaLabel: "Planejar por versões",
    next: "planejar",
  },
  {
    id: "ja_tenho_um_app",
    title: "Já tenho um app",
    desc: "Quero auditar, corrigir, melhorar ou escalar um app existente.",
    ctaLabel: "Auditar e melhorar meu app",
    next: "melhorias",
  },
];

/**
 * Seletor global da jornada do projeto, renderizado no topo de /entrega
 * logo abaixo do Estado Atual do Projeto. Reusa exclusivamente a lógica já
 * validada em `@/lib/journey` (persistência por projectId). Não toca em
 * progresso, MODULE_ORDER, GPS, Arquiteto ou promptBuilder.
 */
export const ProjectJourneySelector = ({ onGoToModule }: Props) => {
  const { activeProject, openDrawer } = useAppProjects();
  const [journey, setJourneyValue] = useProjectJourney(activeProject?.id ?? null);

  const handlePick = (card: JourneyCard) => {
    if (!activeProject?.id) {
      toast("Crie ou selecione um Projeto em foco antes de salvar sua jornada.", {
        description: "A escolha só fica salva quando há um projeto ativo.",
      });
      openDrawer();
      return;
    }
    setJourneyValue(card.id);
    setTimeout(() => onGoToModule(card.next), 200);
  };

  const handleReset = () => {
    if (!activeProject?.id) return;
    setJourneyValue(null);
  };

  // Versão compacta — jornada já escolhida
  if (journey) {
    return (
      <section
        aria-label="Jornada escolhida"
        className="mb-4 rounded-2xl border border-accent/25 bg-accent/[0.06] backdrop-blur-md p-3 md:p-4 flex flex-wrap items-center gap-3"
      >
        <div className="flex items-center gap-2 text-xs text-foreground/90">
          <Compass size={14} className="text-accent shrink-0" />
          <span className="text-muted-foreground">Jornada escolhida:</span>
          <span className="font-semibold text-foreground">
            {JOURNEY_LABELS[journey]}
          </span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="ml-auto inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] text-foreground/85 hover:bg-white/10 transition"
          title="Trocar a jornada sem apagar projeto, contexto ou progresso"
        >
          Trocar jornada
          <ArrowRight size={11} />
        </button>
      </section>
    );
  }

  // Bloco completo — escolha pendente
  return (
    <section
      aria-label="Escolha como você quer usar a Fábrica"
      className="mb-4 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/[0.10] via-white/[0.02] to-transparent p-4 md:p-5"
    >
      <header className="mb-3">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent mb-2">
          <Sparkles size={12} /> Decida como começar
        </div>
        <h2 className="text-lg md:text-xl font-heading font-bold text-foreground">
          Escolha como você quer usar a Fábrica
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-3xl">
          A Fábrica adapta os próximos passos, GPS, Arquiteto e prompts de acordo com o momento do seu app.
        </p>
        {!activeProject && (
          <p className="mt-2 text-[11px] text-amber-300/90">
            Você poderá salvar a jornada depois de criar ou selecionar um Projeto em foco.
          </p>
        )}
      </header>

      <div
        role="radiogroup"
        aria-label="Jornadas da Fábrica"
        className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
      >
        {CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            role="radio"
            aria-checked={false}
            onClick={() => handlePick(card)}
            className="text-left rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-accent/40 p-3 min-h-[112px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <div className="text-sm font-semibold text-accent mb-1">
              {card.title}
            </div>
            <div className="text-xs text-muted-foreground leading-snug">
              {card.desc}
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-foreground/85">
              <ArrowRight size={11} />
              <span>{card.ctaLabel}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

import { useMemo, useState } from "react";
import { Search, ArrowRight, Compass } from "lucide-react";
import { AppModelCard } from "@/components/entrega/AppModelCard";
import { AgentArchitectCard } from "@/components/entrega/AgentArchitectCard";
import { AGENT_MODULE_GUIDANCE } from "@/lib/agentModuleGuidance";
import { IDEAS_LIBRARY, IDEAS_CATEGORIES, isMostSellable } from "@/data/ideiasProntas";
import { useAppProjects } from "@/hooks/useAppProjects";


type Props = {
  onAnalisarViabilidade: () => void;
  onProximoPasso?: () => void;
};

const INITIAL_VISIBLE = 6;

export const IdeiasProntasModule = ({ onAnalisarViabilidade, onProximoPasso }: Props) => {
  const [category, setCategory] = useState<string>("Todas");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const { activeProject } = useAppProjects();
  const hasChosenIdea = !!activeProject;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return IDEAS_LIBRARY.filter(({ model, category: cat, badges }) => {
      if (category === "Mais vendáveis") {
        if (!isMostSellable(badges)) return false;
      } else if (category !== "Todas") {
        if (cat !== category) return false;
      }
      if (!q) return true;
      const hay = `${model.name} ${cat} ${model.audience} ${model.pain} ${model.monetization}`.toLowerCase();
      return hay.includes(q);
    });
  }, [category, query]);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);

  return (
    <section className="overflow-x-hidden">
      <header className="mb-4">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
          Ideias prontas para criar no Lovable
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
          Escolha uma ideia pronta para criar seu app em foco. Depois você poderá editar nome, público, promessa e plano do app.
        </p>
      </header>

      <AgentArchitectCard
        className="mb-4"
        variant="compact"
        eyebrow={AGENT_MODULE_GUIDANCE.ideias.eyebrow}
        title={AGENT_MODULE_GUIDANCE.ideias.title}
        subtitle={AGENT_MODULE_GUIDANCE.ideias.subtitle}
        ctaLabel={AGENT_MODULE_GUIDANCE.ideias.ctaLabel}
        prompt={AGENT_MODULE_GUIDANCE.ideias.prompt}
        successMessage={AGENT_MODULE_GUIDANCE.ideias.successMessage}
      />

      {/* Bloco de viabilidade — foco em decisão */}

      <div className="rounded-xl border border-amber-400/30 bg-amber-400/[0.06] p-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-heading font-bold text-foreground/95">
            Não sabe qual ideia escolher?
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Use a análise de viabilidade para comparar potencial de venda, clareza do MVP e facilidade de construir no Lovable.
          </p>
        </div>
        <button
          onClick={onAnalisarViabilidade}
          className="shrink-0 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15 text-xs font-semibold w-full sm:w-auto"
        >
          Comparar viabilidade
        </button>
      </div>

      {/* Filtros + busca */}
      <div className="space-y-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowAll(true); }}
            placeholder="Buscar por nicho, público ou dor…"
            className="w-full rounded-lg border border-white/10 bg-black/30 pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {IDEAS_CATEGORIES.map((cat) => {
            const active = category === cat;
            const isTodas = cat === "Todas";
            return (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setShowAll(false); }}
                className={
                  active
                    ? "text-xs px-3 py-1.5 rounded-full border border-accent/50 bg-accent/15 text-accent font-semibold"
                    : isTodas
                    ? "text-xs px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-foreground/90 hover:bg-white/15 font-semibold"
                    : "text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
                }
              >
                {cat}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Mostrando {visible.length} de {filtered.length} ideias.
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-muted-foreground text-center">
          Nenhuma ideia encontrada com esses filtros. Tente outra categoria ou limpe a busca.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map(({ model }) => (
            <AppModelCard key={model.name} model={model} />
          ))}
        </div>
      )}

      {!showAll && filtered.length > INITIAL_VISIBLE && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="min-h-[44px] px-5 py-2.5 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 text-sm font-semibold w-full sm:w-auto"
          >
            Ver mais ideias ({filtered.length - INITIAL_VISIBLE})
          </button>
        </div>
      )}

      {/* Próximo passo guiado pela escolha */}
      <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="min-w-0 flex items-start gap-2.5">
          <Compass size={16} className={hasChosenIdea ? "text-accent shrink-0 mt-0.5" : "text-muted-foreground shrink-0 mt-0.5"} />
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
              Próximo passo
            </div>
            <p className="text-sm text-foreground/85">
              {hasChosenIdea
                ? `Você está com o app "${activeProject?.name}" em foco. Avance para planejar o app.`
                : "Escolha uma ideia acima para criar seu app em foco. Sem app escolhido, o próximo passo fica bloqueado."}
            </p>
          </div>
        </div>
        <button
          onClick={() => hasChosenIdea && onProximoPasso?.()}
          disabled={!hasChosenIdea}
          className={
            hasChosenIdea
              ? "shrink-0 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-accent/60 bg-accent text-background hover:bg-accent/90 text-sm font-semibold w-full sm:w-auto"
              : "shrink-0 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-muted-foreground text-sm w-full sm:w-auto cursor-not-allowed"
          }
        >
          {hasChosenIdea ? (
            <>Próximo passo: Planejar o App <ArrowRight size={14} /></>
          ) : (
            "Escolha uma ideia para avançar"
          )}
        </button>
      </div>
    </section>
  );
};

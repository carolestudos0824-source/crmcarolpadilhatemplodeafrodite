import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppModelCard } from "@/components/entrega/AppModelCard";
import { IDEAS_LIBRARY, IDEAS_CATEGORIES, IDEAS_INITIAL_VISIBLE, isMostSellable } from "@/data/ideiasProntas";

type Props = { onAnalisarViabilidade: () => void };

export const IdeiasProntasModule = ({ onAnalisarViabilidade }: Props) => {
  const [category, setCategory] = useState<string>("Todas");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

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

  const visible = showAll ? filtered : filtered.slice(0, IDEAS_INITIAL_VISIBLE);

  return (
    <section>
      <header className="mb-4">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
          Ideias prontas para criar no Lovable
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
          Escolha uma ideia com dor clara, público definido e monetização possível.
          Depois veja o blueprint ou use a ideia como contexto do seu app.
        </p>
      </header>

      <div className="rounded-xl border border-amber-400/30 bg-amber-400/[0.06] p-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-heading font-bold text-foreground/95">
            Antes de construir, valide a ideia
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Use a análise de viabilidade para entender mercado, concorrência, riscos e MVP antes de gastar créditos no Lovable.
          </p>
        </div>
        <button
          onClick={onAnalisarViabilidade}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15 text-xs font-semibold"
        >
          Analisar viabilidade
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
        <div className="flex flex-wrap gap-1.5">
          {IDEAS_CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setShowAll(false); }}
                className={
                  active
                    ? "text-xs px-3 py-1.5 rounded-full border border-accent/50 bg-accent/15 text-accent font-semibold"
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

      {!showAll && filtered.length > IDEAS_INITIAL_VISIBLE && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="px-5 py-2.5 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 text-sm font-semibold"
          >
            Ver mais ideias ({filtered.length - IDEAS_INITIAL_VISIBLE})
          </button>
        </div>
      )}
    </section>
  );
};

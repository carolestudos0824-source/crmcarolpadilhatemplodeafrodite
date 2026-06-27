import { useMemo, useState } from "react";
import { BookOpen, Search, X, AlertTriangle, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  TECHNICAL_GLOSSARY,
  GLOSSARY_CATEGORIES,
  URGENCY_META,
  type GlossaryCategoryId,
  type TechnicalTerm,
} from "@/data/technicalGlossary";
import type { ModuleId } from "@/data/entregaModules";

type Props = {
  goTo?: (id: ModuleId) => void;
};

/**
 * Glossário Técnico do App — ferramenta opcional de consulta.
 * NÃO é módulo. NÃO altera progresso, IDs ou TOTAL_COMMANDS.
 */
export function TechnicalGlossaryDrawer({ goTo }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<GlossaryCategoryId | "todas">("todas");

  const filtered = useMemo<TechnicalTerm[]>(() => {
    const q = query.trim().toLowerCase();
    return TECHNICAL_GLOSSARY.filter((t) => {
      if (activeCat !== "todas" && t.category !== activeCat) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.simple.toLowerCase().includes(q) ||
        t.whyItMatters.toLowerCase().includes(q)
      );
    });
  }, [query, activeCat]);

  const handleGoTo = (id: ModuleId) => {
    if (!goTo) return;
    setOpen(false);
    setTimeout(() => goTo(id), 50);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="px-3 py-1.5 rounded-full border border-white/15 bg-white/[0.04] text-foreground/90 hover:bg-white/[0.08] inline-flex items-center gap-1.5 text-xs"
          title="Abrir Glossário Técnico"
          aria-label="Abrir Glossário Técnico"
        >
          <BookOpen size={12} />
          <span className="hidden sm:inline">Glossário</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl bg-background border-l border-white/10 overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="font-heading flex items-center gap-2">
            <BookOpen size={18} className="text-accent" />
            Glossário Técnico do App
          </SheetTitle>
          <SheetDescription className="text-xs">
            Consulta opcional. Use quando encontrar um termo técnico ou quiser entender uma decisão.
          </SheetDescription>
        </SheetHeader>

        {/* Aviso */}
        <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-3 flex gap-2">
          <AlertTriangle size={14} className="text-amber-300 shrink-0 mt-0.5" />
          <p className="text-[12px] text-foreground/90 leading-snug">
            Você <strong>não precisa</strong> dominar todos esses termos para criar seu app. Use
            este glossário apenas como consulta quando encontrar uma palavra técnica ou quiser
            entender uma decisão.
          </p>
        </div>

        {/* Busca */}
        <div className="mt-4 relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar termo ou descrição..."
            className="pl-9 pr-9 bg-white/[0.03] border-white/10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              aria-label="Limpar busca"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filtros categoria */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <CatChip
            active={activeCat === "todas"}
            onClick={() => setActiveCat("todas")}
            label="Todas"
          />
          {GLOSSARY_CATEGORIES.map((c) => (
            <CatChip
              key={c.id}
              active={activeCat === c.id}
              onClick={() => setActiveCat(c.id)}
              label={c.label}
            />
          ))}
        </div>

        {/* Lista */}
        <div className="mt-4 space-y-2 pb-8">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Nenhum termo encontrado.
            </p>
          )}
          {filtered.map((t) => {
            const urg = URGENCY_META[t.worryNow];
            const cat = GLOSSARY_CATEGORIES.find((c) => c.id === t.category)?.label;
            return (
              <article
                key={t.slug}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
              >
                <header className="flex items-start justify-between gap-2 mb-1.5 flex-wrap">
                  <h3 className="text-sm font-heading font-bold text-foreground/95">{t.name}</h3>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${urg.tone}`}
                    title={urg.hint}
                  >
                    {urg.label}
                  </span>
                </header>
                <p className="text-[10px] text-muted-foreground mb-1.5">{cat}</p>
                <p className="text-[13px] text-foreground/90 leading-snug">{t.simple}</p>
                <dl className="mt-2 grid gap-1.5 text-[12px]">
                  <Row label="Por que importa" value={t.whyItMatters} />
                  <Row label="Quando entra" value={t.whenItEnters} />
                </dl>
                {t.notForBeginners && (
                  <p className="mt-2 text-[11px] text-amber-200/80">
                    Não se preocupe com isso no início.
                  </p>
                )}
                {t.relatedModuleId && goTo && (
                  <button
                    type="button"
                    onClick={() => handleGoTo(t.relatedModuleId as ModuleId)}
                    className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 text-[11px] font-semibold"
                  >
                    Ver módulo relacionado <ArrowRight size={10} />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CatChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full border text-[11px] transition ${
        active
          ? "border-accent/40 bg-accent/15 text-accent"
          : "border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06]"
      }`}
    >
      {label}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-foreground/85 leading-snug">{value}</dd>
    </div>
  );
}

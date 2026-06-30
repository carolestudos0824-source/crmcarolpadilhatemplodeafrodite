import { useMemo, useState } from "react";
import { Search, Compass, ArrowRight, Bot, Code2, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { analyzePain, PAIN_EXAMPLES, type PainRecommendation } from "@/lib/painSearch";
import type { ModuleId } from "@/data/entregaModules";
import { useAppProjects } from "@/hooks/useAppProjects";
import { PromptReviewDialog } from "@/components/entrega/PromptReviewDialog";

type Props = {
  goTo: (id: ModuleId) => void;
};

type DialogMode = "agent" | "lovable" | null;

/**
 * Busca Inteligente de Dor e Próximo Passo.
 * Campo no topo de /entrega que decide, sem chamar IA externa,
 * qual módulo o usuário deve abrir e se deve planejar com o Agente
 * ou já copiar para o Lovable.
 */
export const PainSearchNextStep = ({ goTo }: Props) => {
  const { activeProject } = useAppProjects();
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);

  const recommendation: PainRecommendation | null = useMemo(
    () => (submitted ? analyzePain(submitted) : null),
    [submitted],
  );

  // Sinaliza que o texto foi alterado depois da última recomendação,
  // para que o botão e o bloco de resultado mostrem claramente que a
  // recomendação atual está desatualizada.
  const trimmedText = text.trim();
  const isStale =
    submitted !== null && trimmedText.length >= 3 && trimmedText !== submitted;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const v = trimmedText;
    if (v.length === 0) {
      toast.info("Escreva sua dúvida em uma frase para receber um próximo passo.");
      return;
    }
    if (v.length < 3) {
      toast.error("Descreva sua dor em pelo menos uma frase.");
      return;
    }
    // Força recomputação mesmo quando o texto é igual ao anterior:
    // limpamos o estado e reaplicamos no próximo tick para garantir
    // que o useMemo dependa de uma nova referência.
    if (v === submitted) {
      setSubmitted(null);
      queueMicrotask(() => setSubmitted(v));
      return;
    }
    setSubmitted(v);
  };

  const handleExample = (ex: string) => {
    setText(ex);
    setSubmitted(ex);
  };

  const openModule = () => {
    if (!recommendation) return;
    goTo(recommendation.moduleId);
    toast.success(`Abrindo módulo: ${recommendation.moduleLabel}`);
  };

  const openAgent = () => setDialogMode("agent");
  const openLovable = () => {
    if (!activeProject) {
      toast.error("Selecione um app ativo em Meus Apps antes de copiar para o Lovable.");
      return;
    }
    setDialogMode("lovable");
  };

  return (
    <section
      id="pain-search"
      aria-label="Busca inteligente de dor e próximo passo"
      className="mb-6 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-background/40 to-background/10 p-5 shadow-[0_0_30px_-15px_hsl(var(--accent))]"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="rounded-lg bg-accent/15 p-2 text-accent shrink-0">
          <Compass size={18} />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-foreground">
            O que você quer resolver agora?
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Descreva sua dor em uma frase. O sistema decide o módulo certo e o próximo passo.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ex: quero vender meu app, não sei o próximo passo, meu checkout não funciona..."
            className="w-full rounded-lg border border-white/10 bg-background/60 pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-accent/50"
            aria-label="Descreva sua dor"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 transition min-h-[44px]"
        >
          {submitted && isStale
            ? "Atualizar recomendação"
            : "Encontrar meu próximo passo"}
          <ArrowRight size={14} />
        </button>
      </form>

      {!submitted && (
        <>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {PAIN_EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => handleExample(ex)}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/40 transition"
              >
                {ex}
              </button>
            ))}
          </div>
          {!activeProject && (
            <p className="mt-2 text-[11px] text-muted-foreground/80 leading-snug">
              Você pode buscar orientação agora, mas para gerar comandos personalizados escolha um app primeiro.
            </p>
          )}
        </>
      )}

      {!activeProject && submitted && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-2.5 text-xs text-yellow-200">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>
            Selecione ou crie um app em <strong>Meus Apps</strong> para receber uma
            recomendação mais precisa e poder copiar prompts para o Lovable.
          </span>
        </div>
      )}

      {recommendation && (
        <div
          className={`mt-4 rounded-xl border bg-background/60 p-4 transition ${
            isStale ? "border-yellow-500/40 opacity-60" : "border-accent/40"
          }`}
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-accent" />
              <h3 className="text-sm font-semibold text-foreground">
                Próximo passo recomendado
              </h3>
            </div>
            {isStale && (
              <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-yellow-200">
                <AlertCircle size={11} /> Desatualizada
              </span>
            )}
          </div>
          {isStale && (
            <p className="-mt-1 mb-3 text-[11px] text-yellow-200/90">
              Você alterou o texto. Clique em <strong>Atualizar recomendação</strong> para gerar de novo.
            </p>
          )}

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Field label="Dor detectada" value={recommendation.pain} />
            <Field label="Módulo recomendado" value={recommendation.moduleLabel} />
            <Field label="Ação recomendada" value={recommendation.action} />
            <Field label="Botão recomendado" value={recommendation.buttonLabel} />
            <Field label="Por que fazer agora" value={recommendation.why} full />
            <Field label="O que evitar" value={recommendation.avoid} full />
          </dl>

          <div className="mt-3">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
              Prompt sugerido
            </div>
            <pre className="whitespace-pre-wrap rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-foreground/85 font-mono">
{recommendation.prompt}
            </pre>
          </div>

          <div className="mt-3">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
              Checklist rápido antes de executar
            </div>
            <ul className="space-y-1 text-sm text-foreground/85">
              {recommendation.checklist.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 rounded-full bg-accent shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openModule}
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/15 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/25 transition"
            >
              <ArrowRight size={13} />
              Abrir módulo recomendado
            </button>
            <button
              type="button"
              onClick={openAgent}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                recommendation.button === "agent"
                  ? "bg-accent text-accent-foreground hover:opacity-90"
                  : "border border-white/15 bg-white/5 text-foreground hover:bg-white/10"
              }`}
            >
              <Bot size={13} />
              Planejar com o Agente
            </button>
            <button
              type="button"
              onClick={openLovable}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                recommendation.button === "lovable"
                  ? "bg-accent text-accent-foreground hover:opacity-90"
                  : "border border-white/15 bg-white/5 text-foreground hover:bg-white/10"
              }`}
            >
              <Code2 size={13} />
              Gerar prompt para Lovable
            </button>
          </div>
        </div>
      )}

      {recommendation && dialogMode && (
        <PromptReviewDialog
          open
          onClose={() => setDialogMode(null)}
          stepName={`Próximo passo: ${recommendation.moduleLabel}`}
          stepObjective={recommendation.action}
          command={recommendation.prompt}
          moduleId={recommendation.moduleId}
        />
      )}
    </section>
  );
};

const Field = ({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) => (
  <div className={full ? "sm:col-span-2" : ""}>
    <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
      {label}
    </dt>
    <dd className="text-sm text-foreground/90">{value}</dd>
  </div>
);

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check, Bot, Wrench, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

export type PromptTipo = "agente" | "lovable";

export type PromptItem = {
  id: string;
  tipo: PromptTipo;
  titulo: string;
  descricao?: string;
  texto: string;
};

function CopyPromptButton({ text, tipo }: { text: string; tipo: PromptTipo }) {
  const [ok, setOk] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text.trim());
      setOk(true);
      toast.success(
        tipo === "agente"
          ? "Copiado! Cole no Agente Arquiteto ou ChatGPT."
          : "Copiado! Cole no Lovable.",
      );
      setTimeout(() => setOk(false), 1600);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };
  const cls =
    tipo === "agente"
      ? ok
        ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
        : "border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
      : ok
      ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
      : "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20";
  return (
    <button
      onClick={handle}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-semibold transition ${cls}`}
    >
      {ok ? <Check size={13} /> : <Copy size={13} />}
      {ok
        ? "Copiado!"
        : tipo === "agente"
        ? "Copiar para o Agente / ChatGPT"
        : "Copiar para o Lovable"}
    </button>
  );
}

function PromptCard({ item }: { item: PromptItem }) {
  const isAgente = item.tipo === "agente";
  const toneCard = isAgente
    ? "border-amber-400/30 bg-amber-400/5"
    : "border-accent/30 bg-accent/5";
  const toneIcon = isAgente
    ? "text-amber-300 bg-amber-400/15 border-amber-400/30"
    : "text-accent bg-accent/15 border-accent/30";
  const Icon = isAgente ? Bot : Wrench;
  return (
    <div className={`rounded-xl border p-4 ${toneCard}`}>
      <div className="flex items-start gap-3 mb-2">
        <div
          className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${toneIcon}`}
        >
          <Icon size={15} />
        </div>
        <div className="min-w-0 flex-1">
          <div
            className={`text-[10px] uppercase tracking-wider font-semibold mb-0.5 ${
              isAgente ? "text-amber-300/90" : "text-accent/90"
            }`}
          >
            {isAgente ? "Decisão estratégica" : "Execução no Lovable"}
          </div>
          <h4 className="font-heading font-semibold text-sm md:text-base leading-tight">
            {item.titulo}
          </h4>
          {item.descricao && (
            <p className="text-[11px] md:text-xs text-muted-foreground mt-1 leading-relaxed">
              {item.descricao}
            </p>
          )}
        </div>
      </div>
      <div className="rounded-lg border border-white/10 bg-black/40 p-3 mb-3 max-h-56 overflow-y-auto">
        <pre className="text-[11.5px] md:text-xs whitespace-pre-wrap font-mono text-foreground/85 leading-relaxed">
          {item.texto.trim()}
        </pre>
      </div>
      <CopyPromptButton text={item.texto} tipo={item.tipo} />
    </div>
  );
}

export function PromptsExecutarEtapa({
  intro,
  prompts,
}: {
  intro?: string;
  prompts: PromptItem[];
}) {
  return (
    <GlassCard className="p-5 md:p-6 mb-6 border-accent/30">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={18} className="text-accent" />
        <span className="text-[11px] uppercase tracking-wider text-accent">
          Prompts prontos
        </span>
      </div>
      <h3 className="text-lg md:text-xl font-heading font-bold leading-tight mb-2">
        Prompts para executar esta etapa
      </h3>
      <p className="text-xs md:text-sm text-foreground/80 leading-relaxed mb-4">
        {intro ??
          "Use primeiro os prompts de decisão estratégica (Agente Arquiteto / ChatGPT) para revisar e decidir. Depois use os prompts de execução no Lovable apenas quando houver uma tarefa técnica clara."}
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        {prompts.map((p) => (
          <PromptCard key={p.id} item={p} />
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
        Preencha os campos entre colchetes antes de colar. Estes prompts não
        prometem aprovação em loja, vendas, downloads ou resultado financeiro.
      </p>
    </GlassCard>
  );
}

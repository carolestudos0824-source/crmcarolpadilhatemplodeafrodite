import { useEffect, useState } from "react";
import { Copy, Check, ChevronDown, Sparkles, Wrench, Target, Compass, Bot, Code2 } from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/GlassCard";

type Props = {
  number: number;
  title: string;
  description: string; // purpose
  whenToUse: string;
  whereToPaste: string;
  expectedResult: string;
  commandText: string;
  defaultOpen?: boolean;
  completedKey: string;
  // Campos opcionais — usados pelo módulo "Construir app" (central guiada).
  objective?: string;
  whenLovableDirect?: string;
  whenAgentFirst?: string;
  agentPrompt?: string;
  correctionPrompt?: string;
  advanceCriteria?: string;
};

const STATE_PREFIX = "fabrica_apps_cmd_done_";
export const COMMAND_TOGGLE_EVENT = "fabrica:cmd-toggle";

export const CommandCard = ({
  number,
  title,
  description,
  whenToUse,
  whereToPaste,
  expectedResult,
  commandText,
  defaultOpen = false,
  completedKey,
  objective,
  whenLovableDirect,
  whenAgentFirst,
  agentPrompt,
  correctionPrompt,
  advanceCriteria,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const storageKey = `${STATE_PREFIX}${completedKey}`;

  useEffect(() => {
    try {
      setDone(localStorage.getItem(storageKey) === "1");
    } catch {
      // ignore
    }
  }, [storageKey]);

  const toggleDone = () => {
    const next = !done;
    setDone(next);
    try {
      localStorage.setItem(storageKey, next ? "1" : "0");
    } catch {
      // ignore
    }
    try {
      window.dispatchEvent(new Event(COMMAND_TOGGLE_EVENT));
    } catch {
      // ignore
    }
  };

  const copyText = async (
    text: string,
    key: string,
    successMsg: string,
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(successMsg);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1800);
    } catch {
      toast.error("Não foi possível copiar. Selecione e copie manualmente.");
    }
  };

  const isGuided =
    !!objective ||
    !!whenLovableDirect ||
    !!whenAgentFirst ||
    !!agentPrompt ||
    !!correctionPrompt ||
    !!advanceCriteria;

  return (
    <GlassCard className="p-5 md:p-6 space-y-4 scroll-mt-24">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-4 text-left"
      >
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent font-heading font-bold flex items-center justify-center">
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading font-semibold text-base md:text-lg leading-snug">
              {title}
            </h3>
            {done && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Concluído
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 mt-2 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="space-y-4 pt-2 border-t border-white/10">
          {objective && (
            <div className="rounded-lg border border-accent/25 bg-accent/5 p-3 flex items-start gap-2">
              <Target size={14} className="text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-accent mb-0.5">
                  Objetivo da etapa
                </div>
                <p className="text-[13px] text-foreground/90 leading-snug">{objective}</p>
              </div>
            </div>
          )}

          <dl className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              ["Quando usar", whenToUse],
              ["Onde colar", whereToPaste],
              ["Resultado esperado", expectedResult],
            ].map(([label, text]) => (
              <div
                key={label}
                className="rounded-lg bg-white/5 border border-white/10 p-3"
              >
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1">
                  {label}
                </dt>
                <dd className="text-foreground/85 text-[13px] leading-snug">
                  {text}
                </dd>
              </div>
            ))}
          </dl>

          {(whenLovableDirect || whenAgentFirst) && (
            <div className="grid sm:grid-cols-2 gap-3">
              {whenLovableDirect && (
                <div className="rounded-lg border border-primary/25 bg-primary/5 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary mb-1">
                    <Code2 size={12} /> Usar direto no Lovable quando
                  </div>
                  <p className="text-[13px] text-foreground/85 leading-snug">{whenLovableDirect}</p>
                </div>
              )}
              {whenAgentFirst && (
                <div className="rounded-lg border border-amber-400/25 bg-amber-400/5 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-amber-300 mb-1">
                    <Bot size={12} /> Usar o Agente antes quando
                  </div>
                  <p className="text-[13px] text-foreground/85 leading-snug">{whenAgentFirst}</p>
                </div>
              )}
            </div>
          )}

          {/* Comando principal para o Lovable */}
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-accent mb-1.5">
              <Sparkles size={12} /> Comando para o Lovable
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 max-h-72 overflow-auto">
              <pre className="text-xs md:text-[13px] p-4 whitespace-pre-wrap font-mono text-foreground/90">
                {commandText}
              </pre>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                onClick={() =>
                  copyText(commandText, "main", "Comando copiado. Agora cole no Lovable.")
                }
                className="btn-primary text-sm"
                type="button"
              >
                {copiedKey === "main" ? <Check size={16} /> : <Copy size={16} />}
                {copiedKey === "main" ? "Copiado" : "Copiar comando"}
              </button>
            </div>
          </div>

          {agentPrompt && (
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-amber-300 mb-1.5">
                <Bot size={12} /> Prompt para o Agente Arquiteto
              </div>
              <div className="rounded-xl border border-amber-400/20 bg-amber-950/20 max-h-72 overflow-auto">
                <pre className="text-xs md:text-[13px] p-4 whitespace-pre-wrap font-mono text-foreground/85">
                  {agentPrompt}
                </pre>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() =>
                    copyText(agentPrompt, "agent", "Prompt do Agente copiado.")
                  }
                  type="button"
                  className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
                >
                  {copiedKey === "agent" ? <Check size={16} /> : <Copy size={16} />}
                  {copiedKey === "agent" ? "Copiado" : "Copiar prompt do Agente"}
                </button>
              </div>
            </div>
          )}

          {correctionPrompt && (
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-rose-300 mb-1.5">
                <Wrench size={12} /> Prompt de correção
              </div>
              <div className="rounded-xl border border-rose-400/20 bg-rose-950/20 max-h-72 overflow-auto">
                <pre className="text-xs md:text-[13px] p-4 whitespace-pre-wrap font-mono text-foreground/85">
                  {correctionPrompt}
                </pre>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() =>
                    copyText(correctionPrompt, "fix", "Prompt de correção copiado.")
                  }
                  type="button"
                  className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-400/40 bg-rose-400/10 text-rose-200 hover:bg-rose-400/15"
                >
                  {copiedKey === "fix" ? <Check size={16} /> : <Copy size={16} />}
                  {copiedKey === "fix" ? "Copiado" : "Copiar prompt de correção"}
                </button>
              </div>
            </div>
          )}

          {advanceCriteria && (
            <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3 flex items-start gap-2">
              <Compass size={14} className="text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-emerald-300 mb-0.5">
                  Critério para avançar
                </div>
                <p className="text-[13px] text-foreground/90 leading-snug">{advanceCriteria}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-white/5">
            <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={done}
                onChange={toggleDone}
                className="accent-accent w-4 h-4"
              />
              Já usei este comando
            </label>
            {isGuided && (
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                Etapa guiada
              </span>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
};

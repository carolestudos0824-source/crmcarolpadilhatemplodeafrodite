import { useEffect, useState } from "react";
import { Copy, Check, ChevronDown } from "lucide-react";
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
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
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
    // Notifica a página /entrega para recalcular o progresso geral imediatamente.
    try {
      window.dispatchEvent(new Event(COMMAND_TOGGLE_EVENT));
    } catch {
      // ignore
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(commandText);
      setCopied(true);
      toast.success("Comando copiado. Agora cole no Lovable.");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Não foi possível copiar. Selecione e copie manualmente.");
    }
  };

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

          <div className="rounded-xl border border-white/10 bg-black/40 max-h-72 overflow-auto">
            <pre className="text-xs md:text-[13px] p-4 whitespace-pre-wrap font-mono text-foreground/90">
              {commandText}
            </pre>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={done}
                onChange={toggleDone}
                className="accent-accent w-4 h-4"
              />
              Já usei este comando
            </label>
            <button
              onClick={copy}
              className="btn-primary text-sm"
              type="button"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copiado" : "Copiar comando"}
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

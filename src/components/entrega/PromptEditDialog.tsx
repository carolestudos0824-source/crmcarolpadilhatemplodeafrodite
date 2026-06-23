import { useEffect, useState } from "react";
import { X, Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  stepName: string;
  originalPrompt: string;
  /** localStorage key to persist edits between sessions (optional). */
  storageKey?: string;
};

export function PromptEditDialog({ open, onClose, stepName, originalPrompt, storageKey }: Props) {
  const [text, setText] = useState(originalPrompt);
  const [copied, setCopied] = useState(false);

  // When opening, hydrate from storage (or original) and reset copy badge.
  useEffect(() => {
    if (!open) return;
    let initial = originalPrompt;
    if (storageKey && typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved !== null) initial = saved;
      } catch {
        /* ignore */
      }
    }
    setText(initial);
    setCopied(false);
  }, [open, originalPrompt, storageKey]);

  // Persist edits.
  useEffect(() => {
    if (!open || !storageKey || typeof window === "undefined") return;
    try {
      if (text === originalPrompt) {
        window.localStorage.removeItem(storageKey);
      } else {
        window.localStorage.setItem(storageKey, text);
      }
    } catch {
      /* ignore */
    }
  }, [text, open, originalPrompt, storageKey]);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Prompt copiado.");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const handleRestore = () => {
    setText(originalPrompt);
    toast.success("Prompt original restaurado.");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-white/10 rounded-2xl w-full sm:max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Revisar prompt — ${stepName}`}
      >
        <div className="flex items-start justify-between gap-3 p-4 sm:p-5 border-b border-white/10">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-accent/80 mb-1">
              Editor de prompt
            </div>
            <h3 className="text-base sm:text-lg font-heading font-bold leading-tight truncate">
              Revisar prompt — {stepName}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Revise e ajuste o comando antes de copiar para o Lovable.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="shrink-0 p-2 rounded-lg hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 sm:p-5 flex-1 overflow-auto">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            className="w-full h-[40vh] sm:h-[48vh] rounded-xl border border-white/10 bg-black/40 p-3 text-[13px] font-mono text-foreground/95 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 p-4 sm:p-5 border-t border-white/10">
          <button
            onClick={handleRestore}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/15 bg-white/5 text-foreground/90 hover:bg-white/10 text-sm font-semibold"
          >
            <RotateCcw size={14} /> Restaurar original
          </button>
          <button
            onClick={handleCopy}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition sm:ml-auto ${
              copied
                ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
                : "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copiado!" : "Copiar prompt"}
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/15 bg-white/[0.03] text-foreground/80 hover:bg-white/10 text-sm font-semibold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

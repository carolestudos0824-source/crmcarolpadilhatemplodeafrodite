import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, Check, RotateCcw, Settings2, Bookmark } from "lucide-react";
import { usePromptStudio, type PromptStudioOptions } from "./PromptStudioProvider";
import { useAuthState } from "@/hooks/useAuthState";
import { savePromptForUser } from "@/lib/savePrompt";

type Props = {
  originalPrompt: string;
  onCopy?: (text: string) => void;
  onChange?: (text: string) => void;
  placeholder?: string;
  storageKey?: string;
  copyLabel?: string;
  /** Optional transform applied to the text right before it is copied. */
  transformOnCopy?: (text: string) => string;
  /** Optional helper text shown below the action buttons. */
  helperText?: string;
  /** Hide the built-in copy button (when parent renders its own copy action). */
  hideCopyButton?: boolean;
  className?: string;
  /** When provided, renders an "Editar no Estúdio" button that opens the global PromptStudio. */
  studio?: PromptStudioOptions;
  /** Title used when saving this prompt to "Prompts salvos". Falls back to a snippet. */
  saveTitle?: string;
  /** Source module identifier used when saving. Optional. */
  saveSourceModule?: string;
  /** Hide the built-in save button when the parent doesn't want it (default: shown). */
  hideSaveButton?: boolean;
  /** When true, the prompt textarea is collapsed by default; user clicks "Ver prompt completo" to expand. */
  collapsible?: boolean;
};




export function EditablePromptBox({
  originalPrompt,
  onCopy,
  onChange,
  placeholder,
  storageKey,
  copyLabel = "Copiar comando",
  transformOnCopy,
  helperText,
  hideCopyButton,
  className,
  studio,
  saveTitle,
  saveSourceModule,
  hideSaveButton,
}: Props) {
  const { openPromptStudio } = usePromptStudio();
  const auth = useAuthState();
  const userId = auth.status === "authed" ? auth.userId : null;
  const [saving, setSaving] = useState(false);

  const [value, setValue] = useState<string>(() => {
    if (storageKey && typeof window !== "undefined") {
      const saved = window.localStorage.getItem(storageKey);
      if (saved !== null) return saved;
    }
    return originalPrompt;
  });
  const [copied, setCopied] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // auto-resize
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [value]);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    if (value === originalPrompt) {
      window.localStorage.removeItem(storageKey);
    } else {
      window.localStorage.setItem(storageKey, value);
    }
  }, [value, storageKey, originalPrompt]);

  const handleCopy = async () => {
    try {
      const out = transformOnCopy ? transformOnCopy(value) : value;
      await navigator.clipboard.writeText(out.trim());
      setCopied(true);
      toast.success("Comando copiado.");
      onCopy?.(out);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const handleRestore = () => {
    setValue(originalPrompt);
    toast.success("Prompt original restaurado.");
  };

  const edited = value !== originalPrompt;

  const handleSave = async () => {
    if (saving) return;
    if (!userId) {
      toast.error("Entre na sua conta para salvar prompts.");
      return;
    }
    const content = value.trim();
    if (!content) {
      toast.error("Não há conteúdo para salvar.");
      return;
    }
    setSaving(true);
    const result = await savePromptForUser({
      userId,
      title: saveTitle ?? "",
      content,
      sourceModule: saveSourceModule,
    });
    setSaving(false);
    if (result.status === "ok") toast.success("Prompt salvo.");
    else if (result.status === "duplicate") toast("Esse prompt já está salvo.");
    else if (result.status === "empty") toast.error("Não há conteúdo para salvar.");
    else toast.error("Não foi possível salvar o prompt. Tente novamente.");
  };

  return (
    <div className={`w-full ${className ?? ""}`}>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e.target.value);
        }}
        placeholder={placeholder}
        spellCheck={false}
        className="w-full min-h-[140px] resize-y rounded-xl border border-white/10 bg-black/40 p-4 text-[13px] font-mono leading-relaxed text-foreground/90 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition"
      />
      <p className="text-[11px] text-muted-foreground/80 mt-1.5">
        Você pode editar este comando antes de copiar.
      </p>
      <div className="flex flex-wrap items-center gap-2 mt-3">
        {!hideCopyButton && (
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition ${
              copied
                ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
                : "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copiado!" : copyLabel}
          </button>
        )}
        {studio && (
          <button
            type="button"
            onClick={() =>
              openPromptStudio({
                ...studio,
                command: studio.command ?? value,
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-xs text-foreground/80 hover:bg-white/10 transition"
            title="Abrir no Estúdio de Prompt"
          >
            <Settings2 size={12} />
            Editar no Estúdio
          </button>
        )}
        {edited && (
          <button
            onClick={handleRestore}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-xs text-foreground/70 hover:bg-white/10 transition"
          >
            <RotateCcw size={12} />
            Restaurar original
          </button>
        )}
        {!hideSaveButton && (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-xs text-foreground/80 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Salvar este prompt em Prompts salvos"
          >
            <Bookmark size={12} />
            {saving ? "Salvando…" : "Salvar prompt"}
          </button>
        )}
      </div>
      {helperText && (
        <p className="text-[10px] text-muted-foreground/80 mt-2">{helperText}</p>
      )}

    </div>
  );
}

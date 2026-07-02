import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";

/**
 * Micro-prova visual ética — SEM prova social falsa.
 * Não simula cadastro/compra. Apenas reforça o valor do programa.
 */
export const JourneyNotification = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  if (dismissed) return null;

  return (
    <div
      aria-live="polite"
      className={[
        "fixed z-40 pointer-events-none",
        "bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6",
        "sm:max-w-[320px]",
        "transition-all duration-500 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        "hidden sm:block",
      ].join(" ")}
    >
      <div
        className="pointer-events-auto relative flex items-start gap-3 rounded-xl border p-3 pr-8 shadow-lg backdrop-blur-md"
        style={{
          background: "rgba(11, 16, 32, 0.92)",
          borderColor: "rgba(215, 180, 90, 0.35)",
          boxShadow: "0 10px 30px -12px rgba(215, 180, 90, 0.25), 0 0 0 1px rgba(215, 180, 90, 0.08)",
        }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, #D7B45A, #1E88FF)",
          }}
        >
          <Sparkles size={16} className="text-background" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-foreground leading-tight">
            Jornada guiada ativa
          </p>
          <p className="mt-0.5 text-[12px] text-muted-foreground leading-snug">
            Crie seu app no Lovable com prompts, checklists e próximos passos claros.
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar aviso"
          onClick={() => setDismissed(true)}
          className="absolute top-1.5 right-1.5 rounded-md p-1 text-muted-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
        >
          <X size={12} />
        </button>
        <span
          className="absolute -left-[1px] top-3 bottom-3 w-[2px] rounded-full"
          style={{ background: "linear-gradient(180deg, #D7B45A, #1E88FF)" }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default JourneyNotification;

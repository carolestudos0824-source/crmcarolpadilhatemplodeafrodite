import { toast } from "sonner";
import { AGENTE_ARQUITETO_URL } from "@/lib/agenteArquiteto";

/**
 * Modal de fallback usado quando o clipboard falha ao tentar copiar
 * um prompt antes de abrir o Agente Arquiteto. Permite ao aluno
 * copiar manualmente e abrir o Agente em nova aba.
 *
 * Reaproveita o padrão visual já usado em AppModelCard / Entrega.
 */
export const AgentClipboardFallback = ({
  prompt,
  onClose,
}: {
  prompt: string | null;
  onClose: () => void;
}) => {
  if (!prompt) return null;
  return (
    <div
      className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-white/10 rounded-2xl max-w-xl w-full p-5 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="font-heading font-bold text-lg">Copie manualmente o prompt</h4>
        <p className="text-xs text-muted-foreground">
          Não foi possível copiar automaticamente. Copie o prompt abaixo e cole
          no Agente Arquiteto com Ctrl+V.
        </p>
        <textarea
          readOnly
          value={prompt}
          className="w-full h-64 rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-foreground font-mono"
          onFocus={(e) => e.currentTarget.select()}
        />
        <div className="flex flex-wrap gap-2 justify-end">
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(prompt);
                toast.success("Prompt copiado.");
              } catch {
                toast.error("Selecione o texto e copie manualmente (Ctrl+C).");
              }
            }}
            className="px-3 py-1.5 min-h-[40px] rounded-md border border-white/15 hover:bg-white/5 text-xs"
          >
            Copiar manualmente
          </button>
          <a
            href={AGENTE_ARQUITETO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 min-h-[40px] inline-flex items-center rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 text-xs font-semibold"
          >
            Abrir Agente Arquiteto
          </a>
          <button
            onClick={onClose}
            className="px-3 py-1.5 min-h-[40px] rounded-md border border-white/15 hover:bg-white/5 text-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

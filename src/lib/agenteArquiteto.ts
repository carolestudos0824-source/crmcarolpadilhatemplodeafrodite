// Constante e helper únicos para abrir o Agente Arquiteto de Aplicativos.
// Usado por todos os botões "Revisar com o Agente" no programa.
import { toast } from "sonner";

export const AGENTE_ARQUITETO_URL =
  "https://chatgpt.com/g/g-6a331f876adc8191a174b85fa0aac1bf-agente-arquiteto-de-aplicativos";

export const openAgenteArquiteto = () => {
  if (typeof window === "undefined") return;
  window.open(AGENTE_ARQUITETO_URL, "_blank", "noopener,noreferrer");
};

export type CopyPromptAndOpenAgentOptions = {
  /** Prompt contextual que deve ser copiado antes de abrir o Agente. */
  prompt?: string;
  /** Toast exibido após copiar com sucesso. */
  successMessage?: string;
  /** Toast exibido quando não há prompt (apenas abre o Agente). */
  emptyMessage?: string;
  /**
   * Quando passado e a cópia falhar, o Agente NÃO é aberto e este callback
   * recebe o prompt para mostrar um fallback (modal de cópia manual).
   * Se ausente, mostramos um toast de erro e abrimos o Agente mesmo assim.
   */
  onClipboardFail?: (prompt: string) => void;
};

/**
 * Copia o prompt contextual e só então abre o Agente Arquiteto.
 *
 * Regras:
 * - Se houver prompt: copia → abre Agente → toast de sucesso.
 * - Se NÃO houver prompt: apenas abre o Agente com toast informativo.
 * - Se a cópia falhar e existir `onClipboardFail`: NÃO abre o Agente;
 *   delega para o fallback (geralmente um modal com cópia manual).
 */
/**
 * Fallback síncrono de cópia para ambientes onde `navigator.clipboard`
 * está indisponível ou bloqueado (ex.: iframe de preview sem permissão,
 * Safari sem foco, contexto não-seguro). Mantém o gesto do usuário.
 */
function copyTextSync(text: string): boolean {
  if (typeof document === "undefined") return false;
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.opacity = "0";
    ta.style.pointerEvents = "none";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export async function copyPromptAndOpenAgent(
  opts: CopyPromptAndOpenAgentOptions = {},
): Promise<void> {
  const { prompt, successMessage, emptyMessage, onClipboardFail } = opts;
  const trimmed = prompt?.trim();

  if (!trimmed) {
    openAgenteArquiteto();
    toast.success(
      emptyMessage ??
        "Agente Arquiteto aberto. Use ele para tirar dúvidas e decidir o próximo passo.",
    );
    return;
  }

  // 1) Tenta cópia SÍNCRONA primeiro (preserva user gesture e funciona em
  //    iframes/preview onde a Clipboard API assíncrona é bloqueada).
  const syncCopied = copyTextSync(prompt!);

  // 2) Tenta também a Clipboard API assíncrona como reforço/atualização.
  let asyncCopied = false;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(prompt!);
      asyncCopied = true;
    }
  } catch {
    asyncCopied = false;
  }

  if (syncCopied || asyncCopied) {
    openAgenteArquiteto();
    toast.success(
      successMessage ??
        "Prompt copiado. O Agente Arquiteto abriu em outra aba. Cole lá para revisar sua ideia antes de construir.",
    );
    return;
  }

  // 3) Cópia falhou nos dois caminhos.
  if (onClipboardFail) {
    onClipboardFail(prompt!);
    return;
  }
  toast.error(
    "Não consegui copiar automaticamente. Copie o texto manualmente antes de abrir o Agente.",
  );
}

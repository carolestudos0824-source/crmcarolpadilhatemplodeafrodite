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
  /** Prompt contextual a ser copiado para o clipboard. */
  prompt?: string;
  /** Toast exibido após copiar com sucesso. */
  successMessage?: string;
  /** Toast exibido quando não há prompt para copiar. */
  emptyMessage?: string;
  /**
   * Quando passado e a cópia falhar, este callback recebe o prompt para
   * mostrar um fallback (ex.: modal com cópia manual). Se ausente,
   * mostramos um toast de erro pedindo cópia manual.
   */
  onClipboardFail?: (prompt: string) => void;
};

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

/**
 * Fluxo em 2 passos: APENAS copia o prompt para o clipboard e mostra
 * feedback. NÃO abre o Agente automaticamente — o usuário decide quando
 * abrir, usando o botão/link "Abrir Agente Arquiteto" ao lado.
 *
 * Motivo: no teste real, o `window.open` após `await` da Clipboard API
 * disparava o popup sem o texto chegar no clipboard de forma confiável.
 *
 * O nome `copyPromptAndOpenAgent` foi mantido para não quebrar imports
 * existentes, mas o comportamento agora é copy-only. Quando não há
 * prompt, mostra um toast pedindo para abrir o Agente manualmente.
 *
 * Retorna `true` se a cópia teve sucesso, `false` caso contrário.
 */
export async function copyPromptAndOpenAgent(
  opts: CopyPromptAndOpenAgentOptions = {},
): Promise<boolean> {
  const { prompt, successMessage, emptyMessage, onClipboardFail } = opts;
  const trimmed = prompt?.trim();

  if (!trimmed) {
    toast.info(
      emptyMessage ??
        "Sem prompt para copiar. Abra o Agente Arquiteto pelo botão ao lado.",
    );
    return false;
  }

  // 1) Cópia SÍNCRONA primeiro (preserva user gesture e funciona em
  //    iframes/preview onde a Clipboard API assíncrona é bloqueada).
  const syncCopied = copyTextSync(prompt!);

  // 2) Reforço via Clipboard API assíncrona.
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
    toast.success(
      successMessage ??
        "Prompt copiado. Agora abra o Agente Arquiteto e cole com Ctrl+V (ou Cmd+V).",
    );
    return true;
  }

  // 3) Cópia falhou.
  if (onClipboardFail) {
    onClipboardFail(prompt!);
    return false;
  }
  toast.error(
    "Não consegui copiar automaticamente. Selecione o texto e copie manualmente antes de abrir o Agente.",
  );
  return false;
}


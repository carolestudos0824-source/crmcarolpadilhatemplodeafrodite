import { Bot } from "lucide-react";
import { toast } from "sonner";
import { openAgenteArquiteto } from "@/lib/agenteArquiteto";

/**
 * Card reutilizável do Agente Arquiteto.
 *
 * Comportamento:
 * - Se receber `prompt`, copia o texto antes de abrir o Agente em outra aba.
 * - Se não receber, apenas abre o Agente e mostra mensagem genérica.
 *
 * Variantes:
 * - "hero"    → bloco grande, usado em modais de plano de app e topo da /entrega.
 * - "compact" → versão menor para sidebars, estados vazios e fim de checklists.
 *
 * Este componente afeta apenas UI/UX. Não toca em RLS, autenticação, módulos,
 * progresso, checkout ou regras de acesso.
 */

export interface AgentArchitectCardProps {
  /** Texto que será copiado para a área de transferência ao clicar no CTA. */
  prompt?: string;
  /** Mensagem mostrada em toast após copiar. */
  successMessage?: string;
  /** Título principal. */
  title?: string;
  /** Subtítulo curto. */
  subtitle?: string;
  /** Parágrafo explicativo. */
  description?: string;
  /** Lista curta de benefícios (3–4 itens). */
  benefits?: string[];
  /** Texto do botão. Se omitido, usa "Revisar com o Agente Arquiteto" quando há prompt, ou "Abrir Agente Arquiteto" quando não há. */
  ctaLabel?: string;
  /** Pequena legenda acima do título (ex.: "Etapa 1 de 2 · recomendado para iniciantes"). */
  eyebrow?: string;
  /** Tamanho visual. */
  variant?: "hero" | "compact";
  /** Classe extra para o wrapper. */
  className?: string;
  /** Sobrescreve o comportamento padrão do CTA. Quando passado, é executado em vez do handler interno. */
  onClick?: () => void | Promise<void>;
}

const DEFAULT_BENEFITS = [
  "Entenda o que construir primeiro",
  "Evite criar um app inchado",
  "Melhore o prompt antes de colar no Lovable",
  "Tire dúvidas sobre telas, dados e funcionalidades",
];

export const AgentArchitectCard = ({
  prompt,
  successMessage,
  title = "Comece pelo Agente Arquiteto",
  subtitle = "Ele te ajuda a revisar, simplificar e melhorar sua ideia antes de construir.",
  description,
  benefits,
  ctaLabel,
  eyebrow,
  variant = "hero",
  className = "",
}: AgentArchitectCardProps) => {
  const hasPrompt = !!prompt && prompt.trim().length > 0;
  const finalCta = ctaLabel ?? (hasPrompt ? "Revisar com o Agente Arquiteto" : "Abrir Agente Arquiteto");
  const finalDescription =
    description ??
    (hasPrompt
      ? "Se você é iniciante, use o Agente Arquiteto antes de colar o prompt no Lovable. Ele te ajuda a entender o plano, cortar excesso, melhorar telas, ajustar banco de dados e deixar o app mais fácil de construir."
      : "Abra o Agente Arquiteto para tirar dúvidas sobre o programa, sua ideia ou o próximo passo.");
  const finalBenefits = benefits ?? (variant === "hero" ? DEFAULT_BENEFITS.slice(0, 3) : []);

  const handleClick = async () => {
    if (hasPrompt) {
      try {
        await navigator.clipboard.writeText(prompt!);
        openAgenteArquiteto();
        toast.success(
          successMessage ??
            "Prompt copiado. Cole no Agente Arquiteto para revisar sua ideia antes de construir.",
        );
      } catch {
        openAgenteArquiteto();
        toast.error(
          "Não consegui copiar automaticamente. Copie o prompt manualmente e cole no Agente Arquiteto.",
        );
      }
      return;
    }
    openAgenteArquiteto();
    toast.success("Use o Agente Arquiteto para tirar dúvidas e decidir o próximo passo.");
  };

  if (variant === "compact") {
    return (
      <div
        className={`relative overflow-hidden rounded-xl border border-cyan-400/40 bg-gradient-to-br from-[#07111F] to-[#0B1220] p-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Bot size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-heading font-semibold text-sm text-foreground">{title}</h4>
            <p className="text-xs text-foreground/70 mt-1">{subtitle}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClick}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition"
        >
          <Bot size={14} /> {finalCta}
        </button>
      </div>
    );
  }

  return (
    <section
      aria-label={title}
      className={`relative overflow-hidden rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-[#07111F] via-[#0B1220] to-[#08243f] p-5 sm:p-6 shadow-[0_0_40px_-12px_rgba(34,211,238,0.35)] ${className}`}
    >
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Bot size={26} />
          </div>
          <div className="min-w-0">
            {eyebrow && (
              <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-300/90 font-semibold mb-1">
                {eyebrow}
              </div>
            )}
            <h3 className="font-heading font-bold text-2xl sm:text-[26px] leading-tight text-foreground">
              {title}
            </h3>
            <p className="text-sm text-foreground/80 mt-1.5">{subtitle}</p>
          </div>
        </div>

        <p className="text-sm text-foreground/75">{finalDescription}</p>

        {finalBenefits.length > 0 && (
          <ul className="grid sm:grid-cols-3 gap-2 text-xs text-foreground/85">
            {finalBenefits.map((b) => (
              <li
                key={b}
                className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 leading-snug"
              >
                <span className="text-cyan-300 mr-1.5">✓</span>
                {b}
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={handleClick}
          className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-heading font-bold text-base sm:text-lg shadow-[0_10px_30px_-10px_rgba(34,211,238,0.6)] hover:from-cyan-400 hover:to-blue-500 transition"
        >
          <Bot size={20} /> {finalCta}
        </button>

        {hasPrompt && (
          <p className="text-[11px] text-foreground/55 text-center">
            O prompt é copiado automaticamente. É só colar na conversa do Agente.
          </p>
        )}
      </div>
    </section>
  );
};

export default AgentArchitectCard;

import { ChevronDown, ClipboardList } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Wrapper recolhível para checklists opcionais da área /entrega.
 *
 * Regra de uso:
 * - O checklist é apenas ferramenta de conferência (não obrigatório).
 * - Fica FECHADO por padrão para não dominar a tela.
 * - Deve aparecer no final do módulo, depois dos prompts e cards de revisão.
 *
 * Preserva 100% do conteúdo interno (inclusive progresso salvo em
 * useUserProgress via checklist store) — apenas adiciona o toggle visual.
 */
export function ChecklistDisclosure({
  title = "Checklist opcional desta etapa",
  hint = "Use este checklist apenas se quiser revisar esta etapa antes de avançar. Ele é uma ferramenta de conferência, não uma obrigação. Se você já executou os prompts e entendeu o próximo passo, pode continuar sua jornada.",
  defaultOpen = false,
  children,
}: {
  title?: string;
  hint?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      className="group rounded-xl border border-border/60 bg-card/40 overflow-hidden transition-colors hover:border-accent/40"
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary className="flex items-center gap-3 cursor-pointer list-none px-4 py-3 select-none hover:bg-white/[0.03] transition-colors">
        <ClipboardList size={16} className="text-accent shrink-0" aria-hidden />
        <div className="flex-1 min-w-0">
          <div className="font-heading font-semibold text-sm leading-tight">
            {title}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            Opcional — abra para conferir antes de avançar.
          </div>
        </div>
        <ChevronDown
          size={16}
          className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="px-4 pb-4 pt-1 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>
        {children}
      </div>
    </details>
  );
}

export default ChecklistDisclosure;

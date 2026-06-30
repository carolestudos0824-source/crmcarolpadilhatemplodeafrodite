/**
 * BrandName — assinatura textual oficial da marca.
 *
 * Sempre renderiza "Fábrica de Apps com IA" com:
 *  - "Fábrica de Apps com" em tom claro (foreground)
 *  - "IA" em amarelo/dourado (text-gold)
 *
 * Use este componente em todos os locais onde a marca aparece como texto
 * (headers, sidebars, área /entrega, área /admin) para manter consistência.
 */
interface BrandNameProps {
  className?: string;
  /** Cor base do trecho "Fábrica de Apps com". Default: foreground claro. */
  baseClassName?: string;
}

export const BrandName = ({
  className = "",
  baseClassName = "text-foreground",
}: BrandNameProps) => (
  <span className={`whitespace-nowrap ${className}`}>
    <span className={baseClassName}>Fábrica de Apps</span>
    <span className="text-gold font-semibold"> com IA</span>
  </span>
);

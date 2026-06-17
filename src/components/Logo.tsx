import { Link } from "react-router-dom";

interface LogoProps { size?: number; withText?: boolean; className?: string; }

export const Logo = ({ size = 36, withText = true, className = "" }: LogoProps) => (
  <Link to="/" className={`flex items-center gap-3 group ${className}`}>
    <img
      src="/logo-fabrica-apps-ia.png"
      alt="Fábrica de Apps com IA"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="object-contain drop-shadow-[0_0_12px_hsl(var(--accent)/0.4)] transition-transform group-hover:scale-105"
    />
    {withText && (
      <span className="font-heading font-semibold text-sm sm:text-base text-foreground whitespace-nowrap">
        Fábrica de Apps <span className="text-gold">com IA</span>
      </span>
    )}
  </Link>
);

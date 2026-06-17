import { Link } from "react-router-dom";

type LogoSize = "sm" | "md" | "lg" | "xl" | "hero";

const sizes: Record<LogoSize, { px: number; mobilePx?: number; cls: string }> = {
  sm: { px: 32, cls: "rounded-xl object-contain shadow-[0_0_24px_rgba(30,136,255,0.25)]" },
  md: { px: 40, mobilePx: 32, cls: "rounded-xl object-contain shadow-[0_0_24px_rgba(30,136,255,0.25)]" },
  lg: { px: 72, cls: "rounded-2xl object-contain shadow-[0_0_30px_rgba(30,136,255,0.3)]" },
  xl: { px: 120, cls: "rounded-2xl object-contain drop-shadow-[0_0_35px_rgba(0,194,255,0.35)]" },
  hero: { px: 480, cls: "w-full max-w-[340px] md:max-w-[480px] h-auto object-contain rounded-[2rem] drop-shadow-[0_0_45px_rgba(0,194,255,0.35)]" },
};

interface LogoProps {
  size?: LogoSize;
  showText?: boolean;
  asLink?: boolean;
  className?: string;
}

export const Logo = ({ size = "md", showText = false, asLink = true, className = "" }: LogoProps) => {
  const cfg = sizes[size];
  const img = (
    <img
      src="/logo-fabrica-apps-ia.png"
      alt="Fábrica de Apps com IA"
      className={`${cfg.cls} ${size === "md" && cfg.mobilePx ? "w-8 h-8 md:w-10 md:h-10" : ""}`}
      style={size === "hero" || (size === "md" && cfg.mobilePx) ? undefined : { width: cfg.px, height: cfg.px }}
    />
  );

  const content = (
    <span className={`flex items-center gap-3 group ${className}`}>
      {img}
      {showText && (
        <span className="font-heading font-semibold text-sm sm:text-base text-foreground whitespace-nowrap">
          Fábrica de Apps <span className="text-gold">com IA</span>
        </span>
      )}
    </span>
  );

  return asLink ? <Link to="/" className="inline-flex">{content}</Link> : content;
};

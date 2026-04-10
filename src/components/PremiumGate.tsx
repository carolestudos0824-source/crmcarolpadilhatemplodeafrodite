import { useNavigate } from "react-router-dom";
import { Crown, Sparkles, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumGateProps {
  /** What the user was trying to access */
  featureName?: string;
  /** Contextual message */
  message?: string;
  /** Compact inline version vs full block */
  variant?: "inline" | "block" | "banner";
  /** Show inside lesson flow */
  className?: string;
}

const VALUE_HOOKS = [
  "78 arcanos com análise profunda",
  "Combinações, tiragens e prática guiada",
  "Módulo exclusivo de Tarô e Amor",
  "Certificados digitais de conclusão",
];

const PremiumGate = ({
  featureName,
  message,
  variant = "block",
  className = "",
}: PremiumGateProps) => {
  const navigate = useNavigate();

  if (variant === "banner") {
    return (
      <button
        onClick={() => navigate("/premium")}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.99] ${className}`}
        style={{
          background: "linear-gradient(135deg, hsl(340 42% 28% / 0.06), hsl(36 45% 58% / 0.08))",
          border: "1px solid hsl(36 45% 58% / 0.18)",
        }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{
          background: "linear-gradient(135deg, hsl(340 42% 28% / 0.08), hsl(36 45% 58% / 0.12))",
        }}>
          <Crown className="w-3.5 h-3.5" style={{ color: "hsl(36 45% 50%)" }} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[11px] font-heading tracking-wide" style={{ color: "hsl(340 42% 20%)" }}>
            Jornada Completa
          </p>
          <p className="text-[10px]" style={{ color: "hsl(230 15% 30% / 0.40)" }}>
            Desbloqueie todos os módulos e conteúdos
          </p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(36 45% 50% / 0.50)" }} />
      </button>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl ${className}`}
        style={{
          background: "hsl(340 42% 28% / 0.04)",
          border: "1px solid hsl(340 42% 28% / 0.10)",
        }}
      >
        <Lock className="w-4 h-4 shrink-0" style={{ color: "hsl(36 45% 50% / 0.50)" }} />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-body" style={{ color: "hsl(230 15% 25% / 0.55)" }}>
            {featureName ? (
              <><span className="font-medium" style={{ color: "hsl(340 42% 20%)" }}>{featureName}</span> é conteúdo premium.</>
            ) : (
              "Este conteúdo faz parte da Jornada Completa."
            )}
          </p>
        </div>
        <button
          onClick={() => navigate("/premium")}
          className="text-[10px] font-heading tracking-wider uppercase shrink-0 px-3 py-1.5 rounded-lg transition-colors"
          style={{
            background: "hsl(340 42% 28% / 0.08)",
            color: "hsl(340 42% 28%)",
            border: "1px solid hsl(340 42% 28% / 0.15)",
          }}
        >
          Ver plano
        </button>
      </div>
    );
  }

  // block variant — full paywall card
  return (
    <div
      className={`rounded-2xl p-6 text-center space-y-4 ${className}`}
      style={{
        background: "linear-gradient(170deg, hsl(38 28% 95% / 0.95), hsl(36 33% 96%))",
        border: "1.5px solid hsl(36 45% 58% / 0.20)",
        boxShadow: "0 8px 40px hsl(340 42% 28% / 0.04)",
      }}
    >
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{
          background: "linear-gradient(135deg, hsl(340 42% 28% / 0.08), hsl(36 45% 58% / 0.12))",
          border: "1px solid hsl(36 45% 58% / 0.20)",
        }}>
          <Crown className="w-6 h-6" style={{ color: "hsl(36 45% 50%)" }} />
        </div>
      </div>

      {/* Title */}
      <div>
        <h3 className="font-heading text-lg tracking-wide" style={{ color: "hsl(340 42% 20%)" }}>
          {featureName ? `${featureName}` : "Conteúdo Premium"}
        </h3>
        <p className="font-accent text-sm italic mt-1" style={{ color: "hsl(230 15% 30% / 0.45)" }}>
          {message || "Este conteúdo faz parte da Jornada Completa."}
        </p>
      </div>

      {/* Divider */}
      <div className="flex justify-center">
        <div className="w-8 h-px" style={{ background: "hsl(36 45% 58% / 0.25)" }} />
      </div>

      {/* Value hooks */}
      <div className="space-y-2 text-left max-w-xs mx-auto">
        {VALUE_HOOKS.map((hook, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <Sparkles className="w-3 h-3 shrink-0" style={{ color: "hsl(36 45% 50% / 0.60)" }} />
            <span className="text-[12px] font-body" style={{ color: "hsl(230 15% 25% / 0.50)" }}>
              {hook}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button
        onClick={() => navigate("/premium")}
        className="font-heading tracking-wide text-[11px] uppercase px-8 py-5"
        style={{
          background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 42% 32%))",
          color: "hsl(36 33% 97%)",
          border: "1px solid hsl(340 42% 28% / 0.40)",
          boxShadow: "0 4px 20px hsl(340 42% 28% / 0.12)",
        }}
      >
        <Crown className="w-3.5 h-3.5 mr-2" />
        Conhecer a Jornada Completa
      </Button>
    </div>
  );
};

export default PremiumGate;

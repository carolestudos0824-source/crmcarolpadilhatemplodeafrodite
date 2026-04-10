import { useNavigate } from "react-router-dom";
import { Crown, Sparkles, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/hooks/use-premium";
import { useIsAdmin } from "@/hooks/use-admin";

interface PremiumGateProps {
  featureName?: string;
  message?: string;
  variant?: "inline" | "block" | "banner";
  className?: string;
  children?: React.ReactNode;
}

const VALUE_HOOKS = [
  "21 arcanos maiores com análise simbólica em camadas",
  "Aprofundamentos, exercícios e quizzes completos",
  "Módulos de Amor, Combinações, Tiragens e Prática",
  "Revisão inteligente e certificados por módulo",
];

const PremiumGate = ({
  featureName,
  message,
  variant = "block",
  className = "",
  children,
}: PremiumGateProps) => {
  const navigate = useNavigate();
  const { isPremium, loading } = usePremium();

  // If premium or loading, show children (unlocked content)
  if (loading) return null;
  if (isPremium && children) return <>{children}</>;
  if (isPremium) return null;

  if (variant === "banner") {
    return (
      <button
        onClick={() => navigate("/premium")}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.99] ${className}`}
        style={{
          background: "linear-gradient(135deg, hsl(var(--secondary) / 0.06), hsl(var(--gold) / 0.08))",
          border: "1px solid hsl(var(--gold) / 0.18)",
        }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{
          background: "linear-gradient(135deg, hsl(var(--secondary) / 0.08), hsl(var(--gold) / 0.12))",
        }}>
          <Crown className="w-3.5 h-3.5" style={{ color: "hsl(var(--gold))" }} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[11px] font-heading tracking-wide" style={{ color: "hsl(var(--secondary))" }}>
            Jornada Completa
          </p>
          <p className="text-[10px]" style={{ color: "hsl(var(--muted-foreground) / 0.40)" }}>
            Acesse todos os módulos e aprofundamentos
          </p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(var(--gold) / 0.50)" }} />
      </button>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl ${className}`}
        style={{
          background: "hsl(var(--secondary) / 0.04)",
          border: "1px solid hsl(var(--secondary) / 0.10)",
        }}
      >
        <Lock className="w-4 h-4 shrink-0" style={{ color: "hsl(var(--gold) / 0.50)" }} />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-body" style={{ color: "hsl(var(--muted-foreground) / 0.55)" }}>
            {featureName ? (
              <><span className="font-medium" style={{ color: "hsl(var(--secondary))" }}>{featureName}</span> é conteúdo premium.</>
            ) : (
              "Este conteúdo faz parte da Jornada Completa."
            )}
          </p>
        </div>
        <button
          onClick={() => navigate("/premium")}
          className="text-[10px] font-heading tracking-wider uppercase shrink-0 px-3 py-1.5 rounded-lg transition-colors"
          style={{
            background: "hsl(var(--secondary) / 0.08)",
            color: "hsl(var(--secondary))",
            border: "1px solid hsl(var(--secondary) / 0.15)",
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
        background: "linear-gradient(170deg, hsl(var(--mystic-surface) / 0.95), hsl(var(--card)))",
        border: "1.5px solid hsl(var(--gold) / 0.20)",
        boxShadow: "0 8px 40px hsl(var(--secondary) / 0.04)",
      }}
    >
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{
          background: "linear-gradient(135deg, hsl(var(--secondary) / 0.08), hsl(var(--gold) / 0.12))",
          border: "1px solid hsl(var(--gold) / 0.20)",
        }}>
          <Crown className="w-6 h-6" style={{ color: "hsl(var(--gold))" }} />
        </div>
      </div>

      <div>
        <h3 className="font-heading text-lg tracking-wide" style={{ color: "hsl(var(--midnight))" }}>
          {featureName ? `${featureName}` : "Conteúdo Premium"}
        </h3>
        <p className="font-accent text-sm italic mt-1" style={{ color: "hsl(var(--muted-foreground) / 0.45)" }}>
          {message || "Este conteúdo faz parte da Jornada Completa — sua formação sem limites."}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-8 h-px" style={{ background: "hsl(var(--gold) / 0.25)" }} />
      </div>

      <div className="space-y-2 text-left max-w-xs mx-auto">
        {VALUE_HOOKS.map((hook, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <Sparkles className="w-3 h-3 shrink-0" style={{ color: "hsl(var(--gold) / 0.60)" }} />
            <span className="text-[12px] font-body" style={{ color: "hsl(var(--muted-foreground) / 0.50)" }}>
              {hook}
            </span>
          </div>
        ))}
      </div>

      <Button
        onClick={() => navigate("/premium")}
        className="font-heading tracking-wide text-[11px] uppercase px-8 py-5"
        style={{
          background: "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--crimson-light)))",
          color: "hsl(var(--parchment))",
          border: "1px solid hsl(var(--secondary) / 0.40)",
          boxShadow: "0 4px 20px hsl(var(--secondary) / 0.12)",
        }}
      >
        <Crown className="w-3.5 h-3.5 mr-2" />
        Conhecer a Jornada Completa
      </Button>
    </div>
  );
};

export default PremiumGate;

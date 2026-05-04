import { useState, useCallback } from "react";
import { ChevronRight, Sparkles, Layers, Star, Moon, Sun, Eye, User } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";

interface OnboardingStep {
  symbol: React.ReactNode;
  kicker: string;
  title: string;
  lines: string[];
  accent: "gold" | "wine" | "plum";
  detail?: string;
}

const STEPS: OnboardingStep[] = [
  {
    symbol: <Moon className="w-6 h-6" />,
    kicker: "Boas-vindas",
    title: "Sua jornada começa agora.",
    lines: ["Vamos personalizar sua experiência em 3 perguntas."],
    accent: "gold",
  },
  {
    symbol: <User className="w-6 h-6" />,
    kicker: "Apresentação",
    title: "Como posso te chamar?",
    lines: ["Opcional. Pode deixar em branco."],
    accent: "wine",
    detail: "name",
  },
  {
    symbol: <Star className="w-6 h-6" />,
    kicker: "Nível",
    title: "Qual é a sua relação com o tarô?",
    lines: [],
    accent: "plum",
    detail: "level",
  },
  {
    symbol: <Sparkles className="w-6 h-6" />,
    kicker: "Objetivo",
    title: "Por que você quer aprender tarô?",
    lines: [],
    accent: "gold",
    detail: "goal",
  },
  {
    symbol: <Sun className="w-6 h-6" />,
    kicker: "Vitória",
    title: "O Louco representa:",
    lines: [],
    accent: "wine",
    detail: "quiz",
  },
  {
    symbol: <Eye className="w-6 h-6" />,
    kicker: "Pronta?",
    title: "Sua jornada está pronta.",
    lines: ["Começar minha jornada"],
    accent: "plum",
    detail: "final",
  },
];

const ACCENT = {
  gold: {
    main: "hsl(36 45% 50%)",
    soft: "hsl(36 45% 50% / 0.10)",
    border: "hsl(36 45% 50% / 0.22)",
    glow: "hsl(36 45% 50% / 0.06)",
    gradient: "linear-gradient(135deg, hsl(36 45% 42%), hsl(36 50% 60%))",
  },
  wine: {
    main: "hsl(340 42% 30%)",
    soft: "hsl(340 42% 30% / 0.08)",
    border: "hsl(340 42% 30% / 0.18)",
    glow: "hsl(340 42% 30% / 0.04)",
    gradient: "linear-gradient(135deg, hsl(340 42% 25%), hsl(340 38% 40%))",
  },
  plum: {
    main: "hsl(280 30% 32%)",
    soft: "hsl(280 30% 32% / 0.08)",
    border: "hsl(280 30% 32% / 0.16)",
    glow: "hsl(280 30% 32% / 0.04)",
    gradient: "linear-gradient(135deg, hsl(280 30% 26%), hsl(280 28% 42%))",
  },
};

const LAYER_ITEMS = [
  { label: "Essência", desc: "O coração vivo da carta", icon: "◉" },
  { label: "Luz & Sombra", desc: "Forças e desafios que ela encarna", icon: "☯" },
  { label: "Simbolismo", desc: "Cada detalhe visual tem propósito", icon: "⟡" },
  { label: "Amor & Trabalho", desc: "Aplicações na vida real", icon: "♡" },
  { label: "Quiz & Prática", desc: "Integre o que compreendeu", icon: "✦" },
];

const MODULE_ITEMS = [
  { name: "Fundamentos", desc: "As raízes do Tarô" },
  { name: "Arcanos Maiores", desc: "22 portais de sabedoria" },
];

interface Props {
  onComplete: () => void;
}

const OnboardingPage = ({ onComplete }: Props) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"in" | "out">("in");
  const { progress, setStudentData } = useProgress();
  const [nameInput, setNameInput] = useState(progress.studentName ?? "");
  const [selectedLevel, setSelectedLevel] = useState(progress.onboardingLevel ?? "");
  const [selectedGoal, setSelectedGoal] = useState(progress.onboardingGoal ?? "");

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const colors = ACCENT[current.accent];

  const goNext = useCallback(() => {
    if (current.detail === "name") {
      setStudentName(nameInput.trim());
    }
    if (isLast) {
      setDirection("out");
      setTimeout(onComplete, 500);
      return;
    }
    setDirection("out");
    setTimeout(() => {
      setStep(s => s + 1);
      setDirection("in");
    }, 320);
  }, [isLast, onComplete, current.detail, nameInput, setStudentName]);

  const goBack = useCallback(() => {
    if (step === 0) return;
    setDirection("out");
    setTimeout(() => {
      setStep(s => s - 1);
      setDirection("in");
    }, 320);
  }, [step]);

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col select-none"
      style={{
        background: "linear-gradient(170deg, hsl(36 33% 97%) 0%, hsl(38 28% 93%) 40%, hsl(36 30% 95%) 100%)",
        transition: "opacity 0.5s ease",
        opacity: direction === "out" && isLast ? 0 : 1,
      }}
    >
      {/* Subtle texture overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse at 50% 0%, ${colors.glow} 0%, transparent 70%)`,
        transition: "background 0.5s ease",
      }} />

      {/* Top bar: progress + skip */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === step ? 24 : 6,
                height: 4,
                background:
                  i < step
                    ? "hsl(140 35% 50% / 0.40)"
                    : i === step
                    ? colors.main
                    : "hsl(36 20% 70% / 0.30)",
              }}
            />
          ))}
        </div>
        {!isLast && (
          <button
            onClick={onComplete}
            className="text-[10px] font-accent italic transition-colors"
            style={{ color: "hsl(230 15% 40% / 0.35)" }}
          >
            Pular
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 relative z-10 flex items-center justify-center px-6 py-4">
        <div
          className="max-w-sm w-full"
          style={{
            animation: direction === "in" ? "fade-in 0.45s ease-out" : "none",
            opacity: direction === "out" ? 0 : 1,
            transform: direction === "out" ? "translateY(6px)" : "none",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: colors.soft,
                border: `1px solid ${colors.border}`,
                color: colors.main,
                boxShadow: `0 8px 32px ${colors.glow}`,
              }}
            >
              {current.symbol}
            </div>
          </div>

          {/* Kicker */}
          <p
            className="text-center text-[9px] font-heading tracking-[0.35em] uppercase mb-2"
            style={{ color: colors.main }}
          >
            {current.kicker}
          </p>

          {/* Title */}
          <h1
            className="text-center font-heading text-xl md:text-2xl tracking-wide leading-tight mb-5"
            style={{ color: "hsl(230 25% 12%)" }}
          >
            {current.title}
          </h1>

          {/* Thin divider */}
          <div className="flex justify-center mb-5">
            <div className="w-8 h-px" style={{ background: colors.border }} />
          </div>

          {/* Body text */}
          <div className="space-y-1 mb-6">
            {current.lines.map((line, i) => (
              <p
                key={i}
                className="text-center text-[13px] font-body leading-relaxed"
                style={{ color: line === "" ? "transparent" : "hsl(230 15% 25% / 0.55)" }}
              >
                {line || "\u00A0"}
              </p>
            ))}
          </div>

          {/* Detail: Layers */}
          {current.detail === "layers" && (
            <div className="space-y-2 mb-4">
              {LAYER_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all"
                  style={{
                    background: "hsl(38 28% 94% / 0.7)",
                    border: "1px solid hsl(36 25% 82% / 0.5)",
                    animationDelay: `${i * 80}ms`,
                    animation: direction === "in" ? `fade-in 0.4s ease-out ${i * 80}ms both` : "none",
                  }}
                >
                  <span className="text-base w-6 text-center" style={{ color: colors.main }}>{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-heading tracking-wide" style={{ color: "hsl(230 25% 15%)" }}>{item.label}</p>
                    <p className="text-[10px]" style={{ color: "hsl(230 15% 40% / 0.50)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
              <p className="text-center text-[10px] italic font-accent mt-3" style={{ color: "hsl(230 15% 40% / 0.40)" }}>
                Vá fundo quando quiser. Avance quando sentir que é hora.
              </p>
            </div>
          )}

          {current.detail === "level" && (
            <div className="space-y-3">
              {["🌱 Nunca estudei", "🌙 Conheço um pouco", "⭐ Já pratico"].map((l) => (
                <button key={l} onClick={() => { setSelectedLevel(l); goNext(); }} className="w-full text-left p-4 rounded-xl transition-all" style={{ border: `1px solid ${colors.border}`, background: "white" }}>
                  {l}
                </button>
              ))}
            </div>
          )}
          {current.detail === "goal" && (
            <div className="space-y-3">
              {["🔮 Autoconhecimento", "🃏 Ler para outras pessoas", "✨ Curiosidade espiritual", "📚 Aprofundar o que já sei"].map((g) => (
                <button key={g} onClick={() => { setSelectedGoal(g); goNext(); }} className="w-full text-left p-4 rounded-xl transition-all" style={{ border: `1px solid ${colors.border}`, background: "white" }}>
                  {g}
                </button>
              ))}
            </div>
          )}
          {current.detail === "quiz" && (
            <div className="text-center">
              <img src="/arcano-0-louco.jpg" alt="O Louco" className="w-32 mx-auto rounded-lg mb-4" />
              <div className="space-y-3">
                {["O início de uma jornada", "O fim de um ciclo", "A sabedoria acumulada", "O medo do desconhecido"].map((o, i) => (
                  <button key={i} onClick={() => { if(i===0) { /* addXP logic + celebration */ goNext(); } }} className="w-full p-3 rounded-lg border">
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Detail: Modules */}
          {current.detail === "modules" && (
            <div className="mb-4">
              <div className="flex flex-wrap justify-center gap-1.5">
                {MODULE_ITEMS.map((mod, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2.5 py-1 rounded-full font-heading tracking-wide"
                    style={{
                      background: i < 3 ? "hsl(38 28% 93% / 0.8)" : colors.soft,
                      border: `1px solid ${i < 3 ? "hsl(36 25% 82% / 0.4)" : colors.border}`,
                      color: i < 3 ? "hsl(230 15% 30%)" : colors.main,
                      animation: direction === "in" ? `fade-in 0.3s ease-out ${i * 60}ms both` : "none",
                    }}
                  >
                    {mod.name}
                  </span>
                ))}
              </div>
              <div
                className="mt-4 px-4 py-2.5 rounded-xl text-center"
                style={{
                  background: colors.soft,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <p className="text-[10px] font-heading tracking-wider uppercase" style={{ color: colors.main }}>
                  ✦ Área Premium
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "hsl(230 15% 40% / 0.45)" }}>
                  Combinações, Tiragens, Amor e Prática — acesso exclusivo para quem quer ir além.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="relative z-10 px-6 pb-8 space-y-3">
        {/* Main CTA */}
        <button
          onClick={goNext}
          className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-3.5 rounded-xl font-heading text-[11px] tracking-[0.18em] uppercase transition-all duration-300 active:scale-[0.98]"
          style={{
            background: isLast ? colors.gradient : "hsl(38 28% 94% / 0.90)",
            border: isLast ? "none" : `1px solid ${colors.border}`,
            color: isLast ? "hsl(36 33% 97%)" : colors.main,
            boxShadow: isLast ? `0 8px 32px ${colors.soft}` : "none",
            backdropFilter: "blur(8px)",
          }}
        >
          {isLast ? (
            <>
              <Sparkles className="w-4 h-4" />
              Iniciar minha Jornada
            </>
          ) : (
            <>
              Continuar
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {/* Back */}
        {step > 0 && !isLast && (
          <button
            onClick={goBack}
            className="block mx-auto text-[10px] font-accent italic transition-colors"
            style={{ color: "hsl(230 15% 40% / 0.30)" }}
          >
            Voltar
          </button>
        )}

        {/* Step counter */}
        <p className="text-center text-[9px]" style={{ color: "hsl(230 15% 40% / 0.25)" }}>
          {step + 1} de {STEPS.length}
        </p>
      </div>
    </div>
  );
};

export default OnboardingPage;

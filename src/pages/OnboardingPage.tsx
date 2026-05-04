import { useState, useCallback, useEffect } from "react";
import { Moon, User, Star, Sparkles, Sun, Eye } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import imgLouco from '@/assets/arcano-0-louco.jpg';

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
    main: "#c9a96e",
    soft: "rgba(201, 169, 110, 0.1)",
    border: "rgba(201, 169, 110, 0.3)",
    glow: "rgba(201, 169, 110, 0.05)",
    gradient: "linear-gradient(135deg, #3d1f2e, #c9a96e)",
  },
  wine: {
    main: "#3d1f2e",
    soft: "rgba(61, 31, 46, 0.08)",
    border: "rgba(61, 31, 46, 0.18)",
    glow: "rgba(61, 31, 46, 0.04)",
    gradient: "linear-gradient(135deg, #3d1f2e, #c9a96e)",
  },
  plum: {
    main: "#5c3d4e",
    soft: "rgba(92, 61, 78, 0.08)",
    border: "rgba(92, 61, 78, 0.16)",
    glow: "rgba(92, 61, 78, 0.04)",
    gradient: "linear-gradient(135deg, #3d1f2e, #c9a96e)",
  },
};

interface Props {
  onComplete: () => void;
}

const OnboardingPage = ({ onComplete }: Props) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"in" | "out">("in");
  const { progress, addXP, completeOnboarding, setStudentData } = useProgress();
  const [nameInput, setNameInput] = useState(progress.studentName ?? "");
  const [selectedLevel, setSelectedLevel] = useState(progress.onboardingLevel ?? "");
  const [selectedGoal, setSelectedGoal] = useState(progress.onboardingGoal ?? "");
  const [showXP, setShowXP] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const colors = ACCENT[current.accent];

  const goNext = useCallback(() => {
    if (current.detail === "name") {
      setStudentData({ name: nameInput.trim() });
    } else if (current.detail === "level") {
      setStudentData({ level: selectedLevel });
    } else if (current.detail === "goal") {
      setStudentData({ goal: selectedGoal });
    } else if (current.detail === "final") {
        completeOnboarding();
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
  }, [isLast, onComplete, current.detail, nameInput, selectedLevel, selectedGoal, setStudentData, completeOnboarding]);

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      addXP(10);
      setShowXP(true);
      setTimeout(() => {
        setShowXP(false);
        goNext();
      }, 1500);
    }
  };

  return (
    <div
      className="min-h-screen relative flex flex-col select-none"
      style={{
        transition: "opacity 0.5s ease",
        opacity: direction === "out" && isLast ? 0 : 1,
      }}
    >
      {/* Top bar: progress + skip */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-8 pb-2">
        <div className="flex items-center gap-1.5 flex-1 max-w-[200px]">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-500 flex-1"
              style={{
                background:
                  i < step
                    ? "rgba(34, 197, 94, 0.4)"
                    : i === step
                    ? "#c9a96e"
                    : "rgba(0, 0, 0, 0.05)",
              }}
            />
          ))}
        </div>
        {!isLast && (
          <button
            onClick={onComplete}
            className="text-[10px] font-accent italic opacity-40 ml-4"
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
          {step === 0 ? (
            <div className="text-center">
              <img src={imgLouco} alt="O Louco" className="w-32 h-auto rounded-xl shadow-lg mx-auto mb-6" />
              <p className="text-[#c9a96e] text-[10px] tracking-[0.3em] uppercase mb-2 font-display">
                {current.kicker}
              </p>
              <h1 className="font-display text-2xl text-[#3d1f2e] mb-4">
                {current.title}
              </h1>
              <p className="text-[13px] font-body text-[#3d1f2e]/60 mb-8">
                {current.lines[0]}
              </p>
            </div>
          ) : (
            <>
              {/* Kicker */}
              <p className="text-center text-[10px] font-display tracking-[0.3em] uppercase mb-2 text-[#c9a96e]">
                {current.detail === 'quiz' && showXP ? 'VITÓRIA' : current.kicker}
              </p>

              {/* Title */}
              <h1 className="text-center font-display text-2xl text-[#3d1f2e] mb-8">
                {current.title}
              </h1>

              {current.detail === "name" && (
                <div className="mb-8">
                  <input
                    id="onboarding-name"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-4 py-4 rounded-2xl text-center text-sm font-body outline-none bg-white/70 backdrop-blur-sm border border-[#c9a96e]/30 shadow-sm focus:bg-white transition-all"
                  />
                </div>
              )}

              {current.detail === "level" && (
                <div className="space-y-3">
                  {["🌱 Nunca estudei", "🌙 Conheço um pouco", "⭐ Já pratico"].map((l) => (
                    <button 
                      key={l} 
                      onClick={() => { setSelectedLevel(l); goNext(); }} 
                      className="w-full text-left p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#c9a96e]/30 hover:bg-white/90 transition-all font-body text-sm text-[#3d1f2e]/80"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}

              {current.detail === "goal" && (
                <div className="space-y-3">
                  {[
                    "🔮 Autoconhecimento", 
                    "🃏 Ler para outras pessoas", 
                    "✨ Curiosidade espiritual", 
                    "📚 Aprofundar o que já sei"
                  ].map((g) => (
                    <button 
                      key={g} 
                      onClick={() => { setSelectedGoal(g); goNext(); }} 
                      className="w-full text-left p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#c9a96e]/30 hover:bg-white/90 transition-all font-body text-sm text-[#3d1f2e]/80"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}

              {current.detail === "quiz" && (
                <div className="text-center relative">
                  <img src={imgLouco} alt="O Louco" className="w-32 h-auto rounded-xl shadow-lg mx-auto mb-6" />
                  
                  {showXP && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="animate-bounce text-green-600 font-bold text-2xl bg-white/90 px-4 py-2 rounded-full shadow-lg border border-green-200">
                        +10 XP ✓
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {[
                      "O início de uma jornada", 
                      "O fim de um ciclo", 
                      "A sabedoria acumulada", 
                      "O medo do desconhecido"
                    ].map((o, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleQuizAnswer(i === 0)} 
                        className="w-full p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#c9a96e]/30 hover:bg-white/90 transition-all font-body text-sm text-[#3d1f2e]/80"
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {current.detail === "final" && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-[#c9a96e]/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-[#c9a96e]/20">
                    <Sparkles className="w-8 h-8 text-[#c9a96e]" />
                  </div>
                  <p className="text-[14px] font-body text-[#3d1f2e]/70 leading-relaxed px-4">
                    Tudo pronto para você desbravar os mistérios dos Arcanos.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Button */}
      {(current.detail === "name" || current.detail === "final" || step === 0) && (
        <div className="relative z-10 px-6 pb-12">
          <button
            onClick={goNext}
            className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-4 rounded-2xl font-display text-sm tracking-[0.1em] uppercase transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #3d1f2e, #c9a96e)",
              color: "white",
            }}
          >
            {isLast ? "Começar minha Jornada" : "Continuar"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;

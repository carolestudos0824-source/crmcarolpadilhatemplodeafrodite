import { useState, useCallback } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import mysticBg from "@/assets/mystic-bg.jpg";
import ornamentDivider from "@/assets/ornament-divider.png";

interface OnboardingStep {
  symbol: string;
  title: string;
  subtitle: string;
  body: string;
  accent: "gold" | "wine" | "plum";
}

const STEPS: OnboardingStep[] = [
  {
    symbol: "✦",
    title: "Bem-vinda à Jornada",
    subtitle: "O Tarô como espelho da alma",
    body: "Aqui, você não vai apenas aprender cartas.\nVai mergulhar em arquétipos, símbolos e camadas de significado que revelam quem você é — e quem está se tornando.",
    accent: "gold",
  },
  {
    symbol: "◎",
    title: "A Jornada do Louco",
    subtitle: "22 arcanos, uma transformação",
    body: "Sua trilha começa no Arcano Zero — O Louco — e percorre os 22 Arcanos Maiores.\nCada um é um mestre. Cada um carrega uma lição sobre a vida, o amor e o sagrado.",
    accent: "wine",
  },
  {
    symbol: "⟡",
    title: "Estudo em Camadas",
    subtitle: "Profundidade no seu ritmo",
    body: "Cada arcano é apresentado em camadas:\nessência, símbolos, luz, sombra, lição, amor, trabalho e espiritualidade.\nVá fundo quando quiser — avance quando estiver pronta.",
    accent: "plum",
  },
  {
    symbol: "☀",
    title: "Progresso & Conquistas",
    subtitle: "Cada passo conta",
    body: "Você ganha XP a cada lição, quiz e exercício.\nConquistas e badges marcam seu caminho.\nSua sequência de dias mostra sua constância.\nA jornada é sua — sem pressa, com presença.",
    accent: "gold",
  },
  {
    symbol: "❋",
    title: "Rider-Waite-Smith",
    subtitle: "Nossa base simbólica",
    body: "Trabalhamos com o baralho Rider-Waite-Smith — a tradição visual mais influente do tarô moderno.\nCada símbolo, cor e gesto nas cartas foi escolhido com intenção. Aqui, você aprende a ler essa linguagem.",
    accent: "wine",
  },
  {
    symbol: "☽",
    title: "Você está pronta?",
    subtitle: "O primeiro passo é confiar",
    body: "Não é preciso saber tudo.\nNão é preciso acreditar em tudo.\nSó é preciso estar aberta.\n\nO Louco espera por você à beira do precipício.\nEle sorri — porque sabe que a jornada vale o salto.",
    accent: "plum",
  },
];

const ACCENT_COLORS = {
  gold: { main: "hsl(36 42% 42%)", soft: "hsl(36 42% 44% / 0.12)", border: "hsl(36 42% 44% / 0.25)" },
  wine: { main: "hsl(340 42% 28%)", soft: "hsl(340 42% 28% / 0.08)", border: "hsl(340 42% 28% / 0.20)" },
  plum: { main: "hsl(280 30% 30%)", soft: "hsl(280 30% 30% / 0.08)", border: "hsl(280 30% 30% / 0.18)" },
};

interface Props {
  onComplete: () => void;
}

const OnboardingPage = ({ onComplete }: Props) => {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const colors = ACCENT_COLORS[current.accent];

  const goNext = useCallback(() => {
    if (isLast) {
      setExiting(true);
      setTimeout(onComplete, 500);
      return;
    }
    setExiting(true);
    setTimeout(() => {
      setStep(s => s + 1);
      setExiting(false);
    }, 300);
  }, [isLast, onComplete]);

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{ transition: "opacity 0.5s ease", opacity: exiting && isLast ? 0 : 1 }}
    >
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={mysticBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.12), hsl(36 33% 97% / 0.06), hsl(36 33% 97% / 0.25))"
        }} />
      </div>

      {/* Progress dots */}
      <div className="relative z-10 flex justify-center gap-2 pt-8 pb-2 px-6">
        {STEPS.map((_, i) => (
          <div key={i} className="h-[3px] rounded-full transition-all duration-500" style={{
            width: i === step ? 28 : 10,
            background: i < step
              ? "hsl(140 40% 45% / 0.45)"
              : i === step
              ? `linear-gradient(90deg, ${colors.main}, hsl(36 42% 55%))`
              : "hsl(36 45% 50% / 0.18)",
          }} />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 relative z-10 flex items-center justify-center px-6">
        <div
          className="max-w-md w-full text-center"
          style={{
            animation: exiting ? "none" : "fade-up 0.5s ease-out",
            opacity: exiting ? 0 : 1,
            transform: exiting ? "translateY(8px)" : "none",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {/* Symbol */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
              background: colors.soft,
              border: `1.5px solid ${colors.border}`,
              boxShadow: `0 4px 20px ${colors.soft}`,
            }}>
              <span className="text-2xl" style={{ color: colors.main }}>{current.symbol}</span>
            </div>
          </div>

          {/* Subtitle */}
          <span className="text-[9px] font-heading tracking-[0.4em] uppercase block mb-2" style={{ color: colors.main }}>
            {current.subtitle}
          </span>

          {/* Title */}
          <h1 className="font-heading text-2xl md:text-3xl tracking-wide mb-6" style={{
            background: `linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), ${colors.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            {current.title}
          </h1>

          {/* Ornament */}
          <div className="flex justify-center mb-6">
            <img src={ornamentDivider} alt="" className="w-20 h-auto opacity-30" loading="lazy" width={800} height={512} />
          </div>

          {/* Body */}
          <div className="space-y-2 mb-10">
            {current.body.split("\n").map((line, i) => (
              <p key={i} className="font-body text-sm leading-relaxed" style={{
                color: line.trim() === "" ? "transparent" : "hsl(230 20% 15% / 0.60)",
              }}>
                {line || "\u00A0"}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom action */}
      <div className="relative z-10 px-6 pb-10">
        <button
          onClick={goNext}
          className="w-full max-w-md mx-auto flex items-center justify-center gap-2 py-4 rounded-xl font-heading text-[11px] tracking-[0.2em] uppercase transition-all duration-300 active:scale-[0.98]"
          style={{
            background: isLast
              ? `linear-gradient(135deg, ${colors.main}, hsl(36 42% 44%))`
              : "hsl(38 28% 93% / 0.85)",
            border: isLast
              ? "none"
              : `1px solid ${colors.border}`,
            color: isLast
              ? "hsl(36 33% 97%)"
              : colors.main,
            boxShadow: isLast
              ? `0 6px 24px ${colors.soft}`
              : "none",
            backdropFilter: "blur(12px)",
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
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Skip */}
        {!isLast && (
          <button
            onClick={onComplete}
            className="block mx-auto mt-4 text-[10px] font-accent italic transition-all"
            style={{ color: "hsl(230 20% 15% / 0.30)" }}
          >
            Pular introdução
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XPBar } from "@/components/XPBar";
import { StreakCounter } from "@/components/StreakCounter";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { JourneyMap } from "@/components/JourneyMap";
import { useProgress } from "@/hooks/use-progress";
import mysticBg from "@/assets/mystic-bg.jpg";
import ornamentDivider from "@/assets/ornament-divider.png";

const Index = () => {
  const { progress, updateStreak } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    updateStreak();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full artistic background */}
      <div className="fixed inset-0 z-0">
        <img
          src={mysticBg}
          alt=""
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.18) 0%, hsl(36 33% 97% / 0.10) 30%, hsl(36 33% 97% / 0.15) 70%, hsl(36 33% 97% / 0.30) 100%)"
        }} />
      </div>

      {/* Header — premium, strong, readable */}
      <header className="relative z-10 border-b border-primary/25" style={{
        background: "linear-gradient(180deg, hsl(36 33% 97% / 0.88) 0%, hsl(38 30% 95% / 0.80) 100%)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 30px hsl(36 45% 58% / 0.10), 0 1px 0 hsl(36 45% 58% / 0.15) inset"
      }}>
        <div className="container max-w-3xl py-5 px-6">
          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.35em] uppercase text-secondary/80 font-body mb-1 flex items-center gap-1.5">
                <span className="text-primary/60">✦</span>
                Arcanos Maiores
                <span className="text-primary/60">✦</span>
              </span>
              <h1 className="font-heading text-2xl md:text-3xl tracking-wide" style={{
                background: "linear-gradient(135deg, hsl(340 42% 28%), hsl(36 40% 38%), hsl(36 45% 52%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 1px 2px hsl(36 45% 58% / 0.2))"
              }}>
                A Jornada do Louco
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <StreakCounter streak={progress.streak} />
              <button
                onClick={() => navigate("/admin")}
                className="text-[10px] text-muted-foreground/50 hover:text-secondary transition-colors tracking-wider uppercase"
              >
                Admin
              </button>
            </div>
          </div>

          {/* XP Bar with decorative line */}
          <div className="relative">
            <div className="absolute -top-2 left-0 right-0 h-px" style={{
              background: "linear-gradient(90deg, transparent, hsl(36 45% 58% / 0.25), transparent)"
            }} />
            <XPBar xp={progress.xp} level={progress.level} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container max-w-3xl py-8 px-6">
        {/* Conquistas */}
        <section className="mb-10">
          <div className="flex items-center justify-center mb-3">
            <img src={ornamentDivider} alt="" className="w-36 h-auto opacity-60" loading="lazy" width={800} height={512} />
          </div>
          <h2 className="font-accent text-base text-secondary tracking-[0.25em] uppercase italic text-center mb-5" style={{
            textShadow: "0 1px 3px hsl(340 42% 30% / 0.1)"
          }}>
            Conquistas
          </h2>
          <div className="relative rounded-2xl overflow-hidden" style={{
            background: "linear-gradient(145deg, hsl(38 30% 95% / 0.85), hsl(36 33% 97% / 0.75))",
            backdropFilter: "blur(16px)",
            border: "1px solid hsl(36 45% 58% / 0.25)",
            boxShadow: "0 8px 40px hsl(36 45% 58% / 0.08), 0 1px 0 hsl(36 45% 58% / 0.12) inset, 0 -1px 0 hsl(36 45% 58% / 0.06) inset"
          }}>
            {/* Corner ornaments */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-primary/25 rounded-tl-sm" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-primary/25 rounded-tr-sm" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-primary/25 rounded-bl-sm" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-primary/25 rounded-br-sm" />
            <div className="p-6 md:p-7">
              <BadgeDisplay badges={progress.badges} />
            </div>
          </div>
        </section>

        {/* Journey Map */}
        <section>
          <div className="flex items-center justify-center mb-3">
            <img src={ornamentDivider} alt="" className="w-36 h-auto opacity-60" loading="lazy" width={800} height={512} />
          </div>
          <h2 className="font-accent text-base text-secondary tracking-[0.25em] uppercase italic text-center mb-6" style={{
            textShadow: "0 1px 3px hsl(340 42% 30% / 0.1)"
          }}>
            Mapa da Jornada
          </h2>
          <JourneyMap progress={progress} />
        </section>
      </main>

      {/* Bottom ornament */}
      <div className="relative z-10 flex items-center justify-center pb-10">
        <img src={ornamentDivider} alt="" className="w-28 h-auto opacity-35" loading="lazy" width={800} height={512} />
      </div>
    </div>
  );
};

export default Index;

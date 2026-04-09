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
          background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.12) 0%, hsl(36 33% 97% / 0.06) 30%, hsl(36 33% 97% / 0.10) 70%, hsl(36 33% 97% / 0.25) 100%)"
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b" style={{
        borderColor: "hsl(36 45% 58% / 0.30)",
        background: "linear-gradient(180deg, hsl(36 33% 97% / 0.92) 0%, hsl(38 30% 94% / 0.88) 100%)",
        backdropFilter: "blur(24px)",
        boxShadow: "0 4px 30px hsl(36 45% 58% / 0.12), 0 1px 0 hsl(36 45% 58% / 0.18) inset"
      }}>
        <div className="container max-w-3xl py-5 px-6">
          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.35em] uppercase font-body mb-1.5 flex items-center gap-1.5" style={{
                color: "hsl(340 42% 30% / 0.85)"
              }}>
                <span style={{ color: "hsl(36 45% 48%)" }}>✦</span>
                Arcanos Maiores
                <span style={{ color: "hsl(36 45% 48%)" }}>✦</span>
              </span>
              <h1 className="font-heading text-2xl md:text-3xl tracking-wide" style={{
                background: "linear-gradient(135deg, hsl(340 42% 24%), hsl(36 38% 32%), hsl(36 45% 48%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 1px 3px hsl(36 45% 58% / 0.25))"
              }}>
                A Jornada do Louco
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <StreakCounter streak={progress.streak} />
              <button
                onClick={() => navigate("/admin")}
                className="text-[10px] tracking-wider uppercase font-body transition-colors duration-300"
                style={{ color: "hsl(230 10% 40% / 0.6)" }}
                onMouseEnter={e => e.currentTarget.style.color = "hsl(340 42% 30%)"}
                onMouseLeave={e => e.currentTarget.style.color = "hsl(230 10% 40% / 0.6)"}
              >
                Admin
              </button>
            </div>
          </div>

          {/* XP Bar */}
          <div className="relative">
            <div className="absolute -top-2 left-0 right-0 h-px" style={{
              background: "linear-gradient(90deg, transparent, hsl(36 45% 58% / 0.30), transparent)"
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
            <img src={ornamentDivider} alt="" className="w-36 h-auto opacity-70" loading="lazy" width={800} height={512} />
          </div>
          <h2 className="font-accent text-base tracking-[0.25em] uppercase italic text-center mb-5" style={{
            color: "hsl(340 42% 28%)",
            textShadow: "0 1px 3px hsl(340 42% 30% / 0.15)"
          }}>
            Conquistas
          </h2>
          <div className="relative rounded-2xl overflow-hidden" style={{
            background: "linear-gradient(145deg, hsl(38 30% 94% / 0.90), hsl(36 33% 96% / 0.82))",
            backdropFilter: "blur(20px)",
            border: "1px solid hsl(36 45% 58% / 0.30)",
            boxShadow: "0 8px 40px hsl(36 45% 58% / 0.10), 0 1px 0 hsl(36 45% 58% / 0.15) inset, 0 -1px 0 hsl(36 45% 58% / 0.08) inset, 0 0 0 1px hsl(36 45% 58% / 0.05) inset"
          }}>
            {/* Corner ornaments */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-[1.5px] border-l-[1.5px] rounded-tl-sm" style={{ borderColor: "hsl(36 45% 50% / 0.35)" }} />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-[1.5px] border-r-[1.5px] rounded-tr-sm" style={{ borderColor: "hsl(36 45% 50% / 0.35)" }} />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-[1.5px] border-l-[1.5px] rounded-bl-sm" style={{ borderColor: "hsl(36 45% 50% / 0.35)" }} />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-[1.5px] border-r-[1.5px] rounded-br-sm" style={{ borderColor: "hsl(36 45% 50% / 0.35)" }} />
            {/* Subtle inner glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "radial-gradient(ellipse at 50% 0%, hsl(42 70% 80% / 0.08) 0%, transparent 60%)"
            }} />
            <div className="p-6 md:p-8">
              <BadgeDisplay badges={progress.badges} />
            </div>
          </div>
        </section>

        {/* Journey Map */}
        <section>
          <div className="flex items-center justify-center mb-3">
            <img src={ornamentDivider} alt="" className="w-36 h-auto opacity-70" loading="lazy" width={800} height={512} />
          </div>
          <h2 className="font-accent text-base tracking-[0.25em] uppercase italic text-center mb-6" style={{
            color: "hsl(340 42% 28%)",
            textShadow: "0 1px 3px hsl(340 42% 30% / 0.15)"
          }}>
            Mapa da Jornada
          </h2>
          <JourneyMap progress={progress} />
        </section>
      </main>

      {/* Bottom ornament */}
      <div className="relative z-10 flex items-center justify-center pb-10">
        <img src={ornamentDivider} alt="" className="w-28 h-auto opacity-40" loading="lazy" width={800} height={512} />
      </div>
    </div>
  );
};

export default Index;

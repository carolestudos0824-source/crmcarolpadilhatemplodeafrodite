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
      {/* Full artistic background — visible and atmospheric */}
      <div className="fixed inset-0 z-0">
        <img
          src={mysticBg}
          alt=""
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        {/* Very light overlay — keep background art visible */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.25) 0%, hsl(36 33% 97% / 0.15) 30%, hsl(36 33% 97% / 0.2) 70%, hsl(36 33% 97% / 0.35) 100%)"
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-lg bg-card/60 border-b border-primary/20 shadow-[0_2px_20px_hsl(36_45%_58%/0.08)]">
        <div className="container max-w-3xl py-4 px-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.3em] uppercase text-secondary/70 font-body mb-0.5">
                ☽ Arcanos Maiores
              </span>
              <h1 className="font-heading text-2xl md:text-3xl text-gradient-gold-warm tracking-wide">
                A Jornada do Louco
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <StreakCounter streak={progress.streak} />
              <button
                onClick={() => navigate("/admin")}
                className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors tracking-wider uppercase"
              >
                Admin
              </button>
            </div>
          </div>
          <XPBar xp={progress.xp} level={progress.level} />
        </div>
      </header>

      {/* Main content — tighter spacing */}
      <main className="relative z-10 container max-w-3xl py-6 px-6">
        {/* Conquistas */}
        <section className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={ornamentDivider} alt="" className="w-40 h-auto opacity-50" loading="lazy" width={800} height={512} />
          </div>
          <h2 className="font-accent text-base text-secondary tracking-[0.2em] uppercase italic text-center mb-4">
            Conquistas
          </h2>
          <div className="backdrop-blur-md bg-card/50 rounded-2xl border border-primary/20 p-5 md:p-6 shadow-[0_4px_30px_hsl(36_45%_58%/0.08)]">
            <BadgeDisplay badges={progress.badges} />
          </div>
        </section>

        {/* Journey Map */}
        <section>
          <div className="flex items-center justify-center mb-4">
            <img src={ornamentDivider} alt="" className="w-40 h-auto opacity-50" loading="lazy" width={800} height={512} />
          </div>
          <h2 className="font-accent text-base text-secondary tracking-[0.2em] uppercase italic text-center mb-6">
            Mapa da Jornada
          </h2>
          <JourneyMap progress={progress} />
        </section>
      </main>

      {/* Bottom ornament */}
      <div className="relative z-10 flex items-center justify-center pb-8">
        <img src={ornamentDivider} alt="" className="w-32 h-auto opacity-30" loading="lazy" width={800} height={512} />
      </div>
    </div>
  );
};

export default Index;

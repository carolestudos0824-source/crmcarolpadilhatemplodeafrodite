import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XPBar } from "@/components/XPBar";
import { StreakCounter } from "@/components/StreakCounter";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { JourneyMap } from "@/components/JourneyMap";
import { useProgress } from "@/hooks/use-progress";

const Index = () => {
  const { progress, updateStreak } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    updateStreak();
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Layered background */}
      <div className="fixed inset-0 bg-mystic-deep pointer-events-none" />
      <div className="fixed inset-0 bg-mystic-glow pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-gold">
        <div className="container max-w-3xl py-6 px-6">
          {/* Top row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-body mb-1">
                Arcanos Maiores
              </span>
              <h1 className="font-heading text-2xl md:text-3xl text-gradient-gold-warm tracking-wide">
                A Jornada do Louco
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <StreakCounter streak={progress.streak} />
              <button
                onClick={() => navigate("/admin")}
                className="text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors tracking-wider uppercase"
              >
                Admin
              </button>
            </div>
          </div>
          <XPBar xp={progress.xp} level={progress.level} />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container max-w-3xl py-10 px-6">
        {/* Conquistas */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="divider-gold flex-1" />
            <h2 className="font-accent text-sm text-muted-foreground tracking-[0.25em] uppercase italic">
              Conquistas
            </h2>
            <div className="divider-gold flex-1" />
          </div>
          <BadgeDisplay badges={progress.badges} />
        </section>

        {/* Journey Map */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="divider-gold flex-1" />
            <h2 className="font-accent text-sm text-muted-foreground tracking-[0.25em] uppercase italic">
              Mapa da Jornada
            </h2>
            <div className="divider-gold flex-1" />
          </div>
          <JourneyMap progress={progress} />
        </section>
      </main>

      {/* Bottom fade */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />
    </div>
  );
};

export default Index;

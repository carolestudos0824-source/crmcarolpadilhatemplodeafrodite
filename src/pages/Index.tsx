import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XPBar } from "@/components/XPBar";
import { StreakCounter } from "@/components/StreakCounter";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { JourneyMap } from "@/components/JourneyMap";
import { useProgress } from "@/hooks/use-progress";
import { Sparkles } from "lucide-react";

const Index = () => {
  const { progress, updateStreak } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    updateStreak();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-mystic-glow pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-gold">
        <div className="container max-w-4xl py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="font-heading text-xl text-gradient-gold tracking-wider">
                A Jornada do Louco
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <StreakCounter streak={progress.streak} />
              <button
                onClick={() => navigate("/admin")}
                className="text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-full border border-border hover:border-primary/30"
              >
                Admin
              </button>
            </div>
          </div>
          <XPBar xp={progress.xp} level={progress.level} />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container max-w-4xl py-8 px-4">
        {/* Badges */}
        <section className="mb-10">
          <h2 className="font-heading text-sm text-muted-foreground tracking-widest uppercase mb-4">Conquistas</h2>
          <BadgeDisplay badges={progress.badges} />
        </section>

        {/* Journey Map */}
        <section>
          <h2 className="font-heading text-sm text-muted-foreground tracking-widest uppercase mb-6">
            Mapa da Jornada — Arcanos Maiores
          </h2>
          <JourneyMap progress={progress} />
        </section>
      </main>
    </div>
  );
};

export default Index;

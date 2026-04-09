import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XPBar } from "@/components/XPBar";
import { StreakCounter } from "@/components/StreakCounter";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { JourneyMap } from "@/components/JourneyMap";
import { useProgress } from "@/hooks/use-progress";
import { Moon, Sparkles, Star } from "lucide-react";

const Index = () => {
  const { progress, updateStreak } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    updateStreak();
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Atmospheric background */}
      <div className="fixed inset-0 bg-mystic-deep pointer-events-none" />
      <div className="fixed inset-0 bg-mystic-glow pointer-events-none" />
      
      {/* Decorative corner ornaments */}
      <div className="fixed top-6 left-6 text-primary/15 text-2xl pointer-events-none select-none font-accent">✦</div>
      <div className="fixed top-6 right-6 text-primary/15 text-2xl pointer-events-none select-none font-accent">✦</div>
      <div className="fixed bottom-6 left-6 text-primary/15 text-2xl pointer-events-none select-none font-accent">✧</div>
      <div className="fixed bottom-6 right-6 text-primary/15 text-2xl pointer-events-none select-none font-accent">✧</div>

      {/* Subtle vertical lines */}
      <div className="fixed left-10 top-0 bottom-0 w-px bg-primary/[0.06] pointer-events-none hidden md:block" />
      <div className="fixed right-10 top-0 bottom-0 w-px bg-primary/[0.06] pointer-events-none hidden md:block" />

      {/* Header */}
      <header className="relative z-10 border-b border-gold bg-card/40 backdrop-blur-md">
        <div className="container max-w-3xl py-6 px-6">
          {/* Top row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.3em] uppercase text-secondary/60 font-body mb-1 flex items-center gap-1.5">
                <Moon className="w-3 h-3" />
                Arcanos Maiores
              </span>
              <h1 className="font-heading text-3xl md:text-4xl text-gradient-gold-warm tracking-wide">
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

      {/* Main content */}
      <main className="relative z-10 container max-w-3xl py-10 px-6">
        {/* Conquistas */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="divider-gold flex-1" />
            <h2 className="font-accent text-sm text-secondary/70 tracking-[0.25em] uppercase italic flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary/60" />
              Conquistas
              <Sparkles className="w-3.5 h-3.5 text-primary/60" />
            </h2>
            <div className="divider-gold flex-1" />
          </div>
          <BadgeDisplay badges={progress.badges} />
        </section>

        {/* Journey Map */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="divider-gold flex-1" />
            <h2 className="font-accent text-sm text-secondary/70 tracking-[0.25em] uppercase italic flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-primary/60" />
              Mapa da Jornada
              <Star className="w-3.5 h-3.5 text-primary/60" />
            </h2>
            <div className="divider-gold flex-1" />
          </div>
          <JourneyMap progress={progress} />
        </section>
      </main>

      {/* Bottom ornament */}
      <div className="relative z-10 flex items-center justify-center gap-2 text-primary/20 pb-8">
        <span className="text-sm">~</span>
        <span className="text-lg">✦</span>
        <span className="text-sm">~</span>
      </div>
    </div>
  );
};

export default Index;

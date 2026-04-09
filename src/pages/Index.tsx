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
        {/* Soft overlay to ensure readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/70" />
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-md bg-card/50 border-b border-primary/15">
        <div className="container max-w-3xl py-5 px-6">
          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.3em] uppercase text-secondary/70 font-body mb-1">
                ☽ Arcanos Maiores
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
          <div className="flex items-center justify-center mb-6">
            <img
              src={ornamentDivider}
              alt=""
              className="w-48 h-auto opacity-40"
              loading="lazy"
              width={800}
              height={512}
            />
          </div>
          <h2 className="font-accent text-lg text-secondary/80 tracking-[0.2em] uppercase italic text-center mb-6">
            Conquistas
          </h2>
          <div className="bg-card/40 backdrop-blur-sm rounded-2xl border border-primary/15 p-6 md:p-8">
            <BadgeDisplay badges={progress.badges} />
          </div>
        </section>

        {/* Journey Map */}
        <section>
          <div className="flex items-center justify-center mb-6">
            <img
              src={ornamentDivider}
              alt=""
              className="w-48 h-auto opacity-40"
              loading="lazy"
              width={800}
              height={512}
            />
          </div>
          <h2 className="font-accent text-lg text-secondary/80 tracking-[0.2em] uppercase italic text-center mb-8">
            Mapa da Jornada
          </h2>
          <JourneyMap progress={progress} />
        </section>
      </main>

      {/* Bottom ornament */}
      <div className="relative z-10 flex items-center justify-center pb-10">
        <img
          src={ornamentDivider}
          alt=""
          className="w-36 h-auto opacity-25"
          loading="lazy"
          width={800}
          height={512}
        />
      </div>
    </div>
  );
};

export default Index;

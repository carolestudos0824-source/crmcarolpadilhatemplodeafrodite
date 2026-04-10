import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Check, ChevronRight, Sparkles, Crown, User } from "lucide-react";
import { MODULES, isModuleUnlocked, type LearningModule, type ModuleCategory, ARCANOS_MAIORES } from "@/data/tarot-data";
import { useProgress } from "@/hooks/use-progress";
import { useTrackEvent } from "@/hooks/use-track-event";
import OnboardingPage from "./OnboardingPage";
import { XPBar } from "@/components/XPBar";
import { StreakCounter } from "@/components/StreakCounter";
import BetaWelcomeBanner from "@/components/BetaWelcomeBanner";
import FeedbackNudge from "@/components/FeedbackNudge";
import RetentionBanner from "@/components/RetentionBanner";
import ContinuityCard from "@/components/ContinuityCard";
import ProgressCelebration from "@/components/ProgressCelebration";
import mysticBg from "@/assets/mystic-bg.jpg";
import ornamentDivider from "@/assets/ornament-divider.png";

const CATEGORY_LABELS: Record<ModuleCategory, string> = {
  "foundation": "Fundação",
  "major-arcana": "Arcanos Maiores",
  "minor-arcana": "Arcanos Menores",
  "advanced": "Avançado",
  "practice": "Prática",
};

const ModulesPage = () => {
  const navigate = useNavigate();
  const { progress, loading: progressLoading, completeOnboarding } = useProgress();
  const { trackEvent } = useTrackEvent();

  // Track return visits
  useEffect(() => {
    if (progress.onboardingCompleted) {
      const lastVisit = localStorage.getItem("last-visit-date");
      const today = new Date().toISOString().slice(0, 10);
      if (lastVisit && lastVisit !== today) {
        trackEvent("return_visit", { days_since: lastVisit });
      }
      localStorage.setItem("last-visit-date", today);
    }
  }, [progress.onboardingCompleted]);

  const handleOnboardingComplete = () => {
    completeOnboarding();
    trackEvent("onboarding_completed");
  };

  if (progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-heading tracking-wider">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!progress.onboardingCompleted) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  const BETA_MODULE_IDS = ["fundamentos", "arcanos-maiores"];
  const betaModules = MODULES.filter(m => BETA_MODULE_IDS.includes(m.id));

  const grouped = betaModules.reduce<Record<ModuleCategory, LearningModule[]>>((acc, mod) => {
    if (!acc[mod.category]) acc[mod.category] = [];
    acc[mod.category].push(mod);
    return acc;
  }, {} as Record<ModuleCategory, LearningModule[]>);

  const categoryOrder: ModuleCategory[] = ["foundation", "major-arcana"];

  const getModuleProgress = (mod: LearningModule): number => {
    if (mod.id === "arcanos-maiores") {
      const completed = progress.completedLessons.filter(l => l.startsWith("arcano-")).length;
      return Math.round((completed / 22) * 100);
    }
    if (mod.id === "fundamentos") {
      const completed = progress.completedLessons.filter(l => l.startsWith("fund-")).length;
      return Math.round((completed / 10) * 100);
    }
    if (["copas", "paus", "espadas", "ouros"].includes(mod.id)) {
      const completed = progress.completedLessons.filter(l => l.startsWith(`${mod.id}-`)).length;
      return Math.round((completed / 14) * 100);
    }
    if (mod.id === "combinacoes") {
      const completed = progress.completedLessons.filter(l => l.startsWith("comb-")).length;
      return Math.round((completed / 10) * 100);
    }
    if (mod.id === "tiragens") {
      const completed = progress.completedLessons.filter(l => l.startsWith("tir-")).length;
      return Math.round((completed / 10) * 100);
    }
    if (mod.id === "amor") {
      const completed = progress.completedLessons.filter(l => l.startsWith("amor-")).length;
      return Math.round((completed / 10) * 100);
    }
    if (mod.id === "pratica") {
      const completed = progress.completedLessons.filter(l => l.startsWith("prat-")).length;
      return Math.round((completed / 10) * 100);
    }
    return 0;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <img src={mysticBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.10) 0%, hsl(36 33% 97% / 0.05) 30%, hsl(36 33% 97% / 0.08) 70%, hsl(36 33% 97% / 0.22) 100%)"
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10" style={{
        borderBottom: "1px solid hsl(36 45% 50% / 0.35)",
        background: "linear-gradient(180deg, hsl(36 33% 96% / 0.94) 0%, hsl(38 28% 93% / 0.92) 100%)",
        backdropFilter: "blur(28px)",
        boxShadow: "0 6px 36px hsl(36 45% 50% / 0.10), 0 1px 0 hsl(36 45% 58% / 0.20) inset"
      }}>
        <div className="container max-w-3xl py-5 px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.35em] uppercase font-body mb-1.5 flex items-center gap-1.5" style={{ color: "hsl(340 42% 28%)" }}>
                <span style={{ color: "hsl(36 40% 42%)" }}>✦</span>
                A Jornada do Louco
                <span style={{ color: "hsl(36 40% 42%)" }}>✦</span>
              </span>
              <h1 className="font-heading text-2xl md:text-3xl tracking-wide" style={{
                background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(36 35% 28%), hsl(36 45% 44%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 1px 2px hsl(36 45% 50% / 0.20))"
              }}>
                Sua Jornada
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <StreakCounter streak={progress.streak} />
              <button onClick={() => navigate("/perfil")} className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105" style={{
                background: "hsl(36 45% 58% / 0.10)",
                border: "1px solid hsl(36 45% 58% / 0.20)",
              }}>
                <User className="w-4 h-4" style={{ color: "hsl(340 42% 26%)" }} />
              </button>
            </div>
          </div>
          <XPBar xp={progress.xp} level={progress.level} />
        </div>
      </header>

      {/* Modules grid */}
      <main className="relative z-10 container max-w-3xl py-8 px-6">
        {/* Progress celebration toast */}
        <ProgressCelebration
          xp={progress.xp}
          level={progress.level}
          streak={progress.streak}
          completedLessons={progress.completedLessons.length}
        />

        {/* Beta welcome banner */}
        <BetaWelcomeBanner />

        {/* Retention banner - motivational messages */}
        <RetentionBanner
          streak={progress.streak}
          completedLessons={progress.completedLessons.length}
          xp={progress.xp}
          level={progress.level}
          lastActive={progress.lastActive}
        />

        {/* Continuity suggestions */}
        <ContinuityCard
          lastLessonId={progress.completedLessons.length > 0
            ? (() => {
                const lastLesson = progress.completedLessons[progress.completedLessons.length - 1];
                if (lastLesson?.startsWith("arcano-")) {
                  const num = parseInt(lastLesson.replace("arcano-", ""));
                  return num < 21 ? String(num + 1) : null;
                }
                return null;
              })()
            : "0"
          }
          lastLessonName={progress.completedLessons.length > 0
            ? (() => {
                const lastLesson = progress.completedLessons[progress.completedLessons.length - 1];
                if (lastLesson?.startsWith("arcano-")) {
                  const num = parseInt(lastLesson.replace("arcano-", ""));
                  if (num < 21) {
                    const next = ARCANOS_MAIORES.find(a => a.id === num + 1);
                    return next?.name || null;
                  }
                }
                return null;
              })()
            : ARCANOS_MAIORES[0]?.name || "O Louco"
          }
          completedLessons={progress.completedLessons.length}
          completedQuizzes={progress.completedQuizzes.length}
          hasUnfinishedReview={progress.completedLessons.length > progress.completedQuizzes.length}
        />

        {/* Feedback nudge (after 3+ lessons) */}
        <FeedbackNudge lessonsCompleted={progress.completedLessons.length} />

        {categoryOrder.map(cat => {
          const mods = grouped[cat];
          if (!mods || mods.length === 0) return null;

          return (
            <section key={cat} className="mb-10">
              <div className="flex items-center justify-center mb-3">
                <img src={ornamentDivider} alt="" className="w-28 h-auto opacity-50" loading="lazy" width={800} height={512} />
              </div>
              <h2 className="font-accent text-sm tracking-[0.25em] uppercase italic text-center mb-5" style={{
                color: "hsl(340 42% 24%)",
                textShadow: "0 1px 2px hsl(340 42% 28% / 0.12)"
              }}>
                {CATEGORY_LABELS[cat]}
              </h2>

              <div className="space-y-3">
                {mods.map((mod, i) => {
                  const unlocked = isModuleUnlocked(mod.id, progress.completedModules);
                  const isCompleted = progress.completedModules.includes(mod.id);
                  const prog = getModuleProgress(mod);
                  const isCurrent = unlocked && !isCompleted;

                  return (
                    <button
                      key={mod.id}
                      onClick={() => unlocked && navigate(mod.route)}
                      disabled={!unlocked}
                      className="w-full text-left group transition-all duration-500"
                      style={{ animation: "fade-up 0.5s ease-out both", animationDelay: `${i * 80}ms` }}
                    >
                      <div className="relative overflow-hidden rounded-xl transition-all duration-400" style={isCurrent ? {
                        background: "linear-gradient(145deg, hsl(38 28% 93% / 0.94), hsl(36 33% 95% / 0.90))",
                        backdropFilter: "blur(18px)",
                        border: "1.5px solid hsl(340 42% 28% / 0.35)",
                        boxShadow: "0 6px 28px hsl(340 42% 28% / 0.10), 0 0 40px hsl(42 70% 78% / 0.06)",
                      } : isCompleted ? {
                        background: "hsl(38 28% 94% / 0.80)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid hsl(36 42% 52% / 0.30)",
                        boxShadow: "0 3px 14px hsl(36 45% 55% / 0.06)"
                      } : {
                        background: "hsl(36 18% 90% / 0.45)",
                        backdropFilter: "blur(4px)",
                        border: "1px solid hsl(36 22% 80% / 0.45)"
                      }}>
                        <div className="p-5 flex items-center gap-4">
                          {/* Icon circle */}
                          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-500" style={isCurrent ? {
                            border: "2px solid hsl(340 42% 26% / 0.45)",
                            background: "linear-gradient(135deg, hsl(38 28% 93%), hsl(36 45% 55% / 0.12))",
                            boxShadow: "0 0 20px hsl(340 42% 28% / 0.12)"
                          } : isCompleted ? {
                            border: "2px solid hsl(36 42% 45% / 0.40)",
                            background: "hsl(38 28% 94% / 0.90)"
                          } : {
                            border: "1.5px solid hsl(36 22% 75% / 0.50)",
                            background: "hsl(36 18% 90% / 0.55)"
                          }}>
                            {isCompleted ? (
                              <Check className="w-5 h-5" style={{ color: "hsl(36 42% 38%)" }} />
                            ) : unlocked ? (
                              <span className="text-lg">{mod.icon}</span>
                            ) : (
                              <Lock className="w-4 h-4" style={{ color: "hsl(230 10% 45% / 0.30)" }} />
                            )}
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{
                                color: isCurrent ? "hsl(340 42% 22%)" : isCompleted ? "hsl(36 42% 40%)" : "hsl(230 10% 45% / 0.30)"
                              }}>
                                {mod.symbol}
                              </span>
                              <h3 className="font-heading text-base tracking-wide truncate" style={isCurrent ? {
                                background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 26%))",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                              } : isCompleted ? {
                                color: "hsl(230 20% 12% / 0.75)"
                              } : {
                                color: "hsl(230 10% 45% / 0.30)"
                              }}>
                                {mod.name}
                              </h3>
                            </div>
                            <p className="font-accent text-xs italic truncate" style={{
                              color: isCurrent ? "hsl(230 20% 15% / 0.55)" : isCompleted ? "hsl(230 20% 15% / 0.45)" : "hsl(230 10% 45% / 0.18)"
                            }}>
                              {mod.subtitle}
                            </p>
                            {/* Progress bar for modules with content */}
                            {isCurrent && prog > 0 && (
                              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(36 18% 84%)", border: "1px solid hsl(36 22% 75% / 0.50)" }}>
                                <div className="h-full rounded-full" style={{
                                  width: `${prog}%`,
                                  background: "linear-gradient(90deg, hsl(340 42% 26%), hsl(36 42% 44%))",
                                }} />
                              </div>
                            )}
                          </div>

                          {/* Arrow */}
                          {unlocked && (
                            <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" style={{
                              color: isCurrent ? "hsl(340 42% 28% / 0.50)" : "hsl(36 42% 45% / 0.40)"
                            }} />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Fool's Journey overview */}
        <section className="mb-4">
          <button
            onClick={() => navigate("/jornada-do-louco")}
            className="w-full group transition-all duration-500 hover:scale-[1.01]"
          >
            <div className="relative overflow-hidden rounded-xl p-5 flex items-center gap-4" style={{
              background: "linear-gradient(145deg, hsl(36 42% 44% / 0.06), hsl(38 28% 93% / 0.90))",
              backdropFilter: "blur(14px)",
              border: "1px solid hsl(36 42% 44% / 0.22)",
            }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{
                border: "1.5px solid hsl(36 42% 44% / 0.35)",
                background: "hsl(36 42% 44% / 0.06)"
              }}>
                <span className="text-lg" style={{ color: "hsl(36 42% 42%)" }}>◎</span>
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-heading text-sm tracking-wide" style={{ color: "hsl(230 20% 12% / 0.80)" }}>
                  A Jornada do Louco
                </h3>
                <p className="font-accent text-xs italic" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                  O mapa iniciático completo — do Louco ao Mundo
                </p>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(36 42% 45% / 0.40)" }} />
            </div>
          </button>
        </section>

        {/* Premium CTA - only after some progress */}
        {progress.completedLessons.length >= 2 && (
          <section className="mb-8">
            <button
              onClick={() => navigate("/premium")}
              className="w-full group rounded-xl border transition-all duration-300 hover:shadow-md p-4"
              style={{
                borderColor: "hsl(36 45% 58% / 0.35)",
                background: "linear-gradient(135deg, hsl(36 45% 58% / 0.06), hsl(340 42% 30% / 0.06))",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0" style={{
                  background: "linear-gradient(135deg, hsl(36 45% 58% / 0.18), hsl(340 42% 30% / 0.18))",
                  border: "1px solid hsl(36 45% 58% / 0.25)",
                }}>
                  <Crown className="w-5 h-5" style={{ color: "hsl(36 45% 50%)" }} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-heading text-sm tracking-wide" style={{ color: "hsl(340 42% 24%)" }}>
                    Jornada Completa
                  </h3>
                  <p className="font-accent text-xs italic" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                    Acesse todos os aprofundamentos, trilhas e certificados
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(36 42% 45% / 0.40)" }} />
              </div>
            </button>
          </section>
        )}

        {/* Bottom ornament */}
        <div className="flex items-center justify-center pt-4 pb-24">
          <img src={ornamentDivider} alt="" className="w-28 h-auto opacity-40" loading="lazy" width={800} height={512} />
        </div>
      </main>
    </div>
  );
};

export default ModulesPage;

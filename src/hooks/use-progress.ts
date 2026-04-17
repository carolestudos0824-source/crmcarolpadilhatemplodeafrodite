import { useState, useEffect, useCallback, useRef } from "react";
import { DEFAULT_PROGRESS, type UserProgress } from "@/lib/content";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const LOCAL_EXTRAS_KEY = "tarot-journey-extras";

/**
 * Fields stored in Supabase user_progress table.
 * Everything else (badges, currentModule, studentName, certificatesEarned) stays in localStorage.
 */
interface DbProgress {
  xp: number;
  level: number;
  streak: number;
  last_active: string;
  onboarding_completed: boolean;
  completed_lessons: string[];
  completed_quizzes: string[];
  completed_exercises: string[];
  completed_modules: string[];
}

/** Extra fields not in the DB — stored in localStorage as secondary/non-critical */
interface LocalExtras {
  badges: UserProgress["badges"];
  currentModule: string;
  studentName: string;
  certificatesEarned: Record<string, string>;
}

function getLocalExtras(): LocalExtras {
  try {
    const raw = localStorage.getItem(LOCAL_EXTRAS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        badges: parsed.badges ?? DEFAULT_PROGRESS.badges,
        currentModule: parsed.currentModule ?? DEFAULT_PROGRESS.currentModule,
        studentName: parsed.studentName ?? DEFAULT_PROGRESS.studentName,
        certificatesEarned: parsed.certificatesEarned ?? DEFAULT_PROGRESS.certificatesEarned,
      };
    }
  } catch { /* ignore */ }
  return {
    badges: DEFAULT_PROGRESS.badges,
    currentModule: DEFAULT_PROGRESS.currentModule,
    studentName: DEFAULT_PROGRESS.studentName,
    certificatesEarned: DEFAULT_PROGRESS.certificatesEarned,
  };
}

function saveLocalExtras(extras: LocalExtras) {
  localStorage.setItem(LOCAL_EXTRAS_KEY, JSON.stringify(extras));
}

function dbToProgress(row: DbProgress, extras: LocalExtras): UserProgress {
  return {
    xp: row.xp,
    level: row.level,
    streak: row.streak,
    lastActive: row.last_active,
    onboardingCompleted: row.onboarding_completed,
    completedLessons: row.completed_lessons ?? [],
    completedQuizzes: row.completed_quizzes ?? [],
    completedExercises: row.completed_exercises ?? [],
    completedModules: row.completed_modules ?? [],
    badges: extras.badges,
    currentModule: extras.currentModule,
    studentName: extras.studentName,
    certificatesEarned: extras.certificatesEarned,
  };
}

function progressToDb(p: UserProgress): Partial<DbProgress> {
  return {
    xp: p.xp,
    level: p.level,
    streak: p.streak,
    last_active: p.lastActive,
    onboarding_completed: p.onboardingCompleted,
    completed_lessons: p.completedLessons,
    completed_quizzes: p.completedQuizzes,
    completed_exercises: p.completedExercises,
    completed_modules: p.completedModules,
  };
}

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>({ ...DEFAULT_PROGRESS, ...getLocalExtras() });
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>("");

  // ─── Fetch from Supabase when user is available ───
  useEffect(() => {
    if (!user) {
      setProgress({ ...DEFAULT_PROGRESS, ...getLocalExtras() });
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (data && !error) {
        const extras = getLocalExtras();
        setProgress(dbToProgress(data as unknown as DbProgress, extras));
      }
      // If no data exists, the trigger handle_new_user already creates a row,
      // so we just keep defaults while it propagates.
      setLoading(false);
    };

    fetchProgress();
    return () => { cancelled = true; };
  }, [user]);

  // ─── Debounced save to Supabase ───
  useEffect(() => {
    if (!user || loading) return;

    const dbPayload = progressToDb(progress);
    const snapshot = JSON.stringify(dbPayload);

    // Don't save if nothing changed
    if (snapshot === lastSavedRef.current) return;

    // Save local extras immediately
    saveLocalExtras({
      badges: progress.badges,
      currentModule: progress.currentModule,
      studentName: progress.studentName,
      certificatesEarned: progress.certificatesEarned,
    });

    // Debounce DB writes (300ms)
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      lastSavedRef.current = snapshot;
      await supabase
        .from("user_progress")
        .update(dbPayload)
        .eq("user_id", user.id);
    }, 300);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [progress, user, loading]);

  // ─── Migrate old localStorage data on first load ───
  useEffect(() => {
    if (!user || loading) return;
    const oldKey = "tarot-journey-progress";
    const old = localStorage.getItem(oldKey);
    if (!old) return;

    try {
      const parsed = JSON.parse(old);
      // If old data has meaningful progress, merge it
      if (parsed.completedLessons?.length > 0 || parsed.xp > 0) {
        setProgress(prev => ({
          ...prev,
          xp: Math.max(prev.xp, parsed.xp ?? 0),
          level: Math.max(prev.level, parsed.level ?? 1),
          streak: Math.max(prev.streak, parsed.streak ?? 0),
          completedLessons: [...new Set([...prev.completedLessons, ...(parsed.completedLessons ?? [])])],
          completedQuizzes: [...new Set([...prev.completedQuizzes, ...(parsed.completedQuizzes ?? [])])],
          completedExercises: [...new Set([...prev.completedExercises, ...(parsed.completedExercises ?? [])])],
          completedModules: [...new Set([...prev.completedModules, ...(parsed.completedModules ?? [])])],
          onboardingCompleted: prev.onboardingCompleted || parsed.onboardingCompleted || false,
          badges: parsed.badges ?? prev.badges,
          studentName: parsed.studentName || prev.studentName,
        }));
      }
    } catch { /* ignore */ }

    // Remove old key after migration
    localStorage.removeItem(oldKey);
  }, [user, loading]);

  // ─── Actions (same API as before) ───

  const addXP = useCallback((amount: number) => {
    setProgress((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  }, []);

  const completeModule = useCallback((moduleId: string) => {
    setProgress((prev) => {
      if (prev.completedModules.includes(moduleId)) return prev;
      return {
        ...prev,
        completedModules: [...prev.completedModules, moduleId],
      };
    });
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        lastActive: new Date().toISOString(),
      };
    });
  }, []);

  const completeQuiz = useCallback((quizId: string) => {
    setProgress((prev) => {
      if (prev.completedQuizzes.includes(quizId)) return prev;
      return { ...prev, completedQuizzes: [...prev.completedQuizzes, quizId] };
    });
  }, []);

  const completeExercise = useCallback((exerciseId: string) => {
    setProgress((prev) => {
      if (prev.completedExercises.includes(exerciseId)) return prev;
      return { ...prev, completedExercises: [...prev.completedExercises, exerciseId] };
    });
  }, []);

  const earnBadge = useCallback((badgeId: string) => {
    setProgress((prev) => ({
      ...prev,
      badges: prev.badges.map((b) =>
        b.id === badgeId ? { ...b, earned: true, earnedAt: new Date().toISOString() } : b
      ),
    }));
  }, []);

  const updateStreak = useCallback(() => {
    setProgress((prev) => {
      const lastActive = new Date(prev.lastActive);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        return { ...prev, streak: prev.streak + 1, lastActive: now.toISOString() };
      } else if (diffDays > 1) {
        return { ...prev, streak: 1, lastActive: now.toISOString() };
      }
      return prev;
    });
  }, []);

  const isArcanoCompleted = useCallback((arcanoId: number): boolean => {
    return (
      progress.completedLessons.includes(`arcano-${arcanoId}`) &&
      progress.completedQuizzes.includes(`quiz-arcano-${arcanoId}`)
    );
  }, [progress.completedLessons, progress.completedQuizzes]);

  const isArcanoUnlocked = useCallback((arcanoId: number): boolean => {
    if (arcanoId === 0) return true;
    return isArcanoCompleted(arcanoId - 1);
  }, [isArcanoCompleted]);

  const getCurrentArcanoId = useCallback((): number => {
    for (let i = 0; i <= 21; i++) {
      if (isArcanoUnlocked(i) && !isArcanoCompleted(i)) return i;
    }
    return 21;
  }, [isArcanoUnlocked, isArcanoCompleted]);

  const completedCount = progress.completedLessons.filter(l => l.startsWith("arcano-")).length;
  const journeyProgress = Math.round((completedCount / 22) * 100);

  const completeOnboarding = useCallback(() => {
    setProgress((prev) => ({ ...prev, onboardingCompleted: true }));
  }, []);

  const resetProgress = useCallback(async () => {
    setProgress({ ...DEFAULT_PROGRESS });
    localStorage.removeItem(LOCAL_EXTRAS_KEY);
    if (user) {
      await supabase
        .from("user_progress")
        .update(progressToDb(DEFAULT_PROGRESS))
        .eq("user_id", user.id);
    }
  }, [user]);

  return {
    progress,
    loading,
    addXP,
    completeLesson,
    completeModule,
    completeQuiz,
    completeExercise,
    earnBadge,
    updateStreak,
    isArcanoCompleted,
    isArcanoUnlocked,
    getCurrentArcanoId,
    completedCount,
    journeyProgress,
    completeOnboarding,
    resetProgress,
  };
}

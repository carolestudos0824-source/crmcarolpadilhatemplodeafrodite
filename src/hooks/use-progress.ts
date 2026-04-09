import { useState, useEffect, useCallback } from "react";
import { UserProgress, DEFAULT_PROGRESS } from "@/data/tarot-data";

const STORAGE_KEY = "tarot-journey-progress";

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PROGRESS, ...parsed, completedModules: parsed.completedModules || [] };
      } catch {
        return { ...DEFAULT_PROGRESS };
      }
    }
    return { ...DEFAULT_PROGRESS };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const addXP = useCallback((amount: number) => {
    setProgress((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      return { ...prev, xp: newXP, level: newLevel };
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
      return {
        ...prev,
        completedQuizzes: [...prev.completedQuizzes, quizId],
      };
    });
  }, []);

  const completeExercise = useCallback((exerciseId: string) => {
    setProgress((prev) => {
      if (prev.completedExercises.includes(exerciseId)) return prev;
      return {
        ...prev,
        completedExercises: [...prev.completedExercises, exerciseId],
      };
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

  /** Check if a specific arcano is completed (lesson + quiz) */
  const isArcanoCompleted = useCallback((arcanoId: number): boolean => {
    return (
      progress.completedLessons.includes(`arcano-${arcanoId}`) &&
      progress.completedQuizzes.includes(`quiz-arcano-${arcanoId}`)
    );
  }, [progress.completedLessons, progress.completedQuizzes]);

  /** Check if a specific arcano is unlocked (first one or previous completed) */
  const isArcanoUnlocked = useCallback((arcanoId: number): boolean => {
    if (arcanoId === 0) return true;
    return isArcanoCompleted(arcanoId - 1);
  }, [isArcanoCompleted]);

  /** Get the current arcano (first unlocked but not completed) */
  const getCurrentArcanoId = useCallback((): number => {
    for (let i = 0; i <= 21; i++) {
      if (isArcanoUnlocked(i) && !isArcanoCompleted(i)) return i;
    }
    return 21;
  }, [isArcanoUnlocked, isArcanoCompleted]);

  /** Count completed arcanos */
  const completedCount = progress.completedLessons.filter(l => l.startsWith("arcano-")).length;

  /** Overall journey percentage */
  const journeyProgress = Math.round((completedCount / 22) * 100);

  const resetProgress = useCallback(() => {
    setProgress({ ...DEFAULT_PROGRESS });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    progress,
    addXP,
    completeLesson,
    completeQuiz,
    completeExercise,
    earnBadge,
    updateStreak,
    isArcanoCompleted,
    isArcanoUnlocked,
    getCurrentArcanoId,
    completedCount,
    journeyProgress,
    resetProgress,
  };
}

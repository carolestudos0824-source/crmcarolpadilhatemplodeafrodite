import { useState, useEffect, useCallback } from "react";
import { UserProgress, DEFAULT_PROGRESS } from "@/data/tarot-data";

const STORAGE_KEY = "tarot-journey-progress";

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
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
      const updated = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        lastActive: new Date().toISOString(),
      };
      return updated;
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

  return { progress, addXP, completeLesson, completeQuiz, earnBadge, updateStreak };
}

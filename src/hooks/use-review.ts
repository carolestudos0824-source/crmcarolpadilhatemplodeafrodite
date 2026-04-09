import { useState, useEffect, useCallback } from "react";

const REVIEW_KEY = "tarot-review-data";

interface ReviewState {
  wrongAnswers: { questionId: string; arcanoId: number; answeredAt: string }[];
  completedFlashcards: string[];
  completedDailyChallenges: string[];
  reviewSchedule: {
    [itemId: string]: {
      easeFactor: number;
      interval: number;
      nextReview: string;
      repetitions: number;
    };
  };
}

const DEFAULT_STATE: ReviewState = {
  wrongAnswers: [],
  completedFlashcards: [],
  completedDailyChallenges: [],
  reviewSchedule: {},
};

export function useReview() {
  const [state, setState] = useState<ReviewState>(() => {
    const saved = localStorage.getItem(REVIEW_KEY);
    if (saved) {
      try { return { ...DEFAULT_STATE, ...JSON.parse(saved) }; }
      catch { return { ...DEFAULT_STATE }; }
    }
    return { ...DEFAULT_STATE };
  });

  useEffect(() => {
    localStorage.setItem(REVIEW_KEY, JSON.stringify(state));
  }, [state]);

  const addWrongAnswer = useCallback((questionId: string, arcanoId: number) => {
    setState(prev => ({
      ...prev,
      wrongAnswers: [
        ...prev.wrongAnswers.filter(w => w.questionId !== questionId),
        { questionId, arcanoId, answeredAt: new Date().toISOString() },
      ],
    }));
  }, []);

  const removeWrongAnswer = useCallback((questionId: string) => {
    setState(prev => ({
      ...prev,
      wrongAnswers: prev.wrongAnswers.filter(w => w.questionId !== questionId),
    }));
  }, []);

  const completeFlashcard = useCallback((flashcardId: string, quality: "easy" | "good" | "hard") => {
    setState(prev => {
      const schedule = prev.reviewSchedule[flashcardId] || {
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
      };

      // SM-2 algorithm simplified
      let { easeFactor, interval, repetitions } = schedule;
      const q = quality === "easy" ? 5 : quality === "good" ? 3 : 1;
      easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

      if (q >= 3) {
        repetitions += 1;
        if (repetitions === 1) interval = 1;
        else if (repetitions === 2) interval = 3;
        else interval = Math.round(interval * easeFactor);
      } else {
        repetitions = 0;
        interval = 1;
      }

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + interval);

      return {
        ...prev,
        completedFlashcards: prev.completedFlashcards.includes(flashcardId)
          ? prev.completedFlashcards
          : [...prev.completedFlashcards, flashcardId],
        reviewSchedule: {
          ...prev.reviewSchedule,
          [flashcardId]: {
            easeFactor,
            interval,
            nextReview: nextDate.toISOString().split("T")[0],
            repetitions,
          },
        },
      };
    });
  }, []);

  const completeDailyChallenge = useCallback((challengeId: string) => {
    setState(prev => ({
      ...prev,
      completedDailyChallenges: prev.completedDailyChallenges.includes(challengeId)
        ? prev.completedDailyChallenges
        : [...prev.completedDailyChallenges, challengeId],
    }));
  }, []);

  /** Get flashcards due for review today */
  const getDueFlashcards = useCallback((): string[] => {
    const today = new Date().toISOString().split("T")[0];
    return Object.entries(state.reviewSchedule)
      .filter(([, s]) => s.nextReview <= today)
      .map(([id]) => id);
  }, [state.reviewSchedule]);

  return {
    ...state,
    addWrongAnswer,
    removeWrongAnswer,
    completeFlashcard,
    completeDailyChallenge,
    getDueFlashcards,
  };
}

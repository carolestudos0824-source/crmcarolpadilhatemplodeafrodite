/**
 * Fire-and-forget persistence of individual quiz answers to `quiz_responses`.
 *
 * Schema (see src/integrations/supabase/types.ts):
 *   user_id (uuid, NN)
 *   quiz_id (text, NN)
 *   question_index (int, NN)
 *   selected_answer (int, NN)
 *   is_correct (bool, default false)
 *   xp_earned (int, default 0)
 *
 * RLS requires auth.uid() = user_id. We never await this — the UX must not
 * block on telemetry. Errors are logged to console only.
 */
import { supabase } from "@/integrations/supabase/client";

export interface QuizAnswerPayload {
  userId: string;
  quizId: string;
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
  xpEarned?: number;
}

export function persistQuizResponse(payload: QuizAnswerPayload): void {
  if (!payload.userId || !payload.quizId) return;
  supabase
    .from("quiz_responses")
    .insert({
      user_id: payload.userId,
      quiz_id: payload.quizId,
      question_index: payload.questionIndex,
      selected_answer: payload.selectedAnswer,
      is_correct: payload.isCorrect,
      xp_earned: payload.xpEarned ?? (payload.isCorrect ? 10 : 0),
    })
    .then(({ error }) => {
      if (error && import.meta.env.DEV) {
        console.error("[quiz-responses] insert failed", error);
      }
    });
}

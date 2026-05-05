import { useState, useEffect } from "react";
import { getQuizContent } from "@/lib/content";

export function useResolvedQuiz(params: any, legacyQuiz?: any) {
  const [questions, setQuestions] = useState<any>(legacyQuiz || params?.legacyQuiz || null);

  useEffect(() => {
    if (!params?.linkedTo) return;
    getQuizContent(params).then(res => {
      if (res?.perguntas) setQuestions(res.perguntas);
    });
  }, [params?.linkedTo]);

  return { questions, sourceUsed: "legacy", usedFallback: true };
}

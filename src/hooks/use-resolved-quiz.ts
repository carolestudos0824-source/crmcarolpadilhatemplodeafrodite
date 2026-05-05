import { useState, useEffect } from "react";
import { getQuizContent } from "@/lib/content";

export function useResolvedQuiz(params: any) {
  const [questions, setQuestions] = useState<any>(params?.legacyQuiz || null);

  useEffect(() => {
    if (!params?.linkedTo) return;
    getQuizContent(params).then(res => {
      if (res?.questions) setQuestions(res.questions);
    });
  }, [params?.linkedTo]);

  return { questions, sourceUsed: "legacy" };
}

import { useState, useEffect } from "react";
import { getLessonContent } from "@/lib/content";

export function useResolvedLesson(params: any, ...args: any[]) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params || typeof params === 'string') return;
    getLessonContent(params).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [params?.moduleSlug, params?.lessonSlug]);

  return { data, loading, isLoading: loading, usedFallback: true, sourceUsed: "legacy" };
}

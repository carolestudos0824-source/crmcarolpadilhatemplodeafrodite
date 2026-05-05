import { useState, useEffect } from "react";
import { getLessonContent } from "@/lib/content";

export function useResolvedLesson(params: { moduleSlug: string; lessonSlug: string } | null, moreParams?: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params) return;
    getLessonContent(params).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [params?.moduleSlug, params?.lessonSlug]);

  return { data, loading, isLoading: loading, usedFallback: true, sourceUsed: "legacy" };
}

import { useState, useEffect } from "react";
import { getModuleContent } from "@/lib/content";

export function useResolvedModule(slug: any, ...args: any[]) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || typeof slug !== 'string') return;
    getModuleContent(slug).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [slug]);

  return { data, loading, isLoading: loading, usedFallback: true, sourceUsed: "legacy" };
}

import { useState, useEffect } from "react";
import { getModuleContent } from "@/lib/content";

export function useResolvedModule(slug: string | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getModuleContent(slug).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [slug]);

  return { data, loading };
}

import { useState, useEffect } from "react";
import { getArcanoContent } from "@/lib/content";

export function useResolvedArcano(params: any, moreParams?: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params) return;
    getArcanoContent(params).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [params?.tipo, params?.numero, params?.naipe, params?.posicao]);

  return { data, loading, isLoading: loading, usedFallback: true, sourceUsed: "legacy" };
}

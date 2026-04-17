/**
 * Parsers utilitários — banco e legado → tipos canônicos.
 *
 * Mantemos um único ponto de tradução para que UI nunca veja shape estranho.
 */

import type { ContentStatus, ContentTier } from "./types";

/** Traduz enum DB `module_status` → status canônico PT. */
export function parseStatus(raw: string | null | undefined): ContentStatus {
  switch (raw) {
    case "published":
      return "publicado";
    case "draft":
      return "rascunho";
    case "partial":
      return "parcial";
    case "empty":
    default:
      return "vazio";
  }
}

/** Quiz só conhece publicado vs rascunho. */
export function parseQuizStatus(raw: string | null | undefined): "rascunho" | "publicado" {
  return raw === "published" ? "publicado" : "rascunho";
}

export function parseTier(raw: string | null | undefined): ContentTier {
  return raw === "free" ? "free" : "premium";
}

/** Aceita string ou objeto serializado (JSON.stringify de campos estruturados). */
export function parseEditorialField(raw: unknown): string | undefined {
  if (raw == null) return undefined;
  if (typeof raw === "string") {
    if (!raw.trim()) return undefined;
    // Pode ser JSON serializado (legado de seed). Se parsear, achata para texto.
    if (raw.trim().startsWith("{") || raw.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(raw);
        return flattenStructuredText(parsed);
      } catch {
        return raw;
      }
    }
    return raw;
  }
  return flattenStructuredText(raw);
}

/**
 * Achata estruturas conhecidas (voice {intro,fullText}, deepDive {text,...},
 * interpretation {light,shadow}, arrays de {keyword, meaning}) em string Markdown.
 */
export function flattenStructuredText(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") return value || undefined;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => {
        if (typeof item === "string") return `- ${item}`;
        if (item && typeof item === "object") {
          const o = item as Record<string, unknown>;
          if ("name" in o && "meaning" in o) return `- **${o.name}**: ${o.meaning}`;
          if ("keyword" in o && "meaning" in o) return `- **${o.keyword}**: ${o.meaning}`;
          if ("question" in o) return `- ${o.question}`;
        }
        return null;
      })
      .filter(Boolean);
    return parts.length > 0 ? parts.join("\n") : undefined;
  }

  if (typeof value === "object") {
    const o = value as Record<string, unknown>;

    // voice { intro, fullText }
    if ("fullText" in o) {
      const intro = typeof o.intro === "string" ? o.intro : "";
      const full = typeof o.fullText === "string" ? o.fullText : "";
      return [intro, full].filter(Boolean).join("\n\n") || undefined;
    }

    // deepDive { text, symbolism, cabala, history }
    if ("text" in o && ("symbolism" in o || "cabala" in o || "history" in o)) {
      const sections: string[] = [];
      if (o.text) sections.push(String(o.text));
      if (o.symbolism) sections.push(`## Simbolismo\n\n${o.symbolism}`);
      if (o.cabala) sections.push(`## Cabala\n\n${o.cabala}`);
      if (o.history) sections.push(`## História\n\n${o.history}`);
      return sections.join("\n\n") || undefined;
    }

    // interpretation { light, shadow }
    if ("light" in o && "shadow" in o) {
      return `**Luz:** ${o.light}\n\n**Sombra:** ${o.shadow}`;
    }

    // título + corpo
    if ("title" in o && "body" in o) {
      return `## ${o.title}\n\n${o.body}`;
    }

    // último recurso: pegar primeiro string-like field
    for (const v of Object.values(o)) {
      if (typeof v === "string" && v.trim()) return v;
    }
  }

  return undefined;
}

export function parseStringArray(raw: unknown): string[] | undefined {
  if (Array.isArray(raw)) {
    const arr = raw.filter((x): x is string => typeof x === "string");
    return arr.length > 0 ? arr : undefined;
  }
  return undefined;
}

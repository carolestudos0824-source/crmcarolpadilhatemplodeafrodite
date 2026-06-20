import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const MAX_INPUT = 12000;
const MIN_INPUT = 50;
const DAILY_LIMIT = 20;

type Mode = "lovable" | "agent";

const SYSTEM_PROMPT = `Você revisa prompts para um programa chamado "Fábrica de Apps com IA", que ensina pessoas a construir o próprio app no Lovable.

Regras inegociáveis:
- A "Fábrica de Apps com IA" é apenas o programa-guia. Nunca trate a Fábrica como o app final.
- O app final é o projeto da pessoa no Lovable. Toda tarefa é aplicada nesse projeto.
- Preserve o contexto do app, a etapa atual, o objetivo e a tarefa principal do prompt original.
- Adicione regras de preservação (não quebrar login, banco, acesso, admin, checkout, entrega, progresso, layout) quando faltarem.
- Adicione orientação de teste quando faltar.
- Use linguagem clara, prática, técnica o suficiente. Sem promessa de "milhões garantidos", "app perfeito" ou "100% seguro".
- Não invente funcionalidades fora do contexto do app.
- Se a aba for "lovable", entregue um prompt pronto para executar no Lovable.
- Se a aba for "agent", entregue um prompt pronto para conversar com o Agente Arquiteto pedindo uma versão final para o Lovable.

Responda APENAS com JSON válido neste formato exato (sem markdown, sem cercas de código):
{
  "improvedPrompt": "string",
  "improvements": ["string", "..."],
  "warnings": ["string", "..."],
  "quality": {
    "hasContext": boolean,
    "hasStep": boolean,
    "hasTask": boolean,
    "hasPreservationRules": boolean,
    "hasTestingInstructions": boolean
  }
}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Método não permitido." });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const ANON = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
  const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

  // Auth: require signed-in user
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    return json(401, { error: "Autenticação necessária." });
  }
  const userClient = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return json(401, { error: "Sessão inválida ou expirada." });
  }
  const userId = userData.user.id;

  if (!LOVABLE_API_KEY) {
    return json(503, {
      error:
        "A melhoria automática ainda não está configurada. Use o botão Revisar com o Agente para melhorar o prompt pelo ChatGPT.",
      code: "ai_not_configured",
    });
  }

  // Parse body
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Corpo da requisição inválido." });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt : "";
  const mode = body.mode === "agent" ? "agent" : body.mode === "lovable" ? "lovable" : null;
  const projectContext = (body.projectContext ?? {}) as Record<string, unknown>;
  const moduleTitle = typeof body.moduleTitle === "string" ? body.moduleTitle : "";
  const moduleObjective = typeof body.moduleObjective === "string" ? body.moduleObjective : "";
  const moduleId = typeof body.moduleId === "string" ? body.moduleId : null;
  const commandText = typeof body.commandText === "string" ? body.commandText : "";

  if (!mode) return json(400, { error: "Campo `mode` precisa ser 'lovable' ou 'agent'." });
  if (!prompt.trim()) return json(400, { error: "Prompt vazio." });
  if (prompt.length < MIN_INPUT) {
    return json(400, {
      error: `Prompt muito curto. Escreva pelo menos ${MIN_INPUT} caracteres para a IA conseguir melhorar.`,
    });
  }
  if (prompt.length > MAX_INPUT) {
    return json(413, {
      error: `Prompt muito longo (${prompt.length} caracteres). Reduza para no máximo ${MAX_INPUT} caracteres antes de melhorar.`,
      code: "too_long",
    });
  }

  // Rate limit: 20 / day per user
  const admin = createClient(SUPABASE_URL, SERVICE);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: usedToday } = await admin
    .from("prompt_improvement_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);

  if ((usedToday ?? 0) >= DAILY_LIMIT) {
    return json(429, {
      error:
        "Você atingiu o limite de melhorias automáticas por hoje. Ainda pode usar o Agente Arquiteto para revisar seus prompts.",
      code: "daily_limit",
    });
  }

  // Build user message
  const ctxLines = Object.entries(projectContext)
    .filter(([, v]) => typeof v === "string" && (v as string).trim())
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");

  const userMessage = `Modo: ${mode}
Etapa atual: ${moduleTitle || "[não informado]"}
Objetivo da etapa: ${moduleObjective || "[não informado]"}
${commandText ? `Comando base original:\n${commandText}\n` : ""}
Contexto do app:
${ctxLines || "[não preenchido]"}

Prompt atual editado pela pessoa (melhore exatamente este texto, não reconstrua do zero):
"""
${prompt}
"""

Devolva o JSON exigido pelo sistema.`;

  // Call Lovable AI Gateway
  let aiData: any;
  try {
    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY,
        "X-Lovable-AIG-SDK": "edge-function",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (aiResp.status === 429) {
      return json(429, {
        error: "Limite de uso da IA atingido agora. Tente novamente em alguns minutos.",
        code: "ai_rate_limit",
      });
    }
    if (aiResp.status === 402) {
      return json(402, {
        error: "Créditos de IA esgotados. Avise o administrador.",
        code: "ai_no_credits",
      });
    }
    if (!aiResp.ok) {
      const t = await aiResp.text().catch(() => "");
      return json(502, {
        error: "Não foi possível melhorar automaticamente agora.",
        detail: t.slice(0, 200),
      });
    }
    aiData = await aiResp.json();
  } catch (e) {
    return json(502, {
      error: "Não foi possível melhorar automaticamente agora.",
      detail: e instanceof Error ? e.message : String(e),
    });
  }

  const content: string =
    aiData?.choices?.[0]?.message?.content ??
    aiData?.choices?.[0]?.delta?.content ??
    "";

  let parsed: {
    improvedPrompt?: string;
    improvements?: string[];
    warnings?: string[];
    quality?: Record<string, boolean>;
  } = {};
  try {
    parsed = JSON.parse(content);
  } catch {
    // Try to extract JSON object substring
    const m = content.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        parsed = JSON.parse(m[0]);
      } catch {
        /* ignore */
      }
    }
  }

  const improvedPrompt =
    typeof parsed.improvedPrompt === "string" && parsed.improvedPrompt.trim()
      ? parsed.improvedPrompt
      : null;

  if (!improvedPrompt) {
    return json(502, {
      error: "A IA respondeu em formato inesperado. Tente novamente.",
    });
  }

  // Log usage (metadata only, NEVER the prompt text)
  try {
    await admin.from("prompt_improvement_logs").insert({
      user_id: userId,
      mode,
      module_id: moduleId,
      module_title: moduleTitle || null,
      input_length: prompt.length,
      output_length: improvedPrompt.length,
    });
  } catch {
    /* log failure must not break the response */
  }

  return json(200, {
    improvedPrompt,
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 10) : [],
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings.slice(0, 10) : [],
    quality: {
      hasContext: Boolean(parsed.quality?.hasContext),
      hasStep: Boolean(parsed.quality?.hasStep),
      hasTask: Boolean(parsed.quality?.hasTask),
      hasPreservationRules: Boolean(parsed.quality?.hasPreservationRules),
      hasTestingInstructions: Boolean(parsed.quality?.hasTestingInstructions),
    },
    remaining: Math.max(0, DAILY_LIMIT - ((usedToday ?? 0) + 1)),
  });
});

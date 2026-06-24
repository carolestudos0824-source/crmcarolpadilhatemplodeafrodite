// Agente Arquiteto — chat contextual por projeto.
// Carrega projeto ativo + contexto + outputs anteriores + histórico recente,
// monta o prompt, chama Lovable AI Gateway e grava as mensagens.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY")!;

const MODEL = "google/gemini-3-flash-preview";

const MODULE_LABELS: Record<string, string> = {
  comece: "Comece aqui",
  ideias: "Ideias prontas",
  planejar: "Planejar o App",
  mvp: "MVP e Arquitetura",
  telas: "Telas e Fluxo",
  construir: "Construir App",
  login: "Login e Banco",
  seguranca: "Segurança do App",
  teste: "Teste Final do App",
  validacao: "Validação",
  monetizacao: "Monetização",
  campanhas: "Campanhas",
  publicar: "Publicar e Domínio",
  legal: "Legal e Confiança",
  metricas: "Métricas",
  melhorias: "Melhorias e Versões",
};

const MODULE_ORDER = [
  "comece","ideias","planejar","mvp","telas","construir","login",
  "seguranca","teste","validacao","monetizacao","campanhas","publicar",
  "legal","metricas","melhorias",
];

const SYSTEM_PROMPT = `Você é o Arquiteto Supremo de Aplicativos, copiloto contextual do usuário dentro do programa Fábrica de Apps com IA.

REGRAS INVIOLÁVEIS:
- Nunca responda de forma genérica.
- Nunca pergunte qual é o app se já existir projeto ativo salvo com contexto suficiente.
- Use o projeto ativo como fonte principal de verdade.
- Preserve decisões anteriores. Continue o raciocínio linearmente entre módulos.
- Quando o modo for "auditar app existente" ou "otimização", NÃO recrie tudo do zero. Audite, aponte lacunas, riscos e proponha melhorias práticas.
- MVP com mais de 5 funcionalidades principais NÃO é MVP. Corte para 5 ou menos.
- Sempre considere mobile first.
- Seja direto, estratégico e aplicável. Sem rodeios, sem disclaimers genéricos.
- Ao final de cada resposta, entregue uma seção curta "Próximos passos" com 1 a 3 ações objetivas.
- Se a informação essencial do projeto estiver faltando, faça no máximo 5 perguntas focadas:
  1. Qual é a ideia do app?
  2. Quem vai usar?
  3. Qual problema ele resolve?
  4. Como você pretende ganhar dinheiro com ele?
  5. Você quer construir com Lovable, Claude Code, Cursor, Gemini, Replit ou quer que eu decida?`;

function buildContextBlock(args: {
  project: any;
  ctx: any;
  moduleKey?: string | null;
  stepKey?: string | null;
  outputs: any[];
}): string {
  const { project, ctx, moduleKey, stepKey, outputs } = args;
  const name = project?.app_name ?? "App sem nome";
  const lines: string[] = [];
  lines.push("PROJETO ATIVO:");
  lines.push(`- Nome: ${name}`);
  if (project?.app_description) lines.push(`- Ideia/O que o app faz: ${project.app_description}`);
  if (project?.target_audience) lines.push(`- Público-alvo: ${project.target_audience}`);
  if (project?.problem_solved) lines.push(`- Problema resolvido: ${project.problem_solved}`);
  if (project?.main_promise) lines.push(`- Promessa principal: ${project.main_promise}`);
  if (project?.main_user_action) lines.push(`- Ação principal do usuário: ${project.main_user_action}`);
  if (project?.product_or_service) lines.push(`- Produto/serviço: ${project.product_or_service}`);
  if (project?.pricing_model) lines.push(`- Modelo de cobrança: ${project.pricing_model}`);
  if (project?.visual_style) lines.push(`- Estilo visual: ${project.visual_style}`);
  if (project?.notes) lines.push(`- Observações: ${project.notes}`);
  lines.push(`- Modo atual: ${project?.app_stage ?? "novo MVP"}`);
  lines.push(`- Status: ${project?.status ?? "ideia"}`);

  if (moduleKey) {
    lines.push("");
    lines.push(`MÓDULO ATUAL: ${MODULE_LABELS[moduleKey] ?? moduleKey}`);
  }
  if (stepKey) lines.push(`ETAPA ATUAL: ${stepKey}`);

  if (ctx?.summary && String(ctx.summary).trim()) {
    lines.push("");
    lines.push("CONTEXTO SALVO DO PROJETO:");
    lines.push(String(ctx.summary).slice(0, 2000));
  }

  if (ctx?.context_json && Object.keys(ctx.context_json).length > 0) {
    lines.push("");
    lines.push("DECISÕES CONSOLIDADAS (por módulo):");
    for (const [k, v] of Object.entries(ctx.context_json)) {
      lines.push(`- ${MODULE_LABELS[k] ?? k}: ${typeof v === "string" ? v.slice(0, 400) : JSON.stringify(v).slice(0, 400)}`);
    }
  }

  if (outputs.length > 0) {
    lines.push("");
    lines.push("OUTPUTS ANTERIORES RELEVANTES:");
    for (const o of outputs) {
      const label = MODULE_LABELS[o.module_key] ?? o.module_key;
      const title = o.title ? ` — ${o.title}` : "";
      lines.push(`[${label}${title}]`);
      lines.push(String(o.content).slice(0, 800));
      lines.push("");
    }
  }
  return lines.join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "");
    if (!jwt) return json({ error: "unauthorized" }, 401);

    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json({ error: "unauthorized" }, 401);
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const projectId: string | undefined = body.projectId;
    const userMessage: string = (body.userMessage ?? "").toString().trim();
    const moduleKey: string | null = body.moduleKey ?? null;
    const stepKey: string | null = body.stepKey ?? null;
    if (!projectId) return json({ error: "missing_projectId" }, 400);
    if (!userMessage) return json({ error: "missing_userMessage" }, 400);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    // 1) Projeto ativo (com checagem de posse)
    const { data: project, error: projErr } = await admin
      .from("user_app_projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", userId)
      .maybeSingle();
    if (projErr || !project) return json({ error: "project_not_found" }, 404);

    // 2) Garantir conversation
    let convId: string | undefined;
    {
      const { data: existing } = await admin
        .from("agent_conversations")
        .select("id")
        .eq("project_id", projectId)
        .eq("user_id", userId)
        .maybeSingle();
      if (existing?.id) {
        convId = existing.id;
      } else {
        const { data: created, error: cErr } = await admin
          .from("agent_conversations")
          .insert({ project_id: projectId, user_id: userId, title: "Conversa principal" })
          .select("id")
          .single();
        if (cErr || !created) return json({ error: "conversation_failed", detail: cErr?.message }, 500);
        convId = created.id;
      }
    }

    // 3) Contexto salvo
    const { data: ctx } = await admin
      .from("project_contexts")
      .select("summary, context_json")
      .eq("project_id", projectId)
      .maybeSingle();

    // 4) Outputs relevantes — módulo atual + módulo anterior na ordem
    const moduleScope: string[] = [];
    if (moduleKey) {
      moduleScope.push(moduleKey);
      const idx = MODULE_ORDER.indexOf(moduleKey);
      if (idx > 0) moduleScope.push(MODULE_ORDER[idx - 1]);
    }
    let outputs: any[] = [];
    if (moduleScope.length > 0) {
      const { data } = await admin
        .from("project_outputs")
        .select("module_key, step_key, title, content, created_at")
        .eq("project_id", projectId)
        .in("module_key", moduleScope)
        .order("created_at", { ascending: false })
        .limit(8);
      outputs = data ?? [];
    } else {
      const { data } = await admin
        .from("project_outputs")
        .select("module_key, step_key, title, content, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(5);
      outputs = data ?? [];
    }

    // 5) Últimas 10 mensagens
    const { data: historyDesc } = await admin
      .from("agent_messages")
      .select("role, content")
      .eq("conversation_id", convId!)
      .order("created_at", { ascending: false })
      .limit(10);
    const history = (historyDesc ?? []).reverse();

    // 6) Inserir mensagem do usuário
    await admin.from("agent_messages").insert({
      conversation_id: convId,
      project_id: projectId,
      user_id: userId,
      role: "user",
      content: userMessage,
      module_key: moduleKey,
      step_key: stepKey,
    });

    // 7) Montar mensagens para o LLM
    const contextBlock = buildContextBlock({ project, ctx, moduleKey, stepKey, outputs });
    const messages = [
      { role: "system", content: `${SYSTEM_PROMPT}\n\n${contextBlock}` },
      ...history.map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: userMessage },
    ];

    // 8) Chamar Lovable AI Gateway (OpenAI-compatible)
    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_KEY,
        "X-Lovable-AIG-SDK": "edge-direct",
      },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.4 }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      if (aiResp.status === 429) return json({ error: "rate_limited", detail: errText }, 429);
      if (aiResp.status === 402) return json({ error: "credits_exhausted", detail: errText }, 402);
      return json({ error: "ai_failed", status: aiResp.status, detail: errText }, 502);
    }
    const aiJson = await aiResp.json();
    const assistantText: string =
      aiJson?.choices?.[0]?.message?.content?.toString() ?? "(sem resposta)";

    // 9) Persistir resposta do assistant
    const { data: savedAssistant } = await admin
      .from("agent_messages")
      .insert({
        conversation_id: convId,
        project_id: projectId,
        user_id: userId,
        role: "assistant",
        content: assistantText,
        module_key: moduleKey,
        step_key: stepKey,
        metadata: { model: MODEL },
      })
      .select("id, created_at")
      .single();

    // 10) Bump updated_at na conversa
    await admin
      .from("agent_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", convId!);

    return json({
      conversationId: convId,
      assistant: {
        id: savedAssistant?.id,
        content: assistantText,
        created_at: savedAssistant?.created_at,
      },
    });
  } catch (e) {
    return json({ error: "internal", detail: e instanceof Error ? e.message : String(e) }, 500);
  }
});

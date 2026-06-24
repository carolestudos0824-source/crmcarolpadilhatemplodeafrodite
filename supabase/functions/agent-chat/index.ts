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
- Sempre use o projeto ativo como fonte principal de verdade.
- Sempre considere as decisões salvas (CONTEXTO SALVO + DECISÕES CONSOLIDADAS + OUTPUTS ANTERIORES).
- Nunca pergunte qual é o app se já existir projeto ativo salvo com contexto suficiente.
- Em modo "auditar app existente" / "otimização": NÃO recrie tudo do zero. Audite, aponte lacunas, riscos e proponha melhorias práticas.
- MVP com mais de 5 funcionalidades principais NÃO é MVP. Corte para 5 ou menos.
- Mobile first. Baixo custo inicial. Velocidade de lançamento. Validação com usuários reais.
- Seja direto, estratégico e aplicável. Sem rodeios, sem disclaimers genéricos.

CABEÇALHO OBRIGATÓRIO (primeira linha da resposta):
- Se houver contexto suficiente (projeto ativo + ao menos ideia/público/problema OU decisões salvas), comece EXATAMENTE com:
  "Contexto usado: projeto ativo + decisões salvas + módulo atual."
- Se faltar contexto essencial, comece EXATAMENTE com:
  "Contexto insuficiente: preciso confirmar alguns dados antes de decidir."
  e em seguida faça NO MÁXIMO 5 perguntas focadas (ideia / público / problema / monetização / ferramenta de build). Nesse caso, pule as seções 2 a 5.

FORMATO OBRIGATÓRIO DA RESPOSTA (use exatamente estes títulos em markdown, nesta ordem):

## 1. Diagnóstico rápido
2 a 4 linhas descrevendo o estado da etapa atual, citando explicitamente o nome do projeto ativo, o módulo atual, a etapa atual e ao menos uma decisão salva relevante (quando existir).

## 2. Decisão recomendada
Diga exatamente UMA decisão recomendada para agora. Não entregue várias opções sem indicar a melhor. Se houver alternativas, mencione brevemente mas deixe claro qual é a escolhida e por quê.

## 3. O que manter
Bullets curtos do que já está correto no projeto/etapa e deve ser preservado. Baseie-se nas decisões salvas e outputs anteriores.

## 4. O que cortar
Bullets curtos do que está inchando o MVP, confundindo o usuário ou atrasando o lançamento. Aplique a regra de no máximo 5 funcionalidades.

## 5. Próximo passo prático
UMA ação objetiva, executável agora (1 a 3 linhas). Sem listas longas, sem "depois faça também".

Quando faltar contexto, responda apenas o cabeçalho de contexto insuficiente + as perguntas (sem as seções 1 a 5).`;

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
    const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
    const userMessage: string = (body.user_message ?? "").toString().trim();
    const moduleKey: string | null = typeof body.module_key === "string" ? body.module_key : null;
    const stepKey: string | null = typeof body.step_key === "string" ? body.step_key : null;
    if (!projectId) return json({ error: "missing_project_id" }, 400);
    if (!userMessage) return json({ error: "missing_userMessage" }, 400);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    // 1) Projeto ativo (com checagem de posse)
    const { data: project, error: projErr } = await admin
      .from("user_app_projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", userId)
      .maybeSingle();
    if (projErr || !project) return json({ error: "project_forbidden" }, 403);

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

    // 3) Contexto salvo (escopo project_id + user_id)
    const { data: ctx } = await admin
      .from("project_contexts")
      .select("summary, context_json")
      .eq("project_id", projectId)
      .eq("user_id", userId)
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
        .eq("user_id", userId)
        .in("module_key", moduleScope)
        .order("created_at", { ascending: false })
        .limit(8);
      outputs = data ?? [];
    } else {
      const { data } = await admin
        .from("project_outputs")
        .select("module_key, step_key, title, content, created_at")
        .eq("project_id", projectId)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);
      outputs = data ?? [];
    }

    // 5) Últimas 10 mensagens
    const { data: historyDesc } = await admin
      .from("agent_messages")
      .select("role, content")
      .eq("conversation_id", convId!)
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);
    const history = (historyDesc ?? []).reverse();

    // 6) Inserir mensagem do usuário
    const { error: userMessageErr } = await admin.from("agent_messages").insert({
      conversation_id: convId,
      project_id: projectId,
      user_id: userId,
      role: "user",
      content: userMessage,
      module_key: moduleKey,
      step_key: stepKey,
    });
    if (userMessageErr) return json({ error: "message_persist_failed", detail: userMessageErr.message }, 500);

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
    const { data: savedAssistant, error: assistantErr } = await admin
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
    if (assistantErr || !savedAssistant) {
      return json({ error: "assistant_persist_failed", detail: assistantErr?.message }, 500);
    }

    // 10) Bump updated_at na conversa
    await admin
      .from("agent_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", convId!)
      .eq("project_id", projectId)
      .eq("user_id", userId);

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

import { useMemo, useState } from "react";
import {
  Copy,
  X,
  Eye,
  Sparkles,
  FolderPlus,
  ClipboardEdit,
  Wand2,
  Bot,
  ChevronDown,
  ExternalLink,
  ArrowRight,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/GlassCard";
import type { AppModel } from "@/data/entregaModules";
import { useProjectContext, EMPTY_PROJECT_CONTEXT, type ProjectContext } from "@/hooks/useProjectContext";
import { useAppProjects } from "@/hooks/useAppProjects";
import { PromptReviewDialog } from "@/components/entrega/PromptReviewDialog";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import { AGENTE_ARQUITETO_URL, copyPromptAndOpenAgent } from "@/lib/agenteArquiteto";

const LOVABLE_URL = "https://lovable.dev";


/* ---------- helpers ---------- */

const list = (xs?: string[]) => (xs && xs.length ? xs.map((x) => `- ${x}`).join("\n") : "- (a definir)");

const buildScreens = (m: AppModel) => {
  if (m.screensWithRole?.length) {
    return m.screensWithRole.map((s) => `- ${s.name}: ${s.role}`).join("\n");
  }
  return m.screens.map((s) => `- ${s}`).join("\n");
};

const buildLovableIdeaPrompt = (m: AppModel, editedName: string) => {
  const name = editedName.trim() || m.name;
  return `Estou usando a Fábrica de Apps com IA apenas como guia para estruturar este projeto.

Importante:
- Não crie um app chamado Fábrica de Apps com IA.
- Não inclua a marca, logo, textos, área de membros ou estrutura da Fábrica de Apps com IA no app final.
- O app que deve ser criado é o projeto descrito abaixo.
- Construa somente o app do usuário, com o nome, público, funcionalidades e telas descritos neste prompt.

Crie um app chamado: ${name}

Objetivo do app:
${m.shortDescription ?? `App para ${m.audience.toLowerCase()}`}

Público-alvo:
${m.audience}

Dor principal:
${m.pain}

Promessa:
${m.promise ?? "Resolver a dor principal de forma simples e direta."}

Ação principal do usuário:
${m.mainAction ?? "(a definir)"}

MVP da primeira versão:
${list(m.mvp ?? m.screens)}

O que NÃO incluir agora:
${list(m.cutFromFirst ?? ["Integrações externas complexas", "Funcionalidades fora do MVP"])}

Telas iniciais:
${buildScreens(m)}

Banco de dados inicial:
${m.database.map((d) => `- ${d}`).join("\n")}

Login e acesso:
${m.loginAccess ?? "Login obrigatório por usuário."}

Área admin:
${m.adminArea ?? "Sem área admin nesta primeira versão."}

Monetização e checkout:
${m.monetization}${m.paymentNotes ? `\n${m.paymentNotes}` : ""}

Estilo visual:
${m.visualStyleSuggestion ?? "Clean, mobile first, em português."}

Regras:
- Construa apenas a primeira versão funcional.
- Não invente funcionalidades fora do MVP.
- Mantenha o app simples, claro e responsivo.
- Priorize mobile.
- Use textos claros em português.
- Não implemente integrações externas complexas nesta primeira versão, a menos que seja necessário.
- Ao final, informe o que foi criado e o que preciso testar.`;
};

const buildAgentIdeaPrompt = (m: AppModel, editedName: string) => {
  const name = editedName.trim() || m.name;
  return `Estou usando a Fábrica de Apps com IA para transformar uma ideia em app no Lovable.

Quero criar um app chamado: ${name}

Ideia:
${m.shortDescription ?? `App para ${m.audience.toLowerCase()}`}

Público:
${m.audience}

Dor:
${m.pain}

Promessa:
${m.promise ?? "(definir promessa)"}

MVP sugerido:
${list(m.mvp ?? m.screens)}

Telas iniciais:
${buildScreens(m)}

Banco sugerido:
${m.database.map((d) => `- ${d}`).join("\n")}

Monetização:
${m.monetization}

Antes de eu mandar isso ao Lovable, revise comigo:

1. Se a ideia está clara.
2. Se o MVP está enxuto.
3. Se as telas fazem sentido.
4. Se o banco está suficiente.
5. Se a monetização está coerente.
6. O que devo cortar agora.
7. Qual versão final do prompt devo mandar ao Lovable.

Me entregue uma versão final pronta para colar no Lovable.`;
};

const modelToContext = (m: AppModel, editedName: string): ProjectContext => ({
  ...EMPTY_PROJECT_CONTEXT,
  appName: editedName.trim() || m.name,
  appDoes: m.shortDescription ?? `App para ${m.audience.toLowerCase()}`,
  audience: m.audience,
  problem: m.pain,
  promise: m.promise ?? "",
  mainAction: m.mainAction ?? "",
  productSold: m.monetization,
  pricingModel: m.monetization,
  needsLogin: "sim",
  needsDatabase: m.database.length > 0 ? "sim" : "",
  needsPaidArea: /assin|membro|pago|premium/i.test(m.monetization) ? "sim" : "",
  needsAdmin: m.adminArea && !/sem (painel )?admin/i.test(m.adminArea) ? "sim" : "nao",
  needsCheckout: /checkout|pagamento|stripe|hotmart|kiwify|pix/i.test(
    `${m.monetization} ${m.paymentNotes ?? ""}`,
  )
    ? "sim"
    : "nao",
  visualStyle: m.visualStyleSuggestion ?? "Clean, mobile first.",
  notes: [
    m.differentiator && `Diferencial: ${m.differentiator}`,
    m.cutFromFirst?.length && `Não incluir agora: ${m.cutFromFirst.join("; ")}`,
    m.validationTest && `Teste de validação: ${m.validationTest}`,
  ]
    .filter(Boolean)
    .join("\n"),
});

/* ---------- UI ---------- */

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
    {children}
  </h4>
);

const InfoCard = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="rounded-lg bg-white/5 border border-white/10 p-3 text-sm space-y-1">
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="text-foreground/90">{children}</div>
  </div>
);

export const AppModelCard = ({ model }: { model: AppModel }) => {
  const [open, setOpen] = useState(false);
  const [editedName, setEditedName] = useState(model.name);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [agentFallback, setAgentFallback] = useState<string | null>(null);

  const { setContext, openEditor } = useProjectContext();
  const {
    createProject,
    activeProject,
    saveContextToActiveProject,
  } = useAppProjects();

  const lovablePrompt = useMemo(() => buildLovableIdeaPrompt(model, editedName), [model, editedName]);
  const agentPrompt = useMemo(() => buildAgentIdeaPrompt(model, editedName), [model, editedName]);
  const postLovablePrompt = useMemo(() => {
    const name = editedName.trim() || model.name;
    const objective = model.shortDescription ?? `App para ${model.audience.toLowerCase()}`;
    const mvp = (model.mvp ?? model.screens).map((x) => `- ${x}`).join("\n");
    return `Analise o resultado que o Lovable gerou para meu app.

Contexto:
Estou usando a Fábrica de Apps com IA para criar o app: ${name}

O objetivo do app é:
${objective}

O MVP planejado é:
${mvp}

Agora colei no Lovable o prompt de construção e ele retornou este resultado:

[COLE AQUI A RESPOSTA OU RESULTADO DO LOVABLE]

Quero que você analise como meu Agente Arquiteto:
1. O que o Lovable criou corretamente.
2. O que ficou faltando.
3. O que pode estar errado ou incompleto.
4. Se o app ainda está simples o suficiente para um MVP.
5. Quais testes manuais devo fazer agora.
6. Qual próximo comando devo colar no Lovable para corrigir ou melhorar.
7. O que devo evitar adicionar neste momento.

Responda de forma prática, com o próximo prompt pronto para copiar e colar no Lovable.`;
  }, [editedName, model]);

  const nextLovablePrompt = useMemo(() => {
    const name = editedName.trim() || model.name;
    return `Aplique no app "${name}" o próximo ajuste sugerido pelo Agente Arquiteto.

Instruções do Agente:

[COLE AQUI O PRÓXIMO PASSO/COMANDO QUE O AGENTE GEROU]

Regras:
- Mantenha tudo que já está funcionando.
- Altere apenas o necessário para aplicar o ajuste acima.
- Não adicione funcionalidades que não foram pedidas.
- Se algo estiver ambíguo, faça a escolha mais simples possível.`;
  }, [editedName, model]);

  // (Etapas 2 e 4 usam links <a href={LOVABLE_URL}> diretos — não precisa de helper JS.)



  // ===== ETAPA 1 — Dump para o Agente =====
  /** Só copia o dump. Não abre nada. */
  const handleCopyAgentDump = async () => {
    try {
      await navigator.clipboard.writeText(agentPrompt);
      toast.success("Prompt copiado. Agora abra o Agente Arquiteto e cole com Ctrl+V.");
    } catch {
      setAgentFallback(agentPrompt);
    }
  };

  /** Copia o dump e abre o Agente. Se a cópia falhar, mostra fallback (não abre o Agente vazio). */
  const handleOpenAgentWithDump = async () => {
    await copyPromptAndOpenAgent({
      prompt: agentPrompt,
      successMessage:
        "Prompt copiado. O Agente Arquiteto abriu em outra aba. Cole com Ctrl+V para revisar sua ideia.",
      onClipboardFail: (p) => setAgentFallback(p),
    });
  };

  // ===== ETAPA 2 — Lovable =====
  /** Só copia o prompt do Lovable. Não abre o Lovable. */
  const handleCopyLovablePrompt = async () => {
    try {
      await navigator.clipboard.writeText(lovablePrompt);
      toast.success("Prompt copiado. Cole no Lovable para começar a construção.");
    } catch {
      toast.error("Não foi possível copiar. Selecione o texto e copie manualmente (Ctrl+C).");
    }
  };
  // Alias mantido para compatibilidade com a chamada existente no JSX.
  const copyToLovable = handleCopyLovablePrompt;

  // ===== ETAPA 3 — Pós-Lovable =====
  /** Só copia o prompt pós-Lovable. Não abre o Agente. */
  const handleCopyPostLovablePrompt = async () => {
    try {
      await navigator.clipboard.writeText(postLovablePrompt);
      toast.success("Prompt pós-Lovable copiado. Cole no Agente junto com o resultado do Lovable.");
    } catch {
      setAgentFallback(postLovablePrompt);
    }
  };
  // Alias mantido para compatibilidade com a chamada existente no JSX.
  const handleCopyPostLovable = handleCopyPostLovablePrompt;

  /** Copia o prompt pós-Lovable e abre o Agente. Fallback se a cópia falhar. */
  const handleOpenAgentWithPostLovablePrompt = async () => {
    await copyPromptAndOpenAgent({
      prompt: postLovablePrompt,
      successMessage:
        "Prompt pós-Lovable copiado. Cole no Agente junto com o resultado do Lovable.",
      onClipboardFail: (p) => setAgentFallback(p),
    });
  };

  // ===== ETAPA 4 — Próximo prompt Lovable =====
  /** Só copia o próximo prompt para o Lovable. Não abre Lovable. */
  const handleCopyNextLovablePrompt = async () => {
    try {
      await navigator.clipboard.writeText(nextLovablePrompt);
      toast.success("Próximo prompt copiado. Cole no Lovable para aplicar o ajuste.");
    } catch {
      toast.error("Não foi possível copiar. Selecione o texto e copie manualmente (Ctrl+C).");
    }
  };
  // Alias mantido para compatibilidade com a chamada existente no JSX.
  const copyNextLovablePrompt = handleCopyNextLovablePrompt;




  const fillContext = () => {
    setContext(modelToContext(model, editedName));
    toast.success("Contexto preenchido com esta ideia. Você pode editar antes de salvar.");
    setOpen(false);
    openEditor();
  };

  const saveAsNewApp = async () => {
    const ctx = modelToContext(model, editedName);
    const created = await createProject({ name: ctx.appName, context: ctx });
    if (created) {
      toast.success("App criado. Agora os prompts usarão este contexto.");
      setOpen(false);
    } else {
      toast.error("Faça login para salvar este app na sua conta.");
    }
  };

  const useInActiveApp = async () => {
    const ctx = modelToContext(model, editedName);
    setContext(ctx);
    const ok = await saveContextToActiveProject(ctx);
    if (ok) toast.success(`Contexto aplicado a "${activeProject?.name}".`);
    else toast.error("Não foi possível atualizar o app ativo.");
    setConflictOpen(false);
    setOpen(false);
  };

  const onSaveAsNewClick = () => {
    if (activeProject) setConflictOpen(true);
    else void saveAsNewApp();
  };

  return (
    <>
      {/* Card grid */}
      <GlassCard className="p-5 space-y-3 flex flex-col h-full">
        {(model.category || model.badges?.length) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {model.category && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border border-white/10 bg-white/5 text-muted-foreground">
                {model.category}
              </span>
            )}
            {model.badges?.map((b) => {
              const isHero = b === "Mais vendável";
              const isEasy = b === "Fácil no Lovable";
              return (
                <span
                  key={b}
                  className={
                    isHero
                      ? "text-[10px] font-semibold px-2 py-0.5 rounded-md border border-accent/40 bg-accent/15 text-accent"
                      : isEasy
                      ? "text-[10px] font-semibold px-2 py-0.5 rounded-md border border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                      : "text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/15 bg-white/5 text-foreground/80"
                  }
                >
                  {b}
                </span>
              );
            })}
          </div>
        )}
        <h3 className="font-heading font-semibold text-lg">{model.name}</h3>
        {model.shortDescription && (
          <p className="text-xs text-muted-foreground line-clamp-2">{model.shortDescription}</p>
        )}
        <div className="space-y-2 text-sm flex-1">
          <p>
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Público</span>
            <br />
            {model.audience}
          </p>
          <p>
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Dor</span>
            <br />
            {model.pain}
          </p>
          {(model.mvp ?? model.screens)?.length ? (
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wider">MVP</span>
              <ul className="mt-0.5 space-y-0.5">
                {(model.mvp ?? model.screens).slice(0, 3).map((x) => (
                  <li key={x} className="text-xs flex gap-1.5"><span className="text-accent">•</span>{x}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <p>
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Monetização</span>
            <br />
            {model.monetization}
          </p>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setEditedName(model.name);
              setOpen(true);
            }}
            className="flex-1 px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 inline-flex items-center justify-center gap-2 text-sm"
          >
            <Eye size={14} /> Ver plano do app
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setContext(modelToContext(model, model.name));
              setEditedName(model.name);
              setOpen(true);
              toast.success("Ideia selecionada. Abra o plano para revisar com o Agente Arquiteto.");
            }}
            className="flex-1 px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 inline-flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <Sparkles size={14} /> Usar esta ideia
          </button>
        </div>

      </GlassCard>


      {/* Blueprint modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-background border border-white/10 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 p-5 border-b border-white/10 sticky top-0 bg-background z-10">
              <div className="min-w-0 flex-1">
                <div className="text-[11px] uppercase tracking-wider text-accent font-semibold mb-1">
                  Plano inicial do app
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground truncate">
                  {editedName.trim() || model.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Use esta ideia como ponto de partida. Você pode trocar o nome, adaptar o público e transformar isso em um app em construção.
                </p>
                <p className="text-xs text-accent/90 mt-2">
                  Recomendado para iniciantes: revise este plano com o Agente Arquiteto antes de construir. Ele ajuda você a entender, simplificar e melhorar o app.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5 shrink-0"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* ===== Nome editável ===== */}
              <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-4 space-y-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-foreground/90">Nome do app</span>
                  <input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder={model.name}
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                  <span className="block text-[11px] text-muted-foreground">
                    Pode trocar pelo nome que quiser. O prompt usa este nome.
                  </span>
                </label>
                {model.shortDescription && (
                  <p className="text-sm text-foreground/90">{model.shortDescription}</p>
                )}
              </div>

              {/* ===== Fluxo recomendado ===== */}
              <section className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <h4 className="font-heading font-semibold text-sm text-foreground">Fluxo recomendado</h4>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Agente → Lovable → Agente → Lovable ajusta</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-2 lg:gap-1 items-stretch">
                  {/* Step 1 */}
                  <div className="rounded-xl border border-cyan-400/40 bg-cyan-500/[0.06] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-cyan-300 font-semibold mb-1">Etapa 1 · Agente</div>
                    <div className="font-heading font-semibold text-sm text-foreground">Agente revisa</div>
                    <p className="text-[11.5px] text-foreground/70 mt-1 leading-snug">
                      Cole o prompt completo no Agente para revisar MVP, telas e banco antes de construir.
                    </p>
                  </div>
                  <ArrowRight size={16} className="hidden lg:block self-center text-muted-foreground" />
                  {/* Step 2 */}
                  <div className="rounded-xl border border-accent/40 bg-accent/[0.06] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-accent font-semibold mb-1">Etapa 2 · Lovable</div>
                    <div className="font-heading font-semibold text-sm text-foreground">Lovable constrói</div>
                    <p className="text-[11.5px] text-foreground/70 mt-1 leading-snug">
                      Copie o prompt de construção e cole no Lovable para gerar a primeira versão do app.
                    </p>
                  </div>
                  <ArrowRight size={16} className="hidden lg:block self-center text-muted-foreground" />
                  {/* Step 3 */}
                  <div className="rounded-xl border border-amber-300/40 bg-amber-300/[0.06] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-amber-200 font-semibold mb-1">Etapa 3 · Agente</div>
                    <div className="font-heading font-semibold text-sm text-foreground">Agente analisa o resultado</div>
                    <p className="text-[11.5px] text-foreground/70 mt-1 leading-snug">
                      Cole no Agente o resultado que o Lovable retornou. Ele aponta o que falta e gera o próximo comando.
                    </p>
                  </div>
                  <ArrowRight size={16} className="hidden lg:block self-center text-muted-foreground" />
                  {/* Step 4 */}
                  <div className="rounded-xl border border-[#0EA5E9]/40 bg-[#0EA5E9]/[0.06] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-[#7DD3FC] font-semibold mb-1">Etapa 4 · Lovable</div>
                    <div className="font-heading font-semibold text-sm text-foreground">Aplicar ajuste no Lovable</div>
                    <p className="text-[11.5px] text-foreground/70 mt-1 leading-snug">
                      Volte ao Lovable e cole o próximo prompt gerado pelo Agente. O ciclo se repete até o app ficar pronto.
                    </p>
                  </div>
                </div>
              </section>



              {/* ===== Etapa 1 · Dump para o Agente — Premium Card ===== */}
              <section
                className="relative overflow-hidden rounded-[20px] border border-cyan-400/50 p-4 sm:p-6 space-y-4 shadow-[0_0_50px_-12px_rgba(34,211,238,0.45)]"
                style={{ background: "linear-gradient(135deg, #07111F 0%, #0B1220 100%)" }}
              >
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="relative flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-md border border-cyan-400/40 bg-cyan-500/15 text-cyan-300 font-bold mb-2">
                      <Bot size={11} /> Etapa 1 · Agente
                    </div>
                    <h4 className="font-heading font-bold text-xl sm:text-2xl text-foreground leading-tight">
                      Prompt para o Agente Arquiteto
                    </h4>
                    <p className="text-sm text-foreground/80 mt-1.5">
                      Copie este prompt e cole no Agente Arquiteto para revisar sua ideia antes de construir.
                    </p>
                    <p className="text-[12px] text-foreground/60 mt-1 leading-snug">
                      Este prompt reúne nome, público, dor, MVP, telas, banco de dados, monetização e regras de construção.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 shrink-0 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 font-semibold">
                    <Check size={10} /> Pronto para copiar
                  </span>
                </div>

                {/* Sticky action bar */}
                <div className="relative flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAgentDump}
                    className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold hover:from-cyan-400 hover:to-blue-500 transition shadow-[0_8px_24px_-8px_rgba(34,211,238,0.6)]"
                  >
                    <Copy size={16} /> Copiar prompt para o Agente
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAgentWithDump}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-cyan-400/30 bg-cyan-500/[0.06] text-cyan-200 hover:bg-cyan-500/15 text-sm font-semibold"
                  >
                    <ExternalLink size={14} /> Abrir Agente
                  </button>
                </div>
                <p className="relative text-[11.5px] text-foreground/60 leading-snug -mt-1">
                  O ChatGPT não cola o texto automaticamente. Primeiro copie o prompt, depois cole no Agente com Ctrl+V. Ao clicar em <span className="text-cyan-300">“Abrir Agente”</span>, o prompt é copiado antes de abrir.
                </p>


                {/* Prompt body */}
                <div
                  className="relative rounded-xl border border-cyan-400/20 overflow-hidden"
                  style={{ background: "#020817" }}
                >
                  <textarea
                    readOnly
                    value={agentPrompt}
                    onFocus={(e) => e.currentTarget.select()}
                    spellCheck={false}
                    style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
                    className="scrollbar-prompt w-full h-72 sm:h-80 bg-transparent p-5 sm:p-6 text-[13px] sm:text-[14px] text-[#F8FAFC] leading-[1.7] resize-y outline-none focus:ring-2 focus:ring-cyan-400/40 whitespace-pre-wrap"
                  />
                </div>

                {/* Footer */}
                <div className="relative flex flex-wrap items-center justify-between gap-2 text-[11px] text-foreground/60">
                  <span>Este é o prompt de revisão inicial.</span>
                  <span className="font-mono">{agentPrompt.length.toLocaleString("pt-BR")} caracteres</span>
                </div>
              </section>

              {/* ===== Etapa 2 · Lovable — Premium Card ===== */}
              <section
                className="relative overflow-hidden rounded-[20px] border-2 border-[#0EA5E9] p-4 sm:p-6 space-y-4 shadow-[0_0_50px_-12px_rgba(14,165,233,0.55)]"
                style={{ background: "linear-gradient(135deg, #07111F 0%, #0B1220 100%)" }}
              >
                <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-[#0EA5E9]/20 blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="relative flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-md border border-[#0EA5E9]/50 bg-[#0EA5E9]/15 text-[#7DD3FC] font-bold mb-2">
                      <Sparkles size={11} /> Etapa 2 · Lovable
                    </div>
                    <h4 className="font-heading font-bold text-xl sm:text-2xl text-foreground leading-tight">
                      Prompt pronto para colar no Lovable
                    </h4>
                    <p className="text-sm text-foreground/80 mt-1.5">
                      Copie este comando exatamente como está e cole no Lovable para começar a construção do app.
                    </p>
                    <p className="text-[12px] text-foreground/60 mt-1 leading-snug">
                      Use este prompt somente depois de revisar a ideia com o Agente na Etapa 1.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 shrink-0 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 font-semibold">
                    <Check size={10} /> Pronto para copiar
                  </span>
                </div>

                {/* Sticky action bar */}
                <div className="relative flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={copyToLovable}
                    className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#22D3EE] text-white text-sm font-bold hover:opacity-90 transition shadow-[0_8px_24px_-8px_rgba(14,165,233,0.7)]"
                  >
                    <Copy size={16} /> Copiar prompt para o Lovable
                  </button>
                  <a
                    href={LOVABLE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#0EA5E9]/40 bg-[#0EA5E9]/[0.08] text-[#7DD3FC] hover:bg-[#0EA5E9]/15 text-sm font-semibold"
                  >
                    <ExternalLink size={14} /> Abrir Lovable
                  </a>
                </div>

                {/* Prompt body — uses EditablePromptBox so o usuário pode editar antes de copiar */}
                <div
                  className="relative rounded-xl border border-[#0EA5E9]/25 p-1 overflow-hidden"
                  style={{ background: "#020817" }}
                >
                  <div className="rounded-lg p-3 sm:p-4 scrollbar-prompt">
                    <EditablePromptBox
                      saveSourceModule="ideias"
                      originalPrompt={lovablePrompt}
                      storageKey={`appmodel_prompt__${model.name}`}
                      copyLabel="Copiar prompt para o Lovable"
                      hideCopyButton
                      hideSaveButton
                      helperText="Você pode editar antes de copiar. O comando final será o texto desta caixa."
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="relative flex flex-wrap items-center justify-between gap-2 text-[11px] text-foreground/60">
                  <span>Este é o comando de construção inicial.</span>
                  <span className="font-mono">{lovablePrompt.length.toLocaleString("pt-BR")} caracteres</span>
                </div>
              </section>

              {/* ===== Etapa 3 · Revisão pós-Lovable — Premium Card ===== */}
              <section
                className="relative overflow-hidden rounded-[20px] border border-amber-300/40 p-4 sm:p-6 space-y-4 shadow-[0_0_40px_-12px_rgba(251,191,36,0.25)]"
                style={{ background: "linear-gradient(135deg, #0B1220 0%, #111827 100%)" }}
              >
                <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-amber-300/10 blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="relative flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-md border border-amber-300/40 bg-amber-300/15 text-amber-200 font-bold mb-2">
                      <Bot size={11} /> Etapa 3 · Agente
                    </div>
                    <h4 className="font-heading font-bold text-xl sm:text-2xl text-foreground leading-tight">
                      Revisar o resultado do Lovable
                    </h4>
                    <p className="text-sm text-foreground/80 mt-1.5">
                      Quando o Lovable terminar, copie a resposta dele e volte ao Agente. Este prompt analisa o que foi criado, aponta problemas e gera o próximo comando para o Lovable.
                    </p>
                  </div>
                </div>

                {/* Sticky action bar */}
                <div className="relative flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCopyPostLovable}
                    className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-[#0B1220] text-sm font-bold hover:opacity-90 transition shadow-[0_8px_24px_-8px_rgba(251,191,36,0.55)]"
                  >
                    <Copy size={16} /> Copiar revisão pós-Lovable
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAgentWithPostLovablePrompt}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-amber-300/40 bg-amber-300/[0.08] text-amber-200 hover:bg-amber-300/15 text-sm font-semibold"
                  >
                    <ExternalLink size={14} /> Voltar ao Agente
                  </button>
                </div>

                {/* Prompt body */}
                <details
                  className="relative rounded-xl border border-amber-300/20 overflow-hidden group"
                  style={{ background: "#020817" }}
                >
                  <summary className="cursor-pointer list-none px-4 py-3 text-[11px] uppercase tracking-wider text-amber-200/80 hover:text-amber-200 transition flex items-center gap-2">
                    <ChevronDown size={12} className="transition group-open:rotate-180" />
                    Ver prompt completo
                  </summary>
                  <textarea
                    readOnly
                    value={postLovablePrompt}
                    onFocus={(e) => e.currentTarget.select()}
                    spellCheck={false}
                    style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
                    className="scrollbar-prompt w-full h-64 bg-transparent p-5 sm:p-6 text-[13px] sm:text-[14px] text-[#F8FAFC] leading-[1.7] resize-y outline-none focus:ring-2 focus:ring-amber-300/40 whitespace-pre-wrap border-t border-amber-300/15"
                  />
                </details>

                {/* Footer */}
                <div className="relative flex flex-wrap items-center justify-between gap-2 text-[11px] text-foreground/60">
                  <span>Cole junto com o resultado que o Lovable retornou.</span>
                  <span className="font-mono">{postLovablePrompt.length.toLocaleString("pt-BR")} caracteres</span>
                </div>
              </section>

              {/* ===== Etapa 4 · Aplicar ajuste no Lovable — Premium Card ===== */}
              <section
                className="relative overflow-hidden rounded-[20px] border-2 border-[#0EA5E9]/70 p-4 sm:p-6 space-y-4 shadow-[0_0_40px_-12px_rgba(14,165,233,0.45)]"
                style={{ background: "linear-gradient(135deg, #07111F 0%, #0B1220 100%)" }}
              >
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#0EA5E9]/15 blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="relative flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-md border border-[#0EA5E9]/50 bg-[#0EA5E9]/15 text-[#7DD3FC] font-bold mb-2">
                      <Sparkles size={11} /> Etapa 4 · Lovable
                    </div>
                    <h4 className="font-heading font-bold text-xl sm:text-2xl text-foreground leading-tight">
                      Aplicar ajuste no Lovable
                    </h4>
                    <p className="text-sm text-foreground/80 mt-1.5">
                      Cole no Lovable o próximo prompt gerado pelo Agente para corrigir, melhorar ou continuar a construção do app.
                    </p>
                    <p className="text-[12px] text-foreground/60 mt-1 leading-snug">
                      O ciclo Agente → Lovable se repete até o app ficar pronto. Troque o trecho entre colchetes pelo texto que o Agente respondeu.
                    </p>
                  </div>
                </div>

                {/* Sticky action bar */}
                <div className="relative flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={copyNextLovablePrompt}
                    className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#22D3EE] text-white text-sm font-bold hover:opacity-90 transition shadow-[0_8px_24px_-8px_rgba(14,165,233,0.7)]"
                  >
                    <Copy size={16} /> Copiar próximo prompt para o Lovable
                  </button>
                  <a
                    href={LOVABLE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#0EA5E9]/40 bg-[#0EA5E9]/[0.08] text-[#7DD3FC] hover:bg-[#0EA5E9]/15 text-sm font-semibold"
                  >
                    <ExternalLink size={14} /> Abrir Lovable
                  </a>
                </div>

                {/* Prompt body */}
                <details
                  className="relative rounded-xl border border-[#0EA5E9]/25 overflow-hidden group"
                  style={{ background: "#020817" }}
                >
                  <summary className="cursor-pointer list-none px-4 py-3 text-[11px] uppercase tracking-wider text-[#7DD3FC]/80 hover:text-[#7DD3FC] transition flex items-center gap-2">
                    <ChevronDown size={12} className="transition group-open:rotate-180" />
                    Ver template do próximo prompt
                  </summary>
                  <textarea
                    readOnly
                    value={nextLovablePrompt}
                    onFocus={(e) => e.currentTarget.select()}
                    spellCheck={false}
                    style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
                    className="scrollbar-prompt w-full h-56 bg-transparent p-5 sm:p-6 text-[13px] sm:text-[14px] text-[#F8FAFC] leading-[1.7] resize-y outline-none focus:ring-2 focus:ring-[#0EA5E9]/40 whitespace-pre-wrap border-t border-[#0EA5E9]/15"
                  />
                </details>

                {/* Footer */}
                <div className="relative flex flex-wrap items-center justify-between gap-2 text-[11px] text-foreground/60">
                  <span>Use sempre que o Agente devolver um próximo passo.</span>
                  <span className="font-mono">{nextLovablePrompt.length.toLocaleString("pt-BR")} caracteres</span>
                </div>
              </section>




              {/* ===== Ações avançadas (Usar esta ideia) ===== */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                <button
                  type="button"
                  onClick={() => setActionsOpen((s) => !s)}
                  className="w-full inline-flex items-center justify-between gap-2 text-sm font-semibold text-foreground/90"
                >
                  <span className="inline-flex items-center gap-2">
                    <Sparkles size={14} className="text-accent" /> Usar esta ideia como meu app
                  </span>
                  <ChevronDown size={14} className={actionsOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                </button>
                {actionsOpen && (
                  <div className="grid sm:grid-cols-3 gap-2 pt-2">
                    <button onClick={onSaveAsNewClick} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 text-xs">
                      <FolderPlus size={13} /> Salvar como novo app
                    </button>
                    <button onClick={fillContext} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 text-xs">
                      <ClipboardEdit size={13} /> Preencher Contexto do app
                    </button>
                    <button onClick={() => setPromptOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 text-xs">
                      <Wand2 size={13} /> Abrir no Estúdio de Prompt
                    </button>
                  </div>
                )}
              </div>

              {/* ===== Detalhes do plano ===== */}
              <div className="grid sm:grid-cols-2 gap-3">
                <InfoCard label="Público">{model.audience}</InfoCard>
                <InfoCard label="Dor">{model.pain}</InfoCard>
                {model.promise && <InfoCard label="Promessa">{model.promise}</InfoCard>}
                <InfoCard label="Monetização">{model.monetization}</InfoCard>
                {model.expectedResult && (
                  <InfoCard label="Resultado esperado">{model.expectedResult}</InfoCard>
                )}
                {model.mainAction && <InfoCard label="Ação principal">{model.mainAction}</InfoCard>}
              </div>

              {/* MVP */}
              <section className="space-y-2">
                <SectionTitle>MVP inicial</SectionTitle>
                <ul className="space-y-1.5 text-sm">
                  {(model.mvp ?? model.screens).slice(0, 5).map((x) => (
                    <li key={x} className="flex gap-2"><span className="text-accent">•</span>{x}</li>
                  ))}
                </ul>
                {model.cutFromFirst?.length ? (
                  <div className="rounded-lg border border-rose-500/20 bg-rose-500/[0.06] p-3 text-xs text-rose-100/90">
                    <div className="font-semibold mb-1">Fica fora da primeira versão</div>
                    <ul className="space-y-0.5">
                      {model.cutFromFirst.map((c) => (
                        <li key={c}>— {c}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>

              {/* Telas */}
              <section className="space-y-2">
                <SectionTitle>Telas do app</SectionTitle>
                {model.screensWithRole?.length ? (
                  <ul className="space-y-1.5 text-sm">
                    {model.screensWithRole.map((s) => (
                      <li key={s.name}>
                        <span className="font-semibold">{s.name}</span>
                        <span className="text-muted-foreground"> — {s.role}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-1.5 text-sm">
                    {model.screens.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Banco */}
              <section className="space-y-2">
                <SectionTitle>Banco e estrutura</SectionTitle>
                <ul className="flex flex-wrap gap-2 text-xs">
                  {model.database.map((d) => (
                    <li key={d} className="px-2 py-1 rounded-md border border-white/10 bg-white/5">
                      {d}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Vendas */}
              <section className="space-y-2">
                <SectionTitle>Como vender esse app</SectionTitle>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <InfoCard label="Modelo de cobrança">{model.monetization}</InfoCard>
                  {model.buyerPersona && <InfoCard label="Público comprador">{model.buyerPersona}</InfoCard>}
                  {model.validationTest && (
                    <InfoCard label="Primeiro teste de validação">{model.validationTest}</InfoCard>
                  )}
                  {model.differentiator && <InfoCard label="Diferencial">{model.differentiator}</InfoCard>}
                </div>
              </section>

              {/* Riscos + testar */}
              {(model.risks?.length || model.testFirst?.length) && (
                <section className="grid sm:grid-cols-2 gap-3">
                  {model.risks?.length ? (
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] p-3 text-xs">
                      <div className="text-[10px] uppercase tracking-wider text-amber-200/90 mb-1 font-semibold">
                        Riscos do projeto
                      </div>
                      <ul className="space-y-0.5">
                        {model.risks.map((r) => (
                          <li key={r}>— {r}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {model.testFirst?.length ? (
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] p-3 text-xs">
                      <div className="text-[10px] uppercase tracking-wider text-emerald-200/90 mb-1 font-semibold">
                        O que testar primeiro
                      </div>
                      <ul className="space-y-0.5">
                        {model.testFirst.map((r) => (
                          <li key={r}>— {r}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </section>
              )}




              {/* Checklist (legado) */}
              {model.checklist?.length ? (
                <section className="space-y-2">
                  <SectionTitle>Checklist de teste</SectionTitle>
                  <ul className="space-y-1.5 text-sm">
                    {model.checklist.map((c) => (
                      <li key={c} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Conflict dialog when there's an active app */}
      {conflictOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setConflictOpen(false)}
        >
          <div
            className="bg-background border border-white/10 rounded-2xl max-w-md w-full p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-heading font-bold text-lg">Você já tem um app ativo</h4>
            <p className="text-sm text-muted-foreground">
              Deseja criar um novo app com esta ideia ou substituir o contexto de
              <span className="text-foreground font-semibold"> "{activeProject?.name}"</span>?
            </p>
            <div className="flex flex-wrap gap-2 justify-end">
              <button onClick={() => setConflictOpen(false)} className="px-3 py-1.5 rounded-md border border-white/15 hover:bg-white/5 text-xs">
                Cancelar
              </button>
              <button onClick={useInActiveApp} className="px-3 py-1.5 rounded-md border border-white/15 hover:bg-white/5 text-xs">
                Usar no app ativo
              </button>
              <button onClick={() => { setConflictOpen(false); void saveAsNewApp(); }} className="px-3 py-1.5 rounded-md border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 text-xs font-semibold">
                Criar novo app
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt studio (Estúdio de Prompt) — reusa o dialog existente */}
      <PromptReviewDialog
        open={promptOpen}
        onClose={() => setPromptOpen(false)}
        stepName={`Ideia: ${editedName.trim() || model.name}`}
        stepObjective="Transformar esta ideia em primeiro prompt forte para o Lovable."
        customPrompts={{ lovable: lovablePrompt, agent: agentPrompt }}
      />

      {/* Fallback do Agente Arquiteto: clipboard bloqueado */}
      {agentFallback && (
        <div
          className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setAgentFallback(null)}
        >
          <div
            className="bg-background border border-white/10 rounded-2xl max-w-xl w-full p-5 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-heading font-bold text-lg">Copie manualmente o prompt</h4>
            <p className="text-xs text-muted-foreground">
              Não foi possível copiar automaticamente. Copie o prompt abaixo e cole no Agente Arquiteto.
            </p>
            <textarea
              readOnly
              value={agentFallback}
              className="w-full h-64 rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-foreground font-mono"
              onFocus={(e) => e.currentTarget.select()}
            />
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(agentFallback);
                    toast.success("Prompt copiado.");
                  } catch {
                    toast.error("Selecione o texto e copie manualmente (Ctrl+C).");
                  }
                }}
                className="px-3 py-1.5 rounded-md border border-white/15 hover:bg-white/5 text-xs"
              >
                Copiar manualmente
              </button>
              <a
                href={AGENTE_ARQUITETO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 text-xs font-semibold"
              >
                Abrir Agente Arquiteto
              </a>
              <button
                onClick={() => setAgentFallback(null)}
                className="px-3 py-1.5 rounded-md border border-white/15 hover:bg-white/5 text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

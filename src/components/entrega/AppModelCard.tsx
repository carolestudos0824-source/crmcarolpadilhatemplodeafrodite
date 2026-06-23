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
} from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/GlassCard";
import type { AppModel } from "@/data/entregaModules";
import { useProjectContext, EMPTY_PROJECT_CONTEXT, type ProjectContext } from "@/hooks/useProjectContext";
import { useAppProjects } from "@/hooks/useAppProjects";
import { PromptReviewDialog } from "@/components/entrega/PromptReviewDialog";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import { AGENTE_ARQUITETO_URL, openAgenteArquiteto } from "@/lib/agenteArquiteto";


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
  return `Estou usando a Fábrica de Apps com IA como guia para criar meu próprio aplicativo no Lovable.

A Fábrica é apenas o programa-guia. O app que deve ser criado é este projeto atual no Lovable.

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

  const copyToLovable = async () => {
    try {
      await navigator.clipboard.writeText(lovablePrompt);
      toast.success("Prompt copiado. Agora cole no Lovable para começar seu app.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const handleReviewWithAgent = async () => {
    try {
      await navigator.clipboard.writeText(agentPrompt);
      openAgenteArquiteto();
      toast.success(
        "Tudo pronto. O prompt foi copiado e o Agente Arquiteto abriu em outra aba. Cole lá para revisar, tirar dúvidas e melhorar seu app antes de construir.",
      );
    } catch {
      setAgentFallback(agentPrompt);
    }
  };

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
            onClick={() => {
              setEditedName(model.name);
              setOpen(true);
            }}
            className="flex-1 px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 inline-flex items-center justify-center gap-2 text-sm"
          >
            <Eye size={14} /> Ver plano do app
          </button>
          <button
            onClick={() => {
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
              {/* Editable name + main action */}
              <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-4 space-y-3">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-foreground/90">Nome do app</span>
                  <input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder={model.name}
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                  <span className="block text-[11px] text-muted-foreground">
                    Este nome é apenas uma sugestão. Você pode trocar pelo nome que quiser. O prompt e o app salvo usam o nome editado.
                  </span>
                </label>
                {model.shortDescription && (
                  <p className="text-sm text-foreground/90">{model.shortDescription}</p>
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => setActionsOpen((s) => !s)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 text-sm font-semibold"
                  >
                    <Sparkles size={14} /> Usar esta ideia
                    <ChevronDown size={14} className={actionsOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                  </button>
                </div>

                {actionsOpen && (
                  <div className="grid sm:grid-cols-2 gap-2 pt-2">
                    <button onClick={onSaveAsNewClick} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 text-xs">
                      <FolderPlus size={13} /> Salvar como novo app
                    </button>
                    <button onClick={fillContext} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 text-xs">
                      <ClipboardEdit size={13} /> Preencher Contexto do meu app
                    </button>
                    <button onClick={() => setPromptOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 text-xs">
                      <Wand2 size={13} /> Abrir no Estúdio de Prompt
                    </button>
                    <button onClick={handleReviewWithAgent} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 text-xs font-semibold">
                      <Bot size={13} /> Revisar com Agente Arquiteto
                    </button>
                    <button onClick={copyToLovable} className="sm:col-span-2 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 text-xs font-semibold">
                      <Copy size={13} /> Copiar para o Lovable
                    </button>
                  </div>
                )}
              </div>

              {/* Primary cards */}
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

              {/* Prompt inicial */}
              <section className="space-y-2">
                <SectionTitle>Primeiro prompt para o Lovable</SectionTitle>
                <EditablePromptBox
                  saveSourceModule="ideias"
                  originalPrompt={lovablePrompt}
                  storageKey={`appmodel_prompt__${model.name}`}
                  copyLabel="Copiar prompt para o Lovable"
                  helperText="Cole no Lovable como primeiro prompt do app."
                />
                <p className="text-[11px] text-muted-foreground">
                  Fluxo recomendado: revise com o Agente Arquiteto, ajuste o plano e depois copie para o Lovable.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleReviewWithAgent}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 text-xs font-semibold"
                  >
                    <Bot size={13} /> Revisar com Agente Arquiteto
                  </button>
                  <button
                    onClick={copyToLovable}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 text-xs font-semibold"
                  >
                    <Copy size={13} /> Copiar prompt para o Lovable
                  </button>
                  <button
                    onClick={() => setPromptOpen(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 text-xs"
                  >
                    <Wand2 size={13} /> Melhorar texto do prompt
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  As ideias prontas são pontos de partida. Você pode adaptar tudo antes de mandar ao Lovable. Comece simples: o primeiro app precisa validar a ideia, não ter todas as funções do mundo.
                </p>
              </section>


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
              Não foi possível copiar automaticamente. Copie o texto abaixo e cole no Agente Arquiteto.
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

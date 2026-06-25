import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useProjectJourney } from "@/lib/journey";
import {
  Sparkles,
  Lightbulb,
  Hammer,
  Lock,
  Megaphone,
  ShoppingCart,
  Search,
  Rocket,
  Image as ImageIcon,
  Users,
  ListChecks,
  ClipboardList,
  Workflow,
  AlertTriangle,
  Gift,
  DollarSign,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Copy,
  CheckCircle2,
  Circle,
  LifeBuoy,
  Loader2,
  ChevronDown,
  BookOpen,
  Map as MapIcon,
  Globe,
  Scale,
  BarChart3,
  GitBranch,
  ClipboardCheck,
  Compass,
  FolderKanban,
  Bookmark,
  Repeat,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { GiftCodeRedemption } from "@/components/GiftCodeRedemption";
import { FontSizeControl } from "@/components/FontSizeControl";
import { CommandCard } from "@/components/entrega/CommandCard";
import { CopyCommandWarning, BeforeAdvanceTip } from "@/components/entrega/CopyCommandWarning";
import { AppModelCard } from "@/components/entrega/AppModelCard";
import { IdeiasProntasModule } from "@/components/entrega/IdeiasProntasModule";
import { CampaignsModule } from "@/components/entrega/CampaignsModule";
import { MonetizacaoIntro, FaixasReferencia } from "@/components/entrega/MonetizacaoModule";
import { FundamentosModule } from "@/components/entrega/FundamentosModule";
import { PlanejarModule } from "@/components/entrega/PlanejarModule";
import { MvpArquiteturaModule } from "@/components/entrega/MvpArquiteturaModule";
import { TelasFluxoModule } from "@/components/entrega/TelasFluxoModule";
import { PublicarDominioModule } from "@/components/entrega/PublicarDominioModule";
import { TesteFinalModule } from "@/components/entrega/TesteFinalModule";
import { LegalConfiancaModule } from "@/components/entrega/LegalConfiancaModule";
import { SegurancaAppModule } from "@/components/entrega/SegurancaAppModule";
import { ModuleReviewCard } from "@/components/entrega/ModuleReviewCard";
import { GpsDoAppCard } from "@/components/entrega/GpsDoAppCard";
import { ArquitetoMelhoriasCard } from "@/components/entrega/ArquitetoMelhoriasCard";
import { MetricasAppModule } from "@/components/entrega/MetricasAppModule";
import { MelhoriasVersoesModule } from "@/components/entrega/MelhoriasVersoesModule";
import { ViabilityAnalysisCard } from "@/components/entrega/ViabilityAnalysisCard";
import { JourneyStartGuide } from "@/components/entrega/JourneyStartGuide";
import { PainSearchNextStep } from "@/components/entrega/PainSearchNextStep";
import { FirstAppOnboarding } from "@/components/entrega/FirstAppOnboarding";
import { AgentArchitectCard } from "@/components/entrega/AgentArchitectCard";
import { openAgenteArquiteto, copyPromptAndOpenAgent } from "@/lib/agenteArquiteto";
import { Bot } from "lucide-react";
import { clearSession } from "@/lib/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { UserProgressProvider, useUserProgress } from "@/hooks/useUserProgress";
import { ProjectContextProvider, useProjectContext } from "@/hooks/useProjectContext";
import { wrapErrorCorrection } from "@/lib/promptBuilder";
import { ProjectContextDrawer } from "@/components/entrega/ProjectContextDrawer";
import { AppProjectsProvider, useAppProjects } from "@/hooks/useAppProjects";
import { MyAppsDrawer } from "@/components/entrega/MyAppsDrawer";
// ProjectStatusBanner desativado em /entrega para evitar duplicidade com o EstadoAtualDoProjetoCard.
import { EstadoAtualDoProjetoCard } from "@/components/entrega/EstadoAtualDoProjetoCard";
import { ProjectJourneySelector } from "@/components/entrega/ProjectJourneySelector";
import { RecommendedModuleHint } from "@/components/entrega/RecommendedModuleHint";
import { AgentChatProvider } from "@/components/entrega/AgentChatProvider";
import { AgentChatDrawer } from "@/components/entrega/AgentChatDrawer";
import { ComeceAquiModule } from "@/components/entrega/ComeceAquiModule";
import { SavedPromptsDrawer } from "@/components/entrega/SavedPromptsDrawer";
import { TwoPathsExplainer } from "@/components/entrega/TwoPathsExplainer";
import { APP_CONFIG } from "@/config/appConfig";
import { openSupportEmail } from "@/lib/openLink";
import {
  MODULES,
  MODULE_ORDER,
  type ModuleId,
  APP_MODELS,
  COMMANDS_CONSTRUIR,
  COMMANDS_LOGIN,
  COMMANDS_VENDA,
  COMMANDS_MONETIZACAO,
  COMMANDS_CHECKOUT,
  COMMANDS_SEO,
  COMMANDS_CAMPANHAS,
  COMMANDS_CRIATIVOS,
  COMMANDS_VALIDACAO,
  COMMON_ERRORS,
  CHECKLIST_PHASES,
  MODULE_HINTS,
  type Command,

} from "@/data/entregaModules";

const LOVABLE_URL = "https://lovable.dev";
// Total de comandos disponíveis em todos os módulos (usado no progresso ponderado).
const TOTAL_COMMANDS =
  COMMANDS_CONSTRUIR.length +
  COMMANDS_LOGIN.length +
  COMMANDS_VENDA.length +
  COMMANDS_MONETIZACAO.length +
  COMMANDS_CHECKOUT.length +
  COMMANDS_SEO.length +
  COMMANDS_CAMPANHAS.length +
  COMMANDS_CRIATIVOS.length +
  COMMANDS_VALIDACAO.length;

const ICONS: Record<string, typeof Sparkles> = {
  Sparkles, Lightbulb, Hammer, Lock, Megaphone, ShoppingCart, Search,
  Rocket, Image: ImageIcon, Users, ListChecks, AlertTriangle, Gift, DollarSign, BookOpen, ClipboardList, Workflow, Map: MapIcon, Globe, ShieldCheck, Scale, BarChart3, GitBranch, ClipboardCheck,
};

// Módulos contabilizados no progresso global. Inclui os 23 módulos da jornada
// oficial — os 8 módulos novos (planejar, mvp, telas, legal, publicar, teste,
// metricas, melhorias) também contam e são marcados como concluídos
// automaticamente quando todos os itens do checklist interno do módulo são
// marcados (ver AUTO_MODULE_CHECKLIST abaixo).
const PROGRESS_MODULE_IDS: ModuleId[] = [...MODULE_ORDER];

// Para cada módulo novo, número de itens do checklist interno. Quando todos os
// itens estiverem marcados em `progress.checklist`, o módulo é considerado
// concluído no progresso global, sem precisar de botão manual.
const AUTO_MODULE_CHECKLIST: { id: ModuleId; prefix: string; total: number }[] = [
  { id: "planejar", prefix: "planejar_step__", total: 6 },
  { id: "mvp", prefix: "mvp_step__", total: 7 },
  { id: "telas", prefix: "telas_step__", total: 7 },
  { id: "legal", prefix: "legal_step__", total: 10 },
  { id: "publicar", prefix: "publicar_step__", total: 10 },
  { id: "teste", prefix: "teste_step__", total: 12 },
  { id: "metricas", prefix: "metricas_step__", total: 10 },
  { id: "melhorias", prefix: "melhorias_step__", total: 10 },
  { id: "seguranca", prefix: "seguranca_step__", total: 12 },
];

// Organização visual dos 24 módulos por fase da jornada. NÃO altera
// MODULE_ORDER nem PROGRESS_MODULE_IDS (progresso global preservado), apenas
// agrupa os módulos existentes no painel lateral.
const SIDEBAR_GROUPS: { title: string; modules: ModuleId[] }[] = [
  { title: "Comece aqui", modules: ["comece", "ideias", "planejar", "mvp", "telas"] },
  { title: "Construir", modules: ["fundamentos", "construir", "login", "seguranca", "teste", "erros"] },
  { title: "Validar e vender", modules: ["validacao", "monetizacao", "venda", "checkout", "legal", "publicar"] },
  { title: "Crescer", modules: ["seo", "campanhas", "criativos", "metricas", "melhorias", "checklist", "ativar"] },
];

const SIDEBAR_STATUS_LABEL: Record<string, string> = {
  ideia: "Ideia",
  planejando: "Planejando",
  construindo: "Construindo",
  revisando: "Revisando",
  publicado: "Publicado",
  vendendo: "Vendendo",
  escalando: "Escalando",
  pausado: "Pausado",
  arquivado: "Arquivado",
};


// ====== Página ======

const ContextHeaderButton = () => {
  const { openEditor, isFilled } = useProjectContext();
  return (
    <button
      type="button"
      onClick={openEditor}
      className={`px-3 py-1.5 rounded-full border inline-flex items-center gap-1 ${
        isFilled
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
          : "border-amber-400/30 bg-amber-400/10 text-amber-200"
      }`}
      title="Contexto do projeto em foco"
    >
      <ClipboardList size={12} />
      <span className="hidden sm:inline">Contexto do projeto em foco</span>
      <span className="sm:hidden">Contexto</span>
    </button>
  );
};

const MyAppsHeaderButton = () => {
  const { openDrawer, activeProject, projects } = useAppProjects();
  const label = activeProject ? `Projeto: ${activeProject.name}` : "Projetos em construção";
  return (
    <button
      type="button"
      onClick={openDrawer}
      className="px-3 py-1.5 rounded-full border border-accent/40 bg-accent/10 text-accent inline-flex items-center gap-1 max-w-[220px]"
      title="Projetos em construção"
    >
      <span className="truncate">{label}</span>
      {projects.length > 0 && (
        <span className="text-[10px] opacity-70">({projects.length})</span>
      )}
    </button>
  );
};


function EntregaInner() {
  const navigate = useNavigate();
  const auth = useAuthState();
  const progress = useUserProgress();
  const appProjects = useAppProjects();
  const projectCtx = useProjectContext();
  const [journey] = useProjectJourney(appProjects.activeProject?.id ?? null);
  const [searchParams, setSearchParams] = useSearchParams();

  // URL slug ↔ internal module id
  const SLUG_TO_ID: Record<string, ModuleId> = {
    "comece-pelo-lovable": "fundamentos",
    "comece-aqui": "comece",
    "ideias-prontas": "ideias",
    "planejar-app": "planejar",
    "mvp-arquitetura": "mvp",
    "telas-fluxo": "telas",
    "construir-app": "construir",
    "login-banco": "login",
    "seguranca-app": "seguranca",
    "pagina-de-venda": "venda",
    "monetizacao": "monetizacao",
    "checkout-entrega": "checkout",
    "legal-confianca": "legal",
    "publicar-dominio": "publicar",
    "teste-final": "teste",
    "seo-geo": "seo",
    "campanhas": "campanhas",
    "criativos": "criativos",
    "metricas-app": "metricas",
    "validacao": "validacao",
    "melhorias-versoes": "melhorias",
    "checklist": "checklist",
    "painel-prontidao": "checklist",
    "erros-comuns": "erros",
    "ativar-acesso": "ativar",
  };
  const ID_TO_SLUG: Record<ModuleId, string> = Object.fromEntries(
    Object.entries(SLUG_TO_ID).map(([k, v]) => [v, k]),
  ) as Record<ModuleId, string>;

  const resolveModulo = (p: string | null): ModuleId => {
    if (!p) return "comece";
    if (SLUG_TO_ID[p]) return SLUG_TO_ID[p];
    if ((MODULE_ORDER as string[]).includes(p)) return p as ModuleId;
    return "comece";
  };

  const [active, setActiveState] = useState<ModuleId>(() =>
    resolveModulo(searchParams.get("modulo")),
  );

  // Sync active when URL ?modulo changes
  useEffect(() => {
    setActiveState(resolveModulo(searchParams.get("modulo")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Propagate active to persisted progress
  useEffect(() => {
    progress.setActive(active);
    // Save current module in the active app project (no-op if no active project)
    appProjects.setCurrentModule(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const setActive = (id: ModuleId) => {
    setActiveState(id);
    setSearchParams({ modulo: ID_TO_SLUG[id] ?? id }, { replace: false });
  };

  const moduleDone = progress.moduleDone as Record<ModuleId, boolean>;
  const setModuleDone = progress.setModuleDone as (
    updater:
      | Record<ModuleId, boolean>
      | ((p: Record<ModuleId, boolean>) => Record<ModuleId, boolean>),
  ) => void;
  const checklist = progress.checklist;
  const setChecklist = progress.setChecklist;
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedPromptsOpen, setSavedPromptsOpen] = useState(false);

  const allChecklistItems = useMemo(
    () => CHECKLIST_PHASES.flatMap((p) => p.items.map((i) => `${p.phase}__${i}`)),
    [],
  );

  // ===== Progresso ponderado =====
  // 40% comandos usados + 30% módulos concluídos + 30% checklist final.
  const commandsDone = progress.commandsDoneCount;

  // Conclusão automática dos módulos novos: se todos os itens do checklist
  // interno daquele módulo estiverem marcados, o módulo conta como concluído.
  // Conclusão manual (setModuleDone) continua valendo via OR — não apaga nada.
  const effectiveModuleDone = useMemo(() => {
    const merged: Record<string, boolean> = { ...moduleDone };
    for (const m of AUTO_MODULE_CHECKLIST) {
      let done = 0;
      for (const k of Object.keys(checklist)) {
        if (k.startsWith(m.prefix) && checklist[k]) done++;
      }
      if (m.total > 0 && done >= m.total) merged[m.id] = true;
    }
    return merged as Record<ModuleId, boolean>;
  }, [moduleDone, checklist]);

  const modulesDoneCount = useMemo(
    () => PROGRESS_MODULE_IDS.filter((id) => !!effectiveModuleDone[id]).length,
    [effectiveModuleDone],
  );
  const checklistDoneCount = useMemo(
    () => allChecklistItems.filter((k) => checklist[k]).length,
    [allChecklistItems, checklist],
  );

  const totals = {
    commands: { done: Math.min(commandsDone, TOTAL_COMMANDS), total: TOTAL_COMMANDS },
    modules: { done: modulesDoneCount, total: PROGRESS_MODULE_IDS.length },
    checklist: { done: checklistDoneCount, total: allChecklistItems.length },
  };

  const overallProgress = useMemo(() => {
    const pct = (d: number, t: number) => (t > 0 ? d / t : 0);
    const weighted =
      pct(totals.commands.done, totals.commands.total) * 0.4 +
      pct(totals.modules.done, totals.modules.total) * 0.3 +
      pct(totals.checklist.done, totals.checklist.total) * 0.3;
    return Math.max(0, Math.min(100, Math.round(weighted * 100)));
  }, [totals.commands.done, totals.commands.total, totals.modules.done, totals.modules.total, totals.checklist.done, totals.checklist.total]);


  const logout = async () => {
    await clearSession();
    toast.success("Você saiu da área restrita.");
    navigate("/login");
  };

  // ===== Estados de auth =====
  if (auth.status === "loading" || progress.loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-accent mx-auto mb-3" size={28} />
          <p className="text-sm text-muted-foreground">Carregando sua área...</p>
        </div>
      </div>
    );
  }

  if (auth.status === "anonymous") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <Lock className="text-accent mx-auto mb-3" size={28} />
          <h1 className="text-2xl font-heading font-bold mb-2">Área restrita</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Entre com o e-mail usado na compra para acessar seus comandos do Lovable.
          </p>
          <button onClick={() => navigate("/login")} className="btn-primary w-full justify-center">
            Entrar na área restrita
          </button>
        </GlassCard>
      </div>
    );
  }

  if (!auth.hasAccess && !auth.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <Lock className="text-amber-400 mx-auto mb-3" size={28} />
          <h1 className="text-2xl font-heading font-bold mb-2">
            Acesso ainda não liberado
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sua conta foi criada, mas seu acesso ainda não está ativo.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}
              className="btn-primary w-full justify-center"
            >
              <LifeBuoy size={14} /> Falar com suporte
            </button>
            <button
              onClick={logout}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-2"
            >
              <LogOut size={12} /> Sair desta conta
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const email = auth.email ?? "";

  const goTo = (id: ModuleId) => {
    setActive(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const markModuleDone = () => {
    setModuleDone((prev) => ({ ...prev, [active]: true }));
    toast.success("Módulo marcado como concluído.");
  };

  const currentIdx = MODULE_ORDER.indexOf(active);
  const prevModule = currentIdx > 0 ? MODULE_ORDER[currentIdx - 1] : null;
  const nextModule = currentIdx < MODULE_ORDER.length - 1 ? MODULE_ORDER[currentIdx + 1] : null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/85 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden p-2 rounded-lg border border-white/10 hover:bg-white/5"
            aria-label="Abrir menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Logo size="sm" />
          <span className="hidden md:inline text-sm text-muted-foreground">
            Fábrica de Apps com IA
          </span>
          <div className="ml-auto flex items-center gap-2 text-xs flex-wrap">
            {email && (
              <span className="hidden sm:inline px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                {email}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                openAgenteArquiteto();
                toast.success("Agente Arquiteto aberto. Use ele para pensar antes de mexer no Lovable.");
              }}
              className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/15"
              aria-label="Falar com o Agente"
              title="Falar com o Agente"
            >
              <Bot size={12} />
              <span className="hidden sm:inline">Falar com o Agente</span>
            </button>
            <MyAppsHeaderButton />
            <ContextHeaderButton />
            <FontSizeControl />
            {auth.isAdmin && (
              <button
                onClick={() => navigate("/admin/acessos")}
                className="px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent inline-flex items-center gap-1"
              >
                <ShieldCheck size={12} /> Admin
              </button>
            )}
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 inline-flex items-center gap-1"
            >
              <LogOut size={12} /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* SHELL */}
      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">
        {/* SIDEBAR */}
        <aside
          className={`${
            menuOpen ? "fixed inset-0 z-30 bg-background/95 backdrop-blur-md pt-16 px-4 overflow-y-auto" : "hidden"
          } lg:sticky lg:top-14 lg:block lg:w-72 lg:shrink-0 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto lg:p-4 lg:bg-transparent`}
        >
          <div className="lg:pr-2">
            {/* App ativo + atalhos */}
            <div className="mb-4 rounded-xl border border-accent/25 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Projeto em foco
              </div>
              {appProjects.activeProject ? (
                <>
                  <div className="text-sm font-medium text-foreground truncate" title={appProjects.activeProject.name}>
                    {appProjects.activeProject.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {SIDEBAR_STATUS_LABEL[appProjects.activeProject.status] ?? appProjects.activeProject.status}
                    {appProjects.activeProject.currentModuleId && (
                      <>
                        {" · "}
                        {MODULES.find((m) => m.id === appProjects.activeProject!.currentModuleId)?.label ??
                          appProjects.activeProject.currentModuleId}
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={appProjects.openDrawer}
                    className="mt-2 text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-md border border-white/15 hover:bg-white/5"
                  >
                    <Repeat size={12} /> Trocar app
                  </button>
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-foreground">Nenhum app selecionado</div>
                  <div className="text-[11px] text-muted-foreground mb-2.5">
                    Escolha o app que você está construindo para liberar a jornada.
                  </div>
                  <button
                    type="button"
                    onClick={appProjects.openDrawer}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-accent/50 bg-gradient-to-r from-accent/20 to-accent/10 text-accent hover:from-accent/25 hover:to-accent/15 text-xs font-semibold transition min-h-[44px] shadow-[0_0_20px_-12px_rgba(34,211,238,0.5)]"
                  >
                    <FolderKanban size={14} /> Criar ou selecionar app
                  </button>
                </>
              )}
            </div>


            <div
              className="mb-4 text-[11px] text-muted-foreground px-2 leading-snug"
              title="Construa em ordem"
            >
              Construa em ordem. Escolha seu app, siga a etapa atual, use o Estúdio de Prompt e revise antes de avançar.
            </div>

            {/* Agente Arquiteto — ferramenta central do programa */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => {
                  openAgenteArquiteto();
                  toast.success(
                    "Agente Arquiteto aberto. Use ele para revisar ideias, tirar dúvidas e decidir o próximo passo.",
                  );
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left border border-cyan-400/40 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-200 hover:from-cyan-500/15 hover:to-blue-500/15 transition shadow-[0_0_24px_-12px_rgba(34,211,238,0.6)]"
                aria-label="Abrir Agente Arquiteto"
              >
                <Bot size={16} className="shrink-0 text-cyan-300" />
                <span className="flex-1 leading-tight font-semibold">Agente Arquiteto</span>
                <ExternalLink size={12} className="shrink-0 opacity-70" />
              </button>
              <p className="text-[10px] text-muted-foreground mt-1.5 px-1 leading-snug">
                Use o Agente para pensar, revisar erros e decidir o próximo passo antes de mexer no Lovable.
              </p>
            </div>

            {/* Central do Projeto */}
            <div className="mb-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-2">
                Central do Projeto
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={appProjects.openDrawer}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left border border-transparent hover:bg-white/5 text-foreground/85"
                >
                  <FolderKanban size={16} className="shrink-0" />
                  <span className="flex-1 leading-tight">Projetos em construção</span>
                </button>
                <button
                  type="button"
                  onClick={projectCtx.openEditor}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left border border-transparent hover:bg-white/5 text-foreground/85"
                >
                  <ClipboardList size={16} className="shrink-0" />
                  <span className="flex-1 leading-tight">Contexto do projeto em foco</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSavedPromptsOpen(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left border border-transparent hover:bg-white/5 text-foreground/85"
                >
                  <Bookmark size={16} className="shrink-0" />
                  <span className="flex-1 leading-tight">Prompts salvos</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!appProjects.activeProject) {
                      appProjects.openDrawer();
                      return;
                    }
                    const target = (appProjects.activeProject.currentModuleId as ModuleId | undefined) ?? active;
                    goTo(target);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left border border-accent/30 bg-accent/10 text-accent hover:bg-accent/15"
                >
                  <Compass size={16} className="shrink-0" />
                  <span className="flex-1 leading-tight">
                    {appProjects.activeProject?.currentModuleId
                      ? `Continuar: ${
                          MODULES.find((m) => m.id === appProjects.activeProject!.currentModuleId)?.label ?? "etapa atual"
                        }`
                      : "Próximo passo"}
                  </span>
                  <ArrowRight size={14} className="shrink-0" />
                </button>
              </div>
            </div>

            {/* Módulos por fase */}
            <nav className="space-y-4">
              {SIDEBAR_GROUPS.map((group) => (
                <div key={group.title}>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-2">
                    {group.title}
                  </div>
                  <div className="space-y-1">
                    {group.modules.map((id) => {
                      const m = MODULES.find((x) => x.id === id);
                      if (!m) return null;
                      const Icon = ICONS[m.icon] ?? Circle;
                      const isActive = active === m.id;
                      const isDone = !!effectiveModuleDone[m.id];
                      return (
                        <button
                          key={m.id}
                          onClick={() => goTo(m.id)}
                          aria-current={isActive ? "step" : undefined}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition border ${
                            isActive
                              ? "bg-accent/15 border-accent/50 text-accent shadow-[0_0_0_1px_rgba(0,194,255,0.25)]"
                              : "border-transparent hover:bg-white/5 text-foreground/85"
                          }`}
                        >
                          <Icon size={16} className="shrink-0" />
                          <span className="flex-1 leading-tight">{m.label}</span>
                          {isDone ? (
                            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                          ) : isActive ? (
                            <span className="h-2 w-2 rounded-full bg-accent shrink-0 shadow-[0_0_8px_rgba(0,194,255,0.8)]" />
                          ) : (
                            <Circle size={14} className="text-muted-foreground/40 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
            {/* Progresso geral removido — métricas internas geravam ruído sem ajudar na próxima ação. */}
          </div>


        </aside>

        {/* MAIN */}
        <main className="flex-1 min-w-0 p-4 md:p-8">
          {/* ProjectStatusBanner removido para evitar duplicidade com o EstadoAtualDoProjetoCard.
              A informação conceitual "Produto principal: Fábrica de Apps com IA" agora aparece
              de forma discreta dentro do EstadoAtualDoProjetoCard. */}
          <EstadoAtualDoProjetoCard onGoToModule={(id) => setActive(id)} />

          {/* Sem Projeto em foco: bloco prioritário acima de jornada/Agente */}
          {!appProjects.activeProject && active !== "ideias" && (
            <section
              aria-label="Primeiro passo — escolher app"
              className="mb-4 rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/[0.14] via-accent/[0.05] to-transparent p-4 md:p-5"
            >
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent mb-2">
                <FolderKanban size={12} /> Comece por aqui
              </div>
              <h2 className="text-lg md:text-xl font-heading font-bold text-foreground leading-tight">
                Primeiro, escolha o app que a Fábrica vai guiar
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
                O Projeto em foco é o app que receberá contexto, jornada, prompts, progresso, GPS e orientação do Agente.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={appProjects.openDrawer}
                  className="btn-primary min-h-[44px]"
                >
                  <FolderKanban size={16} /> Criar ou selecionar app
                </button>
                <span className="text-[11px] text-muted-foreground">
                  Jornada, contexto e prompts ficam disponíveis depois que houver um projeto ativo.
                </span>
              </div>
            </section>
          )}

          {/* Variante compacta no módulo Ideias prontas — não empurra os cards para baixo */}
          {!appProjects.activeProject && active === "ideias" && (
            <section
              aria-label="Como criar seu Projeto em foco a partir de uma ideia"
              className="mb-3 rounded-xl border border-accent/30 bg-accent/[0.06] p-3 md:p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
            >
              <div className="min-w-0">
                <h2 className="text-sm md:text-base font-heading font-bold text-foreground leading-tight">
                  Escolha uma ideia para criar seu Projeto em foco
                </h2>
                <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
                  Ao clicar em <span className="text-foreground/90 font-semibold">Usar esta ideia</span>, a Fábrica cria um Projeto em foco com contexto inicial para você planejar.
                </p>
              </div>
              <button
                type="button"
                onClick={appProjects.openDrawer}
                className="shrink-0 inline-flex items-center justify-center gap-2 min-h-[40px] px-3 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs text-foreground/90"
              >
                <FolderKanban size={13} /> Criar ou selecionar app manualmente
              </button>
            </section>
          )}

          {/* Seletor global da jornada — compactado no módulo ideias sem projeto */}
          {active === "ideias" && !appProjects.activeProject ? (
            <p className="mb-4 text-[11px] text-muted-foreground">
              Depois de escolher uma ideia, você poderá confirmar a jornada do projeto.
            </p>
          ) : (
            <div className={!appProjects.activeProject ? "opacity-75" : undefined}>
              <ProjectJourneySelector onGoToModule={(id) => setActive(id)} />
            </div>
          )}

          {/* Boas-vindas: Agente Arquiteto como guia central */}
          {active === "comece" && (
            <div className="mb-6 space-y-3">
              {!appProjects.activeProject && (
                <div className="rounded-lg border border-amber-400/30 bg-amber-400/[0.08] px-3 py-2 text-[12px] text-amber-100 flex items-start gap-2">
                  <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                  <span>
                    Antes de usar o Agente com contexto, crie ou selecione um Projeto em foco. Sem projeto, o Agente é apoio — não a primeira ação.
                  </span>
                </div>
              )}
              <AgentArchitectCard
                eyebrow="Não sabe por onde começar?"
                title="O Agente Arquiteto é seu guia"
                subtitle="Use ele para revisar ideias, entender os prompts, simplificar a primeira versão funcional ou auditar um app já existente dentro da Fábrica de Apps com IA."
                description="Recomendado para iniciantes antes de copiar qualquer prompt para o Lovable. Tire dúvidas, valide sua ideia e só então construa."
                benefits={[
                  "Entenda o que construir primeiro",
                  "Evite criar um app inchado",
                  "Tire dúvidas sobre telas, dados e funcionalidades",
                ]}
                ctaLabel="Abrir Agente Arquiteto"
              />
            </div>
          )}


          {/* O que você vai fazer nesta etapa — oculto em ideias para subir os cards */}
          {active !== "comece" && active !== "ideias" && (
            <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 p-4 flex items-start gap-3">
              <Sparkles size={16} className="text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-accent mb-1">
                  O que você vai fazer nesta etapa
                </div>
                <p className="text-sm text-foreground/85">
                  {MODULE_HINTS[active].doNow}
                </p>
              </div>
            </div>
          )}

          {active === "construir" ? (
            <details className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] group">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-3 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground transition">
                <span>
                  Dicas e busca inteligente
                  <span className="ml-2 text-muted-foreground/60">
                    (oculto para você focar na Etapa 1)
                  </span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-accent group-open:hidden">
                  Mostrar
                </span>
                <span className="text-[10px] uppercase tracking-wider text-accent hidden group-open:inline">
                  Ocultar
                </span>
              </summary>
              <div className="p-3 space-y-3">
                <PainSearchNextStep goTo={goTo} />
                <FirstAppOnboarding />
                <JourneyStartGuide
                  active={active}
                  goTo={goTo}
                  effectiveModuleDone={effectiveModuleDone}
                />
                <TwoPathsExplainer />
              </div>
            </details>
          ) : null}



          <div id="modules-list">
            <RecommendedModuleHint active={active} goTo={goTo} />
            <ModuleContent
              active={active}
              checklist={checklist}
              setChecklist={setChecklist}
              goTo={goTo}
            />
          </div>


          {!(active === "ideias" && !appProjects.activeProject) && (
            <ModuleReviewCard
              moduleName={MODULES.find((m) => m.id === active)?.label ?? active}
              isSecurity={active === "seguranca"}
              objective={MODULE_HINTS[active]?.doNow}
              moduleId={active}
            />
          )}

          {active === "ideias" && !appProjects.activeProject && (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-muted-foreground">
              Escolha uma ideia e crie seu Projeto em foco antes de revisar esta etapa. Sem app escolhido, a revisão, o GPS e o Arquiteto ficam ocultos para não analisar um app inexistente.
            </div>
          )}

          {(active === "planejar" || active === "mvp") && (
            <div className="mt-8 mb-3">
              <h3 className="text-sm font-heading font-semibold text-muted-foreground uppercase tracking-wider">
                Ferramentas extras
              </h3>
              <p className="text-xs text-muted-foreground/80 mt-1">
                {active === "mvp"
                  ? "Use apenas se estiver travado ou quiser revisar melhor sua arquitetura antes de continuar."
                  : "Use apenas se estiver travado ou quiser revisar melhor sua ideia antes de continuar."}
              </p>
            </div>
          )}



          {active === "ideias" && appProjects.activeProject && (
            <div className="mt-10 mb-3">
              <h3 className="text-base font-heading font-bold text-foreground/95">
                Depois de escolher uma ideia
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Use o GPS do App e o Arquiteto de Melhorias para revisar a ideia escolhida e decidir os próximos ajustes.
              </p>
            </div>
          )}

          {active !== "fundamentos" && !(active === "ideias" && !appProjects.activeProject) && (
            <GpsDoAppCard
              defaultCollapsed
              moduleId={active}
              moduleTitle={MODULES.find((m) => m.id === active)?.label}
              journey={journey}
              descriptionOverride={
                active === "telas"
                  ? "Use o GPS para confirmar em que ponto da construção você está e o que falta antes de seguir para o próximo módulo."
                  : undefined
              }
            />
          )}


          {active !== "fundamentos" && !(active === "ideias" && !appProjects.activeProject) && (
            <ArquitetoMelhoriasCard
              defaultCollapsed
              moduleId={active}
              moduleTitle={MODULES.find((m) => m.id === active)?.label}
              journey={journey}
              descriptionOverride={
                active === "telas"
                  ? "Use o Arquiteto para decidir se uma ideia nova de tela ou fluxo vale entrar agora ou ficar para depois no seu app."
                  : undefined
              }
            />
          )}





          {/* Quando posso avançar? */}
          {active !== "comece" && (
            <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
              <ArrowRight size={16} className="text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                  Quando posso avançar?
                </div>
                <p className="text-sm text-foreground/85">
                  {MODULE_HINTS[active].advanceWhen}
                </p>
              </div>
            </div>
          )}

          {/* Footer do módulo */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
            {active !== "comece" ? (
              <button
                onClick={() => prevModule && goTo(prevModule)}
                disabled={!prevModule}
                className="px-4 py-2.5 rounded-xl border border-white/15 hover:bg-white/5 inline-flex items-center gap-2 text-sm disabled:opacity-30"
              >
                <ArrowLeft size={14} /> Voltar
              </button>
            ) : (
              <span />
            )}
            {(() => {
              const blockConclude = active === "ideias" && !appProjects.activeProject;
              return (
                <button
                  onClick={markModuleDone}
                  disabled={blockConclude}
                  title={blockConclude ? "Escolha uma ideia e crie um Projeto em foco antes de concluir esta etapa." : undefined}
                  className={
                    blockConclude
                      ? "px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-muted-foreground inline-flex items-center gap-2 text-sm cursor-not-allowed"
                      : "px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15 inline-flex items-center gap-2 text-sm"
                  }
                >
                  <CheckCircle2 size={14} /> {blockConclude ? "Escolha uma ideia para concluir" : "Marcar módulo como concluído"}
                </button>
              );
            })()}
            {(() => {
              const isIdeias = active === "ideias";
              const isPlanejar = active === "planejar";
              const isMvp = active === "mvp";
              const hasChosenIdea = !!appProjects.activeProject;
              const blockIdeias = isIdeias && !hasChosenIdea;
              const blockPlanejar = isPlanejar && !hasChosenIdea;
              const blockMvp = isMvp && !hasChosenIdea;
              const blocked = blockIdeias || blockPlanejar || blockMvp;
              const customLabel = isIdeias
                ? hasChosenIdea
                  ? "Próximo passo: Planejar o App"
                  : "Escolha uma ideia para avançar"
                : (isPlanejar || isMvp) && !hasChosenIdea
                ? "Escolha um app para avançar"
                : null;

              const handleClick = () => {
                if (blocked) return;
                if (isIdeias && hasChosenIdea) {
                  goTo("planejar");
                  return;
                }
                if (nextModule) goTo(nextModule);
              };
              const disabled = blocked || (!isIdeias && !nextModule);
              return (
                <button
                  onClick={handleClick}
                  disabled={disabled}
                  className={
                    blocked
                      ? "px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-muted-foreground text-sm cursor-not-allowed inline-flex items-center gap-2"
                      : "btn-primary text-sm disabled:opacity-30"
                  }
                >
                  {customLabel ?? "Próximo passo"} {!blocked && <ArrowRight size={14} />}
                </button>
              );
            })()}

          </div>
        </main>

      </div>
      <SavedPromptsDrawer open={savedPromptsOpen} onClose={() => setSavedPromptsOpen(false)} />
    </div>
  );
}

// ====== Conteúdo dos módulos ======

type ModuleContentProps = {
  active: ModuleId;
  checklist: Record<string, boolean>;
  setChecklist: (v: Record<string, boolean> | ((p: Record<string, boolean>) => Record<string, boolean>)) => void;
  goTo: (id: ModuleId) => void;
};

const ModuleHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <header className="mb-8">
    <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">{title}</h1>
    <p className="text-muted-foreground max-w-3xl">{subtitle}</p>
  </header>
);

const CommandList = ({
  commands,
  moduleKey,
}: {
  commands: Command[];
  moduleKey: string;
}) => {
  const { isCommandDone } = useUserProgress();
  // Foco progressivo: abrir somente a primeira etapa ainda não concluída.
  // Se todas estiverem concluídas, nenhuma fica aberta por padrão (usuário
  // ainda pode expandir manualmente).
  const firstPendingIdx = commands.findIndex(
    (c) => !isCommandDone(`${moduleKey}_${c.n}`),
  );
  return (
    <div className="space-y-3">
      <CopyCommandWarning />
      {commands.map((c, i) => (
        <CommandCard
          key={c.n}
          number={c.n}
          title={c.title}
          description={c.purpose}
          whenToUse={c.when}
          whereToPaste={c.where}
          expectedResult={c.result}
          commandText={c.content}
          defaultOpen={i === firstPendingIdx}
          completedKey={`${moduleKey}_${c.n}`}
          moduleId={moduleKey}
          objective={c.objective}
          whenLovableDirect={c.whenLovableDirect}
          whenAgentFirst={c.whenAgentFirst}
          agentPrompt={c.agentPrompt}
          correctionPrompt={c.correctionPrompt}
          advanceCriteria={c.advanceCriteria}
        />
      ))}
      <BeforeAdvanceTip />
    </div>
  );
};


const ConstruirIntro = () => {
  const [showZero, setShowZero] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showPaths, setShowPaths] = useState(false);
  const { activeProject } = useAppProjects();

  const copyFirst = async () => {
    const raw = COMMANDS_CONSTRUIR[0]?.content ?? "";
    const appName = activeProject?.name?.trim() || "seu app";
    const ctx = activeProject?.context;
    const essentials = [ctx?.appDoes, ctx?.audience, ctx?.problem, ctx?.promise, ctx?.mainAction];
    const essentialFilled = essentials.filter((v) => typeof v === "string" && v.trim().length > 0).length;
    const hint =
      essentialFilled < 3
        ? "\n\nContexto parcial. Use apenas os dados preenchidos acima; não invente público, problema ou ação principal."
        : "";
    const text = raw.split("[nome do app ativo]").join(appName) + hint;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(
        activeProject
          ? `Etapa 1 copiada para ${appName}. Cole no Lovable.`
          : "Etapa 1 copiada. Selecione um app em Meus Apps para personalizar.",
      );
    } catch {
      toast.error("Não foi possível copiar. Selecione e copie manualmente.");
    }
  };

  const tutorialSteps = [
    "Copie",
    "Cole no Lovable",
    "Espere o resultado",
    "Volte aqui",
    "Marque como feito",
  ];

  const modes = [
    {
      title: "Começar do zero",
      tone: "accent",
      text: "Use este caminho se você tem apenas uma ideia e quer seguir o passo a passo simples.",
    },
    {
      title: "Conversar com o Agente",
      tone: "amber",
      text: "Use este caminho se quer pensar melhor sobre o app antes de pedir para o Lovable construir.",
    },
    {
      title: "Corrigir um erro",
      tone: "rose",
      text: "Use este caminho se o Lovable criou algo confuso, quebrado ou genérico.",
    },
  ];

  const glossary: [string, string][] = [
    ["MVP", "primeira versão simples do app."],
    ["Prompt", "texto que você cola na IA."],
    ["Lovable", "ferramenta onde o app será construído."],
    ["Dashboard", "tela principal do usuário."],
    ["Banco de dados", "lugar onde o app guarda informações."],
    ["Checkout", "link ou página de pagamento."],
  ];

  return (
    <section className="mb-8 space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent p-5 md:p-8 neon-shadow">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <Sparkles size={12} /> Modo Iniciante Guiado
        </span>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gradient leading-tight mb-2">
          Construa seu app passo a passo
        </h2>
        <p className="text-sm md:text-base text-foreground/85 max-w-3xl mb-3 leading-relaxed">
          Você não precisa saber programar. Copie um comando por vez, cole no Lovable e
          avance apenas quando a etapa estiver pronta.
        </p>
        <p className="text-[13px] md:text-sm text-accent/90 max-w-3xl mb-5">
          Mesmo que sua ideia ainda esteja bagunçada, comece pela Etapa 1.
        </p>

        {/* Mini tutorial visual */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-5">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {tutorialSteps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 text-[12px] md:text-[13px] text-foreground/90">
                  <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {s}
                </div>
                {i < tutorialSteps.length - 1 && (
                  <span className="text-muted-foreground/50 hidden md:inline">→</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Repita esse ciclo em cada etapa.</p>
        </div>

        <p className="mb-3 text-[11px] text-muted-foreground/80 max-w-2xl">
          Comece pelo CommandCard da Etapa 1 abaixo — o caminho recomendado é{" "}
          <span className="text-amber-200">Revisar com o Agente primeiro</span>.{" "}
          <button
            type="button"
            onClick={copyFirst}
            className="underline underline-offset-2 hover:text-foreground"
          >
            Atalho avançado: copiar Etapa 1 direto
          </button>
          . Use este atalho apenas se você já sabe que quer enviar a Etapa 1 direto ao Lovable.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowZero((v) => !v)}
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 min-h-[44px] rounded-xl border border-white/15 hover:bg-white/5"
            type="button"
          >
            <Sparkles size={14} /> Estou começando do zero
          </button>
          <a
            href={APP_CONFIG.GPT_AGENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 min-h-[44px] rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
          >
            <Sparkles size={14} /> Abrir Agente Arquiteto
          </a>
          <a
            href={LOVABLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 min-h-[44px] rounded-xl border border-white/15 hover:bg-white/5"
          >
            <ExternalLink size={14} /> Abrir Lovable
          </a>
        </div>

        {/* Instrução reforçada: ação principal */}
        <div className="mt-4 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-[12px] text-foreground/90">
          ⚡ Copie <strong>apenas uma etapa por vez</strong>. Só avance quando o Lovable entregar o resultado esperado.
        </div>

        {/* 3 caminhos rápidos */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11.5px] text-foreground/80">
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-accent font-semibold">Sei o que fazer:</span> copiar etapa e colar no Lovable.
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-amber-300 font-semibold">Estou inseguro:</span> abrir o Agente Arquiteto antes.
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-accent font-semibold">Estou perdido:</span> usar a Busca Inteligente no topo.
          </div>
        </div>

        {showZero && (
          <div className="mt-5 rounded-xl border border-accent/30 bg-accent/5 p-4 text-[13px] md:text-sm text-foreground/90 leading-relaxed">
            <div className="font-semibold mb-2 text-accent">Faça só isso agora:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Copie o texto da Etapa 1.</li>
              <li>Abra o Lovable.</li>
              <li>Cole no chat do projeto.</li>
              <li>Espere o Lovable responder.</li>
              <li>Volte aqui e marque como feito.</li>
            </ol>
          </div>
        )}
      </div>

      {/* Modos renomeados — colapsado por padrão para reduzir peso visual */}
      <div className="rounded-xl border border-white/10 bg-white/5">
        <button
          type="button"
          onClick={() => setShowPaths((v) => !v)}
          className="w-full flex items-center justify-between gap-3 p-4 text-left min-h-[48px]"
        >
          <span className="text-sm font-semibold text-foreground/90">Escolha seu caminho</span>
          <ChevronDown size={16} className={`text-muted-foreground transition-transform ${showPaths ? "rotate-180" : ""}`} />
        </button>
        {showPaths && (
          <div className="px-4 pb-4 grid md:grid-cols-3 gap-3">
            {modes.map((m) => {
              const tone =
                m.tone === "amber"
                  ? "border-amber-400/30 bg-amber-400/5"
                  : m.tone === "rose"
                  ? "border-rose-400/30 bg-rose-400/5"
                  : "border-accent/30 bg-accent/5";
              return (
                <GlassCard key={m.title} className={`p-4 border ${tone}`}>
                  <h3 className="font-heading font-semibold text-sm mb-1.5">{m.title}</h3>
                  <p className="text-[13px] text-foreground/80 leading-snug">{m.text}</p>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Microglossário */}
      <div className="rounded-xl border border-white/10 bg-white/5">
        <button
          type="button"
          onClick={() => setShowGlossary((v) => !v)}
          className="w-full flex items-center justify-between gap-3 p-4 text-left min-h-[48px]"
        >
          <span className="text-sm font-semibold text-foreground/90">Não entendi uma palavra</span>
          <ChevronDown size={16} className={`text-muted-foreground transition-transform ${showGlossary ? "rotate-180" : ""}`} />
        </button>
        {showGlossary && (
          <dl className="px-4 pb-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
            {glossary.map(([term, def]) => (
              <div key={term} className="flex gap-2">
                <dt className="text-accent font-semibold shrink-0">{term}:</dt>
                <dd className="text-foreground/80">{def}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
};

const LoginIntro = () => {
  const [showZero, setShowZero] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);

  const tutorialSteps = [
    "Crie o login",
    "Crie o perfil",
    "Proteja a área",
    "Teste usuário comum",
    "Teste acesso especial",
  ];

  const glossary: [string, string][] = [
    ["Login", "tela onde o usuário entra no app."],
    ["Cadastro", "criação da conta do usuário."],
    ["Banco de dados", "lugar onde o app guarda informações."],
    ["Tabela", "grupo de dados organizados, como usuários, pedidos ou conteúdos."],
    ["Perfil", "dados principais de cada usuário."],
    ["Permissão", "regra que define quem pode acessar cada parte."],
    ["Área restrita", "página que só usuário logado pode ver."],
    ["Admin", "usuário com permissão especial."],
    ["Supabase", "ferramenta usada para login e banco de dados."],
    ["Service role", "chave mestra do banco, nunca deve aparecer no frontend."],
  ];

  return (
    <section className="mb-8 space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent p-5 md:p-8 neon-shadow">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <Sparkles size={12} /> Login e banco — Modo Guiado
        </span>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gradient leading-tight mb-2">
          Configure login e banco sem se perder
        </h2>
        <p className="text-sm md:text-base text-foreground/85 max-w-3xl mb-3 leading-relaxed">
          Login é a porta de entrada do usuário. Banco de dados é onde o app
          guarda informações. Nesta etapa, você vai criar acesso, perfis e áreas
          protegidas.
        </p>
        <p className="text-[13px] md:text-sm text-accent/90 max-w-3xl mb-5">
          Não avance para venda ou checkout antes de testar se o usuário consegue
          entrar, sair e acessar a área correta.
        </p>

        {/* Mini tutorial visual */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-5">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {tutorialSteps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 text-[12px] md:text-[13px] text-foreground/90">
                  <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {s}
                </div>
                {i < tutorialSteps.length - 1 && (
                  <span className="text-muted-foreground/50 hidden md:inline">→</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Repita os testes antes de avançar para venda.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowZero((v) => !v)}
            className="btn-primary text-sm min-h-[44px]"
            type="button"
          >
            <Sparkles size={14} /> Não entendo login e banco
          </button>
          <a
            href={APP_CONFIG.GPT_AGENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 min-h-[44px] rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
          >
            <Sparkles size={14} /> Abrir Agente Arquiteto
          </a>
          <a
            href={LOVABLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 min-h-[44px] rounded-xl border border-white/15 hover:bg-white/5"
          >
            <ExternalLink size={14} /> Abrir Lovable
          </a>
        </div>

        {showZero && (
          <div className="mt-5 rounded-xl border border-accent/30 bg-accent/5 p-4 text-[13px] md:text-sm text-foreground/90 leading-relaxed">
            <div className="font-semibold mb-2 text-accent">Faça só isso agora:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Peça ao Lovable para criar login com e-mail e senha.</li>
              <li>Peça para criar uma tabela de perfil do usuário.</li>
              <li>Peça para proteger a área principal.</li>
              <li>Crie um usuário de teste.</li>
              <li>Entre, saia e entre de novo para confirmar que funciona.</li>
            </ol>
          </div>
        )}
      </div>

      {/* Alerta de segurança service role */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100 flex items-start gap-3">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        <div>
          <strong>Nunca exponha chave service role no frontend.</strong> Essa
          chave é como uma chave mestra do banco e nunca deve aparecer no app
          público.
        </div>
      </div>

      {/* Microglossário */}
      <div className="rounded-xl border border-white/10 bg-white/5">
        <button
          type="button"
          onClick={() => setShowGlossary((v) => !v)}
          className="w-full flex items-center justify-between gap-3 p-4 text-left min-h-[48px]"
        >
          <span className="text-sm font-semibold text-foreground/90">Não entendi uma palavra</span>
          <ChevronDown size={16} className={`text-muted-foreground transition-transform ${showGlossary ? "rotate-180" : ""}`} />
        </button>
        {showGlossary && (
          <dl className="px-4 pb-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
            {glossary.map(([term, def]) => (
              <div key={term} className="flex gap-2">
                <dt className="text-accent font-semibold shrink-0">{term}:</dt>
                <dd className="text-foreground/80">{def}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
};

const VendaIntro = () => {
  const [showZero, setShowZero] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);

  const tutorialSteps = [
    "Defina a promessa",
    "Crie a landing",
    "Explique o preço",
    "Responda dúvidas",
    "Reforce confiança",
  ];

  const glossary: [string, string][] = [
    ["Landing page", "página criada para apresentar e vender uma oferta."],
    ["Oferta", "conjunto de promessa, entrega, preço e motivo para comprar."],
    ["Promessa", "resultado ou benefício que a pessoa pode esperar."],
    ["CTA", "chamada para ação, como \"Comprar agora\"."],
    ["FAQ", "perguntas frequentes."],
    ["Objeção", "dúvida ou resistência que impede a compra."],
    ["Prova", "elemento que aumenta confiança."],
    ["Copy", "texto persuasivo da página."],
    ["Preço único", "pagamento feito uma vez, sem assinatura."],
    ["Conversão", "quando o visitante realiza a ação desejada."],
  ];

  return (
    <section className="mb-8 space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent p-5 md:p-8 neon-shadow">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <Sparkles size={12} /> Página de venda — Modo Guiado
        </span>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gradient leading-tight mb-2">
          Transforme seu app em uma oferta vendável
        </h2>
        <p className="text-sm md:text-base text-foreground/85 max-w-3xl mb-3 leading-relaxed">
          Agora que seu app começa a tomar forma, você precisa explicar o valor
          dele com clareza: para quem é, o que resolve, o que entrega e por que
          alguém deveria comprar.
        </p>
        <p className="text-[13px] md:text-sm text-accent/90 max-w-3xl mb-5">
          Uma página bonita não vende sozinha. A oferta precisa ser clara,
          direta e honesta.
        </p>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-5">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {tutorialSteps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 text-[12px] md:text-[13px] text-foreground/90">
                  <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {s}
                </div>
                {i < tutorialSteps.length - 1 && (
                  <span className="text-muted-foreground/50 hidden md:inline">→</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Antes de criar checkout, garanta que a pessoa entende o valor do app.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowZero((v) => !v)}
            className="btn-primary text-sm min-h-[44px]"
            type="button"
          >
            <Sparkles size={14} /> Não sei vender meu app
          </button>
          <a
            href={APP_CONFIG.GPT_AGENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 min-h-[44px] rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
          >
            <Sparkles size={14} /> Abrir Agente Arquiteto
          </a>
          <a
            href={LOVABLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 min-h-[44px] rounded-xl border border-white/15 hover:bg-white/5"
          >
            <ExternalLink size={14} /> Abrir Lovable
          </a>
        </div>

        {showZero && (
          <div className="mt-5 rounded-xl border border-accent/30 bg-accent/5 p-4 text-[13px] md:text-sm text-foreground/90 leading-relaxed">
            <div className="font-semibold mb-2 text-accent">Faça só isso agora:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Escreva qual problema seu app resolve.</li>
              <li>Escreva para quem ele foi criado.</li>
              <li>Escolha uma promessa simples.</li>
              <li>Defina o que a pessoa recebe.</li>
              <li>Crie a landing com a Etapa 1.</li>
            </ol>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100 flex items-start gap-3">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        <div>
          Não prometa resultado garantido. Venda clareza, utilidade, economia de
          tempo, organização, acesso ou transformação real.
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5">
        <button
          type="button"
          onClick={() => setShowGlossary((v) => !v)}
          className="w-full flex items-center justify-between gap-3 p-4 text-left min-h-[48px]"
        >
          <span className="text-sm font-semibold text-foreground/90">Não entendi uma palavra</span>
          <ChevronDown size={16} className={`text-muted-foreground transition-transform ${showGlossary ? "rotate-180" : ""}`} />
        </button>
        {showGlossary && (
          <dl className="px-4 pb-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
            {glossary.map(([term, def]) => (
              <div key={term} className="flex gap-2">
                <dt className="text-accent font-semibold shrink-0">{term}:</dt>
                <dd className="text-foreground/80">{def}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
};

const CheckoutIntro = () => {
  const [showZero, setShowZero] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);

  const tutorialSteps = [
    "Crie o pagamento",
    "Mostre o obrigado",
    "Proteja a entrega",
    "Libere o acesso",
    "Teste como comprador",
  ];

  const glossary: [string, string][] = [
    ["Checkout", "lugar onde a pessoa paga."],
    ["Gateway", "ferramenta que processa o pagamento, como Kiwify, Hotmart, Kirvano, Stripe ou Mercado Pago."],
    ["URL de retorno", "página para onde o comprador volta depois de pagar."],
    ["Página de obrigado", "página que confirma a compra e explica o próximo passo."],
    ["Área de entrega", "lugar onde o comprador acessa o produto."],
    ["Acesso restrito", "área que só pessoas autorizadas conseguem ver."],
    ["Liberação manual", "quando você confirma o pagamento e libera o acesso."],
    ["Liberação automática", "quando o sistema libera acesso após confirmação do gateway."],
    ["Webhook", "aviso automático enviado pelo gateway para o app quando uma compra acontece."],
    ["Recuperação de acesso", "fluxo para comprador voltar a entrar se perder login ou senha."],
  ];

  return (
    <section className="mb-8 space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent p-5 md:p-8 neon-shadow">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <Sparkles size={12} /> Checkout e entrega — Modo Guiado
        </span>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gradient leading-tight mb-2">
          Venda e entregue sem perder o comprador
        </h2>
        <p className="text-sm md:text-base text-foreground/85 max-w-3xl mb-3 leading-relaxed">
          Nesta etapa, você organiza o pagamento, a página de obrigado, a área
          de entrega e o acesso do comprador.
        </p>
        <p className="text-[13px] md:text-sm text-accent/90 max-w-3xl mb-5">
          Não basta vender. O comprador precisa saber exatamente onde entrar, o
          que recebeu e como acessar novamente.
        </p>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-5">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {tutorialSteps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 text-[12px] md:text-[13px] text-foreground/90">
                  <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {s}
                </div>
                {i < tutorialSteps.length - 1 && (
                  <span className="text-muted-foreground/50 hidden md:inline">→</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Antes de divulgar, faça o caminho completo como se você fosse o comprador.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowZero((v) => !v)}
            className="btn-primary text-sm min-h-[44px]"
            type="button"
          >
            <Sparkles size={14} /> Não entendo checkout e entrega
          </button>
          <a
            href={APP_CONFIG.GPT_AGENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 min-h-[44px] rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
          >
            <Sparkles size={14} /> Abrir Agente Arquiteto
          </a>
          <a
            href={LOVABLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 min-h-[44px] rounded-xl border border-white/15 hover:bg-white/5"
          >
            <ExternalLink size={14} /> Abrir Lovable
          </a>
        </div>

        {showZero && (
          <div className="mt-5 rounded-xl border border-accent/30 bg-accent/5 p-4 text-[13px] md:text-sm text-foreground/90 leading-relaxed">
            <div className="font-semibold mb-2 text-accent">Faça só isso agora:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Escolha se o pagamento será por WhatsApp, checkout externo ou gateway.</li>
              <li>Crie uma página de obrigado explicando o próximo passo.</li>
              <li>Crie uma área de entrega protegida.</li>
              <li>Teste um comprador sem acesso e um comprador liberado.</li>
              <li>Só avance quando a pessoa conseguir pagar, receber orientação e entrar.</li>
            </ol>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100 flex items-start gap-3">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        <div>
          <strong>Nunca deixe material pago visível para visitantes.</strong> A
          entrega precisa ficar protegida por login, acesso liberado ou código.
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5">
        <button
          type="button"
          onClick={() => setShowGlossary((v) => !v)}
          className="w-full flex items-center justify-between gap-3 p-4 text-left min-h-[48px]"
        >
          <span className="text-sm font-semibold text-foreground/90">Não entendi uma palavra</span>
          <ChevronDown size={16} className={`text-muted-foreground transition-transform ${showGlossary ? "rotate-180" : ""}`} />
        </button>
        {showGlossary && (
          <dl className="px-4 pb-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
            {glossary.map(([term, def]) => (
              <div key={term} className="flex gap-2">
                <dt className="text-accent font-semibold shrink-0">{term}:</dt>
                <dd className="text-foreground/80">{def}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
};


const SeoIntro = () => {
  const [showZero, setShowZero] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);

  const tutorialSteps = [
    "Escolha palavras",
    "Crie páginas",
    "Responda dúvidas",
    "Adicione marcações",
    "Revise antes de publicar",
  ];

  const glossary: [string, string][] = [
    ["SEO", "otimização para buscadores, como Google."],
    ["GEO", "organização de conteúdo para ferramentas de IA entenderem melhor seu app."],
    ["Palavra-chave", "termo que uma pessoa digita para procurar algo."],
    ["Intenção de busca", "o motivo por trás da pesquisa da pessoa."],
    ["FAQ", "perguntas frequentes."],
    ["Schema", "marcação invisível que ajuda buscadores a entenderem a página."],
    ["FAQPage", "schema para perguntas e respostas."],
    ["SoftwareApplication", "schema que explica que seu produto é um app ou software."],
    ["JSON-LD", "formato usado para inserir schema no site."],
    ["Keyword stuffing", "repetição exagerada de palavras-chave, prejudica a qualidade."],
    ["LLM", "modelo de linguagem usado por ferramentas de IA."],
  ];

  return (
    <section className="mb-8 space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent p-5 md:p-8 neon-shadow">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <Sparkles size={12} /> SEO e GEO — Modo Guiado
        </span>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gradient leading-tight mb-2">
          Faça seu app ser encontrado e entendido
        </h2>
        <p className="text-sm md:text-base text-foreground/85 max-w-3xl mb-3 leading-relaxed">
          Nesta etapa, você cria páginas e textos para ajudar o Google,
          buscadores e ferramentas de IA a entenderem o que seu app faz, para
          quem ele serve e quais problemas resolve.
        </p>
        <p className="text-[13px] md:text-sm text-accent/90 max-w-3xl mb-5">
          Seu app não precisa apenas existir. Ele precisa ser compreendido.
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          <GlassCard className="p-4 border border-accent/20">
            <h3 className="font-heading font-semibold text-sm mb-1.5 text-accent">SEO</h3>
            <p className="text-[13px] text-foreground/80 leading-snug">
              Ajuda o Google e outros buscadores a entenderem suas páginas,
              palavras-chave, perguntas e assuntos principais.
            </p>
          </GlassCard>
          <GlassCard className="p-4 border border-amber-400/30">
            <h3 className="font-heading font-semibold text-sm mb-1.5 text-amber-200">GEO</h3>
            <p className="text-[13px] text-foreground/80 leading-snug">
              Ajuda ferramentas de IA e buscadores inteligentes a entenderem
              seu app, sua proposta, seus diferenciais e o público que ele
              atende.
            </p>
          </GlassCard>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-5">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {tutorialSteps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 text-[12px] md:text-[13px] text-foreground/90">
                  <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {s}
                </div>
                {i < tutorialSteps.length - 1 && (
                  <span className="text-muted-foreground/50 hidden md:inline">→</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Não crie páginas vazias. Cada página precisa ajudar uma pessoa real
            a entender seu app.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowZero((v) => !v)}
            className="btn-primary text-sm min-h-[44px]"
            type="button"
          >
            <Sparkles size={14} /> Não entendo SEO e GEO
          </button>
          <a
            href={APP_CONFIG.GPT_AGENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 min-h-[44px] rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
          >
            <Sparkles size={14} /> Abrir Agente Arquiteto
          </a>
          <a
            href={LOVABLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 min-h-[44px] rounded-xl border border-white/15 hover:bg-white/5"
          >
            <ExternalLink size={14} /> Abrir Lovable
          </a>
        </div>

        {showZero && (
          <div className="mt-5 rounded-xl border border-accent/30 bg-accent/5 p-4 text-[13px] md:text-sm text-foreground/90 leading-relaxed">
            <div className="font-semibold mb-2 text-accent">Faça só isso agora:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Liste 5 palavras que seu público pesquisaria.</li>
              <li>Crie uma página para cada assunto importante.</li>
              <li>Crie um FAQ com dúvidas reais.</li>
              <li>Peça ao Lovable para adicionar marcações básicas.</li>
              <li>Revise se o texto está claro, útil e sem exagero.</li>
            </ol>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100 flex items-start gap-3">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        <div>
          SEO e GEO não garantem resultado imediato. Eles organizam seu
          conteúdo para aumentar a chance de ser encontrado e entendido.
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5">
        <button
          type="button"
          onClick={() => setShowGlossary((v) => !v)}
          className="w-full flex items-center justify-between gap-3 p-4 text-left min-h-[48px]"
        >
          <span className="text-sm font-semibold text-foreground/90">Não entendi uma palavra</span>
          <ChevronDown size={16} className={`text-muted-foreground transition-transform ${showGlossary ? "rotate-180" : ""}`} />
        </button>
        {showGlossary && (
          <dl className="px-4 pb-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
            {glossary.map(([term, def]) => (
              <div key={term} className="flex gap-2">
                <dt className="text-accent font-semibold shrink-0">{term}:</dt>
                <dd className="text-foreground/80">{def}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
};


const CriativosIntro = () => {
  const [showZero, setShowZero] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);

  const tutorialSteps = [
    "Escolha a dor",
    "Crie o gancho",
    "Mostre a promessa",
    "Adicione CTA",
    "Teste variações",
  ];

  const glossary: [string, string][] = [
    ["Criativo", "peça usada para divulgar uma oferta: imagem, vídeo, post, story, anúncio ou mensagem."],
    ["Gancho", "primeira frase ou elemento que faz a pessoa parar."],
    ["Headline", "frase principal do criativo."],
    ["CTA", "chamada para ação, como 'teste agora', 'saiba mais' ou 'comprar'."],
    ["Ângulo", "forma de apresentar a mesma oferta: dor, desejo, curiosidade, prova ou urgência."],
    ["Story", "conteúdo rápido publicado nos stories do Instagram."],
    ["Reels", "vídeo curto do Instagram."],
    ["TikTok", "vídeo curto para descoberta e alcance."],
    ["Meta Ads", "anúncios pagos no Facebook e Instagram."],
    ["Teste A/B", "comparação entre duas versões para ver qual funciona melhor."],
    ["Conversão", "quando a pessoa faz a ação desejada."],
    ["Biblioteca de criativos", "organização dos criativos criados, testados e aprovados."],
  ];

  return (
    <section className="mb-8 space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent p-5 md:p-8 neon-shadow">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <Sparkles size={12} /> Criativos — Modo Guiado
        </span>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gradient leading-tight mb-2">
          Crie criativos que fazem a pessoa parar e clicar
        </h2>
        <p className="text-sm md:text-base text-foreground/85 max-w-3xl mb-3 leading-relaxed">
          Nesta etapa, você transforma sua oferta em imagens, vídeos, posts,
          stories e anúncios para testar o interesse real do público.
        </p>
        <p className="text-[13px] md:text-sm text-accent/90 max-w-3xl mb-5">
          Criativo não é só arte bonita. É uma mensagem visual com dor,
          promessa e chamada para ação.
        </p>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-5">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {tutorialSteps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 text-[12px] md:text-[13px] text-foreground/90">
                  <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {s}
                </div>
                {i < tutorialSteps.length - 1 && (
                  <span className="text-muted-foreground/50 hidden md:inline">→</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Você não está criando arte. Você está testando mensagens para
            descobrir o que faz as pessoas prestarem atenção no seu app.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowZero((v) => !v)}
            className="btn-primary text-sm min-h-[44px]"
            type="button"
          >
            <Sparkles size={14} /> Não sei criar criativos
          </button>
          <a
            href={APP_CONFIG.GPT_AGENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 min-h-[44px] rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
          >
            <Sparkles size={14} /> Abrir Agente Arquiteto
          </a>
          <a
            href={LOVABLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 min-h-[44px] rounded-xl border border-white/15 hover:bg-white/5"
          >
            <ExternalLink size={14} /> Abrir Lovable
          </a>
        </div>

        {showZero && (
          <div className="mt-5 rounded-xl border border-accent/30 bg-accent/5 p-4 text-[13px] md:text-sm text-foreground/90 leading-relaxed">
            <div className="font-semibold mb-2 text-accent">Faça só isso agora:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Escreva qual dor seu app resolve.</li>
              <li>Escolha um público específico.</li>
              <li>Crie 3 ângulos diferentes.</li>
              <li>Transforme cada ângulo em post, story ou vídeo.</li>
              <li>Teste qual gera mais resposta.</li>
            </ol>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100 flex items-start gap-3">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        <div>
          Não comece por anúncio pago. Primeiro teste criativos orgânicos e
          veja se as pessoas respondem.
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5">
        <button
          type="button"
          onClick={() => setShowGlossary((v) => !v)}
          className="w-full flex items-center justify-between gap-3 p-4 text-left min-h-[48px]"
        >
          <span className="text-sm font-semibold text-foreground/90">Não entendi uma palavra</span>
          <ChevronDown size={16} className={`text-muted-foreground transition-transform ${showGlossary ? "rotate-180" : ""}`} />
        </button>
        {showGlossary && (
          <dl className="px-4 pb-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
            {glossary.map(([term, def]) => (
              <div key={term} className="flex gap-2">
                <dt className="text-accent font-semibold shrink-0">{term}:</dt>
                <dd className="text-foreground/80">{def}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
};


const ValidacaoIntro = () => {
  const [showGlossary, setShowGlossary] = useState(false);
  const [agentFallback, setAgentFallback] = useState<string | null>(null);
  const { activeProject } = useAppProjects();

  const appName = activeProject?.name?.trim() || "meu app";

  const inviteMessage = `Oi! Estou testando um app simples chamado ${appName}. Você pode usar por alguns minutos e me dizer onde travou, o que ficou confuso e se usaria de novo? Não quero elogio, quero feedback real.`;

  const agentValidationPrompt = `Estou na etapa de validação do programa "Fábrica de Apps com IA". Meu app é "${appName}". Preciso validar com 10 pessoas reais (não com opinião, com comportamento).\n\nMe ajude a:\n1. Escolher 10 pessoas realmente parecidas com meu público.\n2. Escrever uma mensagem de convite simples e honesta.\n3. Definir o que observar enquanto a pessoa usa.\n4. Diferenciar sinal forte de sinal fraco no feedback.\n5. Decidir o que ajustar primeiro depois dos testes.\n\nMe oriente passo a passo, sem encher de teoria.`;

  const tutorialSteps = [
    "Escolha 10 pessoas",
    "Envie o convite",
    "Observe o uso",
    "Anote dúvidas e travas",
    "Melhore uma coisa por vez",
  ];

  const glossary: [string, string][] = [
    ["Validação", "teste para descobrir se pessoas reais entendem, usam ou querem o app."],
    ["Usuário real", "pessoa parecida com o público que você quer atender."],
    ["Feedback", "resposta, dúvida ou comentário de quem testou."],
    ["Métrica", "número usado para medir resultado."],
    ["Objeção", "dúvida ou resistência que impede a pessoa de usar ou comprar."],
    ["Interesse real", "ação concreta, como clicar, testar, voltar, perguntar preço, indicar ou comprar."],
    ["Retenção", "quando a pessoa volta a usar depois do primeiro teste."],
    ["Sinal fraco", "elogio genérico, como 'achei legal'."],
    ["Sinal forte", "uso real, cadastro, compra, retorno, indicação ou pedido de acesso."],
  ];

  const guideMeThisStep = () =>
    copyPromptAndOpenAgent({
      prompt: agentValidationPrompt,
      successMessage:
        "Prompt copiado. Cole no Agente Arquiteto para revisar sua validação antes de enviar convites.",
      onClipboardFail: (p) => setAgentFallback(p),
    });

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteMessage);
      toast.success("Mensagem de convite copiada. Envie para 10 pessoas reais agora.");
    } catch {
      toast.error("Não foi possível copiar. Selecione manualmente.");
    }
  };

  const reviewInviteWithAgent = () => {
    const prompt = `Quero revisar este convite que vou mandar para pessoas reais testarem meu app "${appName}":\n\n${inviteMessage}\n\nMe diga se está claro, honesto e se ajuda a coletar feedback real (não elogio). Sugira pequenos ajustes se necessário.`;
    return copyPromptAndOpenAgent({
      prompt,
      successMessage: "Convite copiado. Cole no Agente Arquiteto para revisar antes de enviar.",
      onClipboardFail: (p) => setAgentFallback(p),
    });
  };

  const explainStepWithAgent = () =>
    copyPromptAndOpenAgent({
      emptyMessage: "Pergunte ao Agente Arquiteto o que ainda não ficou claro nesta etapa.",
    });

  return (
    <>
    <section className="mb-8 space-y-6">
      {/* CARD PRINCIPAL DA ETAPA */}
      <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent p-5 md:p-8 neon-shadow">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <Sparkles size={12} /> Validação — Modo Guiado
        </span>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gradient leading-tight mb-2">
          Valide seu app com pessoas reais
        </h2>

        <div className="rounded-xl border border-accent/30 bg-accent/10 p-4 mb-4">
          <div className="text-[11px] uppercase tracking-wider text-accent font-semibold mb-1">
            Meta desta etapa
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Conseguir <strong>10 pessoas reais</strong> usando seu app e anotar onde elas travam.
          </p>
          <p className="text-[13px] text-accent/90 mt-2 font-medium">
            Não peça opinião. Observe comportamento.
          </p>
        </div>

        <p className="text-xs md:text-sm text-muted-foreground max-w-3xl mb-5">
          Validação é descobrir se alguém realmente entende, usa e quer continuar usando o que você criou.
        </p>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-5">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {tutorialSteps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 text-[12px] md:text-[13px] text-foreground/90">
                  <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {s}
                </div>
                {i < tutorialSteps.length - 1 && (
                  <span className="text-muted-foreground/50 hidden md:inline">→</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Você não precisa de 1.000 usuários. Precisa de 10 pessoas reais usando com atenção.
          </p>
        </div>

        {/* CTA PRINCIPAL ORIENTADOR */}
        <button
          onClick={guideMeThisStep}
          type="button"
          className="btn-primary text-sm min-h-[48px] w-full sm:w-auto"
        >
          <Sparkles size={14} /> Me guiar nesta etapa
        </button>
      </div>

      {/* BLOCO FAÇA AGORA */}
      <div className="rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent p-5 md:p-6">
        <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-300 font-semibold mb-2">
          Faça agora
        </div>
        <h3 className="text-xl md:text-2xl font-heading font-bold leading-tight mb-2">
          Escolha 10 pessoas reais e envie o convite
        </h3>
        <p className="text-sm text-foreground/80 mb-4">
          Não precisa explicar o app. Peça para usarem e te contarem onde travaram, o que confundiu e se voltariam a usar.
        </p>

        <div className="rounded-xl border border-white/10 bg-black/30 p-4 mb-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Mensagem de convite
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {inviteMessage}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={copyInvite}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition min-h-[44px]"
          >
            <Copy size={14} /> Copiar mensagem de convite
          </button>
          <button
            type="button"
            onClick={() => toast.success("Abra um bloco de notas ou planilha e liste 10 nomes que se parecem com seu público real.")}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/15 bg-white/5 text-foreground/90 hover:bg-white/10 text-sm font-semibold min-h-[44px]"
          >
            <ListChecks size={14} /> Anotar meus 10 testadores
          </button>
          <button
            type="button"
            onClick={reviewInviteWithAgent}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15 text-sm font-semibold min-h-[44px]"
          >
            <Sparkles size={14} /> Revisar convite com o Agente
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100 flex items-start gap-3">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        <div>
          Elogio não é validação. Uso real, dúvida repetida, clique, cadastro, retorno, indicação ou compra são sinais mais fortes.
        </div>
      </div>

      {/* GLOSSÁRIO + EXPLICAR COM AGENTE */}
      <div className="rounded-xl border border-white/10 bg-white/5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-2">
          <button
            type="button"
            onClick={() => setShowGlossary((v) => !v)}
            className="flex-1 flex items-center justify-between gap-3 p-2 text-left min-h-[44px] rounded-lg hover:bg-white/5"
          >
            <span className="text-sm font-semibold text-foreground/90">Não entendi uma palavra</span>
            <ChevronDown size={16} className={`text-muted-foreground transition-transform ${showGlossary ? "rotate-180" : ""}`} />
          </button>
          <button
            type="button"
            onClick={explainStepWithAgent}
            className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15 min-h-[40px]"
          >
            <Sparkles size={12} /> Explicar esta etapa com o Agente
          </button>
        </div>
        {showGlossary && (
          <dl className="px-4 pb-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
            {glossary.map(([term, def]) => (
              <div key={term} className="flex gap-2">
                <dt className="text-accent font-semibold shrink-0">{term}:</dt>
                <dd className="text-foreground/80">{def}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {/* LOVABLE REBAIXADO COMO AÇÃO SECUNDÁRIA */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Use o Lovable depois de coletar feedback real. Não ajuste o app antes de observar 10 pessoas usando.
        </p>
        <a
          href={LOVABLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 text-xs px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 text-foreground/70 min-h-[40px]"
        >
          <ExternalLink size={12} /> Abrir Lovable depois
        </a>
      </div>
    </section>

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
              type="button"
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
              Copiar novamente
            </button>
            <button
              type="button"
              onClick={() => { openAgenteArquiteto(); }}
              className="px-3 py-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 text-xs font-semibold"
            >
              Abrir Agente Arquiteto
            </button>
            <button
              type="button"
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


function ModuleContent({ active, checklist, setChecklist, goTo }: ModuleContentProps) {
  if (active === "fundamentos") {
    return <FundamentosModule goTo={goTo} />;
  }

  if (active === "planejar") {
    return <PlanejarModule goTo={goTo} />;
  }
  if (active === "mvp") {
    return <MvpArquiteturaModule goTo={goTo} />;
  }

  if (active === "telas") {
    return <TelasFluxoModule />;
  }
  if (active === "publicar") {
    return <PublicarDominioModule />;
  }
  if (active === "teste") {
    return <TesteFinalModule />;
  }
  if (active === "legal") {
    return <LegalConfiancaModule />;
  }
  if (active === "comece") {
    return <ComeceAquiModule goTo={goTo} />;
  }


  if (active === "ideias") {
    return <IdeiasProntasModule onAnalisarViabilidade={() => goTo("validacao")} onProximoPasso={() => goTo("planejar")} />;
  }


  if (active === "construir") {
    return (
      <section>
        <ConstruirIntro />
        <ModuleHeader
          title="Siga as etapas de construção"
          subtitle="Comece pela Etapa 1. Só avance quando o Lovable entregar o resultado esperado."
        />
        <CommandList commands={COMMANDS_CONSTRUIR} moduleKey="construir" />
      </section>
    );
  }

  if (active === "login") {
    return (
      <section>
        <LoginIntro />
        <ModuleHeader
          title="Siga as etapas de login e banco"
          subtitle="Comece pela Etapa 1. Só avance quando o usuário conseguir entrar, sair e acessar a área correta."
        />
        <CommandList commands={COMMANDS_LOGIN} moduleKey="login" />
      </section>
    );
  }

  if (active === "seguranca") {
    return <SegurancaAppModule />;
  }



  if (active === "venda") {
    return (
      <section>
        <VendaIntro />
        <ModuleHeader
          title="Siga as etapas de venda"
          subtitle="Comece pela Etapa 1. Só avance quando uma pessoa leiga entender sua oferta em segundos."
        />
        <CommandList commands={COMMANDS_VENDA} moduleKey="venda" />
      </section>
    );
  }

  if (active === "monetizacao") {
    return (
      <section>
        <MonetizacaoIntro />
        <ModuleHeader
          title="Siga as etapas de monetização"
          subtitle="Comece pela Etapa 1. Só avance quando você tiver clareza do valor, do modelo e de uma oferta inicial para testar."
        />
        <CommandList commands={COMMANDS_MONETIZACAO} moduleKey="monetizacao" />
        <FaixasReferencia />
        <ChecklistBlock
          title="Revisão da etapa"
          items={[
            "Sei qual dor meu app resolve",
            "Sei para quem meu app foi feito",
            "Escolhi o modelo de cobrança",
            "Defini se será venda única, assinatura, freemium ou beta",
            "Escolhi uma faixa de valor inicial",
            "Criei uma oferta simples",
            "Expliquei o que está incluso",
            "Evitei promessa exagerada",
            "Testei ou vou testar com pessoas reais",
            "Sei quando ajustar o valor",
          ]}
          checklist={checklist}
          setChecklist={setChecklist}
          phase="monetizacao"
        />
      </section>
    );
  }

  if (active === "checkout") {

    return (
      <section>
        <CheckoutIntro />
        <ModuleHeader
          title="Siga as etapas de checkout e entrega"
          subtitle="Comece pela Etapa 1. Só avance quando o comprador conseguir pagar, receber orientação e entrar na entrega."
        />
        <CommandList commands={COMMANDS_CHECKOUT} moduleKey="checkout" />
        <ChecklistBlock
          title="Revisão da etapa"
          items={[
            "Comprador entende o que recebeu",
            "Comprador sabe onde entrar",
            "Comprador não fica perdido depois da compra",
            "Área protegida não aparece para visitantes",
            "Botão de compra abre o caminho correto",
            "Página de obrigado explica o próximo passo",
            "Visitante sem acesso não vê material pago",
            "Comprador liberado entra na entrega",
            "Admin consegue liberar e revogar acesso",
            "Existe caminho de suporte ou recuperação",
          ]}
          checklist={checklist}
          setChecklist={setChecklist}
          phase="checkout"
        />
      </section>
    );
  }

  if (active === "seo") {
    return (
      <section>
        <SeoIntro />
        <ModuleHeader
          title="Siga as etapas de SEO e GEO"
          subtitle="Comece pela Etapa 1. Só avance quando cada página tiver motivo claro para existir."
        />
        <CommandList commands={COMMANDS_SEO} moduleKey="seo" />
        <ChecklistBlock
          title="Revisão da etapa"
          items={[
            "Palavras-chave principais definidas",
            "Páginas SEO criadas",
            "FAQ útil publicado",
            "Páginas GEO explicam o app com clareza",
            "Páginas de nicho não estão duplicadas",
            "Schema FAQPage usa conteúdo real",
            "Schema SoftwareApplication não inventa dados",
            "Não há keyword stuffing",
            "Nenhuma promessa de resultado garantido",
          ]}
          checklist={checklist}
          setChecklist={setChecklist}
          phase="seo"
        />
      </section>
    );
  }

  if (active === "campanhas") {
    return <CampaignsModule checklist={checklist} setChecklist={setChecklist} />;
  }

  if (active === "criativos") {
    return (
      <section>
        <CriativosIntro />
        <CreativeGenerator />
        <ModuleHeader
          title="Siga as etapas de Criativos"
          subtitle="Comece pela Etapa 1. Cada etapa abre na aba Implementar no Lovable, com texto pronto para copiar."
        />
        <CommandList commands={COMMANDS_CRIATIVOS} moduleKey="criativos" />
        <ChecklistBlock
          title="Revisão da etapa"
          items={[
            "Defini a dor principal",
            "Defini o público",
            "Criei pelo menos 3 ângulos",
            "Criei criativo estático",
            "Criei roteiro de vídeo curto",
            "Criei sequência de stories",
            "Criei CTA claro",
            "Criei teste A/B",
            "Anotei métrica principal",
            "Organizei biblioteca de criativos",
            "Não usei promessa exagerada",
            "Testei antes de escalar",
          ]}
          checklist={checklist}
          setChecklist={setChecklist}
          phase="criativos"
        />
      </section>
    );
  }


  if (active === "metricas") {
    return <MetricasAppModule />;
  }
  if (active === "melhorias") {
    return <MelhoriasVersoesModule />;
  }
  if (active === "validacao") {
    return (
      <section>
        <ValidacaoIntro />
        <ViabilityAnalysisCard />
        <ModuleHeader
          title="Siga as etapas de Validação"
          subtitle="Comece pela Etapa 1. Cada etapa abre na aba Implementar no Lovable, com texto pronto para copiar."
        />
        <CommandList commands={COMMANDS_VALIDACAO} moduleKey="validacao" />
        <ChecklistBlock
          title="Revisão da etapa"
          items={[
            "Convidei 10 pessoas reais",
            "Pelo menos 5 testaram",
            "Pelo menos 3 entenderam sem ajuda",
            "Pelo menos 1 demonstrou interesse real",
            "Anotei dúvidas repetidas",
            "Separei elogio de sinal real",
            "Identifiquei o maior bloqueio",
            "Melhorei o app sem inflar o escopo",
            "Preparei novo teste",
            "Não mudei tudo por causa de uma opinião isolada",
          ]}
          checklist={checklist}
          setChecklist={setChecklist}
          phase="validacao"
        />
      </section>
    );
  }


  if (active === "checklist") {
    const overviewCards = [
      { title: "Ideia clara", desc: "Público, dor e promessa definidos." },
      { title: "Primeira versão funcional", desc: "Primeira versão criada e testada no celular. Próximas versões entram em Melhorias." },
      { title: "Venda preparada", desc: "Página, preço, checkout e entrega organizados." },
      { title: "Validação real", desc: "Pessoas reais testaram e deram sinais concretos." },
    ];
    return (
      <section>
        <ModuleHeader
          title="Painel de Prontidão do App"
          subtitle="Acompanhe se sua ideia já virou um app claro, funcional, vendável e pronto para ser testado com pessoas reais."
        />

        {APP_CONFIG.CHECKOUT_FABRICA_URL === "COLE_AQUI_A_URL_REAL" && (
          <GlassCard className="p-4 mb-5 border-red-400/40 bg-red-500/10">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-red-300 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-heading font-bold text-red-100">
                  Checkout real pendente
                </h3>
                <p className="text-xs text-red-100/90 mt-1 leading-relaxed">
                  Este programa ainda não está pronto para venda pública enquanto o link real
                  de pagamento não for configurado.
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        <GlassCard className="p-4 mb-5 border-accent/30">
          <p className="text-sm text-foreground/90">
            Você não precisa estar com tudo perfeito para validar. Mas precisa ter o básico funcionando antes de divulgar.
          </p>
        </GlassCard>

        <GlassCard className="p-5 mb-5">
          <h3 className="font-heading font-semibold mb-3">Como usar este painel</h3>
          <ol className="list-decimal list-inside space-y-1.5 text-sm text-muted-foreground">
            <li>Marque apenas o que realmente foi feito.</li>
            <li>Volte ao módulo correspondente quando uma fase estiver incompleta.</li>
            <li>Não pule para venda se a primeira versão funcional ainda não entrega o resultado principal.</li>
            <li>Não pule para campanha se a oferta ainda não está clara.</li>
            <li>Não escale antes de validar com pessoas reais.</li>
          </ol>
        </GlassCard>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {overviewCards.map((c) => (
            <GlassCard key={c.title} className="p-4">
              <h4 className="font-heading font-semibold text-sm mb-1 text-accent">{c.title}</h4>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </GlassCard>
          ))}
        </div>

        <div className="space-y-5">
          {CHECKLIST_PHASES.map((p) => {
            const doneCount = p.items.filter((item) => !!checklist[`${p.phase}__${item}`]).length;
            const total = p.items.length;
            let status: { label: string; cls: string };
            if (doneCount === 0) status = { label: "Pendente", cls: "bg-white/10 text-muted-foreground border-white/15" };
            else if (doneCount < total) status = { label: "Em andamento", cls: "bg-accent/15 text-accent border-accent/30" };
            else status = { label: "Concluída", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };

            return (
              <GlassCard key={p.phase} className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                  <h3 className="font-heading font-semibold">{p.phase}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${status.cls}`}>
                    {status.label} · {doneCount}/{total}
                  </span>
                </div>
                <ul className="space-y-2">
                  {p.items.map((item) => {
                    const key = `${p.phase}__${item}`;
                    const done = !!checklist[key];
                    return (
                      <li key={item}>
                        <label className="flex items-center gap-3 p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition">
                          <input
                            type="checkbox"
                            checked={done}
                            onChange={() =>
                              setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
                            }
                            className="accent-accent w-4 h-4"
                          />
                          <span
                            className={`text-sm ${
                              done ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {item}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
                {p.moduleId && p.moduleLabel && (
                  <div className="mt-4">
                    <button
                      onClick={() => goTo(p.moduleId as ModuleId)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-foreground/90 transition"
                    >
                      {p.moduleLabel} →
                    </button>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>

        <GlassCard className="p-5 mt-6">
          <h3 className="font-heading font-semibold mb-2">Quando posso avançar?</h3>
          <p className="text-sm text-muted-foreground">
            Use 70% como sinal de prontidão para testar, não como perfeição. Avance quando o app estiver claro, funcional e pronto para receber pessoas reais. Se uma fase crítica estiver incompleta, volte ao módulo correspondente antes de divulgar.
          </p>
        </GlassCard>

        <GlassCard className="p-5 mt-4 border-amber-500/30">
          <h3 className="font-heading font-semibold mb-2 text-amber-300">Antes de vender ou divulgar, confira</h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
            <li>O usuário entende o que o app faz?</li>
            <li>O botão principal funciona?</li>
            <li>A página de venda explica a oferta?</li>
            <li>A entrega está protegida?</li>
            <li>Você testou no celular?</li>
            <li>Pelo menos uma pessoa real conseguiu usar?</li>
          </ul>
        </GlassCard>
      </section>
    );
  }


  if (active === "erros") {
    return <ErrorsModule />;
  }

  if (active === "ativar") {
    return (
      <section>
        <ModuleHeader
          title="Ative seu acesso ao programa"
          subtitle="Cole o código recebido após a compra para liberar ou estender seu acesso à Fábrica de Apps com IA."
        />

        <GlassCard className="p-4 mb-5 border-accent/30 max-w-xl">
          <p className="text-sm text-foreground/90">
            Digite o código que você recebeu após a compra e clique em Resgatar código.
          </p>
        </GlassCard>

        <div className="max-w-xl">
          <GiftCodeRedemption />
        </div>

        <GlassCard className="p-5 mt-5 max-w-xl">
          <h3 className="font-heading font-semibold mb-2">Não recebeu seu código?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Verifique seu e-mail, caixa de spam, WhatsApp ou mensagem de suporte. Se ainda não encontrou, fale com o suporte informando o e-mail usado na compra.
          </p>
          <button
            onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL, "Não recebi meu código de acesso")}
            className="text-xs px-3 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 inline-flex items-center gap-2"
          >
            <LifeBuoy size={14} /> Falar com suporte
          </button>
        </GlassCard>

        <GlassCard className="p-5 mt-4 max-w-xl">
          <h3 className="font-heading font-semibold mb-2">Quando posso avançar?</h3>
          <p className="text-sm text-muted-foreground">
            Avance quando o código for aceito e seu acesso estiver liberado.
          </p>
        </GlassCard>
      </section>
    );
  }


  return null;
}

// ====== Sub-blocos ======

function ChecklistBlock({
  title,
  items,
  checklist,
  setChecklist,
  phase,
}: {
  title: string;
  items: string[];
  checklist: Record<string, boolean>;
  setChecklist: (v: Record<string, boolean> | ((p: Record<string, boolean>) => Record<string, boolean>)) => void;
  phase: string;
}) {
  return (
    <GlassCard className="mt-6 p-5">
      <h3 className="font-heading font-semibold mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => {
          const key = `${phase}__${item}`;
          const done = !!checklist[key];
          return (
            <li key={item}>
              <label className="flex items-center gap-3 p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() =>
                    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                  className="accent-accent w-4 h-4"
                />
                <span
                  className={`text-sm ${
                    done ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {item}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}

const DIAGNOSTIC_COMMAND = `Analise meu app e identifique o problema principal.

O que está acontecendo:
[descreva o erro]

O que eu tentei fazer:
[descreva]

Quando o erro aparece:
[descreva]

Último comando que enviei:
[cole aqui, se tiver]

Verifique:
1. Se é erro de layout.
2. Se é erro de login.
3. Se é erro de banco.
4. Se é erro de acesso.
5. Se é erro de botão.
6. Se é erro de deploy.
7. Se é erro de regra ou permissão.
8. Se o Lovable alterou algo que já estava funcionando.

Não refaça o app inteiro.
Primeiro me diga:
1. Causa provável.
2. Risco.
3. O que não devo mexer.
4. Comando exato de correção.
5. Como testar depois.`;

const ERROR_CATEGORIES = [
  "Todos",
  "Lovable",
  "Login",
  "Banco",
  "Mobile",
  "Acesso",
  "Venda",
  "Divulgação",
  "Validação",
  "Deploy",
  "Créditos",
];

const SEVERITY_STYLES: Record<string, string> = {
  Leve: "bg-white/10 text-muted-foreground border-white/15",
  Médio: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Crítico: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

function ErrorsModule() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const { context } = useProjectContext();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMMON_ERRORS.filter((e) => {
      const matchCat = category === "Todos" || e.category === category;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.explanation.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const wrapForError = (e: { title: string; explanation: string; command: string }) =>
    wrapErrorCorrection({
      context,
      errorTitle: e.title,
      errorExplanation: e.explanation,
      command: e.command,
    });

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Comando copiado. Agora cole no Lovable.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <section>
      <ModuleHeader
        title="Central de Correção e Resgate"
        subtitle="Travou em alguma etapa? Encontre o problema, copie o comando de correção e volte para o Lovable."
      />

      <GlassCard className="p-4 mb-5 border-accent/30">
        <p className="text-sm text-foreground/90">
          Não refaça o app inteiro por causa de um erro. Primeiro diagnostique, corrija e teste.
        </p>
      </GlassCard>

      <GlassCard className="p-5 mb-5">
        <h3 className="font-heading font-semibold mb-1">Não sei qual é meu erro</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Use este diagnóstico quando você não sabe se o problema é no Lovable, login, banco, mobile, acesso, botão ou venda.
        </p>
        <div className="rounded-lg border border-white/10 bg-black/40 max-h-44 overflow-auto mb-3">
          <pre className="text-xs p-3 whitespace-pre-wrap font-mono text-foreground/85">
            {DIAGNOSTIC_COMMAND}
          </pre>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => copy(DIAGNOSTIC_COMMAND)}
            className="px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 inline-flex items-center gap-2 text-sm font-semibold"
          >
            <Copy size={14} /> Copiar diagnóstico geral
          </button>
          {APP_CONFIG.GPT_AGENT_URL && (
            <a
              href={APP_CONFIG.GPT_AGENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 inline-flex items-center gap-2 text-sm"
            >
              <ExternalLink size={14} /> Abrir Agente Arquiteto
            </a>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Se você não sabe explicar o erro, converse com o Agente antes de corrigir no Lovable.
        </p>
      </GlassCard>

      <div className="relative mb-4 max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite seu problema"
          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-accent/50 outline-none text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {ERROR_CATEGORIES.map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                active
                  ? "bg-accent/20 border-accent/50 text-accent"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((e) => (
          <GlassCard key={e.title} className="p-5 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <AlertTriangle size={16} className="text-amber-400" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {e.category}
              </span>
              {e.severity && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    SEVERITY_STYLES[e.severity] || ""
                  }`}
                >
                  {e.severity}
                </span>
              )}
            </div>
            <h3 className="font-heading font-semibold">{e.title}</h3>
            <p className="text-sm text-muted-foreground">{e.explanation}</p>
            <p className="text-sm">
              <strong className="text-accent">O que fazer:</strong> {e.fix}
            </p>
            <div className="rounded-lg border border-white/10 bg-black/40 max-h-40 overflow-auto">
              <pre className="text-xs p-3 whitespace-pre-wrap font-mono text-foreground/85">
                {wrapForError(e)}
              </pre>
            </div>
            <button
              onClick={() => copy(wrapForError(e))}
              className="px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 inline-flex items-center gap-2 text-sm font-semibold"
            >
              <Copy size={14} /> Copiar
            </button>
            <p className="text-xs text-muted-foreground">
              Depois de corrigir, teste antes de avançar.
            </p>
          </GlassCard>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nada encontrado. Tente outra palavra ou outra categoria.
          </p>
        )}
      </div>

      <GlassCard className="p-5 mt-6">
        <h3 className="font-heading font-semibold mb-3">Antes de chamar suporte</h3>
        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside mb-3">
          <li>Copiei o diagnóstico geral</li>
          <li>Colei no Lovable</li>
          <li>Testei a correção</li>
          <li>O erro continuou</li>
          <li>Tenho print ou descrição do problema</li>
          <li>Sei em qual módulo o erro aconteceu</li>
        </ul>
        <p className="text-xs text-muted-foreground">
          Quanto mais claro estiver o erro, mais rápido ele será resolvido.
        </p>
      </GlassCard>
    </section>
  );
}

// ====== Geradores rápidos ======

function CampaignGenerator() {
  const [f, setF] = useState({
    name: "", audience: "", pain: "", benefit: "",
    channel: "Instagram", objective: "Leads", budget: "", cta: "",
  });
  const [generated, setGenerated] = useState("");

  const generate = () => {
    const text = `Crie uma campanha completa para o app "${f.name || "[nome do app]"}".

Público: ${f.audience || "[público]"}
Dor: ${f.pain || "[dor]"}
Benefício: ${f.benefit || "[benefício]"}
Canal: ${f.channel}
Objetivo: ${f.objective}
Orçamento: ${f.budget || "[informe]"}
CTA: ${f.cta || "[CTA]"}

Entregue:
1. Posicionamento da campanha
2. 3 ângulos diferentes
3. Copy principal
4. 5 variações de criativo
5. Calendário de 7 dias
6. Métricas a acompanhar
7. Critério para considerar sucesso`;
    setGenerated(text);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(generated);
      toast.success("Comando copiado. Agora cole no Lovable.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <GlassCard className="mt-6 p-5 md:p-6">
      <h3 className="font-heading font-semibold mb-1">Gerador rápido de campanha</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Preencha os campos e gere um comando pronto para o Lovable.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="Nome do app" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
        <Input label="Público" value={f.audience} onChange={(v) => setF({ ...f, audience: v })} />
        <Input label="Dor" value={f.pain} onChange={(v) => setF({ ...f, pain: v })} />
        <Input label="Benefício" value={f.benefit} onChange={(v) => setF({ ...f, benefit: v })} />
        <Select
          label="Canal"
          value={f.channel}
          onChange={(v) => setF({ ...f, channel: v })}
          options={["Instagram", "Meta Ads", "Google", "TikTok", "WhatsApp", "LinkedIn"]}
        />
        <Select
          label="Objetivo"
          value={f.objective}
          onChange={(v) => setF({ ...f, objective: v })}
          options={["Leads", "Vendas", "Tráfego", "Engajamento", "Lista de espera"]}
        />
        <Input label="Orçamento" value={f.budget} onChange={(v) => setF({ ...f, budget: v })} />
        <Input label="CTA" value={f.cta} onChange={(v) => setF({ ...f, cta: v })} />
      </div>
      <button onClick={generate} className="btn-primary mt-4 text-sm">
        <Sparkles size={14} /> Gerar comando
      </button>
      {generated && (
        <div className="mt-5">
          <div className="rounded-xl border border-white/10 bg-black/40 max-h-64 overflow-auto">
            <pre className="text-xs p-4 whitespace-pre-wrap font-mono text-foreground/90">
              {generated}
            </pre>
          </div>
          <button onClick={copy} className="mt-3 px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 inline-flex items-center gap-2 text-sm font-semibold">
            <Copy size={14} /> Copiar para implementar no Lovable
          </button>
        </div>
      )}
    </GlassCard>
  );
}

function CreativeGenerator() {
  const [f, setF] = useState({
    name: "", audience: "", pain: "", promise: "",
    format: "imagem", tone: "direto", channel: "Instagram",
  });
  const [generated, setGenerated] = useState("");

  const generate = () => {
    const text = `Crie um criativo para divulgar este app.

App: ${f.name || "[nome]"}
Público: ${f.audience || "[público]"}
Dor: ${f.pain || "[dor]"}
Promessa: ${f.promise || "[promessa]"}
Formato: ${f.format}
Canal: ${f.channel}
Tom: ${f.tone}

Entregue:
1. Gancho.
2. Texto principal.
3. Ideia visual.
4. CTA.
5. Variações (pelo menos 2 ângulos diferentes).
6. Métrica para testar.

Regras:
- Não usar promessa exagerada.
- Não usar clichês.
- Focar em clareza, dor, promessa e ação.`;
    setGenerated(text);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(generated);
      toast.success("Comando copiado. Agora cole no Lovable.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <GlassCard id="gerador-criativo" className="mt-2 mb-6 p-5 md:p-6 border-accent/30">
      <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
        <h3 className="font-heading font-semibold">Gerador rápido de criativo</h3>
        <span className="text-[11px] uppercase tracking-wider text-accent px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
          Comece por aqui
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Preencha e gere um comando pronto para o Lovable. Onde tiver texto entre colchetes, apague e escreva as informações do seu app.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="Nome do app" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
        <Input label="Público" value={f.audience} onChange={(v) => setF({ ...f, audience: v })} />
        <Input label="Dor" value={f.pain} onChange={(v) => setF({ ...f, pain: v })} />
        <Input label="Promessa" value={f.promise} onChange={(v) => setF({ ...f, promise: v })} />
        <Select
          label="Formato"
          value={f.format}
          onChange={(v) => setF({ ...f, format: v })}
          options={["imagem", "vídeo", "reels", "story", "anúncio"]}
        />
        <Select
          label="Canal (opcional)"
          value={f.channel}
          onChange={(v) => setF({ ...f, channel: v })}
          options={["Instagram", "Stories", "Reels", "TikTok", "WhatsApp", "Meta Ads", "LinkedIn", "Outro"]}
        />
        <Select
          label="Tom"
          value={f.tone}
          onChange={(v) => setF({ ...f, tone: v })}
          options={["direto", "emocional", "educativo", "comparativo", "urgente"]}
        />
      </div>
      <button onClick={generate} className="btn-primary mt-4 text-sm">
        <Sparkles size={14} /> Gerar comando de criativo
      </button>

      {generated && (
        <div className="mt-5">
          <div className="rounded-xl border border-white/10 bg-black/40 max-h-64 overflow-auto">
            <pre className="text-xs p-4 whitespace-pre-wrap font-mono text-foreground/90">
              {generated}
            </pre>
          </div>
          <button onClick={copy} className="mt-3 px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 inline-flex items-center gap-2 text-sm font-semibold">
            <Copy size={14} /> Copiar para implementar no Lovable
          </button>
        </div>
      )}
    </GlassCard>
  );
}

const Input = ({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) => (
  <label className="block">
    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-accent/50 outline-none text-sm"
    />
  </label>
);

const Select = ({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
  <label className="block">
    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-accent/50 outline-none text-sm"
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-background">
          {o}
        </option>
      ))}
    </select>
  </label>
);

export default function Entrega() {
  return (
    <ProjectContextProvider>
      <AppProjectsProvider>
        <UserProgressProvider>
          <AgentChatProvider>
            <EntregaInner />
            <ProjectContextDrawer />
            <MyAppsDrawer />
            <AgentChatDrawer />
          </AgentChatProvider>
        </UserProgressProvider>
      </AppProjectsProvider>
    </ProjectContextProvider>
  );
}



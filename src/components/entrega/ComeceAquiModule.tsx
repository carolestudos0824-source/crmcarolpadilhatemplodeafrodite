import { useProjectJourney } from "@/lib/journey";
import {
  Sparkles,
  ExternalLink,
  Lightbulb,
  AlertTriangle,
  Compass,
  Search,
  FolderPlus,
  ArrowUp,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

import { PainSearchNextStep } from "@/components/entrega/PainSearchNextStep";
import { useAppProjects } from "@/hooks/useAppProjects";
import { APP_CONFIG } from "@/config/appConfig";
import { MODULES, MODULE_ORDER, type ModuleId } from "@/data/entregaModules";

const LOVABLE_URL = "https://lovable.dev";

type Props = {
  goTo: (id: ModuleId) => void;
};

const valueCards = [
  { title: "Programa", desc: "Mostra a ordem certa do que fazer." },
  { title: "Lovable", desc: "Constrói o app a partir dos comandos." },
  { title: "Agente Arquiteto", desc: "Ajuda você a pensar, corrigir e decidir antes de construir." },
];

const journeySteps: [string, string][] = [
  ["Comece com clareza", "Entenda o Lovable, escolha sua ideia e decida o que o app precisa fazer."],
  ["Planeje antes de construir", "Defina público, dor, promessa, MVP, telas e fluxo principal."],
  ["Construa a base no Lovable", "Copie um comando por vez, cole no Lovable e crie o app uma etapa por vez."],
  ["Prepare venda, entrega e confiança", "Página de venda, monetização, checkout, termos e área de entrega."],
  ["Publique, teste e divulgue", "Publique no domínio, faça o teste final e crie campanhas com criativos."],
  ["Meça, valide e melhore", "Use métricas e feedback real para lançar uma nova versão sem quebrar o que funciona."],
];

const phaseMap: { title: string; mods: ModuleId[] }[] = [
  { title: "Fase 1 — Começar com clareza", mods: ["fundamentos", "comece", "ideias"] },
  { title: "Fase 2 — Planejar antes de construir", mods: ["planejar", "mvp", "telas"] },
  { title: "Fase 3 — Construir a base", mods: ["construir", "login"] },
  { title: "Fase 4 — Preparar venda e entrega", mods: ["venda", "monetizacao", "checkout", "legal"] },
  { title: "Fase 5 — Publicar e testar", mods: ["publicar", "teste"] },
  { title: "Fase 6 — Divulgar e ser encontrada", mods: ["seo", "campanhas", "criativos"] },
  { title: "Fase 7 — Medir, validar e melhorar", mods: ["metricas", "validacao", "melhorias"] },
  { title: "Fase 8 — Revisar e resolver problemas", mods: ["checklist", "erros", "ativar"] },
];

const regrasAvancar = [
  "Primeiro escolha um app.",
  "Depois defina o fluxo principal.",
  "Só copie comandos quando entender o objetivo da etapa.",
  "Só publique após revisar confiança, termos e suporte.",
  "Só divulgue depois de testar com um usuário real.",
  "Só escale depois de medir uso, feedback e conversão.",
  "Só avance quando a etapa atual estiver funcionando.",
];

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

type JourneyId = "comecando_do_zero" | "app_completo_por_versoes" | "ja_tenho_um_app";

const JOURNEYS: Record<
  JourneyId,
  { title: string; next: ModuleId; nextLabel: string; helper: string }
> = {
  comecando_do_zero: {
    title: "Começando do zero",
    next: "mvp",
    nextLabel: "Definir o MVP",
    helper:
      "Vamos clarear ideia, público, dor e a primeira versão funcional do seu app antes de gastar créditos no Lovable.",
  },
  app_completo_por_versoes: {
    title: "Quero um app completo",
    next: "planejar",
    nextLabel: "Planejar por versões",
    helper:
      "Construa por versões: MVP, V2, V3 — login, banco, monetização, checkout e escala entram aos poucos, sem jogar tudo de uma vez no Lovable.",
  },
  ja_tenho_um_app: {
    title: "Já tenho um app",
    next: "melhorias",
    nextLabel: "Auditar e melhorar meu app",
    helper:
      "Vamos auditar telas, login, banco, segurança, monetização e checkout — depois aplicar correções cirúrgicas e um plano de melhorias sem quebrar o que já funciona.",
  },
};

export function ComeceAquiModule({ goTo }: Props) {
  const { openDrawer, activeProject } = useAppProjects();
  const moduleLabel = (id: ModuleId) => MODULES.find((m) => m.id === id)?.label ?? id;
  const hasApp = !!activeProject;
  const [persistedJourney, persistJourney] = useProjectJourney(activeProject?.id ?? null);
  const [journey, setJourney] = useState<JourneyId | null>(
    (persistedJourney as JourneyId | null) ?? null,
  );

  const pickJourney = (id: JourneyId) => {
    setJourney(id);
    if (activeProject?.id) {
      persistJourney(id as PersistedJourneyId);
    } else {
      toast("Selecione um Projeto em foco para salvar sua jornada.", {
        description: "A navegação continua, mas a escolha não fica salva sem um projeto ativo.",
      });
    }
    // feedback visual antes da navegação
    setTimeout(() => goTo(JOURNEYS[id].next), 220);
  };

  return (
    <section>
      {/* Hero */}
      <header className="mb-6">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <Sparkles size={12} /> Painel Arquiteto de Apps
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Crie seu app do zero, publique e valide com pessoas reais
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Você não precisa saber programar. Siga a jornada, copie um comando por vez, cole no Lovable e avance apenas quando cada etapa estiver funcionando.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 items-center">
          {hasApp ? (
            <>
              <button
                onClick={() => goTo("ideias")}
                className="btn-primary w-full sm:w-auto min-h-[44px]"
              >
                <Sparkles size={16} /> Continuar pela Etapa 1
              </button>
              <button
                type="button"
                onClick={() => scrollToId("pain-search")}
                className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/5 inline-flex items-center gap-2 text-sm min-h-[44px]"
              >
                <Search size={16} /> Usar Busca Inteligente
              </button>
              <a
                href={LOVABLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 inline-flex items-center gap-1.5"
              >
                <ExternalLink size={13} /> Abrir Lovable
              </a>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={openDrawer}
                className="btn-primary w-full sm:w-auto min-h-[44px]"
              >
                <FolderPlus size={16} /> Criar ou selecionar app
              </button>
              <button
                type="button"
                onClick={() => scrollToId("pain-search")}
                className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/5 inline-flex items-center gap-2 text-sm min-h-[44px]"
              >
                <Search size={16} /> Usar Busca Inteligente
              </button>
              <button
                type="button"
                onClick={() => goTo("ideias")}
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 inline-flex items-center gap-1.5"
              >
                <Lightbulb size={13} /> Ver ideias prontas
              </button>
            </>
          )}
        </div>
      </header>

      {/* Três formas de usar a Fábrica */}
      <GlassCard className="p-5 mb-6 border-accent/30 bg-gradient-to-br from-accent/[0.08] via-white/[0.02] to-transparent">
        <div className="text-[11px] uppercase tracking-wider text-accent mb-2">
          Três formas de usar a Fábrica
        </div>
        <p className="text-sm text-foreground/90 mb-3">
          Você pode começar um app do zero, evoluir um app completo por versões ou auditar um app que já existe. A Fábrica cria qualquer app, construído por versões.
        </p>
        <div className="grid sm:grid-cols-3 gap-2.5" role="radiogroup" aria-label="Escolha sua jornada">
          {(Object.keys(JOURNEYS) as JourneyId[]).map((id) => {
            const j = JOURNEYS[id];
            const selected = journey === id;
            const desc =
              id === "comecando_do_zero"
                ? "Crie a primeira versão funcional."
                : id === "app_completo_por_versoes"
                ? "Construa por versões, sem jogar tudo de uma vez no Lovable."
                : "Use os módulos para auditar, corrigir, melhorar e escalar.";
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => pickJourney(id)}
                className={`text-left rounded-lg border p-3 min-h-[88px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${
                  selected
                    ? "border-accent bg-accent/15 shadow-[0_0_24px_-12px_rgba(34,211,238,0.7)]"
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-accent/40"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-accent mb-1">
                  {j.title}
                  {selected && <Sparkles size={11} />}
                </div>
                <div className="text-xs text-muted-foreground">{desc}</div>
                <div className="mt-2 text-[11px] inline-flex items-center gap-1 text-foreground/80">
                  <ArrowRight size={11} />
                  <span>{j.nextLabel}</span>
                </div>
              </button>
            );
          })}
        </div>
        {journey && (
          <div className="mt-3 rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs text-foreground/90 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="flex-1">{JOURNEYS[journey].helper}</span>
            <button
              type="button"
              onClick={() => goTo(JOURNEYS[journey].next)}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-accent/50 bg-accent/15 text-accent hover:bg-accent/25 font-medium min-h-[36px]"
            >
              {JOURNEYS[journey].nextLabel}
              <ArrowRight size={12} />
            </button>
          </div>
        )}
      </GlassCard>



      {/* Comece seu primeiro app em 3 passos */}
      <section
        aria-label="Comece seu primeiro app em 3 passos"
        className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      >
        <header className="mb-4">
          <h2 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Comece seu primeiro app em 3 passos
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Caminho enxuto para sair do zero sem se perder.
          </p>
        </header>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {[
            {
              n: 1,
              title: "Escolha seu app",
              text: "Selecione um app existente ou crie um novo projeto para personalizar os comandos.",
            },
            {
              n: 2,
              title: "Defina o problema principal",
              text: "Use a Busca Inteligente ou o Agente para clarear o que o app precisa resolver.",
            },
            {
              n: 3,
              title: "Copie o comando certo",
              text: "Cole no Lovable um comando por vez e avance só quando funcionar.",
            },
          ].map((s) => (
            <li
              key={s.n}
              className="rounded-xl border border-white/10 bg-background/40 p-3"
            >
              <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 text-accent text-sm font-bold flex items-center justify-center mb-2">
                {s.n}
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-snug">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap items-center gap-3">
          {hasApp ? (
            <button
              type="button"
              onClick={() => goTo("ideias")}
              className="btn-primary w-full sm:w-auto min-h-[44px]"
            >
              <Sparkles size={16} /> Continuar pela Etapa 1
            </button>
          ) : (
            <button
              type="button"
              onClick={openDrawer}
              className="btn-primary w-full sm:w-auto min-h-[44px]"
            >
              <FolderPlus size={16} /> Criar ou selecionar app
            </button>
          )}
          <button
            type="button"
            onClick={() => scrollToId("pain-search")}
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 inline-flex items-center gap-1.5"
          >
            <Search size={13} /> Usar Busca Inteligente
          </button>
        </div>
      </section>

      {/* Busca inteligente */}
      <div className="mt-4">
        <PainSearchNextStep goTo={goTo} />
      </div>

      {/* Resumo: Seu caminho até o app publicado */}
      <header className="mt-8 mb-3">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <Sparkles size={12} /> Sua jornada
        </span>
        <h2 className="text-lg md:text-xl font-heading font-bold leading-tight mb-1">
          Seu caminho até o app publicado
        </h2>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Siga uma etapa por vez. Não tente construir, vender e escalar tudo no mesmo dia.
        </p>
      </header>

      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
        {journeySteps.map(([t], i) => (
          <li
            key={t}
            className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
          >
            <span className="shrink-0 w-6 h-6 rounded-md bg-accent/15 border border-accent/30 text-accent text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <span className="text-xs sm:text-sm text-foreground/85 leading-snug">{t}</span>
          </li>
        ))}
      </ol>

      {/* Mapa da jornada */}
      <GlassCard className="p-4 sm:p-5 mb-6">
        <h3 className="font-heading font-semibold text-base md:text-lg mb-1">
          Mapa da jornada
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Você não precisa fazer tudo de uma vez. Siga a ordem para não se perder.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {phaseMap.map((phase) => {
            const mods = phase.mods.filter((m) => (MODULE_ORDER as string[]).includes(m));
            if (mods.length === 0) return null;
            return (
              <div key={phase.title} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <h4 className="font-heading font-semibold text-sm text-accent mb-2">{phase.title}</h4>
                <ul className="flex flex-wrap gap-1.5">
                  {mods.map((m) => (
                    <li key={m}>
                      <button
                        type="button"
                        onClick={() => goTo(m)}
                        className="text-[11px] px-2 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-foreground/85 min-h-[32px]"
                      >
                        {moduleLabel(m)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Regras para avançar sem se perder */}
      <GlassCard className="p-4 sm:p-5 mb-6 border-accent/25 bg-accent/[0.04]">
        <h3 className="font-heading font-semibold text-base md:text-lg mb-2 text-foreground">
          Regras para avançar sem se perder
        </h3>
        <ul className="space-y-1.5 text-sm text-foreground/90">
          {regrasAvancar.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-accent shrink-0">✓</span>
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-muted-foreground mt-3">
          Você ainda pode navegar livremente pelos módulos, mas a ordem recomendada evita retrabalho.
        </p>
      </GlassCard>

      {/* CTA reforço */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => goTo("ideias")} className="btn-primary">
          <Sparkles size={16} /> Começar pela Etapa 1
        </button>
        <button
          onClick={() => goTo("ideias")}
          className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/5 inline-flex items-center gap-2 text-sm"
        >
          <Lightbulb size={16} /> Ver ideias prontas
        </button>
        {APP_CONFIG.GPT_AGENT_URL && (
          <a
            href={APP_CONFIG.GPT_AGENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 inline-flex items-center gap-2 text-sm font-semibold"
          >
            <ExternalLink size={16} /> Abrir Agente Arquiteto
          </a>
        )}
        <a
          href={LOVABLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/5 inline-flex items-center gap-2 text-sm"
        >
          <ExternalLink size={16} /> Abrir Lovable
        </a>
      </div>

      {/* Como este programa funciona — recolhível */}
      <details className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] group">
        <summary className="cursor-pointer list-none flex items-center justify-between gap-3 px-4 py-3 text-sm text-foreground/90 hover:text-foreground transition">
          <span className="inline-flex items-center gap-2">
            <Compass size={14} className="text-accent" />
            Como este programa funciona
          </span>
          <span className="text-[10px] uppercase tracking-wider text-accent group-open:hidden">Mostrar</span>
          <span className="text-[10px] uppercase tracking-wider text-accent hidden group-open:inline">Ocultar</span>
        </summary>

        <div className="p-4 space-y-4 border-t border-white/10">
          <div>
            <h4 className="font-heading font-semibold text-sm mb-2">Como usar a Fábrica de Apps com IA</h4>
            <p className="text-sm text-foreground/85 mb-3 leading-relaxed">
              Este programa é o seu guia. Você copia os comandos daqui e cola no Lovable do aplicativo que está criando. A Fábrica de Apps não é o app final. Ela ensina você a construir o seu próprio app passo a passo.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-3">
                <h5 className="font-heading font-semibold text-xs text-amber-200 mb-1">Agente Arquiteto</h5>
                <p className="text-xs text-amber-100/85">Use para pensar, decidir, tirar dúvidas e organizar ideias antes de construir.</p>
              </div>
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-3">
                <h5 className="font-heading font-semibold text-xs text-accent mb-1">Lovable</h5>
                <p className="text-xs text-foreground/75">Use para aplicar comandos e construir o app.</p>
              </div>
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3">
                <h5 className="font-heading font-semibold text-xs text-emerald-300 mb-1">Fábrica de Apps</h5>
                <p className="text-xs text-foreground/75">Use como trilha guiada para saber qual etapa fazer agora e quando avançar.</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-foreground/85 mb-3">
              Aqui você não recebeu apenas uma lista de comandos. Você recebeu uma jornada guiada para transformar uma ideia em app, o app em oferta e a oferta em validação real.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {valueCards.map((c) => (
                <div key={c.title} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <h5 className="font-heading font-semibold text-xs text-accent mb-1">{c.title}</h5>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-2">Como usar este programa</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-sm text-muted-foreground mb-2">
              <li>Leia a etapa.</li>
              <li>Copie o comando.</li>
              <li>Cole no Lovable.</li>
              <li>Espere o resultado.</li>
              <li>Volte aqui e marque como feito.</li>
            </ol>
            <p className="text-xs text-muted-foreground">Repita esse ciclo em cada módulo. Um comando por vez.</p>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100 flex items-start gap-3">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div>
              <strong>Regra de ouro:</strong> um comando por vez. Não pule etapas.
              <div className="mt-1 text-amber-100/90">
                Se o Lovable entregar algo errado, vá para Erros comuns antes de continuar.
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-2">Se você está começando do zero</h4>
            <p className="text-sm text-muted-foreground">
              Não se preocupe em entender todos os módulos agora. Sua única tarefa inicial é escolher uma ideia e avançar para o primeiro comando. O programa vai conduzir o restante.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-2">Quando posso avançar?</h4>
            <p className="text-sm text-muted-foreground">
              Avance quando você tiver escolhido uma ideia e entendido que deve seguir a jornada em ordem, sem pular etapas.
            </p>
          </div>
        </div>
      </details>
    </section>
  );
}

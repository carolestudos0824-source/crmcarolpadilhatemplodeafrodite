import { useState } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  Bug,
  Eye,
  Lock,
  MousePointerClick,
  ShoppingCart,
  Smartphone,
  HelpCircle,
  Bot,
  Wrench,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  Circle,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useUserProgress } from "@/hooks/useUserProgress";
import {
  CopyCommandWarning,
  wrapLovable,
} from "@/components/entrega/CopyCommandWarning";

const AGENT_HELP_PROMPT = `Estou criando um aplicativo no Lovable e preciso fazer um teste final antes de divulgar. Me ajude a criar um checklist completo para testar: desktop, mobile, login, formulários, botões, checkout, entrega, links, textos, imagens, erros, página branca, scroll horizontal e experiência do usuário.`;

type TabId = "lovable" | "agente" | "corrigir" | "avancar";

type Etapa = {
  n: number;
  icon: typeof ShieldCheck;
  title: string;
  tabs: Record<TabId, string>;
};

const ETAPAS: Etapa[] = [
  {
    n: 1,
    icon: Eye,
    title: "Testar como visitante",
    tabs: {
      lovable:
        "Crie um checklist para testar meu app como visitante sem login. Verifique se a página inicial abre, se a promessa está clara, se os botões principais funcionam, se não há links falsos, textos provisórios ou páginas quebradas.",
      agente:
        "Me ajude a testar meu app como visitante. Quero saber se uma pessoa nova entende o que o app faz, para quem é, qual botão clicar e qual próximo passo seguir.",
      corrigir:
        "O visitante não entende o que fazer no app. Revise a página inicial, CTA principal, explicação da oferta e caminho até a ação principal.",
      avancar:
        "Avance quando uma pessoa nova conseguir abrir o app e entender o próximo passo sem explicação.",
    },
  },
  {
    n: 2,
    icon: Lock,
    title: "Testar login e área restrita",
    tabs: {
      lovable:
        "Crie um checklist para testar login, cadastro, logout, recuperação de acesso e área restrita do meu app. Verifique se usuário sem acesso não vê conteúdo protegido e se usuário autorizado entra corretamente.",
      agente:
        "Me ajude a testar a parte de login e acesso do meu app. Quero saber o que verificar para não deixar conteúdo privado visível e não bloquear quem deveria entrar.",
      corrigir:
        "O login ou área restrita não está funcionando corretamente. Diagnostique o fluxo de acesso sem alterar regras sensíveis, banco ou autenticação sem necessidade.",
      avancar:
        "Avance quando login, logout e área restrita funcionarem como esperado.",
    },
  },
  {
    n: 3,
    icon: MousePointerClick,
    title: "Testar botões, formulários e links",
    tabs: {
      lovable:
        "Revise todos os botões, formulários e links do meu app. Liste quais funcionam, quais estão sem ação, quais levam para o lugar errado e quais precisam de correção.",
      agente:
        "Me ajude a testar botões e formulários do meu app como usuário real. Quero saber quais ações são críticas e como identificar falhas antes de divulgar.",
      corrigir:
        "Existem botões sem ação, formulários que não enviam ou links errados. Corrija preservando o layout e sem mexer no que já funciona.",
      avancar:
        "Avance quando todos os botões principais, links e formulários importantes estiverem funcionando.",
    },
  },
  {
    n: 4,
    icon: ShoppingCart,
    title: "Testar checkout e entrega",
    tabs: {
      lovable:
        "Crie um checklist para testar checkout, página de obrigado, liberação de acesso e área de entrega do meu app. Verifique se o comprador entende o que acontece após pagar e como acessar o conteúdo.",
      agente:
        "Me ajude a testar o fluxo de compra e entrega do meu app. Quero saber se o comprador entende o pagamento, o próximo passo, a entrega e o suporte.",
      corrigir:
        "O fluxo de checkout ou entrega está confuso. Revise a página de pagamento, obrigado, acesso, entrega e instruções para o comprador sem alterar integrações sensíveis sem necessidade.",
      avancar:
        "Avance quando o fluxo de compra e entrega estiver claro do começo ao fim.",
    },
  },
  {
    n: 5,
    icon: Smartphone,
    title: "Testar mobile e revisão final",
    tabs: {
      lovable:
        "Revise meu app no mobile. Verifique se há scroll horizontal, botões pequenos, textos cortados, cards quebrados, imagens desproporcionais, menus difíceis de usar ou páginas que ficam ruins no celular.",
      agente:
        "Me ajude a fazer uma revisão final mobile do meu app. Quero uma lista do que observar antes de divulgar para pessoas reais.",
      corrigir:
        "O app está ruim no celular. Corrija responsividade, espaçamento, largura de cards, botões, menus e textos sem alterar a lógica do app.",
      avancar:
        "Avance quando o app estiver legível, clicável e sem scroll horizontal no celular.",
    },
  },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "QA", def: "Teste de qualidade para verificar se o app funciona antes de publicar ou divulgar." },
  { termo: "Bug", def: "Erro visual, funcional ou técnico dentro do app." },
  { termo: "Fluxo crítico", def: "O caminho mais importante que o usuário precisa completar dentro do app." },
  { termo: "Responsivo", def: "Quando o app funciona bem em computador e celular." },
  { termo: "Scroll horizontal", def: "Quando a tela cria uma barra lateral indesejada, geralmente por layout quebrado no mobile." },
  { termo: "Teste como usuário", def: "Entrar no app como se fosse uma pessoa real usando pela primeira vez." },
  { termo: "Página branca", def: "Quando a tela carrega vazia por erro de código, rota ou carregamento." },
];

const CHECKLIST_GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Acesso",
    items: [
      "Testei como visitante",
      "Testei login e logout",
      "Testei como usuário logado",
    ],
  },
  {
    title: "Navegação",
    items: [
      "Testei botões principais",
      "Testei links",
      "Não encontrei página branca",
      "Não encontrei scroll horizontal",
    ],
  },
  {
    title: "Conversão",
    items: [
      "Testei formulários",
      "Testei checkout",
      "Testei página de obrigado",
    ],
  },
  {
    title: "Entrega e mobile",
    items: [
      "Testei área de entrega",
      "Testei no celular",
      "Corrigi erros críticos antes de divulgar",
    ],
  },
];

const CHECKLIST_TOTAL = CHECKLIST_GROUPS.reduce((acc, g) => acc + g.items.length, 0);


const TAB_META: { id: TabId; label: string; icon: typeof ShieldCheck }[] = [
  { id: "lovable", label: "Fazer no Lovable", icon: Wrench },
  { id: "agente", label: "Pensar com o Agente", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];

const CHECKLIST_PREFIX = "teste_step__";

function CopyBtn({ text, label = "Copiar comando" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text.trim());
      setOk(true);
      toast.success("Copiado! Agora cole no Lovable.");
      setTimeout(() => setOk(false), 1600);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };
  return (
    <button
      onClick={handle}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition ${
        ok
          ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
          : "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
      }`}
    >
      {ok ? <Check size={14} /> : <Copy size={14} />}
      {ok ? "Copiado!" : label}
    </button>
  );
}

function EtapaCard({ etapa }: { etapa: Etapa }) {
  const [tab, setTab] = useState<TabId>("lovable");
  const Icon = etapa.icon;
  return (
    <GlassCard className="p-5 md:p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="shrink-0 w-11 h-11 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-accent/80 mb-1">
            Etapa {etapa.n}
          </div>
          <h3 className="text-lg md:text-xl font-heading font-bold leading-tight">
            {etapa.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {TAB_META.map((t) => {
          const TIcon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                active
                  ? "bg-accent/15 border-accent/40 text-accent"
                  : "border-white/10 bg-white/5 text-foreground/70 hover:bg-white/10"
              }`}
            >
              <TIcon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-white/10 bg-black/40 p-4 mb-3">
        <pre className="text-[13px] whitespace-pre-wrap font-mono text-foreground/90 leading-relaxed">
          {etapa.tabs[tab]}
        </pre>
      </div>
      {tab !== "avancar" && (
        <div className="flex flex-col gap-1">
          <CopyBtn
            text={tab === "agente" ? etapa.tabs[tab] : wrapLovable(etapa.tabs[tab])}
            label={
              tab === "agente"
                ? "Copiar para o Agente"
                : tab === "corrigir"
                ? "Copiar correção"
                : "Copiar comando"
            }
          />
          <span className="text-[10px] text-muted-foreground/80">
            {tab === "agente"
              ? "Use para pensar antes de aplicar."
              : tab === "corrigir"
              ? "Use quando o Lovable não entregar o resultado esperado."
              : "Cole no projeto do seu app no Lovable."}
          </span>
        </div>
      )}
    </GlassCard>
  );
}

export function TesteFinalModule() {
  const { checklist, setChecklist } = useUserProgress();

  const copyAgentHelp = async () => {
    try {
      await navigator.clipboard.writeText(AGENT_HELP_PROMPT);
      toast.success("Prompt copiado! Cole no Agente Arquiteto.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const toggleItem = (item: string) => {
    const key = `${CHECKLIST_PREFIX}${item}`;
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section>
      <header className="mb-6">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <ShieldCheck size={12} /> Teste Final do App
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Teste tudo antes de divulgar
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Antes de chamar pessoas para usar ou comprar, você precisa testar botões,
          formulários, login, pagamento, entrega e mobile.
        </p>
      </header>

      <GlassCard className="p-5 mb-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
            Um app bonito ainda pode estar quebrado. O teste final existe para encontrar
            erros antes que outras pessoas encontrem. Antes de divulgar, você precisa agir
            como quem compra, visitante e pessoa usuária real.
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-5 mb-6">
        <div className="text-[11px] uppercase tracking-wider text-accent mb-2">
          O que você vai fazer nesta etapa
        </div>
        <p className="text-sm text-foreground/90 mb-4">
          Nesta etapa, você vai testar o app de ponta a ponta: desktop, celular, botões,
          formulários, login, checkout, entrega, links, textos, imagens e fluxo principal.
        </p>
        <ol className="space-y-2 text-sm text-foreground/85">
          {[
            "Teste como visitante.",
            "Teste como usuário logado.",
            "Teste no celular.",
            "Teste botões, formulários e links.",
            "Corrija antes de divulgar.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-5">
          <button
            onClick={copyAgentHelp}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15 text-sm font-semibold transition"
          >
            <Bot size={14} /> Não sei testar meu app
          </button>
          <p className="text-[11px] text-muted-foreground mt-2">
            Copia um prompt pronto para você colar no Agente Arquiteto.
          </p>
        </div>
      </GlassCard>

      <CopyCommandWarning />
      <p className="text-xs text-muted-foreground mb-4">
        Use a aba <strong className="text-foreground/90">Fazer no Lovable</strong> quando
        quiser aplicar no app. Use a aba{" "}
        <strong className="text-foreground/90">Pensar com o Agente</strong> quando quiser
        ajuda para decidir antes de construir.
      </p>

      <div className="space-y-5 mb-8">
        {ETAPAS.map((e) => (
          <EtapaCard key={e.n} etapa={e} />
        ))}
      </div>

      <GlassCard className="p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle size={16} className="text-accent" />
          <h3 className="font-heading font-semibold text-base">Não entendi uma palavra</h3>
        </div>
        <dl className="grid sm:grid-cols-2 gap-3">
          {GLOSSARIO.map((g) => (
            <div
              key={g.termo}
              className="rounded-lg border border-white/10 bg-white/5 p-3"
            >
              <dt className="text-sm font-semibold text-accent">{g.termo}</dt>
              <dd className="text-xs text-muted-foreground mt-1">{g.def}</dd>
            </div>
          ))}
        </dl>
      </GlassCard>

      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Bug size={16} className="text-emerald-300" />
          <h3 className="font-heading font-semibold text-base">Revisão da etapa</h3>
        </div>
        <ul className="space-y-2">
          {CHECKLIST_ITEMS.map((item) => {
            const key = `${CHECKLIST_PREFIX}${item}`;
            const done = !!checklist[key];
            return (
              <li key={item}>
                <label className="flex items-center gap-3 p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleItem(item)}
                    className="accent-accent w-4 h-4"
                  />
                  <span
                    className={`text-sm ${
                      done ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item}
                  </span>
                  {done ? (
                    <CheckCircle2
                      size={14}
                      className="text-emerald-400 shrink-0 ml-auto"
                    />
                  ) : (
                    <Circle
                      size={14}
                      className="text-muted-foreground/40 shrink-0 ml-auto"
                    />
                  )}
                </label>
              </li>
            );
          })}
        </ul>
        <p className="text-[11px] text-muted-foreground mt-3">
          Quando todos os itens estiverem marcados, esta etapa será considerada concluída na sua jornada.
        </p>
      </GlassCard>
    </section>
  );
}

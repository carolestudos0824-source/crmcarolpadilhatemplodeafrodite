import { useState } from "react";
import { toast } from "sonner";
import {
  Globe,
  Rocket,
  UploadCloud,
  ExternalLink,
  Image as ImageIcon,
  CheckSquare,
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

const AGENT_HELP_PROMPT = `Estou criando um aplicativo no Lovable e preciso publicar do jeito certo. Me ajude a entender a diferença entre preview e produção, como testar o link público, o que revisar antes de divulgar, como pensar domínio, favicon, imagem social e como fazer um checklist final de publicação.`;

type TabId = "lovable" | "agente" | "corrigir" | "avancar";

type Etapa = {
  n: number;
  icon: typeof Globe;
  title: string;
  tabs: Record<TabId, string>;
};

const ETAPAS: Etapa[] = [
  {
    n: 1,
    icon: UploadCloud,
    title: "Publicar o app",
    tabs: {
      lovable:
        "Revise meu app e prepare a publicação. Confirme se não há telas quebradas, botões sem ação, textos provisórios ou links falsos antes de publicar. Depois indique o caminho correto para gerar o link público.",
      agente:
        "Me ajude a criar um checklist de publicação para meu app. Quero saber o que preciso revisar antes de colocar o app no ar para usuários reais.",
      corrigir:
        "O Lovable publicou, mas ainda existem textos provisórios, botões sem ação ou páginas incompletas. Revise tudo e corrija antes da divulgação.",
      avancar:
        "Avance quando o app tiver um link público funcionando e sem elementos claramente inacabados.",
    },
  },
  {
    n: 2,
    icon: ExternalLink,
    title: "Testar o link público",
    tabs: {
      lovable:
        "Crie um checklist de teste do link público do meu app. O checklist deve incluir abertura no navegador, celular, aba anônima, login, páginas principais, checkout e área de entrega, se existirem.",
      agente:
        "Me ajude a testar o link público do meu app como se eu fosse um usuário real. Quero saber o que clicar, o que verificar e como identificar problemas antes de divulgar.",
      corrigir:
        "O link público abre errado, cai em página branca ou mostra tela de preview. Diagnostique o problema e corrija sem alterar funcionalidades que já funcionam.",
      avancar:
        "Avance quando o link abrir corretamente em navegador normal, aba anônima e celular.",
    },
  },
  {
    n: 3,
    icon: Globe,
    title: "Configurar domínio",
    tabs: {
      lovable:
        "Oriente a configuração de domínio do meu app de forma segura. Explique o que precisa ser feito para conectar o domínio, revisar DNS e confirmar que o endereço final está abrindo corretamente.",
      agente:
        "Me ajude a decidir se devo usar domínio próprio agora ou começar com link público da plataforma. Considere fase do app, venda, confiança, validação e custo.",
      corrigir:
        "O domínio não está abrindo corretamente. Gere um diagnóstico simples para verificar DNS, link de produção, redirecionamento e configuração da plataforma.",
      avancar:
        "Avance quando o domínio ou link público escolhido estiver funcionando corretamente.",
    },
  },
  {
    n: 4,
    icon: ImageIcon,
    title: "Revisar favicon e imagem social",
    tabs: {
      lovable:
        "Revise favicon, título da página, descrição e imagem social do meu app. Ajuste para que o link compartilhado pareça profissional no WhatsApp, redes sociais e navegador.",
      agente:
        "Me ajude a definir título, descrição curta e imagem social para meu app. Quero que o link compartilhado transmita confiança e deixe claro o valor do produto.",
      corrigir:
        "O link compartilhado está sem imagem, com título errado ou descrição ruim. Corrija metadados, favicon e imagem social para deixar profissional.",
      avancar:
        "Avance quando o app tiver favicon, título, descrição e imagem de compartilhamento revisados.",
    },
  },
  {
    n: 5,
    icon: CheckSquare,
    title: "Confirmar produção antes de divulgar",
    tabs: {
      lovable:
        "Crie um checklist final para confirmar que meu app está em produção e pronto para ser divulgado. Inclua teste de páginas principais, mobile, login, checkout, entrega, suporte, termos, privacidade e botões principais.",
      agente:
        "Me ajude a fazer uma revisão final antes de divulgar meu app. Quero saber se ele está realmente pronto para receber usuários reais ou se ainda devo testar mais.",
      corrigir:
        "O app parece pronto, mas ainda tenho dúvidas se está em preview ou produção. Ajude a identificar a versão correta e os riscos antes de divulgar.",
      avancar:
        "Avance quando você tiver certeza de que o app publicado abre corretamente, funciona no celular e não depende mais do ambiente de preview.",
    },
  },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "Preview", def: "Versão de visualização usada para testar enquanto o app ainda está em construção." },
  { termo: "Produção", def: "Versão pública e estável que pode ser acessada por usuários reais." },
  { termo: "Deploy", def: "O processo de publicar o app para ele ficar acessível na internet." },
  { termo: "Domínio", def: "O endereço próprio do app, como seusite.com.br." },
  { termo: "DNS", def: "A configuração que conecta o domínio ao app publicado." },
  { termo: "Favicon", def: "O pequeno ícone que aparece na aba do navegador." },
  { termo: "Imagem social", def: "A imagem que aparece quando o link é compartilhado no WhatsApp, redes sociais ou mensagens." },
  { termo: "Link público", def: "O endereço que qualquer pessoa autorizada pode abrir para acessar o app." },
];

const CHECKLIST_ITEMS = [
  "Publiquei o app",
  "Testei o link público",
  "Testei em aba anônima",
  "Testei no celular",
  "Sei diferenciar preview e produção",
  "Revisei domínio ou link público",
  "Revisei favicon",
  "Revisei título e descrição",
  "Revisei imagem social",
  "Confirmei que está pronto para divulgar",
];

const TAB_META: { id: TabId; label: string; icon: typeof Globe }[] = [
  { id: "lovable", label: "Fazer no Lovable", icon: Wrench },
  { id: "agente", label: "Pensar com o Agente", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];

const CHECKLIST_PREFIX = "publicar_step__";

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
            text={
              tab === "agente" ? etapa.tabs[tab] : wrapLovable(etapa.tabs[tab])
            }
            label={
              tab === "agente"
                ? "Copiar para o Agente Arquiteto"
                : "Copiar para o Lovable do meu app"
            }
          />
          <span className="text-[10px] text-muted-foreground/80">
            {tab === "agente"
              ? "Cole no chat do Agente Arquiteto, não no Lovable."
              : "Cole no projeto do app que você está criando, não na Fábrica de Apps."}
          </span>
        </div>
      )}
    </GlassCard>
  );
}

export function PublicarDominioModule() {
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
          <Rocket size={12} /> Publicar e Domínio
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Publique seu app do jeito certo
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Depois de construir e preparar a entrega, você precisa publicar, testar o
          link, revisar domínio, favicon e compartilhamento antes de divulgar.
        </p>
      </header>

      <GlassCard className="p-5 mb-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
            App em preview ainda não é app pronto para vender. Antes de mandar o link
            para pessoas reais, confirme se ele abre corretamente, se está em produção,
            se funciona no celular e se a experiência de compartilhamento está
            profissional.
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-5 mb-6">
        <div className="text-[11px] uppercase tracking-wider text-accent mb-2">
          O que você vai fazer nesta etapa
        </div>
        <p className="text-sm text-foreground/90 mb-4">
          Nesta etapa, você vai preparar seu app para sair do ambiente de construção e
          entrar em uma versão pública testável. Você vai revisar link, domínio, visual
          de compartilhamento, favicon, mobile e produção.
        </p>
        <ol className="space-y-2 text-sm text-foreground/85">
          {[
            "Publique o app.",
            "Teste o link público.",
            "Confirme se está em produção, não só em preview.",
            "Revise domínio, favicon e imagem social.",
            "Abra no celular antes de divulgar.",
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
            <Bot size={14} /> Não sei publicar meu app
          </button>
          <p className="text-[11px] text-muted-foreground mt-2">
            Copia um prompt pronto para você colar no Agente Arquiteto.
          </p>
        </div>
      </GlassCard>

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
          <CheckCircle2 size={16} className="text-emerald-300" />
          <h3 className="font-heading font-semibold text-base">Checklist do módulo</h3>
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
          Este checklist é salvo na sua conta, mas não afeta o progresso geral nesta rodada.
        </p>
      </GlassCard>
    </section>
  );
}

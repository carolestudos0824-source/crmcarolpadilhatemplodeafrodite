import { useState } from "react";
import { toast } from "sonner";
import {
  Scale,
  FileText,
  ShieldCheck,
  LifeBuoy,
  CreditCard,
  BadgeCheck,
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
import { CopyCommandWarning } from "@/components/entrega/CopyCommandWarning";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import { useProjectContext } from "@/hooks/useProjectContext";
import { applyContextPlaceholders, buildLovablePrompt } from "@/lib/promptBuilder";
import { ResumoLegalCard } from "./ResumoLegalCard";
import { ChecklistDisclosure } from "@/components/entrega/ChecklistDisclosure";

const AGENT_HELP_PROMPT = `Estou criando um aplicativo no Lovable e preciso preparar páginas de confiança antes de divulgar. Me ajude a organizar: termos de uso, política de privacidade, suporte, segurança, entrega, pagamento, acesso, limites da promessa e mensagens claras para reduzir dúvidas dos usuários. Não quero texto jurídico complexo, quero uma estrutura simples, clara e responsável.`;

type TabId = "lovable" | "agente" | "corrigir" | "avancar";

type Etapa = {
  n: number;
  icon: typeof Scale;
  title: string;
  tabs: Record<TabId, string>;
};

const ETAPAS: Etapa[] = [
  {
    n: 1,
    icon: FileText,
    title: "Criar termos de uso",
    tabs: {
      lovable:
        `Crie ou melhore a página de Termos de Uso do app [nome do app ativo].

App: [descreva o app]
Público: [descreva o público]
Produto: [produto]
Modelo de cobrança: [modelo de cobrança]

Cubra de forma simples e clara:

1. Quem pode usar o app (idade mínima, restrições).
2. O que o app faz: [descreva o app].
3. O que o app NÃO garante (resultado, cura, ganho, salvação, previsão).
4. Regras de uso (uso pessoal, proibições, conteúdo do usuário).
5. Responsabilidade do usuário.
6. Limitações do serviço (disponibilidade, manutenção, indisponibilidades).
7. Pagamento, acesso e cancelamento, quando aplicável.
8. Suporte e canal de contato.
9. Atualização dos termos (como e quando podem ser revisados).

Não use juridiquês exagerado. Não prometa resultado garantido. Não diga que o app substitui profissional.`,
      agente:
        `Me ajude a estruturar os Termos de Uso do app [nome do app ativo].

O que o app faz: [descreva o app]
Público: [descreva o público]
Promessa: [promessa]
Produto: [produto]

Quero uma estrutura simples, responsável e clara para leigos, cobrindo: quem pode usar, o que o app faz, o que não garante, regras, responsabilidades, limitações, pagamento/acesso, suporte e atualização dos termos.`,
      corrigir:
        `Minha página de Termos de Uso do app [nome do app ativo] está confusa, longa ou técnica demais. Reescreva com linguagem simples, organizada por seções, sem promessa exagerada e sem dizer que o app substitui profissional.`,
      avancar:
        "Avance quando o app tiver uma página de Termos de Uso clara, acessível e sem promessa exagerada.",
    },
  },
  {
    n: 2,
    icon: ShieldCheck,
    title: "Criar política de privacidade",
    tabs: {
      lovable:
        `Crie ou melhore a Política de Privacidade do app [nome do app ativo].

App: [descreva o app]
Público: [descreva o público]
Ação principal do usuário: [ação principal]

Cubra em linguagem simples:

1. Quais dados são coletados (ex.: nome, e-mail, respostas, progresso, dados de pagamento quando houver checkout externo).
2. Por que esses dados são coletados.
3. Como esses dados são usados.
4. Se há compartilhamento com ferramentas externas (gateway de pagamento, e-mail, analytics) — citar quais.
5. Como o usuário pode solicitar acesso, correção ou exclusão de seus dados.
6. Como entrar em contato sobre privacidade.
7. Cookies, analytics ou pixels, se existirem.
8. Retenção e segurança em linguagem simples.

Regra obrigatória: NÃO prometer segurança 100%. Use frase como:
"Adotamos medidas razoáveis de proteção, mas nenhum sistema é totalmente imune a riscos."

Não copie modelos de outros sites sem adaptar ao que o app realmente faz.`,
      agente:
        `Me ajude a pensar quais dados o app [nome do app ativo] coleta e como explicar isso em uma Política de Privacidade simples, transparente e responsável.

O que o app faz: [descreva o app]
Público: [descreva o público]
Ação principal: [ação principal]

Quero cobrir: dados coletados, finalidade, uso, compartilhamento com terceiros, direitos do titular, contato, cookies/analytics, retenção e segurança — sem prometer segurança 100%.`,
      corrigir:
        `Minha Política de Privacidade do app [nome do app ativo] está genérica ou não combina com o app. Revise para refletir login, pagamento, formulários, progresso, suporte e dados realmente coletados. Não prometa segurança 100%.`,
      avancar:
        "Avance quando a Política de Privacidade estiver clara, acessível no app e coerente com os dados usados.",
    },
  },
  {
    n: 3,
    icon: CreditCard,
    title: "Explicar pagamento e entrega",
    tabs: {
      lovable:
        `Revise/clareie as telas de venda, checkout, obrigado e entrega do app [nome do app ativo].

Produto: [produto]
Modelo de cobrança: [modelo de cobrança]
Promessa: [promessa]

Garanta que o comprador veja, em linguagem simples:

1. Preço.
2. Forma de pagamento.
3. Quando o acesso é liberado (imediato, manual, em até X horas).
4. O que acontece em pagamento pendente ou recusado.
5. Como recuperar acesso (e-mail, link, suporte).
6. O que está incluso na compra.
7. O que NÃO está incluso.
8. Política de reembolso ou cancelamento (prazo, condições, como solicitar).

Não altere integrações de pagamento sem necessidade. Não prometa acesso automático se a liberação ainda é manual.`,
      agente:
        `Me ajude a deixar claro o fluxo de pagamento e entrega do app [nome do app ativo].

Produto: [produto]
Modelo: [modelo de cobrança]

Quero cobrir: preço, forma de pagamento, momento da liberação, pendência, recuperação de acesso, o que está e o que não está incluso, e política de reembolso/cancelamento.`,
      corrigir:
        `O fluxo de pagamento e entrega do app [nome do app ativo] está gerando dúvida. Reescreva as mensagens da venda, checkout, obrigado e entrega cobrindo preço, liberação, pendência, recuperação, incluso/não incluso e reembolso.`,
      avancar:
        "Avance quando o comprador entender preço, liberação, pendência, recuperação e reembolso sem precisar de suporte.",
    },
  },
  {
    n: 4,
    icon: LifeBuoy,
    title: "Criar suporte claro",
    tabs: {
      lovable:
        `Crie ou melhore a página de Suporte do app [nome do app ativo].

App: [descreva o app]
Produto: [produto]

Inclua, em linguagem simples:

1. Canal de suporte (e-mail, WhatsApp ou formulário — escolher um).
2. Prazo estimado de resposta (ex.: até 24h em dias úteis).
3. Horário de atendimento, se houver.
4. Tipo de problema atendido (acesso, login, compra, conteúdo, bug).
5. O que o suporte NÃO cobre (orientação clínica, jurídica, financeira individual; resultado garantido; questões fora do escopo do app).
6. Caminho claro para problemas de pagamento ou acesso (passo a passo).

Não invente canal que não exista. Não prometa atendimento imediato 24/7 se não for verdade.`,
      agente:
        `Me ajude a estruturar uma página de suporte objetiva para o app [nome do app ativo].

O que o app faz: [descreva o app]

Quero cobrir: canal de contato, prazo, horário, escopo atendido, escopo NÃO atendido e fluxo para problemas de pagamento/acesso.`,
      corrigir:
        `A página de suporte do app [nome do app ativo] está fraca ou incompleta. Organize por canal, prazo, horário, escopo, escopo NÃO coberto e fluxo de pagamento/acesso, em linguagem simples.`,
      avancar:
        "Avance quando o usuário souber onde pedir ajuda, em quanto tempo é respondido e o que está fora do suporte.",
    },
  },
  {
    n: 5,
    icon: BadgeCheck,
    title: "Revisar promessa e confiança",
    tabs: {
      lovable:
        `Revise todos os textos principais do app [nome do app ativo] (home, página de venda, checkout, obrigado, entrega).

Promessa atual: [promessa]
Público: [descreva o público]
Dor que resolve: [descreva a dor]

Verifique e ajuste para que:

1. A promessa esteja realista e coerente com o que o app entrega.
2. NÃO exista garantia absoluta (cura, salvação, ganho, previsão, encontrar amor).
3. NÃO exista promessa enganosa ou exagerada.
4. O usuário entenda os limites do app (o que ele faz e o que ele NÃO faz).
5. Exista uma seção de confiança (sobre, suporte, política, contato).
6. Exista um FAQ com dúvidas sensíveis (privacidade, reembolso, garantia, suporte).
7. A linguagem seja clara para leigos.

Mantenha força comercial, mas substitua exagero por clareza, utilidade e transparência.`,
      agente:
        `Me ajude a revisar a promessa do app [nome do app ativo]. Quero vender com força, mas sem prometer resultado garantido, sem exagero e sem gerar desconfiança.

Promessa atual: [promessa]
Público: [descreva o público]
Dor: [descreva a dor]`,
      corrigir:
        `Os textos do app [nome do app ativo] estão exagerados ou pouco confiáveis. Reescreva mantendo força comercial, mas com promessa responsável, limites claros, FAQ honesto e linguagem para leigos.`,
      avancar:
        "Avance quando o app vender com clareza, sem promessas irreais e com páginas de confiança acessíveis.",
    },
  },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "Termos de uso", def: "Página que explica regras de uso do app, responsabilidades, limites e condições." },
  { termo: "Política de privacidade", def: "Página que explica quais dados podem ser coletados e como eles são usados." },
  { termo: "LGPD", def: "Lei brasileira de proteção de dados pessoais (Lei 13.709/2018). Dá direitos ao titular dos dados e cria deveres para quem trata esses dados." },
  { termo: "Suporte", def: "Canal ou orientação para o usuário pedir ajuda quando tiver problema." },
  { termo: "Reembolso", def: "Devolução do valor pago em determinadas condições e prazos (ex.: arrependimento de 7 dias do CDC, quando aplicável)." },
  { termo: "Promessa responsável", def: "Explicar o benefício do app sem garantir resultado impossível ou enganoso." },
  { termo: "Limitação de responsabilidade", def: "Trecho dos termos que esclarece o que o app NÃO se responsabiliza (ex.: decisões do usuário, indisponibilidades, resultados pessoais)." },
  { termo: "Dados pessoais", def: "Qualquer informação que identifique uma pessoa: nome, e-mail, telefone, respostas, foto, identificador de conta." },
  { termo: "Cookies e ferramentas externas", def: "Pequenos arquivos e integrações (analytics, pixels, gateways) que coletam ou processam dados do usuário fora do seu app." },
  { termo: "Página de confiança", def: "Página ou seção que reduz medo antes da compra, mostrando segurança, clareza, contato e suporte." },
  { termo: "Entrega", def: "O que o comprador recebe depois de pagar ou acessar o app." },
];

const CHECKLIST_ITEMS = [
  "Criei ou revisei Termos de Uso",
  "Criei ou revisei Política de Privacidade",
  "Expliquei dados coletados e finalidade",
  "Expliquei pagamento e entrega",
  "Expliquei suporte e recuperação de acesso",
  "Expliquei reembolso ou cancelamento",
  "Removi promessas exageradas",
  "Deixei claro o que o app não garante",
  "Informei canal de contato",
  "Conferi se a linguagem está simples",
  "Revisei nichos sensíveis",
  "Vou revisar com profissional quando necessário",
];

const TAB_META: { id: TabId; label: string; icon: typeof Scale }[] = [
  { id: "lovable", label: "Implementar no Lovable", icon: Wrench },
  { id: "agente", label: "Revisar com o Agente Arquiteto primeiro", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];

const CHECKLIST_PREFIX = "legal_step__";

function CopyBtn({ text, label = "Copiar para implementar no Lovable" }: { text: string; label?: string }) {
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
  const { context } = useProjectContext();
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

      {tab === "avancar" ? (
        <div className="rounded-xl border border-white/10 bg-black/40 p-4">
          <pre className="text-[13px] whitespace-pre-wrap font-mono text-foreground/90 leading-relaxed">
            {etapa.tabs[tab]}
          </pre>
        </div>
      ) : (
        <EditablePromptBox
          saveSourceModule="legal"
          key={`${etapa.n}-${tab}-${context.appName}`}
          originalPrompt={applyContextPlaceholders(etapa.tabs[tab], context)}
          storageKey={`${CHECKLIST_PREFIX}prompt__${etapa.n}__${tab}`}
          transformOnCopy={
            tab === "agente"
              ? undefined
              : (text) =>
                  buildLovablePrompt({
                    context,
                    stepName: `Legal e Confiança — ${etapa.title}`,
                    stepObjective: `Trabalhar a etapa "${etapa.title}" de legal/confiança preservando textos legais, termos, política de privacidade, páginas de confiança e dados de empresa já configurados. Não prometer conformidade jurídica perfeita.`,
                    command: text,
                    moduleId: "legal",
                  })
          }
          copyLabel={
            tab === "agente"
              ? "Copiar para o Agente"
              : tab === "corrigir"
              ? "Copiar correção"
              : "Copiar para implementar no Lovable"
          }
          helperText={
            tab === "agente"
              ? "Use para pensar antes de aplicar."
              : tab === "corrigir"
              ? "Use quando o Lovable não entregar o resultado esperado."
              : "Cole no projeto do seu app no Lovable."
          }
        />
      )}
    </GlassCard>
  );
}

export function LegalConfiancaModule() {
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
          <Scale size={12} /> Legal e Confiança
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Prepare confiança antes de vender
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Antes de divulgar seu app, revise páginas legais, suporte, privacidade, termos,
          segurança e mensagens de promessa responsável.
        </p>
      </header>

      <GlassCard className="p-5 mb-4 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
            Confiança vende. Um app sem termos, privacidade, suporte e explicação clara de
            entrega pode gerar medo, abandono e pedidos de ajuda desnecessários. Esta
            etapa ajuda você a preparar uma base profissional antes de levar pessoas reais
            para dentro do app.
          </p>
        </div>
      </GlassCard>

      <p className="text-[11px] text-muted-foreground/80 mb-6 max-w-3xl">
        Este módulo não substitui orientação jurídica. Ele ajuda a organizar páginas e
        mensagens básicas para deixar o app mais claro e confiável.
      </p>

      <GlassCard className="p-5 mb-6">
        <div className="text-[11px] uppercase tracking-wider text-accent mb-2">
          O que você vai fazer nesta etapa
        </div>
        <p className="text-sm text-foreground/90 mb-4">
          Nesta etapa, você vai revisar as páginas de confiança do seu app, criar ou
          melhorar termos de uso, política de privacidade, suporte, segurança, aviso de
          pagamento, entrega e limites da promessa.
        </p>
        <ol className="space-y-2 text-sm text-foreground/85">
          {[
            "Revise termos e privacidade.",
            "Explique pagamento e entrega.",
            "Crie uma página de suporte clara.",
            "Remova promessas exageradas.",
            "Mostre segurança e confiança antes de divulgar.",
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
            <Bot size={14} /> Não sei o que colocar nas páginas legais
          </button>
          <p className="text-[11px] text-muted-foreground mt-2">
            Copia um prompt pronto para você colar no Agente Arquiteto.
          </p>
        </div>
      </GlassCard>

      <ResumoLegalCard />

      <CopyCommandWarning />
      <p className="text-xs text-muted-foreground mb-4">
        Use a aba <strong className="text-foreground/90">Implementar no Lovable</strong> quando
        quiser aplicar no app. Use a aba{" "}
        <strong className="text-foreground/90">Revisar com o Agente Arquiteto primeiro</strong> quando quiser
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

      <ChecklistDisclosure title="Checklist opcional — Revisão da etapa">
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={16} className="text-emerald-300" />
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
      </ChecklistDisclosure>
    </section>
  );
}

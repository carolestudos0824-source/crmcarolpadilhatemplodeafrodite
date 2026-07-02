import { useState } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  KeyRound,
  Database,
  UserCheck,
  Eye,
  Bot,
  Wrench,
  HelpCircle,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  Circle,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { AgentArchitectCard } from "@/components/entrega/AgentArchitectCard";
import { AGENT_MODULE_GUIDANCE } from "@/lib/agentModuleGuidance";
import { useUserProgress } from "@/hooks/useUserProgress";
import { CopyCommandWarning } from "@/components/entrega/CopyCommandWarning";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import { useProjectContext } from "@/hooks/useProjectContext";
import { buildLovablePrompt } from "@/lib/promptBuilder";
import { ChecklistDisclosure } from "@/components/entrega/ChecklistDisclosure";


const AGENT_HELP_PROMPT = `Estou criando um aplicativo no Lovable e preciso revisar a segurança contra invasão. Me ajude a proteger rotas públicas, área restrita, área paga, painel admin, dados dos usuários, banco de dados, RLS, RPCs, chaves secretas, APIs, checkout e permissões. Quero saber o que pode ficar público, o que deve ficar privado e como testar se alguém consegue acessar o que não deveria.`;

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
    icon: Lock,
    title: "Proteger rotas públicas e restritas",
    tabs: {
      lovable:
        "Revise todas as rotas e telas do meu app. Separe o que é público, restrito para usuário/comprador e exclusivo de admin. Garanta que visitante sem login não acesse área restrita, usuário sem acesso não veja conteúdo pago e usuário comum nunca acesse painel admin.",
      agente:
        "Me ajude a definir quais telas do meu app podem ser públicas, quais devem exigir login, quais devem exigir acesso pago e quais devem ser exclusivas de admin.",
      corrigir:
        "Meu app pode estar expondo rota restrita ou painel admin. Revise proteções, redirecionamentos e permissões para impedir acesso indevido.",
      avancar:
        "Avance quando visitante, usuário comum, comprador e admin tiverem acessos bem separados.",
    },
  },
  {
    n: 2,
    icon: UserCheck,
    title: "Proteger dados do usuário",
    tabs: {
      lovable:
        "Revise onde meu app mostra e consulta dados do usuário, como e-mail, progresso, histórico, respostas, compras, pagamentos ou informações pessoais. Garanta que cada usuário veja apenas seus próprios dados e que ninguém consiga listar dados de outros usuários.",
      agente:
        "Me ajude a listar quais dados do meu app são sensíveis e como proteger para que cada usuário veja apenas o que pertence a ele.",
      corrigir:
        "Meu app pode estar mostrando dados de outros usuários. Corrija consultas, filtros e permissões para impedir vazamento de dados.",
      avancar:
        "Avance quando dados pessoais e dados de uso estiverem protegidos por usuário.",
    },
  },
  {
    n: 3,
    icon: Database,
    title: "Revisar banco, RLS, RPCs e permissões",
    tabs: {
      lovable:
        "Revise a segurança do banco do meu app. Verifique se tabelas sensíveis têm RLS, se policies não estão amplas demais, se usuário comum não pode listar dados de outros usuários, inserir registros sensíveis, alterar permissões, liberar o próprio acesso ou manipular registros administrativos. Não use policy `true` sem justificativa.",
      agente:
        "Me ajude a entender quais tabelas do meu app precisam de RLS, quais ações devem ser feitas por RPC segura e quais permissões usuário comum nunca deve ter.",
      corrigir:
        "O app tem aviso de segurança sobre RLS, policy ampla, permissão insegura ou usuário podendo mexer no que não deveria. Corrija de forma cirúrgica, sem quebrar login, acesso, admin, checkout ou dados existentes.",
      avancar:
        "Avance quando o banco não permitir exposição óbvia, auto-liberação indevida ou manipulação de dados sensíveis por usuário comum.",
    },
  },
  {
    n: 4,
    icon: KeyRound,
    title: "Proteger chaves, tokens e integrações",
    tabs: {
      lovable:
        "Revise o app para garantir que nenhuma chave secreta, token, service role, chave de pagamento, OpenAI, Stripe, Supabase service role ou segredo de API esteja exposto no frontend. Se algo sensível aparecer no client, mover para ambiente seguro, edge function ou variável protegida.",
      agente:
        "Me ajude a revisar quais chaves e integrações do meu app precisam ficar protegidas. Quero entender o que pode ser público e o que nunca deve aparecer no frontend.",
      corrigir:
        "Existe chave, token ou segredo aparecendo no frontend. Corrija sem quebrar o app, movendo o que for sensível para local seguro e mantendo apenas chaves públicas permitidas.",
      avancar:
        "Avance quando nenhuma chave secreta, token sensível ou service role estiver exposto no frontend.",
    },
  },
  {
    n: 5,
    icon: ShieldAlert,
    title: "Testar tentativa de invasão antes de publicar",
    tabs: {
      lovable:
        "Crie um checklist de teste de segurança para meu app. Inclua: visitante tentando acessar rota restrita, usuário logado sem acesso tentando acessar conteúdo pago, comprador acessando a entrega, usuário comum tentando acessar admin, usuário tentando ver dados de outro usuário, tentativa de usar código inválido, tentativa de acessar URL direta e teste de logout.",
      agente:
        "Me ajude a testar a segurança do meu app como visitante, usuário sem acesso, comprador e admin. Quero descobrir se alguém consegue acessar algo que não deveria antes de divulgar.",
      corrigir:
        "Durante o teste de segurança, encontrei acesso indevido. Corrija apenas a proteção necessária, preserve o que já funciona e não altere pagamento, banco ou admin sem necessidade.",
      avancar:
        "Avance quando visitante, usuário sem acesso, comprador e admin estiverem vendo apenas o que devem ver.",
    },
  },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "Vulnerabilidade", def: "Falha que pode permitir acesso indevido, vazamento de dados ou uso malicioso do app." },
  { termo: "Invasão", def: "Quando alguém tenta acessar ou manipular partes do app sem permissão." },
  { termo: "Área restrita", def: "Parte do app que só usuário logado ou comprador autorizado pode acessar." },
  { termo: "Admin", def: "Área exclusiva de gestão. Usuário comum nunca deve acessar." },
  { termo: "RLS", def: "Recurso do Supabase que protege linhas do banco para cada usuário ver apenas o que pode." },
  { termo: "RPC", def: "Função segura no banco usada para executar ações importantes sem expor regras sensíveis no frontend." },
  { termo: "Service role", def: "Chave poderosa do Supabase. Nunca deve aparecer no frontend." },
  { termo: "Chave secreta", def: "Código sensível de API, pagamento ou serviço. Nunca deve aparecer no frontend." },
  { termo: "Dado sensível", def: "Informação que precisa ser protegida, como e-mail, pagamento, histórico, acesso, progresso ou dados pessoais." },
  { termo: "Acesso indevido", def: "Quando alguém vê, edita ou usa algo que não deveria." },
];

const CHECKLIST_ITEMS = [
  "Separei telas públicas, restritas e admin",
  "Bloqueei visitante sem login nas áreas privadas",
  "Bloqueei usuário sem acesso no conteúdo pago",
  "Protegi painel admin",
  "Protegi dados do usuário",
  "Revisei permissões do banco",
  "Revisei RLS e policies sensíveis",
  "Revisei RPCs e ações críticas",
  "Confirmei que ninguém se libera acesso sozinho",
  "Confirmei que não há chave secreta no frontend",
  "Testei tentativa de acesso indevido",
  "Corrigi exposição crítica antes de publicar",
];

const TAB_META: { id: TabId; label: string; icon: typeof ShieldCheck }[] = [
  { id: "lovable", label: "Implementar no Lovable", icon: Wrench },
  { id: "agente", label: "Revisar com o Agente Arquiteto primeiro", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];

const CHECKLIST_PREFIX = "seguranca_step__";

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
          saveSourceModule="seguranca"
          key={`${etapa.n}-${tab}`}
          originalPrompt={etapa.tabs[tab]}
          storageKey={`${CHECKLIST_PREFIX}prompt__${etapa.n}__${tab}`}
          transformOnCopy={
            tab === "agente"
              ? undefined
              : (text) =>
                  buildLovablePrompt({
                    context,
                    stepName: `Segurança do App — ${etapa.title}`,
                    stepObjective: `Auditar/ajustar a etapa "${etapa.title}" da segurança do app, sem alterar auth, RLS, policies, RPCs, permissões, admin ou área paga sem pedido explícito.`,
                    command: text,
                    moduleId: "seguranca",
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

export function SegurancaAppModule() {
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
          <ShieldCheck size={12} /> Segurança do App
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Proteja seu app contra invasões
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Antes de vender ou divulgar, seu app precisa proteger dados, acessos, área paga,
          banco, chaves secretas e painel admin.
        </p>
      </header>

      <AgentArchitectCard
        className="mb-4"
        variant="compact"
        title={AGENT_MODULE_GUIDANCE.seguranca.title}
        subtitle={AGENT_MODULE_GUIDANCE.seguranca.subtitle}
        ctaLabel={AGENT_MODULE_GUIDANCE.seguranca.ctaLabel}
        prompt={AGENT_MODULE_GUIDANCE.seguranca.prompt}
        successMessage={AGENT_MODULE_GUIDANCE.seguranca.successMessage}
      />

      <GlassCard className="p-5 mb-4 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
            Um app bonito pode estar vulnerável. Segurança é o que impede alguém de acessar
            área paga sem permissão, ver dados de outros usuários, mexer no banco, usar
            chaves secretas ou entrar no painel admin.
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-4 mb-6 border-amber-400/30 bg-amber-400/5">
        <p className="text-xs md:text-sm text-amber-100/90 leading-relaxed">
          <strong className="text-amber-200">Observação:</strong> Nenhum app é 100%
          invulnerável, mas um app bem protegido reduz muito o risco de invasão, vazamento
          e uso indevido.
        </p>
      </GlassCard>

      <GlassCard className="p-5 mb-6">
        <div className="text-[11px] uppercase tracking-wider text-accent mb-2">
          O que você vai fazer nesta etapa
        </div>
        <p className="text-sm text-foreground/90 mb-4">
          Nesta etapa, você vai revisar os pontos de segurança do seu app: rotas públicas
          e restritas, banco de dados, permissões, RLS, admin, chaves secretas, APIs,
          checkout, área paga e testes com diferentes tipos de usuário.
        </p>
        <ol className="space-y-2 text-sm text-foreground/85">
          {[
            "Separe público, restrito e admin.",
            "Proteja banco, dados e permissões.",
            "Garanta que chaves secretas não estejam no frontend.",
            "Proteja área paga e painel admin.",
            "Teste tentativas de acesso indevido.",
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
            <Bot size={14} /> Não sei como proteger meu app
          </button>
          <p className="text-[11px] text-muted-foreground mt-2">
            Copia um prompt pronto para você colar no Agente Arquiteto.
          </p>
        </div>
      </GlassCard>

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
          <Eye size={16} className="text-emerald-300" />
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
          Quando todos os 12 itens estiverem marcados, esta etapa será considerada concluída na sua jornada.
        </p>
      </GlassCard>
      </ChecklistDisclosure>
    </section>
  );
}

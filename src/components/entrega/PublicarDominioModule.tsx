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
import { CopyCommandWarning } from "@/components/entrega/CopyCommandWarning";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import { AgentArchitectCard } from "@/components/entrega/AgentArchitectCard";
import { useProjectContext } from "@/hooks/useProjectContext";
import { applyContextPlaceholders, buildLovablePrompt } from "@/lib/promptBuilder";
import { ResumoPublicacaoCard } from "./ResumoPublicacaoCard";


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
        `Revise o app [nome do app ativo] e prepare a publicação da versão atual.

App: [descreva o app]
Público: [descreva o público]
Promessa: [promessa]
Produto: [produto]
Ação principal: [ação principal]

Faça nesta ordem:

1. Confirme que login, rotas principais, checkout (se houver) e entrega não estão quebrados.
2. Liste telas com textos provisórios, botões sem ação, links falsos ou imagens quebradas.
3. Indique o caminho correto para publicar a versão atual no ambiente público.
4. Após publicar, confirme que o link público abre fora do editor (em janela normal, não só preview).

NÃO publique se login, checkout, entrega ou rotas principais estiverem quebrados. NÃO divulgue o link antes dos testes finais da Etapa 2. NÃO prometa publicação perfeita.`,
      agente:
        `Me ajude a montar um checklist de prontidão para publicar o app [nome do app ativo].

O que o app faz: [descreva o app]
Público: [descreva o público]
Promessa: [promessa]
Produto: [produto]

Quero saber: o que revisar antes de publicar, quais bloqueadores impedem publicação (login, checkout, entrega, termos), como diferenciar versão preview de versão pública e o que NÃO publicar ainda.`,
      corrigir:
        `Publiquei o app [nome do app ativo], mas ainda existem textos provisórios, botões sem ação ou páginas incompletas. Liste o que está inacabado por tela e proponha correções pequenas e seguras antes da divulgação. Não altere o que já funciona.`,
      avancar:
        "Avance quando o app tiver um link público funcionando, sem elementos claramente inacabados, e você tiver confirmado que ele abre fora do editor.",
    },
  },
  {
    n: 2,
    icon: ExternalLink,
    title: "Testar o link público",
    tabs: {
      lovable:
        `Gere um plano de teste do link público do app [nome do app ativo].

App: [descreva o app]
Ação principal: [ação principal]

O plano deve cobrir, em linguagem simples:

1. Abrir o link em janela anônima do navegador.
2. Abrir o link no celular (não só no computador).
3. Testar como visitante sem login.
4. Testar como usuário logado.
5. Testar as rotas principais do app.
6. Testar todos os botões e CTAs principais.
7. Testar uma página inexistente / rota quebrada (404).
8. Confirmar que área privada (entrega, área paga, admin) NÃO abre por link direto sem login.

Para cada teste, descreva: o que clicar, o resultado esperado e o que considerar problema.`,
      agente:
        `Me ajude a testar o link público do app [nome do app ativo] como se eu fosse um usuário real.

Quero saber: o que abrir primeiro, como simular um visitante sem login, como simular um usuário logado, como testar no celular, como conferir aba anônima e como identificar uma área privada exposta antes de divulgar.`,
      corrigir:
        `O link público do app [nome do app ativo] abre errado: cai em página branca, mostra tela de preview, perde estilo no celular ou expõe área privada por link direto. Diagnostique o problema e corrija sem alterar funcionalidades que já funcionam.`,
      avancar:
        "Avance quando o link abrir corretamente em navegador normal, em aba anônima e no celular, e nenhuma área privada estiver acessível sem login.",
    },
  },
  {
    n: 3,
    icon: Globe,
    title: "Configurar domínio",
    tabs: {
      lovable:
        `Oriente a configuração de domínio próprio para o app [nome do app ativo], de forma segura.

Produto: [produto]
Promessa: [promessa]

Cubra de forma clara:

1. Usar domínio próprio apenas quando o app já estiver pronto para divulgar.
2. Como apontar o domínio (DNS) e que a propagação pode levar tempo (até 72h).
3. Testar o app com e sem "www", quando aplicável.
4. Confirmar que HTTPS/SSL está ativo no endereço final.
5. Manter o link público antigo disponível até validar o novo domínio.
6. NÃO mexer em domínio sem entender a configuração, para não derrubar o app.

Não altere o domínio real da Fábrica de Apps. Esta orientação é para o domínio do APP DO ALUNO.`,
      agente:
        `Me ajude a decidir se devo usar domínio próprio agora ou continuar com o link público da plataforma para o app [nome do app ativo].

Produto: [produto]
Promessa: [promessa]

Considere: fase do app, validação, venda, confiança, custo, complexidade de DNS e risco de derrubar o app no meio da divulgação.`,
      corrigir:
        `O domínio do app [nome do app ativo] não está abrindo certo: cai em erro, perde HTTPS, abre versão errada ou só funciona com www (ou só sem www). Gere um diagnóstico simples para verificar DNS, redirecionamento, SSL e configuração da plataforma. Não derrube o link público que já funciona.`,
      avancar:
        "Avance quando o domínio (ou o link público escolhido) estiver abrindo com HTTPS, sem erro, em navegador normal e no celular.",
    },
  },
  {
    n: 4,
    icon: ImageIcon,
    title: "Revisar favicon e imagem social",
    tabs: {
      lovable:
        `Revise a identidade pública do app [nome do app ativo]:

App: [descreva o app]
Público: [descreva o público]
Promessa: [promessa]

Ajuste, de forma simples:

1. Favicon (ícone que aparece na aba do navegador).
2. Título da aba / título da página.
3. Descrição curta (meta description).
4. Imagem de compartilhamento (Open Graph) usada no WhatsApp e redes sociais.
5. Aparência do link quando colado em WhatsApp, Instagram, Facebook e navegador.

Evite imagem genérica, imagem quebrada, texto exagerado e promessa irreal. Mantenha alinhamento com o que o app entrega de verdade.`,
      agente:
        `Me ajude a definir favicon, título da aba, descrição curta e imagem social do app [nome do app ativo].

App: [descreva o app]
Público: [descreva o público]
Promessa: [promessa]

Quero que o link, quando compartilhado, transmita confiança, deixe clara a proposta e não pareça genérico.`,
      corrigir:
        `O link compartilhado do app [nome do app ativo] está sem imagem, com título errado, descrição ruim ou favicon padrão. Corrija metadados, favicon e imagem social para deixar profissional, sem prometer resultado garantido.`,
      avancar:
        "Avance quando favicon, título, descrição e imagem de compartilhamento estiverem revisados e o link aparecer bem no WhatsApp e no navegador.",
    },
  },
  {
    n: 5,
    icon: CheckSquare,
    title: "Confirmar produção antes de divulgar",
    tabs: {
      lovable:
        `Gere uma revisão final de produção do app [nome do app ativo] antes da divulgação.

App: [descreva o app]
Produto: [produto]
Promessa: [promessa]
Ação principal: [ação principal]

Confirme, item a item:

1. Home revisada (mensagem clara, sem placeholder).
2. CTA principal funcionando e levando ao lugar certo.
3. Termos de Uso e Política de Privacidade publicados e acessíveis.
4. Checkout ou link de pagamento testado (sem alterar integração).
5. Página de obrigado funcionando após pagamento.
6. Entrega protegida exigindo login.
7. Responsividade no celular (textos, botões, imagens).
8. Texto final sem placeholders ([descreva], [informe], [preencha], Lorem ipsum).
9. Nenhum dado de teste, e-mail de teste ou usuário de teste visível em produção.

Não prometa publicação perfeita, vendas garantidas, segurança 100% ou resultado garantido.`,
      agente:
        `Me ajude a fazer a revisão final do app [nome do app ativo] antes de divulgar.

App: [descreva o app]
Produto: [produto]
Promessa: [promessa]

Quero saber se o app está realmente pronto para receber usuários reais, quais riscos ainda existem e o que devo testar mais uma vez antes de mandar o link para alguém.`,
      corrigir:
        `Tenho dúvida se o app [nome do app ativo] está em preview ou em produção. Ajude a identificar qual versão está realmente pública, se metadados, checkout e entrega estão respondendo na versão pública e quais riscos existem antes da divulgação.`,
      avancar:
        "Avance quando o app publicado abrir corretamente em navegador normal, aba anônima e celular, sem placeholders visíveis e com áreas privadas protegidas.",
    },
  },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "Preview", def: "Versão de visualização dentro do editor, usada só para você testar enquanto constrói." },
  { termo: "Produção", def: "Versão pública e estável do app, acessada por usuários reais." },
  { termo: "Deploy", def: "O ato de publicar uma versão do app para que ela fique acessível na internet." },
  { termo: "Domínio", def: "Endereço próprio do app, como seusite.com.br." },
  { termo: "DNS", def: "Sistema que conecta o domínio ao app publicado. Configuração feita no registrador do domínio." },
  { termo: "Propagação", def: "Tempo que uma mudança de DNS leva para valer em todos os lugares (pode chegar a 72 horas)." },
  { termo: "SSL / HTTPS", def: "Cadeado de segurança no navegador. Garante que o tráfego entre o usuário e o app está criptografado." },
  { termo: "Favicon", def: "Ícone pequeno que aparece na aba do navegador ao lado do título do app." },
  { termo: "Imagem social", def: "Imagem (Open Graph) mostrada quando o link é compartilhado no WhatsApp, redes sociais ou mensagens." },
  { termo: "Link público", def: "URL que qualquer pessoa pode abrir para acessar o app sem precisar do editor." },
  { termo: "Rota quebrada / 404", def: "Página que não existe ou foi removida. O app deve mostrar uma tela amigável de \"página não encontrada\"." },
  { termo: "Redirect", def: "Regra que envia o usuário de um endereço antigo para um novo (ex.: sem www para com www)." },
  { termo: "Cache", def: "Cópia temporária que o navegador guarda. Pode mostrar versão antiga; teste em aba anônima para ver a versão real." },
];

const CHECKLIST_ITEMS = [
  "Publiquei o app",
  "Testei o link público",
  "Testei em aba anônima",
  "Testei no celular",
  "Testei como visitante sem login",
  "Testei como usuário logado",
  "Testei as páginas principais",
  "Testei botões e CTAs",
  "Conferi que áreas privadas estão protegidas",
  "Revisei domínio ou link público",
  "Confirmei HTTPS/SSL ativo",
  "Revisei favicon",
  "Revisei título e descrição",
  "Revisei imagem social",
  "Revisei termos e privacidade",
  "Conferi que não há placeholders nem dados de teste visíveis",
  "Confirmei que está pronto para divulgar",
];

const TAB_META: { id: TabId; label: string; icon: typeof Globe }[] = [
  { id: "lovable", label: "Implementar no Lovable", icon: Wrench },
  { id: "agente", label: "Revisar com o Agente primeiro", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];

const CHECKLIST_PREFIX = "publicar_step__";

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
          saveSourceModule="publicar"
          key={`${etapa.n}-${tab}`}
          originalPrompt={applyContextPlaceholders(etapa.tabs[tab], context)}
          storageKey={`${CHECKLIST_PREFIX}prompt__${etapa.n}__${tab}`}
          transformOnCopy={
            tab === "agente"
              ? undefined
              : (text) =>
                  buildLovablePrompt({
                    context,
                    stepName: `Publicar e Domínio — ${etapa.title}`,
                    stepObjective: `Preparar/validar a etapa "${etapa.title}" de publicação e domínio, sem alterar configurações já feitas.`,
                    command: text,
                    moduleId: "publicar",
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

      <CopyCommandWarning />
      <p className="text-xs text-muted-foreground mb-4">
        Use a aba <strong className="text-foreground/90">Implementar no Lovable</strong> quando
        quiser aplicar no app. Use a aba{" "}
        <strong className="text-foreground/90">Revisar com o Agente primeiro</strong> quando quiser
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

      <div className="mt-6">
        <AgentArchitectCard
          variant="compact"
          title="Quer revisar antes de publicar?"
          subtitle="Use o Agente Arquiteto para validar se seu app está pronto para sair do preview e ir para divulgação."
          ctaLabel="Revisar publicação com o Agente Arquiteto"
        />
      </div>
    </section>
  );
}

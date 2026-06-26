import { useState } from "react";
import { toast } from "sonner";
import {
  Users,
  ClipboardList,
  MessageSquare,
  Send,
  HelpCircle,
  Filter,
  Wrench,
  Bot,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  Circle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useUserProgress } from "@/hooks/useUserProgress";
import { CopyCommandWarning } from "@/components/entrega/CopyCommandWarning";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import { applyContextPlaceholders, buildLovablePrompt } from "@/lib/promptBuilder";
import { useProjectContext } from "@/hooks/useProjectContext";
import { ResumoValidacaoCard } from "@/components/entrega/ResumoValidacaoCard";

const AGENT_HELP_PROMPT = `Estou criando um aplicativo no Lovable e preciso validar com 10 pessoas reais antes de ampliar divulgação. Me ajude a planejar o teste, escrever convite honesto, escolher perguntas que revelam comportamento, separar sinal forte de sinal fraco e decidir o que melhorar primeiro — sem prometer validação, vendas ou aceitação garantida.`;

type TabId = "lovable" | "agente" | "corrigir" | "avancar";

type Etapa = {
  n: number;
  icon: typeof Users;
  title: string;
  tabs: Record<TabId, string>;
};

const ETAPAS: Etapa[] = [
  {
    n: 1,
    icon: ClipboardList,
    title: "Planejar teste com 10 usuários reais",
    tabs: {
      lovable:
        "Crie um plano para validar o app [nome do app ativo], que é [descreva o app] para [descreva o público] e resolve [descreva a dor], com a promessa de [promessa]. Defina: quem convidar, perfil mínimo do público, onde encontrar essas pessoas, o que será observado durante o teste, o que conta como sucesso, o que conta como sinal fraco, como registrar respostas sem induzir, prazo do teste e cuidados éticos. Não prometa validação, vendas ou aceitação garantida.",
      agente:
        "Me ajude a planejar um teste do app [nome do app ativo] com 10 usuários reais. Quero definir quem convidar, perfil mínimo, o que observar, o que conta como sucesso e sinal fraco, como registrar respostas sem induzir, prazo e cuidados éticos.",
      corrigir:
        "Meu plano de validação do app [nome do app ativo] está genérico. Refaça com foco em comportamento real, perfil de público e o que observar — não em opinião educada.",
      avancar:
        "Avance quando você souber quem chamar, o que observar e o que conta como sucesso ou sinal fraco.",
    },
  },
  {
    n: 2,
    icon: MessageSquare,
    title: "Criar formulário de feedback simples",
    tabs: {
      lovable:
        "Crie um formulário curto de feedback para validar o app [nome do app ativo] ([descreva o app]) com [descreva o público]. Máximo 10 perguntas. Inclua: você entendeu o que o app faz? o que te fez clicar ou não clicar? onde ficou confuso? você completou o fluxo? você clicaria no CTA? você pagaria pelo resultado completo? qual preço pareceria aceitável? qual foi sua maior dúvida? o que faria você confiar mais? o que melhoraria antes de divulgar? Não peça dados sensíveis. Não induza elogio.",
      agente:
        "Me ajude a criar um formulário curto de feedback para o app [nome do app ativo]. Quero perguntas sobre clareza, interesse, confiança, intenção de compra, dúvida e melhoria — sem induzir elogio e sem coletar dados sensíveis.",
      corrigir:
        "Meu formulário de feedback do app [nome do app ativo] ficou longo ou induz elogio. Refaça em até 10 perguntas focadas em comportamento, dúvida e objeção.",
      avancar:
        "Avance quando o formulário couber em 10 perguntas e revelar clareza, intenção e objeções.",
    },
  },
  {
    n: 3,
    icon: Send,
    title: "Criar mensagem de convite",
    tabs: {
      lovable:
        "Crie 3 versões curtas de mensagem de convite para pessoas testarem o app [nome do app ativo] ([descreva o app] para [descreva o público]). Cada mensagem deve: ser curta, não pressionar, explicar que é teste, pedir comportamento real (não elogio), pedir para testar no celular, pedir feedback honesto e não prometer resultado garantido. Inclua versão WhatsApp, versão direct/Instagram e versão pessoal para alguém conhecido.",
      agente:
        "Me ajude a escrever um convite curto e honesto para 10 pessoas testarem o app [nome do app ativo]. Sem pressão, sem promessa, pedindo comportamento real e feedback honesto.",
      corrigir:
        "Minhas mensagens de convite do app [nome do app ativo] estão longas ou parecem venda. Refaça em versões curtas, honestas e sem promessa de resultado.",
      avancar:
        "Avance quando tiver uma mensagem curta, honesta e sem promessa para o canal escolhido.",
    },
  },
  {
    n: 4,
    icon: HelpCircle,
    title: "Fazer perguntas certas aos usuários",
    tabs: {
      lovable:
        "Crie um roteiro de perguntas para conversar com quem testou o app [nome do app ativo]. Separe em 7 grupos: perguntas de clareza (a promessa ficou clara?), perguntas de interesse (você voltaria?), perguntas de confiança (o que te faria confiar mais?), perguntas de compra (você pagaria? quanto?), perguntas de objeção (o que te impediria?), perguntas de melhoria (o que mudaria antes de divulgar?), perguntas de comportamento observado (o que a pessoa fez, não só o que ela acha). Evite perguntas que induzem 'sim/não' educado.",
      agente:
        "Me ajude a montar perguntas para usuários que testaram o app [nome do app ativo]. Quero separar clareza, interesse, confiança, compra, objeção, melhoria e comportamento observado — sem induzir elogio.",
      corrigir:
        "Minhas perguntas para os usuários do app [nome do app ativo] estão fracas e geram só 'gostei'. Refaça focando em comportamento, dúvida e objeção.",
      avancar:
        "Avance quando suas perguntas revelarem comportamento, não apenas opinião.",
    },
  },
  {
    n: 5,
    icon: Filter,
    title: "Separar sinal real de sinal fraco",
    tabs: {
      lovable:
        "Analise os feedbacks coletados sobre o app [nome do app ativo] e classifique em: sinal forte (comprou, perguntou preço, pediu acesso, voltou, indicou), sinal médio (completou ação principal e demonstrou interesse), sinal fraco (elogio sem ação, resposta vaga), objeção recorrente, dúvida repetida, comportamento de abandono, intenção de compra e intenção de indicação. Entregue: padrões identificados, o que corrigir primeiro, o que não mudar agora e próximo teste recomendado. Não decida com base em uma única opinião isolada.",
      agente:
        "Me ajude a separar sinal real de sinal fraco nos feedbacks do app [nome do app ativo]. Quero identificar padrões, objeções recorrentes, intenção de compra e o que corrigir primeiro sem decidir por opinião isolada.",
      corrigir:
        "Minha análise de feedback do app [nome do app ativo] virou lista de opinião. Refaça separando comportamento observado de opinião educada e priorize o que repetiu.",
      avancar:
        "Avance quando souber quais feedbacks representam comportamento real e quais são opinião isolada.",
    },
  },
  {
    n: 6,
    icon: Wrench,
    title: "Melhorar o app com base no feedback",
    tabs: {
      lovable:
        "Aplique uma melhoria principal no app [nome do app ativo] com base no maior bloqueio identificado no feedback. Escolha apenas UMA mudança. Não refaça o app inteiro. Preserve login, banco, checkout, área paga, admin, dados do usuário e fluxos aprovados. Não altere identidade visual sem necessidade. Teste antes de concluir, registre o que mudou, o porquê, o que foi preservado e o que precisa ser testado novamente.",
      agente:
        "Me ajude a transformar o feedback do app [nome do app ativo] em UMA melhoria principal segura. Quero corrigir primeiro o maior bloqueio, preservar login, banco, checkout, entrega e admin, e testar novamente.",
      corrigir:
        "As melhorias aplicadas no app [nome do app ativo] após o feedback ficaram grandes demais. Reduza para uma mudança principal e preserve o que estava certo.",
      avancar:
        "Avance quando a melhoria principal estiver aplicada, testada e registrada, sem quebrar login, checkout, entrega ou dados.",
    },
  },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "Validação", def: "Teste com pessoas reais para descobrir se o app é entendido, usado e desejado." },
  { termo: "Hipótese", def: "Suposição clara que você quer testar (ex.: 'as pessoas pagariam pelo resultado completo')." },
  { termo: "Sinal forte", def: "Ação real: compra, pedido de acesso, retorno, indicação, pergunta de preço." },
  { termo: "Sinal fraco", def: "Elogio educado, curtida sem clique, 'eu usaria' sem testar." },
  { termo: "Feedback", def: "Resposta, dúvida, objeção ou observação de quem testou." },
  { termo: "Objeção", def: "Motivo concreto que impede a pessoa de usar, confiar ou comprar." },
  { termo: "Intenção de compra", def: "Sinal claro de que a pessoa quer pagar (pergunta preço, tenta comprar)." },
  { termo: "Usuário real", def: "Pessoa parecida com o público que você quer atender, não amigo educado." },
  { termo: "Teste pequeno", def: "Validação com poucas pessoas antes de ampliar divulgação." },
  { termo: "Amostra", def: "Conjunto de pessoas que testaram. Pequena no início, suficiente para padrões." },
  { termo: "Conversão", def: "Quando a pessoa completa a ação esperada (clique no CTA, compra, cadastro)." },
  { termo: "Abandono", def: "Quando a pessoa começa e desiste antes de concluir." },
  { termo: "Iteração", def: "Ciclo de testar, ouvir, ajustar e testar de novo." },
  { termo: "Viabilidade", def: "Se a ideia, oferta e preço fazem sentido para o público escolhido." },
];

const CHECKLIST_ITEMS = [
  "Convidei 10 pessoas reais",
  "Pelo menos 5 testaram",
  "Pelo menos 3 completaram a ação principal",
  "Registrei dúvidas e objeções",
  "Identifiquei sinais fortes",
  "Identifiquei sinais fracos",
  "Separei opinião de comportamento",
  "Validei clareza da promessa",
  "Validei interesse na oferta",
  "Validei intenção de compra",
  "Defini uma melhoria principal",
  "Não decidi com base em uma opinião isolada",
  "Vou testar novamente após ajustar",
];

const TAB_META: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: "lovable", label: "Implementar no Lovable", icon: Wrench },
  { id: "agente", label: "Revisar com o Agente primeiro", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];

const CHECKLIST_PREFIX = "validacao_step__";

const RAW_VALIDACAO_PLACEHOLDER =
  /\[(?:nome do app(?:\s+ativo|\s+selecionado|\s+atual)?|descreva(?:\s+o\s+app|\s+o\s+público|\s+a\s+dor)?|promessa|produto(?:\s+ou\s+serviço)?|modelo de cobrança|ação principal|informe|preencha|público|problema|cole(?:\s+aqui)?|cole resumo|WhatsApp,.*outro)\]|Aplicativo X/i;

// Frases das versões antigas (v1) do COMMANDS_VALIDACAO. Quando o contexto
// está preenchido, prompts salvos com essas frases são considerados obsoletos
// e substituídos pela versão contextualizada nova.
const LEGACY_VALIDACAO_PHRASES: RegExp[] = [
  /Crie um plano para validar este app com 10 usuários reais/i,
  /Crie um formulário de feedback simples para testar este app/i,
  /Crie mensagens de convite para pessoas testarem este app/i,
  /Crie uma pesquisa com 10 perguntas para entender o público deste app/i,
  /Analise as respostas coletadas e separe elogios de sinais reais/i,
  /Aplique melhorias no app com base neste feedback/i,
];

function EtapaCard({ etapa }: { etapa: Etapa }) {
  const [tab, setTab] = useState<TabId>("lovable");
  const { context, isFilled } = useProjectContext();
  const Icon = etapa.icon;
  const resolvedPrompt = applyContextPlaceholders(etapa.tabs[tab], context);
  const invalidateSavedPrompt = isFilled
    ? (saved: string) =>
        RAW_VALIDACAO_PLACEHOLDER.test(saved) ||
        LEGACY_VALIDACAO_PHRASES.some((re) => re.test(saved))
    : undefined;
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
            {resolvedPrompt}
          </pre>
        </div>
      ) : (
        <EditablePromptBox
          saveSourceModule="validacao"
          key={`${etapa.n}-${tab}`}
          originalPrompt={resolvedPrompt}
          shouldInvalidateSavedValue={invalidateSavedPrompt}
          storageKey={`${CHECKLIST_PREFIX}prompt__${etapa.n}__${tab}`}
          transformOnCopy={
            tab === "agente"
              ? undefined
              : (text) =>
                  buildLovablePrompt({
                    context,
                    stepName: `Validação — ${etapa.title}`,
                    stepObjective: `Trabalhar a etapa "${etapa.title}" de validação do app com pessoas reais. Não refazer o app inteiro nem alterar login, banco, checkout, área paga, admin ou dados sem pedido explícito. Não coletar dados sensíveis.`,
                    command: text,
                    moduleId: "validacao",
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
            isFilled
              ? "Este prompt já usa o contexto do projeto em foco. Revise antes de copiar."
              : tab === "agente"
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

export function ValidacaoModule() {
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
          <Users size={12} /> Validação
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Valide com comportamento real, não com elogio
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Teste o app com 10 pessoas reais antes de ampliar divulgação. Separe
          sinal forte de sinal fraco e decida com base em comportamento.
        </p>
      </header>

      <ResumoValidacaoCard />

      <GlassCard className="p-5 mb-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
            Validar não é colecionar elogios. Validar é observar o que pessoas
            reais fazem, o que perguntam e o que se dispõem a deixar (contato,
            pagamento, indicação).
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-5 mb-6">
        <div className="text-[11px] uppercase tracking-wider text-accent mb-2">
          O que você vai fazer nesta etapa
        </div>
        <p className="text-sm text-foreground/90 mb-4">
          Você vai planejar o teste, criar formulário e convite, conversar com
          usuários, separar sinal real de elogio e aplicar UMA melhoria principal.
        </p>
        <div className="mt-1">
          <button
            onClick={copyAgentHelp}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15 text-sm font-semibold transition"
          >
            <Bot size={14} /> Não sei como validar
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
        <strong className="text-foreground/90">Revisar com o Agente primeiro</strong> quando
        quiser ajuda para decidir antes de construir.
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

      <GlassCard className="p-5 mb-6 border-sky-400/30 bg-sky-400/5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={16} className="text-sky-300" />
          <h3 className="font-heading font-semibold text-base">Antes de avançar, decida com critério</h3>
        </div>
        <ul className="space-y-2 text-sm text-foreground/90">
          <li>• Avance se pessoas reais entenderam, testaram e demonstraram interesse.</li>
          <li>• Não avance se você só recebeu elogios vagos.</li>
          <li>• Melhore antes de divulgar se as pessoas não entendem, não clicam ou abandonam cedo.</li>
          <li>• Valide novamente depois da melhoria.</li>
        </ul>
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
          Quando todos os itens estiverem marcados, esta etapa será considerada
          concluída na sua jornada.
        </p>
      </GlassCard>
    </section>
  );
}

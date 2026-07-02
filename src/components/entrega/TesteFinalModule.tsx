import { useState } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  AlertTriangle,
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
  Database,
  Shield,
  FileText,
  Zap,
  Rocket,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useUserProgress } from "@/hooks/useUserProgress";
import { CopyCommandWarning } from "@/components/entrega/CopyCommandWarning";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import { AgentArchitectCard } from "@/components/entrega/AgentArchitectCard";
import { useProjectContext } from "@/hooks/useProjectContext";
import { applyContextPlaceholders, buildLovablePrompt } from "@/lib/promptBuilder";
import { ResumoTesteFinalCard } from "./ResumoTesteFinalCard";


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
        `Gere um plano de teste do app [nome do app ativo] como visitante (sem login).

App: [descreva o app]
Público: [descreva o público]
Ação principal: [ação principal]

Cubra, em linguagem simples:

1. Abrir o link público em janela anônima.
2. Abrir o link no celular (não só no computador).
3. Navegar pela home e entender a proposta em até 10 segundos.
4. Clicar no CTA principal e confirmar para onde ele leva.
5. Testar o início do fluxo principal sem precisar fazer login.
6. Confirmar que o visitante NÃO vê área protegida (entrega, área paga, admin).
7. Confirmar que nenhuma informação paga aparece exposta publicamente.

Liste o que está claro, o que está confuso e o que está quebrado por tela.`,
      agente:
        `Me ajude a testar o app [nome do app ativo] como visitante. Quero saber se uma pessoa nova entende o que o app faz, para quem é, qual botão clicar e qual o próximo passo, sem precisar de explicação.

App: [descreva o app]
Público: [descreva o público]
Promessa: [promessa]`,
      corrigir:
        `O visitante não entende o que fazer no app [nome do app ativo]. Revise home, CTA principal, explicação da oferta e caminho até a ação principal, sem alterar layout aprovado nem áreas sensíveis.`,
      avancar:
        "Avance quando uma pessoa nova conseguir abrir o app, entender a proposta e iniciar o fluxo principal sem explicação, em aba anônima e no celular.",
    },
  },
  {
    n: 2,
    icon: Lock,
    title: "Testar login e área restrita",
    tabs: {
      lovable:
        `Gere um plano de teste de login e área restrita do app [nome do app ativo].

App: [descreva o app]
Produto: [produto]

Cubra, em linguagem simples:

1. Login com usuário autorizado (deve entrar e ver a área correta).
2. Login com usuário sem acesso (NÃO deve ver conteúdo protegido).
3. Logout (deve sair da sessão e bloquear áreas privadas).
4. Tentar acessar rota protegida por URL direta sem estar logado (deve bloquear/redirecionar).
5. Redirecionamento correto após login (não cair em página vazia).
6. Recuperação de acesso, se existir (link, e-mail, suporte).
7. Admin só acessa admin (se houver perfil admin no app).

NÃO altere autenticação, banco, RLS ou regras de acesso. Apenas teste e descreva o resultado.`,
      agente:
        `Me ajude a testar login e acesso do app [nome do app ativo].

App: [descreva o app]
Produto: [produto]

Quero saber o que verificar para não deixar conteúdo privado visível e não bloquear quem deveria entrar, cobrindo: usuário autorizado, usuário sem acesso, logout, URL direta, redirect, recuperação e admin.`,
      corrigir:
        `O login ou a área restrita do app [nome do app ativo] não está funcionando como deveria. Diagnostique o fluxo de acesso sem alterar autenticação, banco ou regras sensíveis sem necessidade. Liste o que falha por perfil (visitante, autorizado, sem acesso, admin).`,
      avancar:
        "Avance quando login, logout, recuperação e bloqueio de URL direta funcionarem corretamente para cada perfil.",
    },
  },
  {
    n: 3,
    icon: MousePointerClick,
    title: "Testar botões, formulários e links",
    tabs: {
      lovable:
        `Revise botões, formulários e links do app [nome do app ativo].

App: [descreva o app]
Ação principal: [ação principal]

Liste por tela:

1. Botão principal (CTA da ação principal).
2. Botões secundários (menu, voltar, fechar, copiar etc).
3. Formulários (envio, sucesso, erro).
4. Validação de campos obrigatórios.
5. Mensagens de erro claras e em linguagem simples.
6. Links internos (vão para a página certa).
7. Links externos (abrem corretamente, sem 404).
8. Páginas de Termos de Uso e Política de Privacidade acessíveis.
9. Página inexistente / rota 404 com tela amigável.

Para cada item, marque: ✅ funciona, ⚠️ funciona com ressalva, ❌ quebrado. Não altere o que já funciona.`,
      agente:
        `Me ajude a testar botões e formulários do app [nome do app ativo] como usuário real.

App: [descreva o app]

Quero saber quais ações são críticas, como identificar falhas antes de divulgar e o que pode estar quebrado sem eu perceber (links errados, formulário sem envio, mensagens de erro confusas, 404 sem tratamento).`,
      corrigir:
        `Existem botões sem ação, formulários que não enviam, validações ausentes ou links errados no app [nome do app ativo]. Corrija preservando layout e sem mexer no que já funciona. Liste cada correção feita.`,
      avancar:
        "Avance quando botões principais, formulários críticos, links internos/externos, termos/privacidade e rota 404 estiverem todos funcionando.",
    },
  },
  {
    n: 4,
    icon: ShoppingCart,
    title: "Testar checkout e entrega",
    tabs: {
      lovable:
        `Gere um plano de teste do fluxo de compra e entrega do app [nome do app ativo].

Produto: [produto]
Modelo de cobrança: [modelo de cobrança]
Promessa: [promessa]

Cubra, em linguagem simples:

1. Link de pagamento / checkout abre corretamente.
2. Preço exibido bate com a oferta da página de venda.
3. Página de obrigado aparece após pagamento.
4. Compra pendente é tratada (mensagem clara, sem prometer acesso imediato).
5. Compra aprovada libera acesso conforme descrito.
6. Entrega/material pago protegido exige login (NÃO abre por URL direta).
7. Resultado completo ou material pago só visível para autorizado.
8. Recuperação de acesso funciona (e-mail, link mágico, suporte).
9. Visitante NÃO consegue burlar acesso por link direto ou parâmetro.

NÃO altere integrações de pagamento, banco, RLS ou checkout real. Apenas teste e descreva o que viu.`,
      agente:
        `Me ajude a testar o fluxo de compra e entrega do app [nome do app ativo].

Produto: [produto]
Modelo de cobrança: [modelo de cobrança]

Quero saber se o comprador entende preço, momento da liberação, pendência, recuperação de acesso e se nenhum visitante consegue ver o material pago por link direto.`,
      corrigir:
        `O fluxo de checkout ou entrega do app [nome do app ativo] está confuso ou exposto. Revise página de pagamento, obrigado, acesso, entrega e instruções para o comprador. Não altere integrações sensíveis nem regras de acesso sem necessidade.`,
      avancar:
        "Avance quando o fluxo de compra e entrega estiver claro do começo ao fim e visitante não conseguir abrir a área paga por link direto.",
    },
  },
  {
    n: 5,
    icon: Smartphone,
    title: "Testar mobile e revisão final",
    tabs: {
      lovable:
        `Faça a revisão final mobile e de produção do app [nome do app ativo] antes da divulgação.

App: [descreva o app]
Promessa: [promessa]
Ação principal: [ação principal]

Confirme, item a item:

1. Layout no celular (sem scroll horizontal, sem corte de texto).
2. Leitura confortável dos textos no celular.
3. Botões tocáveis (área grande o suficiente, sem sobreposição).
4. Formulários utilizáveis no celular (teclado correto, sem zoom forçado).
5. Imagem social aparece bem em WhatsApp e redes.
6. Favicon presente e correto.
7. Título e descrição da aba/produto coerentes.
8. Velocidade percebida razoável (sem espera longa em branco).
9. NENHUM placeholder visível ([descreva], [informe], Lorem ipsum etc).
10. NENHUM dado de teste visível (e-mails fictícios, "teste 123", usuários fake).
11. Promessa responsável (sem garantir resultado impossível).

Liste o que está OK, o que precisa ajuste e o que precisa correção antes de divulgar.`,
      agente:
        `Me ajude a fazer a revisão final mobile e de produção do app [nome do app ativo].

Promessa: [promessa]
Público: [descreva o público]

Quero uma lista do que observar no celular e em produção antes de divulgar: layout, leitura, botões, formulários, imagem social, favicon, título/descrição, velocidade percebida, placeholders e promessa responsável.`,
      corrigir:
        `O app [nome do app ativo] está ruim no celular ou tem texto provisório/dado de teste visível. Corrija responsividade, espaçamento, botões, menus, textos, placeholders e dados de teste. Não altere a lógica do app nem layout aprovado.`,
      avancar:
        "Avance quando o app estiver legível e clicável no celular, sem scroll horizontal, sem placeholders, sem dados de teste e com identidade de compartilhamento (favicon, título, descrição, imagem) revisada.",
    },
  },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "Fluxo crítico", def: "O caminho mais importante que o usuário precisa completar dentro do app (ex.: abrir → CTA → resultado/compra)." },
  { termo: "Visitante", def: "Pessoa que abre o app sem login. Só pode ver áreas públicas." },
  { termo: "Usuário logado", def: "Pessoa que entrou no app com a própria conta e tem acesso às áreas internas conforme a permissão." },
  { termo: "Comprador", def: "Usuário que já pagou e por isso tem acesso à entrega, à área paga ou ao material protegido." },
  { termo: "Admin", def: "Perfil interno com permissões avançadas (gestão, dados, configurações). Só você ou pessoas autorizadas devem ter." },
  { termo: "Rota pública", def: "Endereço do app que qualquer pessoa pode abrir sem login." },
  { termo: "Rota protegida", def: "Endereço do app que só abre para quem está logado e autorizado." },
  { termo: "Rota 404", def: "Página que não existe ou foi removida. O app deve mostrar uma tela amigável de \"página não encontrada\"." },
  { termo: "Checkout", def: "Tela ou link onde a pessoa paga pelo produto/serviço." },
  { termo: "Página de obrigado", def: "Tela exibida logo após o pagamento, explicando o próximo passo (acesso, e-mail, suporte)." },
  { termo: "Entrega protegida", def: "Área onde o material pago fica disponível só para quem está logado e autorizado." },
  { termo: "Responsivo", def: "Quando o app funciona bem em computador, tablet e celular." },
  { termo: "Mobile first", def: "Pensar e testar primeiro no celular, porque a maioria dos usuários abre por ali." },
  { termo: "Dados de teste", def: "Informações fictícias (usuário teste, e-mail fake, valor R$0,01) usadas durante a construção. NÃO devem ficar visíveis em produção." },
  { termo: "Placeholder", def: "Texto provisório entre colchetes ([descreva], [informe]) que precisa ser substituído antes de divulgar." },
  { termo: "Bug bloqueador", def: "Erro que impede o usuário de concluir o fluxo principal (login, CTA, checkout, entrega, mobile). Antes da divulgação, deve ser corrigido." },
];

const CHECKLIST_GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Geral",
    items: [
      "Testei como visitante",
      "Testei em aba anônima",
      "Testei no celular",
    ],
  },
  {
    title: "Visitante",
    items: [
      "Testei o CTA principal",
      "Testei links internos e externos",
    ],
  },
  {
    title: "Login e acesso",
    items: [
      "Testei login autorizado",
      "Testei usuário sem acesso",
      "Testei logout",
      "Testei rota protegida por link direto",
    ],
  },
  {
    title: "Botões e formulários",
    items: [
      "Testei formulários",
      "Testei validações e mensagens de erro",
      "Testei rota 404",
    ],
  },
  {
    title: "Checkout e entrega",
    items: [
      "Testei checkout ou link de pagamento",
      "Testei página de obrigado",
      "Testei entrega protegida",
      "Confirmei que material pago não está público",
    ],
  },
  {
    title: "Mobile",
    items: [
      "Layout sem scroll horizontal no celular",
      "Botões tocáveis e formulários utilizáveis no celular",
    ],
  },
  {
    title: "Conteúdo e confiança",
    items: [
      "Revisei termos e privacidade",
      "Removi placeholders",
      "Removi dados de teste",
      "Revisei promessa responsável",
    ],
  },
  {
    title: "Pronto para divulgar",
    items: [
      "Corrigi bugs bloqueadores",
      "Estou pronto para divulgar",
    ],
  },
];

const CHECKLIST_TOTAL = CHECKLIST_GROUPS.reduce((acc, g) => acc + g.items.length, 0);


const TAB_META: { id: TabId; label: string; icon: typeof ShieldCheck }[] = [
  { id: "lovable", label: "Implementar no Lovable", icon: Wrench },
  { id: "agente", label: "Revisar com o Agente Arquiteto primeiro", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];

const CHECKLIST_PREFIX = "teste_step__";

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
          saveSourceModule="teste"
          key={`${etapa.n}-${tab}`}
          originalPrompt={applyContextPlaceholders(etapa.tabs[tab], context)}
          storageKey={`${CHECKLIST_PREFIX}prompt__${etapa.n}__${tab}`}
          transformOnCopy={
            tab === "agente"
              ? undefined
              : (text) =>
                  buildLovablePrompt({
                    context,
                    stepName: `Teste Final — ${etapa.title}`,
                    stepObjective: `Auditar e testar a etapa "${etapa.title}" do teste final, sem alterar áreas sensíveis.`,
                    command: text,
                    moduleId: "teste",
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

const PWA_LOJA_PREFIX = "teste_pwa__";

const PWA_LOJA_GROUPS: {
  title: string;
  icon: typeof Smartphone;
  items: string[];
}[] = [
  {
    title: "Experiência mobile",
    icon: Smartphone,
    items: [
      "O app abre bem no celular",
      "Os botões são fáceis de tocar",
      "Os textos estão legíveis",
      "As telas não ficam cortadas",
      "O menu funciona no mobile",
      "O fluxo principal pode ser concluído pelo celular",
    ],
  },
  {
    title: "Login e acesso",
    icon: Lock,
    items: [
      "O cadastro funciona",
      "O login funciona",
      "O logout funciona",
      "Páginas privadas não aparecem para quem não está logada",
      "Área paga, se existir, está protegida",
      "Usuárias diferentes não acessam dados umas das outras",
    ],
  },
  {
    title: "Banco e dados",
    icon: Database,
    items: [
      "As informações são salvas corretamente",
      "As informações aparecem no lugar certo",
      "Os dados não somem ao atualizar a página",
      "Cada usuária vê apenas o que deveria ver",
      "Não há dados sensíveis aparecendo na tela ou no console",
    ],
  },
  {
    title: "Segurança básica",
    icon: Shield,
    items: [
      "RLS está ativo nas tabelas públicas",
      "As policies respeitam o usuário autenticado quando necessário",
      "Não há chaves secretas expostas no frontend",
      "Não há service_role no frontend",
      "Rotas privadas estão protegidas",
      "A lógica de acesso pago não pode ser burlada facilmente",
    ],
  },
  {
    title: "Conteúdo e páginas obrigatórias",
    icon: FileText,
    items: [
      "O app tem nome claro",
      "O app tem descrição clara",
      "Existe uma página ou link de suporte",
      "Existe política de privacidade quando houver coleta de dados",
      "Existem termos de uso quando necessário",
      "Os textos não prometem resultado garantido",
      "Os links principais funcionam",
    ],
  },
  {
    title: "Performance e bugs",
    icon: Zap,
    items: [
      "O app carrega em tempo aceitável",
      "Não há erros visíveis na tela",
      "Não há botões sem função importante",
      "Não há páginas quebradas",
      "Não há fluxo principal travando",
      "O app foi testado em mais de um tamanho de tela",
    ],
  },
  {
    title: "Prontidão para PWA ou loja",
    icon: Rocket,
    items: [
      "O app já foi validado com usuárias reais",
      "Existe motivo claro para ser instalável",
      "As usuárias pediram acesso pelo celular",
      "O app oferece mais do que uma página simples",
      "A experiência mobile está boa o suficiente",
      "Há estrutura para suporte e manutenção",
    ],
  },
];

const PWA_LOJA_TOTAL = PWA_LOJA_GROUPS.reduce((a, g) => a + g.items.length, 0);

function PwaLojaChecklist() {
  const { checklist, setChecklist } = useUserProgress();
  const toggle = (item: string) => {
    const key = `${PWA_LOJA_PREFIX}${item}`;
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const doneCount = PWA_LOJA_GROUPS.reduce(
    (acc, g) =>
      acc + g.items.filter((it) => !!checklist[`${PWA_LOJA_PREFIX}${it}`]).length,
    0,
  );
  const pct = Math.round((doneCount / PWA_LOJA_TOTAL) * 100);
  const pendentes = PWA_LOJA_TOTAL - doneCount;

  return (
    <>
    <GlassCard className="p-5 md:p-6 mt-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">

      <div className="flex items-center gap-2 mb-2">
        <Rocket size={16} className="text-accent" />
        <span className="text-[11px] uppercase tracking-wider text-accent">
          Checklist complementar
        </span>
      </div>
      <h2 className="text-xl md:text-2xl font-heading font-bold mb-2">
        Antes de transformar em PWA ou pensar em lojas
      </h2>
      <p className="text-sm md:text-base text-foreground/85 leading-relaxed mb-5">
        Antes de tentar transformar seu app em instalável, empacotar para
        Android/iOS ou pensar em App Store e Google Play, faça um teste final
        com calma. Um app com bugs, telas quebradas, login instável ou páginas
        incompletas deve ser corrigido antes de qualquer evolução mobile.
      </p>

      <div className="mb-5 rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-foreground/80">
            {doneCount} de {PWA_LOJA_TOTAL} itens confirmados
          </span>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {pct}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="space-y-5">
        {PWA_LOJA_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.title}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
                  <Icon size={14} />
                </div>
                <h3 className="font-heading font-semibold text-sm md:text-base">
                  {group.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {group.items.map((item) => {
                  const key = `${PWA_LOJA_PREFIX}${item}`;
                  const done = !!checklist[key];
                  return (
                    <li key={item}>
                      <label className="flex items-center gap-3 p-2 rounded-lg border border-white/5 bg-black/20 hover:bg-white/5 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => toggle(item)}
                          className="accent-accent w-4 h-4 shrink-0"
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
            </div>
          );
        })}
      </div>

      <div
        className={`mt-5 rounded-xl border p-4 ${
          pendentes > 5
            ? "border-rose-400/30 bg-rose-400/5"
            : "border-emerald-400/30 bg-emerald-400/5"
        }`}
      >
        <div className="text-[11px] uppercase tracking-wider mb-1 text-foreground/70">
          Recomendação
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">
          {pendentes > 5 ? (
            <>
              Muitos itens ainda estão pendentes. <strong>Não vá para loja agora.</strong>{" "}
              Corrija, teste e valide primeiro. Publique como web app, valide
              com pessoas reais, melhore a experiência mobile e só depois decida
              se vale transformar em PWA, empacotar ou enviar para lojas.
            </>
          ) : (
            <>
              Boa parte do checklist está confirmada. Continue publicando como
              web app, colete feedback real e só depois decida se vale
              transformar em PWA, empacotar ou enviar para lojas.
            </>
          )}
        </p>
      </div>

      <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle
            size={16}
            className="text-amber-300 shrink-0 mt-0.5"
          />
          <p className="text-xs md:text-sm text-foreground/85 leading-relaxed">
            <strong className="text-amber-200">Aviso:</strong> esta checklist
            ajuda a preparar o app com mais segurança, mas <strong>não garante
            aprovação na App Store ou Google Play</strong>. As lojas possuem
            regras próprias, custos, revisões e podem solicitar ajustes antes
            da publicação.
          </p>
        </div>
      </div>
    </GlassCard>
    <PromptsExecutarEtapa prompts={PROMPTS_TESTE} />
    </>
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

      <GlassCard className="p-5 mb-4 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
            <strong className="text-foreground">Antes de divulgar, teste o app como visitante, usuário logado, comprador e no celular.</strong>{" "}
            App bonito ainda pode estar quebrado. O teste final existe para
            encontrar erros antes que outras pessoas encontrem.
          </p>
        </div>
      </GlassCard>

      <div className="mb-6 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-[13px] text-rose-100 flex items-start gap-2">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        <p>
          <strong>Se login, checkout, entrega, botão principal ou mobile falharem, não divulgue ainda.</strong>{" "}
          Corrija o bloqueador, refaça o teste e só depois libere o link.
        </p>
      </div>

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
        Use a aba <strong className="text-foreground/90">Implementar no Lovable</strong> quando
        quiser aplicar no app. Use a aba{" "}
        <strong className="text-foreground/90">Revisar com o Agente Arquiteto primeiro</strong> quando quiser
        ajuda para decidir antes de construir.
      </p>

      <ResumoTesteFinalCard />

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
        <div className="flex items-start gap-2 mb-1">
          <Bug size={16} className="text-emerald-300 mt-1" />
          <h3 className="font-heading font-semibold text-base">
            Checklist final de publicação
          </h3>
        </div>
        <p className="text-sm text-foreground/80 mb-3">
          Antes de divulgar seu app, marque os testes principais. Isso evita
          publicar com erro de login, botão, checkout, entrega ou visual no
          celular.
        </p>

        {(() => {
          const doneCount = CHECKLIST_GROUPS.reduce(
            (acc, g) =>
              acc +
              g.items.filter((it) => !!checklist[`${CHECKLIST_PREFIX}${it}`]).length,
            0,
          );
          const allDone = doneCount === CHECKLIST_TOTAL;
          const pct = Math.round((doneCount / CHECKLIST_TOTAL) * 100);

          const finishTest = () => {
            if (!allDone) return;
            toast.success("Teste final concluído. Seu app está pronto para divulgação inicial.");
          };

          return (
            <>
              <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-foreground/80">
                    {doneCount} de {CHECKLIST_TOTAL} testes concluídos
                  </span>
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {pct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="space-y-5">
                {CHECKLIST_GROUPS.map((group) => (
                  <div key={group.title}>
                    <div className="text-[10px] uppercase tracking-wider text-accent/80 mb-2">
                      {group.title}
                    </div>
                    <ul className="space-y-2">
                      {group.items.map((item) => {
                        const key = `${CHECKLIST_PREFIX}${item}`;
                        const done = !!checklist[key];
                        return (
                          <li key={item}>
                            <label className="flex items-center gap-3 p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition">
                              <input
                                type="checkbox"
                                checked={done}
                                onChange={() => toggleItem(item)}
                                className="accent-accent w-4 h-4 shrink-0"
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
                  </div>
                ))}
              </div>

              {allDone && (
                <div className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-300 shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-100 leading-snug">
                    Teste final concluído. Seu app está pronto para divulgação
                    inicial.
                  </p>
                </div>
              )}

              <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-3 text-[13px] text-foreground/85 space-y-1.5">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-300 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-emerald-200">Pode avançar</strong> se todos os testes críticos passaram (visitante, login, CTA, checkout, entrega, mobile).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle size={14} className="text-rose-300 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-rose-200">Não avance</strong> se login, checkout, entrega, CTA principal ou mobile ainda falham. Corrija primeiro.
                  </span>
                </div>
              </div>


              <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-[11px] text-muted-foreground">
                  Quando todos os testes estiverem marcados, esta etapa será
                  considerada concluída na sua jornada.
                </p>
                <button
                  type="button"
                  onClick={finishTest}
                  disabled={!allDone}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    allDone
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "bg-white/5 text-muted-foreground border border-white/10 cursor-not-allowed"
                  }`}
                >
                  <CheckCircle2 size={14} />
                  Concluir teste final
                </button>
              </div>
            </>
          );
        })()}
      </GlassCard>

      <PwaLojaChecklist />



      <div className="mt-6">
        <AgentArchitectCard
          variant="compact"
          title="Quer revisar antes de seguir?"
          subtitle="Use o Agente Arquiteto para validar se seu app passou nos testes e está pronto para divulgar."
          ctaLabel="Revisar teste final com o Agente Arquiteto"
        />
      </div>
    </section>
  );
}

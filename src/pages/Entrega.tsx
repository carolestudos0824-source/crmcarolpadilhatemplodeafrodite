import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LogOut,
  ExternalLink,
  Copy,
  Check,
  LifeBuoy,
  Wand2,
  Megaphone,
  DollarSign,
  ClipboardCheck,
  Rocket,
  Lock,
  Loader2,
} from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { GiftCodeRedemption } from "@/components/GiftCodeRedemption";
import { clearSession } from "@/lib/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { APP_CONFIG } from "@/config/appConfig";
import { openSupportEmail } from "@/lib/openLink";

// ---------- Prompts ----------
const promptEntrada = `Tenho uma ideia de aplicativo e quero transformá-la em um plano completo.

Minha ideia é:
[descreva aqui sua ideia]

Quem vai usar:
[descreva o público]

O problema que resolve:
[descreva a dor]

Como pretendo ganhar dinheiro:
[assinatura, venda única, comissão, anúncios ou ainda não sei]

Quero que você analise minha ideia e entregue:
1. Veredito estratégico
2. MVP com no máximo 5 funcionalidades
3. Fluxo do usuário em até 5 etapas
4. Estrutura de páginas
5. Stack recomendada
6. Modelo de dados simplificado
7. Design recomendado
8. Monetização
9. Riscos principais
10. Prompt mestre para construir no Lovable`;

const promptMestre = `Você é um arquiteto sênior de aplicativos, especialista em produto, UX, monetização e desenvolvimento full stack.
Transforme a ideia abaixo em um plano completo de app comercial.

Ideia:
[cole aqui a ideia]

Entregue:
1. Veredito estratégico
2. Problema real resolvido
3. Usuário principal
4. Ação principal
5. MVP com no máximo 5 funcionalidades
6. O que cortar agora
7. Fluxo do usuário em até 5 etapas
8. Stack recomendada
9. Modelo de dados simplificado
10. Estrutura de páginas
11. Design recomendado
12. Monetização
13. Plano de lançamento
14. Riscos principais
15. Prompt pronto para construir`;

const promptLovable = `Crie um aplicativo web responsivo e mobile first baseado no plano abaixo.
Use design moderno, limpo, premium e fácil de entender.
O app deve ter autenticação, páginas principais, banco de dados, regras de acesso, estados vazios, estados de erro e estados de sucesso.

Plano do app:
[cole aqui o plano gerado pelo Arquiteto de Apps]

Regras:
1. MVP com no máximo 5 funcionalidades principais
2. Interface autoexplicativa
3. Fluxo do usuário em até 5 etapas
4. Não criar funcionalidades fora do escopo
5. Usar componentes reutilizáveis
6. Priorizar velocidade, clareza e validação

Entregue o app funcional com estrutura organizada.`;

const promptCursor = `Você é um engenheiro full stack sênior trabalhando no Cursor.
Implemente o app descrito no plano abaixo em React + TypeScript + Tailwind, com Supabase quando necessário.

Plano:
[cole aqui o plano]

Regras:
1. Código limpo, tipado e modular
2. Componentes pequenos e reutilizáveis
3. Estados de carregamento, erro e sucesso explícitos
4. Sem dependências desnecessárias
5. Pronto para deploy`;

const promptReplit = `Crie um projeto no Replit a partir do plano abaixo.
Use a stack mais simples possível que atenda o MVP.

Plano:
[cole aqui o plano]

Entregue:
1. Estrutura inicial do projeto
2. Páginas essenciais
3. Banco de dados mínimo
4. Instruções para rodar
5. Instruções para publicar`;

const promptSupabase = `Modele o backend no Supabase para o plano abaixo.

Plano:
[cole aqui o plano]

Entregue:
1. Lista de tabelas e colunas
2. Relacionamentos
3. Policies de RLS por tabela
4. Funções e triggers quando necessário
5. Buckets de storage quando necessário
6. SQL completo de migração`;

const promptLanding = `Crie uma landing page de alta conversão para o app abaixo.

App:
[cole aqui o nome e descrição]

Público:
[cole aqui o público]

Problema:
[cole aqui a dor]

Promessa:
[cole aqui a promessa]

Estrutura obrigatória:
1. Hero com headline forte
2. Subheadline clara
3. CTA principal
4. Seção de dor
5. Seção de solução
6. Como funciona
7. Benefícios
8. Prova ou exemplo
9. Preço
10. FAQ
11. CTA final

Estilo: mobile first, visual moderno, claro e direto.`;

const promptPreco = `Crie uma página de preços simples e direta para o app abaixo.

App:
[descreva o app]

Entregue:
1. Headline da oferta
2. Comparativo de planos, se houver mais de um
3. O que está incluso em cada plano
4. Garantia, se houver
5. CTA principal
6. Microcopy de segurança
7. FAQ curto`;

const promptCheckout = `Crie uma página de checkout simples e objetiva para vender o app/produto abaixo.

Produto:
[descreva o produto]

Preço:
[informe o preço]

Público:
[informe o público]

A página deve conter:
1. Resumo da oferta
2. Benefícios principais
3. O que está incluso
4. Garantia, se houver
5. Formas de pagamento
6. CTA de pagamento
7. Mensagem de segurança
8. Perguntas frequentes

Não adicionar distrações.`;

const promptFAQ = `Crie um FAQ curto e objetivo para o app abaixo.

App:
[descreva o app]

Cubra:
1. O que é
2. Para quem é
3. Para quem não é
4. Como funciona
5. Quanto custa
6. Como receber acesso
7. Política de reembolso
8. Suporte`;

const promptConfianca = `Crie uma página de confiança para o app abaixo, focada em remover objeções.

App:
[descreva o app]

Inclua:
1. Quem está por trás
2. Compromisso com o cliente
3. Política de privacidade resumida
4. Política de reembolso
5. Canais de suporte
6. Limitações e o que não está incluso`;

const promptCobranca = `Analise o app abaixo e recomende o melhor modelo de cobrança.

App:
[cole aqui a descrição]

Entregue:
1. Modelo recomendado (assinatura, venda única, freemium, etc.)
2. Justificativa
3. Faixa de preço sugerida
4. Riscos do modelo
5. Plano B de monetização`;

const promptFreePremium = `Defina o plano gratuito e o plano premium para o app abaixo.

App:
[cole aqui a descrição]

Entregue:
1. O que entra no gratuito
2. O que NÃO entra no gratuito
3. O que entra no premium
4. Limites de uso
5. Como o gratuito leva ao premium sem canibalizar a receita`;

const prompt10K = `Monte um plano realista para o app abaixo atingir R$10.000 por mês.

App:
[cole aqui a descrição]

Entregue:
1. Preço sugerido
2. Quantos clientes pagantes são necessários
3. Canais de aquisição priorizados
4. Estratégia semana 1, mês 1 e mês 3
5. Métricas que precisam ser acompanhadas`;

const promptUpsell = `Crie uma estratégia de upsell para o app abaixo.

App:
[cole aqui a descrição]

Entregue:
1. Quando oferecer o upsell
2. O que oferecer
3. Como apresentar
4. Mensagem pronta
5. Métrica de sucesso`;

const promptRetencao = `Crie um plano de retenção para o app abaixo.

App:
[cole aqui a descrição]

Entregue:
1. Principais motivos de cancelamento esperados
2. Ações para reduzir cada motivo
3. Comunicação por e-mail nos primeiros 30 dias
4. Rituais de uso recorrente
5. Métricas de retenção`;

const checklistMVP = `Analise o MVP abaixo:
[cole aqui o MVP]

Responda:
1. A ação principal está clara?
2. O MVP tem no máximo 5 funcionalidades?
3. O usuário entende sem tutorial?
4. Existe uma promessa objetiva?
5. O app resolve uma dor real?
6. Existe forma de monetizar?
7. O fluxo tem até 5 etapas?
8. O produto pode ser validado com 10 usuários?
9. O que deve ser cortado agora?
10. Qual é o maior risco?`;

const checklistValidacao = `Crie um plano de validação para testar este app com 10 usuários reais.

App:
[cole aqui a descrição]

Entregue:
1. Perfil dos 10 usuários ideais
2. Onde encontrar esses usuários
3. Mensagem pronta para convidar
4. Tarefas que eles devem executar
5. Perguntas de feedback
6. Métrica principal dos primeiros 7 dias
7. Critério para continuar, ajustar ou abandonar
8. Melhorias prioritárias após os testes`;

const promptPesquisa = `Crie um roteiro de pesquisa com usuários para o app abaixo.

App:
[descreva o app]

Entregue:
1. Objetivo da pesquisa
2. Perfil dos entrevistados
3. 10 perguntas abertas
4. Como conduzir a conversa
5. Como registrar e analisar respostas`;

const promptFeedback = `Crie um formulário de feedback curto para coletar opinião dos primeiros usuários do app abaixo.

App:
[descreva o app]

Entregue:
1. Até 7 perguntas
2. Mistura de NPS, múltipla escolha e abertas
3. Mensagem de abertura
4. Mensagem de agradecimento`;

const promptMelhorias = `Recebi este feedback dos primeiros usuários do meu app:
[cole aqui os feedbacks]

Quero que você:
1. Agrupe os feedbacks por tema
2. Identifique padrões
3. Sugira até 5 melhorias prioritárias
4. Diga o que NÃO mexer agora
5. Sugira a próxima métrica a observar`;

const planoLancamento = `Crie um plano de lançamento em 24 horas para o app abaixo.

App:
[cole aqui a descrição]

Público:
[cole aqui o público]

Entregue:
1. Checklist antes de publicar
2. Canais gratuitos de aquisição
3. Texto para Instagram
4. Mensagem para WhatsApp
5. Roteiro de stories
6. Estratégia para conseguir os primeiros 10 usuários
7. Sistema de coleta de feedback
8. Métrica principal da primeira semana`;

const legendaInstagram = `Crie 3 opções de legenda para Instagram anunciando o lançamento do app abaixo.

App:
[descreva o app]

Para cada opção entregue:
1. Hook na primeira linha
2. Corpo curto e direto
3. CTA claro
4. Até 5 hashtags relevantes`;

const mensagemWhatsapp = `Crie uma mensagem curta de WhatsApp para enviar aos meus contatos anunciando o app abaixo.

App:
[descreva o app]

Regras:
1. No máximo 5 linhas
2. Pessoal, não publicitária
3. Com link no final
4. Sem emojis em excesso`;

const roteiroStories = `Crie um roteiro de stories para lançar o app abaixo.

App:
[descreva o app]

Entregue 5 stories sequenciais:
1. Problema
2. Bastidor
3. Solução
4. Demonstração curta
5. CTA com link`;

const checklistPublicar = `Antes de publicar o app, confirme:
1. Domínio e link funcionando
2. Login e cadastro testados
3. Pagamento ou checkout testado
4. Página de suporte com canal real
5. Política de privacidade publicada
6. Termos de uso publicados
7. Mensagens de erro amigáveis
8. Teste em celular real
9. Tempo de carregamento aceitável
10. Plano para os primeiros 10 usuários`;

// ---------- Library structure ----------
type PromptCard = {
  title: string;
  description: string;
  content: string;
  purpose?: string;
  when?: string;
  where?: string;
  output?: string;
};
type Category = { id: string; icon: JSX.Element; title: string; description: string; prompts: PromptCard[] };

const library: Category[] = [
  {
    id: "criar",
    icon: <Wand2 size={16} />,
    title: "Criar o app",
    description: "Tudo para sair da ideia e chegar no app funcionando.",
    prompts: [
      { title: "Prompt Mestre Universal", description: "Transforma qualquer ideia em plano completo.", content: promptMestre },
      {
        title: "Prompt para Lovable",
        description: "Pronto para colar no Lovable.",
        content: promptLovable,
        purpose: "Transforma o plano do seu app em uma primeira versão construída no Lovable.",
        when: "Depois que o Arquiteto de Apps gerar o plano completo.",
        where: "Dentro do Lovable, no campo onde você descreve o app.",
        output: "Uma primeira versão do app com telas, layout, fluxo e banco inicial.",
      },
      { title: "Prompt para Cursor", description: "Para implementar via Cursor.", content: promptCursor },
      { title: "Prompt para Replit", description: "Para subir um MVP no Replit.", content: promptReplit },
      { title: "Prompt para Supabase", description: "Modela o backend no Supabase.", content: promptSupabase },
    ],
  },
  {
    id: "vender",
    icon: <Megaphone size={16} />,
    title: "Vender o app",
    description: "Páginas e textos para vender o que você construiu.",
    prompts: [
      { title: "Prompt para Landing Page", description: "Landing de alta conversão.", content: promptLanding },
      { title: "Prompt para Página de Preço", description: "Página de preços simples.", content: promptPreco },
      { title: "Prompt para Checkout", description: "Checkout objetivo.", content: promptCheckout },
      { title: "Prompt para FAQ", description: "FAQ que remove objeções.", content: promptFAQ },
      { title: "Prompt para Página de Confiança", description: "Quem está por trás e por que confiar.", content: promptConfianca },
    ],
  },
  {
    id: "monetizar",
    icon: <DollarSign size={16} />,
    title: "Monetizar",
    description: "Estratégia para transformar o app em receita.",
    prompts: [
      { title: "Prompt de Modelo de Cobrança", description: "Define o melhor modelo.", content: promptCobranca },
      { title: "Prompt de Plano Gratuito e Premium", description: "Free vs premium sem canibalizar.", content: promptFreePremium },
      { title: "Prompt para R$10K/mês", description: "Plano realista para chegar lá.", content: prompt10K },
      { title: "Prompt de Upsell", description: "Aumenta ticket por cliente.", content: promptUpsell },
      { title: "Prompt de Retenção", description: "Reduz churn nos primeiros 30 dias.", content: promptRetencao },
    ],
  },
  {
    id: "validar",
    icon: <ClipboardCheck size={16} />,
    title: "Validar",
    description: "Confirme se vale construir antes de escalar.",
    prompts: [
      { title: "Checklist de MVP", description: "Testa se o MVP está enxuto.", content: checklistMVP },
      { title: "Checklist de Validação com 10 usuários", description: "Plano de teste com usuários reais.", content: checklistValidacao },
      { title: "Prompt de Pesquisa com Usuários", description: "Roteiro de entrevista.", content: promptPesquisa },
      { title: "Prompt de Feedback", description: "Formulário curto de feedback.", content: promptFeedback },
      { title: "Prompt de Melhorias", description: "Prioriza melhorias a partir do feedback.", content: promptMelhorias },
    ],
  },
  {
    id: "lancar",
    icon: <Rocket size={16} />,
    title: "Lançar",
    description: "Vá ao ar e conquiste os primeiros usuários.",
    prompts: [
      { title: "Plano de Lançamento em 24h", description: "Passo a passo para lançar.", content: planoLancamento },
      { title: "Legenda para Instagram", description: "3 opções de legenda.", content: legendaInstagram },
      { title: "Mensagem para WhatsApp", description: "Mensagem pessoal para contatos.", content: mensagemWhatsapp },
      { title: "Roteiro de Stories", description: "5 stories sequenciais.", content: roteiroStories },
      { title: "Checklist antes de publicar", description: "Última checagem antes de ir ao ar.", content: checklistPublicar },
    ],
  },
];

// ---------- Helpers ----------
const STORAGE_PROGRESS = "fabrica_apps_progress_v1";
const progressItems = [
  "Ideia descrita",
  "Plano gerado",
  "Prompt mestre copiado",
  "MVP iniciado",
  "Validação com 10 usuários",
];

const passos = ["Abra o agente", "Cole sua ideia", "Copie o prompt mestre gerado"];

function CopyPromptCard({ prompt }: { prompt: PromptCard }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success("Prompt copiado com sucesso.");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };
  const hasMeta = !!(prompt.purpose || prompt.when || prompt.where || prompt.output);
  return (
    <div className="glass p-4 md:p-5 flex flex-col gap-3 h-full">
      <div className="flex-1">
        <h4 className="font-heading font-semibold text-foreground text-sm md:text-base mb-1">{prompt.title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{prompt.description}</p>
        {hasMeta && (
          <dl className="mt-3 space-y-2 text-xs">
            {prompt.purpose && (
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Para que serve</dt>
                <dd className="text-foreground/85">{prompt.purpose}</dd>
              </div>
            )}
            {prompt.when && (
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Quando usar</dt>
                <dd className="text-foreground/85">{prompt.when}</dd>
              </div>
            )}
            {prompt.where && (
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Onde colar</dt>
                <dd className="text-foreground/85">{prompt.where}</dd>
              </div>
            )}
            {prompt.output && (
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70">O que você vai receber</dt>
                <dd className="text-foreground/85">{prompt.output}</dd>
              </div>
            )}
          </dl>
        )}
      </div>
      <button
        onClick={copy}
        className="inline-flex items-center justify-center gap-2 text-xs px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 transition"
      >
        {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
        {copied ? "Copiado" : "Copiar prompt"}
      </button>
    </div>
  );
}

export default function Entrega() {
  const navigate = useNavigate();
  const auth = useAuthState();

  const [activeTab, setActiveTab] = useState(library[0].id);
  const [copiedEntry, setCopiedEntry] = useState(false);
  const [progress, setProgress] = useState<boolean[]>(() =>
    progressItems.map(() => false),
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PROGRESS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === progressItems.length) {
          setProgress(parsed.map(Boolean));
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(progress));
    } catch {
      /* ignore */
    }
  }, [progress]);

  const logout = async () => {
    await clearSession();
    navigate("/login");
  };

  // ---------- AUTH GATES ----------
  if (auth.status === "loading") {
    return (
      <Section>
        <div className="max-w-md mx-auto text-center py-16">
          <Loader2 className="animate-spin mx-auto text-accent" size={28} />
          <p className="text-sm text-muted-foreground mt-4">Verificando seu acesso…</p>
        </div>
      </Section>
    );
  }

  if (auth.status === "anonymous") {
    return (
      <Section>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="glass-strong p-8">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-accent" size={22} />
            </div>
            <h1 className="text-2xl font-heading font-bold mb-2">Área restrita</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Entre com o e-mail usado na compra para acessar seus prompts, checklists e materiais.
            </p>
            <div className="space-y-3">
              <button onClick={() => navigate("/login")} className="btn-primary w-full">
                Entrar na área restrita
              </button>
              <button onClick={() => navigate("/precos")} className="w-full px-4 py-3 rounded-xl border border-white/15 hover:bg-white/5 transition text-sm">
                Comprar acesso
              </button>
            </div>
          </div>
        </div>
      </Section>
    );
  }

  if (!auth.hasAccess && !auth.isAdmin) {
    return (
      <Section>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="glass-strong p-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-amber-400" size={22} />
            </div>
            <h1 className="text-2xl font-heading font-bold mb-2">Acesso ainda não liberado</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Sua conta foi criada, mas seu acesso aos materiais ainda não está ativo.
            </p>
            <div className="space-y-3">
              <button onClick={() => navigate("/login")} className="btn-primary w-full">
                Tenho um código de acesso
              </button>
              <button
                onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}
                className="w-full px-4 py-3 rounded-xl border border-white/15 hover:bg-white/5 transition text-sm inline-flex items-center justify-center gap-2"
              >
                <LifeBuoy size={14} /> Falar com suporte
              </button>
              <button onClick={() => navigate("/precos")} className="w-full px-4 py-3 rounded-xl border border-white/15 hover:bg-white/5 transition text-sm">
                Comprar acesso
              </button>
              <button onClick={logout} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-2">
                <LogOut size={12} /> Sair desta conta
              </button>
            </div>
          </div>
        </div>
      </Section>
    );
  }

  const session = { email: auth.email ?? "" };


  const openAgent = () => {
    const url = APP_CONFIG.GPT_AGENT_URL;
    if (!url || !url.trim()) {
      toast.error("Link do agente ainda não configurado.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyEntryPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptEntrada);
      setCopiedEntry(true);
      toast.success("Prompt copiado com sucesso.");
      setTimeout(() => setCopiedEntry(false), 1800);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const toggleProgress = (i: number) =>
    setProgress((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const activeCategory = library.find((c) => c.id === activeTab) ?? library[0];

  return (
    <Section>
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <Logo size="md" asLink={false} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-heading font-bold">Arquiteto de Apps</h1>
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent border border-accent/30 rounded-full px-2 py-0.5">
                Área de entrega
              </span>
            </div>
            <p className="text-xs text-muted-foreground/70">{session.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openAgent} className="btn-primary text-sm">
            Gerar meu plano de app agora <ExternalLink size={14} />
          </button>
          <button onClick={logout} className="btn-ghost text-sm">
            <LogOut size={14} /> Sair
          </button>
        </div>
      </div>

      {/* 2. Hero operacional */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="glass-strong p-6 md:p-10 neon-shadow">
          <h2 className="text-2xl md:text-4xl font-heading font-bold text-gradient mb-3">
            Bem-vindo ao Arquiteto de Apps
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl">
            Comece pelo agente principal. Depois use os prompts complementares para construir, vender, monetizar e validar sua ideia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={openAgent} className="btn-primary">
              Gerar meu plano de app agora <ExternalLink size={16} />
            </button>
            <button onClick={copyEntryPrompt} className="btn-ghost">
              {copiedEntry ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
              {copiedEntry ? "Copiado" : "Copiar prompt de entrada"}
            </button>
          </div>
          <p className="text-xs text-muted-foreground/80 mt-4">
            Primeiro gere seu plano. Depois use os prompts extras.
          </p>
        </div>
      </div>

      {/* Resgate de código premium */}
      <div className="max-w-5xl mx-auto mb-10">
        <GiftCodeRedemption />
      </div>

      {/* 3. Card "Comece aqui" */}
      <div className="max-w-5xl mx-auto mb-10">
        <h2 className="text-lg md:text-xl font-heading font-bold mb-1">Seu primeiro passo</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Não tente usar todos os materiais de uma vez. Primeiro gere o plano principal do seu app.
        </p>
        <div className="glass-strong p-5 md:p-6">
          <ol className="grid sm:grid-cols-3 gap-3 mb-5">
            {passos.map((p, i) => (
              <li key={p} className="flex items-start gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-accent/15 text-accent font-heading font-bold flex items-center justify-center text-xs">
                  {i + 1}
                </span>
                <p className="text-sm text-foreground/90 leading-relaxed">{p}</p>
              </li>
            ))}
          </ol>
          <button onClick={openAgent} className="btn-primary w-full sm:w-auto">
            Gerar meu plano de app agora <ExternalLink size={16} />
          </button>
        </div>
      </div>

      {/* 4. Prompt de entrada (fixo) */}
      <div className="max-w-5xl mx-auto mb-10">
        <h2 className="text-lg md:text-xl font-heading font-bold mb-1">Prompt de entrada para o agente</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Copie este prompt, preencha os campos e envie para o Arquiteto de Apps.
        </p>
        <div className="glass-strong p-5 md:p-6">
          <div className="flex items-center justify-end mb-3">
            <button
              onClick={copyEntryPrompt}
              className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/5 transition"
            >
              {copiedEntry ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
              {copiedEntry ? "Copiado" : "Copiar prompt"}
            </button>
          </div>
          <pre className="text-[14px] md:text-[15px] text-foreground/85 whitespace-pre-wrap font-sans leading-7">
{promptEntrada}
          </pre>
        </div>
      </div>

      {/* 5. Biblioteca de prompts */}
      <div className="max-w-5xl mx-auto mb-10">
        <h2 className="text-lg md:text-xl font-heading font-bold mb-1">Biblioteca de prompts</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Use estes prompts depois que o agente gerar o plano principal do seu app.
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {library.map((cat) => {
            const active = cat.id === activeTab;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`inline-flex items-center gap-2 text-xs md:text-sm px-3 py-2 rounded-lg border transition ${
                  active
                    ? "bg-accent/15 border-accent/40 text-accent"
                    : "border-white/10 text-foreground/70 hover:bg-white/5"
                }`}
              >
                {cat.icon}
                {cat.title}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground mb-4">{activeCategory.description}</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeCategory.prompts.map((p) => (
            <CopyPromptCard key={p.title} prompt={p} />
          ))}
        </div>
      </div>

      {/* 6. Checklist de progresso */}
      <div className="max-w-5xl mx-auto mb-10">
        <h2 className="text-lg md:text-xl font-heading font-bold mb-1">Seu progresso</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Marque conforme avançar. Seu progresso fica salvo neste navegador.
        </p>
        <div className="glass-strong p-5 md:p-6">
          <ul className="space-y-2">
            {progressItems.map((item, i) => (
              <li key={item}>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <span
                    className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition ${
                      progress[i]
                        ? "bg-accent border-accent text-background"
                        : "border-white/20 group-hover:border-accent/50"
                    }`}
                  >
                    {progress[i] && <Check size={14} strokeWidth={3} />}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={progress[i]}
                    onChange={() => toggleProgress(i)}
                  />
                  <span className={`text-sm ${progress[i] ? "text-foreground/60 line-through" : "text-foreground/90"}`}>
                    {item}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 7. Suporte */}
      <div className="max-w-5xl mx-auto">
        <GlassCard className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <LifeBuoy size={20} className="text-gold shrink-0 mt-1" />
            <div>
              <p className="font-heading font-bold text-base">Travou em alguma etapa?</p>
              <p className="text-sm text-muted-foreground">
                Envie sua dúvida e diga em qual etapa você está.
              </p>
            </div>
          </div>
          <button
            className="btn-ghost text-sm shrink-0"
            onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}
          >
            Falar com suporte
          </button>
        </GlassCard>
      </div>
    </Section>
  );
}

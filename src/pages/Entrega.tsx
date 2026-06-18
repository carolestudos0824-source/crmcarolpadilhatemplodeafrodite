import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, LogOut, ExternalLink, AlertCircle, ChevronDown, FileText, Rocket, DollarSign, Wand2, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { CopyBlock } from "@/components/CopyBlock";
import { GlassCard } from "@/components/GlassCard";
import { FAQItem } from "@/components/FAQItem";
import { getSession, clearSession } from "@/lib/auth";
import { APP_CONFIG } from "@/config/appConfig";
import { openSupportEmail } from "@/lib/openLink";

const primeiraMensagem = `Tenho uma ideia de aplicativo e quero transformar em um MVP simples, vendável e validável.

Minha ideia é:
[descreva sua ideia aqui]

Quem vai usar:
[descreva o público]

Problema que resolve:
[explique a dor ou desejo]

Como pretendo ganhar dinheiro:
[explique se será venda única, assinatura, serviço, produto digital ou outro modelo]

Quero que você analise a ideia, corte excessos, defina um MVP com no máximo 5 funcionalidades, crie o fluxo do usuário, sugira stack, banco de dados, design, monetização, riscos e um prompt pronto para construir no Lovable.`;

const promptMestre = `Você é o Arquiteto Supremo de Aplicativos. Sua função é transformar qualquer ideia de aplicativo em um plano completo, executável, simples, vendável e validável.

Sempre responda em português do Brasil.

Entregue obrigatoriamente:
1. veredito estratégico da ideia
2. problema real que o app resolve
3. usuário principal
4. ação principal do usuário
5. MVP com no máximo 5 funcionalidades
6. o que deve ser cortado agora
7. fluxo do usuário em até 5 etapas
8. stack recomendada
9. modelo de dados simplificado
10. estrutura de páginas
11. design recomendado
12. monetização
13. plano de lançamento
14. riscos principais
15. prompt mestre pronto para construir no Lovable, Cursor, Claude Code, Gemini ou Replit

Regra central:
MVP com mais de 5 funcionalidades não é MVP. É produto inchado.`;

const manualRapido = `1. Abra o agente.
2. Faça login no ChatGPT, se necessário.
3. Copie a primeira mensagem pronta.
4. Substitua os campos entre colchetes pela sua ideia.
5. Envie a mensagem.
6. Confira se o MVP tem no máximo 5 funcionalidades.
7. Copie o prompt final gerado.
8. Cole na ferramenta escolhida (Lovable, Cursor, Claude, Gemini, Replit).
9. Teste o app.
10. Valide com 10 usuários reais antes de adicionar novas funções.`;

const checklistMVP = `- A ação principal está clara?
- O MVP tem no máximo 5 funcionalidades?
- O usuário entende sem tutorial?
- Existe uma promessa objetiva?
- O app resolve uma dor real?
- Existe forma de monetizar?
- O fluxo tem até 5 etapas?
- O produto pode ser validado com 10 usuários?`;

const promptLovable = "Crie um aplicativo web mobile first com React, TypeScript, Tailwind CSS e Supabase opcional. O app deve ter landing page, autenticação se necessário, banco de dados simples, formulário funcional, páginas essenciais, design premium, responsividade e fallback caso integrações externas não estejam configuradas.";

const promptLanding = "Crie uma landing page de alta conversão em português do Brasil com hero forte, dor do público, solução, benefícios, como funciona, oferta, FAQ, CTA final, captura de leads e design premium. Não use promessas irreais nem depoimentos inventados.";

const promptPrecos = "Crie uma página de preços em português do Brasil para este produto digital. Destaque a oferta principal, explique benefícios de forma clara, mostre o que está incluso, crie CTAs fortes e reduza objeções antes do checkout.";

const promptCheckout = "Crie uma página de checkout simples, clara e confiável. Mostre nome do plano, valor, resumo da entrega, aviso de pagamento externo, botão de pagamento e mensagens de segurança.";

const promptMonetizacao = "Analise esta ideia de app e crie um modelo de monetização simples, com oferta principal clara, gatilho de upgrade, página de preços, estratégia de retenção, cálculo para atingir uma meta mensal realista e riscos comerciais.";

const promptLancamento = "Crie um plano de lançamento em 24 horas para este app, com canais gratuitos, mensagens para contatos, e-mail, Instagram e redes sociais, roteiro de stories, abordagem para os primeiros 10 usuários, coleta de feedback e métrica principal dos primeiros 7 dias.";

const checklistMonetizacao = `- Existe uma dor forte o suficiente para alguém pagar?
- O usuário entende o valor em menos de 10 segundos?
- O plano pago resolve uma necessidade real?
- Existe gatilho de upgrade?
- O preço é simples de entender?
- O checkout está fácil?
- Existe uma oferta principal clara e única?`;

const checklistValidacao = `- Dia 1: publicar a página
- Dia 2: convidar 20 pessoas
- Dia 3: coletar dúvidas
- Dia 4: ajustar copy
- Dia 5: fazer 5 conversas reais
- Dia 6: testar preço e oferta
- Dia 7: medir cliques, leads e compras`;

const ideias = `1. Gerador de posts para nichos específicos
2. Organizador de atendimentos para terapeutas
3. Calculadora de preço para consultoras
4. Planejador de conteúdo para social medias
5. Gerador de propostas comerciais
6. Agenda inteligente para prestadores de serviço
7. Diagnóstico digital para infoprodutores
8. Criador de roteiros para vídeos curtos
9. App de acompanhamento de clientes
10. Ferramenta de briefing para criação de produtos digitais`;

const exemploPlano = `VEREDITO: Ideia validável em 7 dias. Foco em um único público.

USUÁRIO PRINCIPAL: Terapeuta autônoma que atende online.

AÇÃO PRINCIPAL: Registrar sessão e enviar resumo automático ao cliente.

MVP (5 funcionalidades):
1. Login simples
2. Cadastro rápido de cliente
3. Registro da sessão
4. Geração de resumo com IA
5. Envio do resumo por e-mail

FLUXO: Login → Cadastrar cliente → Iniciar sessão → Gerar resumo → Enviar.

STACK: React + Tailwind + Supabase + OpenAI.

MONETIZAÇÃO: R$47/mês com 7 dias grátis.

PROMPT FINAL: "Crie um app web mobile first em React, Tailwind e Supabase para terapeutas registrarem sessões e enviarem resumos gerados por IA por e-mail..."`;

const categorias = [
  {
    icon: <Wand2 size={18} />,
    titulo: "Construção do app",
    descricao: "Tudo que você precisa para gerar e construir o plano.",
    blocos: [
      { title: "Primeira mensagem para enviar ao agente", content: primeiraMensagem },
      { title: "Prompt Mestre Universal", content: promptMestre },
      { title: "Manual rápido de uso", content: manualRapido },
      { title: "Prompt para Lovable", content: promptLovable },
      { title: "Checklist de MVP", content: checklistMVP },
    ],
  },
  {
    icon: <FileText size={18} />,
    titulo: "Landing page e checkout",
    descricao: "Prompts para criar páginas de venda do seu app.",
    blocos: [
      { title: "Prompt para Landing Page", content: promptLanding },
      { title: "Prompt para Página de Preços", content: promptPrecos },
      { title: "Prompt para Checkout", content: promptCheckout },
    ],
  },
  {
    icon: <DollarSign size={18} />,
    titulo: "Monetização",
    descricao: "Como transformar o app em receita.",
    blocos: [
      { title: "Prompt para Monetização", content: promptMonetizacao },
      { title: "Checklist de Monetização", content: checklistMonetizacao },
    ],
  },
  {
    icon: <Rocket size={18} />,
    titulo: "Validação e lançamento",
    descricao: "Coloque o app na frente de usuários reais.",
    blocos: [
      { title: "Prompt para Lançamento", content: promptLancamento },
      { title: "Checklist de Validação dos 7 Dias", content: checklistValidacao },
      { title: "10 ideias de apps validáveis", content: ideias },
    ],
  },
];

const proximoPasso = [
  "Clique no botão principal acima.",
  "Cole sua ideia de app no agente.",
  "Copie o plano gerado e use no Lovable, Cursor ou Replit.",
];

const progresso = [
  "Ideia enviada",
  "Diagnóstico gerado",
  "MVP definido",
  "Prompt copiado",
  "Validação iniciada",
];

const problemas = [
  { q: "O agente não abriu. O que faço?", a: 'Clique em "Copiar link do agente" e cole o link em uma nova aba do navegador.' },
  { q: "O ChatGPT pediu login. O que faço?", a: "Entre na sua conta ChatGPT. Para usar o agente é obrigatório estar logado." },
  { q: "Não sei o que escrever primeiro.", a: 'Abra a categoria "Construção do app" e copie a "Primeira mensagem para enviar ao agente". Substitua os colchetes pela sua ideia.' },
  { q: "O prompt ficou muito grande.", a: "É normal. Copie por partes ou cole direto na ferramenta escolhida, ela aceita prompts longos." },
  { q: "O Lovable não criou exatamente como eu queria.", a: "Volte ao agente e peça ajustes específicos na tela, fluxo ou funcionalidade que deseja melhorar." },
  { q: "Tenho outra dúvida de acesso.", a: "Fale com o suporte por e-mail. Respondemos em horário comercial." },
];

export default function Entrega() {
  const navigate = useNavigate();
  const session = getSession();

  useEffect(() => {
    if (!session) navigate("/login", { replace: true });
  }, [session, navigate]);

  if (!session) return null;

  const logout = () => { clearSession(); navigate("/login"); };

  const openAgent = () => {
    const url = APP_CONFIG.GPT_AGENT_URL;
    if (!url || !url.trim()) {
      toast.error("Link do agente ainda não configurado.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyAgentLink = async () => {
    const url = APP_CONFIG.GPT_AGENT_URL;
    if (!url || !url.trim()) {
      toast.error("Link do agente ainda não configurado.");
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link do agente copiado.");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  };

  return (
    <Section>
      {/* Cabeçalho minimalista */}
      <div className="flex items-center justify-between gap-4 mb-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Logo size="md" asLink={false} />
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent">Sua área</p>
            <p className="text-xs text-muted-foreground/70">{session.email}</p>
          </div>
        </div>
        <button onClick={logout} className="btn-ghost text-sm"><LogOut size={14} /> Sair</button>
      </div>

      {/* 1. HERO da área de entrega */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="glass-strong p-6 md:p-10 neon-shadow">
          <h1 className="text-2xl md:text-4xl font-heading font-bold text-gradient mb-3">
            Vamos transformar sua ideia em um plano de app
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl">
            Comece pelo agente principal. Em poucos minutos você terá um MVP, telas, fluxo, banco de dados, monetização e prompt pronto para construir.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {APP_CONFIG.GPT_AGENT_URL ? (
              <a href={APP_CONFIG.GPT_AGENT_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Gerar meu plano de app agora <ExternalLink size={16} />
              </a>
            ) : (
              <button className="btn-primary" onClick={openAgent}>
                Gerar meu plano de app agora <ExternalLink size={16} />
              </button>
            )}
            <a href="#exemplo" className="btn-ghost">Ver exemplo de plano gerado</a>
          </div>
          <button onClick={copyAgentLink} className="text-xs text-muted-foreground/80 hover:text-accent mt-4 underline-offset-4 hover:underline">
            Copiar link do agente
          </button>
          <p className="text-xs text-accent/90 mt-3">
            Você precisa estar logado no ChatGPT para usar o agente.
          </p>
        </div>
      </div>

      {/* 2. Seu próximo passo */}
      <div className="max-w-4xl mx-auto mb-10">
        <h2 className="text-lg md:text-xl font-heading font-bold mb-4">Seu próximo passo</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {proximoPasso.map((t, i) => (
            <GlassCard key={t} className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-accent/15 text-accent font-heading font-bold flex items-center justify-center text-xs">
                {i + 1}
              </span>
              <p className="text-sm text-foreground/90 leading-relaxed">{t}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* 3. Progresso do usuário */}
      <div className="max-w-4xl mx-auto mb-10">
        <h2 className="text-lg md:text-xl font-heading font-bold mb-4">Seu progresso</h2>
        <div className="glass-strong p-5 md:p-6">
          <ol className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {progresso.map((t, i) => (
              <li key={t} className="flex md:flex-col items-center md:text-center gap-2">
                <span className="shrink-0 w-8 h-8 rounded-full border border-accent/30 text-accent/70 font-heading font-bold flex items-center justify-center text-xs">
                  {i + 1}
                </span>
                <p className="text-xs md:text-sm text-foreground/80 leading-tight">{t}</p>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-muted-foreground/70 mt-4 pt-3 border-t border-white/5">
            Acompanhe sua jornada de ideia até validação.
          </p>
        </div>
      </div>

      {/* 4. Materiais complementares (acordeão) */}
      <div className="max-w-4xl mx-auto mb-10">
        <h2 className="text-lg md:text-xl font-heading font-bold mb-1">Materiais complementares</h2>
        <p className="text-sm text-muted-foreground mb-4">Abra apenas a categoria que precisar.</p>
        <div className="space-y-3">
          {categorias.map((cat) => (
            <details key={cat.titulo} className="glass-strong group overflow-hidden">
              <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition">
                <div className="flex items-center gap-3">
                  <span className="text-accent">{cat.icon}</span>
                  <div>
                    <p className="font-heading font-bold text-base">{cat.titulo}</p>
                    <p className="text-xs text-muted-foreground">{cat.descricao}</p>
                  </div>
                </div>
                <ChevronDown size={18} className="text-muted-foreground shrink-0 transition group-open:rotate-180" />
              </summary>
              <div className="p-5 pt-0 grid md:grid-cols-2 gap-3 border-t border-white/5">
                {cat.blocos.map((b) => (
                  <CopyBlock key={b.title} title={b.title} content={b.content} />
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* 5. Exemplo de plano gerado */}
      <div id="exemplo" className="max-w-4xl mx-auto mb-10">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={18} className="text-gold" />
          <h2 className="text-lg md:text-xl font-heading font-bold">Exemplo de plano gerado</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Uma amostra do que você recebe ao rodar o agente. Seu plano será personalizado para a sua ideia.
        </p>
        <CopyBlock title="Plano de app — exemplo" content={exemploPlano} />
      </div>

      {/* 6. FAQ de problemas comuns */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={18} className="text-accent" />
          <h2 className="text-lg md:text-xl font-heading font-bold">Problemas comuns</h2>
        </div>
        <div className="space-y-3">
          {problemas.map((p) => <FAQItem key={p.q} q={p.q} a={p.a} />)}
        </div>
      </div>

      {/* 7. Suporte discreto */}
      <div className="max-w-3xl mx-auto">
        <div className="glass p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Mail size={18} className="text-gold shrink-0 mt-1" />
            <div>
              <p className="font-heading font-bold text-base">Travou em alguma etapa?</p>
              <p className="text-sm text-muted-foreground">Envie sua dúvida por e-mail e explique em qual etapa você está.</p>
            </div>
          </div>
          <button className="btn-ghost text-sm shrink-0" onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}>
            Falar com suporte
          </button>
        </div>
      </div>
    </Section>
  );
}

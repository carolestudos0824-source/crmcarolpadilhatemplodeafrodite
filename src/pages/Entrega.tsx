import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sparkles, Code, Mail, LogOut, ExternalLink, Rocket, AlertCircle } from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { CopyBlock } from "@/components/CopyBlock";
import { DeliveryResourceCard } from "@/components/DeliveryResourceCard";
import { GlassCard } from "@/components/GlassCard";
import { FAQItem } from "@/components/FAQItem";
import { getSession, clearSession } from "@/lib/auth";
import { APP_CONFIG } from "@/config/appConfig";
import { openSupportEmail } from "@/lib/openLink";

const blocks = [
  {
    title: "Primeira mensagem para enviar ao agente",
    content: `Tenho uma ideia de aplicativo e quero transformar em um MVP simples, vendável e validável.

Minha ideia é:
[descreva sua ideia aqui]

Quem vai usar:
[descreva o público]

Problema que resolve:
[explique a dor ou desejo]

Como pretendo ganhar dinheiro:
[explique se será venda única, assinatura, serviço, produto digital ou outro modelo]

Quero que você analise a ideia, corte excessos, defina um MVP com no máximo 5 funcionalidades, crie o fluxo do usuário, sugira stack, banco de dados, design, monetização, riscos e um prompt pronto para construir no Lovable.`,
  },
  {
    title: "Prompt Mestre Universal",
    content: `Você é o Arquiteto Supremo de Aplicativos. Sua função é transformar qualquer ideia de aplicativo em um plano completo, executável, simples, vendável e validável.

Sempre responda em português do Brasil.

Analise a ideia com visão de:
1. arquiteto de software
2. desenvolvedor full stack
3. designer de UI/UX
4. estrategista de monetização
5. growth hacker de lançamento

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
MVP com mais de 5 funcionalidades não é MVP. É produto inchado.

Se a ideia estiver ampla demais, corte o excesso e priorize a ação principal do usuário.

Não entregue teoria genérica. Entregue um plano aplicável, vendável e validável.`,
  },
  {
    title: "Manual rápido de uso",
    content: `1. Abra o Agente Arquiteto Supremo.
2. Faça login no ChatGPT, se necessário.
3. Copie a "Primeira mensagem para enviar ao agente".
4. Substitua os campos entre colchetes pela sua ideia.
5. Envie a mensagem para o agente.
6. Leia o diagnóstico e confira se o MVP tem no máximo 5 funcionalidades.
7. Copie o prompt final gerado pelo agente.
8. Cole o prompt na ferramenta escolhida, como Lovable, Cursor, Claude Code, Gemini ou Replit.
9. Teste o app gerado.
10. Valide com 10 usuários reais antes de adicionar novas funções.`,
  },
  {
    title: "Prompt para Lovable",
    content: "Crie um aplicativo web mobile first com React, TypeScript, Tailwind CSS e Supabase opcional. O app deve ter landing page, autenticação se necessário, banco de dados simples, formulário funcional, páginas essenciais, design premium, responsividade e fallback caso integrações externas não estejam configuradas.",
  },
  {
    title: "Prompt para Landing Page",
    content: "Crie uma landing page de alta conversão em português do Brasil com hero forte, dor do público, solução, benefícios, como funciona, oferta, FAQ, CTA final, captura de leads e design premium. Não use promessas irreais nem depoimentos inventados.",
  },
  {
    title: "Prompt para Página de Preços",
    content: "Crie uma página de preços em português do Brasil para este produto digital. A página deve destacar a oferta principal, explicar benefícios de forma clara, evitar promessas irreais, mostrar o que está incluso, criar CTAs fortes e reduzir objeções antes do checkout.",
  },
  {
    title: "Prompt para Checkout",
    content: "Crie uma página de checkout simples, clara e confiável para este produto. A página deve mostrar nome do plano, valor, resumo da entrega, aviso de pagamento externo, botão de pagamento, opção de suporte por e-mail e mensagens de segurança. Não criar checkout interno se o pagamento for processado por plataforma externa.",
  },
  {
    title: "Prompt para Monetização",
    content: "Analise esta ideia de app e crie um modelo de monetização simples, com oferta principal clara, gatilho de upgrade, página de preços, estratégia de retenção, cálculo para atingir uma meta mensal realista e riscos comerciais.",
  },
  {
    title: "Prompt para Lançamento",
    content: "Crie um plano de lançamento em 24 horas para este app, com canais gratuitos, mensagens para contatos, e-mail, Instagram e redes sociais, roteiro de stories, abordagem para os primeiros 10 usuários, coleta de feedback e métrica principal dos primeiros 7 dias.",
  },
  {
    title: "Checklist de MVP",
    content: `- A ação principal está clara?
- O MVP tem no máximo 5 funcionalidades?
- O usuário entende sem tutorial?
- Existe uma promessa objetiva?
- O app resolve uma dor real?
- Existe forma de monetizar?
- O fluxo tem até 5 etapas?
- O produto pode ser validado com 10 usuários?`,
  },
  {
    title: "Checklist de Monetização",
    content: `- Existe uma dor forte o suficiente para alguém pagar?
- O usuário entende o valor em menos de 10 segundos?
- O plano gratuito, se existir, tem limite claro?
- O plano pago resolve uma necessidade real?
- Existe gatilho de upgrade?
- O preço é simples de entender?
- O checkout está fácil?
- Existe uma oferta principal clara e única?
- O produto evita prometer ganhos automáticos?`,
  },
  {
    title: "Checklist de Validação dos 7 Dias",
    content: `- Dia 1: publicar a página
- Dia 2: convidar 20 pessoas
- Dia 3: coletar dúvidas
- Dia 4: ajustar copy
- Dia 5: fazer 5 conversas reais
- Dia 6: testar preço e oferta
- Dia 7: medir cliques, leads e compras`,
  },
  {
    title: "10 ideias de apps validáveis",
    content: `1. Gerador de posts para nichos específicos
2. Organizador de atendimentos para terapeutas
3. Calculadora de preço para consultoras
4. Planejador de conteúdo para social medias
5. Gerador de propostas comerciais
6. Agenda inteligente para prestadores de serviço
7. Diagnóstico digital para infoprodutores
8. Criador de roteiros para vídeos curtos
9. App de acompanhamento de clientes
10. Ferramenta de briefing para criação de produtos digitais`,
  },
];

const comecePorAqui = [
  "Faça login no ChatGPT.",
  'Clique em "Abrir agente".',
  "Copie a primeira mensagem pronta.",
  "Envie sua ideia.",
  "Use o plano gerado para construir em Lovable, Cursor, Claude Code, Gemini ou Replit.",
];

const depoisDoPlano = `1. Confira se a ação principal do app está clara.
2. Verifique se o MVP tem no máximo 5 funcionalidades.
3. Remova qualquer função que não ajude o usuário a completar a ação principal.
4. Copie o prompt final de construção.
5. Cole no Lovable, Cursor, Claude Code, Gemini ou Replit.
6. Teste o app no celular.
7. Mostre para 10 pessoas reais.
8. Ajuste com base no feedback antes de criar novas funções.`;

const problemas = [
  { q: "O agente não abriu.", a: 'Clique em "Copiar link do agente" e cole o link em uma nova aba do navegador.' },
  { q: "O ChatGPT pediu login.", a: "Entre na sua conta ChatGPT para usar o agente." },
  { q: "Não sei o que escrever primeiro.", a: 'Use o bloco "Primeira mensagem para enviar ao agente".' },
  { q: "O prompt ficou muito grande.", a: "Isso é normal. Copie por partes ou cole diretamente na ferramenta escolhida." },
  { q: "O Lovable não criou exatamente como eu queria.", a: "Volte ao agente e peça ajustes específicos na tela, fluxo ou funcionalidade que deseja melhorar." },
  { q: "Tenho uma dúvida de acesso.", a: "Fale com o suporte por e-mail usando o botão de suporte desta página." },
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
      toast.error("Link do agente ainda não configurado. Edite o arquivo de configuração.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const copyAgentLink = async () => {
    const url = APP_CONFIG.GPT_AGENT_URL;
    if (!url || !url.trim()) {
      toast.error("Link do agente ainda não configurado. Edite o arquivo de configuração.");
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
      {/* 1. Cabeçalho */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Logo size="lg" asLink={false} />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Área de entrega</p>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Bem-vindo à sua área de entrega</h1>
            <p className="text-base text-muted-foreground mt-1">Seus materiais da Fábrica de Apps com IA estão prontos para uso.</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Acesso conectado: {session.email}</p>
          </div>
        </div>
        <button onClick={logout} className="btn-ghost text-sm"><LogOut size={14} /> Sair</button>
      </div>

      {/* Como usar este produto (escopo no topo) */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="glass-strong p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Escopo</p>
          <h2 className="text-xl md:text-2xl font-heading font-bold mb-5">Como usar este produto</h2>
          <ol className="space-y-3 mb-5">
            {[
              "Abra o Agente Arquiteto Supremo.",
              "Escreva sua ideia de aplicativo.",
              "Use a primeira mensagem pronta.",
              "Receba o MVP, arquitetura, fluxo, design, monetização e prompt final.",
              "Cole o prompt em uma ferramenta como Lovable, Cursor, Claude Code, Gemini ou Replit.",
            ].map((t, i) => (
              <li key={t} className="flex gap-4 items-start">
                <span className="shrink-0 w-7 h-7 rounded-full bg-gold/15 text-gold font-heading font-bold flex items-center justify-center text-xs">
                  {i + 1}
                </span>
                <p className="text-[15px] md:text-base text-foreground/90 leading-relaxed pt-0.5">{t}</p>
              </li>
            ))}
          </ol>
          <p className="text-xs md:text-sm text-muted-foreground/90 leading-relaxed pt-4 border-t border-white/5">
            Este produto foi criado para uso autoguiado. O suporte por e-mail é apenas para dúvidas de acesso.
          </p>
        </div>
      </div>

      {/* 2. Cards: Agente, Prompts, Suporte */}
      <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-12">
        <DeliveryResourceCard
          icon={<Sparkles size={20} />}
          title="Agente Arquiteto Supremo"
          description="Acesse o agente de IA que transforma qualquer ideia em MVP, arquitetura, design, monetização e prompt pronto para construir."
          action={
            <div className="flex flex-col gap-2">
              {APP_CONFIG.GPT_AGENT_URL ? (
                <a href={APP_CONFIG.GPT_AGENT_URL} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                  Abrir agente <ExternalLink size={14} />
                </a>
              ) : (
                <button className="btn-primary w-full" onClick={openAgent}>
                  Abrir agente <ExternalLink size={14} />
                </button>
              )}
              <button className="btn-ghost w-full text-xs" onClick={copyAgentLink}>
                Copiar link do agente
              </button>
              <p className="text-[12px] text-muted-foreground/80 leading-relaxed">
                Você precisa estar logado no ChatGPT para usar o agente. Se o link não abrir no preview, copie o link do agente e cole em uma nova aba do navegador.
              </p>
            </div>
          }
        />
        <DeliveryResourceCard
          icon={<Code size={20} />}
          title="Prompts e checklists"
          description="Copie os materiais abaixo para estruturar, construir, monetizar e lançar seu app com IA mesmo sem saber programar."
          action={<a href="#blocos" className="btn-ghost w-full">Ir para os blocos</a>}
        />
        <DeliveryResourceCard
          icon={<Mail size={20} />}
          title="Suporte"
          description="Dificuldade para acessar ou aplicar o material? Fale com o suporte por e-mail."
          action={
            <button className="btn-gold w-full" onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}>
              Falar com suporte por e-mail
            </button>
          }
        />
      </div>

      {/* 3. Comece por aqui */}
      <div className="max-w-5xl mx-auto mb-14">
        <div className="flex items-center gap-2 mb-2">
          <Rocket size={18} className="text-gold" />
          <h2 className="text-xl md:text-2xl font-heading font-bold">Comece por aqui</h2>
        </div>
        <p className="text-base text-muted-foreground mb-5">Siga estes passos para usar a Fábrica de Apps com IA sem travar.</p>
        <div className="glass-strong p-6 md:p-8">
          <ol className="space-y-3">
            {comecePorAqui.map((p, i) => (
              <li key={p} className="flex gap-4 items-start">
                <span className="shrink-0 w-8 h-8 rounded-full bg-accent/15 text-accent font-heading font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </span>
                <p className="text-[15px] md:text-base text-foreground/90 leading-relaxed pt-1">{p}</p>
              </li>
            ))}
          </ol>
          <p className="text-xs text-muted-foreground/80 mt-5 pt-4 border-t border-white/5">
            Você precisa estar logado no ChatGPT para usar o agente.
          </p>
        </div>
      </div>

      {/* 4. Como usar seus materiais */}
      <div className="max-w-5xl mx-auto mb-14">
        <h2 className="text-xl md:text-2xl font-heading font-bold mb-5">Como usar seus materiais</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            "Abra o agente",
            "Escreva sua ideia",
            "Use o Prompt Mestre para estruturar o app",
            "Copie o prompt final para Lovable, Cursor, Claude Code ou Gemini",
            "Valide com usuários reais",
          ].map((t, i) => (
            <GlassCard key={t} className="text-center">
              <div className="text-2xl font-heading font-bold text-gold mb-2">{String(i + 1).padStart(2, "0")}</div>
              <p className="text-sm text-foreground/90 leading-relaxed">{t}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* 5-17. Blocos copiáveis */}
      <div id="blocos" className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto mb-14">
        {blocks.map((b) => <CopyBlock key={b.title} title={b.title} content={b.content} />)}
      </div>

      {/* 18. Depois que o agente gerar seu plano */}
      <div className="max-w-5xl mx-auto mb-14">
        <CopyBlock title="Depois que o agente gerar seu plano" content={depoisDoPlano} />
      </div>

      {/* 19. Problemas comuns */}
      <div className="max-w-3xl mx-auto mb-14">
        <div className="flex items-center gap-2 mb-5">
          <AlertCircle size={18} className="text-accent" />
          <h2 className="text-xl md:text-2xl font-heading font-bold">Problemas comuns</h2>
        </div>
        <div className="space-y-3">
          {problemas.map((p) => <FAQItem key={p.q} q={p.q} a={p.a} />)}
        </div>
      </div>

      {/* 20. Suporte por e-mail */}
      <div className="max-w-3xl mx-auto">
        <div className="glass-strong p-6 md:p-8 text-center">
          <Mail size={22} className="text-gold mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg mb-2">Suporte por e-mail</h3>
          <p className="text-sm text-muted-foreground mb-5">
            O suporte é feito exclusivamente por e-mail. Respondemos em horário comercial.
          </p>
          <button className="btn-gold mx-auto" onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}>
            Falar com suporte por e-mail
          </button>
        </div>
      </div>
    </Section>
  );
}

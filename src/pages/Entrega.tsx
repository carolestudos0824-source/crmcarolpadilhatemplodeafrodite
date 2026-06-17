import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sparkles, Code, Mail, LogOut, ExternalLink } from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { CopyBlock } from "@/components/CopyBlock";
import { DeliveryResourceCard } from "@/components/DeliveryResourceCard";
import { GlassCard } from "@/components/GlassCard";
import { getSession, clearSession } from "@/lib/auth";
import { APP_CONFIG } from "@/config/appConfig";
import { openSupportEmail } from "@/lib/openLink";


const blocks = [
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
    content: `1. Comece descrevendo sua ideia em linguagem simples.
2. Informe quem vai usar o app.
3. Explique qual problema ele resolve.
4. Diga como pretende ganhar dinheiro.
5. Peça ao agente para cortar excessos e definir um MVP com no máximo 5 funcionalidades.
6. Copie o prompt final gerado pelo agente.
7. Cole o prompt na ferramenta escolhida, como Lovable, Cursor, Claude Code, Gemini ou Replit.
8. Valide com usuários reais antes de criar novas funcionalidades.`,
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
    content: "Crie uma página de preços em português do Brasil para este produto digital. A página deve ter 3 planos, destacar o plano recomendado, explicar benefícios de forma clara, evitar promessas irreais, mostrar o que está incluso, criar CTAs fortes e reduzir objeções antes do checkout.",
  },
  {
    title: "Prompt para Checkout",
    content: "Crie uma página de checkout simples, clara e confiável para este produto. A página deve mostrar nome do plano, valor, resumo da entrega, aviso de pagamento externo, botão de pagamento, opção de suporte por e-mail e mensagens de segurança. Não criar checkout interno se o pagamento for processado por plataforma externa.",
  },
  {
    title: "Prompt para Monetização",
    content: "Analise esta ideia de app e crie um modelo de monetização simples, com plano gratuito limitado, plano pago, gatilho de upgrade, página de preços, estratégia de retenção, cálculo para atingir R$10K por mês e riscos comerciais.",
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
- Existe uma oferta principal?
- Existe uma oferta premium ou serviço complementar?
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

const passos = [
  "Abra o agente",
  "Escreva sua ideia",
  "Use o Prompt Mestre para estruturar o app",
  "Copie o prompt final para Lovable, Cursor, Claude Code ou Gemini",
  "Valide com usuários reais",
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

      <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-12">
        <DeliveryResourceCard
          icon={<Sparkles size={20} />}
          title="Agente Arquiteto Supremo"
          description="Acesse o agente de IA que transforma qualquer ideia em MVP, arquitetura, design, monetização e prompt pronto para construir."
          action={
            <div className="flex flex-col gap-2">
              {APP_CONFIG.GPT_AGENT_URL ? (
                <a
                  href={APP_CONFIG.GPT_AGENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full"
                >
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
              <p className="text-[11px] text-muted-foreground/70 leading-snug">
                Você precisa estar logado no ChatGPT para usar o agente. Se o link não abrir no preview, copie e cole em uma nova aba.
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

      <div className="max-w-5xl mx-auto mb-12">
        <h2 className="text-xl md:text-2xl font-heading font-bold mb-5">Como usar seus materiais</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {passos.map((t, i) => (
            <GlassCard key={t} className="text-center">
              <div className="text-2xl font-heading font-bold text-gold mb-2">{String(i + 1).padStart(2, "0")}</div>
              <p className="text-sm text-foreground/90">{t}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      <div id="blocos" className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {blocks.map((b) => <CopyBlock key={b.title} title={b.title} content={b.content} />)}
      </div>

      <div className="max-w-3xl mx-auto mt-16">
        <div className="glass-strong p-8 md:p-10 text-center neon-shadow">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Próximo passo</p>
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-gradient mb-3">
            Quer transformar sua ideia em um blueprint personalizado?
          </h3>
          <p className="text-base text-muted-foreground mb-6">
            Se você não quiser montar tudo sozinho, solicite o Blueprint do Seu App com IA e receba a estrutura pronta do seu próprio aplicativo.
          </p>
          <button className="btn-primary mx-auto" onClick={() => navigate("/checkout?plano=blueprint")}>
            Quero meu blueprint personalizado
          </button>
        </div>
      </div>
    </Section>
  );
}

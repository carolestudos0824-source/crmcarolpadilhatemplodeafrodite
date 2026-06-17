import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Code, MessageCircle, LogOut, ExternalLink } from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { CopyBlock } from "@/components/CopyBlock";
import { DeliveryResourceCard } from "@/components/DeliveryResourceCard";
import { getSession, clearSession } from "@/lib/auth";
import { APP_CONFIG } from "@/config/appConfig";
import { openConfiguredUrl } from "@/lib/openLink";

const blocks = [
  { title: "Prompt Mestre Universal", content: "Você é o Arquiteto Supremo de Aplicativos. Sua função é transformar qualquer ideia de aplicativo em um plano completo, executável, simples, vendável e validável. Analise a ideia, corte excessos, defina MVP com no máximo 5 funcionalidades, fluxo do usuário, stack, banco de dados, design system, monetização, riscos, plano de lançamento e prompt pronto para construir." },
  { title: "Prompt para Lovable", content: "Crie um aplicativo web mobile first com React, TypeScript, Tailwind CSS e Supabase opcional. O app deve ter landing page, autenticação se necessário, banco de dados simples, formulário funcional, páginas essenciais, design premium, responsividade e fallback caso integrações externas não estejam configuradas." },
  { title: "Prompt para Landing Page", content: "Crie uma landing page de alta conversão em português do Brasil com hero forte, dor do público, solução, benefícios, como funciona, oferta, FAQ, CTA final, captura de leads e design premium. Não use promessas irreais nem depoimentos inventados." },
  { title: "Prompt para Monetização", content: "Analise esta ideia de app e crie um modelo de monetização simples, com plano gratuito limitado, plano pago, gatilho de upgrade, página de preços, estratégia de retenção, cálculo para atingir R$10K por mês e riscos comerciais." },
  { title: "Prompt para Lançamento", content: "Crie um plano de lançamento em 24 horas para este app, com canais gratuitos, textos para WhatsApp, legenda de Instagram, roteiro de stories, abordagem para os primeiros 10 usuários, coleta de feedback e métrica principal dos primeiros 7 dias." },
  { title: "Checklist de MVP", content: "- A ação principal está clara?\n- O MVP tem no máximo 5 funcionalidades?\n- O usuário entende sem tutorial?\n- Existe uma promessa objetiva?\n- O app resolve uma dor real?\n- Existe forma de monetizar?\n- O fluxo tem até 5 etapas?\n- O produto pode ser validado com 10 usuários?" },
  { title: "Checklist de Validação dos 7 Dias", content: "- Dia 1: publicar a página\n- Dia 2: convidar 20 pessoas\n- Dia 3: coletar dúvidas\n- Dia 4: ajustar copy\n- Dia 5: fazer 5 conversas reais\n- Dia 6: testar preço e oferta\n- Dia 7: medir cliques, leads e compras" },
];

export default function Entrega() {
  const navigate = useNavigate();
  const session = getSession();

  useEffect(() => {
    if (!session) navigate("/login", { replace: true });
  }, [session, navigate]);

  if (!session) return null;

  const logout = () => { clearSession(); navigate("/login"); };

  return (
    <Section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Logo size="lg" asLink={false} />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Área de entrega</p>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Bem-vindo, {session.email}</h1>
          </div>
        </div>
        <button onClick={logout} className="btn-ghost text-sm"><LogOut size={14} /> Sair</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-12">
        <DeliveryResourceCard
          icon={<Sparkles size={20} />}
          title="Agente Arquiteto Supremo"
          description="Acesse o agente de IA que transforma sua ideia em plano executável."
          action={
            <button className="btn-primary w-full" onClick={() => openConfiguredUrl(APP_CONFIG.GPT_AGENT_URL)}>
              Abrir agente <ExternalLink size={14} />
            </button>
          }
        />
        <DeliveryResourceCard
          icon={<Code size={20} />}
          title="Prompts e checklists"
          description="Use os blocos abaixo para copiar prompts e checklists prontos."
          action={<a href="#blocos" className="btn-ghost w-full">Ir para blocos</a>}
        />
        <DeliveryResourceCard
          icon={<MessageCircle size={20} />}
          title="Suporte"
          description="Dificuldade para aplicar? Fale com o suporte pelo WhatsApp."
          action={
            <button className="btn-gold w-full" onClick={() => openConfiguredUrl(APP_CONFIG.WHATSAPP_URL)}>
              Falar no WhatsApp
            </button>
          }
        />
      </div>

      <div id="blocos" className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {blocks.map((b) => <CopyBlock key={b.title} title={b.title} content={b.content} />)}
      </div>
    </Section>
  );
}

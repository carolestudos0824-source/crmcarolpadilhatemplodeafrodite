import { ShieldCheck } from "lucide-react";
import { Section } from "@/components/Section";
import { CheckoutSummary } from "@/components/CheckoutSummary";
import { Logo } from "@/components/Logo";
import { PLANS } from "@/data/plans";
import { openConfiguredUrl } from "@/lib/openLink";
import { APP_CONFIG } from "@/config/appConfig";

export default function Checkout() {
  const plan = PLANS[0];
  const checkoutUrl = plan.checkoutUrl();
  return (
    <Section>
      <div className="flex justify-center mb-8"><Logo size="lg" asLink={false} /></div>
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <CheckoutSummary plan={plan} />
        <div className="glass-strong p-6 md:p-8 flex flex-col gap-4">
          <h3 className="font-heading font-bold text-xl">Finalize sua compra</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Acesso à Fábrica de Apps com IA: jornada guiada com 24 etapas, comandos prontos para o Lovable, Agente Arquiteto externo e revisão dentro do app. Preço único de R$47.
          </p>
          <div className="text-xs text-muted-foreground/90 bg-white/5 border border-white/10 rounded-xl p-3 leading-relaxed">
            Você está adquirindo um produto digital de autoatendimento. Após a compra, receberá instruções para acessar a área de entrega, com a jornada guiada, comandos prontos, Agente Arquiteto e materiais de apoio. A construção do aplicativo não está inclusa.
          </div>
          <div className="text-xs text-accent/90 bg-accent/5 border border-accent/20 rounded-xl p-3 leading-relaxed">
            Após a confirmação do pagamento, seu acesso é liberado conforme o fluxo atual da Fábrica. Para usar o Agente Arquiteto, é necessário estar logado no ChatGPT.
          </div>
          <button
            className="btn-primary w-full"
            onClick={() => {
              const ok = openConfiguredUrl(checkoutUrl, "Checkout ainda não configurado. Entre em contato com o suporte.");
              if (ok) {
                try { sessionStorage.setItem(APP_CONFIG.CHECKOUT_INITIATED_FLAG, "1"); } catch {}
              }
            }}
          >
            Ir para pagamento
          </button>
          <p className="text-xs text-accent/90">
            Após a confirmação do pagamento, seu acesso será liberado na área do aluno.
          </p>
          <div className="flex items-start gap-2 text-xs text-muted-foreground/80 pt-2 border-t border-white/5">
            <ShieldCheck size={14} className="text-accent shrink-0 mt-0.5" />
            Pagamento processado em ambiente externo. Nenhum dado de pagamento é armazenado neste site.
          </div>
          <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
            Suporte por e-mail apenas para dúvidas de acesso ao material.
          </p>
        </div>
      </div>
    </Section>
  );
}

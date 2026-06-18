import { ShieldCheck, Mail } from "lucide-react";
import { Section } from "@/components/Section";
import { CheckoutSummary } from "@/components/CheckoutSummary";
import { Logo } from "@/components/Logo";
import { PLANS } from "@/data/plans";
import { APP_CONFIG } from "@/config/appConfig";
import { openConfiguredUrl, openSupportEmail } from "@/lib/openLink";

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
          <p className="text-sm text-muted-foreground">
            Acesso ao agente, prompts, checklists e manual rápido para transformar ideias em apps validáveis com IA.
          </p>
          <button className="btn-primary w-full" onClick={() => openConfiguredUrl(checkoutUrl)}>
            Ir para pagamento
          </button>
          <p className="text-xs text-accent/90">
            Após o pagamento, você receberá as instruções de acesso no e-mail informado na compra.
          </p>
          <button className="btn-ghost w-full" onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}>
            <Mail size={16} /> Falar com suporte por e-mail
          </button>
          <div className="flex items-start gap-2 text-xs text-muted-foreground/80 pt-2 border-t border-white/5">
            <ShieldCheck size={14} className="text-accent shrink-0 mt-0.5" />
            Pagamento processado em ambiente externo. Nenhum dado de pagamento é armazenado neste site. Em caso de dúvida, fale com o suporte por e-mail.
          </div>
        </div>
      </div>
    </Section>
  );
}

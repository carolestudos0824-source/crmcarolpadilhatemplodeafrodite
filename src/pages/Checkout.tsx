import { useSearchParams } from "react-router-dom";
import { ShieldCheck, MessageCircle } from "lucide-react";
import { Section } from "@/components/Section";
import { CheckoutSummary } from "@/components/CheckoutSummary";
import { Logo } from "@/components/Logo";
import { getPlan } from "@/data/plans";
import { APP_CONFIG } from "@/config/appConfig";
import { openConfiguredUrl } from "@/lib/openLink";

export default function Checkout() {
  const [params] = useSearchParams();
  const plan = getPlan(params.get("plano"));
  const checkoutUrl = plan.checkoutUrl();
  return (
    <Section>
      <div className="flex justify-center mb-8"><Logo size={40} /></div>
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <CheckoutSummary plan={plan} />
        <div className="glass-strong p-6 md:p-8 flex flex-col gap-4">
          <h3 className="font-heading font-bold text-xl">Finalize sua compra</h3>
          <p className="text-sm text-muted-foreground">
            Pagamento processado em ambiente externo. Após a compra, siga as instruções da página de obrigado.
          </p>
          <button className="btn-primary w-full" onClick={() => openConfiguredUrl(checkoutUrl)}>
            {plan.id === "premium" ? "Falar no WhatsApp" : "Ir para pagamento"}
          </button>
          {plan.id !== "premium" && (
            <button className="btn-ghost w-full" onClick={() => openConfiguredUrl(APP_CONFIG.WHATSAPP_URL)}>
              <MessageCircle size={16} /> Prefiro falar no WhatsApp
            </button>
          )}
          <div className="flex items-start gap-2 text-xs text-muted-foreground/80 pt-2 border-t border-white/5">
            <ShieldCheck size={14} className="text-accent shrink-0 mt-0.5" />
            Ambiente seguro. Nenhum dado de pagamento é armazenado neste site.
          </div>
        </div>
      </div>
    </Section>
  );
}

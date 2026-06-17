import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Plan } from "@/data/plans";
import { openConfiguredUrl } from "@/lib/openLink";

export const PricingCard = ({ plan }: { plan: Plan }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (plan.id === "premium") {
      openConfiguredUrl(plan.checkoutUrl());
    } else {
      navigate(`/checkout?plano=${plan.id}`);
    }
  };
  return (
    <div className={`relative glass-strong p-8 flex flex-col h-full ${plan.highlight ? "neon-shadow border-accent/40" : ""}`}>
      {plan.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-gradient-to-r from-primary to-accent text-white uppercase">
          Recomendado
        </div>
      )}
      <h3 className="text-xl font-heading font-bold">{plan.name}</h3>
      <p className="text-muted-foreground text-sm mt-2 min-h-[40px]">{plan.description}</p>
      <div className="mt-6 mb-6">
        <div className="text-4xl font-heading font-bold text-gradient">{plan.price}</div>
      </div>
      <ul className="space-y-3 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-3 text-sm text-foreground/90">
            <Check size={18} className="text-accent shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button onClick={handleClick} className={`${plan.highlight ? "btn-primary" : "btn-gold"} mt-8 w-full`}>
        {plan.cta}
      </button>
    </div>
  );
};

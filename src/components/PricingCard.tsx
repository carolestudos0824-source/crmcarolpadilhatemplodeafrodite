import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Plan } from "@/data/plans";

export const PricingCard = ({ plan }: { plan: Plan }) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/checkout?plano=${plan.id}`);
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
        {plan.priceNote && <p className="text-xs text-muted-foreground mt-1">{plan.priceNote}</p>}
      </div>
      <ul className="space-y-3 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-3 text-[15px] leading-relaxed text-foreground/90">
            <Check size={18} className="text-accent shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground mt-6 text-center">
        Acesso imediato à área de entrega após a compra.
      </p>
      <button onClick={handleClick} className="btn-primary mt-4 w-full">
        {plan.cta}
      </button>
    </div>
  );
};

import type { Plan } from "@/data/plans";

export const CheckoutSummary = ({ plan }: { plan: Plan }) => (
  <div className="glass-strong p-6 md:p-8">
    <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Plano selecionado</p>
    <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2">{plan.name}</h2>
    <div className="text-3xl font-heading font-bold text-gradient mb-4">{plan.price}</div>
    <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
    <ul className="space-y-2">
      {plan.features.map((f) => (
        <li key={f} className="text-sm text-foreground/80 flex gap-2">
          <span className="text-accent">•</span> {f}
        </li>
      ))}
    </ul>
  </div>
);

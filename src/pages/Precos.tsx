import { Section } from "@/components/Section";
import { PricingCard } from "@/components/PricingCard";
import { PLANS } from "@/data/plans";

export default function Precos() {
  return (
    <Section eyebrow="Planos" title="Escolha o plano da sua ideia" subtitle="Três caminhos para tirar seu app da ideia ao lançamento.">
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        {PLANS.map((p) => <PricingCard key={p.id} plan={p} />)}
      </div>
    </Section>
  );
}

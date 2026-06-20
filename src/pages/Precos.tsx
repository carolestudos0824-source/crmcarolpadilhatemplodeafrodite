import { Section } from "@/components/Section";
import { PricingCard } from "@/components/PricingCard";
import { PLANS } from "@/data/plans";

export default function Precos() {
  return (
    <Section
      eyebrow="Plano"
      title="Uma única oferta para começar"
      subtitle="Você não está comprando apenas prompts. Você está comprando uma trilha organizada para construir com mais clareza, menos erro e mais segurança."
    >
      <div className="max-w-md mx-auto">
        <PricingCard plan={PLANS[0]} />
      </div>
    </Section>
  );
}

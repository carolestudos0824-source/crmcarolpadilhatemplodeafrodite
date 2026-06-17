import { Section } from "@/components/Section";
import { PricingCard } from "@/components/PricingCard";
import { PLANS } from "@/data/plans";

export default function Precos() {
  return (
    <Section
      eyebrow="Plano"
      title="Uma única oferta para começar"
      subtitle="Tudo o que você precisa para transformar sua ideia em um app validável com IA."
    >
      <div className="max-w-md mx-auto">
        <PricingCard plan={PLANS[0]} />
      </div>
    </Section>
  );
}

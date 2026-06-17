import { Link } from "react-router-dom";
import { Section } from "@/components/Section";

export default function NotFound() {
  return (
    <Section>
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-6xl font-heading font-bold text-gradient mb-3">404</h1>
        <p className="text-muted-foreground mb-6">Página não encontrada.</p>
        <Link to="/" className="btn-primary inline-flex">Voltar ao início</Link>
      </div>
    </Section>
  );
}

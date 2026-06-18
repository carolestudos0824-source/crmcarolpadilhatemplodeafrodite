import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Mail } from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { APP_CONFIG } from "@/config/appConfig";
import { openSupportEmail } from "@/lib/openLink";

export default function Obrigado() {
  const navigate = useNavigate();
  return (
    <Section>
      <div className="max-w-2xl mx-auto text-center glass-strong p-10 md:p-14 neon-shadow">
        <div className="flex justify-center mb-6"><Logo size="lg" asLink={false} /></div>
        <CheckCircle2 size={48} className="text-accent mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-3">Compra recebida</h1>
        <p className="text-base md:text-lg text-muted-foreground mb-3">
          Obrigado por adquirir a Fábrica de Apps com IA. As instruções de acesso foram enviadas para o e-mail informado na compra.
        </p>
        <p className="text-base text-muted-foreground mb-8">
          Verifique sua caixa de entrada, spam ou promoções. Em caso de dificuldade, fale com o suporte por e-mail.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Acessar área de entrega <ArrowRight size={16} />
          </button>
          <button className="btn-ghost" onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}>
            <Mail size={16} /> Falar com suporte por e-mail
          </button>
        </div>
      </div>
    </Section>
  );
}


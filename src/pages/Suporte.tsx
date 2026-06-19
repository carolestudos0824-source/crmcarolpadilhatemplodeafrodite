import { Mail } from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { APP_CONFIG } from "@/config/appConfig";
import { openSupportEmail } from "@/lib/openLink";

export default function Suporte() {
  return (
    <Section>
      <div className="max-w-2xl mx-auto text-center glass-strong p-10">
        <div className="flex justify-center mb-6"><Logo size="lg" asLink={false} /></div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-3">Suporte</h1>
        <p className="text-base text-muted-foreground mb-4">
          Precisa de ajuda para acessar o material? Envie uma mensagem para o suporte por e-mail.
        </p>
        <p className="text-sm text-muted-foreground/90 bg-white/5 border border-white/10 rounded-xl p-4 leading-relaxed mb-8 text-left">
          O suporte é para <strong className="text-foreground">acesso ao material, problemas técnicos e dúvidas de navegação</strong>.
          Dúvidas estratégicas sobre o seu aplicativo podem ser contratadas no <strong className="text-foreground">Blueprint Personalizado</strong>.
        </p>
        <div className="flex justify-center">
          <button className="btn-primary" onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}>
            <Mail size={16} /> Enviar e-mail para o suporte
          </button>
        </div>
      </div>
    </Section>
  );
}

import { Mail, MessageCircle } from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { APP_CONFIG } from "@/config/appConfig";
import { openConfiguredUrl } from "@/lib/openLink";
import { toast } from "sonner";

export default function Suporte() {
  const sendEmail = () => {
    if (!APP_CONFIG.SUPORTE_EMAIL) {
      toast.error("Link ainda não configurado. Edite o arquivo de configuração.");
      return;
    }
    window.location.href = `mailto:${APP_CONFIG.SUPORTE_EMAIL}`;
  };

  return (
    <Section>
      <div className="max-w-2xl mx-auto text-center glass-strong p-10">
        <div className="flex justify-center mb-6"><Logo size="lg" asLink={false} /></div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-3">Suporte</h1>
        <p className="text-muted-foreground mb-8">
          Precisa de ajuda para acessar o material ou aplicar o agente na sua ideia? Fale com o suporte.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="btn-primary" onClick={() => openConfiguredUrl(APP_CONFIG.WHATSAPP_URL)}>
            <MessageCircle size={16} /> Falar no WhatsApp
          </button>
          <button className="btn-ghost" onClick={sendEmail}>
            <Mail size={16} /> Enviar e-mail
          </button>
        </div>
      </div>
    </Section>
  );
}

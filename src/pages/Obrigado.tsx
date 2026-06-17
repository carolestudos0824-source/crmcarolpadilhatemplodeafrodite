import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, MessageCircle } from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { APP_CONFIG } from "@/config/appConfig";
import { openConfiguredUrl } from "@/lib/openLink";

export default function Obrigado() {
  const navigate = useNavigate();
  return (
    <Section>
      <div className="max-w-2xl mx-auto text-center glass-strong p-10 md:p-14 neon-shadow">
        <div className="flex justify-center mb-6"><Logo size="lg" asLink={false} /></div>
        <CheckCircle2 size={48} className="text-accent mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-3">Compra recebida ou em processamento</h1>
        <p className="text-muted-foreground mb-8">
          Obrigado por adquirir a Fábrica de Apps com IA. Verifique seu e-mail e acesse a área de entrega para consultar os materiais disponíveis.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="btn-primary" onClick={() => navigate("/entrega")}>
            Acessar área de entrega <ArrowRight size={16} />
          </button>
          <button className="btn-ghost" onClick={() => openConfiguredUrl(APP_CONFIG.WHATSAPP_URL)}>
            <MessageCircle size={16} /> Falar com suporte
          </button>
        </div>
        <ul className="text-sm text-muted-foreground text-left mt-10 space-y-2 max-w-md mx-auto">
          <li>• Guarde seu comprovante.</li>
          <li>• Confira seu e-mail (inclusive a caixa de spam).</li>
          <li>• Em caso de dificuldade, fale com o suporte.</li>
        </ul>
      </div>
    </Section>
  );
}

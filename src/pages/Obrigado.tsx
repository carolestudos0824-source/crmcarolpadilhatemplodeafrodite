import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, Mail, Home as HomeIcon } from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { APP_CONFIG } from "@/config/appConfig";
import { openSupportEmail } from "@/lib/openLink";

export default function Obrigado() {
  const navigate = useNavigate();
  const [initiated, setInitiated] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const flag = sessionStorage.getItem(APP_CONFIG.CHECKOUT_INITIATED_FLAG);
      setInitiated(flag === "1");
    } catch {
      setInitiated(false);
    }
  }, []);

  if (initiated === null) return null;

  if (!initiated) {
    return (
      <Section>
        <div className="max-w-2xl mx-auto text-center glass-strong p-10 md:p-14">
          <div className="flex justify-center mb-6"><Logo size="lg" asLink={false} /></div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-3">
            Compra ainda não confirmada
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-8">
            Não identificamos uma compra iniciada nesta sessão. Se você acabou de pagar,
            aguarde o e-mail com as instruções de acesso. Se ainda não comprou, volte para
            a página inicial.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="btn-primary" onClick={() => navigate("/")}>
              <HomeIcon size={16} /> Voltar para a página inicial
            </button>
            <button className="btn-ghost" onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}>
              <Mail size={16} /> Falar com suporte
            </button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="max-w-2xl mx-auto text-center glass-strong p-10 md:p-14 neon-shadow">
        <div className="flex justify-center mb-6"><Logo size="lg" asLink={false} /></div>
        <CheckCircle2 size={48} className="text-accent mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-3">Compra recebida</h1>
        <p className="text-base md:text-lg text-muted-foreground mb-3">
          Obrigado por adquirir a Fábrica de Apps com IA. As instruções de acesso serão enviadas para o e-mail informado na compra assim que o pagamento for confirmado.
        </p>
        <p className="text-base text-muted-foreground mb-4">
          Verifique sua caixa de entrada, spam ou promoções. Em caso de dificuldade, fale com o suporte por e-mail.
        </p>
        <p className="text-sm text-accent/90 bg-accent/5 border border-accent/20 rounded-xl p-3 leading-relaxed mb-8">
          Esta página apenas confirma que você iniciou a compra. O acesso à área restrita só é liberado após confirmação do pagamento.
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

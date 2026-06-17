import { Section } from "@/components/Section";
import { APP_CONFIG } from "@/config/appConfig";

export default function Privacidade() {
  return (
    <Section eyebrow="Documentos" title="Política de Privacidade">
      <div className="max-w-3xl mx-auto text-muted-foreground space-y-5 text-sm leading-relaxed">
        <p>Esta Política descreve como tratamos os dados coletados no site <strong>Fábrica de Apps com IA</strong>.</p>
        <h3 className="text-foreground font-heading">1. Dados coletados</h3>
        <p>Coletamos nome, e-mail, WhatsApp e, opcionalmente, informações sobre sua ideia de aplicativo, quando você preenche um formulário no site.</p>
        <h3 className="text-foreground font-heading">2. Uso dos dados</h3>
        <p>Usamos seus dados para entregar o produto adquirido, prestar suporte, enviar comunicados relevantes e melhorar a experiência.</p>
        <h3 className="text-foreground font-heading">3. Armazenamento</h3>
        <p>Os dados são armazenados em provedores próprios e serviços de terceiros confiáveis. Adotamos medidas técnicas para proteção das informações.</p>
        <h3 className="text-foreground font-heading">4. Solicitação de exclusão</h3>
        <p>Você pode solicitar a exclusão dos seus dados a qualquer momento pelo e-mail de suporte.</p>
        <h3 className="text-foreground font-heading">5. Cookies</h3>
        <p>Podemos usar cookies e tecnologias similares para medir uso e melhorar o site.</p>
        <h3 className="text-foreground font-heading">6. Pagamentos</h3>
        <p>Dados de pagamento são processados em ambiente externo pelas plataformas de checkout. Nenhum dado financeiro é armazenado neste site.</p>
        <h3 className="text-foreground font-heading">7. Contato</h3>
        <p>Dúvidas sobre privacidade: <span className="text-accent">{APP_CONFIG.SUPORTE_EMAIL || "e-mail de suporte a configurar"}</span></p>
      </div>
    </Section>
  );
}

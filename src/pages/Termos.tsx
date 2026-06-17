import { Section } from "@/components/Section";
import { APP_CONFIG } from "@/config/appConfig";

export default function Termos() {
  return (
    <Section eyebrow="Documentos" title="Termos de Uso">
      <div className="prose prose-invert max-w-3xl mx-auto text-muted-foreground space-y-5 text-sm leading-relaxed">
        <p>Estes Termos regulam o acesso e uso do produto digital <strong>Fábrica de Apps com IA</strong>, oferecido por <strong>{APP_CONFIG.COMPANY_NAME}</strong> ({APP_CONFIG.COMPANY_DOCUMENT}), tendo como responsável <strong>{APP_CONFIG.RESPONSIBLE_NAME}</strong>.</p>
        <h3 className="text-foreground font-heading">1. Natureza do produto</h3>
        <p>O produto é digital, composto por acesso a um agente de IA, prompts, manuais e checklists. Não há entrega física. O acesso é individual e intransferível.</p>
        <h3 className="text-foreground font-heading">2. Acesso</h3>
        <p>O acesso é concedido após confirmação do pagamento. O uso indevido, compartilhamento ou tentativa de revenda podem levar à suspensão.</p>
        <h3 className="text-foreground font-heading">3. Suporte</h3>
        <p>O suporte é oferecido pelos canais oficiais informados no site. Tempo de resposta em dias úteis.</p>
        <h3 className="text-foreground font-heading">4. Limitações de responsabilidade</h3>
        <p>O produto entrega estrutura, prompts e materiais para criação de aplicativos. Não há promessa de ganhos financeiros, sucesso comercial ou resultado garantido. A aplicação prática depende exclusivamente do usuário.</p>
        <h3 className="text-foreground font-heading">5. Política de reembolso</h3>
        <p>O reembolso segue as regras do plataforma de checkout utilizada. Solicitações dentro do prazo legal devem ser feitas pelo e-mail de suporte.</p>
        <h3 className="text-foreground font-heading">6. Alterações</h3>
        <p>Estes Termos podem ser atualizados a qualquer momento. A versão vigente é sempre a publicada nesta página.</p>
        <h3 className="text-foreground font-heading">7. Contato</h3>
        <p>Dúvidas: <span className="text-accent">{APP_CONFIG.SUPORTE_EMAIL || "e-mail de suporte a configurar"}</span></p>
      </div>
    </Section>
  );
}

import { Section } from "@/components/Section";
import { APP_CONFIG } from "@/config/appConfig";

export default function Termos() {
  const company = APP_CONFIG.COMPANY_NAME?.trim();
  const doc = APP_CONFIG.COMPANY_DOCUMENT?.trim();
  const responsible = APP_CONFIG.RESPONSIBLE_NAME?.trim();
  const hasAnyLegal = company || doc || responsible;

  return (
    <Section eyebrow="Documentos" title="Termos de Uso">
      <div className="prose prose-invert max-w-3xl mx-auto text-muted-foreground space-y-5 text-sm leading-relaxed">
        {hasAnyLegal ? (
          <p>
            Estes Termos regulam o acesso e uso do produto digital <strong>Fábrica de Apps com IA</strong>
            {company ? <>, oferecido por <strong>{company}</strong></> : null}
            {doc ? <> ({doc})</> : null}
            {responsible ? <>, tendo como responsável <strong>{responsible}</strong></> : null}.
          </p>
        ) : (
          <>
            <p>
              Estes Termos regulam o acesso e uso do produto digital <strong>Fábrica de Apps com IA</strong>.
            </p>
            <p className="text-xs text-accent/90 bg-accent/5 border border-accent/20 rounded-xl p-3 leading-relaxed">
              Os dados legais completos (razão social, CNPJ e responsável) serão preenchidos pela responsável antes da venda pública.
            </p>
          </>
        )}
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
        {APP_CONFIG.SUPORTE_EMAIL?.trim() ? (
          <p>Dúvidas: <span className="text-accent">{APP_CONFIG.SUPORTE_EMAIL}</span></p>
        ) : (
          <p>Dúvidas: canal de suporte em atualização.</p>
        )}
      </div>
    </Section>
  );
}

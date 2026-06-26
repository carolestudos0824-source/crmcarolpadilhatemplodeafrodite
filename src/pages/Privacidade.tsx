import { Link } from "react-router-dom";
import { Section } from "@/components/Section";

const OFICIAL = {
  titular: "Carolina Teixeira de Souza",
  cnpj: "44.472.530/0001-08",
  email: "fabricadeappscomia@outlook.com",
  atualizacao: "26 de Junho de 2026",
};

export default function Privacidade() {
  return (
    <Section eyebrow="Documento oficial" title="Política de Privacidade da Fábrica de Apps com IA">
      <div className="max-w-3xl mx-auto text-muted-foreground text-sm leading-relaxed space-y-5">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-foreground/80 space-y-1">
          <div><strong className="text-foreground">Fábrica de Apps com IA</strong></div>
          <div>Titularidade: {OFICIAL.titular} — CNPJ {OFICIAL.cnpj}</div>
          <div>Contato: <a className="text-accent" href={`mailto:${OFICIAL.email}`}>{OFICIAL.email}</a></div>
          <div>Última atualização: {OFICIAL.atualizacao}</div>
        </div>

        <p>
          Esta Política descreve como a <strong>Fábrica de Apps com IA</strong> trata os dados
          pessoais das pessoas que acessam, compram e utilizam o programa.
        </p>

        <h3 className="text-foreground font-heading">1. Dados coletados</h3>
        <p>
          Coletamos apenas o necessário para entregar o programa: nome, e-mail de cadastro, dados
          de autenticação (via Google OAuth quando utilizado), contexto do projeto que a usuária
          decide salvar (nome do app, público, promessa, etapas), progresso na jornada, prompts
          editados e mensagens enviadas ao suporte. Não coletamos dados sensíveis sem necessidade.
        </p>

        <h3 className="text-foreground font-heading">2. Uso dos dados</h3>
        <p>
          Os dados são utilizados para liberar e manter o acesso, salvar o progresso da usuária,
          personalizar prompts e recomendações, prestar suporte, prevenir fraudes e melhorar a
          experiência da plataforma. Não vendemos dados pessoais.
        </p>

        <h3 className="text-foreground font-heading">3. Base legal</h3>
        <p>
          O tratamento se apoia em: execução de contrato (entrega do programa adquirido),
          legítimo interesse (segurança, prevenção de fraude e melhoria do serviço), cumprimento
          de obrigação legal e consentimento, quando aplicável.
        </p>

        <h3 className="text-foreground font-heading">4. Armazenamento e provedores</h3>
        <p>
          Os dados são armazenados em provedores de nuvem confiáveis utilizados pela plataforma,
          incluindo serviços de banco de dados, autenticação e hospedagem. Adotamos medidas
          técnicas razoáveis de proteção, mas nenhum sistema é totalmente imune a riscos.
        </p>

        <h3 className="text-foreground font-heading">5. Pagamentos</h3>
        <p>
          Dados de pagamento são processados em ambiente externo pela plataforma de checkout
          utilizada. Nenhum dado de cartão é armazenado pela Fábrica de Apps com IA.
        </p>

        <h3 className="text-foreground font-heading">6. Cookies e medição</h3>
        <p>
          Podemos utilizar cookies próprios e de terceiros para autenticação, segurança, medição
          de uso e melhoria do site. A usuária pode gerenciar cookies no seu navegador.
        </p>

        <h3 className="text-foreground font-heading">7. Compartilhamento</h3>
        <p>
          Os dados podem ser compartilhados com prestadores estritamente necessários à operação
          (autenticação, hospedagem, e-mail, checkout, suporte), sempre limitados à finalidade do
          serviço. Não há compartilhamento para fins de venda de dados.
        </p>

        <h3 className="text-foreground font-heading">8. Direitos da usuária</h3>
        <p>
          Conforme a LGPD, a usuária pode solicitar confirmação de tratamento, acesso, correção,
          anonimização, portabilidade, exclusão de dados e informações sobre compartilhamento,
          pelo e-mail oficial. Importante: a exclusão da conta encerra o acesso ao programa.
        </p>

        <h3 className="text-foreground font-heading">9. Retenção</h3>
        <p>
          Mantemos os dados pelo tempo necessário para cumprir as finalidades descritas, atender
          obrigações legais e exercer regularmente direitos. Dados podem ser anonimizados para
          fins estatísticos.
        </p>

        <h3 className="text-foreground font-heading">10. IA e conteúdo gerado</h3>
        <p>
          Os recursos de IA da plataforma podem usar o contexto que a usuária digita para gerar
          sugestões. Não recomendamos inserir dados pessoais sensíveis, senhas ou informações
          confidenciais nos prompts e formulários do programa.
        </p>

        <h3 className="text-foreground font-heading">11. Apps criados pelas alunas</h3>
        <p>
          Esta Política trata exclusivamente dos dados coletados pela Fábrica de Apps com IA. Os
          aplicativos criados pelas alunas devem ter sua própria Política de Privacidade,
          adaptada aos dados que coletam, ao público que atendem e ao tratamento que fazem. A
          Fábrica não responde por práticas de privacidade dos apps publicados pelas alunas.
        </p>

        <h3 className="text-foreground font-heading">12. Segurança e incidentes</h3>
        <p>
          Adotamos medidas razoáveis de proteção, mas nenhum sistema é totalmente imune a riscos.
          Em caso de incidente relevante, a titular adotará as medidas cabíveis previstas em lei.
        </p>

        <h3 className="text-foreground font-heading">13. Alterações</h3>
        <p>
          Esta Política pode ser atualizada. A versão vigente é sempre a publicada nesta página,
          com a data de última atualização visível no topo.
        </p>

        <h3 className="text-foreground font-heading">14. Encarregado e contato</h3>
        <p>
          Solicitações relacionadas a dados pessoais devem ser enviadas para{" "}
          <a className="text-accent" href={`mailto:${OFICIAL.email}`}>{OFICIAL.email}</a>.
        </p>

        <div className="pt-4 border-t border-white/5 flex flex-wrap gap-3 text-xs">
          <Link to="/termos-de-uso" className="text-accent hover:underline">Ver Termos de Uso</Link>
          <Link to="/legal" className="text-muted-foreground hover:text-foreground">Central legal</Link>
          <Link to="/suporte" className="text-muted-foreground hover:text-foreground">Suporte</Link>
        </div>
      </div>
    </Section>
  );
}

import { Section } from "@/components/Section";
import { APP_CONFIG } from "@/config/appConfig";
import { Link } from "react-router-dom";

export default function Confianca() {
  const email = APP_CONFIG.SUPORTE_EMAIL || "e-mail de suporte a configurar";

  return (
    <Section eyebrow="Confiança" title="Segurança e Privacidade">
      <div className="max-w-3xl mx-auto text-muted-foreground space-y-6 text-sm leading-relaxed">
        <p className="text-foreground/90">
          Esta página é mantida pela equipe da <strong>Fábrica de Apps com IA</strong> para
          responder dúvidas comuns sobre segurança, privacidade e responsabilidades do produto.
          Não é uma certificação independente.
        </p>

        <div>
          <h3 className="text-foreground font-heading">Acesso e autenticação</h3>
          <p>
            O acesso à área de entrega é protegido por senha. Nenhuma área administrativa do
            produto é acessível publicamente. Tokens e segredos ficam apenas no servidor.
          </p>
        </div>

        <div>
          <h3 className="text-foreground font-heading">Plataforma e hospedagem</h3>
          <p>
            O site é servido por provedores de hospedagem profissionais sobre HTTPS. O
            armazenamento de dados, quando aplicável, usa banco gerenciado com controle de
            acesso por linha (Row-Level Security) e segredos isolados por ambiente.
          </p>
        </div>

        <div>
          <h3 className="text-foreground font-heading">Dados coletados</h3>
          <p>
            Coletamos apenas o necessário para entregar o produto: nome, e-mail e dados de
            cadastro. Detalhes completos estão na{" "}
            <Link to="/privacidade" className="text-accent underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        <div>
          <h3 className="text-foreground font-heading">Pagamentos</h3>
          <p>
            Pagamentos são processados por plataformas externas de checkout. Nenhum dado de
            cartão é armazenado neste site.
          </p>
        </div>

        <div>
          <h3 className="text-foreground font-heading">Subprocessadores e integrações</h3>
          <p>
            Usamos provedores de hospedagem, banco de dados gerenciado e checkout externo.
            O agente é executado dentro da sua própria conta ChatGPT — o produto não envia
            seus dados para a OpenAI em seu nome.
          </p>
        </div>

        <div>
          <h3 className="text-foreground font-heading">Retenção e exclusão</h3>
          <p>
            Você pode solicitar exclusão dos seus dados a qualquer momento pelo e-mail de
            suporte abaixo.
          </p>
        </div>

        <div>
          <h3 className="text-foreground font-heading">Responsabilidade compartilhada</h3>
          <p>
            O uso do Agente Arquiteto exige que você esteja logado em uma conta
            ChatGPT própria. Você é responsável pela segurança da sua conta ChatGPT e pelo
            uso que faz dos planos gerados.
          </p>
        </div>

        <div>
          <h3 className="text-foreground font-heading">Contato de segurança</h3>
          <p>
            Encontrou um problema de segurança? Escreva para{" "}
            <span className="text-accent">{email}</span> com o assunto “Segurança”.
          </p>
        </div>

        <p className="text-xs opacity-70">
          Veja também:{" "}
          <Link to="/privacidade" className="underline">Privacidade</Link> ·{" "}
          <Link to="/termos" className="underline">Termos</Link>
        </p>
      </div>
    </Section>
  );
}

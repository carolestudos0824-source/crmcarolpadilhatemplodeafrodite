import { Section } from "@/components/Section";
import { APP_CONFIG } from "@/config/appConfig";

export default function Seguranca() {
  return (
    <Section eyebrow="Confiança" title="Segurança e confiança">
      <div className="max-w-3xl mx-auto text-muted-foreground space-y-5 text-sm leading-relaxed">
        <p>
          Esta página é mantida pela equipe da{" "}
          <strong className="text-foreground">Fábrica de Apps com IA</strong>{" "}
          para explicar, em linguagem simples, como protegemos os dados das
          pessoas que usam o app.
        </p>

        <h3 className="text-foreground font-heading">Autenticação segura</h3>
        <p>
          O acesso é feito por e-mail e senha. As senhas nunca trafegam ou são
          armazenadas em texto puro. Sessões expiram automaticamente e podem
          ser encerradas a qualquer momento pelo próprio usuário.
        </p>

        <h3 className="text-foreground font-heading">Cada usuário vê apenas os próprios dados</h3>
        <p>
          O banco de dados aplica regras de acesso por linha. Isso significa
          que, mesmo no nível da consulta, um usuário só consegue ler ou alterar
          os dados que pertencem a ele.
        </p>

        <h3 className="text-foreground font-heading">Ações administrativas protegidas</h3>
        <p>
          Funções administrativas — como liberar ou revogar acesso de
          compradores — só podem ser executadas por contas marcadas como
          administradoras, por meio de funções verificadas no servidor. O
          frontend nunca tem permissão para alterar acessos diretamente.
        </p>

        <h3 className="text-foreground font-heading">Listagem de administradores</h3>
        <p>
          A lista de administradores não é visível para usuários comuns. Apenas
          administradores autenticados conseguem consultá-la.
        </p>

        <h3 className="text-foreground font-heading">Pagamentos</h3>
        <p>
          Quando aplicável, os pagamentos são processados por gateways externos
          especializados. Nenhum dado de cartão é armazenado ou trafega pelo
          nosso site.
        </p>

        <h3 className="text-foreground font-heading">Chaves e credenciais</h3>
        <p>
          As chaves sensíveis (como a chave de serviço do banco) ficam
          exclusivamente no servidor. O frontend usa apenas a chave pública,
          que por design só permite operações respeitando as regras de acesso
          por usuário.
        </p>

        <h3 className="text-foreground font-heading">Relatar um problema</h3>
        <p>
          Se você encontrou algo que parece uma vulnerabilidade ou tem dúvidas
          de segurança, entre em contato pelo e-mail{" "}
          <span className="text-accent">
            {APP_CONFIG.SUPORTE_EMAIL || "e-mail de suporte a configurar"}
          </span>
          . Vamos responder o quanto antes.
        </p>

        <p className="text-xs text-muted-foreground/80 pt-4 border-t border-white/10">
          Este documento descreve práticas atuais do app. Não constitui
          certificação independente nem garantia absoluta. Buscamos melhorar
          continuamente as medidas de segurança.
        </p>
      </div>
    </Section>
  );
}

import { Link } from "react-router-dom";
import { Section } from "@/components/Section";

const OFICIAL = {
  titular: "Carolina Teixeira de Souza",
  cnpj: "44.472.530/0001-08",
  email: "fabricadeappscomia@outlook.com",
  atualizacao: "26 de Junho de 2026",
};

export default function Termos() {
  return (
    <Section eyebrow="Documento oficial" title="Termos de Uso da Fábrica de Apps com IA">
      <div className="max-w-3xl mx-auto text-muted-foreground text-sm leading-relaxed space-y-5">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-foreground/80 space-y-1">
          <div><strong className="text-foreground">Fábrica de Apps com IA</strong></div>
          <div>Titularidade: {OFICIAL.titular} — CNPJ {OFICIAL.cnpj}</div>
          <div>Contato: <a className="text-accent" href={`mailto:${OFICIAL.email}`}>{OFICIAL.email}</a></div>
          <div>Última atualização: {OFICIAL.atualizacao}</div>
        </div>

        <p>
          Estes Termos regulam o acesso e o uso do programa <strong>Fábrica de Apps com IA</strong>,
          produto digital de orientação para criação, validação, monetização e melhoria de aplicativos
          com apoio de inteligência artificial e da plataforma Lovable.
        </p>

        <h3 className="text-foreground font-heading">1. Aceite</h3>
        <p>
          Ao acessar, criar conta, comprar, fazer login ou utilizar qualquer recurso da Fábrica de
          Apps com IA, a pessoa usuária declara que leu, entendeu e concorda integralmente com estes Termos
          e com a Política de Privacidade.
        </p>

        <h3 className="text-foreground font-heading">2. Natureza do produto</h3>
        <p>
          O produto é digital e inclui acesso a módulos guiados, prompts, comandos prontos,
          checklists, materiais de apoio e a um agente de IA orientador. Não há entrega de software,
          serviço de programação, consultoria personalizada nem garantia de funcionamento de
          aplicativos criados pela pessoa usuária.
        </p>

        <h3 className="text-foreground font-heading">3. Acesso e conta</h3>
        <p>
          O acesso é individual, pessoal e intransferível. Cada conta deve ser usada por uma única
          pessoa. Compartilhamento, revenda, distribuição ou cessão do acesso podem levar à
          suspensão imediata, sem reembolso.
        </p>

        <h3 className="text-foreground font-heading">4. Uso de IA</h3>
        <p>
          Os recursos de IA geram sugestões automatizadas que devem ser revisadas pela pessoa usuária. A
          Fábrica de Apps com IA não substitui aconselhamento profissional jurídico, financeiro,
          médico, terapêutico ou técnico. A pessoa usuária é responsável por revisar, validar e decidir
          como utilizar os prompts, materiais e aplicativos criados com apoio da plataforma.
        </p>

        <h3 className="text-foreground font-heading">5. Limitação de resultado</h3>
        <p>
          A Fábrica de Apps com IA não garante vendas, faturamento, ranqueamento, aprovação de
          mercado, segurança absoluta ou ausência total de erros. O resultado depende de fatores
          fora do controle do programa, como nicho, execução, oferta, divulgação, preço e
          comportamento do público da pessoa usuária.
        </p>

        <h3 className="text-foreground font-heading">6. Segurança</h3>
        <p>
          A Fábrica de Apps com IA adota medidas razoáveis de proteção, mas nenhum sistema é
          totalmente imune a riscos. A pessoa usuária deve manter sua senha em segurança e comunicar
          imediatamente qualquer suspeita de uso indevido.
        </p>

        <h3 className="text-foreground font-heading">7. Propriedade intelectual</h3>
        <p>
          Textos, prompts, materiais, métodos, estrutura, design, módulos, comandos e demais
          conteúdos da Fábrica de Apps com IA são protegidos e não podem ser copiados, revendidos,
          distribuídos, publicados como obra própria ou explorados sem autorização expressa da
          titular.
        </p>

        <h3 className="text-foreground font-heading">8. Apps criados pelas pessoas participantes</h3>
        <p>
          Os documentos oficiais da Fábrica de Apps com IA regulam o uso deste programa. Cada app
          criado pelo participante deve ter seus próprios Termos de Uso e Política de Privacidade,
          adaptados ao produto, público, dados coletados, pagamento e entrega do seu próprio
          aplicativo. A Fábrica não responde por aplicativos, ofertas, promessas, dados ou
          obrigações dos apps publicados pelas pessoas participantes.
        </p>

        <h3 className="text-foreground font-heading">9. Pagamento e reembolso</h3>
        <p>
          O pagamento é processado em ambiente externo pela plataforma de checkout utilizada.
          Solicitações de reembolso devem ser feitas pelo e-mail oficial, dentro do prazo legal de
          7 dias para arrependimento em compras à distância, conforme o Código de Defesa do
          Consumidor. Após esse prazo, eventuais reembolsos ficam a critério da titular.
        </p>

        <h3 className="text-foreground font-heading">10. Suspensão e encerramento</h3>
        <p>
          A titular pode suspender ou encerrar o acesso em casos de fraude, compartilhamento,
          violação destes Termos, uso abusivo ou tentativa de comprometer a segurança da
          plataforma.
        </p>

        <h3 className="text-foreground font-heading">11. Alterações</h3>
        <p>
          Estes Termos podem ser atualizados a qualquer momento. A versão vigente é sempre a
          publicada nesta página, com a data de última atualização visível no topo.
        </p>

        <h3 className="text-foreground font-heading">12. Foro e contato</h3>
        <p>
          Para dúvidas, solicitações ou notificações, utilize{" "}
          <a className="text-accent" href={`mailto:${OFICIAL.email}`}>{OFICIAL.email}</a>. Fica
          eleito o foro do domicílio da titular para dirimir eventuais controvérsias, salvo
          disposição legal em contrário.
        </p>

        <div className="pt-4 border-t border-white/5 flex flex-wrap gap-3 text-xs">
          <Link to="/politica-de-privacidade" className="text-accent hover:underline">Ver Política de Privacidade</Link>
          <Link to="/legal" className="text-muted-foreground hover:text-foreground">Central legal</Link>
          <Link to="/suporte" className="text-muted-foreground hover:text-foreground">Suporte</Link>
        </div>
      </div>
    </Section>
  );
}

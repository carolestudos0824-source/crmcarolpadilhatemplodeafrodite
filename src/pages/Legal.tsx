import { Link } from "react-router-dom";
import { FileText, ShieldCheck, LifeBuoy, ArrowLeft } from "lucide-react";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";

const OFICIAL = {
  titular: "Carolina Teixeira de Souza",
  cnpj: "44.472.530/0001-08",
  email: "fabricadeappscomia@outlook.com",
  atualizacao: "26 de Junho de 2026",
};

type Item = {
  to: string;
  icon: typeof FileText;
  title: string;
  desc: string;
};

const ITENS: Item[] = [
  {
    to: "/termos-de-uso",
    icon: FileText,
    title: "Termos de Uso",
    desc: "Regras de acesso, uso, IA, propriedade intelectual e responsabilidades.",
  },
  {
    to: "/politica-de-privacidade",
    icon: ShieldCheck,
    title: "Política de Privacidade",
    desc: "Quais dados coletamos, como tratamos e direitos de quem usa o programa pela LGPD.",
  },
  {
    to: "/suporte",
    icon: LifeBuoy,
    title: "Suporte",
    desc: "Canal oficial para dúvidas, solicitações e contato com a titular.",
  },
];

export default function Legal() {
  return (
    <Section eyebrow="Central legal" title="Documentos oficiais da Fábrica de Apps com IA">
      <div className="max-w-3xl mx-auto space-y-6">
        <GlassCard className="p-5 text-xs text-foreground/80 space-y-1">
          <div><strong className="text-foreground">Fábrica de Apps com IA</strong></div>
          <div>Titularidade: {OFICIAL.titular} — CNPJ {OFICIAL.cnpj}</div>
          <div>Contato: <a className="text-accent" href={`mailto:${OFICIAL.email}`}>{OFICIAL.email}</a></div>
          <div>Última atualização: {OFICIAL.atualizacao}</div>
        </GlassCard>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Estes são os documentos oficiais que regulam o uso do programa Fábrica de Apps com IA.
          Eles protegem a plataforma, a titular e a própria pessoa usuária. Não confunda estes documentos
          com os Termos e a Política que cada participante precisa criar para o seu próprio aplicativo.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {ITENS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 p-5 transition flex flex-col gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <h3 className="font-heading font-semibold text-base text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                <span className="text-xs text-accent mt-1 group-hover:underline">Abrir →</span>
              </Link>
            );
          })}
        </div>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={14} /> Voltar ao app
          </Link>
        </div>
      </div>
    </Section>
  );
}

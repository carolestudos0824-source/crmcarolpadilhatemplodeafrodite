import { useNavigate } from "react-router-dom";
import { Sparkles, Layers, Database, Palette, DollarSign, Rocket, Zap, Brain, Target, Users, ChevronRight } from "lucide-react";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { HeroVisual } from "@/components/HeroVisual";
import { LeadForm } from "@/components/LeadForm";
import { PricingCard } from "@/components/PricingCard";
import { FAQItem } from "@/components/FAQItem";
import { PLANS } from "@/data/plans";

const dorItems = [
  { icon: <Target size={20} />, t: "Não sei por onde começar" },
  { icon: <Layers size={20} />, t: "Não sei o que entra no MVP" },
  { icon: <Zap size={20} />, t: "Não sei qual ferramenta usar" },
  { icon: <DollarSign size={20} />, t: "Não sei como monetizar" },
  { icon: <Brain size={20} />, t: "Meu prompt sai confuso" },
  { icon: <Rocket size={20} />, t: "Tenho medo de criar um app caro e inchado" },
];

const entregas = [
  "Agente Arquiteto Supremo de Aplicativos",
  "Prompt Mestre Universal",
  "Manual rápido de uso",
  "Checklist de MVP enxuto",
  "Checklist de monetização",
  "Checklist de lançamento",
  "Prompts bônus para Lovable, landing page, checkout e página de preços",
];

const agenteFaz = [
  { icon: <Brain size={20} />, t: "Analisa sua ideia" },
  { icon: <Target size={20} />, t: "Corta o excesso" },
  { icon: <Layers size={20} />, t: "Define o MVP" },
  { icon: <Users size={20} />, t: "Cria o fluxo do usuário" },
  { icon: <Database size={20} />, t: "Sugere stack e banco de dados" },
  { icon: <Palette size={20} />, t: "Cria o design system" },
  { icon: <DollarSign size={20} />, t: "Monta a monetização" },
  { icon: <Sparkles size={20} />, t: "Entrega o prompt pronto" },
];

const paraQuem = [
  "Empreendedores digitais",
  "Criadores de conteúdo",
  "Social medias",
  "Consultoras",
  "Terapeutas",
  "Tarólogas",
  "Infoprodutores",
  "Prestadores de serviço",
  "Pessoas que usam Lovable, Claude, Cursor, Gemini ou Replit",
];

const passos = [
  { n: "01", t: "Você escreve sua ideia" },
  { n: "02", t: "O agente corta o excesso" },
  { n: "03", t: "Ele monta o MVP e a arquitetura" },
  { n: "04", t: "Você cola o prompt na ferramenta escolhida" },
  { n: "05", t: "Você valida com usuários reais" },
];

const transformacoes = [
  "De ideia solta para MVP estruturado",
  "De prompt confuso para construção guiada",
  "De app inchado para produto validável",
  "De dúvida técnica para plano de execução",
  "De produto gratuito para modelo de monetização",
];

const faqs = [
  { q: "Preciso saber programar?", a: "Não. O agente foi feito justamente para quem não programa. Ele organiza sua ideia e gera prompts prontos para ferramentas de criação com IA." },
  { q: "O agente cria o app sozinho?", a: "Não. Ele estrutura estratégia, MVP, arquitetura, design, monetização e prompts. A construção acontece em ferramentas como Lovable, Cursor, Claude Code, Gemini ou Replit." },
  { q: "Posso usar no Lovable?", a: "Sim. Os prompts são pensados para Lovable e funcionam também em Claude Code, Cursor, Gemini e Replit." },
  { q: "Funciona para SaaS, app com IA e produto digital?", a: "Sim. O foco é transformar ideias em produtos digitais validáveis: MVPs, SaaS simples, ferramentas internas, apps com IA e páginas de venda." },
  { q: "O acesso ao agente pode ser compartilhado?", a: "Não. O acesso é individual. Compartilhamento pode causar bloqueio conforme as regras do produto." },
  { q: "O que recebo após a compra?", a: "Acesso ao Agente Arquiteto Supremo de Aplicativos, Prompt Mestre Universal, manual rápido, checklists de MVP, monetização e lançamento, e prompts bônus." },
  { q: "Tem suporte?", a: "Sim. O suporte é feito exclusivamente por e-mail, no endereço informado na página de suporte." },
  { q: "Posso usar para criar apps para clientes?", a: "Sim. Você pode usar a estrutura para organizar ideias de clientes e montar propostas de aplicativos." },
];

export default function Home() {
  const navigate = useNavigate();
  const fabrica = PLANS[0];
  const goFabrica = () => navigate("/checkout?plano=fabrica");

  return (
    <>
      {/* HERO */}
      <section className="relative pt-12 md:pt-20 pb-16">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-accent">Arquiteto Supremo de Aplicativos</span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-[1.05] text-gradient">
              Crie aplicativos com IA mesmo sem saber programar
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Acesse um agente estratégico que transforma sua ideia em MVP, arquitetura, design, monetização e prompts prontos para Lovable, Claude Code, Cursor ou Gemini.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="btn-primary" onClick={goFabrica}>
                Acessar agora por R$47 <ChevronRight size={18} />
              </button>
              <a href="#solucao" className="btn-ghost">Ver o que está incluso</a>
            </div>
          </div>
          <div className="order-first lg:order-last">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* DOR */}
      <Section
        eyebrow="Diagnóstico"
        title="Você tem uma ideia de app, mas trava antes de começar?"
        subtitle="O problema não é falta de ideia. O problema é não saber transformar essa ideia em um MVP simples, construível e vendável."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dorItems.map((d) => (
            <GlassCard key={d.t} className="flex items-start gap-3">
              <div className="text-accent shrink-0 mt-1">{d.icon}</div>
              <p className="text-base text-foreground/90">{d.t}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* SOLUÇÃO */}
      <Section
        id="solucao"
        eyebrow="Solução"
        title="A Fábrica de Apps com IA transforma ideia solta em plano de app pronto para executar"
        subtitle="Você não recebe apenas um prompt. Você recebe um sistema completo para estruturar ideias, cortar excessos, definir MVP, criar monetização e gerar comandos prontos para construir com IA."
      >
        <div className="glass-strong p-6 md:p-10 max-w-3xl mx-auto">
          <ul className="grid sm:grid-cols-2 gap-3">
            {entregas.map((e) => (
              <li key={e} className="flex gap-3 text-base text-foreground/90">
                <Sparkles size={18} className="text-gold shrink-0 mt-1" />{e}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* AGENTE FAZ */}
      <Section eyebrow="O agente em ação" title="O que o Arquiteto Supremo de Aplicativos faz por você">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agenteFaz.map((a) => (
            <GlassCard key={a.t}>
              <div className="text-accent mb-3">{a.icon}</div>
              <p className="font-medium text-base">{a.t}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* PARA QUEM */}
      <Section
        eyebrow="Para quem é"
        title="Para quem tem uma ideia, serviço ou conhecimento e quer transformar isso em app"
        subtitle="Ideal para quem quer criar uma ferramenta digital, SaaS simples, app com IA, produto digital ou solução para vender sem começar do zero."
      >
        <div className="flex flex-wrap justify-center gap-3">
          {paraQuem.map((p) => (
            <span key={p} className="glass px-4 py-2 text-base text-foreground/90">{p}</span>
          ))}
        </div>
      </Section>

      {/* COMO FUNCIONA */}
      <Section eyebrow="Processo" title="Como funciona">
        <div className="grid md:grid-cols-5 gap-4">
          {passos.map((p) => (
            <GlassCard key={p.n} className="text-center">
              <div className="text-3xl font-heading font-bold text-gold mb-2">{p.n}</div>
              <p className="text-base text-foreground/90">{p.t}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* CAPTURA */}
      <Section
        eyebrow="Lista de criadores"
        title="Quer saber se sua ideia pode virar um app?"
        subtitle="Cadastre sua ideia e entre na lista para criar um MVP com IA de forma simples, estruturada e validável."
      >
        <LeadForm />
      </Section>

      {/* OFERTA */}
      <Section
        eyebrow="Oferta"
        title="Acesse agora a Fábrica de Apps com IA"
        subtitle="Uma única oferta para você sair da ideia solta e chegar em um plano de app pronto para construir com IA."
      >
        <div className="max-w-md mx-auto">
          <PricingCard plan={fabrica} />
        </div>
      </Section>

      {/* TRANSFORMAÇÃO */}
      <Section eyebrow="Resultado" title="O que muda quando sua ideia ganha estrutura">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {transformacoes.map((t) => (
            <GlassCard key={t}><p className="text-base text-foreground/90">{t}</p></GlassCard>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section eyebrow="Dúvidas" title="Perguntas frequentes">
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </Section>

      {/* CTA FINAL */}
      <Section>
        <div className="glass-strong p-10 md:p-16 text-center max-w-4xl mx-auto neon-shadow">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-gradient mb-4">Sua ideia não precisa ficar parada</h2>
          <p className="text-lg text-muted-foreground mb-8">Comece com um MVP claro, simples e vendável.</p>
          <button className="btn-primary mx-auto" onClick={goFabrica}>
            Acessar agora por R$47 <ChevronRight size={18} />
          </button>
        </div>
      </Section>
    </>
  );
}

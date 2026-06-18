import { useNavigate } from "react-router-dom";
import { Sparkles, Layers, Database, DollarSign, Rocket, Brain, Target, ChevronRight, FileText, Workflow, Wand2 } from "lucide-react";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { HeroVisual } from "@/components/HeroVisual";
import { PricingCard } from "@/components/PricingCard";
import { FAQItem } from "@/components/FAQItem";
import { PLANS } from "@/data/plans";

const dorItems = [
  { icon: <Target size={20} />, t: "Qual funcionalidade criar primeiro" },
  { icon: <Layers size={20} />, t: "Como organizar as telas" },
  { icon: <Database size={20} />, t: "Qual tecnologia e banco usar" },
  { icon: <DollarSign size={20} />, t: "Como monetizar a ideia" },
  { icon: <Brain size={20} />, t: "Como transformar ideia em execução" },
  { icon: <Rocket size={20} />, t: "Por onde começar sem travar" },
];

const promessa = [
  { icon: <Brain size={20} />, t: "Diagnóstico estratégico da sua ideia" },
  { icon: <Layers size={20} />, t: "MVP com no máximo 5 funcionalidades" },
  { icon: <Workflow size={20} />, t: "Arquitetura e fluxo do usuário" },
  { icon: <FileText size={20} />, t: "Estrutura de telas e banco de dados" },
  { icon: <Wand2 size={20} />, t: "Prompt mestre pronto para construir" },
];

const entregas = [
  { t: "Diagnóstico da ideia", d: "Análise do potencial, público e formato ideal." },
  { t: "MVP enxuto", d: "Até 5 funcionalidades essenciais para validar rápido." },
  { t: "Estrutura do app", d: "Telas, fluxos, modelo de dados e stack recomendada." },
  { t: "Monetização", d: "Modelo de receita aplicável ao seu app." },
  { t: "Prompt mestre", d: "Comando pronto para colar em Lovable, Cursor, Claude ou Gemini." },
];

const passos = [
  { n: "01", t: "Você descreve sua ideia" },
  { n: "02", t: "A IA analisa o potencial" },
  { n: "03", t: "O sistema define o MVP" },
  { n: "04", t: "Você recebe o plano completo" },
  { n: "05", t: "Você usa o prompt para construir" },
];

const naoIncluso = [
  "Desenvolvimento feito por humanos",
  "Publicação nas lojas de aplicativos",
  "Design personalizado sob demanda",
  "Garantia de faturamento automático",
  "Substituição da validação com usuários reais",
];

const faqs = [
  { q: "Preciso saber programar?", a: "Não. A Fábrica de Apps com IA foi feita para quem não programa e quer usar ferramentas como Lovable, Cursor, Claude Code, Gemini ou Replit." },
  { q: "Recebo um app pronto?", a: "Não. Você recebe o plano completo do app: diagnóstico, MVP, arquitetura, fluxo, telas, banco, monetização e o prompt mestre para construir com IA." },
  { q: "Posso usar com Lovable ou Cursor?", a: "Sim. O prompt mestre foi pensado para funcionar em Lovable, Cursor, Claude Code, Gemini, Replit e ferramentas similares." },
  { q: "Funciona para qualquer tipo de app?", a: "Sim. Serve para SaaS, apps simples, ferramentas com IA, produtos digitais, marketplaces básicos e soluções para clientes." },
  { q: "O pagamento é único?", a: "Sim. R$47 de pagamento único. Sem mensalidade, sem cobrança recorrente." },
  { q: "Posso usar para mais de uma ideia?", a: "Sim. Você pode rodar o agente quantas vezes quiser, para quantas ideias quiser." },
  { q: "Preciso ter conta no ChatGPT?", a: "Sim. Para usar o Agente Arquiteto Supremo, você precisa estar logado em uma conta ChatGPT. O produto não inclui conta paga do ChatGPT nem assinatura de ferramentas externas." },
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
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-accent">Fábrica de Apps com IA</span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-[1.05] text-gradient">
              Transforme sua ideia em um plano de app pronto para construir com IA
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Diagnóstico, MVP, arquitetura, fluxo, telas, banco de dados, monetização e prompt mestre. Tudo em um único acesso por R$47.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="btn-primary" onClick={goFabrica}>
                Quero meu plano de app por R$47 <ChevronRight size={18} />
              </button>
              <a href="#entrega" className="btn-ghost">Ver exemplo de entrega</a>
            </div>
            <p className="text-sm text-muted-foreground/80">
              Você não precisa saber programar. Use o plano em Lovable, Cursor, Claude, Gemini ou Replit.
            </p>
          </div>
          <div className="order-first lg:order-last">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* DOR */}
      <Section
        eyebrow="Por que você trava"
        title="Você tem a ideia. O que falta é o plano."
        subtitle="A maioria das ideias morre porque não vira execução. Você não sabe:"
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

      {/* PROMESSA */}
      <Section
        eyebrow="A solução"
        title="A Fábrica de Apps com IA transforma sua ideia em um plano executável"
        subtitle="Você descreve a ideia. O agente entrega tudo o que você precisa para construir com IA."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {promessa.map((p) => (
            <GlassCard key={p.t} className="flex items-start gap-3">
              <div className="text-accent shrink-0 mt-1">{p.icon}</div>
              <p className="text-base text-foreground/90">{p.t}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* O QUE VOCÊ RECEBE */}
      <Section
        id="entrega"
        eyebrow="O que você recebe"
        title="5 entregas para sair da ideia e chegar no plano"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {entregas.map((e, i) => (
            <GlassCard key={e.t}>
              <div className="text-3xl font-heading font-bold text-gold mb-2">0{i + 1}</div>
              <p className="font-semibold text-base mb-1">{e.t}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{e.d}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* COMO FUNCIONA */}
      <Section eyebrow="Como funciona" title="Em 5 passos simples">
        <div className="grid md:grid-cols-5 gap-4">
          {passos.map((p) => (
            <GlassCard key={p.n} className="text-center">
              <div className="text-3xl font-heading font-bold text-gold mb-2">{p.n}</div>
              <p className="text-base text-foreground/90">{p.t}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* PREÇO */}
      <Section
        eyebrow="Preço único"
        title="Acesso completo por R$47"
        subtitle="Pagamento único. Sem mensalidade. Ideal para validar sua ideia antes de gastar com desenvolvimento."
      >
        <div className="max-w-md mx-auto">
          <PricingCard plan={fabrica} />
          <button className="btn-primary mx-auto mt-6" onClick={goFabrica}>
            Quero meu plano de app por R$47 <ChevronRight size={18} />
          </button>
          <p className="text-xs md:text-sm text-muted-foreground/90 leading-relaxed mt-4 text-center">
            Para usar o Agente Arquiteto Supremo, você precisa estar logado em uma conta ChatGPT. O produto não inclui conta paga do ChatGPT.
          </p>
        </div>
      </Section>

      {/* O QUE NÃO ESTÁ INCLUSO */}
      <Section eyebrow="Importante" title="O que não está incluso">
        <div className="glass-strong p-6 md:p-10 max-w-3xl mx-auto">
          <ul className="space-y-3">
            {naoIncluso.map((item) => (
              <li key={item} className="flex gap-3 text-base text-foreground/90 leading-relaxed">
                <span className="text-destructive/80 shrink-0 mt-1">✕</span>{item}
              </li>
            ))}
          </ul>
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
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transforme sua ideia em um plano claro, simples e pronto para construir com IA.
          </p>
          <button className="btn-primary mx-auto" onClick={goFabrica}>
            Quero acessar por R$47 <ChevronRight size={18} />
          </button>
          <p className="text-sm text-muted-foreground/80 mt-4">
            Pagamento único. Sem mensalidade.
          </p>
        </div>
      </Section>
    </>
  );
}

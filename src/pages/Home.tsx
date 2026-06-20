import { useNavigate } from "react-router-dom";
import {
  Sparkles, Layers, Database, DollarSign, Rocket, Brain, Target, ChevronRight,
  FileText, Workflow, Wand2, Megaphone, LineChart, ListChecks, Image as ImageIcon,
  Calendar, Lightbulb, Palette, Code2, Check,
} from "lucide-react";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { HeroVisual } from "@/components/HeroVisual";
import { FAQItem } from "@/components/FAQItem";

const planoExecutavel = [
  { icon: <Brain size={20} />, t: "Diagnóstico da ideia" },
  { icon: <Layers size={20} />, t: "MVP enxuto" },
  { icon: <Workflow size={20} />, t: "Arquitetura do app" },
  { icon: <Database size={20} />, t: "Banco de dados e telas" },
  { icon: <Wand2 size={20} />, t: "Prompts para IA" },
  { icon: <Megaphone size={20} />, t: "Campanha de lançamento" },
  { icon: <LineChart size={20} />, t: "Métricas para validar" },
];

const entregasFinais = [
  "Diagnóstico estratégico da ideia",
  "MVP com no máximo 5 funcionalidades",
  "Arquitetura do aplicativo",
  "Fluxo do usuário",
  "Stack recomendada",
  "Modelo de banco de dados",
  "Estrutura de páginas",
  "Design recomendado",
  "Plano de monetização",
  "Plano de lançamento",
  "Prompt mestre para Lovable, Cursor, Claude Code, Gemini, Replit, Supabase, Firebase, Vercel ou Netlify",
  "Campanha pronta para divulgar",
  "Métricas para acompanhar",
];

const centralVendas = [
  { icon: <Target size={20} />, t: "Diagnóstico da campanha" },
  { icon: <Wand2 size={20} />, t: "Gerador de campanha" },
  { icon: <Lightbulb size={20} />, t: "Campanhas prontas" },
  { icon: <ImageIcon size={20} />, t: "Criativos e textos" },
  { icon: <Calendar size={20} />, t: "Plano de 7 dias" },
  { icon: <LineChart size={20} />, t: "Calculadora de métricas" },
  { icon: <Sparkles size={20} />, t: "Melhorias sugeridas" },
  { icon: <Megaphone size={20} />, t: "Campanha pronta para copiar" },
];

const mockups = [
  { icon: <Brain size={22} />, t: "Diagnóstico do app", d: "Análise do potencial, público e formato ideal da sua ideia." },
  { icon: <Wand2 size={22} />, t: "Prompt mestre", d: "Comando completo para colar em Lovable, Cursor, Claude ou Gemini." },
  { icon: <Megaphone size={22} />, t: "Central de Vendas", d: "Sete módulos para criar uma campanha sem travar." },
  { icon: <Rocket size={22} />, t: "Campanha pronta", d: "Texto, criativo, oferta e canal — tudo consolidado pra publicar." },
  { icon: <LineChart size={22} />, t: "Calculadora de métricas", d: "CPC, CPA, ROAS e diagnóstico automático do resultado." },
  { icon: <ListChecks size={22} />, t: "Checklist de progresso", d: "Acompanhe a execução etapa por etapa, salvo no seu acesso." },
];

const beneficios = [
  "Análise da ideia", "MVP enxuto", "Arquitetura do app", "Banco de dados",
  "Telas e fluxo do usuário", "Monetização", "Plano de lançamento",
  "Prompt mestre para construir", "Central de Vendas e Aquisição",
  "Campanhas e criativos", "Métricas de validação", "Checklist de execução",
];

const naoIncluso = [
  "Não desenvolvemos o app por você",
  "Não prometemos venda nem resultado garantido",
  "Não substitui validação com usuários reais",
  "Não inclui tráfego pago ou gestão de anúncios",
  "Não inclui suporte individual ilimitado",
];

const dores = [
  "Não saber por onde começar",
  "Copiar prompt genérico e receber app quebrado",
  "Ter tela bonita, mas sem login, banco, segurança ou venda",
  "Medo de publicar e o primeiro usuário encontrar erro",
  "Medo de alguém acessar área paga sem permissão",
  "Medo de gastar créditos sem chegar em um app funcional",
];

const paraQuemE = [
  "Pessoas empreendedoras com uma ideia para tirar do papel",
  "Criadores de conteúdo que querem transformar audiência em produto",
  "Terapeutas, mentores e profissionais digitais",
  "Prestadores de serviço e pequenos negócios",
  "Infoprodutores que querem um app próprio",
  "Iniciantes que querem criar sem depender de programação",
];

const naoEParaQuem = [
  "Quem quer promessa de dinheiro fácil",
  "Quem quer app pronto sem pensar nem revisar",
  "Quem espera resultado garantido",
  "Quem quer pular segurança, teste e revisão",
];

const faqs = [
  { q: "Eu recebo só um plano ou também prompts?", a: "Você recebe o plano completo do app E os prompts prontos: prompt mestre para construir, prompts de landing, checkout, monetização e lançamento — além da Central de Vendas e Aquisição." },
  { q: "Isso serve para quem vai usar Lovable ou Cursor?", a: "Sim. O prompt mestre foi escrito para funcionar em Lovable, Cursor, Claude Code, Gemini, Replit e ferramentas similares com Supabase, Firebase, Vercel ou Netlify." },
  { q: "O programa me ajuda a lançar a ideia?", a: "Sim. Além do plano técnico, você tem o plano de lançamento e a Central de Vendas, com campanhas prontas, criativos, plano de 7 dias e calculadora de métricas." },
  { q: "A Central de Vendas está inclusa?", a: "Sim. Está inclusa no mesmo acesso, sem custo adicional." },
  { q: "O pagamento é único?", a: "Sim. R$47 de pagamento único, sem mensalidade nem cobrança recorrente. O acesso à área do aluno é liberado após a confirmação do pagamento." },
  { q: "Preciso saber programar?", a: "Não. A Fábrica foi feita para quem não programa e quer usar IA para tirar a ideia do papel." },
  { q: "Recebo um app pronto?", a: "Não. Você recebe o plano executável e os prompts. Quem constrói o app é você, com a IA da sua preferência." },
  { q: "Preciso ter conta no ChatGPT?", a: "Sim, para usar o Agente Arquiteto Supremo. O produto não inclui assinatura de ChatGPT nem de outras ferramentas externas." },
];

export default function Home() {
  const navigate = useNavigate();
  const goCheckout = () => navigate("/checkout?plano=fabrica");

  return (
    <>
      {/* HERO */}
      <section className="relative pt-12 md:pt-20 pb-16">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-accent">Fábrica de Apps com IA</span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-[1.05] text-gradient">
              Tire sua ideia do papel com um plano de app, prompts prontos e campanha de lançamento
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              A Fábrica de Apps com IA transforma sua ideia em diagnóstico, MVP, arquitetura, banco de dados, telas, monetização, prompts para IA e campanha pronta para divulgar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="btn-primary" onClick={goCheckout}>
                Quero criar meu plano por R$47 <ChevronRight size={18} />
              </button>
              <a href="#incluso" className="btn-ghost">Ver o que está incluso</a>
            </div>
            <p className="text-sm text-muted-foreground/80">
              Sem precisar programar. Use o plano em Lovable, Cursor, Claude, Gemini ou Replit.
            </p>
          </div>
          <div className="order-first lg:order-last">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* PLANO EXECUTÁVEL */}
      <Section
        eyebrow="Mais do que um PDF"
        title="Você não recebe só um PDF. Você recebe um plano executável."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {planoExecutavel.map((p) => (
            <GlassCard key={p.t} className="flex items-start gap-3">
              <div className="text-accent shrink-0 mt-1">{p.icon}</div>
              <p className="text-base text-foreground/90">{p.t}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* ENTREGAS FINAIS */}
      <Section
        id="incluso"
        eyebrow="Entrega completa"
        title="No final, você sai com isso pronto"
        subtitle="Tudo organizado, em um único acesso, pronto pra colar nas ferramentas que você já usa."
      >
        <div className="max-w-4xl mx-auto glass-strong p-6 md:p-10">
          <ul className="grid md:grid-cols-2 gap-3">
            {entregasFinais.map((e) => (
              <li key={e} className="flex items-start gap-3 text-base text-foreground/90">
                <Check size={18} className="text-accent shrink-0 mt-1" />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* CENTRAL DE VENDAS */}
      <Section
        eyebrow="Central de Vendas e Aquisição"
        title="Depois do plano, você também prepara a venda"
        subtitle="Use a Central de Vendas e Aquisição para transformar sua ideia em uma campanha simples, copiável e mensurável."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {centralVendas.map((c) => (
            <GlassCard key={c.t} className="flex items-start gap-3">
              <div className="text-accent shrink-0 mt-1">{c.icon}</div>
              <p className="text-base text-foreground/90">{c.t}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* MOCKUPS / DENTRO DO PRODUTO */}
      <Section
        eyebrow="Por dentro do produto"
        title="Veja o que você encontra por dentro"
        subtitle="Uma jornada guiada da ideia ao lançamento, com checklists e blocos prontos pra copiar."
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockups.map((m) => (
            <GlassCard key={m.t} className="space-y-4">
              {/* Mockup visual */}
              <div className="rounded-lg border border-border/60 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4 h-36 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="text-accent">{m.icon}</div>
                  <div className="h-2 w-24 rounded bg-foreground/20" />
                </div>
                <div className="space-y-1.5 mt-1">
                  <div className="h-1.5 w-full rounded bg-foreground/15" />
                  <div className="h-1.5 w-5/6 rounded bg-foreground/15" />
                  <div className="h-1.5 w-4/6 rounded bg-foreground/10" />
                </div>
                <div className="mt-auto flex gap-1.5">
                  <div className="h-5 w-16 rounded bg-primary/40" />
                  <div className="h-5 w-12 rounded bg-accent/30" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-base mb-1">{m.t}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.d}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* PREÇO */}
      <Section
        eyebrow="Oferta de lançamento"
        title="Acesso completo por R$47"
        subtitle="Pagamento único. Acesso liberado após confirmação. Sem mensalidade."
      >
        <div className="max-w-2xl mx-auto glass-strong p-8 md:p-10 neon-shadow">
          <div className="text-center mb-6">
            <div className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-gradient">R$47</div>
            <p className="text-sm text-muted-foreground mt-2">Pagamento único · Acesso liberado após confirmação</p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-2.5 mb-8">
            {beneficios.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm md:text-base text-foreground/90">
                <Check size={16} className="text-accent shrink-0 mt-1" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <button className="btn-primary mx-auto" onClick={goCheckout}>
            Acessar agora por R$47 <ChevronRight size={18} />
          </button>
          <p className="text-xs md:text-sm text-muted-foreground/80 mt-4 text-center">
            Preço de lançamento enquanto o produto está em fase inicial.
          </p>
        </div>
      </Section>

      {/* NÃO INCLUSO */}
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
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-gradient mb-4">
            Da ideia ao lançamento, no mesmo acesso
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Plano, prompts e campanha — tudo pronto pra você executar com IA.
          </p>
          <button className="btn-primary mx-auto" onClick={goCheckout}>
            Garantir acesso por R$47 <ChevronRight size={18} />
          </button>
          <p className="text-sm text-muted-foreground/80 mt-4">
            Pagamento único. Sem mensalidade.
          </p>
        </div>
      </Section>
    </>
  );
}

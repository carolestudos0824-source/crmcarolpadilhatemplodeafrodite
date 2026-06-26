import { useNavigate } from "react-router-dom";
import {
  Sparkles, Layers, Database, Rocket, Brain, Target, ChevronRight,
  Workflow, Wand2, Megaphone, LineChart, ListChecks, Image as ImageIcon,
  Lightbulb, Check, ShieldCheck, PlayCircle,
} from "lucide-react";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { HeroVisual } from "@/components/HeroVisual";
import { FAQItem } from "@/components/FAQItem";

const planoExecutavel = [
  { icon: <Brain size={20} />, t: "Diagnóstico da ideia" },
  { icon: <Layers size={20} />, t: "MVP enxuto, sem app inchado" },
  { icon: <Workflow size={20} />, t: "Telas e fluxo na ordem certa" },
  { icon: <Database size={20} />, t: "Login, banco e área paga" },
  { icon: <Wand2 size={20} />, t: "Prompts por etapa para o Lovable" },
  { icon: <ShieldCheck size={20} />, t: "Revisão antes de corrigir" },
  { icon: <ListChecks size={20} />, t: "Checklist e próximo passo" },
  { icon: <Lightbulb size={20} />, t: "30 ideias de aplicativos" },
];

const entregasFinais = [
  "Clareza para sair da ideia e começar a construir no Lovable",
  "Estrutura do seu MVP definida antes de pedir tudo de uma vez",
  "Telas principais e fluxo do usuário organizados em ordem",
  "Plano de login, banco e área paga com prompts prontos",
  "Caminho de monetização, checkout e entrega estruturado",
  "30 ideias de aplicativos para você não começar do zero",
  "Prompts por etapa para colar direto no Lovable",
  "Checklists para avançar sem quebrar o que já funciona",
  "Próximo comando recomendado em cada módulo",
  "Auditoria de melhorias para apps já existentes",
];

const centralVendas = [
  { icon: <Target size={20} />, t: "Definição de oferta" },
  { icon: <Wand2 size={20} />, t: "Página de venda" },
  { icon: <Lightbulb size={20} />, t: "Checkout e entrega" },
  { icon: <ImageIcon size={20} />, t: "Área paga estruturada" },
  { icon: <LineChart size={20} />, t: "Métricas para acompanhar" },
  { icon: <Megaphone size={20} />, t: "Comunicação de valor" },
  { icon: <Sparkles size={20} />, t: "Preparação para publicar" },
  { icon: <ListChecks size={20} />, t: "Checklist antes do lançamento" },
];

const mockups = [
  { icon: <Brain size={22} />, t: "Ideia e MVP", d: "Estruture ideia, público, dor e promessa antes de mandar o Lovable construir." },
  { icon: <Lightbulb size={22} />, t: "30 ideias de aplicativos", d: "Inspire-se em 30 modelos de apps simples — agendamento, checklist, catálogo, área de membros e mais." },
  { icon: <Wand2 size={22} />, t: "Prompts para Lovable", d: "Comandos por etapa, com objetivo claro e o que testar depois de cada prompt." },
  { icon: <Workflow size={22} />, t: "Telas e fluxo", d: "Mapeie telas principais e fluxo do usuário em ordem de construção." },
  { icon: <Database size={22} />, t: "Login e banco", d: "Planeje auth, banco e permissões com prompts revisados antes de aplicar." },
  { icon: <Layers size={22} />, t: "Área paga e Admin", d: "Estruture área interna e painel administrativo do seu app sem improviso." },
  { icon: <ShieldCheck size={22} />, t: "Segurança básica", d: "Revise riscos comuns, RLS e pontos sensíveis antes de publicar." },
  { icon: <Rocket size={22} />, t: "Checkout e entrega", d: "Conecte oferta, checkout manual e entrega do acesso sem quebrar o fluxo." },
  { icon: <Megaphone size={22} />, t: "Página de venda", d: "Estruture a comunicação de valor da sua oferta com etapas claras." },
  { icon: <ListChecks size={22} />, t: "Correção de erros", d: "Audite o app, identifique o que quebrou e evolua por versões pequenas." },
  { icon: <LineChart size={22} />, t: "Checklist final", d: "Revise tudo antes de publicar: login, banco, checkout, segurança e copy." },
  { icon: <Sparkles size={22} />, t: "Estado atual do projeto", d: "Veja contexto, progresso e próximo passo recomendado em cada módulo." },
];

const beneficios = [
  "Programa completo",
  "Método guiado passo a passo",
  "Prompts por etapa para o Lovable",
  "Checklists de avanço em cada módulo",
  "30 ideias de aplicativos",
  "Área interna organizada",
  "Próximo passo recomendado",
  "Jornada para começar do zero",
  "Jornada para construir por versões",
  "Jornada para auditar app existente",
];

const naoIncluso = [
  "Créditos do Lovable não inclusos",
  "Conta ou plano pago do Lovable não inclusos",
  "Domínio próprio não incluso",
  "Hospedagem e ferramentas externas não inclusas",
  "App feito por mim ou desenvolvimento personalizado não incluso",
  "Mentoria individual não inclusa",
  "Suporte técnico ilimitado não incluso",
  "Garantia de vendas ou faturamento não inclusa",
  "Promessa de app perfeito ou segurança 100% não inclusa",
  "Promessa de criação sem esforço não inclusa",
];

const dores = [
  "Chega de copiar prompts soltos sem saber se está na etapa certa",
  "Chega de tentar corrigir um botão e quebrar outras três telas",
  "Chega de gastar créditos do Lovable em comandos vagos",
  "Chega de começar grande demais antes do MVP funcionar",
  "Chega de se perder entre telas, banco, login, checkout e publicação",
  "Chega de entrar em loop de correções sem chegar em um app funcional",
];

const paraQuemE = [
  "Quem quer criar um app no Lovable e não sabe por onde começar",
  "Quem tem uma ideia, mas trava na hora de transformar em MVP",
  "Quem não sabe programar e quer um caminho guiado",
  "Consultores, mentores, terapeutas e prestadores que querem virar o serviço em app",
  "Criadores e infoprodutores que querem entregar método em formato de aplicativo",
  "Quem quer reduzir tentativa e erro com prompts melhores e ordem clara",
];

const naoEParaQuem = [
  "Quem quer um app pronto sem precisar executar nada",
  "Quem quer garantia de vendas, faturamento ou aprovação",
  "Quem espera suporte individual ilimitado",
  "Quem não pretende usar o Lovable",
  "Quem quer criar um app gigante e complexo já na primeira versão",
  "Quem espera que a IA construa tudo sozinha sem decisões suas",
];

const faqs = [
  { q: "Preciso saber programar?", a: "Não. A Fábrica foi criada para pessoas não técnicas organizarem a construção e gerarem comandos melhores para o Lovable." },
  { q: "Preciso ter conta no Lovable?", a: "Sim. O programa orienta a criação no Lovable, então você precisa ter sua própria conta na plataforma." },
  { q: "O Lovable está incluso no preço?", a: "Não. O Lovable é uma plataforma externa, com plano e regras próprias. Você usa sua conta separadamente." },
  { q: "Os créditos do Lovable estão inclusos?", a: "Não. Créditos do Lovable são contratados diretamente com o Lovable. A Fábrica ajuda a usar melhor o que você tem, mas não fornece créditos." },
  { q: "O programa cria o app por mim?", a: "Não. A Fábrica guia, organiza, gera prompts e mostra o próximo passo. A construção é feita por você dentro do Lovable." },
  { q: "Serve para qualquer tipo de app?", a: "Serve para vários tipos de MVPs e aplicativos simples — agendamento, checklist, área de membros, catálogo, conteúdo pago e similares. Não promete que qualquer app complexo será criado facilmente." },
  { q: "O que são as 30 ideias de aplicativos?", a: "São 30 modelos de aplicativos prontos para inspirar o seu projeto, com formato, público e estrutura sugerida, para você não começar do zero." },
  { q: "Vou sair com o app pronto?", a: "Você sai com clareza, estrutura do MVP, prompts e próximos passos para construir no Lovable. O ritmo da construção depende da sua execução." },
  { q: "É curso, mentoria ou prompt pack?", a: "É um programa completo com método guiado, área interna, prompts por etapa, checklists e 30 ideias. Não é só PDF, não é prompt pack solto e não é mentoria individual." },
  { q: "Tem suporte?", a: "Existe canal de suporte para dúvidas sobre o uso da plataforma. Não é suporte técnico ilimitado nem desenvolvimento sob demanda." },
  { q: "Tem garantia?", a: "Sim. Você tem 7 dias para acessar, conhecer o programa por dentro e solicitar reembolso se perceber que não é para você." },
  { q: "Como recebo acesso depois da compra?", a: "Após a confirmação do pagamento, o acesso à área interna é liberado para o e-mail informado no checkout." },
];

export default function Home() {
  const navigate = useNavigate();
  const goCheckout = () => navigate("/checkout?plano=fabrica");

  return (
    <>
      {/* HERO — cubo preservado integralmente */}
      <section className="relative pt-12 md:pt-20 pb-16">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-accent">Fábrica de Apps com IA</span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-[1.05] text-gradient">
              Da ideia ao app no Lovable: um programa completo para construir com IA, mesmo sem saber programar
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              A Fábrica de Apps com IA te guia da ideia ao MVP com método passo a passo, prompts por etapa, checklists e 30 ideias de aplicativos para você construir no Lovable com mais clareza e menos tentativa e erro.
            </p>
            <p className="text-sm text-accent/90 italic max-w-xl">
              Criado no Lovable usando o mesmo método que você vai acessar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="btn-primary" onClick={goCheckout}>
                Quero acessar o programa por R$197 <ChevronRight size={18} />
              </button>
              <a href="#incluso" className="btn-ghost">Ver o que está incluso</a>
            </div>
            <p className="text-sm text-muted-foreground/80">
              Programa completo · Pagamento único de R$197 · Sem mensalidade · Garantia de 7 dias.
            </p>
          </div>
          <div className="order-first lg:order-last">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ARQUITETO vs PEDREIRO */}
      <Section
        eyebrow="Por que a Fábrica existe"
        title="O Lovable é o pedreiro. A Fábrica é o arquiteto."
      >
        <div className="max-w-3xl mx-auto glass-strong p-6 md:p-10 space-y-4">
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            O Lovable <span className="text-accent">executa</span>. A Fábrica <span className="text-accent">orienta o que pedir</span>. Sem planta clara, o Lovable pode criar telas fora de ordem, banco confuso, fluxos quebrados e funcionalidades demais — consumindo seus créditos e seu tempo.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Com a Fábrica você aprende <span className="text-accent">o que pedir, em qual ordem construir e o que evitar</span>, reduzindo o risco de escopo gigante, app quebrado ou prompts soltos sem objetivo.
          </p>
        </div>
      </Section>

      {/* DOR */}
      <Section
        eyebrow="A dor real"
        title="Você não precisa de mais prompts soltos"
        subtitle="A Fábrica não é um prompt pack avulso. Os prompts estão dentro de uma sequência: cada etapa tem objetivo, você sabe qual prompt usar, quando usar e o que testar depois."
      >
        <div className="max-w-3xl mx-auto glass-strong p-6 md:p-10">
          <ul className="grid sm:grid-cols-2 gap-3">
            {dores.map((d) => (
              <li key={d} className="flex items-start gap-3 text-base text-foreground/90">
                <span className="text-destructive/80 shrink-0 mt-1">•</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* PLANO EXECUTÁVEL */}
      <Section
        eyebrow="Mais do que um PDF"
        title="Você não recebe só um PDF. Você acessa um programa completo."
        subtitle="Área interna organizada, método passo a passo, prompts por etapa, checklists, próximos comandos, orientação de MVP e preparação para venda e validação — tudo em um único acesso."
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

      {/* 30 IDEIAS */}
      <Section
        eyebrow="Inspiração inclusa"
        title="30 ideias de aplicativos para você não começar do zero"
        subtitle="O programa inclui 30 modelos de apps simples para inspirar seu projeto — vários tipos de MVPs prontos para adaptar ao seu serviço, método, conteúdo ou produto digital."
      >
        <div className="max-w-4xl mx-auto glass-strong p-6 md:p-10">
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              "App de agendamento",
              "App de diagnóstico",
              "App de checklist",
              "App de área de membros",
              "App de catálogo",
              "App de acompanhamento de clientes",
              "App de conteúdo pago",
              "App de calculadora",
              "App de comunidade simples",
              "App de entrega de método",
              "App para mentoria ou terapia",
              "App para consultoria ou serviço",
            ].map((i) => (
              <li key={i} className="flex items-start gap-2 text-sm md:text-base text-foreground/90">
                <Lightbulb size={16} className="text-accent shrink-0 mt-1" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground/80 mt-6 text-center">
            E mais ideias prontas para servir de ponto de partida — focadas em vários tipos de MVPs e aplicativos simples.
          </p>
        </div>
      </Section>

      {/* ENTREGAS FINAIS */}
      <Section
        id="incluso"
        eyebrow="O que você terá ao final"
        title="No final, você sai com isso pronto"
        subtitle="Sem promessa de app perfeito, sem garantia de venda. O que você ganha é caminho claro para sair da ideia e avançar no Lovable."
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

      {/* DEPOIS DO PLANO — VENDA */}
      <Section
        eyebrow="Depois da construção"
        title="Depois do plano, você também prepara a venda"
        subtitle="Estruture oferta, página de venda, checkout, entrega, área paga e comunicação de valor — com etapas claras e sem prometer resultado garantido."
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

      {/* MÓDULOS */}
      <Section
        eyebrow="Por dentro do programa"
        title="Veja o que você encontra por dentro"
        subtitle="Módulos práticos por etapa, com contexto do projeto em foco e próximo passo recomendado."
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockups.map((m) => (
            <GlassCard key={m.t} className="space-y-4">
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

      {/* VÍDEO DEMONSTRATIVO — placeholder */}
      <Section
        eyebrow="Demonstração"
        title="Veja a Fábrica funcionando dentro do Lovable"
      >
        <div className="max-w-3xl mx-auto glass-strong p-8 md:p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-4">
            <PlayCircle size={32} className="text-accent" />
          </div>
          <p className="text-base text-foreground/90 leading-relaxed mb-2">
            Em breve, você verá em poucos minutos como a Fábrica transforma contexto, projeto em foco e próximo passo em um prompt pronto para colar no Lovable.
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70 mt-4">
            Vídeo demonstrativo em breve
          </p>
        </div>
      </Section>

      {/* PREÇO */}
      <Section
        eyebrow="Oferta atual"
        title="Acesso completo à Fábrica de Apps com IA"
        subtitle="Programa completo, pagamento único, sem mensalidade. Tudo o que você precisa para sair da ideia e avançar no Lovable."
      >
        <div className="max-w-2xl mx-auto glass-strong p-8 md:p-10 neon-shadow">
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Programa completo</p>
            <div className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-gradient">R$197</div>
            <p className="text-base text-foreground/90 mt-2 font-medium">pagamento único</p>
            <p className="text-sm text-muted-foreground mt-1">ou 12x de R$19,70</p>
            <p className="text-xs text-muted-foreground/80 mt-3">Acesso liberado após confirmação do pagamento</p>
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
            Quero acessar o programa por R$197 <ChevronRight size={18} />
          </button>
          <div className="mt-6 pt-6 border-t border-white/5 flex items-start gap-3">
            <ShieldCheck size={20} className="text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/90 leading-relaxed">
              <span className="font-semibold">Garantia de 7 dias:</span> entre, veja o programa por dentro e, se perceber que ele não é para você, solicite o reembolso dentro do prazo.
            </p>
          </div>
        </div>
      </Section>

      {/* PARA QUEM É / NÃO É */}
      <Section eyebrow="Audiência" title="Para quem é e para quem não é">
        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          <div className="glass-strong p-6 md:p-8">
            <h3 className="font-heading font-bold text-xl mb-4">Para quem é</h3>
            <ul className="space-y-3">
              {paraQuemE.map((item) => (
                <li key={item} className="flex gap-3 text-base text-foreground/90 leading-relaxed">
                  <Check size={18} className="text-accent shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-strong p-6 md:p-8">
            <h3 className="font-heading font-bold text-xl mb-4">Não é para quem</h3>
            <ul className="space-y-3">
              {naoEParaQuem.map((item) => (
                <li key={item} className="flex gap-3 text-base text-foreground/90 leading-relaxed">
                  <span className="text-destructive/80 shrink-0 mt-1">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
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
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-gradient mb-4">
            Da ideia ao Lovable, com a planta pronta
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Programa completo, método guiado, prompts por etapa, checklists e 30 ideias de aplicativos.
          </p>
          <button className="btn-primary mx-auto" onClick={goCheckout}>
            Quero acessar o programa por R$197 <ChevronRight size={18} />
          </button>
          <p className="text-sm text-muted-foreground/80 mt-4">
            R$197 pagamento único · sem mensalidade · garantia de 7 dias.
          </p>
        </div>
      </Section>
    </>
  );
}

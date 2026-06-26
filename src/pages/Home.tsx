import { useNavigate } from "react-router-dom";
import {
  Sparkles, Layers, Database, Brain, Target, ChevronRight,
  Workflow, Wand2, Megaphone, LineChart, ListChecks, Image as ImageIcon,
  Lightbulb, Check, ShieldCheck, PlayCircle, Bot,
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


const beneficios = [
  "Programa completo, pagamento único",
  "Método guiado passo a passo",
  "30 ideias de aplicativos",
  "Prompts por etapa para o Lovable",
  "Checklists de MVP em cada módulo",
  "Agente Arquiteto via ChatGPT",
  "Área interna organizada",
  "Módulos de construção, correção, segurança e venda",
  "Próximo passo recomendado em cada etapa",
  "Garantia de 7 dias",
];

const naoIncluso = [
  "Conta, plano e créditos do Lovable não inclusos",
  "Conta, plano e limites do ChatGPT não inclusos",
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
  { q: "O que é o Agente Arquiteto?", a: "É um agente treinado, acessado por um botão dentro da área interna, que abre no ChatGPT. Ele ajuda você a planejar o app, definir MVP, organizar telas, melhorar prompts, corrigir erros, revisar segurança básica e decidir os próximos passos antes de pedir ao Lovable." },
  { q: "Ele cria o app por mim?", a: "Não. O Agente Arquiteto orienta, organiza e revisa. A construção do app continua sendo feita por você dentro do Lovable. Ele não substitui o Lovable nem garante app perfeito ou segurança 100%." },
  { q: "Preciso ter conta no ChatGPT?", a: "Sim. O Agente Arquiteto abre dentro do ChatGPT, então você precisa ter sua própria conta. O uso do ChatGPT e do Lovable pode depender da sua própria conta, plano ou limites dessas plataformas externas." },
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
              A Fábrica de Apps com IA te guia da ideia ao MVP com método passo a passo, 30 ideias de aplicativos, prompts por etapa e checklists. E quando você travar, conta com um Agente Arquiteto via ChatGPT para ajudar a pensar o próximo comando antes de usar no Lovable.
            </p>
            <p className="text-sm text-accent/90 italic max-w-xl">
              A própria Fábrica de Apps com IA foi construída no Lovable seguindo a lógica que o programa ensina: planejar, pedir, revisar, corrigir e avançar por etapas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="btn-primary" onClick={goCheckout}>
                Quero acessar o programa por R$197 <ChevronRight size={18} />
              </button>
              <button onClick={goCheckout} className="btn-ghost">Quero parar de gastar créditos no escuro</button>
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

      {/* 4 PILARES — faixa rápida */}
      <section className="pb-8">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: <Lightbulb size={20} />, t: "30 ideias de aplicativos" },
              { icon: <Wand2 size={20} />, t: "Prompts por etapa" },
              { icon: <ListChecks size={20} />, t: "Checklists de MVP" },
              { icon: <Bot size={20} />, t: "Agente Arquiteto via ChatGPT" },
            ].map((p) => (
              <div key={p.t} className="glass flex items-center gap-3 px-4 py-3 border-accent/20">
                <span className="text-accent shrink-0">{p.icon}</span>
                <span className="text-sm md:text-base font-medium text-foreground/90">{p.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAIXA FINANCEIRA — economia de créditos */}
      <section className="pb-12">
        <div className="container">
          <div className="max-w-4xl mx-auto glass-strong p-6 md:p-8 border-accent/30 neon-shadow">
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed text-center">
              Antes de gastar <span className="text-accent font-semibold">de R$100 a R$500 em créditos</span>, testes e prompts no escuro, entre na Fábrica e siga um método que mostra <span className="text-accent">o que pedir, em qual ordem e o que revisar</span> antes de avançar no Lovable.
            </p>
            <p className="text-xs text-muted-foreground/80 text-center mt-3">
              Sem promessa de economia garantida — o programa ajuda a usar seus créditos com mais intenção e reduzir tentativa e erro.
            </p>
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
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            Quando você pede sem plano, pode gastar créditos construindo, desfazendo e corrigindo. A Fábrica ajuda você a <span className="text-accent">pensar antes de pedir</span>.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            E quando você travar, o <span className="text-accent">Agente Arquiteto via ChatGPT</span> entra como copiloto para te ajudar a transformar dúvida em comando melhor antes de gastar prompt no Lovable.
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

      {/* 5 MOTIVOS PARA ENTRAR */}
      <Section
        eyebrow="Por que vale R$197"
        title="5 motivos para entrar na Fábrica de Apps com IA"
        subtitle="O que torna o programa diferente de prompt pack, PDF avulso ou curso longo para assistir passivamente."
      >
        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {[
            {
              icon: <Target size={22} />,
              t: "1. Método arquiteto",
              d: "O Lovable é o pedreiro: ele executa. A Fábrica é o arquiteto: organiza o que pedir, em qual ordem construir e o que evitar. Resultado: construção mais organizada, com menos retrabalho e mais clareza.",
            },
            {
              icon: <Wand2 size={22} />,
              t: "2. Menos tentativa e erro com seus créditos",
              d: "Muita gente perde créditos do Lovable testando prompts soltos sem ordem. O programa ajuda você a usar seus créditos com mais intenção, evitando pedidos vagos que custam caro e quebram telas.",
            },
            {
              icon: <ListChecks size={22} />,
              t: "3. Plataforma guiada, não curso passivo",
              d: "Não é PDF solto, não é prompt pack jogado, não é curso enorme para assistir. É uma área interna por etapas, com método, prompts por etapa, checklists e próximo passo para você construir um MVP com direção.",
            },
            {
              icon: <ShieldCheck size={22} />,
              t: "4. Prova viva: foi construída no Lovable",
              d: "A própria Fábrica de Apps com IA foi construída no Lovable seguindo a lógica que o programa ensina: planejar, pedir, revisar, corrigir e avançar por etapas. Não é promessa de resultado igual para todo aluno — é prova de que o método é executável.",
            },
            {
              icon: <Bot size={22} />,
              t: "5. Agente Arquiteto via ChatGPT",
              d: "Acessado pela área interna, abre direto no ChatGPT e ajuda a planejar, revisar, corrigir e melhorar comandos antes de usar no Lovable. Não substitui o Lovable, não cria o app sozinho e pode depender da sua conta, plano e limites do ChatGPT.",
            },
          ].map((m) => (
            <GlassCard key={m.t} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0">{m.icon}</span>
                <p className="font-heading font-bold text-lg text-foreground">{m.t}</p>
              </div>
              <p className="text-sm md:text-base text-foreground/90 leading-relaxed">{m.d}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* DIFERENCIAÇÃO — não é PDF, não é curso */}
      <Section
        eyebrow="O que a Fábrica é (e o que não é)"
        title="Não é um PDF. Não é um curso gigante. É uma Fábrica guiada."
        subtitle="Você não precisa de mais conteúdo parado. Você precisa de um caminho claro para saber o que pedir ao Lovable, em qual ordem construir e como revisar antes de avançar."
      >
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { t: "Prompt solto", d: "Te dá uma frase. Sem ordem, sem contexto, sem próximo passo. É fácil gastar créditos testando no escuro.", neg: true },
              { t: "Curso longo", d: "Te dá horas de vídeo para assistir passivamente. Quando termina, ainda falta saber por onde começar de verdade.", neg: true },
              { t: "Fábrica de Apps com IA", d: "Te dá uma sequência de construção: método, prompts por etapa, checklists, 30 ideias, área interna e Agente Arquiteto.", neg: false },
            ].map((c) => (
              <div
                key={c.t}
                className={`glass-strong p-5 md:p-6 space-y-2 ${c.neg ? "opacity-80" : "border-accent/40 neon-shadow"}`}
              >
                <div className="flex items-center gap-2">
                  {c.neg ? (
                    <span className="text-destructive/80 text-lg leading-none">✕</span>
                  ) : (
                    <Check size={18} className="text-accent" />
                  )}
                  <p className="font-heading font-bold text-base md:text-lg">{c.t}</p>
                </div>
                <p className="text-sm md:text-base text-foreground/90 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="glass-strong p-6 md:p-8 space-y-4">
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              Dentro da Fábrica, o programa te ajuda a <span className="text-accent">escolher uma ideia, definir o MVP, montar telas, criar prompts melhores, revisar erros e pensar login, banco, Admin, área paga e checkout</span> — além de preparar venda e validação.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              E quando você travar, o <span className="text-accent">Agente Arquiteto via ChatGPT</span> ajuda a transformar sua dúvida em um comando mais claro antes de mandar para o Lovable.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              Por <span className="font-semibold">R$197</span>, você acessa o programa completo: método, prompts por etapa, checklists, 30 ideias de aplicativos, área interna e Agente Arquiteto.
            </p>
          </div>
        </div>
      </Section>

      {/* CTA INTERMEDIÁRIO — antes das 30 ideias */}
      <section className="pb-12">
        <div className="container-x">
          <div className="max-w-3xl mx-auto glass-strong p-6 md:p-8 text-center neon-shadow">
            <button className="btn-primary mx-auto" onClick={goCheckout}>
              Quero acessar o programa por R$197 <ChevronRight size={18} />
            </button>
            <p className="text-sm text-foreground/80 leading-relaxed mt-4">
              Pagamento único. Método, 30 ideias, prompts, checklists, área interna e Agente Arquiteto via ChatGPT.
            </p>
          </div>
        </div>
      </section>



      {/* 30 IDEIAS */}
      <Section
        eyebrow="Inspiração inclusa"
        title="30 ideias de aplicativos para você não começar do zero"
        subtitle="Você não começa do zero olhando para uma tela em branco. O programa traz 30 ideias de aplicativos simples para inspirar e adaptar ao seu serviço, método, conteúdo ou produto digital — sem prometer que qualquer app complexo será criado facilmente."
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

      {/* AGENTE ARQUITETO */}
      <Section
        eyebrow="Diferencial do programa"
        title="Um Agente Arquiteto treinado para te ajudar quando você travar"
        subtitle="O Agente Arquiteto é acessado dentro da área interna da Fábrica, por um botão que abre direto no ChatGPT. Ele te ajuda a pensar, planejar, revisar e melhorar comandos — antes de gastar prompt no Lovable. Ele não substitui o Lovable e não cria o app sozinho."
      >
        <div className="max-w-4xl mx-auto glass-strong p-6 md:p-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
              <Bot size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
                Ele não substitui o Lovable e não constrói o app sozinho. Ele organiza sua cabeça e melhora o que sai do seu teclado.
              </p>
            </div>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {[
              "Planejar o app com ideia, público e dor",
              "Definir o MVP enxuto",
              "Organizar telas e fluxo do usuário",
              "Melhorar os prompts antes de colar no Lovable",
              "Apoiar na correção de erros e quebras",
              "Revisar pontos básicos de segurança",
              "Decidir os próximos passos no Lovable",
              "Evitar pedidos vagos que gastam crédito à toa",
            ].map((i) => (
              <li key={i} className="flex items-start gap-2 text-sm md:text-base text-foreground/90">
                <Check size={16} className="text-accent shrink-0 mt-1" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground/80 mt-6">
            O Agente Arquiteto abre no ChatGPT. O uso do ChatGPT e do Lovable pode depender da sua própria conta, plano ou limites dessas plataformas externas.
          </p>
        </div>
      </Section>

      {/* PREÇO — antecipado logo após o Agente Arquiteto */}
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
          <p className="text-sm text-foreground/80 leading-relaxed text-center mt-4">
            O acesso ao programa custa <span className="font-semibold">R$197 em pagamento único</span> — menos do que muita gente pode acabar gastando tentando prompts soltos sem método.
          </p>
          <div className="mt-6 pt-6 border-t border-white/5 flex items-start gap-3">
            <ShieldCheck size={20} className="text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/90 leading-relaxed">
              <span className="font-semibold">Garantia de 7 dias:</span> entre, veja o programa por dentro e, se perceber que ele não é para você, solicite o reembolso dentro do prazo.
            </p>
          </div>
        </div>
      </Section>


      {/* ENTREGAS FINAIS */}
      <Section
        id="incluso"
        eyebrow="O que você terá ao final"
        title="Ao seguir o programa, você constrói com mais clareza"
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

      {/* MÓDULOS — 4 blocos agrupados */}
      <Section
        eyebrow="Por dentro do programa"
        title="Tudo organizado em 4 blocos práticos"
        subtitle="Cada bloco reúne os módulos da etapa, com contexto do projeto em foco e próximo passo recomendado."
      >
        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {[
            {
              icon: <Brain size={22} />,
              t: "1. Planejamento do app",
              items: ["Ideia, público e dor", "MVP enxuto", "Telas principais", "Fluxo do usuário", "30 ideias de aplicativos para inspirar"],
            },
            {
              icon: <Database size={22} />,
              t: "2. Construção no Lovable",
              items: ["Prompts por etapa", "Login e autenticação", "Banco de dados", "Área paga e Admin", "Checkout e entrega"],
            },
            {
              icon: <ShieldCheck size={22} />,
              t: "3. Correção e segurança",
              items: ["Correção de erros e quebras", "Revisão por versões", "Noções de RLS", "Rotas e dados sensíveis", "Riscos comuns antes de publicar"],
            },
            {
              icon: <Megaphone size={22} />,
              t: "4. Venda e validação",
              items: ["Estrutura de oferta", "Página de venda", "Preço e checkout", "Comunicação de valor", "Próximos passos para publicar"],
            },
          ].map((b) => (
            <GlassCard key={b.t} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0">{b.icon}</span>
                <p className="font-heading font-bold text-lg text-foreground">{b.t}</p>
              </div>
              <ul className="space-y-2">
                {b.items.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm md:text-base text-foreground/90">
                    <Check size={16} className="text-accent shrink-0 mt-1" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </Section>


      {/* VÍDEO DEMONSTRATIVO — placeholder */}
      <Section
        eyebrow="Prova de realidade"
        title="A própria Fábrica foi construída no Lovable"
      >
        <div className="max-w-3xl mx-auto glass-strong p-8 md:p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-4">
            <PlayCircle size={32} className="text-accent" />
          </div>
          <p className="text-base text-foreground/90 leading-relaxed mb-2">
            Esta página, a área interna e o painel administrativo foram construídos no Lovable seguindo a mesma lógica que o programa ensina: <span className="text-accent">planejar, pedir, revisar, corrigir e avançar por etapas</span>. Não é promessa de que todo aluno terá o mesmo resultado — é a prova de que o método é executável na prática.
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70 mt-4">
            Vídeo demonstrativo em breve
          </p>
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

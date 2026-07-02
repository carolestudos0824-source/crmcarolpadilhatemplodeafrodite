import { useNavigate } from "react-router-dom";
import {
  Sparkles, Layers, Database, Brain, Target, ChevronRight,
  Workflow, Wand2, Megaphone, LineChart, ListChecks, Image as ImageIcon,
  Lightbulb, Check, ShieldCheck, PlayCircle, Bot, Compass, Rocket,
  RefreshCw, MapPin,
} from "lucide-react";
import { Section } from "@/components/Section";
import { JourneyNotification } from "@/components/JourneyNotification";
import { GlassCard } from "@/components/GlassCard";
import { HeroVisual } from "@/components/HeroVisual";
import { FAQItem } from "@/components/FAQItem";
import fabricaDemoVideo from "@/assets/fabrica-demo.mp4.asset.json";
import { trackPixel } from "@/lib/metaPixel";

const entregasFinais = [
  "Clareza para sair da ideia e começar a construir com IA",
  "Estrutura do MVP definida antes de pedir tudo de uma vez",
  "Telas principais e fluxo do usuário organizados em ordem",
  "Plano de login, banco e área paga com prompts prontos",
  "Caminho de monetização, checkout e entrega estruturado",
  "30 ideias de aplicativos para você não começar do zero",
  "Prompts por etapa para colar no Lovable e adaptar a outras IAs",
  "Checklists para avançar sem quebrar o que já funciona",
  "Próximo passo recomendado em cada módulo",
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
  "R$197 por 1 ano de acesso",
  "Método guiado passo a passo",
  "23 módulos guiados · 54 comandos prontos",
  "30 ideias de aplicativos",
  "Prompts prontos para o Lovable (lógica adaptável a outras IAs)",
  "Agente Arquiteto via ChatGPT",
  "GPS do App e contexto do projeto em foco",
  "Módulos de planejamento, construção, segurança, venda e evolução",
  "Próximo passo recomendado em cada etapa",
  "Suporte por e-mail do programa",
  "Garantia de 7 dias · reembolso integral",
];

const naoIncluso = [
  "Conta, plano e créditos do Lovable não inclusos",
  "Conta, plano e limites do ChatGPT não inclusos",
  "Contas, planos e limites de outras ferramentas de IA não inclusos",
  "Domínio próprio, hospedagem e ferramentas externas não inclusos",
  "App feito por mim ou desenvolvimento personalizado não incluso",
  "Mentoria individual não inclusa",
  
  "Garantia de vendas ou faturamento não inclusa",
  "Promessa de app perfeito ou segurança 100% não inclusa",
  "Promessa de compatibilidade automática com qualquer IA não inclusa",
];

const dores = [
  "Chega de copiar prompts soltos sem saber se está na etapa certa",
  "Chega de tentar corrigir um botão e quebrar outras três telas",
  "Chega de gastar créditos de IA em comandos vagos",
  "Chega de começar grande demais antes do MVP funcionar",
  "Chega de se perder entre telas, banco, login, checkout e publicação",
  "Chega de entrar em loop de correções sem chegar em um app funcional",
];

const paraQuemE = [
  "Qualquer pessoa que quer tirar uma ideia de app do papel com ajuda da IA",
  "Quem tem uma ideia, mas trava na hora de transformar em MVP",
  "Quem já tem um app e quer auditar, corrigir, melhorar ou evoluir",
  "Empreendedores, criadores, infoprodutores, mentores, terapeutas, consultores e freelancers",
  "Prestadores de serviço e pequenos negócios que querem virar o serviço em app",
  "Iniciantes em no-code que querem reduzir tentativa e erro com prompts melhores e ordem clara",
];

const naoEParaQuem = [
  "Quem espera que a IA faça tudo sozinha, sem revisar, testar ou tomar decisões",
  "Quem quer garantia de vendas, faturamento ou aprovação",
  
  "Quem não pretende usar nenhuma ferramenta de IA para criar apps",
  "Quem quer um app gigante e complexo já na primeira versão",
  "Quem busca um app pronto entregue por terceiros, sem participar da execução",
];

const faqs = [
  { q: "Preciso saber programar?", a: "Não. A Fábrica foi criada para pessoas não técnicas organizarem a construção e gerarem comandos melhores em ferramentas de criação com IA." },
  { q: "O que é o Agente Arquiteto?", a: "É um agente treinado, acessado por um botão dentro da área interna, que abre no ChatGPT. Ele ajuda você a planejar o app, definir MVP, organizar telas, melhorar prompts, corrigir erros, revisar segurança básica e decidir os próximos passos antes de pedir à ferramenta de criação." },
  { q: "Ele cria o app por mim?", a: "Não. O Agente Arquiteto orienta, organiza e revisa. A construção do app continua sendo feita por você na ferramenta escolhida. Ele não substitui o Lovable nem garante app perfeito ou segurança 100%." },
  { q: "Preciso usar o Lovable?", a: "O método da Fábrica foi criado e testado no Lovable, por isso ele é a ferramenta principal recomendada. A lógica de planejamento, prompts, revisão e evolução pode ser adaptada para outras ferramentas de criação com IA, mas cada uma tem limites e formatos próprios." },
  { q: "Funciona com Replit, Cursor, Claude Code, Bolt, Gemini ou outras IAs?", a: "O método foi criado e testado no Lovable, que é a ferramenta principal recomendada. A lógica de planejamento, prompts, revisão e evolução pode ser adaptada para outras ferramentas de criação com IA, mas cada plataforma tem sintaxe, limites e comportamento próprios. Por isso, não prometemos compatibilidade automática com todas as ferramentas." },
  { q: "Preciso ter conta no ChatGPT?", a: "Sim. O Agente Arquiteto abre dentro do ChatGPT, então você precisa ter sua própria conta. O uso do ChatGPT, do Lovable e de outras IAs pode depender da sua própria conta, plano ou limites dessas plataformas externas." },
  { q: "O Lovable está incluso no preço?", a: "Não. O Lovable é uma plataforma externa, com plano e regras próprias. Você usa sua conta separadamente. Outras ferramentas de IA também são contratadas separadamente." },
  { q: "Os créditos do Lovable estão inclusos?", a: "Não. Créditos do Lovable são contratados diretamente com o Lovable. A Fábrica ajuda a usar melhor o que você tem, mas não fornece créditos." },
  { q: "O programa cria o app por mim?", a: "Não. A Fábrica guia, organiza, gera prompts e mostra o próximo passo. A construção é feita por você dentro da ferramenta escolhida." },
  { q: "Serve para qualquer tipo de app?", a: "Serve para vários tipos de MVPs e aplicativos simples — agendamento, checklist, área de membros, catálogo, conteúdo pago e similares. Não promete que qualquer app complexo será criado facilmente." },
  { q: "Serve só para MVP?", a: "Não. MVP é apenas uma das etapas. A Fábrica também cobre construção por versões, segurança básica, página de venda, monetização, checkout, publicação, testes, validação e evolução do app." },
  { q: "Já tenho um app. Serve para mim?", a: "Sim. Existem módulos para auditar, corrigir, melhorar, publicar, vender, validar e evoluir um app existente — sem precisar começar do zero." },
  { q: "O que são as 30 ideias de aplicativos?", a: "São 30 modelos de aplicativos prontos para inspirar o seu projeto, com formato, público e estrutura sugerida, para você não começar do zero." },
  { q: "Vou sair com o app pronto?", a: "Você sai com clareza, estrutura do MVP, prompts e próximos passos para construir. O ritmo da construção depende da sua execução." },
  { q: "É curso, mentoria ou prompt pack?", a: "É um programa completo com método guiado, área interna, prompts por etapa, checklists e 30 ideias. Não é só PDF, não é prompt pack solto e não é mentoria individual." },
  { q: "Como funciona o avanço pelos módulos?", a: "A Fábrica é um programa-guia entregue por módulos, prompts e checklists. O caminho é autoguiado: você avança pelas etapas, usa os prompts prontos e segue a sequência sugerida dentro da área interna." },
  { q: "Tem garantia?", a: "Sim. Você tem 7 dias para acessar, conhecer o programa por dentro e solicitar reembolso integral se perceber que não é para você." },
  { q: "O programa tem suporte?", a: "Sim. A Fábrica de Apps com IA oferece suporte por e-mail para acesso, login, navegação na área de entrega e uso do programa. O canal oficial é fabricadeappscomia@outlook.com. O suporte não inclui consultoria individual, construção do app pelo participante, revisão ilimitada de projetos, suporte 24h ou suporte técnico de ferramentas externas." },
  { q: "Como recebo acesso depois da compra?", a: "Após a confirmação do pagamento, o acesso à área interna é liberado para o endereço informado no checkout." },
];

const jornadas = [
  {
    icon: <Compass size={22} />,
    t: "Começando do zero",
    d: "Para quem tem uma ideia, quer escolher uma ideia pronta ou precisa organizar o primeiro passo antes de construir.",
  },
  {
    icon: <Rocket size={22} />,
    t: "Quero um app completo",
    d: "Para quem quer construir por versões, com mais clareza, menos retrabalho e sequência lógica de criação.",
  },
  {
    icon: <RefreshCw size={22} />,
    t: "Já tenho um app",
    d: "Para quem quer auditar, corrigir, melhorar, publicar, vender, validar ou evoluir um app existente.",
  },
];

const faixaValor = [
  { icon: <Layers size={18} />, t: "23 módulos guiados" },
  { icon: <Wand2 size={18} />, t: "54 comandos prontos" },
  { icon: <Lightbulb size={18} />, t: "30 ideias de apps" },
  { icon: <Bot size={18} />, t: "Agente Arquiteto" },
  { icon: <MapPin size={18} />, t: "GPS do App" },
  { icon: <ShieldCheck size={18} />, t: "Garantia 7 dias" },
];

export default function Home() {
  const navigate = useNavigate();
  const goCheckout = () => {
    trackPixel("InitiateCheckout");
    navigate("/checkout?plano=fabrica");
  };

  return (
    <>
      {/* HERO — cubo (HeroVisual) preservado integralmente. Apenas copy comercial alterada. */}
      <section className="relative pt-12 md:pt-20 pb-16">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-accent">Fábrica de Apps com IA</span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-[1.05] text-gradient">
              Da ideia ao app com IA: um programa-guia para construir com método, mesmo sem saber programar
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Um programa guiado para quem quer <span className="text-foreground/90 font-medium">começar do zero</span>, construir um <span className="text-foreground/90 font-medium">app completo</span> ou <span className="text-foreground/90 font-medium">melhorar um app que já existe</span> — com Agente Arquiteto, prompts prontos, módulos passo a passo e clareza para avançar sem se perder.
            </p>
            <p className="text-sm text-accent/90 italic max-w-xl">
              Método criado e testado no Lovable (ferramenta principal recomendada), com lógica adaptável a outras ferramentas de criação com IA como Replit, Cursor, Claude Code, Bolt, Gemini e Firebase Studio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="btn-primary" onClick={goCheckout}>
                Quero acessar o programa por R$197 (1 ano) <ChevronRight size={18} />
              </button>
              <button onClick={() => document.getElementById("jornadas")?.scrollIntoView({ behavior: "smooth" })} className="btn-ghost">
                Ver como funciona
              </button>
            </div>
            <p className="text-sm text-muted-foreground/80">
              R$197 por 1 ano de acesso · Parcelamento disponível no cartão · Garantia de 7 dias.
            </p>
          </div>
          <div className="order-first lg:order-last">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* FAIXA DE VALOR — 6 itens tangíveis */}
      <section className="pb-8">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {faixaValor.map((p) => (
              <div key={p.t} className="glass flex items-center gap-2 px-3 py-3 border-accent/20">
                <span className="text-accent shrink-0">{p.icon}</span>
                <span className="text-xs md:text-sm font-medium text-foreground/90 leading-tight">{p.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JORNADAS — 3 caminhos */}
      <Section
        id="jornadas"
        eyebrow="Escolha sua jornada na Fábrica"
        title="Três caminhos para usar o programa"
        subtitle="Você decide por onde entrar. O programa se adapta ao seu momento — começando do zero, construindo um app completo ou melhorando um app existente."
      >
        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {jornadas.map((j) => (
            <GlassCard key={j.t} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0">{j.icon}</span>
                <p className="font-heading font-bold text-lg text-foreground">{j.t}</p>
              </div>
              <p className="text-sm md:text-base text-foreground/90 leading-relaxed">{j.d}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* FAIXA FINANCEIRA */}
      <section className="pb-12">
        <div className="container">
          <div className="max-w-4xl mx-auto glass-strong p-6 md:p-8 border-accent/30 neon-shadow">
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed text-center">
              Antes de gastar <span className="text-accent font-semibold">de R$100 a R$500 em créditos</span>, testes e prompts no escuro, entre na Fábrica e siga um método que mostra <span className="text-accent">o que pedir, em qual ordem e o que revisar</span> antes de avançar na sua ferramenta de IA.
            </p>
            <p className="text-xs text-muted-foreground/80 text-center mt-3">
              Sem promessa de economia garantida — o programa ajuda a usar seus créditos com mais intenção e reduzir tentativa e erro.
            </p>
          </div>
        </div>
      </section>

      {/* ARQUITETO vs PEDREIRO — frase preservada, bullets quebrados */}
      <Section
        eyebrow="Por que a Fábrica existe"
        title="O Lovable é o pedreiro. A Fábrica é o arquiteto."
      >
        <div className="max-w-3xl mx-auto glass-strong p-6 md:p-10 space-y-4">
          <ul className="space-y-3 text-base md:text-lg text-foreground/90 leading-relaxed">
            <li className="flex items-start gap-3">
              <Check size={18} className="text-accent shrink-0 mt-1" />
              <span>O <span className="text-accent">Lovable</span> (e outras ferramentas de criação com IA) executa o que você pede.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check size={18} className="text-accent shrink-0 mt-1" />
              <span>A <span className="text-accent">Fábrica</span> é o método, a sequência, a lógica dos prompts e a revisão por etapa.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check size={18} className="text-accent shrink-0 mt-1" />
              <span>Sem planta clara, a IA cria telas fora de ordem, banco confuso e funcionalidades demais — consumindo seus créditos.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check size={18} className="text-accent shrink-0 mt-1" />
              <span>Com a Fábrica você aprende <span className="text-accent">o que pedir, em qual ordem construir e o que evitar</span>.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check size={18} className="text-accent shrink-0 mt-1" />
              <span>Quando você travar, o <span className="text-accent">Agente Arquiteto via ChatGPT</span> ajuda a transformar dúvida em comando melhor antes de gastar prompt.</span>
            </li>
          </ul>
          <p className="text-xs text-muted-foreground/80 leading-relaxed pt-2 border-t border-white/5">
            Outras ferramentas de IA têm sintaxe, limites e comportamento próprios — a lógica do método se adapta, mas os comandos precisam ser ajustados a cada plataforma.
          </p>
        </div>
      </Section>

      {/* PRECISO USAR LOVABLE? */}
      <Section
        eyebrow="Sobre a ferramenta"
        title="Preciso usar o Lovable?"
      >
        <div className="max-w-3xl mx-auto glass-strong p-6 md:p-8 space-y-3">
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            O método da Fábrica foi <span className="text-accent">criado e testado no Lovable</span>, por isso ele é a ferramenta principal recomendada.
          </p>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            A lógica de planejamento, prompts, revisão e evolução pode ser <span className="text-accent">adaptada para outras ferramentas de criação com IA</span> — como Replit, Cursor, Claude Code, Bolt, Gemini, Firebase Studio e similares.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cada ferramenta tem limites, sintaxe e formatos próprios. Por isso não prometemos compatibilidade automática com todas — você adapta o comando ao formato da plataforma escolhida.
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

      {/* O QUE VOCÊ RECEBE */}
      <Section
        eyebrow="Por que vale R$197"
        title="O que você recebe por R$197 (1 ano de acesso)"
        subtitle="Não é PDF solto, prompt pack avulso nem curso passivo. É uma plataforma guiada para construir, revisar e evoluir seu app com mais direção."
      >
        {/* Linha-resumo de entregas */}
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2 mb-10">
          {[
            "23 módulos guiados",
            "54 comandos prontos",
            "Agente Arquiteto",
            "GPS do App",
            "30 ideias prontas",
          ].map((chip) => (
            <span
              key={chip}
              className="glass px-3 py-1.5 text-xs md:text-sm text-foreground/90 border-accent/20"
            >
              {chip}
            </span>
          ))}
        </div>

        {/* 4 cards curtos */}
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {[
            {
              icon: <ListChecks size={20} />,
              t: "23 módulos guiados",
              d: "Uma jornada organizada para planejar, construir, revisar, publicar e evoluir seu app sem se perder no processo.",
            },
            {
              icon: <Wand2 size={20} />,
              t: "54 comandos prontos para Lovable",
              d: "Prompts estruturados para pedir, revisar, corrigir e melhorar seu app com mais clareza e menos improviso.",
            },
            {
              icon: <Bot size={20} />,
              t: "Agente Arquiteto + GPS do App",
              d: "O Agente ajuda você a pensar antes de pedir. O GPS mostra projeto em foco, etapa atual e próximo passo recomendado.",
            },
            {
              icon: <Lightbulb size={20} />,
              t: "30 ideias para começar ou adaptar",
              d: "Para quem ainda não sabe qual app criar, a Fábrica traz ideias prontas para escolher, adaptar e transformar em projeto.",
            },
          ].map((m) => (
            <GlassCard key={m.t} className="space-y-2 h-full">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0">{m.icon}</span>
                <p className="font-heading font-bold text-base md:text-lg text-foreground">{m.t}</p>
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed">{m.d}</p>
            </GlassCard>
          ))}
        </div>

        {/* Faixa de fechamento */}
        <div className="max-w-3xl mx-auto mt-10 glass px-5 py-5 md:px-6 md:py-6 text-center">
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
            Por <span className="font-semibold text-accent">R$197</span>, você tem 1 ano de acesso a uma plataforma guiada para transformar ideias, projetos ou apps existentes em uma construção mais clara dentro do Lovable.
          </p>
        </div>
      </Section>

      {/* DIFERENCIAÇÃO */}
      <Section
        eyebrow="O que a Fábrica é (e o que não é)"
        title="Não é um PDF. Não é um curso gigante. É uma Fábrica guiada."
        subtitle="Você não precisa de mais conteúdo parado. Você precisa de um caminho claro para saber o que pedir, em qual ordem construir e como revisar antes de avançar."
      >
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { t: "Prompt solto", d: "Te dá uma frase. Sem ordem, sem contexto, sem próximo passo. É fácil gastar créditos testando no escuro.", neg: true },
              { t: "Curso longo", d: "Te dá horas de vídeo para assistir passivamente. Quando termina, ainda falta saber por onde começar de verdade.", neg: true },
              { t: "Fábrica de Apps com IA", d: "Te dá uma sequência completa: método, 23 módulos, 54 comandos prontos, 30 ideias, área interna, GPS do App e Agente Arquiteto.", neg: false },
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
              Dentro da Fábrica, o programa te ajuda a <span className="text-accent">escolher uma ideia, definir o MVP, montar telas, criar prompts melhores, revisar erros e pensar login, banco, Admin, área paga, checkout, publicação, validação e evolução</span> do app.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              E quando você travar, o <span className="text-accent">Agente Arquiteto via ChatGPT</span> ajuda a transformar sua dúvida em um comando mais claro antes de mandar para a ferramenta de criação.
            </p>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              Por <span className="font-semibold">R$197</span>, você tem 1 ano de acesso ao programa completo: 23 módulos, 54 comandos prontos, 30 ideias, área interna, GPS do App e Agente Arquiteto.
            </p>
          </div>
        </div>
      </Section>

      {/* CTA INTERMEDIÁRIO */}
      <section className="pb-12">
        <div className="container">
          <div className="max-w-3xl mx-auto glass-strong p-6 md:p-8 text-center neon-shadow">
            <button className="btn-primary mx-auto" onClick={goCheckout}>
              Quero acessar o programa por R$197 (1 ano) <ChevronRight size={18} />
            </button>
            <p className="text-sm text-foreground/80 leading-relaxed mt-4">
              R$197 por 1 ano de acesso. Parcelamento disponível no cartão. 23 módulos, 54 comandos, 30 ideias, área interna, GPS do App e Agente Arquiteto via ChatGPT.
            </p>
          </div>
        </div>
      </section>

      {/* 30 IDEIAS */}
      <Section
        eyebrow="Inspiração inclusa"
        title="30 ideias de aplicativos para você não começar do zero"
        subtitle="Escolha uma ideia pronta, adapte ao seu serviço, método, conteúdo ou produto digital e transforme em um projeto dentro da Fábrica."
      >
        <p className="max-w-3xl mx-auto text-center text-sm md:text-base text-muted-foreground/90 -mt-6 mb-10">
          As ideias servem como ponto de partida para diferentes tipos de aplicativos — desde versões iniciais até projetos que podem evoluir por etapas.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-6xl mx-auto">
          {[
            {
              icon: <MapPin size={18} />,
              title: "Atendimento e agenda",
              examples: ["App de agendamento", "App para consultoria ou serviço", "App para mentoria ou terapia"],
              copy: "Organiza horários, clientes e retornos em um fluxo simples.",
            },
            {
              icon: <Layers size={18} />,
              title: "Conteúdo e membros",
              examples: ["App de área de membros", "App de conteúdo pago", "App de entrega de método"],
              copy: "Entrega seu método ou conteúdo em uma área organizada.",
            },
            {
              icon: <ListChecks size={18} />,
              title: "Diagnóstico e acompanhamento",
              examples: ["App de diagnóstico", "App de checklist", "App de acompanhamento de clientes"],
              copy: "Guia o cliente por etapas claras e mensuráveis.",
            },
            {
              icon: <Sparkles size={18} />,
              title: "Comunidade e relacionamento",
              examples: ["App de comunidade simples", "App de acompanhamento de alunos", "App para grupos e desafios"],
              copy: "Cria espaço próprio para engajar quem já é seu público.",
            },
            {
              icon: <Workflow size={18} />,
              title: "Catálogo e ferramentas",
              examples: ["App de catálogo", "App de calculadora", "App de comparador ou simulador"],
              copy: "Transforma um material ou planilha em ferramenta viva.",
            },
            {
              icon: <Rocket size={18} />,
              title: "Ideias adaptáveis",
              examples: ["Apps para prestadores de serviço", "Apps para criadores de conteúdo", "Apps para produtos digitais"],
              copy: "Base para adaptar ao seu nicho, público e formato.",
            },
          ].map((cat) => (
            <div key={cat.title} className="glass-strong p-6 flex flex-col gap-4 transition-all hover:border-white/20 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  {cat.icon}
                </div>
                <h3 className="font-heading font-semibold text-base md:text-lg">{cat.title}</h3>
              </div>
              <ul className="flex flex-col gap-2">
                {cat.examples.map((ex) => (
                  <li key={ex} className="flex items-start gap-2 text-sm text-foreground/90">
                    <Lightbulb size={14} className="text-accent shrink-0 mt-1" />
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground/80 mt-auto">{cat.copy}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-10 glass p-6 md:p-8 text-center">
          <p className="text-sm md:text-base text-foreground/90 mb-2">
            Dentro da Fábrica, você encontra a lista completa com <span className="text-accent font-semibold">30 ideias</span> para escolher, adaptar e transformar em projeto.
          </p>
          <p className="text-xs md:text-sm text-muted-foreground mb-6">
            Você não precisa começar olhando para uma tela em branco. A Fábrica te ajuda a escolher uma ideia, adaptar ao seu contexto e transformar em projeto com próximos passos claros.
          </p>
          <button onClick={goCheckout} className="btn-primary">
            Acessar as ideias dentro da Fábrica
          </button>
        </div>
      </Section>

      {/* AGENTE ARQUITETO */}
      <Section
        eyebrow="Diferencial do programa"
        title="Quando você travar, o Agente Arquiteto te ajuda a decidir o próximo passo"
        subtitle="O Agente Arquiteto é o guia estratégico da Fábrica. Ele ajuda você a transformar dúvidas em próximos passos, revisar comandos antes de colar no Lovable e entender o que fazer quando algo quebra."
      >
        <div className="max-w-6xl mx-auto">
          {/* 4 cards de situações */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
            {[
              {
                icon: <Compass size={18} />,
                title: "Quando você não sabe por onde começar",
                copy: "O Agente ajuda a organizar sua ideia, escolher uma rota e transformar pensamento solto em plano de app.",
              },
              {
                icon: <Wand2 size={18} />,
                title: "Antes de colar no Lovable",
                copy: "Ele revisa se o comando está claro, se está pedindo coisa demais e se preserva o que já funciona.",
              },
              {
                icon: <RefreshCw size={18} />,
                title: "Quando o app dá erro",
                copy: "Você cola o erro ou o resultado do Lovable e o Agente ajuda a entender a causa provável e criar uma correção cirúrgica.",
              },
              {
                icon: <Rocket size={18} />,
                title: "Antes de avançar para a próxima etapa",
                copy: "Ele ajuda a decidir se você pode seguir, se precisa testar melhor ou se ainda existe algo bloqueando.",
              },
            ].map((c) => (
              <div key={c.title} className="glass-strong p-5 flex flex-col gap-3 transition-all hover:border-white/20 hover:-translate-y-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 border border-accent/20 flex items-center justify-center text-accent">
                  {c.icon}
                </div>
                <h3 className="font-heading font-semibold text-sm md:text-base leading-snug">{c.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{c.copy}</p>
              </div>
            ))}
          </div>

          {/* Ciclo Agente → Lovable → Agente → Fábrica */}
          <div className="glass-strong p-6 md:p-8 neon-shadow">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                <Bot size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg md:text-xl mb-1">Use o Agente antes e depois do Lovable</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Pense com o Agente. Execute no Lovable. Volte com o resultado para o Agente analisar. Depois avance na Fábrica.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {[
                { label: "Pense", sub: "Agente" },
                { label: "Execute", sub: "Lovable" },
                { label: "Analise", sub: "Agente" },
                { label: "Avance", sub: "Fábrica" },
              ].map((s, idx) => (
                <div key={s.label} className="relative flex items-center">
                  <div className="flex-1 rounded-xl border border-accent/20 bg-accent/5 px-3 py-3 text-center">
                    <p className="text-sm md:text-base font-heading font-semibold text-foreground">{s.label}</p>
                    <p className="text-xs text-accent mt-0.5">{s.sub}</p>
                  </div>
                  {idx < 3 && (
                    <ChevronRight size={16} className="text-accent/60 hidden md:block absolute -right-2 top-1/2 -translate-y-1/2" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button onClick={goCheckout} className="btn-primary">
                Entrar na Fábrica e usar o Agente
              </button>
            </div>

            <p className="text-xs text-muted-foreground/80 mt-6 text-center">
              O Agente não substitui o Lovable, não cria o app sozinho e depende da sua conta, acesso e limites das plataformas externas.
            </p>
          </div>
        </div>
      </Section>

      {/* PREÇO */}
      <Section
        eyebrow="Oferta atual"
        title="Acesso completo à Fábrica de Apps com IA"
        subtitle="Programa completo, pagamento único, sem mensalidade. Tudo o que você precisa para sair da ideia e construir, melhorar ou evoluir seu app com IA."
      >
        <div className="max-w-2xl mx-auto glass-strong p-8 md:p-10 neon-shadow">
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Programa completo</p>
            <div className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-gradient">R$197</div>
            <p className="text-base text-foreground/90 mt-2 font-medium">pagamento único</p>
            <p className="text-sm text-muted-foreground mt-1">Parcelamento disponível no cartão</p>
            <p className="text-xs text-muted-foreground/80 mt-3">Acesso liberado após confirmação do pagamento</p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-2.5 mb-6">
            {beneficios.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm md:text-base text-foreground/90">
                <Check size={16} className="text-accent shrink-0 mt-1" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {/* Selo de garantia próximo à oferta */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-accent/40 bg-accent/10 text-accent text-xs md:text-sm font-medium">
              <ShieldCheck size={14} /> Garantia 7 dias · Reembolso integral
            </span>
          </div>

          <p className="text-sm md:text-base text-foreground/90 leading-relaxed text-center mb-4 max-w-2xl mx-auto">
            Você recebe acesso ao programa-guia com 23 módulos, 54 comandos, 30 ideias de apps, GPS do App e Agente Arquiteto para seguir sua jornada de criação com IA.
          </p>
          <button className="btn-primary mx-auto" onClick={goCheckout}>
            Quero acessar o programa por R$197 <ChevronRight size={18} />
          </button>
          <p className="text-sm text-foreground/80 leading-relaxed text-center mt-4">
            O acesso ao programa custa <span className="font-semibold">R$197 em pagamento único</span> — menos do que muita gente pode acabar gastando tentando prompts soltos sem método.
          </p>

          <div className="mt-6 pt-6 border-t border-white/5 flex items-start gap-3">
            <ShieldCheck size={20} className="text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/90 leading-relaxed">
              <span className="font-semibold">Garantia de 7 dias:</span> entre, veja o programa por dentro e, se perceber que ele não é para você, solicite o reembolso integral dentro do prazo.
            </p>
          </div>

          <p className="text-xs text-muted-foreground/80 leading-relaxed text-center mt-4">
            Suporte por e-mail para acesso, navegação e uso do programa · <a href="mailto:fabricadeappscomia@outlook.com" className="text-accent hover:underline">fabricadeappscomia@outlook.com</a>
          </p>

        </div>
      </Section>

      {/* ENTREGAS FINAIS */}
      <Section
        id="incluso"
        eyebrow="O que você terá ao final"
        title="Ao seguir o programa, você constrói com mais clareza"
        subtitle="Sem promessa de app perfeito, sem garantia de venda. O que você ganha é caminho claro para sair da ideia, construir, publicar, vender, validar e evoluir."
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

      {/* MÓDULOS — 4 blocos */}
      <Section
        eyebrow="Por dentro do programa"
        title="Tudo organizado em 4 blocos práticos"
        subtitle="Cada bloco reúne os módulos da etapa, com contexto do projeto em foco e próximo passo recomendado. MVP é apenas uma das etapas — a jornada completa cobre planejar, construir, revisar, vender, publicar, validar e evoluir."
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
              t: "2. Construção com IA (Lovable e similares)",
              items: ["Prompts por etapa", "Login e autenticação", "Banco de dados", "Área paga e Admin", "Checkout e entrega"],
            },
            {
              icon: <ShieldCheck size={22} />,
              t: "3. Correção e segurança",
              items: ["Correção de erros e quebras", "Revisão por versões", "Noções de RLS", "Rotas e dados sensíveis", "Riscos comuns antes de publicar"],
            },
            {
              icon: <Megaphone size={22} />,
              t: "4. Venda, publicação e evolução",
              items: ["Estrutura de oferta", "Página de venda", "Preço e checkout", "Publicação e testes", "Validação e evolução por versões"],
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

      {/* PROVA DE REALIDADE — preservada */}
      <Section
        eyebrow="Prova de realidade"
        title="A própria Fábrica foi construída no Lovable"
      >
        <div className="max-w-3xl mx-auto glass-strong p-4 md:p-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-[0_0_40px_rgba(0,200,255,0.12)]">
            <video
              className="h-full w-full object-cover"
              controls
              preload="metadata"
              playsInline
            >
              <source src={fabricaDemoVideo.url} type="video/mp4" />
              Seu navegador não suporta vídeo HTML5.
            </video>
          </div>
          <p className="text-base text-foreground/90 leading-relaxed mt-6 text-center">
            Esta página, a área interna e o painel administrativo foram construídos no Lovable seguindo a mesma lógica que o programa ensina: <span className="text-accent">planejar, pedir, revisar, corrigir e avançar por etapas</span>. Não é promessa de que todo aluno terá o mesmo resultado — é a prova de que o método é executável na prática.
          </p>
          <p className="text-xs text-muted-foreground/80 mt-3 leading-relaxed text-center">
            O mesmo raciocínio pode ser adaptado para outras ferramentas de criação com IA, ajustando os comandos ao formato de cada plataforma.
          </p>
        </div>

      </Section>

      {/* PARA QUEM É / NÃO É */}
      <Section eyebrow="Audiência" title="Para quem é e para quem não é">
        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          <div className="glass-strong p-6 md:p-8">
            <h3 className="font-heading font-bold text-xl mb-4">Para quem é</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Para qualquer pessoa que quer tirar uma ideia de app do papel com ajuda da IA, mesmo sem saber programar.
            </p>
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
                <span className="text-destructive/80 shrink-0 mt-1">✕</span>
                <span>{item}</span>
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
            Da ideia ao app, com a planta pronta
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Programa completo, método guiado, 23 módulos, 54 comandos prontos, 30 ideias de apps, GPS do App e Agente Arquiteto.
          </p>
          <button className="btn-primary mx-auto" onClick={goCheckout}>
            Quero acessar o programa por R$197 <ChevronRight size={18} />
          </button>
          <p className="text-sm text-muted-foreground/80 mt-4">
            R$197 pagamento único · sem mensalidade · garantia de 7 dias.
          </p>
        </div>
      </Section>
      <JourneyNotification />
    </>
  );
}

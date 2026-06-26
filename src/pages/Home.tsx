import { useNavigate } from "react-router-dom";
import {
  Sparkles, Layers, Database, Rocket, Brain, Target, ChevronRight,
  Workflow, Wand2, Megaphone, LineChart, ListChecks, Image as ImageIcon,
  Calendar, Lightbulb, Check, ShieldCheck, PlayCircle,
} from "lucide-react";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { HeroVisual } from "@/components/HeroVisual";
import { FAQItem } from "@/components/FAQItem";

const planoExecutavel = [
  { icon: <Brain size={20} />, t: "Diagnóstico da ideia" },
  { icon: <Layers size={20} />, t: "MVP enxuto" },
  { icon: <Workflow size={20} />, t: "Arquitetura e telas" },
  { icon: <Database size={20} />, t: "Login, banco e Supabase" },
  { icon: <Wand2 size={20} />, t: "Prompts estruturados para o Lovable" },
  { icon: <ShieldCheck size={20} />, t: "Auditoria antes de corrigir" },
  { icon: <ListChecks size={20} />, t: "Checklist de próximo passo" },
];

const entregasFinais = [
  "Ideia organizada com público, dor e promessa definidos",
  "MVP enxuto com funcionalidades priorizadas",
  "Telas principais e fluxo do usuário mapeados",
  "Plano de login, banco de dados e Supabase",
  "Plano de monetização e área paga",
  "Caminho de checkout e publicação",
  "Auditoria de melhorias do app existente",
  "Prompts estruturados prontos para colar no Lovable",
  "Checklist para avançar sem quebrar o que funciona",
  "Próximo comando recomendado em cada etapa",
];

const centralVendas = [
  { icon: <Target size={20} />, t: "Definição de oferta" },
  { icon: <Wand2 size={20} />, t: "Página de venda" },
  { icon: <Lightbulb size={20} />, t: "Checkout e entrega" },
  { icon: <ImageIcon size={20} />, t: "Área paga estruturada" },
  { icon: <Calendar size={20} />, t: "Comunicação de valor" },
  { icon: <LineChart size={20} />, t: "Métricas para acompanhar" },
  { icon: <Sparkles size={20} />, t: "Próximos passos de publicação" },
  { icon: <Megaphone size={20} />, t: "Material pronto para revisar" },
];

const mockups = [
  { icon: <Brain size={22} />, t: "Planejamento do app", d: "Estruture ideia, público, dor e promessa antes de mandar o Lovable construir." },
  { icon: <Layers size={22} />, t: "MVP e Arquitetura", d: "Defina o mínimo funcional e a arquitetura para evitar app inchado." },
  { icon: <Workflow size={22} />, t: "Telas e Fluxo", d: "Mapeie telas principais e fluxo do usuário em ordem de construção." },
  { icon: <Database size={22} />, t: "Login e Banco", d: "Planeje auth, Supabase, banco e permissões com prompts seguros." },
  { icon: <Rocket size={22} />, t: "Monetização e Checkout", d: "Estruture oferta, checkout, entrega e área paga sem improviso." },
  { icon: <ShieldCheck size={22} />, t: "Auditoria de Segurança", d: "Revise riscos, RLS, login e pontos sensíveis antes de publicar." },
  { icon: <ListChecks size={22} />, t: "Melhorias e Versões", d: "Audite o app existente e evolua por versões sem quebrar o que funciona." },
  { icon: <Wand2 size={22} />, t: "Prompts recomendados", d: "Receba comandos estruturados para colar direto no Lovable." },
  { icon: <LineChart size={22} />, t: "Estado Atual do Projeto", d: "Veja contexto, progresso e próximo passo recomendado em cada módulo." },
];

const beneficios = [
  "Acesso à plataforma guiada",
  "Projeto em foco",
  "Contexto personalizado",
  "Próximo passo recomendado",
  "Prompts estruturados para o Lovable",
  "Checklists de avanço",
  "Jornada para começar do zero",
  "Jornada para construir por versões",
  "Jornada para auditar app existente",
  "Orientações para MVP, telas, banco, login, checkout e melhorias",
];

const naoIncluso = [
  "Não inclui desenvolvimento humano sob demanda",
  "Não inclui garantia de aprovação, vendas ou faturamento",
  "Não inclui promessa de app perfeito ou segurança 100%",
  "Não inclui suporte técnico ilimitado",
  "Não substitui validação, testes e revisão do usuário",
  "Não garante economia de créditos no Lovable",
];

const dores = [
  "Chega de copiar prompts aleatórios sem saber se está na etapa certa",
  "Chega de tentar corrigir um botão e quebrar outras 3 telas",
  "Chega de gastar créditos do Lovable em comandos vagos",
  "Chega de criar um app inchado antes do MVP funcionar",
  "Chega de se perder entre telas, Supabase, login, checkout e publicação",
  "Chega de entrar em loop de correções sem chegar em um app funcional",
];

const paraQuemE = [
  "Quem quer criar um app no Lovable sem programar",
  "Quem tem uma ideia e não sabe transformar em MVP",
  "Quem já começou um app e se perdeu",
  "Quem quer reduzir retrabalho com prompts melhores",
  "Quem precisa organizar telas, banco, login, checkout e monetização",
  "Quem quer seguir uma ordem clara antes de pedir tudo ao Lovable",
];

const naoEParaQuem = [
  "Quem quer garantia de resultado sem executar",
  "Quem quer que a plataforma faça tudo sozinha sem decisões",
  "Quem quer criar qualquer app complexo de uma vez",
  "Quem procura promessa de app perfeito ou segurança 100%",
  "Quem não pretende testar, validar ou seguir etapas",
];

const faqs = [
  { q: "Preciso saber programar?", a: "Não. A Fábrica foi criada para ajudar pessoas não técnicas a organizar a construção e gerar comandos melhores para o Lovable." },
  { q: "Isso funciona com Lovable?", a: "Sim. A Fábrica foi pensada para guiar a criação de apps no Lovable, com prompts estruturados, etapas e checklists." },
  { q: "A Fábrica cria o app por mim?", a: "Não automaticamente. Ela guia você com contexto, módulos e prompts para aplicar no Lovable com mais clareza." },
  { q: "Posso usar se já comecei meu app?", a: "Sim. Existe uma jornada para quem já tem app, com auditoria, correções, melhorias e preservação do que já funciona." },
  { q: "Isso ajuda com Supabase, login e banco?", a: "Sim. A Fábrica ajuda a planejar e revisar pontos como login, banco, área paga, checkout, permissões e riscos." },
  { q: "Vou economizar créditos no Lovable?", a: "A Fábrica não promete economia garantida, mas ajuda a reduzir prompts vagos, retrabalho e tentativas sem direção." },
  { q: "É curso, PDF ou plataforma?", a: "É uma plataforma guiada com módulos, contexto do projeto, prompts, checklists e próximo passo recomendado." },
  { q: "Qual é o preço?", a: "A oferta de lançamento é R$197 à vista ou 12x de R$19,70, se disponível no checkout." },
  { q: "Tem garantia?", a: "Sim. Você tem 7 dias para acessar, conhecer a plataforma e solicitar reembolso se perceber que ela não é para você." },
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
              Crie seu app do zero com IA, mesmo sem saber programar
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Siga uma jornada guiada para sair da ideia, organizar seu MVP, criar prompts melhores e construir no Lovable com mais clareza e menos retrabalho.
            </p>
            <p className="text-sm text-accent/90 italic max-w-xl">
              Criado no Lovable usando o mesmo método que você vai acessar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="btn-primary" onClick={goCheckout}>
                Quero acessar por R$197 <ChevronRight size={18} />
              </button>
              <a href="#incluso" className="btn-ghost">Ver como funciona</a>
            </div>
            <p className="text-sm text-muted-foreground/80">
              Oferta de lançamento: R$197 à vista ou 12x de R$19,70. Pagamento único, sem mensalidade.
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
        <div className="max-w-3xl mx-auto glass-strong p-6 md:p-10">
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
            O Lovable constrói rápido. Mas se você não entregar uma planta clara, ele pode criar telas fora de ordem, banco confuso, fluxos quebrados e funcionalidades demais. A Fábrica de Apps com IA organiza a planta antes da construção: <span className="text-accent">ideia, MVP, telas, banco, login, monetização, auditoria e próximos comandos</span>.
          </p>
        </div>
      </Section>

      {/* DOR */}
      <Section
        eyebrow="A dor real"
        title="Você não precisa de mais prompts soltos"
        subtitle="Você precisa saber o que pedir, em qual ordem e como revisar se ficou certo."
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
        title="Você não recebe só um PDF. Você recebe uma plataforma guiada."
        subtitle="Você não compra uma lista de prompts. Você acessa uma plataforma que guia sua construção: escolhe o projeto, preenche o contexto, vê o próximo passo e copia o comando certo para o Lovable."
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
        subtitle="Tudo organizado em um único acesso, pronto para colar no Lovable e nas ferramentas que você já usa."
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
        eyebrow="Por dentro da plataforma"
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
        eyebrow="Oferta de lançamento"
        title="Acesso completo à Fábrica de Apps com IA"
        subtitle="Um app mal planejado pode consumir créditos, tempo e retrabalho. A Fábrica ajuda você a chegar no Lovable com mais clareza antes de mandar construir."
      >
        <div className="max-w-2xl mx-auto glass-strong p-8 md:p-10 neon-shadow">
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Oferta de lançamento</p>
            <div className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-gradient">R$197</div>
            <p className="text-base text-foreground/90 mt-2 font-medium">à vista</p>
            <p className="text-sm text-muted-foreground mt-1">ou 12x de R$19,70</p>
            <p className="text-xs text-muted-foreground/80 mt-3">Oferta de lançamento por tempo limitado · Acesso liberado após confirmação</p>
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
            Quero acessar por R$197 <ChevronRight size={18} />
          </button>
          <div className="mt-6 pt-6 border-t border-white/5 flex items-start gap-3">
            <ShieldCheck size={20} className="text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/90 leading-relaxed">
              <span className="font-semibold">Garantia de 7 dias:</span> entre, veja a plataforma por dentro e, se perceber que ela não é para você, solicite o reembolso dentro do prazo.
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
            Plataforma guiada, contexto do projeto, prompts estruturados e próximo passo em cada etapa.
          </p>
          <button className="btn-primary mx-auto" onClick={goCheckout}>
            Quero acessar por R$197 <ChevronRight size={18} />
          </button>
          <p className="text-sm text-muted-foreground/80 mt-4">
            R$197 à vista ou 12x de R$19,70. Pagamento único, sem mensalidade. Garantia de 7 dias.
          </p>
        </div>
      </Section>
    </>
  );
}

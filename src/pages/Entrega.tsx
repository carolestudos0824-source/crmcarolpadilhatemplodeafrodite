import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LogOut,
  ExternalLink,
  Copy,
  Check,
  LifeBuoy,
  Lock,
  Loader2,
  ShieldCheck,
  Gift,
  ArrowDown,
  Sparkles,
  Layers,
  ListChecks,
  Smartphone,
} from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { GiftCodeRedemption } from "@/components/GiftCodeRedemption";
import { clearSession } from "@/lib/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { APP_CONFIG } from "@/config/appConfig";
import { openSupportEmail } from "@/lib/openLink";

// ===================== Conteúdo =====================

const LOVABLE_URL = "https://lovable.dev";
const STORAGE_PROGRESS = "fabrica_apps_progress_v3";
const STORAGE_STEPS = "fabrica_apps_steps_v1";

type Command = {
  n: number;
  title: string;
  purpose: string;
  when: string;
  where: string;
  result: string;
  content: string;
};

const commands: Command[] = [
  {
    n: 1,
    title: "Transformar minha ideia em um plano de app",
    purpose: "Serve para o Lovable entender sua ideia e organizar o app antes de construir.",
    when: "Use primeiro, antes de pedir telas ou banco de dados.",
    where: "Cole no Lovable, no campo de conversa do projeto.",
    result:
      "O Lovable deve responder com um plano claro do app, incluindo MVP, telas, fluxo e estrutura.",
    content: `Você é um especialista em produto digital, UX e desenvolvimento de aplicativos no Lovable.

Quero transformar minha ideia em um app simples, validável e pronto para construir.

Minha ideia é:
[descreva aqui sua ideia]

Quem vai usar:
[descreva quem será o usuário]

Problema que o app resolve:
[descreva a dor do usuário]

Como pretendo ganhar dinheiro:
[assinatura, venda única, comissão, anúncios ou ainda não sei]

Antes de construir qualquer coisa, analise minha ideia e entregue:

1. Veredito estratégico da ideia
2. Problema real que o app resolve
3. Usuário principal
4. Ação principal do usuário
5. MVP com no máximo 5 funcionalidades
6. O que deve ser cortado agora
7. Fluxo do usuário em até 5 etapas
8. Telas necessárias
9. Banco de dados necessário
10. Design recomendado
11. Monetização
12. Riscos principais
13. Plano de construção no Lovable

Regras:
- Não crie um app gigante.
- Não adicione funcionalidades desnecessárias.
- Explique tudo de forma simples.
- Priorize mobile first.
- O objetivo é criar uma primeira versão simples para validar.`,
  },
  {
    n: 2,
    title: "Construir a primeira versão do app",
    purpose: "Serve para pedir ao Lovable que comece a construir o app.",
    when: "Use depois que o Lovable gerar o plano do app.",
    where: "Cole no mesmo projeto do Lovable.",
    result: "O Lovable deve criar as primeiras telas e o fluxo principal.",
    content: `Agora construa a primeira versão do app com base no plano abaixo.

Plano do app:
[cole aqui o plano gerado no Comando 1]

Regras obrigatórias:
1. Criar apenas o MVP.
2. O MVP deve ter no máximo 5 funcionalidades principais.
3. A interface deve ser simples e fácil de entender.
4. O usuário deve conseguir usar sem tutorial.
5. O fluxo principal deve ter no máximo 5 etapas.
6. Priorizar visual mobile first.
7. Criar telas limpas, modernas e organizadas.
8. Criar estados de carregamento, erro, sucesso e vazio.
9. Não criar funcionalidades extras.
10. Não complicar o banco de dados.

Entregue uma primeira versão funcional para teste.`,
  },
  {
    n: 3,
    title: "Criar banco de dados, login e regras de acesso",
    purpose: "Serve para fazer o app salvar informações e controlar quem pode acessar.",
    when:
      "Use se o app precisa de login, usuários, pedidos, tarefas, mensagens, produtos ou área restrita.",
    where: "Cole no Lovable depois que as primeiras telas existirem.",
    result: "O Lovable deve criar tabelas, autenticação e regras básicas de segurança.",
    content: `Agora adicione banco de dados, autenticação e regras de acesso ao app.

Contexto do app:
[cole aqui o resumo do app]

O app precisa salvar:
[explique o que precisa ser salvo: usuários, pedidos, tarefas, mensagens, produtos, pagamentos ou outros dados]

Crie:
1. Login e cadastro de usuários
2. Tabelas necessárias no Supabase
3. Campos principais de cada tabela
4. Relacionamentos entre tabelas
5. Regras de acesso por usuário
6. Proteção para usuário ver apenas seus próprios dados
7. Estados de erro e sucesso
8. Mensagens simples para o usuário
9. Área restrita, se necessário
10. Estrutura segura e simples

Regras:
- Não expor dados de outros usuários.
- Não criar tabelas desnecessárias.
- Não usar service role no frontend.
- Manter o MVP simples.
- Explicar o que foi criado.`,
  },
  {
    n: 4,
    title: "Melhorar o design e deixar bonito no celular",
    purpose: "Serve para deixar o app mais bonito, claro e profissional.",
    when: "Use depois que o app já tiver as telas principais.",
    where: "Cole no Lovable dentro do projeto.",
    result:
      "O Lovable deve melhorar layout, cores, espaçamento, botões e experiência mobile.",
    content: `Melhore o design do app para parecer mais profissional, moderno e fácil de usar.

Objetivo:
Deixar o app bonito, claro e mobile first.

Ajuste:
1. Hierarquia visual
2. Tamanho dos títulos
3. Espaçamento entre seções
4. Botões principais
5. Cards
6. Cores
7. Contraste
8. Navegação
9. Estados vazios
10. Mensagens de erro e sucesso

Estilo:
- Moderno
- Limpo
- Mobile first
- Fácil de entender
- Sem poluição visual

Regras:
- Não mude a lógica principal do app.
- Não adicione funcionalidades novas.
- Apenas melhore a experiência e o visual.
- O usuário deve entender o que fazer em menos de 5 segundos.`,
  },
  {
    n: 5,
    title: "Criar página de venda",
    purpose: "Serve para criar uma landing page para vender ou apresentar o app.",
    when: "Use quando o app já tiver uma ideia clara e uma promessa.",
    where: "Cole no Lovable dentro do projeto.",
    result:
      "O Lovable deve criar uma página pública com headline, benefícios, preço, FAQ e CTA.",
    content: `Crie uma página de venda para este app.

Nome do app:
[informe o nome]

Descrição:
[explique o app]

Público:
[quem vai usar]

Problema:
[qual dor resolve]

Promessa:
[qual resultado entrega]

Preço:
[informe o preço ou escreva "ainda não definido"]

A página deve ter:
1. Hero com headline forte
2. Subheadline clara
3. Botão principal de ação
4. Seção explicando a dor
5. Seção mostrando a solução
6. Como funciona
7. Benefícios principais
8. O que está incluso
9. Preço
10. Perguntas frequentes
11. CTA final

Regras:
- Página mobile first.
- Texto claro e direto.
- Não exagerar promessas.
- Não prometer dinheiro garantido.
- Não deixar a página longa demais.
- Foco em conversão.`,
  },
  {
    n: 6,
    title: "Criar checkout e página de obrigado",
    purpose:
      "Serve para organizar o caminho de compra e o que acontece depois do pagamento.",
    when: "Use quando o app ou produto for vendido.",
    where: "Cole no Lovable.",
    result: "O Lovable deve criar fluxo de compra, página de obrigado e instruções de acesso.",
    content: `Crie o fluxo de compra e pós-compra para este produto.

Produto:
[descreva o produto]

Preço:
[informe o preço]

O usuário compra para receber:
[explique o que recebe]

Crie:
1. Botão de compra
2. Página ou seção de checkout
3. Página de obrigado
4. Instruções pós-compra
5. Link para acesso restrito
6. Mensagem para quem já comprou
7. Mensagem de suporte
8. Orientação para verificar e-mail, spam e promoções

Regras:
- Não deixar o comprador perdido.
- Explicar claramente o que acontece depois da compra.
- Não mostrar materiais protegidos para quem não comprou.
- Manter fluxo simples.`,
  },
  {
    n: 7,
    title: "Criar área de entrega",
    purpose:
      "Serve para entregar materiais, prompts, links, arquivos ou acesso ao comprador.",
    when: "Use quando o produto precisa de uma área exclusiva para clientes.",
    where: "Cole no Lovable.",
    result: "O Lovable deve criar uma área protegida e organizada para o comprador.",
    content: `Crie uma área de entrega protegida para compradores.

A área deve mostrar:
1. Boas-vindas
2. O que o usuário comprou
3. Como usar o produto
4. Materiais disponíveis
5. Botões para copiar ou acessar materiais
6. Checklist de progresso
7. Suporte
8. Área para código de acesso, se necessário

Regras:
- Usuário sem login não pode ver a entrega.
- Usuário sem acesso não pode ver os materiais.
- Usuário com acesso deve entender o que fazer em menos de 10 segundos.
- Não mostrar preço dentro da área de entrega.
- Não parecer página de venda.
- Parecer um painel de uso.`,
  },
  {
    n: 8,
    title: "Criar painel admin",
    purpose: "Serve para o dono liberar ou revogar acesso de clientes.",
    when: "Use quando você precisa controlar quem acessa a área de entrega.",
    where: "Cole no Lovable.",
    result: "O Lovable deve criar uma tela admin protegida.",
    content: `Crie um painel administrativo simples para gerenciar acessos.

O admin deve conseguir:
1. Buscar usuário por e-mail
2. Ver se o usuário tem acesso ativo
3. Liberar acesso
4. Revogar acesso
5. Ver origem do acesso
6. Ver data de criação

Regras:
- Apenas admin pode acessar.
- Usuário comum não pode acessar.
- Não expor chave service role no frontend.
- Usar Supabase Auth e regras seguras.
- Mostrar mensagens claras de sucesso e erro.
- Manter a tela simples.`,
  },
  {
    n: 9,
    title: "Corrigir erro no Lovable",
    purpose: "Serve para quando algo quebrar ou não funcionar.",
    when: "Use sempre que aparecer erro, tela travada ou comportamento errado.",
    where: "Cole no Lovable junto com a descrição do problema.",
    result: "O Lovable deve diagnosticar e corrigir sem quebrar o resto.",
    content: `Corrija o erro abaixo sem quebrar o que já funciona.

O que está acontecendo:
[explique o erro]

Página onde acontece:
[informe a rota ou tela]

O que eu esperava:
[explique o comportamento correto]

O que aconteceu de errado:
[explique o problema]

Regras:
1. Diagnostique a causa provável.
2. Corrija apenas o necessário.
3. Não remova funcionalidades existentes.
4. Não quebre login, banco, acesso ou admin.
5. Preserve o design atual.
6. Explique o que foi corrigido.
7. Liste o que eu devo testar depois.`,
  },
  {
    n: 10,
    title: "Revisar antes de publicar",
    purpose: "Serve para conferir se o app está pronto para ser mostrado a pessoas reais.",
    when: "Use antes de publicar.",
    where: "Cole no Lovable antes do deploy final.",
    result: "O Lovable deve revisar fluxo, mobile, erros, páginas e segurança básica.",
    content: `Faça uma revisão final antes de publicar este app.

Verifique:
1. A página inicial abre corretamente.
2. Login funciona.
3. Cadastro funciona.
4. Recuperação de acesso funciona.
5. Área restrita está protegida.
6. Usuário sem acesso não vê conteúdo protegido.
7. Usuário com acesso entra normalmente.
8. Admin acessa painel admin.
9. Botões principais funcionam.
10. Página funciona bem no celular.
11. Não existem textos confusos.
12. Não existem links quebrados.
13. Estados de erro são claros.
14. Estados de sucesso são claros.
15. O app está simples o suficiente para testar com 10 usuários.

Depois da revisão, entregue:
1. Problemas encontrados
2. Correções aplicadas
3. O que ainda precisa ser testado manualmente
4. Checklist final para publicar`,
  },
  {
    n: 11,
    title: "Validar com 10 pessoas",
    purpose: "Serve para testar se pessoas reais entendem e querem usar o app.",
    when: "Use depois que a primeira versão estiver pronta.",
    where:
      "Cole no Lovable se quiser criar uma página ou seção de validação, ou use como orientação.",
    result: "O Lovable pode ajudar a criar formulário, página de feedback ou checklist.",
    content: `Crie uma estrutura simples para validar este app com 10 usuários reais.

App:
[descreva o app]

Público:
[quem deve testar]

Crie:
1. Página ou seção de feedback
2. Perguntas simples para o usuário
3. Formulário de avaliação
4. Campo para nota de 0 a 10
5. Campo para sugestão
6. Checklist de tarefas que o usuário deve fazer
7. Mensagem de convite
8. Mensagem de agradecimento

Perguntas:
1. Você entendeu para que serve o app?
2. Conseguiu usar sem ajuda?
3. O que ficou confuso?
4. Você usaria de novo?
5. Você pagaria por isso?
6. O que melhoraria primeiro?

Regras:
- Não complicar.
- Coletar feedback simples.
- Ajudar a decidir se vale continuar.`,
  },
  {
    n: 12,
    title: "Melhorar depois do feedback",
    purpose: "Serve para transformar comentários dos usuários em melhorias reais.",
    when: "Use depois de testar com pessoas.",
    where: "Cole no Lovable com os feedbacks recebidos.",
    result: "O Lovable deve priorizar melhorias e aplicar as mais importantes.",
    content: `Analise os feedbacks abaixo e melhore o app com prioridade.

Feedbacks:
[cole aqui os feedbacks dos usuários]

Quero que você:
1. Identifique os problemas mais repetidos.
2. Separe problema grave de opinião isolada.
3. Diga o que corrigir primeiro.
4. Melhore a experiência do usuário.
5. Melhore textos confusos.
6. Não adicione funcionalidades grandes.
7. Preserve o MVP simples.
8. Explique o que foi alterado.

Critério:
Só faça mudanças que ajudem o usuário a completar a ação principal do app.`,
  },
];

const progressItems = [
  "Copiei o Comando 1",
  "Colei no Lovable",
  "Recebi o plano do app",
  "Usei o Comando 2",
  "Criei a primeira versão",
  "Testei no celular",
  "Criei página de venda",
  "Testei com 10 pessoas",
  "Corrigi os primeiros erros",
  "Publiquei a primeira versão",
];

// ===================== Componente do comando =====================

function CommandCard({
  cmd,
  done,
  onToggle,
}: {
  cmd: Command;
  done: boolean;
  onToggle: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd.content);
      setCopied(true);
      toast.success(`Comando ${cmd.n} copiado. Agora cole no Lovable.`);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <GlassCard className="p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent font-heading font-bold flex items-center justify-center">
          {cmd.n}
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-lg leading-snug">
            Comando {cmd.n} — {cmd.title}
          </h3>
        </div>
      </div>

      <dl className="grid sm:grid-cols-2 gap-3 text-sm">
        {[
          ["Para que serve", cmd.purpose],
          ["Quando usar", cmd.when],
          ["Onde colar", cmd.where],
          ["Resultado esperado", cmd.result],
        ].map(([label, text]) => (
          <div key={label} className="rounded-lg bg-white/5 border border-white/10 p-3">
            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1">
              {label}
            </dt>
            <dd className="text-foreground/85 text-[13px] leading-snug">{text}</dd>
          </div>
        ))}
      </dl>

      <details className="group" open>
        <summary className="cursor-pointer text-[11px] uppercase tracking-wider text-muted-foreground/80 hover:text-accent transition select-none">
          Ver o comando
        </summary>
        <pre className="mt-2 text-[13px] text-foreground/85 whitespace-pre-wrap font-sans leading-6 bg-background/40 border border-white/5 rounded-lg p-3 max-h-80 overflow-y-auto">
{cmd.content}
        </pre>
      </details>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-white/5">
        <button
          onClick={copy}
          className="btn-primary flex-1 justify-center"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copiado" : "Copiar comando"}
        </button>
        <label className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none px-3 py-2 rounded-lg border border-white/10">
          <input
            type="checkbox"
            checked={done}
            onChange={onToggle}
            className="accent-accent"
          />
          Já usei este comando
        </label>
      </div>
    </GlassCard>
  );
}

// ===================== Página =====================

export default function Entrega() {
  const navigate = useNavigate();
  const auth = useAuthState();

  const [stepsDone, setStepsDone] = useState<boolean[]>(() => commands.map(() => false));
  const [progress, setProgress] = useState<boolean[]>(() => progressItems.map(() => false));

  useEffect(() => {
    try {
      const a = localStorage.getItem(STORAGE_STEPS);
      if (a) {
        const parsed = JSON.parse(a);
        if (Array.isArray(parsed) && parsed.length === commands.length)
          setStepsDone(parsed.map(Boolean));
      }
      const b = localStorage.getItem(STORAGE_PROGRESS);
      if (b) {
        const parsed = JSON.parse(b);
        if (Array.isArray(parsed) && parsed.length === progressItems.length)
          setProgress(parsed.map(Boolean));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STEPS, JSON.stringify(stepsDone));
    } catch {
      /* ignore */
    }
  }, [stepsDone]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(progress));
    } catch {
      /* ignore */
    }
  }, [progress]);

  const doneCount = useMemo(() => stepsDone.filter(Boolean).length, [stepsDone]);

  const logout = async () => {
    await clearSession();
    navigate("/login");
  };

  // ---------- AUTH GATES ----------
  if (auth.status === "loading") {
    return (
      <Section>
        <div className="max-w-md mx-auto text-center py-16">
          <Loader2 className="animate-spin mx-auto text-accent" size={28} />
          <p className="text-sm text-muted-foreground mt-4">Verificando seu acesso…</p>
        </div>
      </Section>
    );
  }

  if (auth.status === "anonymous") {
    return (
      <Section>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="glass-strong p-8">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-accent" size={22} />
            </div>
            <h1 className="text-2xl font-heading font-bold mb-2">Área restrita</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Entre com o e-mail usado na compra para acessar seus comandos do Lovable.
            </p>
            <button onClick={() => navigate("/login")} className="btn-primary w-full">
              Entrar na área restrita
            </button>
          </div>
        </div>
      </Section>
    );
  }

  if (!auth.hasAccess && !auth.isAdmin) {
    return (
      <Section>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="glass-strong p-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-amber-400" size={22} />
            </div>
            <h1 className="text-2xl font-heading font-bold mb-2">
              Acesso ainda não liberado
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Sua conta foi criada, mas seu acesso aos materiais ainda não está ativo.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}
                className="btn-primary w-full justify-center"
              >
                <LifeBuoy size={14} /> Falar com suporte
              </button>
              <button
                onClick={logout}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-2"
              >
                <LogOut size={12} /> Sair desta conta
              </button>
            </div>
          </div>
        </div>
      </Section>
    );
  }

  const email = auth.email ?? "";

  const copyFirst = async () => {
    try {
      await navigator.clipboard.writeText(commands[0].content);
      toast.success("Comando 1 copiado. Agora abra o Lovable e cole na conversa do projeto.");
      const next = [...stepsDone];
      next[0] = true;
      setStepsDone(next);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const openLovable = () => window.open(LOVABLE_URL, "_blank", "noopener,noreferrer");

  return (
    <>
      {/* HERO */}
      <Section className="pt-10 pb-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <Logo size="md" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {email && (
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  {email}
                </span>
              )}
              {auth.isAdmin && (
                <button
                  onClick={() => navigate("/admin/acessos")}
                  className="px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent inline-flex items-center gap-1"
                >
                  <ShieldCheck size={12} /> Admin
                </button>
              )}
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 inline-flex items-center gap-1"
              >
                <LogOut size={12} /> Sair
              </button>
            </div>
          </div>

          <div className="glass-strong p-8 md:p-10 text-center">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Sparkles size={12} /> Sua área de entrega
            </span>
            <h1 className="text-3xl md:text-5xl font-heading font-bold leading-tight mb-3">
              Construa seu app no Lovable com estes comandos
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Siga a ordem abaixo. Copie um comando por vez, cole no Lovable e avance
              para o próximo passo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={copyFirst} className="btn-primary">
                <Copy size={16} /> Copiar primeiro comando
              </button>
              <button
                onClick={openLovable}
                className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/5 inline-flex items-center justify-center gap-2 text-sm"
              >
                <ExternalLink size={16} /> Abrir Lovable
              </button>
            </div>
            <div className="mt-6 text-xs text-muted-foreground inline-flex items-center gap-2">
              <ArrowDown size={12} /> Role para entender como usar
            </div>
          </div>
        </div>
      </Section>

      {/* O QUE VOCÊ COMPROU */}
      <Section className="py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-heading font-bold mb-2">O que você comprou</h2>
          <p className="text-muted-foreground mb-6">
            Você comprou um guia prático para transformar sua ideia em um app usando o
            Lovable. Aqui você encontra comandos prontos para copiar, colar e construir
            seu projeto passo a passo.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Copy,
                title: "Comandos prontos para Lovable",
                text: "Você não precisa inventar o que escrever. Basta copiar e colar.",
              },
              {
                icon: ListChecks,
                title: "Passo a passo guiado",
                text: "Use os comandos na ordem certa para não se perder.",
              },
              {
                icon: Layers,
                title: "Do plano ao app",
                text:
                  "Você vai criar estrutura, telas, banco, login, página de venda e entrega.",
              },
              {
                icon: Smartphone,
                title: "Validação simples",
                text: "No final, você testa com 10 pessoas antes de escalar.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <GlassCard key={title} className="p-5">
                <Icon className="text-accent mb-3" size={20} />
                <h3 className="font-heading font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      {/* COMO USAR ESTA PÁGINA */}
      <Section className="py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-heading font-bold mb-2">Como usar esta página</h2>
          <p className="text-muted-foreground mb-6">
            Funciona assim: leia o passo, copie o comando, cole no Lovable e espere ele
            construir. Depois volte aqui e siga o próximo comando.
          </p>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              ["Copie o comando", "Clique no botão copiar."],
              ["Cole no Lovable", "Abra o Lovable e cole o comando na conversa do projeto."],
              ["Espere o Lovable construir", "O Lovable vai criar ou alterar seu app."],
              ["Teste o que foi criado", "Clique nos botões, abra as telas e veja se funciona."],
              ["Volte para o próximo comando", "Continue até publicar sua primeira versão."],
            ].map(([title, text], i) => (
              <li
                key={title}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 text-accent text-sm font-bold flex items-center justify-center mb-2">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* COMANDOS */}
      <Section className="py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-heading font-bold">
                Passo a passo para construir no Lovable
              </h2>
              <p className="text-muted-foreground">
                Use estes comandos na ordem. Não pule etapas.
              </p>
            </div>
            <span className="text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              {doneCount}/{commands.length} comandos usados
            </span>
          </div>

          <div className="space-y-5">
            {commands.map((cmd, i) => (
              <CommandCard
                key={cmd.n}
                cmd={cmd}
                done={stepsDone[i]}
                onToggle={() =>
                  setStepsDone((prev) => {
                    const next = [...prev];
                    next[i] = !next[i];
                    return next;
                  })
                }
              />
            ))}
          </div>
        </div>
      </Section>

      {/* SE VOCÊ SE PERDER */}
      <Section className="py-10">
        <div className="max-w-3xl mx-auto">
          <GlassCard className="p-6 md:p-8 text-center">
            <h2 className="text-xl font-heading font-bold mb-2">
              Se você se perder, faça só isso
            </h2>
            <p className="text-muted-foreground mb-4">
              Não tente usar todos os comandos no mesmo dia. Comece pelo Comando 1.
              Depois use o Comando 2. Só avance quando entender o resultado.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm">
              <Sparkles size={14} /> Regra simples: um comando por vez.
            </div>
          </GlassCard>
        </div>
      </Section>

      {/* MEU PROGRESSO */}
      <Section className="py-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-heading font-bold mb-2">Meu progresso</h2>
          <p className="text-muted-foreground mb-6">
            Marque cada etapa conforme você avança. Salvamos automaticamente neste
            navegador.
          </p>
          <ul className="space-y-2">
            {progressItems.map((item, i) => (
              <li key={item}>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={progress[i]}
                    onChange={() =>
                      setProgress((prev) => {
                        const next = [...prev];
                        next[i] = !next[i];
                        return next;
                      })
                    }
                    className="accent-accent w-4 h-4"
                  />
                  <span
                    className={`text-sm ${
                      progress[i] ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* SUPORTE */}
      <Section className="py-10">
        <div className="max-w-3xl mx-auto">
          <GlassCard className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <h3 className="font-heading font-semibold mb-1">Travou em algum comando?</h3>
              <p className="text-sm text-muted-foreground">
                Fale com a gente e te ajudamos a destravar.
              </p>
            </div>
            <button
              onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}
              className="px-4 py-2.5 rounded-xl border border-white/15 hover:bg-white/5 inline-flex items-center gap-2 text-sm"
            >
              <LifeBuoy size={14} /> Falar com suporte
            </button>
          </GlassCard>
        </div>
      </Section>

      {/* RESGATAR CÓDIGO PREMIUM (FINAL) */}
      <Section className="py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <Gift className="mx-auto text-accent mb-3" size={22} />
            <h2 className="text-xl font-heading font-bold mb-1">
              Ativar ou estender acesso
            </h2>
            <p className="text-sm text-muted-foreground">
              Use esta área apenas se você recebeu um código de acesso.
            </p>
          </div>
          <GiftCodeRedemption />
        </div>
      </Section>
    </>
  );
}

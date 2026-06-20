import { useState } from "react";
import { toast } from "sonner";
import { SearchCheck, Copy, Check, ClipboardCheck, ListChecks, CheckCircle } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

const SECURITY_AGENT_PROMPT = `Estou usando a Fábrica de Apps com IA como guia para criar meu próprio aplicativo no Lovable.

Estou na etapa: Segurança do App.

Revise a segurança do app que estou criando no Lovable, não a plataforma Fábrica.

Me ajude a conferir:

1. Quais rotas do meu app são públicas e quais são restritas.
2. Como o login protege a área paga do meu projeto.
3. Se usuário sem login consegue chegar em conteúdo restrito.
4. Se usuário logado sem acesso consegue ver conteúdo premium.
5. Se o admin do meu app está protegido contra usuário comum.
6. Como os dados de usuário estão sendo protegidos.
7. Se existe risco de chave secreta exposta no frontend.
8. Se as regras de banco/RLS/policies reduzem risco de acesso indevido.
9. Se existe risco de alguém burlar o acesso pago.
10. O que eu preciso testar antes de publicar para deixar o app mais seguro e reduzir risco.

Use linguagem realista: "mais seguro", "reduzir risco", "proteger acesso", "testar antes de publicar". Não prometa app 100% seguro.

Não avance para outra etapa ainda. Primeiro me ajude a validar a segurança deste app.`;

const SECURITY_LOVABLE_PROMPT = `Estou usando a Fábrica de Apps com IA como guia, mas o projeto que deve ser revisado é este app atual que estou criando no Lovable.

Etapa atual: Segurança do App.

Revise a segurança deste projeto atual.

Verifique:

1. Se todas as rotas restritas estão realmente protegidas.
2. Se usuário sem login não consegue chegar em conteúdo restrito.
3. Se usuário logado sem acesso não consegue ver conteúdo premium.
4. Se o admin continua acessível apenas por admin.
5. Se não existe chave secreta exposta no frontend.
6. Se não foi criada nenhuma policy/grant permissivo sem necessidade.
7. Se o fluxo de login, acesso e admin continua íntegro.
8. O que precisa testar antes de publicar.

Não altere nada automaticamente sem explicar antes.

Entregue um relatório objetivo com:

* o que está correto
* o que está faltando
* o que precisa testar
* riscos encontrados
* próximo comando recomendado, se necessário

Use linguagem realista: "mais seguro", "reduzir risco", "proteger acesso", "testar antes de publicar". Não prometa app 100% seguro.`;

const agentPrompt = (moduleName: string) => `Estou usando a Fábrica de Apps com IA como guia para criar meu próprio aplicativo no Lovable.

Estou na etapa: ${moduleName}.

Quero revisar o app que estou criando, não a plataforma Fábrica de Apps.

Me ajude a conferir se tudo que esta etapa pediu foi realmente aplicado no meu projeto.

Analise comigo:

1. O que esta etapa deveria ter construído, organizado ou ajustado no meu app.
2. O que preciso conferir visualmente no projeto.
3. O que preciso testar como visitante, usuário comum, usuário com acesso, cliente ou admin, se fizer sentido.
4. O que pode estar incompleto, confuso, quebrado ou mal aplicado.
5. Quais sinais mostram que esta etapa está pronta.
6. Qual próximo comando devo enviar ao Lovable se algo estiver faltando.

Não avance para outra etapa ainda. Primeiro me ajude a validar esta etapa do meu app.`;

const lovablePrompt = (moduleName: string) => `Estou usando a Fábrica de Apps com IA como guia, mas o projeto que deve ser revisado é este app atual que estou criando no Lovable.

Etapa atual: ${moduleName}.

Revise se tudo que esta etapa pediu foi realmente aplicado neste projeto.

Analise:

1. O que esta etapa deveria ter implementado, organizado ou ajustado.
2. Onde isso aparece no app atual.
3. Se existe algo incompleto, quebrado, duplicado, confuso ou desalinhado.
4. Se a experiência funciona no desktop e no mobile.
5. Se há risco de quebrar login, banco, acesso, admin, checkout, entrega ou progresso, quando fizer sentido.
6. O que ainda precisa ser corrigido antes de avançar.

Não altere nada automaticamente sem explicar antes.

Entregue um relatório objetivo com:

* o que está correto
* o que está faltando
* o que precisa testar
* riscos encontrados
* próximo comando recomendado, se necessário`;

export function ModuleReviewCard({
  moduleName,
  isSecurity = false,
}: {
  moduleName: string;
  isSecurity?: boolean;
}) {
  const [okAgent, setOkAgent] = useState(false);
  const [okLovable, setOkLovable] = useState(false);

  const agentText = isSecurity ? SECURITY_AGENT_PROMPT : agentPrompt(moduleName);
  const lovableText = isSecurity ? SECURITY_LOVABLE_PROMPT : lovablePrompt(moduleName);

  const copyTo = async (
    text: string,
    setOk: (v: boolean) => void,
    label: string,
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      toast.success(`Revisão copiada! Cole no ${label}.`);
      setTimeout(() => setOk(false), 1600);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const blocks = [
    {
      icon: ClipboardCheck,
      title: "O que este módulo pediu?",
      text: "Revise os comandos, telas, regras ou ajustes trabalhados nesta etapa.",
    },
    {
      icon: ListChecks,
      title: "O que foi aplicado no app?",
      text: "Confira se as mudanças aparecem no aplicativo e se estão funcionando de verdade.",
    },
    {
      icon: CheckCircle,
      title: "O que ainda precisa corrigir?",
      text: "Identifique o que ficou incompleto, confuso, quebrado ou precisa de novo comando.",
    },
  ];

  return (
    <GlassCard className="mt-8 p-5 md:p-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
          <SearchCheck size={18} />
        </div>
        <div className="min-w-0">
          <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
            Revisar esta etapa no app
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Depois de aplicar os comandos, revise se esta etapa realmente
            apareceu no app. Você pode pedir essa revisão ao Agente Arquiteto
            ou ao próprio Lovable.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 mb-4">
        {blocks.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.title}
              className="rounded-lg border border-white/10 bg-white/5 p-3"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={14} className="text-accent shrink-0" />
                <h4 className="text-sm font-semibold">{b.title}</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{b.text}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => copyTo(agentText, setOkAgent, "Agente Arquiteto")}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition ${
            okAgent
              ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
              : "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
          }`}
        >
          {okAgent ? <Check size={14} /> : <Bot size={14} />}
          {okAgent ? "Copiado!" : "Revisar com o Agente"}
        </button>
        <button
          onClick={() => copyTo(lovableText, setOkLovable, "Lovable")}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition ${
            okLovable
              ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
              : "border-white/15 bg-white/5 text-foreground hover:bg-white/10"
          }`}
        >
          {okLovable ? <Check size={14} /> : <Copy size={14} />}
          {okLovable ? "Copiado!" : "Pedir revisão ao Lovable"}
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
        Use o primeiro botão para conversar com o Agente. Use o segundo botão quando
        quiser que o Lovable revise o projeto atual.
      </p>
    </GlassCard>
  );
}

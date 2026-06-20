import { useState } from "react";
import { toast } from "sonner";
import { SearchCheck, Copy, Check, ClipboardCheck, ListChecks, CheckCircle } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

const SECURITY_AGENT_PROMPT = `Estou na etapa Segurança do App da Fábrica de Apps com IA.

Quero que você me ajude a revisar se meu app está mais seguro antes de avançar.

Analise comigo:

1. Quais rotas são públicas e quais são restritas.
2. O fluxo de login e como ele protege a área paga.
3. Se usuário sem login consegue chegar em conteúdo restrito.
4. Se usuário logado sem acesso consegue ver conteúdo premium.
5. Se o admin está protegido contra usuário comum.
6. Como os dados de usuário estão sendo protegidos.
7. Se existe risco de chave secreta exposta no frontend.
8. Se as regras de banco/RLS reduzem risco de acesso indevido.
9. Se existe risco de alguém burlar o acesso pago.
10. O que eu preciso testar antes de publicar.

Não avance para outro módulo ainda. Primeiro me ajude a validar esta etapa.`;

const SECURITY_LOVABLE_PROMPT = `Revise a etapa Segurança do App da Fábrica de Apps com IA no projeto atual.

Verifique no app:

1. Se todas as rotas restritas estão realmente protegidas.
2. Se usuário sem acesso não consegue ver conteúdo premium.
3. Se o admin continua acessível apenas por admin.
4. Se não existe chave secreta exposta no frontend.
5. Se não foi criada nenhuma policy/grant permissivo sem necessidade.
6. Se o fluxo de login, acesso e admin continua íntegro.

Não faça alterações automaticamente sem explicar antes.

Entregue um relatório objetivo com:

* o que está correto
* o que está faltando
* o que precisa testar
* riscos encontrados
* próximo comando recomendado, se necessário.

Use linguagem realista: "mais seguro", "reduz risco", "protege acesso", "testar antes de publicar". Não prometa app 100% seguro.`;

const agentPrompt = (moduleName: string) => `Estou na etapa ${moduleName} da Fábrica de Apps com IA.

Quero que você me ajude a revisar se tudo que este módulo pediu foi realmente aplicado no meu app.

Analise comigo:

1. O que este módulo deveria ter construído ou ajustado.
2. O que preciso conferir visualmente no app.
3. O que preciso testar como visitante, usuário comum, usuário com acesso ou admin, se fizer sentido.
4. O que pode estar incompleto ou mal aplicado.
5. Quais sinais mostram que esta etapa está pronta.
6. Qual próximo comando devo enviar ao Lovable se algo estiver faltando.

Não avance para outro módulo ainda. Primeiro me ajude a validar esta etapa.`;

const lovablePrompt = (moduleName: string) => `Revise a etapa ${moduleName} da Fábrica de Apps com IA no app atual.

Verifique se tudo que foi solicitado/construído neste módulo foi realmente aplicado no projeto.

Analise:

1. O que esta etapa deveria ter implementado.
2. Onde isso aparece no app.
3. Se existe algo incompleto, quebrado, duplicado ou confuso.
4. Se a experiência funciona no desktop e no mobile.
5. Se há risco de quebrar login, banco, acesso, admin, checkout ou progresso.
6. O que ainda precisa ser corrigido antes de avançar.

Não faça alterações automaticamente sem explicar antes.
Entregue um relatório objetivo com:

* o que está correto
* o que está faltando
* o que precisa testar
* riscos encontrados
* próximo comando recomendado, se necessário.`;

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
            Antes de avançar, peça para a IA conferir se tudo que foi construído neste
            módulo realmente aparece e funciona no aplicativo.
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
          {okAgent ? <Check size={14} /> : <Copy size={14} />}
          {okAgent ? "Copiado!" : "Copiar para o Agente Arquiteto"}
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
          {okLovable ? "Copiado!" : "Copiar para o Lovable revisar"}
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
        Use o primeiro botão para conversar com o Agente. Use o segundo botão quando
        quiser que o Lovable revise o projeto atual.
      </p>
    </GlassCard>
  );
}

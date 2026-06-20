import { useState } from "react";
import { toast } from "sonner";
import { SearchCheck, Copy, Check, ClipboardCheck, ListChecks, CheckCircle } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

const SECURITY_PROMPT = `Estou na etapa Segurança do App da Fábrica de Apps com IA. Me ajude a revisar se meu app está protegido antes de avançar.

Quero conferir:

1. Quais áreas estão públicas.
2. Quais áreas estão restritas.
3. Se usuário sem login é bloqueado.
4. Se usuário sem acesso não vê conteúdo pago.
5. Se admin está protegido.
6. Se dados de usuários estão protegidos.
7. Se há risco de chave secreta exposta.
8. Se há risco de alguém burlar o acesso pago.
9. O que já foi aplicado.
10. O que ainda falta corrigir.

Considere que estou criando meu app no Lovable e quero reduzir risco de invasão, vazamento ou acesso indevido.`;

const genericPrompt = (moduleName: string) => `Estou na etapa ${moduleName} da Fábrica de Apps com IA. Me ajude a revisar meu app antes de avançar.

Quero conferir:

1. O que já foi aplicado corretamente.
2. O que ainda falta fazer.
3. O que pode estar quebrado.
4. O que preciso testar como usuária real.
5. Se posso avançar para o próximo módulo ou se preciso corrigir algo antes.

Considere que estou criando meu app no Lovable e quero evitar avançar com erros.`;

export function ModuleReviewCard({
  moduleName,
  isSecurity = false,
}: {
  moduleName: string;
  isSecurity?: boolean;
}) {
  const [ok, setOk] = useState(false);
  const prompt = isSecurity ? SECURITY_PROMPT : genericPrompt(moduleName);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setOk(true);
      toast.success("Revisão copiada! Cole no Agente Arquiteto.");
      setTimeout(() => setOk(false), 1600);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const blocks = [
    {
      icon: ClipboardCheck,
      title: "O que já foi aplicado?",
      text: "Revise no app se as mudanças desta etapa realmente aparecem e funcionam.",
    },
    {
      icon: ListChecks,
      title: "O que ainda falta?",
      text: "Liste o que ficou incompleto, confuso ou precisa de ajuste antes de seguir.",
    },
    {
      icon: CheckCircle,
      title: "O que preciso testar?",
      text: "Teste a etapa como visitante, usuária real, compradora ou admin, quando fizer sentido.",
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
            Revisão dentro do app
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Antes de avançar, confira se esta etapa foi realmente aplicada no app que você
            está criando.
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

      <button
        onClick={copy}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition ${
          ok
            ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
            : "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
        }`}
      >
        {ok ? <Check size={14} /> : <Copy size={14} />}
        {ok ? "Copiado!" : "Copiar revisão para o Agente"}
      </button>
      <p className="text-[11px] text-muted-foreground mt-2">
        Copia um prompt pronto com o nome desta etapa para o Agente Arquiteto.
      </p>
    </GlassCard>
  );
}

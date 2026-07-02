import { AlertTriangle, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { PromptsExecutarEtapa } from "@/components/entrega/PromptsExecutarEtapa";
import { PROMPTS_ERROS } from "@/data/promptsPosAppPronto";

type ErroItem = {
  titulo: string;
  problema: string;
  solucao: string;
};

const ERROS: ErroItem[] = [
  {
    titulo: "Erro 1 — Achar que app web não é app de verdade",
    problema:
      "A pessoa pode desvalorizar um app que já funciona, já pode ser vendido, testado e acessado por link.",
    solucao:
      "Começar como web app publicado, validar com usuárias reais e só depois decidir se vale evoluir para PWA ou loja.",
  },
  {
    titulo: "Erro 2 — Querer ir para App Store ou Google Play antes de validar",
    problema:
      "Loja não garante vendas, downloads nem validação. Além disso, pode envolver custo, análise, ajustes e reprovação.",
    solucao: "Validar primeiro a oferta, o uso e a experiência mobile.",
  },
  {
    titulo: "Erro 3 — Empacotar app com bugs",
    problema:
      "Se o app já está quebrado como web app, ele continuará quebrado como app empacotado.",
    solucao:
      "Corrigir bugs principais antes de pensar em PWA, Android, iOS ou loja.",
  },
  {
    titulo: "Erro 4 — Confundir PWA, app empacotado e app nativo",
    problema:
      "A pessoa pode pedir a coisa errada para o Lovable, gastar energia no caminho errado ou criar expectativas irreais.",
    solucao:
      "Entender que web app, PWA, app empacotado e app nativo são caminhos diferentes.",
  },
  {
    titulo: "Erro 5 — Publicar sem política de privacidade ou suporte",
    problema:
      "Apps com login, dados de usuárias, checkout ou coleta de informações precisam de mais cuidado com transparência, suporte e confiança.",
    solucao:
      "Organizar política de privacidade, termos, suporte e páginas essenciais antes de pensar em loja.",
  },
  {
    titulo: "Erro 6 — Achar que loja garante autoridade",
    problema:
      "Estar na loja não compensa app ruim, oferta confusa ou falta de validação.",
    solucao:
      "Construir valor real, melhorar a experiência e validar com pessoas reais.",
  },
  {
    titulo: "Erro 7 — Pedir versão nativa cedo demais",
    problema:
      "Versão nativa pode exigir mais investimento, manutenção e complexidade técnica.",
    solucao:
      "Deixar nativo como evolução futura, quando houver demanda real, receita, usuárias ativas ou necessidade de recursos avançados do celular.",
  },
];

export function ErrosPosAppPronto() {
  return (
    <div className="mt-8">
      <GlassCard className="p-5 md:p-6 border-amber-400/30 bg-gradient-to-br from-amber-400/10 via-white/[0.03] to-transparent">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={18} className="text-amber-300" />
          <h3 className="font-heading font-semibold text-base md:text-lg">
            Erros comuns depois do app pronto
          </h3>
        </div>
        <p className="text-sm text-foreground/85 leading-relaxed mb-5">
          Depois que o app fica pronto, é normal querer ir direto para App Store,
          Google Play ou versão nativa. Mas essa decisão precisa ser tomada com
          estratégia. Publicar cedo demais, empacotar um app com bugs ou tentar
          parecer &ldquo;mais profissional&rdquo; antes de validar pode gerar
          retrabalho, custo e frustração.
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          {ERROS.map((e) => (
            <div
              key={e.titulo}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2"
            >
              <h4 className="font-heading font-semibold text-sm text-amber-100">
                {e.titulo}
              </h4>
              <p className="text-xs md:text-sm text-foreground/80 leading-relaxed">
                <strong className="text-amber-200/90">Por que é um problema: </strong>
                {e.problema}
              </p>
              <p className="text-xs md:text-sm text-foreground/85 leading-relaxed flex gap-1.5">
                <ArrowRight size={14} className="text-emerald-300 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-emerald-200/90">O que fazer no lugar: </strong>
                  {e.solucao}
                </span>
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="mt-6">
        <h4 className="font-heading font-semibold text-sm md:text-base mb-2 text-foreground/90">
          Prompts para corrigir estes erros
        </h4>
        <PromptsExecutarEtapa prompts={PROMPTS_ERROS} />
      </div>
    </div>
  );
}


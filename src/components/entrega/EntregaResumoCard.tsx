import { useMemo } from "react";
import { ShoppingCart, AlertTriangle, ShieldCheck, Check, X } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useProjectContext, type ProjectContext } from "@/hooks/useProjectContext";

/**
 * Resumo seguro de checkout + entrega baseado no Contexto do Projeto em
 * foco. Não altera login, banco, área paga, admin ou o checkout real da
 * Fábrica de Apps. Apenas exibe sugestões para orientar a aluna a montar
 * o fluxo de pagamento e entrega do APP DELA.
 */

const SENSITIVE_NICHES: Array<{ key: string; label: string; words: string[] }> = [
  { key: "relacionamento", label: "Relacionamento e amor", words: ["amor", "relacionament", "casal", "namor", "afetiv", "casamento"] },
  { key: "saude", label: "Saúde e bem-estar", words: ["saúde", "saude", "emagrec", "cura", "doenç", "doenca", "ansiedad", "depress", "terap", "psico"] },
  { key: "dinheiro", label: "Dinheiro e investimento", words: ["dinheiro", "lucro", "renda", "investim", "trader", "trading", "cripto", "bitcoin", "rico"] },
  { key: "espiritual", label: "Espiritualidade e fé", words: ["espirit", "tarô", "taro", "oráculo", "oraculo", "anjo", "manifestaç"] },
];

const norm = (s: string) => s.toLowerCase();

function detectSensitive(ctx: ProjectContext) {
  const hay = norm([ctx.appName, ctx.appDoes, ctx.audience, ctx.problem, ctx.promise, ctx.productSold, ctx.notes].join(" "));
  return SENSITIVE_NICHES.filter((n) => n.words.some((w) => hay.includes(w)));
}

type Suggestion = {
  produto: string;
  modelo: string;
  preco: string;
  gatilho: string;
  entrega: string;
  cta: string;
  naoPrometer: string[];
};

const GENERIC_SAFE_AVOIDS = [
  "vendas garantidas",
  "resultado garantido",
  "qualquer ganho financeiro garantido",
];

function buildSuggestion(ctx: ProjectContext): Suggestion {
  const hay = norm(`${ctx.appName} ${ctx.appDoes} ${ctx.audience} ${ctx.problem} ${ctx.promise} ${ctx.productSold}`);
  const has = (...w: string[]) => w.some((x) => hay.includes(x));

  if (has("jogo do amor", "amor", "relacionament", "casal", "namor")) {
    return {
      produto: ctx.productSold?.trim() || "desbloqueio do resultado completo do Jogo do Amor",
      modelo: ctx.pricingModel?.trim() || "checkout externo simples ou link de pagamento (MVP)",
      preco: "R$ 17 a R$ 47 para teste inicial",
      gatilho: "após a usuária ver uma prévia ou mini-leitura gratuita",
      entrega: "leitura amorosa completa, resultado completo ou diagnóstico simbólico personalizado",
      cta: ctx.mainAction?.trim() || "Desbloquear meu resultado completo",
      naoPrometer: [
        "encontrar o amor garantido",
        "salvar qualquer relacionamento",
        "prever o futuro",
        "diagnóstico clínico ou psicológico",
        ...GENERIC_SAFE_AVOIDS,
      ],
    };
  }

  if (has("quiz", "diagnóstic", "diagnostic", "teste", "avaliaç")) {
    return {
      produto: ctx.productSold?.trim() || "desbloquear o resultado completo do quiz/diagnóstico",
      modelo: ctx.pricingModel?.trim() || "checkout externo simples ou link de pagamento (MVP)",
      preco: "R$ 9 a R$ 47 para teste inicial",
      gatilho: "após a pessoa ver uma prévia do resultado",
      entrega: "resultado completo + recomendações iniciais",
      cta: ctx.mainAction?.trim() || "Ver meu resultado completo",
      naoPrometer: GENERIC_SAFE_AVOIDS,
    };
  }

  return {
    produto: ctx.productSold?.trim() || "(defina o que vende em Contexto do meu app)",
    modelo: ctx.pricingModel?.trim() || "checkout externo simples ou link de pagamento (MVP)",
    preco: "(defina uma faixa inicial de teste no Contexto do meu app)",
    gatilho: "após a pessoa ver uma prévia, demonstração ou parte gratuita",
    entrega: ctx.promise?.trim() || "(descreva o que o comprador recebe ao concluir a compra)",
    cta: ctx.mainAction?.trim() || "Comprar agora",
    naoPrometer: GENERIC_SAFE_AVOIDS,
  };
}

const LEVELS: Array<{ tone: "ok" | "later" | "avoid"; title: string; desc: string }> = [
  {
    tone: "ok",
    title: "Recomendado para MVP",
    desc: "Checkout externo (Kiwify, Hotmart, Kirvano) ou link de pagamento (Mercado Pago, Stripe Payment Link). Rápido, seguro e sem código complexo.",
  },
  {
    tone: "later",
    title: "Usar depois",
    desc: "Integração automática com webhook do gateway para liberar acesso sem ação manual. Só vale a pena após validar venda.",
  },
  {
    tone: "avoid",
    title: "Evitar no começo",
    desc: "Checkout próprio complexo dentro do app (cartão, PIX, antifraude e webhooks construídos do zero). Alto risco para iniciantes.",
  },
];

const toneStyles: Record<"ok" | "later" | "avoid", { border: string; bg: string; text: string; icon: JSX.Element }> = {
  ok: {
    border: "border-emerald-400/30",
    bg: "bg-emerald-400/10",
    text: "text-emerald-100",
    icon: <Check size={14} className="text-emerald-300" />,
  },
  later: {
    border: "border-sky-400/30",
    bg: "bg-sky-400/10",
    text: "text-sky-100",
    icon: <ShieldCheck size={14} className="text-sky-300" />,
  },
  avoid: {
    border: "border-rose-400/30",
    bg: "bg-rose-400/10",
    text: "text-rose-100",
    icon: <X size={14} className="text-rose-300" />,
  },
};

export function EntregaResumoCard() {
  const { context, isFilled, openEditor } = useProjectContext();
  const suggestion = useMemo(() => buildSuggestion(context), [context]);
  const sensitive = useMemo(() => detectSensitive(context), [context]);

  return (
    <GlassCard className="mb-6 p-5 md:p-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
          <ShoppingCart size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
            Resumo de checkout e entrega{context.appName ? ` — ${context.appName}` : ""}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Crie um fluxo simples para receber pagamento, confirmar a compra,
            orientar o comprador e liberar o acesso certo sem expor material pago.
          </p>
        </div>
        {!isFilled && (
          <button
            type="button"
            onClick={openEditor}
            className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/15"
          >
            Preencher contexto
          </button>
        )}
      </div>

      <dl className="grid sm:grid-cols-2 gap-3 text-sm">
        {[
          ["Produto vendido", suggestion.produto],
          ["Modelo recomendado", suggestion.modelo],
          ["Preço inicial sugerido", suggestion.preco],
          ["Gatilho de compra", suggestion.gatilho],
          ["O que o comprador recebe", suggestion.entrega],
          ["CTA sugerido", suggestion.cta],
        ].map(([term, def]) => (
          <div key={term} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <dt className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">{term}</dt>
            <dd className="text-foreground/90 leading-relaxed">{def}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5">
        <div className="text-[11px] uppercase tracking-wider text-accent/90 mb-2">
          3 níveis de checkout
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {LEVELS.map((lv) => {
            const s = toneStyles[lv.tone];
            return (
              <div key={lv.title} className={`rounded-lg border ${s.border} ${s.bg} p-3 text-[13px] ${s.text}`}>
                <div className="flex items-center gap-2 font-semibold mb-1">
                  {s.icon}
                  {lv.title}
                </div>
                <div className="leading-relaxed">{lv.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-[13px] text-amber-100 flex items-start gap-2">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">O que não prometer no checkout/entrega:</div>
          <ul className="list-disc list-inside space-y-0.5">
            {suggestion.naoPrometer.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      {sensitive.length > 0 && (
        <div className="mt-3 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-[13px] text-rose-100 flex items-start gap-2">
          <ShieldCheck size={14} className="shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold mb-1">
              Nicho sensível detectado: {sensitive.map((s) => s.label).join(", ")}
            </div>
            Evite promessas absolutas de cura, ganho, sucesso, salvação,
            previsão ou transformação garantida. Entregue clareza, reflexão,
            organização ou experiência.
          </div>
        </div>
      )}

      <p className="mt-3 text-[12px] text-muted-foreground leading-relaxed">
        <strong className="text-foreground/90">Regra de proteção:</strong>{" "}
        nunca libere material pago antes da confirmação. Visitante sem compra
        não pode ver entrega, mesmo por URL direta.
      </p>
    </GlassCard>
  );
}

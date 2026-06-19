import { useMemo, useState } from "react";
import {
  Sparkles,
  DollarSign,
  AlertTriangle,
  ChevronDown,
  Copy,
  ExternalLink,
  Bot,
  Wallet,
  CreditCard,
  Sprout,
  Briefcase,
  Calculator,
  Coins,
} from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/GlassCard";
import { APP_CONFIG } from "@/config/appConfig";

const AGENT_PROMPT = `Estou criando um app e preciso definir como monetizar. Me ajude a escolher o melhor modelo de cobrança. Faça perguntas sobre: público, dor resolvida, entrega principal, frequência de uso, valor percebido, concorrentes, formato de acesso e se faz mais sentido venda única, assinatura, freemium, plano beta ou licença.`;

const GLOSSARY: [string, string][] = [
  ["Monetização", "Forma como seu app vai gerar dinheiro."],
  ["Venda única", "A pessoa paga uma vez para acessar."],
  ["Assinatura", "A pessoa paga todo mês ou todo ano para continuar usando."],
  ["Freemium", "Uma parte é grátis e recursos melhores são pagos."],
  ["Oferta", "O que a pessoa recebe, por qual valor e por que vale a pena."],
  ["Ticket", "Valor médio que uma pessoa paga pelo seu produto."],
  ["Preço de entrada", "Valor inicial mais acessível para validar compradores."],
  [
    "Plano beta",
    "Venda inicial para poucos usuários enquanto o app ainda está sendo validado.",
  ],
  ["Valor percebido", "O quanto a pessoa entende que aquilo vale para ela."],
];

type BillingModel = {
  title: string;
  icon: typeof Wallet;
  tone: string;
  when: string;
  examples: string[];
  range?: string;
  warning?: string;
};

const MODELS: BillingModel[] = [
  {
    title: "Venda única",
    icon: Wallet,
    tone: "border-accent/30 bg-accent/5",
    when: "Quando o app entrega algo fechado, simples ou pontual.",
    examples: [
      "relatório personalizado",
      "ferramenta simples",
      "acesso vitalício",
      "mini sistema",
      "leitura, diagnóstico ou análise",
    ],
    range: "R$ 27 a R$ 197, dependendo da entrega.",
  },
  {
    title: "Assinatura",
    icon: CreditCard,
    tone: "border-primary/30 bg-primary/5",
    when: "Quando o app tem uso contínuo, atualização frequente ou acompanhamento.",
    examples: [
      "área de membros",
      "ferramenta recorrente",
      "comunidade",
      "planner",
      "sistema com histórico",
    ],
    range: "R$ 19 a R$ 97 por mês para validar.",
  },
  {
    title: "Freemium",
    icon: Sprout,
    tone: "border-emerald-400/30 bg-emerald-400/5",
    when: "Quando você quer atrair usuários grátis e vender recursos avançados depois.",
    examples: [
      "limite de uso grátis",
      "relatório básico grátis",
      "versão premium paga",
      "recursos extras",
    ],
    warning: "Não entregue tudo grátis.",
  },
  {
    title: "Beta pago",
    icon: Sparkles,
    tone: "border-amber-400/30 bg-amber-400/5",
    when: "Quando o app ainda está em validação, mas já entrega valor.",
    examples: [
      "primeiros 10 compradores",
      "acesso fundador",
      "valor promocional inicial",
      "feedback em troca de desconto",
    ],
    range: "R$ 17 a R$ 97 para testar interesse.",
  },
  {
    title: "Licença para profissionais",
    icon: Briefcase,
    tone: "border-yellow-500/30 bg-yellow-500/5",
    when: "Quando o app ajuda outras pessoas a trabalharem ou atenderem clientes.",
    examples: [
      "terapeutas",
      "consultoras",
      "tarólogas",
      "social media",
      "pequenas empresas",
    ],
    range: "R$ 97 a R$ 497 ou assinatura anual.",
  },
];

const REFERENCE_RANGES: { title: string; range: string }[] = [
  { title: "App simples ou diagnóstico pontual", range: "R$ 17 a R$ 47" },
  { title: "App com entrega personalizada", range: "R$ 47 a R$ 197" },
  { title: "App profissional para uso recorrente", range: "R$ 19 a R$ 97/mês" },
  { title: "App para profissionais usarem com clientes", range: "R$ 97 a R$ 497" },
  { title: "Beta pago para validar", range: "R$ 17 a R$ 97" },
];

const TUTORIAL_STEPS = [
  "Entenda o que seu app entrega",
  "Escolha o modelo de cobrança",
  "Defina uma faixa de valor inicial",
  "Crie uma oferta simples",
  "Teste com pessoas reais antes de escalar",
];

type CalcState = {
  tipo: string;
  publico: string;
  dor: string;
  resultado: string;
  frequencia: "pontual" | "recorrente" | "intensivo" | "";
  urgencia: "baixa" | "media" | "alta" | "";
  economia: "tempo" | "dinheiro" | "esforco" | "nenhum" | "";
  suporte: "sim" | "nao" | "";
  atualizacao: "sim" | "nao" | "";
  estagio: "mvp" | "beta" | "final" | "";
};

const INITIAL_CALC: CalcState = {
  tipo: "",
  publico: "",
  dor: "",
  resultado: "",
  frequencia: "",
  urgencia: "",
  economia: "",
  suporte: "",
  atualizacao: "",
  estagio: "",
};

function recommend(state: CalcState):
  | { model: string; range: string; reason: string; next: string }
  | null {
  const filled = Object.values(state).filter((v) => v && v.trim().length > 0).length;
  if (filled < 5) return null;

  const recorrente = state.frequencia === "recorrente" || state.frequencia === "intensivo";
  const urgente = state.urgencia === "alta";
  const profissional =
    /profissional|terapeuta|consultor|social media|clínica|empresa/i.test(state.publico) ||
    state.economia === "dinheiro";

  let model = "Venda única";
  let range = "R$ 27 a R$ 97";
  let reason = "Seu app entrega uma solução pontual e ainda precisa ser validado com compradores reais.";

  if (state.estagio === "beta" || state.estagio === "mvp") {
    model = "Beta pago";
    range = "R$ 17 a R$ 97";
    reason =
      "Seu app ainda está em validação. Um beta pago testa interesse real sem prometer entrega final.";
  } else if (profissional) {
    model = "Licença para profissionais";
    range = "R$ 97 a R$ 497";
    reason =
      "O app ajuda profissionais a atenderem clientes. Faz sentido cobrar valor proporcional ao uso profissional.";
  } else if (recorrente && state.atualizacao === "sim") {
    model = "Assinatura";
    range = "R$ 19 a R$ 97 por mês";
    reason =
      "O uso é contínuo e há atualização frequente. Assinatura sustenta o app no tempo.";
  } else if (urgente) {
    model = "Venda única";
    range = "R$ 47 a R$ 197";
    reason =
      "A dor é urgente e a entrega é direta. Venda única funciona bem para esse tipo de decisão.";
  }

  return {
    model,
    range,
    reason,
    next: "Teste essa oferta com 10 pessoas reais antes de escalar.",
  };
}

const copyToClipboard = async (text: string, successMsg: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMsg);
  } catch {
    toast.error("Não foi possível copiar. Selecione e copie manualmente.");
  }
};

export const MonetizacaoIntro = () => {
  const [showGlossary, setShowGlossary] = useState(false);
  const [calc, setCalc] = useState<CalcState>(INITIAL_CALC);
  const reco = useMemo(() => recommend(calc), [calc]);

  const setField = <K extends keyof CalcState>(k: K, v: CalcState[K]) =>
    setCalc((p) => ({ ...p, [k]: v }));

  return (
    <section className="mb-8 space-y-6">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent p-5 md:p-8 neon-shadow">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <DollarSign size={12} /> Monetização — Módulo Premium
        </span>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gradient leading-tight mb-2">
          Monetize seu app com clareza
        </h2>
        <p className="text-sm md:text-base text-foreground/85 max-w-3xl mb-4 leading-relaxed">
          Antes de criar checkout, você precisa decidir como seu app vai ganhar
          dinheiro, por quanto vender e qual oferta faz sentido para o seu
          público.
        </p>
        <div className="rounded-xl border border-amber-400/25 bg-amber-400/5 p-4 text-[13px] md:text-sm text-amber-100/95 leading-relaxed">
          Não existe app pronto para vender sem uma decisão de monetização. Aqui
          você vai escolher o modelo de cobrança, definir uma faixa de valor e
          preparar um teste real com possíveis compradores.
        </div>
      </div>

      {/* AVISOS */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-rose-300 shrink-0 mt-0.5" />
          <p className="text-[13px] md:text-sm text-rose-100/95 leading-snug">
            <strong className="text-rose-200">Não escolha o valor pelo medo.</strong>{" "}
            Escolha pelo valor percebido, pela dor que o app resolve, pelo público
            e pelo formato da entrega.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
          <AlertTriangle size={14} className="text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[12px] md:text-[13px] text-foreground/80 leading-snug">
            Preço não é promessa de resultado. O valor precisa estar conectado ao
            que o app entrega, à clareza da oferta e ao teste com pessoas reais.
          </p>
        </div>
      </div>

      {/* MINI TUTORIAL */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-[11px] uppercase tracking-wider text-accent mb-3">
          Como usar este módulo
        </h3>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {TUTORIAL_STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 text-[12px] md:text-[13px] text-foreground/90">
                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                {s}
              </div>
              {i < TUTORIAL_STEPS.length - 1 && (
                <span className="text-muted-foreground/50 hidden md:inline">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BOTÃO AJUDA */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => copyToClipboard(AGENT_PROMPT, "Prompt copiado. Cole no Agente Arquiteto.")}
          className="btn-primary text-sm min-h-[44px]"
        >
          <Copy size={14} /> Não sei por quanto vender meu app
        </button>
        {APP_CONFIG.GPT_AGENT_URL && (
          <a
            href={APP_CONFIG.GPT_AGENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 min-h-[44px] rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
          >
            <Bot size={14} /> Abrir Agente Arquiteto <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* MICROGLOSSÁRIO */}
      <div className="rounded-xl border border-white/10 bg-white/5">
        <button
          type="button"
          onClick={() => setShowGlossary((v) => !v)}
          className="w-full flex items-center justify-between gap-3 p-4 text-left min-h-[48px]"
        >
          <span className="text-sm font-semibold text-foreground/90">
            Não entendi uma palavra
          </span>
          <ChevronDown
            size={16}
            className={`text-muted-foreground transition-transform ${
              showGlossary ? "rotate-180" : ""
            }`}
          />
        </button>
        {showGlossary && (
          <dl className="px-4 pb-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
            {GLOSSARY.map(([term, def]) => (
              <div key={term} className="flex gap-2">
                <dt className="text-accent font-semibold shrink-0">{term}:</dt>
                <dd className="text-foreground/80">{def}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {/* MODELOS DE COBRANÇA */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Coins size={14} className="text-accent" />
          <h3 className="text-[11px] uppercase tracking-wider text-accent">
            Modelos de cobrança
          </h3>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {MODELS.map((m) => {
            const Icon = m.icon;
            return (
              <GlassCard key={m.title} className={`p-4 border ${m.tone}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className="text-accent" />
                  <h4 className="font-heading font-semibold text-sm">{m.title}</h4>
                </div>
                <p className="text-[13px] text-foreground/85 leading-snug mb-3">
                  <span className="text-muted-foreground">Quando usar: </span>
                  {m.when}
                </p>
                <ul className="text-[12px] text-foreground/75 space-y-0.5 mb-3 list-disc list-inside">
                  {m.examples.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
                {m.range && (
                  <div className="text-[12px] rounded-lg border border-accent/25 bg-accent/5 px-3 py-2 text-accent">
                    Faixa inicial sugerida: {m.range}
                  </div>
                )}
                {m.warning && (
                  <div className="text-[12px] rounded-lg border border-rose-400/25 bg-rose-400/5 px-3 py-2 text-rose-200">
                    Cuidado: {m.warning}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* CALCULADORA */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Calculator size={14} className="text-accent" />
          <h3 className="text-[11px] uppercase tracking-wider text-accent">
            Calculadora simples de preço
          </h3>
        </div>
        <GlassCard className="p-5 space-y-4">
          <p className="text-[12px] text-muted-foreground">
            Preencha o que souber. A recomendação é um ponto de partida, não uma
            regra. Sempre teste com pessoas reais.
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <CalcInput
              label="Tipo de app"
              value={calc.tipo}
              onChange={(v) => setField("tipo", v)}
              placeholder="ex: ferramenta de diagnóstico"
            />
            <CalcInput
              label="Público"
              value={calc.publico}
              onChange={(v) => setField("publico", v)}
              placeholder="ex: terapeutas iniciantes"
            />
            <CalcInput
              label="Dor que resolve"
              value={calc.dor}
              onChange={(v) => setField("dor", v)}
              placeholder="ex: não saber precificar atendimento"
            />
            <CalcInput
              label="Resultado entregue"
              value={calc.resultado}
              onChange={(v) => setField("resultado", v)}
              placeholder="ex: relatório com sugestão"
            />
            <CalcSelect
              label="Frequência de uso"
              value={calc.frequencia}
              onChange={(v) => setField("frequencia", v as CalcState["frequencia"])}
              options={[
                ["", "Selecione"],
                ["pontual", "Pontual"],
                ["recorrente", "Recorrente"],
                ["intensivo", "Intensivo / diário"],
              ]}
            />
            <CalcSelect
              label="Nível de urgência da dor"
              value={calc.urgencia}
              onChange={(v) => setField("urgencia", v as CalcState["urgencia"])}
              options={[
                ["", "Selecione"],
                ["baixa", "Baixa"],
                ["media", "Média"],
                ["alta", "Alta"],
              ]}
            />
            <CalcSelect
              label="O app economiza..."
              value={calc.economia}
              onChange={(v) => setField("economia", v as CalcState["economia"])}
              options={[
                ["", "Selecione"],
                ["tempo", "Tempo"],
                ["dinheiro", "Dinheiro"],
                ["esforco", "Esforço"],
                ["nenhum", "Nenhum claro"],
              ]}
            />
            <CalcSelect
              label="Tem suporte incluso?"
              value={calc.suporte}
              onChange={(v) => setField("suporte", v as CalcState["suporte"])}
              options={[
                ["", "Selecione"],
                ["sim", "Sim"],
                ["nao", "Não"],
              ]}
            />
            <CalcSelect
              label="Terá atualização contínua?"
              value={calc.atualizacao}
              onChange={(v) => setField("atualizacao", v as CalcState["atualizacao"])}
              options={[
                ["", "Selecione"],
                ["sim", "Sim"],
                ["nao", "Não"],
              ]}
            />
            <CalcSelect
              label="Estágio atual"
              value={calc.estagio}
              onChange={(v) => setField("estagio", v as CalcState["estagio"])}
              options={[
                ["", "Selecione"],
                ["mvp", "MVP"],
                ["beta", "Beta"],
                ["final", "Versão final"],
              ]}
            />
          </div>

          {reco ? (
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 space-y-1.5">
              <div className="text-[11px] uppercase tracking-wider text-accent mb-1">
                Recomendação
              </div>
              <p className="text-sm text-foreground/95">
                <strong>Modelo recomendado:</strong> {reco.model}.
              </p>
              <p className="text-sm text-foreground/90">
                <strong>Faixa inicial para testar:</strong> {reco.range}.
              </p>
              <p className="text-[13px] text-foreground/80">
                <strong>Motivo:</strong> {reco.reason}
              </p>
              <p className="text-[13px] text-accent">
                <strong>Próximo passo:</strong> {reco.next}
              </p>
              <p className="text-[11px] text-muted-foreground pt-1">
                Esta é uma orientação inicial. Não há garantia de venda. Valide com
                pessoas reais.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-[12px] text-muted-foreground">
              Preencha pelo menos 5 campos para ver uma recomendação.
            </div>
          )}
        </GlassCard>
      </div>
    </section>
  );
};

export const FaixasReferencia = () => (
  <section className="mt-8 space-y-3">
    <div className="flex items-center gap-2 px-1">
      <Coins size={14} className="text-accent" />
      <h3 className="text-[11px] uppercase tracking-wider text-accent">
        Faixas rápidas de referência
      </h3>
    </div>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
      {REFERENCE_RANGES.map((r) => (
        <GlassCard key={r.title} className="p-4">
          <h4 className="font-heading font-semibold text-sm mb-1">{r.title}</h4>
          <p className="text-[13px] text-accent">Faixa: {r.range}</p>
        </GlassCard>
      ))}
    </div>
    <div className="rounded-xl border border-amber-400/25 bg-amber-400/5 p-3 text-[12px] text-amber-100/90">
      Essas faixas são pontos de partida, não regra fixa. O teste com pessoas
      reais é o que confirma o valor.
    </div>
  </section>
);

const CalcInput = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <label className="flex flex-col gap-1 text-[12px]">
    <span className="text-muted-foreground">{label}</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="px-3 py-2 rounded-lg bg-background/60 border border-white/10 text-sm focus:outline-none focus:border-accent/50"
    />
  </label>
);

const CalcSelect = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) => (
  <label className="flex flex-col gap-1 text-[12px]">
    <span className="text-muted-foreground">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-lg bg-background/60 border border-white/10 text-sm focus:outline-none focus:border-accent/50"
    >
      {options.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  </label>
);

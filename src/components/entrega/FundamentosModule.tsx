import { useState } from "react";
import {
  BookOpen,
  Sparkles,
  Compass,
  Workflow,
  ShieldAlert,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Clock,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

type Aula = {
  num: number;
  icon: typeof BookOpen;
  title: string;
  idea: string;
  practice: string[];
  mistake: string;
  rule: string;
};

const AULAS: Aula[] = [
  {
    num: 1,
    icon: Lightbulb,
    title: "Lovable é a cozinha. A Fábrica é a receita.",
    idea: "O Lovable constrói, mas você precisa dar direção.",
    practice: [
      "A Fábrica entrega os comandos.",
      "O Lovable executa.",
      "Você revisa antes de avançar.",
    ],
    mistake: "Abrir o Lovable sem saber exatamente o que pedir.",
    rule: "Não peça o app inteiro de uma vez.",
  },
  {
    num: 2,
    icon: Compass,
    title: "Seus primeiros minutos no Lovable.",
    idea: "No começo, você só precisa saber criar projeto, colar comando e olhar a prévia.",
    practice: [
      "Crie um projeto novo.",
      "Cole o comando da etapa atual.",
      "Espere terminar.",
      "Veja a prévia.",
    ],
    mistake: "Tentar configurar tudo antes de entender o básico.",
    rule: "Primeiro faça funcionar. Depois refine.",
  },
  {
    num: 3,
    icon: Sparkles,
    title: "Como o Lovable pensa.",
    idea: "O Lovable responde melhor quando recebe pedidos pequenos, claros e em ordem.",
    practice: [
      "Peça uma coisa por vez.",
      "Use comandos específicos.",
      "Corrija antes de pedir novas funções.",
    ],
    mistake: "Pedir login, pagamento, dashboard, área restrita e design no mesmo comando.",
    rule: "Um pedido de cada vez.",
  },
  {
    num: 4,
    icon: Workflow,
    title: "A dança entre a Fábrica e o Lovable.",
    idea: "A Fábrica organiza a estratégia. O Lovable executa a construção.",
    practice: [
      "Leia a etapa na Fábrica.",
      "Copie o comando.",
      "Cole no Lovable.",
      "Revise o resultado.",
      "Volte para a próxima etapa.",
    ],
    mistake: "Pular etapa porque parece simples.",
    rule: "Siga a ordem. A pressa quebra o app.",
  },
  {
    num: 5,
    icon: ShieldAlert,
    title: "Quando o Lovable erra.",
    idea: "Errar faz parte da construção. O importante é corrigir com calma.",
    practice: [
      "Leia o erro.",
      "Volte uma versão, se precisar.",
      "Peça correção específica.",
      'Use o módulo "Erros comuns".',
    ],
    mistake: "Apagar tudo ou começar outro projeto no primeiro erro.",
    rule: "Erro não é fim. É ajuste de construção.",
  },
];

const CHECKLIST_ITEMS = [
  "Entendi que devo copiar um comando por vez.",
  "Entendi que preciso revisar antes de avançar.",
  "Entendi que o Lovable pode errar.",
  "Entendi que devo corrigir erros antes de adicionar novas funções.",
];

type Props = {
  goTo?: (id: string) => void;
};

export function FundamentosModule({ goTo }: Props = {}) {
  const [checked, setChecked] = useState<boolean[]>(() => CHECKLIST_ITEMS.map(() => false));
  const allChecked = checked.every(Boolean);

  return (
    <section>
      <header className="mb-6">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <BookOpen size={12} /> Guia do Programa
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Entenda o Lovable antes de construir
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Antes de copiar comandos, entenda como o Lovable pensa. Isso evita erro, retrabalho e frustração.
        </p>
      </header>

      {/* Regra de ouro */}
      <GlassCard className="p-5 md:p-6 mb-6 border-accent/30 bg-accent/[0.06]">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-11 h-11 rounded-xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-lg md:text-xl font-heading font-bold leading-tight">
                Regra de ouro
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/15 bg-white/5 text-muted-foreground">
                <Clock size={10} /> Leitura rápida: 5 minutos
              </span>
            </div>
            <p className="text-[15px] text-foreground/90 leading-relaxed">
              Copie um comando por vez. Espere o Lovable terminar. Revise o resultado. Só depois avance.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Aulas */}
      <div className="space-y-4">
        {AULAS.map((aula) => {
          const Icon = aula.icon;
          return (
            <GlassCard key={aula.num} className="p-5 md:p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-accent/80 mb-1">
                    Aula {aula.num}
                  </div>
                  <h3 className="text-lg md:text-xl font-heading font-bold leading-tight">
                    {aula.title}
                  </h3>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 md:col-span-2">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Ideia central
                  </div>
                  <p className="text-foreground/90">{aula.idea}</p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Na prática
                  </div>
                  <ul className="space-y-1">
                    {aula.practice.map((p) => (
                      <li key={p} className="flex gap-2 text-foreground/90">
                        <span className="text-accent">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-rose-500/20 bg-rose-500/[0.06] p-3">
                  <div className="text-[10px] uppercase tracking-wider text-rose-200/90 mb-1">
                    Erro comum
                  </div>
                  <p className="text-foreground/90">{aula.mistake}</p>
                </div>

                <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] p-3 md:col-span-2">
                  <div className="text-[10px] uppercase tracking-wider text-emerald-200/90 mb-1">
                    Regra
                  </div>
                  <p className="text-foreground/95 font-medium">{aula.rule}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Checklist */}
      <p className="text-sm text-muted-foreground mt-6 mb-2">
        Leia as 5 aulas, marque os pontos abaixo e avance para o primeiro passo da jornada.
      </p>
      <GlassCard className="p-5 md:p-6">
        <h3 className="text-base md:text-lg font-heading font-bold mb-3">
          Antes de avançar, confirme que você entendeu:
        </h3>
        <ul className="space-y-2">
          {CHECKLIST_ITEMS.map((item, i) => (
            <li key={item}>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={(e) => {
                    const next = [...checked];
                    next[i] = e.target.checked;
                    setChecked(next);
                  }}
                  className="mt-1 h-5 w-5 rounded border-white/20 bg-black/30 accent-[hsl(var(--accent))] shrink-0"
                />
                <span className={checked[i] ? "text-foreground/95 line-through decoration-accent/40" : "text-foreground/90 group-hover:text-foreground"}>
                  {item}
                </span>
              </label>
            </li>
          ))}
        </ul>
        {allChecked && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-100 text-sm">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>Você entendeu a regra principal. Agora pode seguir para Comece aqui.</span>
          </div>
        )}
      </GlassCard>


      {/* Pronto para começar */}
      <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
        <strong className="block mb-1 text-emerald-100">Pronto para começar?</strong>
        <p className="text-sm text-emerald-100/90 mb-3">
          Agora siga para o módulo <em>Comece aqui</em> e inicie o primeiro passo da jornada.
        </p>
        {goTo && (
          <button
            onClick={() => goTo("comece")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-400/40 bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/25 text-sm font-semibold"
          >
            Ir para Comece aqui <ArrowRight size={14} />
          </button>
        )}
      </div>
    </section>
  );
}

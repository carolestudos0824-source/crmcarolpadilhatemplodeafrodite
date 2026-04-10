import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft, Crown, Sparkles, Check, X, ChevronDown, ChevronUp,
  Layers, Heart, Compass, Eye, Award, Library, Shield, Zap,
  BookOpen, Star, Target, Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ═══════════════ DATA ═══════════════ */

const FREE_ITEMS = [
  "Entrada na plataforma",
  "Onboarding",
  "Fundamentos do Tarô",
  "Início da Jornada do Louco",
  "Primeiro contato com o método",
  "Experiência inicial do Louco",
  "Primeiros quizzes e progresso",
];

const PREMIUM_ITEMS = [
  "Continuidade da jornada",
  "Arcanos Maiores completos",
  "Arcanos Menores completos",
  "Módulos avançados",
  "Aprofundamentos",
  "Prática guiada",
  "Revisão expandida",
  "Desafios extras",
  "Certificados",
  "Formação mais completa",
];

const INCLUDED = [
  "Jornada completa dos Arcanos Maiores",
  "Arcanos Menores completos",
  "Módulos de Combinações",
  "Módulo de Tiragens",
  "Módulo de Amor e Relacionamentos",
  "Módulo de Prática Guiada",
  "Aprofundamentos simbólicos",
  "Materiais extras",
  "Revisões expandidas",
  "Quizzes completos",
  "Desafios adicionais",
  "Trilhas de evolução mais profundas",
  "Certificados de conclusão",
];

const DEVELOPS = [
  "Mais clareza interpretativa",
  "Mais segurança",
  "Mais repertório simbólico",
  "Mais percepção de contexto",
  "Mais profundidade em leituras afetivas, práticas e espirituais",
  "Mais autonomia para sustentar uma leitura real",
];

const HIGHLIGHTS = [
  {
    icon: Layers,
    title: "Progressão clara",
    desc: "Estudo organizado em camadas, do fundamento à prática avançada.",
  },
  {
    icon: Eye,
    title: "Profundidade simbólica",
    desc: "Arcanos estudados com essência, luz, sombra e conexão viva.",
  },
  {
    icon: Target,
    title: "Prática guiada",
    desc: "Exercícios, tiragens e reflexões que desenvolvem leitura real.",
  },
  {
    icon: Lightbulb,
    title: "Revisão inteligente",
    desc: "Revisão espaçada para consolidar o que foi aprendido.",
  },
  {
    icon: Heart,
    title: "Jornada visual",
    desc: "Estética imersiva que transforma estudo em experiência.",
  },
  {
    icon: Star,
    title: "Presença dos arcanos",
    desc: "Cada arcano é tratado como presença, não apenas como imagem.",
  },
];

/* ═══════════════ SECTION COMPONENTS ═══════════════ */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[9px] font-heading tracking-[0.4em] uppercase text-center" style={{ color: "hsl(36 45% 50%)" }}>
    {children}
  </p>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-heading text-lg md:text-xl tracking-wide text-center leading-snug" style={{ color: "hsl(340 42% 20%)" }}>
    {children}
  </h2>
);

const SectionText = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[13px] font-body leading-relaxed text-center max-w-md mx-auto" style={{ color: "hsl(230 15% 25% / 0.50)" }}>
    {children}
  </p>
);

const Divider = () => (
  <div className="flex justify-center py-2">
    <div className="w-8 h-px" style={{ background: "hsl(36 45% 58% / 0.25)" }} />
  </div>
);

/* ═══════════════ MAIN COMPONENT ═══════════════ */

const PremiumPage = () => {
  const navigate = useNavigate();
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);

  const scrollToIncluded = () => {
    document.getElementById("included")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══════════ HERO ═══════════ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(340 42% 30% / 0.08) 0%, transparent 55%)",
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 80% 100%, hsl(36 45% 58% / 0.06) 0%, transparent 40%)",
        }} />

        <div className="relative max-w-2xl mx-auto px-6 pt-8 pb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-body">Voltar</span>
          </button>

          <div className="text-center space-y-5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl" style={{
              background: "linear-gradient(135deg, hsl(340 42% 28% / 0.10), hsl(36 45% 58% / 0.15))",
              border: "1.5px solid hsl(36 45% 58% / 0.25)",
              boxShadow: "0 8px 32px hsl(36 45% 58% / 0.08)",
            }}>
              <Crown className="w-7 h-7" style={{ color: "hsl(36 45% 50%)" }} />
            </div>

            <p className="text-[9px] font-heading tracking-[0.4em] uppercase" style={{ color: "hsl(36 45% 50%)" }}>
              Jornada Completa
            </p>

            <h1 className="font-heading text-[22px] md:text-[28px] tracking-wide leading-tight max-w-md mx-auto" style={{
              background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(36 42% 38%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Aprofunde sua leitura. Expanda sua jornada. Entre na experiência completa.
            </h1>

            <p className="font-body text-[13px] leading-relaxed max-w-sm mx-auto" style={{
              color: "hsl(230 20% 15% / 0.50)",
            }}>
              A área premium foi criada para quem deseja estudar tarô com mais profundidade, constância e estrutura — indo além da introdução e entrando na formação real da leitura.
            </p>

            <p className="font-accent text-[12px] italic leading-relaxed max-w-sm mx-auto" style={{
              color: "hsl(230 20% 15% / 0.38)",
            }}>
              Desbloqueie a continuidade da Jornada do Louco, acesse os Arcanos Maiores completos, mergulhe nos Arcanos Menores, pratique com mais profundidade e avance por uma trilha viva de estudo simbólico.
            </p>

            <div className="flex flex-col items-center gap-3 pt-2">
              <Button
                size="lg"
                className="font-heading tracking-wide px-10 py-6 text-sm"
                style={{
                  background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 42% 32%))",
                  color: "hsl(36 33% 97%)",
                  border: "1px solid hsl(340 42% 28% / 0.40)",
                  boxShadow: "0 6px 24px hsl(340 42% 28% / 0.18), inset 0 1px 0 hsl(36 45% 58% / 0.10)",
                }}
              >
                <Crown className="w-4 h-4 mr-2" />
                Quero acessar o premium
              </Button>
              <button
                onClick={scrollToIncluded}
                className="text-[11px] font-heading tracking-wider uppercase transition-colors"
                style={{ color: "hsl(340 42% 28% / 0.50)" }}
              >
                Ver o que está incluído ↓
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-16 space-y-12">

        {/* ═══════════ BLOCO 1 — O que muda ═══════════ */}
        <section className="space-y-4">
          <SectionLabel>O que muda</SectionLabel>
          <SectionTitle>No gratuito, você conhece a proposta. No premium, você vive a formação completa.</SectionTitle>
          <SectionText>
            A entrada gratuita permite compreender a base da plataforma, experimentar a jornada e sentir a estrutura do método. A área premium abre o caminho inteiro.
          </SectionText>
          <SectionText>
            É nela que a aluna encontra continuidade, aprofundamento, prática, revisão expandida e acesso real ao coração da experiência.
          </SectionText>
        </section>

        <Divider />

        {/* ═══════════ BLOCO 2 — O que está incluído ═══════════ */}
        <section id="included" className="space-y-5 scroll-mt-8">
          <SectionLabel>O que você desbloqueia</SectionLabel>
          <SectionTitle>O que você desbloqueia ao entrar no premium</SectionTitle>

          <div className="rounded-2xl p-5 space-y-2.5" style={{
            background: "linear-gradient(170deg, hsl(38 28% 95%), hsl(340 42% 28% / 0.02))",
            border: "1.5px solid hsl(36 45% 58% / 0.25)",
            boxShadow: "0 6px 30px hsl(340 42% 28% / 0.04)",
          }}>
            {INCLUDED.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 py-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(36 45% 50%)" }} />
                <span className="text-[12px] font-body" style={{ color: "hsl(230 15% 25% / 0.60)" }}>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ═══════════ BLOCO 3 — Para quem é ═══════════ */}
        <section className="space-y-4">
          <SectionLabel>Para quem é</SectionLabel>
          <SectionTitle>Para quem não quer apenas estudar cartas, mas formar leitura.</SectionTitle>
          <SectionText>
            A área premium foi criada para quem deseja sair do contato inicial e entrar em um processo mais consistente de construção interpretativa.
          </SectionText>
          <div className="max-w-sm mx-auto space-y-2 pt-2">
            {[
              "Compreender melhor os símbolos",
              "Amadurecer leitura",
              "Ganhar repertório",
              "Praticar com direção",
              "Estudar com mais constância",
              "Ir além do significado superficial",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Check className="w-3 h-3 shrink-0" style={{ color: "hsl(36 45% 50% / 0.70)" }} />
                <span className="text-[12px] font-body" style={{ color: "hsl(230 15% 25% / 0.50)" }}>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ═══════════ BLOCO 4 — A diferença real ═══════════ */}
        <section className="space-y-4">
          <SectionLabel>O diferencial</SectionLabel>
          <SectionTitle>Mais conteúdo não basta. O que importa é a forma como o estudo foi construído.</SectionTitle>
          <SectionText>
            O diferencial não está apenas na quantidade de aulas. Está na experiência. A plataforma foi desenhada para unir progressão, profundidade, prática e presença dos arcanos.
          </SectionText>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {HIGHLIGHTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-xl p-4 flex items-start gap-3.5" style={{
                  background: "hsl(38 28% 95% / 0.80)",
                  border: "1px solid hsl(36 25% 82% / 0.50)",
                }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{
                    background: "hsl(340 42% 28% / 0.06)",
                    border: "1px solid hsl(340 42% 28% / 0.10)",
                  }}>
                    <Icon className="w-4 h-4" style={{ color: "hsl(340 42% 28%)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-[13px] tracking-wide" style={{ color: "hsl(340 42% 20%)" }}>
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-body leading-relaxed mt-0.5" style={{ color: "hsl(230 15% 25% / 0.45)" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center font-accent text-[12px] italic pt-2" style={{ color: "hsl(230 15% 25% / 0.38)" }}>
            O premium não é apenas uma biblioteca maior. É o acesso à estrutura completa do método.
          </p>
        </section>

        <Divider />

        {/* ═══════════ BLOCO 5 — O que a aluna desenvolve ═══════════ */}
        <section className="space-y-4">
          <SectionLabel>Evolução</SectionLabel>
          <SectionTitle>Ao avançar no premium, a aluna não apenas aprende mais. Ela lê melhor.</SectionTitle>
          <SectionText>
            Com continuidade de estudo, revisão e prática, a aluna começa a desenvolver:
          </SectionText>
          <div className="max-w-sm mx-auto space-y-2.5 pt-1">
            {DEVELOPS.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Sparkles className="w-3 h-3 shrink-0" style={{ color: "hsl(36 45% 50% / 0.60)" }} />
                <span className="text-[12px] font-body" style={{ color: "hsl(230 15% 25% / 0.50)" }}>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ═══════════ BLOCO 6 — Experiência premium ═══════════ */}
        <section className="space-y-4">
          <SectionLabel>Experiência</SectionLabel>
          <SectionTitle>Uma experiência pensada para quem leva o estudo a sério.</SectionTitle>
          <SectionText>
            A área premium preserva a mesma estética, a mesma linguagem e a mesma proposta de imersão da plataforma — mas amplia a jornada.
          </SectionText>
          <p className="text-center font-accent text-[12px] italic" style={{ color: "hsl(230 15% 25% / 0.38)" }}>
            Aqui, o estudo não é tratado como consumo rápido de conteúdo. Ele é tratado como prática, aprofundamento e evolução de leitura.
          </p>
        </section>

        <Divider />

        {/* ═══════════ BLOCO 7 — Comparação ═══════════ */}
        <section className="space-y-5">
          <SectionLabel>Comparação</SectionLabel>
          <SectionTitle>O que você encontra em cada fase</SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gratuito */}
            <div className="rounded-2xl p-5 space-y-3" style={{
              background: "hsl(38 28% 95% / 0.80)",
              border: "1px solid hsl(36 25% 82% / 0.60)",
            }}>
              <div className="text-center pb-2" style={{ borderBottom: "1px solid hsl(36 25% 82% / 0.40)" }}>
                <p className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(230 15% 40% / 0.50)" }}>
                  Gratuito
                </p>
              </div>
              <div className="space-y-2">
                {FREE_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(140 35% 45%)" }} />
                    <span className="text-[12px] font-body" style={{ color: "hsl(230 15% 25% / 0.55)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium */}
            <div className="rounded-2xl p-5 space-y-3 relative" style={{
              background: "linear-gradient(170deg, hsl(38 28% 95%), hsl(340 42% 28% / 0.03))",
              border: "1.5px solid hsl(36 45% 58% / 0.30)",
              boxShadow: "0 8px 40px hsl(340 42% 28% / 0.06)",
            }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="text-[9px] font-heading tracking-[0.2em] uppercase px-3 py-1 rounded-full" style={{
                  background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 42% 32%))",
                  color: "hsl(36 33% 97%)",
                  boxShadow: "0 2px 8px hsl(340 42% 28% / 0.20)",
                }}>
                  ✦ Recomendado
                </span>
              </div>
              <div className="text-center pb-2" style={{ borderBottom: "1px solid hsl(36 45% 58% / 0.18)" }}>
                <p className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(340 42% 28%)" }}>
                  Premium
                </p>
              </div>
              <div className="space-y-2">
                {PREMIUM_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(36 45% 50%)" }} />
                    <span className="text-[12px] font-body" style={{ color: "hsl(230 15% 25% / 0.60)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ STATS ═══════════ */}
        <section className="rounded-xl p-5" style={{
          background: "linear-gradient(145deg, hsl(340 42% 28% / 0.03), hsl(36 45% 58% / 0.05))",
          border: "1px solid hsl(36 45% 58% / 0.18)",
        }}>
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: "78", label: "Arcanos" },
              { value: "10", label: "Módulos" },
              { value: "100+", label: "Quizzes" },
              { value: "∞", label: "Revisões" },
            ].map((stat, i) => (
              <div key={i} className="text-center py-2">
                <div className="font-heading text-xl" style={{ color: "hsl(340 42% 22%)" }}>{stat.value}</div>
                <div className="text-[9px] tracking-[0.15em] uppercase font-heading mt-0.5" style={{ color: "hsl(230 15% 30% / 0.35)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ═══════════ BLOCO 8 — Convite final ═══════════ */}
        <section className="text-center space-y-5 pt-4">
          <SectionLabel>Próximo passo</SectionLabel>
          <SectionTitle>Se você sentiu valor na entrada, o premium é onde a jornada realmente se abre.</SectionTitle>
          <SectionText>
            A área premium foi criada para quem deseja permanecer, aprofundar e evoluir. Se o que você busca é estudar tarô com mais profundidade, mais beleza, mais método e mais direção — este é o próximo passo natural dentro da plataforma.
          </SectionText>

          <div className="flex justify-center">
            <div className="w-8 h-px" style={{ background: "hsl(36 45% 58% / 0.25)" }} />
          </div>

          <p className="font-accent text-[13px] italic max-w-xs mx-auto leading-relaxed" style={{ color: "hsl(230 20% 15% / 0.38)" }}>
            "O gratuito apresenta a travessia. O premium abre o caminho inteiro."
          </p>

          <div className="flex flex-col items-center gap-3 pt-2">
            <Button
              size="lg"
              className="font-heading tracking-wide px-10 py-6 text-sm"
              style={{
                background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 42% 32%))",
                color: "hsl(36 33% 97%)",
                border: "1px solid hsl(340 42% 28% / 0.40)",
                boxShadow: "0 6px 24px hsl(340 42% 28% / 0.18), inset 0 1px 0 hsl(36 45% 58% / 0.10)",
              }}
            >
              <Crown className="w-4 h-4 mr-2" />
              Entrar no premium
            </Button>
            <button
              onClick={() => navigate("/modules")}
              className="text-[11px] font-heading tracking-wider uppercase transition-colors"
              style={{ color: "hsl(340 42% 28% / 0.50)" }}
            >
              Continuar minha jornada
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px]" style={{ color: "hsl(230 15% 30% / 0.30)" }}>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Pagamento seguro</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Acesso imediato</span>
          </div>
        </section>

        {/* Footer ornament */}
        <div className="text-center pt-4">
          <div className="text-lg" style={{ color: "hsl(36 45% 58% / 0.25)" }}>⟡</div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;

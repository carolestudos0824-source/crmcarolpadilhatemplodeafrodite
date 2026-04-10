import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Sparkles, BookOpen, Star, Layers, Eye, Compass, Check, Lock, Heart, ScrollText, Award, Library } from "lucide-react";
import { Button } from "@/components/ui/button";

const FREE_FEATURES = [
  { label: "Onboarding completo", desc: "Introdução guiada ao universo do Tarô" },
  { label: "Fundamentos do Tarô", desc: "Base teórica e simbólica essencial" },
  { label: "O Louco — experiência completa", desc: "Primeira carta com todas as camadas" },
  { label: "Primeiras cartas da Jornada", desc: "Início dos Arcanos Maiores" },
  { label: "Desafios diários básicos", desc: "Carta do dia e revisão rápida" },
  { label: "Quizzes introdutórios", desc: "Teste seus primeiros conhecimentos" },
  { label: "Progresso e conquistas", desc: "XP, sequência diária e badges iniciais" },
];

const PREMIUM_SECTIONS = [
  {
    icon: BookOpen,
    title: "Arcanos Maiores Completos",
    desc: "Os 22 arcanos com análise simbólica profunda, conexões arquetípicas e exercícios contemplativos.",
  },
  {
    icon: Layers,
    title: "Arcanos Menores — 56 cartas",
    desc: "Todos os naipes: Copas, Espadas, Ouros e Paus. Numerologia, corte e significados detalhados.",
  },
  {
    icon: Heart,
    title: "Amor e Relacionamentos",
    desc: "Módulo especializado em leituras afetivas, dinâmicas de casal e autoconhecimento emocional.",
  },
  {
    icon: ScrollText,
    title: "Combinações e Tiragens",
    desc: "Aprenda a combinar cartas e realizar tiragens completas — Cruz Celta, 3 cartas, ferradura e mais.",
  },
  {
    icon: Compass,
    title: "Prática Guiada",
    desc: "Tiragens passo a passo, meditações com arcanos e exercícios de intuição aprofundados.",
  },
  {
    icon: Library,
    title: "Biblioteca Simbólica Completa",
    desc: "78 arcanos detalhados, busca por símbolo, referências cruzadas e mapas de correspondências.",
  },
  {
    icon: Star,
    title: "Revisões Avançadas e Trilhas",
    desc: "Sistema de revisão espaçada, trilhas por nível (Iniciante → Avançado) e rotina de estudo personalizada.",
  },
  {
    icon: Award,
    title: "Certificados de Conclusão",
    desc: "Certificados digitais ao completar cada módulo — reconhecimento da sua dedicação.",
  },
];

const PremiumPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══════════ HEADER ═══════════ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(340 42% 30% / 0.08) 0%, transparent 55%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 80% 100%, hsl(36 45% 58% / 0.06) 0%, transparent 40%)",
        }} />

        <div className="relative max-w-2xl mx-auto px-6 pt-8 pb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-body">Voltar</span>
          </button>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full" style={{
              background: "linear-gradient(135deg, hsl(340 42% 28% / 0.10), hsl(36 45% 58% / 0.15))",
              border: "1.5px solid hsl(36 45% 58% / 0.25)",
            }}>
              <Crown className="w-6 h-6" style={{ color: "hsl(36 45% 50%)" }} />
            </div>

            <h1 className="font-heading text-2xl tracking-wide" style={{
              background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(36 42% 38%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Jornada Completa
            </h1>

            <p className="font-accent text-base italic leading-relaxed max-w-sm mx-auto" style={{
              color: "hsl(230 20% 15% / 0.50)",
            }}>
              Desbloqueie todas as camadas do conhecimento e mergulhe na sabedoria dos arcanos.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-16 space-y-8">

        {/* ═══════════ FREE ═══════════ */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5" style={{ color: "hsl(36 45% 50%)" }} />
            <h2 className="font-heading text-[11px] tracking-[0.3em] uppercase" style={{ color: "hsl(36 45% 50%)" }}>
              Incluído gratuitamente
            </h2>
          </div>

          <div className="rounded-xl p-5 space-y-3" style={{
            background: "hsl(38 28% 94% / 0.80)",
            border: "1px solid hsl(36 45% 58% / 0.18)",
          }}>
            {FREE_FEATURES.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{
                  background: "hsl(36 45% 58% / 0.10)",
                  border: "1px solid hsl(36 45% 58% / 0.20)",
                }}>
                  <Check className="w-3 h-3" style={{ color: "hsl(36 45% 45%)" }} />
                </div>
                <div>
                  <span className="text-sm font-body font-medium" style={{ color: "hsl(340 42% 20%)" }}>{item.label}</span>
                  <span className="text-xs font-accent italic ml-1.5" style={{ color: "hsl(230 15% 30% / 0.40)" }}>— {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ DIVIDER ═══════════ */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(36 45% 58% / 0.25), transparent)" }} />
          <span className="text-xs" style={{ color: "hsl(36 45% 58% / 0.35)" }}>✦</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(36 45% 58% / 0.25), transparent)" }} />
        </div>

        {/* ═══════════ PREMIUM ═══════════ */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-3.5 h-3.5" style={{ color: "hsl(340 42% 28%)" }} />
            <h2 className="font-heading text-[11px] tracking-[0.3em] uppercase" style={{ color: "hsl(340 42% 28%)" }}>
              Acesso Premium
            </h2>
          </div>

          <div className="space-y-3">
            {PREMIUM_SECTIONS.map((section, i) => {
              const Icon = section.icon;
              return (
                <div
                  key={i}
                  className="group rounded-xl p-4 flex items-start gap-3.5 transition-all duration-300"
                  style={{
                    background: "linear-gradient(145deg, hsl(38 28% 94% / 0.90), hsl(36 33% 96% / 0.85))",
                    border: "1px solid hsl(340 42% 28% / 0.10)",
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{
                    background: "hsl(340 42% 28% / 0.06)",
                    border: "1px solid hsl(340 42% 28% / 0.12)",
                  }}>
                    <Icon className="w-4 h-4" style={{ color: "hsl(340 42% 28%)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-sm tracking-wide" style={{ color: "hsl(340 42% 20%)" }}>
                        {section.title}
                      </h3>
                      <Lock className="w-3 h-3 shrink-0" style={{ color: "hsl(36 45% 58% / 0.45)" }} />
                    </div>
                    <p className="font-accent text-xs italic leading-relaxed mt-0.5" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                      {section.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════ VALUE PROPOSITION ═══════════ */}
        <section className="rounded-xl p-6" style={{
          background: "linear-gradient(145deg, hsl(340 42% 28% / 0.04), hsl(36 45% 58% / 0.06))",
          border: "1.5px solid hsl(36 45% 58% / 0.20)",
        }}>
          <h3 className="font-heading text-sm tracking-wide text-center mb-4" style={{ color: "hsl(340 42% 20%)" }}>
            O que a Jornada Completa oferece
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "78", label: "Arcanos detalhados" },
              { value: "10", label: "Módulos de estudo" },
              { value: "∞", label: "Exercícios e quizzes" },
              { value: "✦", label: "Certificados digitais" },
            ].map((stat, i) => (
              <div key={i} className="text-center py-3 rounded-lg" style={{
                background: "hsl(36 33% 97% / 0.60)",
                border: "1px solid hsl(36 45% 58% / 0.12)",
              }}>
                <div className="font-heading text-lg" style={{ color: "hsl(340 42% 22%)" }}>{stat.value}</div>
                <div className="text-[10px] tracking-[0.15em] uppercase font-body mt-0.5" style={{ color: "hsl(230 15% 30% / 0.40)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ CTA ═══════════ */}
        <section className="text-center space-y-4 pt-2">
          <p className="font-accent text-base italic" style={{ color: "hsl(230 20% 15% / 0.40)" }}>
            "A jornada completa revela o que os olhos não veem à primeira vista."
          </p>

          <Button
            size="lg"
            className="font-heading tracking-wide px-10 py-6 text-sm"
            style={{
              background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 42% 32%))",
              color: "hsl(36 33% 97%)",
              border: "1px solid hsl(340 42% 28% / 0.40)",
              boxShadow: "0 4px 20px hsl(340 42% 28% / 0.15), inset 0 1px 0 hsl(36 45% 58% / 0.10)",
            }}
          >
            <Crown className="w-4 h-4 mr-2" />
            Desbloquear Jornada Completa
          </Button>

          <p className="text-[11px] font-body" style={{ color: "hsl(230 15% 30% / 0.35)" }}>
            Em breve — cadastre-se para ser avisada no lançamento.
          </p>
        </section>

        {/* ═══════════ FOOTER ORNAMENT ═══════════ */}
        <div className="text-center pt-4">
          <div className="text-lg" style={{ color: "hsl(36 45% 58% / 0.30)" }}>⟡</div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;

import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Crown, Sparkles, BookOpen, Star, Layers, Eye,
  Compass, Check, Lock, Heart, ScrollText, Award, Library,
  Zap, Shield, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ═══════════════ DATA ═══════════════ */

const FREE_FEATURES = [
  "Onboarding iniciático completo",
  "Fundamentos do Tarô",
  "O Louco — experiência completa em camadas",
  "Primeiras cartas dos Arcanos Maiores",
  "Desafios diários essenciais",
  "Quizzes de integração",
  "XP, streak e primeiras conquistas",
];

const PREMIUM_FEATURES = [
  "Todos os 22 Arcanos Maiores em profundidade",
  "56 Arcanos Menores — Copas, Ouros, Espadas e Paus",
  "Combinações entre cartas",
  "Tiragens clássicas e contemporâneas",
  "Tarô e Amor — leituras afetivas",
  "Prática Guiada com feedback",
  "Biblioteca Simbólica completa",
  "Trilhas de Iniciante a Avançada",
  "Rotina de estudo personalizada",
  "Revisão espaçada inteligente",
  "Certificados de conclusão por módulo",
  "Todos os desafios e rituais diários",
];

const PREMIUM_HIGHLIGHTS = [
  {
    icon: Layers,
    title: "78 Arcanos em Camadas",
    desc: "Cada carta com essência, luz, sombra, amor, trabalho e espiritualidade — tudo interconectado.",
  },
  {
    icon: Heart,
    title: "Tarô e Amor",
    desc: "Leituras afetivas, dinâmicas de casal e autoconhecimento emocional — com sensibilidade e profundidade.",
  },
  {
    icon: Compass,
    title: "Tiragens Clássicas",
    desc: "Cruz Celta, três cartas, ferradura e mais — aprenda a montar, interpretar e confiar na sua leitura.",
  },
  {
    icon: Eye,
    title: "Prática Guiada",
    desc: "Exercícios de interpretação passo a passo, meditações com arcanos e diário reflexivo.",
  },
  {
    icon: Award,
    title: "Certificados",
    desc: "Reconhecimento da sua dedicação a cada módulo concluído — algo que é só seu.",
  },
  {
    icon: Library,
    title: "Biblioteca Completa",
    desc: "78 arcanos detalhados com busca por símbolo, referências cruzadas e correspondências esotéricas.",
  },
];

const TESTIMONIALS = [
  {
    text: "Nunca imaginei que estudar tarô pudesse ser tão bonito. Cada lição é um encontro comigo mesma.",
    name: "Camila R.",
  },
  {
    text: "As camadas de significado são viciantes. Toda vez que volto a uma carta, ela me diz algo diferente.",
    name: "Letícia M.",
  },
];

/* ═══════════════ COMPONENT ═══════════════ */

const PremiumPage = () => {
  const navigate = useNavigate();

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

          <div className="text-center space-y-4">
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

            <h1 className="font-heading text-2xl md:text-3xl tracking-wide leading-tight" style={{
              background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(36 42% 38%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              A jornada completa{"\n"}espera por você
            </h1>

            <p className="font-accent text-base italic leading-relaxed max-w-sm mx-auto" style={{
              color: "hsl(230 20% 15% / 0.45)",
            }}>
              78 arcanos. 10 módulos. Uma formação que transforma estudo em autoconhecimento — no seu tempo.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-16 space-y-10">

        {/* ═══════════ PLAN COMPARISON ═══════════ */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Free column */}
          <div className="rounded-2xl p-5 space-y-4" style={{
            background: "hsl(38 28% 95% / 0.80)",
            border: "1px solid hsl(36 25% 82% / 0.60)",
          }}>
            <div className="text-center pb-3" style={{ borderBottom: "1px solid hsl(36 25% 82% / 0.40)" }}>
              <p className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(230 15% 40% / 0.50)" }}>
                Plano Gratuito
              </p>
              <p className="font-heading text-2xl mt-1" style={{ color: "hsl(230 25% 15%)" }}>
                R$ 0
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "hsl(230 15% 40% / 0.40)" }}>para sempre</p>
            </div>
            <div className="space-y-2.5">
              {FREE_FEATURES.map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(140 35% 45%)" }} />
                  <span className="text-[12px] font-body" style={{ color: "hsl(230 15% 25% / 0.55)" }}>{feat}</span>
                </div>
              ))}
              {/* Things NOT included */}
              {["Arcanos Maiores completos", "Arcanos Menores", "Tiragens e Combinações", "Certificados", "Tarô e Amor"].map((feat, i) => (
                <div key={`no-${i}`} className="flex items-center gap-2.5 opacity-40">
                  <X className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(230 15% 40%)" }} />
                  <span className="text-[12px] font-body line-through" style={{ color: "hsl(230 15% 40%)" }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium column */}
          <div className="rounded-2xl p-5 space-y-4 relative" style={{
            background: "linear-gradient(170deg, hsl(38 28% 95%), hsl(340 42% 28% / 0.03))",
            border: "1.5px solid hsl(36 45% 58% / 0.30)",
            boxShadow: "0 8px 40px hsl(340 42% 28% / 0.06)",
          }}>
            {/* Recommended badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="text-[9px] font-heading tracking-[0.2em] uppercase px-3 py-1 rounded-full" style={{
                background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 42% 32%))",
                color: "hsl(36 33% 97%)",
                boxShadow: "0 2px 8px hsl(340 42% 28% / 0.20)",
              }}>
                ✦ Recomendado
              </span>
            </div>

            <div className="text-center pb-3" style={{ borderBottom: "1px solid hsl(36 45% 58% / 0.18)" }}>
              <p className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(340 42% 28%)" }}>
                Jornada Completa
              </p>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="font-heading text-2xl" style={{ color: "hsl(340 42% 20%)" }}>Em breve</span>
              </div>
              <p className="text-[10px] mt-0.5" style={{ color: "hsl(230 15% 40% / 0.40)" }}>acesso ilimitado a todo o conteúdo</p>
            </div>
            <div className="space-y-2.5">
              {PREMIUM_FEATURES.map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(36 45% 50%)" }} />
                  <span className="text-[12px] font-body" style={{ color: "hsl(230 15% 25% / 0.60)" }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ HIGHLIGHTS ═══════════ */}
        <section>
          <div className="text-center mb-6">
            <p className="text-[9px] font-heading tracking-[0.35em] uppercase" style={{ color: "hsl(36 45% 50%)" }}>
              O que se abre para você
            </p>
            <h2 className="font-heading text-lg tracking-wide mt-1" style={{ color: "hsl(340 42% 20%)" }}>
              Uma formação que transforma
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PREMIUM_HIGHLIGHTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl p-4 flex items-start gap-3.5 transition-all duration-300"
                  style={{
                    background: "hsl(38 28% 95% / 0.80)",
                    border: "1px solid hsl(36 25% 82% / 0.50)",
                  }}
                >
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

        {/* ═══════════ TESTIMONIALS ═══════════ */}
        <section className="space-y-3">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="rounded-xl p-5" style={{
              background: "hsl(38 28% 95% / 0.70)",
              border: "1px solid hsl(36 25% 82% / 0.40)",
            }}>
              <p className="font-accent text-sm italic leading-relaxed" style={{ color: "hsl(230 15% 25% / 0.50)" }}>
                "{t.text}"
              </p>
              <p className="text-[10px] font-heading tracking-wider uppercase mt-2" style={{ color: "hsl(36 45% 50% / 0.60)" }}>
                — {t.name}
              </p>
            </div>
          ))}
        </section>

        {/* ═══════════ FINAL CTA ═══════════ */}
        <section className="text-center space-y-5 pt-4">
          <div className="flex justify-center">
            <div className="w-8 h-px" style={{ background: "hsl(36 45% 58% / 0.25)" }} />
          </div>

          <p className="font-accent text-base italic max-w-xs mx-auto leading-relaxed" style={{ color: "hsl(230 20% 15% / 0.38)" }}>
            "As cartas não preveem — elas revelam. E revelar-se é o primeiro ato de poder."
          </p>

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
            Desbloquear Jornada Completa
          </Button>

          <div className="flex items-center justify-center gap-4 text-[10px]" style={{ color: "hsl(230 15% 30% / 0.30)" }}>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Pagamento seguro</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Acesso imediato</span>
          </div>

          <p className="text-[10px] font-body" style={{ color: "hsl(230 15% 30% / 0.28)" }}>
            Cadastre-se para ser avisada quando o acesso premium estiver disponível.
          </p>
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

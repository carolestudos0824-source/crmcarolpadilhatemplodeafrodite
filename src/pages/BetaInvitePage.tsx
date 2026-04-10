import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Lock, Sparkles, Check, ChevronDown,
  Eye, Layers, BookOpen, Compass, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ═══════════════ DATA ═══════════════ */

const INSIDE_ITEMS = [
  "Fundamentos do Tarô",
  "Jornada dos Arcanos Maiores",
  "Arcanos vivos, começando por O Louco",
  "Quizzes e revisão",
  "Progresso salvo",
  "Desafios diários",
  "Aprofundamento simbólico",
];

const BETA_ITEMS = [
  "Onboarding inicial",
  "Dashboard da jornada",
  "Fundamentos do Tarô",
  "Início da Jornada dos Arcanos Maiores",
  "O Louco como primeira experiência viva",
  "Progresso, quiz e XP",
  "Primeiros arcanos da trilha",
  "Área premium inicial em desenvolvimento",
];

const FAQ = [
  {
    q: "O que é a plataforma?",
    a: "É uma plataforma de ensino de tarô com trilha gamificada, base simbólica clara e experiência imersiva de estudo.",
  },
  {
    q: "Qual linha simbólica ela adota?",
    a: "A base principal é o Rider-Waite-Smith, com aprofundamentos arquetípicos, psicológicos e esotéricos.",
  },
  {
    q: "A beta já está completa?",
    a: "Não. A beta é uma fase inicial de acesso e validação. Ela já entrega a experiência central do produto, mas a expansão seguirá em evolução.",
  },
  {
    q: "Para quem a plataforma foi criada?",
    a: "Para mulheres que querem estudar tarô com mais profundidade, clareza e método.",
  },
];

const WHY_NOW = [
  {
    icon: Lock,
    title: "Grupo reduzido",
    desc: "A beta é aberta para poucas usuárias — você entra antes de todos.",
  },
  {
    icon: Sparkles,
    title: "Experiência real desde o início",
    desc: "A proposta pedagógica já está ativa e funcional na beta.",
  },
  {
    icon: Star,
    title: "Acompanhe a construção",
    desc: "Veja a plataforma crescer e ajude a moldar a experiência.",
  },
  {
    icon: Eye,
    title: "Qualidade, não improviso",
    desc: "A beta não é um rascunho — é uma entrada antecipada em algo refinado.",
  },
];

/* ═══════════════ HELPERS ═══════════════ */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[9px] font-heading tracking-[0.4em] uppercase text-center" style={{ color: "hsl(36 45% 50%)" }}>
    {children}
  </p>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-heading text-xl md:text-2xl tracking-wide text-center leading-snug" style={{
    background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}>
    {children}
  </h2>
);

const Divider = () => (
  <div className="flex justify-center py-4">
    <span className="text-lg select-none" style={{ color: "hsl(36 45% 58% / 0.25)" }}>⟡</span>
  </div>
);

/* ═══════════════ PAGE ═══════════════ */

const BetaInvitePage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* ════════════════════════════════════════════════
          1. HERO
          ════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 18%, hsl(42 70% 80% / 0.20) 0%, transparent 58%)",
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 20% 80%, hsl(340 42% 30% / 0.07) 0%, transparent 50%)",
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 80% 60%, hsl(36 45% 58% / 0.06) 0%, transparent 50%)",
          }} />
        </div>

        <span className="absolute top-8 left-8 text-2xl select-none" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✦</span>
        <span className="absolute top-8 right-8 text-2xl select-none" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✧</span>
        <span className="absolute bottom-8 left-8 text-xl select-none" style={{ color: "hsl(36 45% 58% / 0.10)" }}>✧</span>
        <span className="absolute bottom-8 right-8 text-xl select-none" style={{ color: "hsl(36 45% 58% / 0.10)" }}>✦</span>

        <div className="relative z-10 max-w-2xl text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{
            background: "linear-gradient(135deg, hsl(340 42% 28% / 0.08), hsl(280 30% 28% / 0.06))",
            border: "1px solid hsl(36 45% 58% / 0.25)",
          }}>
            <Lock className="w-3 h-3" style={{ color: "hsl(36 45% 55%)" }} />
            <span className="text-[10px] font-heading tracking-[0.35em] uppercase" style={{ color: "hsl(340 42% 28% / 0.70)" }}>
              Beta Aberta · Convite
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(36 45% 58% / 0.40))" }} />
            <span className="text-[10px] tracking-[0.5em] uppercase font-body" style={{ color: "hsl(340 42% 28% / 0.55)" }}>
              A Jornada do Louco
            </span>
            <div className="w-12 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(36 45% 58% / 0.40))" }} />
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide leading-tight mb-5" style={{
            background: "linear-gradient(135deg, hsl(340 42% 18%), hsl(230 25% 12%), hsl(36 42% 38%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Aprenda tarô como uma jornada viva de símbolo, presença e leitura real.
          </h1>

          <p className="font-body text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: "hsl(230 15% 30% / 0.60)" }}>
            Uma plataforma imersiva de ensino de tarô que une método, profundidade simbólica, trilha gamificada e experiência viva com os arcanos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => navigate("/auth")}
              className="group px-8 py-6 text-sm font-heading tracking-[0.2em] uppercase rounded-xl shadow-lg hover:shadow-xl transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, hsl(340 42% 28%), hsl(340 38% 22%))",
                border: "1px solid hsl(36 45% 58% / 0.25)",
              }}
            >
              Quero entrar na beta
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <button
              onClick={() => navigate("/waitlist")}
              className="text-[11px] font-heading tracking-wider uppercase transition-colors px-4 py-2"
              style={{ color: "hsl(340 42% 28% / 0.50)" }}
            >
              Entrar na lista de espera
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <ChevronDown className="w-5 h-5" style={{ color: "hsl(36 45% 58%)" }} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          2. O QUE É A PLATAFORMA
          ════════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{
        background: "linear-gradient(180deg, hsl(38 30% 95% / 0.50) 0%, hsl(36 33% 97%) 100%)",
        borderTop: "1px solid hsl(36 25% 82% / 0.40)",
      }}>
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <SectionLabel>O que é</SectionLabel>
          <SectionTitle>Uma plataforma criada para transformar estudo em experiência.</SectionTitle>

          <p className="font-body text-[13px] leading-relaxed max-w-lg mx-auto" style={{ color: "hsl(230 15% 30% / 0.55)" }}>
            A Jornada do Louco é uma plataforma de ensino de tarô onde cada carta é estudada com estrutura, contexto, símbolos, luz, sombra, aplicação prática e progressão.
          </p>

          <p className="font-accent text-[13px] italic leading-relaxed max-w-md mx-auto" style={{ color: "hsl(230 20% 15% / 0.40)" }}>
            A aluna não apenas memoriza. Ela compreende.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          3. O QUE A USUÁRIA ENCONTRA DENTRO
          ════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <SectionLabel>O que você encontra</SectionLabel>
            <SectionTitle>Dentro da plataforma, o estudo ganha forma, ritmo e direção.</SectionTitle>
          </div>

          <div className="max-w-md mx-auto space-y-2.5">
            {INSIDE_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{
                background: i % 2 === 0 ? "hsl(38 30% 95% / 0.50)" : "transparent",
                border: i % 2 === 0 ? "1px solid hsl(36 25% 82% / 0.40)" : "1px solid transparent",
              }}>
                <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(36 45% 50% / 0.60)" }} />
                <span className="font-body text-[13px]" style={{ color: "hsl(230 15% 25% / 0.60)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ════════════════════════════════════════════════
          4. O QUE JÁ ESTÁ DISPONÍVEL NA BETA
          ════════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{
        background: "linear-gradient(180deg, hsl(38 30% 95% / 0.40) 0%, hsl(36 33% 97%) 100%)",
        borderTop: "1px solid hsl(36 25% 82% / 0.30)",
      }}>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <SectionLabel>A Beta</SectionLabel>
            <SectionTitle>Uma entrada antecipada para viver a primeira fase da plataforma.</SectionTitle>
          </div>

          <p className="font-body text-[13px] leading-relaxed max-w-lg mx-auto text-center" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
            A beta é a fase inicial de acesso à plataforma com um grupo reduzido de usuárias. Nesta etapa, você poderá experimentar a proposta pedagógica, entrar na Jornada do Louco e acompanhar a construção refinada da experiência.
          </p>

          <div className="rounded-2xl p-6 max-w-md mx-auto space-y-3" style={{
            background: "linear-gradient(170deg, hsl(38 28% 95%), hsl(340 42% 28% / 0.02))",
            border: "1.5px solid hsl(36 45% 58% / 0.22)",
            boxShadow: "0 8px 40px hsl(340 42% 28% / 0.04)",
          }}>
            <p className="text-[10px] font-heading tracking-[0.3em] uppercase text-center mb-3" style={{ color: "hsl(340 42% 28% / 0.60)" }}>
              O que já está disponível
            </p>
            {BETA_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(36 45% 50% / 0.70)" }} />
                <span className="text-[12px] font-body" style={{ color: "hsl(230 15% 25% / 0.55)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          5. POR QUE VALE ENTRAR AGORA
          ════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <SectionLabel>Por que agora</SectionLabel>
            <SectionTitle>A beta não é um improviso. É uma porta que se abre para poucas.</SectionTitle>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {WHY_NOW.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="rounded-xl p-5 text-center" style={{
                background: "hsl(36 33% 97% / 0.80)",
                border: "1px solid hsl(36 25% 82% / 0.60)",
              }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3" style={{
                  background: "linear-gradient(135deg, hsl(340 42% 30% / 0.08), hsl(36 45% 58% / 0.10))",
                  border: "1px solid hsl(36 45% 58% / 0.20)",
                }}>
                  <Icon className="w-5 h-5" style={{ color: "hsl(340 42% 26%)" }} />
                </div>
                <h3 className="font-heading text-[13px] tracking-wide mb-1" style={{ color: "hsl(230 25% 12%)" }}>{title}</h3>
                <p className="font-body text-[11px] leading-relaxed" style={{ color: "hsl(230 15% 30% / 0.50)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          6. FAQ
          ════════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{
        background: "linear-gradient(180deg, hsl(38 30% 95% / 0.40) 0%, hsl(36 33% 97%) 100%)",
        borderTop: "1px solid hsl(36 25% 82% / 0.30)",
      }}>
        <div className="max-w-lg mx-auto space-y-6">
          <div className="text-center space-y-3">
            <SectionLabel>Perguntas frequentes</SectionLabel>
          </div>

          <div className="space-y-2">
            {FAQ.map(({ q, a }, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{
                background: "hsl(36 33% 97% / 0.70)",
                border: "1px solid hsl(36 25% 82% / 0.40)",
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-heading text-[13px] tracking-wide" style={{ color: "hsl(230 25% 12%)" }}>{q}</span>
                  <ChevronDown
                    className="w-4 h-4 shrink-0 transition-transform duration-300"
                    style={{
                      color: "hsl(36 45% 55%)",
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="font-body text-[12px] leading-relaxed" style={{ color: "hsl(230 10% 40% / 0.70)" }}>{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          7. CTA FINAL
          ════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 50%, hsl(42 70% 80% / 0.12) 0%, transparent 60%)",
        }} />

        <div className="relative z-10 max-w-xl mx-auto text-center space-y-6">
          <span className="text-2xl block" style={{ color: "hsl(36 45% 58% / 0.30)" }}>✦</span>

          <SectionLabel>Convite</SectionLabel>
          <SectionTitle>Entre na beta e acompanhe o nascimento desta jornada desde o início.</SectionTitle>

          <p className="font-body text-[13px] leading-relaxed max-w-md mx-auto" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
            Se você deseja estudar tarô com mais profundidade, beleza, método e consciência simbólica, esta é a hora de entrar.
          </p>

          <div className="flex flex-col items-center gap-3 pt-2">
            <Button
              onClick={() => navigate("/auth")}
              className="group px-10 py-6 text-sm font-heading tracking-[0.2em] uppercase rounded-xl shadow-lg hover:shadow-xl transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, hsl(340 42% 28%), hsl(340 38% 22%))",
                border: "1px solid hsl(36 45% 58% / 0.25)",
              }}
            >
              Quero entrar na beta
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <button
              onClick={() => navigate("/waitlist")}
              className="text-[11px] font-heading tracking-wider uppercase transition-colors"
              style={{ color: "hsl(340 42% 28% / 0.50)" }}
            >
              Quero entrar na lista de espera
            </button>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-center gap-3">
          <div className="w-8 h-px" style={{ background: "hsl(36 45% 58% / 0.25)" }} />
          <span className="text-[9px] font-heading tracking-[0.4em] uppercase" style={{ color: "hsl(36 45% 55% / 0.40)" }}>
            A Jornada do Louco
          </span>
          <div className="w-8 h-px" style={{ background: "hsl(36 45% 58% / 0.25)" }} />
        </div>
      </section>
    </div>
  );
};

export default BetaInvitePage;

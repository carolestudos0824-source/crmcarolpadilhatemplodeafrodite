import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Check, ChevronDown, Eye, Layers, BookOpen, Sparkles, Star, Flame, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const faq = [
  { q: "O que é a plataforma?", a: "Uma plataforma de ensino de tarô com trilha gamificada, base simbólica clara e experiência imersiva de estudo." },
  { q: "Qual linha simbólica ela adota?", a: "A base principal é o Rider-Waite-Smith, com leituras arquetípicas, psicológicas e esotéricas." },
  { q: "Para quem foi criada?", a: "Para quem quer estudar tarô de verdade, com profundidade, clareza e método." },
  { q: "O que é a beta?", a: "Uma entrada antecipada para um grupo reduzido de estudantes. Já entrega a experiência central do produto." },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 20%, hsl(42 70% 80% / 0.18) 0%, transparent 60%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 80%, hsl(340 42% 30% / 0.06) 0%, transparent 50%)" }} />
        </div>

        <span className="absolute top-8 left-8 text-2xl select-none" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✦</span>
        <span className="absolute top-8 right-8 text-2xl select-none" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✧</span>

        <div className="relative z-10 max-w-2xl text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{
            background: "linear-gradient(135deg, hsl(340 42% 28% / 0.08), hsl(280 30% 28% / 0.06))",
            border: "1px solid hsl(36 45% 58% / 0.25)",
          }}>
            <Lock className="w-3 h-3" style={{ color: "hsl(36 45% 55%)" }} />
            <span className="text-[10px] font-heading tracking-[0.35em] uppercase" style={{ color: "hsl(340 42% 28% / 0.70)" }}>
              Beta Aberta · Vagas Limitadas
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(36 45% 58% / 0.40))" }} />
            <span className="text-[10px] tracking-[0.5em] uppercase font-body" style={{ color: "hsl(340 42% 28% / 0.55)" }}>
              A Jornada do Louco
            </span>
            <div className="w-12 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(36 45% 58% / 0.40))" }} />
          </div>

          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl tracking-wide leading-tight mb-5" style={{
            background: "linear-gradient(135deg, hsl(340 42% 18%), hsl(230 25% 12%), hsl(36 42% 38%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Aprenda tarô como uma jornada viva de conhecimento, símbolo e presença.
          </h1>

          <p className="font-body text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-4" style={{ color: "hsl(230 15% 30% / 0.65)" }}>
            Uma plataforma imersiva de ensino de tarô com trilha gamificada, prática guiada, aprofundamento simbólico e experiências vivas com os arcanos.
          </p>

          <p className="font-accent text-xs md:text-sm italic leading-relaxed max-w-md mx-auto mb-8" style={{ color: "hsl(36 45% 45% / 0.65)" }}>
            Base simbólica: Rider-Waite-Smith. Leituras arquetípicas, psicológicas e esotéricas.
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
              Entrar na beta
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

      {/* ═══════════════ O QUE É ═══════════════ */}
      <section className="py-20 px-6" style={{
        background: "linear-gradient(180deg, hsl(38 30% 95% / 0.50) 0%, hsl(36 33% 97%) 100%)",
        borderTop: "1px solid hsl(36 25% 82% / 0.50)",
      }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ O que é
          </p>
          <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-6" style={{
            background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
             Uma plataforma criada para transformar estudo em experiência.
          </h2>
          <p className="font-body text-sm leading-relaxed mb-4" style={{ color: "hsl(230 15% 30% / 0.65)" }}>
            Cada carta é estudada com estrutura, contexto, símbolos, luz, sombra, aplicação prática e progressão. Aqui, você não apenas memoriza. Você compreende.
          </p>
          <p className="font-accent text-sm italic leading-relaxed" style={{ color: "hsl(340 42% 28% / 0.55)" }}>
            O estudo acontece como travessia, construção de leitura e aprofundamento simbólico.
          </p>
        </div>
      </section>

      {/* ═══════════════ DIFERENCIAL ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ O diferencial
          </p>
          <h2 className="font-heading text-xl md:text-2xl tracking-wide mb-8" style={{ color: "hsl(230 25% 12%)" }}>
            Mais do que decorar cartas. Uma jornada de evolução real.
          </h2>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              "Trilha gamificada",
              "Profundidade simbólica",
              "Arcanos como presença",
              "Progresso salvo",
              "Quizzes",
              "Revisão inteligente",
            ].map((item, i) => (
              <span key={i} className="px-4 py-2 rounded-full text-xs font-heading tracking-wider" style={{
                background: "hsl(340 42% 28% / 0.06)",
                border: "1px solid hsl(36 45% 58% / 0.20)",
                color: "hsl(340 42% 28% / 0.65)",
              }}>
                {item}
              </span>
            ))}
          </div>

          <div className="grid gap-3 max-w-md mx-auto text-left">
            {[
              { icon: Eye, label: "Conteúdo principal", desc: "Curto e obrigatório" },
              { icon: Brain, label: "Aprofundamento", desc: "Opcional, para quem quer ir mais fundo" },
              { icon: Flame, label: "Exercício prático", desc: "Reflexão pessoal guiada" },
              { icon: Star, label: "Quiz de fixação", desc: "Validação do que foi aprendido" },
            ].map(({ icon: Icon, label, desc }, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl" style={{
                background: "hsl(36 33% 97% / 0.7)",
                border: "1px solid hsl(36 25% 82% / 0.5)",
              }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                  background: "linear-gradient(135deg, hsl(340 42% 28% / 0.08), hsl(36 45% 58% / 0.08))",
                }}>
                  <Icon className="w-4 h-4" style={{ color: "hsl(36 45% 50%)" }} />
                </div>
                <div>
                  <p className="font-heading text-xs tracking-wide" style={{ color: "hsl(230 25% 12%)" }}>{label}</p>
                  <p className="font-body text-xs mt-0.5" style={{ color: "hsl(230 10% 40% / 0.65)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ O QUE VOCÊ ENCONTRA NA BETA ═══════════════ */}
      <section className="py-20 px-6" style={{ background: "hsl(38 30% 95% / 0.5)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <Lock className="w-6 h-6 mx-auto mb-4" style={{ color: "hsl(36 45% 55% / 0.40)" }} />
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ A Beta
          </p>
          <h2 className="font-heading text-xl md:text-2xl tracking-wide mb-6" style={{ color: "hsl(230 25% 12%)" }}>
            Entre antes de todos. Viva a primeira fase da plataforma.
          </h2>

          <div className="grid gap-2.5 max-w-sm mx-auto text-left mb-6">
            {[
              "Onboarding e introdução ao método",
              "Fundamentos do Tarô",
              "O Louco — arcano completo com voz e quiz",
              "Progresso salvo com XP e streak",
              "Experiência visual imersiva",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg" style={{
                background: i % 2 === 0 ? "hsl(36 33% 97% / 0.7)" : "transparent",
              }}>
                <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(36 45% 50%)" }} />
                <span className="font-body text-[13px]" style={{ color: "hsl(230 15% 30% / 0.65)" }}>{item}</span>
              </div>
            ))}
          </div>

          <p className="font-accent text-sm italic leading-relaxed" style={{ color: "hsl(340 42% 28% / 0.50)" }}>
            A beta não é um rascunho. É uma entrada antecipada em algo refinado.
          </p>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-16 px-6">
        <div className="max-w-lg mx-auto">
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-8 text-center" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ Perguntas frequentes
          </p>

          <div className="space-y-2">
            {faq.map(({ q, a }, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{
                background: "hsl(36 33% 97% / 0.7)",
                border: "1px solid hsl(36 25% 82% / 0.4)",
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-heading text-xs tracking-wide" style={{ color: "hsl(230 25% 12%)" }}>{q}</span>
                  <ChevronDown
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                    style={{
                      color: "hsl(36 45% 55%)",
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="font-body text-xs leading-relaxed" style={{ color: "hsl(230 10% 40% / 0.70)" }}>{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, hsl(42 70% 80% / 0.12) 0%, transparent 60%)" }} />
        </div>

        <div className="relative z-10 max-w-xl mx-auto text-center">
          <span className="text-2xl block mb-4" style={{ color: "hsl(36 45% 58% / 0.25)" }}>✧</span>
          <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-4" style={{
            background: "linear-gradient(135deg, hsl(340 42% 18%), hsl(230 25% 12%), hsl(36 42% 38%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
             Comece sua jornada no tarô com profundidade, método e presença.
          </h2>
          <p className="font-body text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: "hsl(230 15% 30% / 0.60)" }}>
            Se você deseja estudar tarô com mais profundidade, beleza e método, esta é a hora de entrar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <Button
              onClick={() => navigate("/auth")}
              className="group px-8 py-6 text-sm font-heading tracking-[0.2em] uppercase rounded-xl shadow-lg hover:shadow-xl transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, hsl(340 42% 28%), hsl(340 38% 22%))",
                border: "1px solid hsl(36 45% 58% / 0.25)",
              }}
            >
              Entrar na beta
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
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t" style={{ borderColor: "hsl(36 25% 82% / 0.40)" }}>
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: "hsl(36 45% 58% / 0.30)" }}>✦</span>
            <span className="font-heading text-sm tracking-widest" style={{ color: "hsl(340 42% 22% / 0.60)" }}>
              A JORNADA DO LOUCO
            </span>
            <span className="text-sm" style={{ color: "hsl(36 45% 58% / 0.30)" }}>✦</span>
          </div>
          <p className="text-[10px] font-body" style={{ color: "hsl(230 15% 30% / 0.35)" }}>
            Onde o tarô se revela
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
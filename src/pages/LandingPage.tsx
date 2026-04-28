import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Check, ChevronDown, Eye, Star, Flame, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import imgLouco from "@/assets/arcano-0-louco.jpg";

const faq = [
  { q: "O que é o Tarô 78 Chaves?", a: "Uma plataforma de ensino de tarô que conduz você pelos 78 arcanos com trilha gamificada, base simbólica clara e o Método Arcano Vivo." },
  { q: "Qual linha simbólica ela adota?", a: "A base principal é o Rider-Waite-Smith, com leituras arquetípicas, psicológicas e esotéricas." },
  { q: "Para quem foi criada?", a: "Para quem quer estudar tarô de verdade, com profundidade, clareza e método — independente do nível." },
  { q: "O que é a beta?", a: "Uma entrada antecipada para um grupo reduzido de estudantes. Já entrega a experiência central do produto, com vagas limitadas." },
];

// Cores firmes para legibilidade — fundo aquarelado preservado
const INK_STRONG = "#1a0f0a";                  // títulos e texto principal
const INK_BODY = "#1a0f0a";                    // corpo de texto (contraste forte)
const INK_MUTED = "hsl(20 30% 18%)";           // texto secundário (sempre legível)
const INK_ACCENT = "hsl(340 50% 24%)";         // vinho profundo
const GOLD = "hsl(36 55% 42%)";                // dourado mais saturado para contraste
const GOLD_SOFT = "hsl(36 45% 50%)";

const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-transparent overflow-hidden" style={{ color: INK_BODY }}>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 20%, hsl(42 70% 80% / 0.22) 0%, transparent 60%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 80%, hsl(340 42% 30% / 0.08) 0%, transparent 50%)" }} />
        </div>

        <span className="absolute top-8 left-8 text-2xl select-none" style={{ color: "hsl(36 45% 58% / 0.20)" }}>✦</span>
        <span className="absolute top-8 right-8 text-2xl select-none" style={{ color: "hsl(36 45% 58% / 0.20)" }}>✧</span>

        <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Texto Hero */}
            <div className="text-center md:text-left order-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{
                background: "linear-gradient(135deg, hsl(340 42% 28% / 0.14), hsl(280 30% 28% / 0.10))",
                border: "1px solid hsl(36 45% 58% / 0.40)",
              }}>
                <Lock className="w-3 h-3" style={{ color: GOLD }} />
                <span className="text-[10px] font-heading tracking-[0.35em] uppercase font-semibold" style={{ color: INK_ACCENT }}>
                  Beta aberta · Vagas limitadas
                </span>
              </div>

              {/* MARCA */}
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-10 md:w-16 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(36 45% 58% / 0.55))" }} />
                <span className="text-[13px] md:text-[15px] tracking-[0.45em] uppercase font-heading font-bold" style={{ color: INK_ACCENT }}>
                  Tarô 78 Chaves
                </span>
                <div className="w-10 md:w-16 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(36 45% 58% / 0.55))" }} />
              </div>

              <p className="font-accent italic text-base md:text-lg mb-5" style={{ color: INK_ACCENT }}>
                A jornada viva pelos 78 arcanos
              </p>

              <h1 className="font-heading text-2xl md:text-3xl lg:text-[2.4rem] tracking-wide leading-[1.15] mb-5" style={{ color: INK_STRONG }}>
                Desvende as 78 chaves do Tarô,{" "}
                <span style={{ color: INK_ACCENT }}>uma carta por vez.</span>
              </h1>

              <p className="font-body text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0 mb-3" style={{ color: INK_BODY }}>
                Uma jornada viva pelo Rider-Waite-Smith com lições, quizzes, progresso e o{" "}
                <strong style={{ color: INK_STRONG, fontWeight: 600 }}>Método Arcano Vivo</strong>.
              </p>

              <p className="font-accent text-xs md:text-sm italic leading-relaxed max-w-sm mx-auto md:mx-0" style={{ color: "hsl(36 50% 32%)" }}>
                Base simbólica: Rider-Waite-Smith. Leituras arquetípicas, psicológicas e esotéricas.
              </p>
            </div>

            {/* Carta do Louco */}
            <div className="flex justify-center order-2">
              <div className="relative">
                <img
                  src={imgLouco}
                  alt="O Louco — Arcano 0 do Tarô Rider-Waite-Smith"
                  className="w-48 sm:w-56 md:w-auto md:max-h-[500px] object-contain rounded-lg drop-shadow-[0_20px_60px_rgba(0,0,0,0.4)] ring-1 ring-[#c9a96e]/40"
                  style={{
                    filter: "brightness(1.05) contrast(1.02) drop-shadow(0 20px 60px rgba(0,0,0,0.4))",
                    maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate("/auth")}
              className="group px-10 py-6 text-sm font-heading tracking-[0.22em] uppercase rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 text-white font-semibold"
              style={{
                background: "linear-gradient(135deg, hsl(340 50% 26%), hsl(340 45% 18%))",
                border: "1px solid hsl(36 45% 58% / 0.40)",
              }}
            >
              Entrar na beta
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <button
              onClick={() => {
                document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-xs font-heading tracking-[0.2em] uppercase px-5 py-3 rounded-lg transition-colors font-semibold border"
              style={{
                color: INK_ACCENT,
                borderColor: "hsl(340 42% 28% / 0.35)",
                background: "hsl(36 33% 97% / 0.5)",
              }}
            >
              Ver como funciona
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <ChevronDown className="w-5 h-5" style={{ color: GOLD }} />
        </div>
      </section>

      {/* ═══════════════ O QUE É ═══════════════ */}
      <section id="como-funciona" className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center bg-white/75 backdrop-blur-sm rounded-2xl px-6 md:px-10 py-10 border" style={{ borderColor: "hsl(36 25% 82% / 0.6)" }}>
          <p className="text-[11px] font-heading tracking-[0.4em] uppercase mb-5 font-semibold" style={{ color: GOLD }}>
            ✦ O Método Arcano Vivo
          </p>
          <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-5 leading-snug" style={{ color: INK_STRONG }}>
            Uma plataforma criada para transformar estudo em experiência.
          </h2>
          <p className="font-body text-base leading-relaxed mb-4" style={{ color: INK_BODY }}>
            O <strong style={{ color: INK_STRONG, fontWeight: 600 }}>Método Arcano Vivo</strong> conduz você pelos 78 arcanos.
            Cada carta é estudada com símbolo, prática, voz, quiz e progressão — para que você não apenas memorize, mas compreenda.
          </p>
          <p className="font-accent text-base italic leading-relaxed" style={{ color: INK_ACCENT }}>
            O estudo acontece como travessia, construção de leitura e aprofundamento simbólico.
          </p>
        </div>
      </section>

      {/* ═══════════════ DIFERENCIAL ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[11px] font-heading tracking-[0.4em] uppercase mb-5 font-semibold" style={{ color: GOLD }}>
            ✦ O diferencial
          </p>
          <h2 className="font-heading text-xl md:text-2xl tracking-wide mb-8 leading-snug" style={{ color: INK_STRONG }}>
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
              <span key={i} className="px-4 py-2 rounded-full text-xs font-heading tracking-wider font-medium" style={{
                background: "hsl(340 42% 28% / 0.10)",
                border: "1px solid hsl(36 45% 58% / 0.35)",
                color: INK_ACCENT,
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
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm" style={{
                border: "1px solid hsl(36 25% 75% / 0.6)",
              }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                  background: "linear-gradient(135deg, hsl(340 42% 28% / 0.14), hsl(36 45% 58% / 0.14))",
                }}>
                  <Icon className="w-4 h-4" style={{ color: GOLD }} />
                </div>
                <div>
                  <p className="font-heading text-sm tracking-wide font-semibold" style={{ color: INK_STRONG }}>{label}</p>
                  <p className="font-body text-sm mt-0.5" style={{ color: INK_MUTED }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ A BETA ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-lg mx-auto text-center bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-10 border shadow-sm" style={{ borderColor: "hsl(36 25% 75% / 0.6)" }}>
          <Lock className="w-6 h-6 mx-auto mb-4" style={{ color: GOLD }} />
          <p className="text-[11px] font-heading tracking-[0.4em] uppercase mb-5 font-semibold" style={{ color: GOLD }}>
            ✦ A Beta
          </p>
          <h2 className="font-heading text-xl md:text-2xl tracking-wide mb-6 leading-snug" style={{ color: INK_STRONG }}>
            Entre antes de todos. Viva a primeira fase do Tarô 78 Chaves.
          </h2>

          <div className="grid gap-2.5 max-w-sm mx-auto text-left mb-6">
            {[
              "Onboarding e introdução ao Método Arcano Vivo",
              "Fundamentos do Tarô",
              "A Jornada do Louco — arcano completo com voz e quiz",
              "Progresso salvo com XP e streak",
              "Experiência visual imersiva",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{
                background: i % 2 === 0 ? "hsl(36 33% 95% / 0.85)" : "transparent",
              }}>
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
                <span className="font-body text-sm" style={{ color: INK_BODY }}>{item}</span>
              </div>
            ))}
          </div>

          <p className="font-accent text-sm italic leading-relaxed" style={{ color: INK_ACCENT }}>
            A beta não é um rascunho. É uma entrada antecipada em algo refinado.
          </p>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-16 px-6">
        <div className="max-w-lg mx-auto">
          <p className="text-[11px] font-heading tracking-[0.4em] uppercase mb-8 text-center font-semibold" style={{ color: GOLD }}>
            ✦ Perguntas frequentes
          </p>

          <div className="space-y-2">
            {faq.map(({ q, a }, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm" style={{
                border: "1px solid hsl(36 25% 75% / 0.6)",
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-heading text-sm tracking-wide font-semibold" style={{ color: INK_STRONG }}>{q}</span>
                  <ChevronDown
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                    style={{
                      color: GOLD,
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="font-body text-sm leading-relaxed" style={{ color: INK_BODY }}>{a}</p>
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
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, hsl(42 70% 80% / 0.18) 0%, transparent 60%)" }} />
        </div>

        <div className="relative z-10 max-w-xl mx-auto text-center">
          <span className="text-2xl block mb-4" style={{ color: "hsl(36 45% 58% / 0.40)" }}>✧</span>
          <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-4 leading-snug" style={{ color: INK_STRONG }}>
            Comece sua jornada no tarô com profundidade, método e presença.
          </h2>
          <p className="font-body text-base leading-relaxed mb-8 max-w-md mx-auto" style={{ color: INK_BODY }}>
            Se você deseja estudar tarô com mais profundidade, beleza e método, esta é a hora de entrar.
          </p>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 max-w-md mx-auto mb-4 border" style={{ borderColor: "hsl(36 25% 75% / 0.6)" }}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={() => navigate("/auth")}
                className="group px-10 py-6 text-sm font-heading tracking-[0.22em] uppercase rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 text-white font-semibold"
                style={{
                  background: "linear-gradient(135deg, hsl(340 50% 26%), hsl(340 45% 18%))",
                  border: "1px solid hsl(36 45% 58% / 0.40)",
                }}
              >
                Entrar na beta
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <button
                onClick={() => navigate("/waitlist")}
                className="text-xs font-heading tracking-[0.18em] uppercase transition-colors px-6 py-2.5 rounded-lg font-semibold border whitespace-nowrap"
                style={{
                  color: INK_ACCENT,
                  borderColor: "hsl(340 42% 28% / 0.35)",
                  background: "hsl(36 33% 97% / 0.5)",
                }}
              >
                Entrar na lista
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t" style={{ borderColor: "hsl(36 25% 75% / 0.6)", background: "hsl(36 33% 96% / 0.6)" }}>
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="text-base" style={{ color: GOLD_SOFT }}>✦</span>
            <span className="font-heading text-base tracking-[0.25em] font-bold" style={{ color: INK_ACCENT }}>
              TARÔ 78 CHAVES
            </span>
            <span className="text-base" style={{ color: GOLD_SOFT }}>✦</span>
          </div>
          <p className="font-accent text-sm italic" style={{ color: INK_MUTED }}>
            A jornada viva pelos 78 arcanos
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

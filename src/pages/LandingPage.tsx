import { useNavigate } from "react-router-dom";
import { Sparkles, Layers, Brain, Star, BookOpen, Flame, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ornamentDivider from "@/assets/ornament-divider.png";

const FEATURES = [
  {
    icon: Eye,
    title: "Arcanos Vivos",
    description: "Cada carta ganha vida com lições em camadas — do significado essencial ao simbolismo profundo.",
  },
  {
    icon: Layers,
    title: "Estudo em Camadas",
    description: "Comece pelo essencial e mergulhe mais fundo conforme avança. Você escolhe a profundidade.",
  },
  {
    icon: Brain,
    title: "Repetição Inteligente",
    description: "Flashcards, quizzes e revisão espaçada que fixam o conhecimento na memória de longo prazo.",
  },
  {
    icon: Flame,
    title: "Trilha Gamificada",
    description: "XP, conquistas, streaks e progresso visual que tornam o estudo um ritual prazeroso.",
  },
  {
    icon: BookOpen,
    title: "Base Rider-Waite-Smith",
    description: "Simbologia coerente e fundamentada na tradição mais respeitada do tarô ocidental.",
  },
  {
    icon: Star,
    title: "Três Leituras",
    description: "Cada arcano é explorado pelos olhares arquetípico, psicológico e esotérico.",
  },
];

const TESTIMONIALS = [
  {
    text: "Finalmente um estudo de tarô que não é superficial nem esotérico demais. É profundo e acessível ao mesmo tempo.",
    author: "Marina C.",
    role: "Estudante de psicologia",
  },
  {
    text: "A forma como os arcanos são apresentados me fez entender conexões que eu nunca tinha visto em anos de estudo.",
    author: "Beatriz S.",
    role: "Taróloga há 5 anos",
  },
  {
    text: "O sistema de revisão e os quizzes mudaram completamente minha forma de memorizar os significados.",
    author: "Luísa R.",
    role: "Iniciante em tarô",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6">
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 20%, hsl(42 70% 80% / 0.15) 0%, transparent 60%)",
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 20% 80%, hsl(340 42% 30% / 0.06) 0%, transparent 50%)",
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 80% 60%, hsl(36 45% 58% / 0.06) 0%, transparent 50%)",
          }} />
        </div>

        {/* Corner ornaments */}
        <div className="absolute top-8 left-8 text-2xl" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✦</div>
        <div className="absolute top-8 right-8 text-2xl" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✧</div>
        <div className="absolute bottom-8 left-8 text-xl" style={{ color: "hsl(36 45% 58% / 0.10)" }}>✧</div>
        <div className="absolute bottom-8 right-8 text-xl" style={{ color: "hsl(36 45% 58% / 0.10)" }}>✦</div>

        <div className="relative z-10 max-w-2xl text-center animate-fade-in">
          {/* Overline */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(36 45% 58% / 0.40))" }} />
            <span className="text-[10px] tracking-[0.5em] uppercase font-body" style={{ color: "hsl(340 42% 28% / 0.60)" }}>
              Tarô Iniciático
            </span>
            <div className="w-12 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(36 45% 58% / 0.40))" }} />
          </div>

          {/* Main heading */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-wide leading-tight mb-6" style={{
            background: "linear-gradient(135deg, hsl(340 42% 18%), hsl(230 25% 12%), hsl(36 42% 38%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Desvende os Arcanos.<br />
            Desperte o que já sabe.
          </h1>

          {/* Subheading */}
          <p className="font-accent text-lg md:text-xl italic leading-relaxed max-w-lg mx-auto mb-4" style={{
            color: "hsl(230 20% 15% / 0.55)",
          }}>
            Uma jornada profunda, bonita e estruturada pelo universo simbólico do tarô — do Louco ao Mundo.
          </p>

          <p className="font-body text-sm leading-relaxed max-w-md mx-auto mb-10" style={{
            color: "hsl(230 15% 30% / 0.50)",
          }}>
            Estude os 22 Arcanos Maiores com camadas de significado, exercícios práticos, revisão inteligente e uma trilha que respeita seu ritmo.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="font-heading tracking-wide px-8 text-base bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Começar a Jornada
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <button
              onClick={() => {
                document.getElementById("method")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-body text-sm transition-colors hover:text-foreground"
              style={{ color: "hsl(230 15% 30% / 0.50)" }}
            >
              Conhecer o método ↓
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5" style={{
            borderColor: "hsl(36 45% 58% / 0.25)",
          }}>
            <div className="w-1 h-2 rounded-full animate-fade-in" style={{
              background: "hsl(36 45% 58% / 0.40)",
              animation: "fade-in 1.5s ease-in-out infinite alternate",
            }} />
          </div>
        </div>
      </section>

      {/* ═══════════════ SOCIAL PROOF BAR ═══════════════ */}
      <section className="py-8 border-y" style={{
        borderColor: "hsl(36 25% 82% / 0.60)",
        background: "hsl(38 30% 95% / 0.50)",
      }}>
        <div className="max-w-3xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { value: "22", label: "Arcanos Maiores" },
            { value: "5", label: "Camadas de estudo" },
            { value: "RWS", label: "Base simbólica" },
            { value: "∞", label: "Revisões inteligentes" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-heading text-xl md:text-2xl tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
                {s.value}
              </div>
              <div className="text-[9px] tracking-[0.25em] uppercase font-body mt-0.5" style={{ color: "hsl(230 15% 30% / 0.45)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ METHOD ═══════════════ */}
      <section id="method" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <img src={ornamentDivider} alt="" className="w-28 h-auto opacity-50 mx-auto mb-4" loading="lazy" width={800} height={512} />
            <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-4" style={{
              background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Como Funciona a Jornada
            </h2>
            <p className="font-accent text-base italic max-w-md mx-auto" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
              Não é um curso convencional. É um percurso iniciático com estrutura pedagógica.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8 relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-4 bottom-4 w-px" style={{
              background: "linear-gradient(to bottom, transparent, hsl(36 45% 58% / 0.25), hsl(340 42% 30% / 0.15), transparent)",
            }} />

            {[
              {
                step: "01",
                title: "Encontre o Arcano",
                desc: "Cada carta é apresentada com sua essência, palavras-chave e contexto arquetípico.",
              },
              {
                step: "02",
                title: "Mergulhe nas Camadas",
                desc: "Explore simbolismo, história, correspondências e leituras — no ritmo que desejar.",
              },
              {
                step: "03",
                title: "Pratique e Fixe",
                desc: "Exercícios, quizzes e flashcards inteligentes consolidam o que você aprendeu.",
              },
              {
                step: "04",
                title: "Avance na Trilha",
                desc: "Ganhe XP, desbloqueie conquistas e veja sua jornada crescer a cada arcano dominado.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-5 pl-1">
                <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0" style={{
                  background: "linear-gradient(135deg, hsl(38 28% 94%), hsl(36 33% 96%))",
                  border: "1.5px solid hsl(36 45% 58% / 0.30)",
                  boxShadow: "0 4px 16px hsl(36 45% 58% / 0.08)",
                }}>
                  <span className="font-heading text-sm tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
                    {item.step}
                  </span>
                </div>
                <div className="pt-1">
                  <h3 className="font-heading text-base md:text-lg tracking-wide mb-1" style={{ color: "hsl(230 25% 12%)" }}>
                    {item.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(230 15% 30% / 0.55)" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="py-20 px-6" style={{
        background: "linear-gradient(180deg, hsl(38 30% 95% / 0.40) 0%, hsl(36 33% 97%) 100%)",
      }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <img src={ornamentDivider} alt="" className="w-28 h-auto opacity-50 mx-auto mb-4" loading="lazy" width={800} height={512} />
            <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-4" style={{
              background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Por que esta Jornada é Diferente
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="group rounded-xl p-5 transition-all duration-300 hover:shadow-md"
                  style={{
                    background: "hsl(36 33% 97% / 0.80)",
                    border: "1px solid hsl(36 25% 82% / 0.60)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" style={{
                      background: "linear-gradient(135deg, hsl(340 42% 30% / 0.08), hsl(36 45% 58% / 0.10))",
                      border: "1px solid hsl(36 45% 58% / 0.20)",
                    }}>
                      <Icon className="w-5 h-5" style={{ color: "hsl(340 42% 26%)" }} />
                    </div>
                    <div>
                      <h3 className="font-heading text-sm tracking-wide mb-1.5" style={{ color: "hsl(230 25% 12%)" }}>
                        {f.title}
                      </h3>
                      <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(230 15% 30% / 0.55)" }}>
                        {f.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ QUOTE / VALUE ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-3xl block mb-6" style={{ color: "hsl(36 45% 58% / 0.30)" }}>✦</span>
          <blockquote className="font-accent text-xl md:text-2xl italic leading-relaxed mb-6" style={{
            color: "hsl(340 42% 20%)",
          }}>
            "O tarô não é sobre prever o futuro — é sobre compreender o presente com olhos mais profundos."
          </blockquote>
          <div className="w-12 h-px mx-auto mb-6" style={{ background: "hsl(36 45% 58% / 0.30)" }} />
          <p className="font-body text-sm leading-relaxed max-w-md mx-auto" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
            Cada símbolo carrega séculos de sabedoria. Esta jornada te convida a desvendar essas camadas — no seu ritmo, com profundidade e beleza.
          </p>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-20 px-6" style={{
        background: "linear-gradient(180deg, hsl(36 33% 97%) 0%, hsl(38 30% 95% / 0.50) 50%, hsl(36 33% 97%) 100%)",
      }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <img src={ornamentDivider} alt="" className="w-28 h-auto opacity-50 mx-auto mb-4" loading="lazy" width={800} height={512} />
            <h2 className="font-heading text-2xl md:text-3xl tracking-wide" style={{
              background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              O que dizem as estudantes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-xl p-5" style={{
                background: "hsl(36 33% 97% / 0.90)",
                border: "1px solid hsl(36 25% 82% / 0.50)",
                backdropFilter: "blur(8px)",
              }}>
                <p className="font-accent text-sm italic leading-relaxed mb-4" style={{ color: "hsl(230 20% 15% / 0.60)" }}>
                  "{t.text}"
                </p>
                <div>
                  <div className="font-heading text-xs tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
                    {t.author}
                  </div>
                  <div className="text-[10px] font-body" style={{ color: "hsl(230 15% 30% / 0.40)" }}>
                    {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 50%, hsl(42 70% 80% / 0.10) 0%, transparent 60%)",
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 80%, hsl(340 42% 30% / 0.05) 0%, transparent 50%)",
        }} />

        <div className="relative z-10 max-w-lg mx-auto text-center">
          <span className="text-2xl block mb-4" style={{ color: "hsl(36 45% 58% / 0.25)" }}>✧</span>
          <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-4" style={{
            background: "linear-gradient(135deg, hsl(340 42% 18%), hsl(230 25% 12%), hsl(36 42% 38%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Sua jornada começa aqui
          </h2>
          <p className="font-accent text-base italic leading-relaxed mb-8" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
            O Louco dá o primeiro passo sem saber o destino — mas sabendo que precisa caminhar.
          </p>

          <Button
            size="lg"
            onClick={() => navigate("/")}
            className="font-heading tracking-wide px-10 text-base bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Começar Agora
          </Button>

          <p className="text-xs font-body mt-4" style={{ color: "hsl(230 15% 30% / 0.40)" }}>
            Gratuito para começar · Sem compromisso · No seu ritmo
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t" style={{ borderColor: "hsl(36 25% 82% / 0.40)" }}>
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: "hsl(36 45% 58% / 0.30)" }}>✦</span>
            <span className="font-heading text-sm tracking-widest" style={{ color: "hsl(340 42% 22% / 0.60)" }}>
              TARÔ INICIÁTICO
            </span>
            <span className="text-sm" style={{ color: "hsl(36 45% 58% / 0.30)" }}>✦</span>
          </div>
          <p className="text-[10px] font-body" style={{ color: "hsl(230 15% 30% / 0.35)" }}>
            Uma jornada de autoconhecimento através dos arcanos
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

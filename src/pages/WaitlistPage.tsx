import { useState } from "react";
import { Sparkles, Eye, Compass, Flame, Layers, Brain, Star, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const WaitlistPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("waitlist").insert({
        email: email.trim().toLowerCase(),
        name: name.trim() || null,
        source: "waitlist_page",
      });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "Você já está na lista ✦", description: "Esse e-mail já foi registrado. Fique atenta — em breve você receberá novidades." });
          setSubmitted(true);
        } else {
          throw error;
        }
      } else {
        setSubmitted(true);
      }
    } catch {
      toast({ title: "Erro ao registrar", description: "Tente novamente em alguns instantes.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 15%, hsl(42 70% 80% / 0.22) 0%, transparent 55%)",
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 20% 80%, hsl(340 42% 30% / 0.08) 0%, transparent 50%)",
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 80% 60%, hsl(36 45% 58% / 0.06) 0%, transparent 50%)",
          }} />
        </div>

        {/* Corner ornaments */}
        <span className="absolute top-8 left-8 text-2xl select-none" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✦</span>
        <span className="absolute top-8 right-8 text-2xl select-none" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✧</span>
        <span className="absolute bottom-8 left-8 text-xl select-none" style={{ color: "hsl(36 45% 58% / 0.10)" }}>✧</span>
        <span className="absolute bottom-8 right-8 text-xl select-none" style={{ color: "hsl(36 45% 58% / 0.10)" }}>✦</span>

        <div className="relative z-10 max-w-2xl text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10" style={{
            background: "linear-gradient(135deg, hsl(340 42% 28% / 0.08), hsl(280 30% 28% / 0.06))",
            border: "1px solid hsl(36 45% 58% / 0.25)",
          }}>
            <Lock className="w-3 h-3" style={{ color: "hsl(36 45% 55%)" }} />
            <span className="text-[10px] font-heading tracking-[0.35em] uppercase" style={{ color: "hsl(340 42% 28% / 0.70)" }}>
              Em breve · Lista de Espera
            </span>
          </div>

          {/* Overline */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(36 45% 58% / 0.40))" }} />
            <span className="text-[10px] tracking-[0.5em] uppercase font-body" style={{ color: "hsl(340 42% 28% / 0.55)" }}>
              A Jornada do Louco
            </span>
            <div className="w-14 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(36 45% 58% / 0.40))" }} />
          </div>

          {/* Tagline */}
          <p className="font-accent text-lg md:text-xl italic mb-5" style={{ color: "hsl(36 45% 45% / 0.65)" }}>
            Onde o tarô se revela.
          </p>

          {/* Main heading */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide leading-tight mb-6" style={{
            background: "linear-gradient(135deg, hsl(340 42% 18%), hsl(230 25% 12%), hsl(36 42% 38%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            O tarô tem profundidade.<br />
            Seu estudo também deveria ter.
          </h1>

          {/* Value prop */}
          <p className="font-body text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-10" style={{
            color: "hsl(230 15% 30% / 0.55)",
          }}>
            A primeira plataforma que ensina tarô com profundidade, beleza e método — carta a carta, camada a camada. Baseada na tradição Rider-Waite-Smith.
          </p>

          {/* Signup form or success */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <input
                  type="text"
                  placeholder="Seu nome (opcional)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="flex-1 w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all focus:ring-2"
                  style={{
                    background: "hsl(38 30% 95%)",
                    border: "1.5px solid hsl(36 25% 82% / 0.70)",
                    color: "hsl(230 25% 10%)",
                    focusRingColor: "hsl(36 45% 58%)",
                  }}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <input
                  type="email"
                  required
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all focus:ring-2"
                  style={{
                    background: "hsl(38 30% 95%)",
                    border: "1.5px solid hsl(36 25% 82% / 0.70)",
                    color: "hsl(230 25% 10%)",
                  }}
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="font-heading tracking-wide px-8 text-sm bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  {loading ? "Registrando..." : "Quero participar"}
                </Button>
              </div>
              <p className="text-[10px] font-body" style={{ color: "hsl(230 15% 30% / 0.40)" }}>
                Sem spam. Você receberá apenas o convite de acesso.
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto text-center animate-fade-in">
              <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{
                background: "hsl(340 42% 28% / 0.08)",
                border: "1.5px solid hsl(340 42% 28% / 0.18)",
              }}>
                <Sparkles className="w-6 h-6" style={{ color: "hsl(340 42% 26%)" }} />
              </div>
              <h2 className="font-heading text-xl tracking-wide mb-2" style={{ color: "hsl(340 42% 20%)" }}>
                Você está na lista ✦
              </h2>
              <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(230 15% 30% / 0.55)" }}>
                Quando as portas se abrirem, você será uma das primeiras a entrar. Fique atenta ao seu e-mail.
              </p>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5" style={{
            borderColor: "hsl(36 45% 58% / 0.25)",
          }}>
            <div className="w-1 h-2 rounded-full" style={{
              background: "hsl(36 45% 58% / 0.40)",
              animation: "fade-in 1.5s ease-in-out infinite alternate",
            }} />
          </div>
        </div>
      </section>

      {/* ═══════════════ JORNADA DO LOUCO ═══════════════ */}
      <section className="py-20 px-6" style={{
        background: "linear-gradient(180deg, hsl(38 30% 95% / 0.50) 0%, hsl(36 33% 97%) 100%)",
        borderTop: "1px solid hsl(36 25% 82% / 0.40)",
      }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Compass className="w-8 h-8 mx-auto mb-4" style={{ color: "hsl(36 45% 55% / 0.40)" }} />
            <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-4" style={{
              background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              A Jornada do Louco
            </h2>
            <p className="font-accent text-base italic max-w-md mx-auto" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
              Cada Arcano Maior é uma etapa de uma transformação interior. Você não estuda cartas — você percorre um caminho.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: "Início", cards: "O Louco → O Eremita", desc: "Da inocência ao silêncio interior. Os primeiros passos de quem ousa começar.", color: "hsl(36 45% 50%)" },
              { step: "Travessia", cards: "A Roda → A Torre", desc: "Ciclos, sombra e desconstrução. A jornada exige coragem para soltar o que não serve.", color: "hsl(340 42% 30%)" },
              { step: "Revelação", cards: "A Estrela → O Mundo", desc: "Luz, integração e completude. O tarô se torna espelho da sua própria totalidade.", color: "hsl(280 30% 35%)" },
            ].map((phase, i) => (
              <div key={i} className="rounded-xl p-5" style={{
                background: "hsl(36 33% 97% / 0.80)",
                border: "1px solid hsl(36 25% 82% / 0.60)",
              }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{
                  background: `${phase.color}10`,
                  border: `1.5px solid ${phase.color}25`,
                }}>
                  <span className="font-heading text-[10px] tracking-wider" style={{ color: phase.color }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-heading text-sm tracking-wide mb-1" style={{ color: "hsl(230 25% 12%)" }}>{phase.step}</h3>
                <p className="text-[10px] font-heading tracking-wide mb-2" style={{ color: phase.color }}>{phase.cards}</p>
                <p className="text-[12px] font-body leading-relaxed" style={{ color: "hsl(230 15% 30% / 0.55)" }}>{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ARCANOS VIVOS ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Eye className="w-8 h-8 mx-auto mb-4" style={{ color: "hsl(340 42% 28% / 0.35)" }} />
            <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-4" style={{
              background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Arcanos Vivos
            </h2>
            <p className="font-accent text-base italic max-w-md mx-auto" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
              Cada carta é uma experiência completa — com múltiplas camadas de significado, prática e revelação.
            </p>
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            {[
              { n: "01", label: "Essência", desc: "Significado central, palavras-chave e o arquétipo que a carta encarna" },
              { n: "02", label: "Luz & Sombra", desc: "Forças que cada arcano ativa — e os desafios que ele apresenta" },
              { n: "03", label: "Simbolismo", desc: "Cada detalhe da imagem tem propósito — cores, posturas, objetos, paisagens" },
              { n: "04", label: "Aplicações", desc: "Amor, trabalho, saúde, espiritualidade — a carta na vida real" },
              { n: "05", label: "Prática", desc: "Exercícios e quizzes que integram o aprendizado no corpo e na mente" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3.5 rounded-xl" style={{
                background: "hsl(36 33% 97% / 0.80)",
                border: "1px solid hsl(36 25% 82% / 0.50)",
              }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{
                  background: "hsl(340 42% 28% / 0.06)",
                  border: "1.5px solid hsl(340 42% 28% / 0.15)",
                }}>
                  <span className="font-heading text-[10px] tracking-wider" style={{ color: "hsl(340 42% 26%)" }}>{item.n}</span>
                </div>
                <div>
                  <h3 className="font-heading text-[13px] tracking-wide" style={{ color: "hsl(230 25% 12%)" }}>{item.label}</h3>
                  <p className="text-[11px] font-body leading-relaxed" style={{ color: "hsl(230 15% 30% / 0.50)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ GAMIFICAÇÃO ═══════════════ */}
      <section className="py-20 px-6" style={{
        background: "linear-gradient(180deg, hsl(38 30% 95% / 0.40) 0%, hsl(36 33% 97%) 100%)",
        borderTop: "1px solid hsl(36 25% 82% / 0.30)",
      }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Flame className="w-8 h-8 mx-auto mb-4" style={{ color: "hsl(36 45% 55% / 0.40)" }} />
            <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-4" style={{
              background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Estudar como um ritual
            </h2>
            <p className="font-accent text-base italic max-w-md mx-auto" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
              Gamificação elegante que transforma disciplina em prazer — sem infantilizar o sagrado.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Star, title: "XP e Conquistas", desc: "Cada lição concluída, cada quiz acertado gera experiência e desbloqueia marcos." },
              { icon: Flame, title: "Streaks e Ritual Diário", desc: "Desafios diários e sequências que transformam constância em hábito — e hábito em iniciação." },
              { icon: Brain, title: "Revisão Inteligente", desc: "Flashcards e revisão espaçada para que o aprendizado se torne parte de quem você é." },
              { icon: Layers, title: "Trilhas por Nível", desc: "De iniciante a avançada — a plataforma se adapta ao seu ritmo e nunca força uma ordem artificial." },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="rounded-xl p-5" style={{
                  background: "hsl(36 33% 97% / 0.80)",
                  border: "1px solid hsl(36 25% 82% / 0.60)",
                }}>
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{
                      background: "linear-gradient(135deg, hsl(340 42% 30% / 0.08), hsl(36 45% 58% / 0.10))",
                      border: "1px solid hsl(36 45% 58% / 0.20)",
                    }}>
                      <Icon className="w-5 h-5" style={{ color: "hsl(340 42% 26%)" }} />
                    </div>
                    <div>
                      <h3 className="font-heading text-sm tracking-wide mb-1" style={{ color: "hsl(230 25% 12%)" }}>{f.title}</h3>
                      <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(230 15% 30% / 0.55)" }}>{f.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ PROFUNDIDADE ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-3xl block mb-6" style={{ color: "hsl(36 45% 58% / 0.30)" }}>✦</span>
          <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-5" style={{
            background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Profundidade real. Método real.
          </h2>
          <p className="font-body text-sm md:text-base leading-relaxed mb-4" style={{ color: "hsl(230 15% 30% / 0.55)" }}>
            Cada lição usa pedagogia em 5 camadas: conteúdo principal, aprofundamento, extras, exercício e quiz. Você avança no seu ritmo, sem pular o essencial e sem ser obrigada a consumir tudo.
          </p>
          <p className="font-accent text-base italic leading-relaxed" style={{ color: "hsl(340 42% 28% / 0.55)" }}>
            Base simbólica Rider-Waite-Smith · Três leituras por carta: arquetípica, psicológica e esotérica · 22 Arcanos Maiores + 56 Arcanos Menores
          </p>
        </div>
      </section>

      {/* ═══════════════ QUOTE ═══════════════ */}
      <section className="py-16 px-6" style={{
        background: "linear-gradient(180deg, hsl(38 30% 95% / 0.30) 0%, hsl(36 33% 97%) 100%)",
      }}>
        <div className="max-w-xl mx-auto text-center">
          <blockquote className="font-accent text-xl md:text-2xl italic leading-relaxed mb-6" style={{
            color: "hsl(340 42% 20%)",
          }}>
            "As cartas não preveem o futuro — elas iluminam o que já existe dentro de você."
          </blockquote>
          <div className="w-12 h-px mx-auto" style={{ background: "hsl(36 45% 58% / 0.30)" }} />
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 50%, hsl(42 70% 80% / 0.15) 0%, transparent 60%)",
        }} />

        <div className="relative z-10 max-w-lg mx-auto text-center">
          <span className="text-2xl block mb-4" style={{ color: "hsl(36 45% 58% / 0.25)" }}>✧</span>
          <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-4" style={{
            background: "linear-gradient(135deg, hsl(340 42% 18%), hsl(230 25% 12%), hsl(36 42% 38%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Sua jornada começa com um passo
          </h2>
          <p className="font-accent text-base italic leading-relaxed mb-8" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
            O Louco salta sem saber o destino — mas confiando na jornada. Inscreva-se e seja uma das primeiras a entrar.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto mb-4">
              <input
                type="email"
                required
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: "hsl(38 30% 95%)",
                  border: "1.5px solid hsl(36 25% 82% / 0.70)",
                  color: "hsl(230 25% 10%)",
                }}
              />
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="font-heading tracking-wide px-8 text-sm bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Quero participar
              </Button>
            </form>
          ) : (
            <p className="font-heading text-sm tracking-wide" style={{ color: "hsl(340 42% 26%)" }}>
              ✦ Você já está na lista. Fique atenta ao seu e-mail.
            </p>
          )}

          <p className="text-[10px] font-body mt-3" style={{ color: "hsl(230 15% 30% / 0.35)" }}>
            Sem spam · Apenas o convite de acesso quando as portas se abrirem
          </p>
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
            Onde o tarô se revela · Tradição · Profundidade · Beleza
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WaitlistPage;

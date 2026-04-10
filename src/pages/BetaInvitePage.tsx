import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Brain, Star, Flame, Eye, ArrowRight, Lock, Sparkles, Check, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const faq = [
  { q: "A beta é gratuita?", a: "Sim. Totalmente gratuita. Quem entra agora terá condições especiais que não se repetem." },
  { q: "O que eu vou encontrar dentro?", a: "Fundamentos do tarô, duas lições completas (O Louco e O Mago) com cinco camadas de profundidade, quizzes, exercícios e progresso salvo." },
  { q: "Preciso saber tarô para participar?", a: "Não. A Jornada começa do zero — dos Fundamentos até a leitura. É para quem quer aprender de verdade." },
  { q: "O que significa 'beta privada'?", a: "Significa que a plataforma ainda está em construção. Você acessa o que já está pronto e seu feedback ajuda a moldar o produto." },
  { q: "Vou perder meu progresso depois da beta?", a: "Não. Seu progresso, XP e streak são salvos e continuam quando a versão completa for lançada." },
];

const BetaInvitePage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6">
        {/* Atmospheric background */}
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

        {/* Corner ornaments */}
        <span className="absolute top-8 left-8 text-2xl select-none" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✦</span>
        <span className="absolute top-8 right-8 text-2xl select-none" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✧</span>
        <span className="absolute bottom-8 left-8 text-xl select-none" style={{ color: "hsl(36 45% 58% / 0.10)" }}>✧</span>
        <span className="absolute bottom-8 right-8 text-xl select-none" style={{ color: "hsl(36 45% 58% / 0.10)" }}>✦</span>

        <div className="relative z-10 max-w-2xl text-center animate-fade-in">
          {/* Beta badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{
            background: "linear-gradient(135deg, hsl(340 42% 28% / 0.08), hsl(280 30% 28% / 0.06))",
            border: "1px solid hsl(36 45% 58% / 0.25)",
          }}>
            <Lock className="w-3 h-3" style={{ color: "hsl(36 45% 55%)" }} />
            <span className="text-[10px] font-heading tracking-[0.35em] uppercase" style={{ color: "hsl(340 42% 28% / 0.70)" }}>
              Beta Privada · Vagas Limitadas
            </span>
          </div>

          {/* Overline */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(36 45% 58% / 0.40))" }} />
            <span className="text-[10px] tracking-[0.5em] uppercase font-body" style={{ color: "hsl(340 42% 28% / 0.55)" }}>
              A Jornada do Louco
            </span>
            <div className="w-12 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(36 45% 58% / 0.40))" }} />
          </div>

          {/* Main heading */}
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl tracking-wide leading-tight mb-5" style={{
            background: "linear-gradient(135deg, hsl(340 42% 18%), hsl(230 25% 12%), hsl(36 42% 38%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Você foi convidada para algo que o mercado ainda não viu.
          </h1>

          {/* Tagline */}
          <p className="font-accent text-base md:text-lg italic mb-3" style={{ color: "hsl(36 45% 45% / 0.70)" }}>
            Onde o tarô se revela.
          </p>

          {/* Subheadline */}
          <p className="font-body text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: "hsl(230 15% 30% / 0.75)" }}>
            A primeira plataforma que ensina tarô com profundidade, beleza e método — carta a carta, camada a camada. E você pode entrar antes que as portas se abram.
          </p>

          {/* CTA */}
          <Button
            onClick={() => navigate("/auth")}
            className="group px-8 py-6 text-sm font-heading tracking-[0.2em] uppercase rounded-xl shadow-lg hover:shadow-xl transition-all duration-500"
            style={{
              background: "linear-gradient(135deg, hsl(340 42% 28%), hsl(340 38% 22%))",
              border: "1px solid hsl(36 45% 58% / 0.25)",
            }}
          >
            Iniciar minha jornada
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="mt-4 text-[11px] font-body" style={{ color: "hsl(230 10% 40% / 0.5)" }}>
            Gratuita · Limitada · Vitalícia
          </p>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <ChevronDown className="w-5 h-5" style={{ color: "hsl(36 45% 58%)" }} />
        </div>
      </section>

      {/* ═══════════════ O PROBLEMA ═══════════════ */}
      <section className="relative py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ O problema
          </p>
          <p className="font-accent text-lg md:text-xl italic leading-relaxed mb-6" style={{ color: "hsl(340 42% 25% / 0.80)" }}>
            Você já estudou tarô. Já leu sobre O Louco, já viu significados da Imperatriz, já decorou palavras-chave para cada carta.
          </p>
          <p className="font-body text-sm leading-relaxed mb-6" style={{ color: "hsl(230 15% 30% / 0.70)" }}>
            E mesmo assim, quando tenta ler de verdade — algo trava. Você sabe nomes. Sabe listas. Mas não sabe <em>ler</em>.
          </p>
          <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(230 15% 30% / 0.70)" }}>
            Isso não é culpa sua. É culpa do jeito como o tarô é ensinado — por acúmulo, não por profundidade.
          </p>
        </div>
      </section>

      {/* ═══════════════ A SOLUÇÃO ═══════════════ */}
      <section className="relative py-20 px-6" style={{ background: "hsl(38 30% 95% / 0.5)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ A solução
          </p>
          <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-6" style={{ color: "hsl(230 25% 12%)" }}>
            Cada arcano é uma experiência,<br />não uma ficha.
          </h2>
          <p className="font-body text-sm leading-relaxed mb-10 max-w-lg mx-auto" style={{ color: "hsl(230 15% 30% / 0.75)" }}>
            Na Jornada do Louco, cada carta é estudada em cinco camadas de significado. Você não coleciona informação — você percorre um caminho.
          </p>

          {/* 5 layers */}
          <div className="grid gap-4 max-w-md mx-auto text-left">
            {[
              { icon: Eye, label: "Significado essencial", desc: "O que a carta diz" },
              { icon: Layers, label: "Aprofundamento simbólico", desc: "O que ela esconde" },
              { icon: Brain, label: "Conexões expandidas", desc: "O que ela revela sobre você" },
              { icon: Flame, label: "Exercício de reflexão", desc: "O que ela pede de você" },
              { icon: Star, label: "Quiz de compreensão", desc: "O que você realmente aprendeu" },
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

      {/* ═══════════════ O QUE A BETA ENTREGA ═══════════════ */}
      <section className="relative py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ O que você encontra dentro
          </p>
          <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-10" style={{ color: "hsl(230 25% 12%)" }}>
            Não é um rascunho.<br />É o começo da jornada.
          </h2>

          <div className="grid gap-3 max-w-md mx-auto text-left">
            {[
              "Módulo de Fundamentos completo",
              "O Louco — lição completa com 5 camadas",
              "O Mago — mesma profundidade, mesma estrutura",
              "A Sacerdotisa — preview da próxima etapa",
              "Quizzes com feedback imediato",
              "XP, streak e progresso salvo",
              "Exercícios de reflexão pessoal",
              "Design premium, feito para honrar a tradição",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{
                background: i % 2 === 0 ? "hsl(38 30% 95% / 0.4)" : "transparent",
              }}>
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(36 45% 50%)" }} />
                <span className="font-body text-sm" style={{ color: "hsl(230 15% 30% / 0.80)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ POR QUE A BETA É ESPECIAL ═══════════════ */}
      <section className="relative py-20 px-6" style={{ background: "hsl(38 30% 95% / 0.5)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ Por que agora
          </p>
          <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-10" style={{ color: "hsl(230 25% 12%)" }}>
            Não é um teste. É um convite.
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto text-left">
            {[
              { icon: Lock, title: "Acesso antes de todos", desc: "Você entra enquanto o produto está sendo moldado." },
              { icon: Sparkles, title: "Voz nas decisões", desc: "Seu feedback define o que o produto se tornará." },
              { icon: Star, title: "Gratuito e vitalício", desc: "Quem entra agora terá condições que não se repetem." },
              { icon: Flame, title: "Qualidade real desde o dia 1", desc: "O Louco e O Mago já estão com qualidade final." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="p-5 rounded-xl text-center" style={{
                background: "hsl(36 33% 97% / 0.7)",
                border: "1px solid hsl(36 25% 82% / 0.5)",
              }}>
                <Icon className="w-5 h-5 mx-auto mb-3" style={{ color: "hsl(36 45% 50%)" }} />
                <p className="font-heading text-xs tracking-wide mb-1.5" style={{ color: "hsl(230 25% 12%)" }}>{title}</p>
                <p className="font-body text-xs leading-relaxed" style={{ color: "hsl(230 10% 40% / 0.65)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ O QUE VIRÁ DEPOIS ═══════════════ */}
      <section className="relative py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ O caminho à frente
          </p>
          <h2 className="font-heading text-xl md:text-2xl tracking-wide mb-4" style={{ color: "hsl(230 25% 12%)" }}>
            Isso é só o começo.
          </h2>
          <p className="font-body text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: "hsl(230 15% 30% / 0.70)" }}>
            A Jornada completa terá 78 arcanos, 10 módulos de formação, tiragens, combinações, prática guiada e certificação. Você está vendo a primeira página de um livro que está sendo escrito.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["22 Arcanos Maiores", "56 Arcanos Menores", "Tiragens", "Combinações", "Certificado"].map((item, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full text-[10px] font-heading tracking-wider" style={{
                background: "hsl(340 42% 28% / 0.06)",
                border: "1px solid hsl(36 45% 58% / 0.18)",
                color: "hsl(340 42% 28% / 0.55)",
              }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="relative py-20 px-6" style={{ background: "hsl(38 30% 95% / 0.5)" }}>
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
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 50%, hsl(42 70% 80% / 0.12) 0%, transparent 60%)",
          }} />
        </div>

        <div className="relative z-10 max-w-xl mx-auto text-center">
          <p className="font-accent text-lg md:text-xl italic leading-relaxed mb-8" style={{ color: "hsl(340 42% 25% / 0.75)" }}>
            Você não está testando um produto.<br />
            Está entrando antes que as portas se abram —<br />
            e ajudando a construir algo que o mercado ainda não viu.
          </p>

          <Button
            onClick={() => navigate("/auth")}
            className="group px-10 py-6 text-sm font-heading tracking-[0.2em] uppercase rounded-xl shadow-lg hover:shadow-xl transition-all duration-500"
            style={{
              background: "linear-gradient(135deg, hsl(340 42% 28%), hsl(340 38% 22%))",
              border: "1px solid hsl(36 45% 58% / 0.25)",
            }}
          >
            Iniciar minha jornada
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="mt-4 text-[11px] font-body" style={{ color: "hsl(230 10% 40% / 0.5)" }}>
            Gratuita · Limitada · Vitalícia
          </p>

          {/* Footer */}
          <div className="mt-16 flex items-center justify-center gap-3">
            <div className="w-8 h-px" style={{ background: "hsl(36 45% 58% / 0.25)" }} />
            <span className="text-[9px] font-heading tracking-[0.4em] uppercase" style={{ color: "hsl(36 45% 55% / 0.40)" }}>
              A Jornada do Louco
            </span>
            <div className="w-8 h-px" style={{ background: "hsl(36 45% 58% / 0.25)" }} />
          </div>
          <p className="mt-2 font-accent text-xs italic" style={{ color: "hsl(36 45% 45% / 0.35)" }}>
            Onde o tarô se revela.
          </p>
        </div>
      </section>
    </div>
  );
};

export default BetaInvitePage;

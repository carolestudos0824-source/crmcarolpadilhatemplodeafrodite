import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Brain, Star, Flame, Eye, ArrowRight, Lock, Check, ChevronDown, Compass, BookOpen, Sparkles, Users, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const faq = [
  { q: "O que é a plataforma?", a: "É uma plataforma de ensino de tarô com trilha gamificada, base simbólica clara e experiência imersiva de estudo." },
  { q: "Qual linha simbólica ela adota?", a: "A base principal é o Rider-Waite-Smith, com aprofundamentos arquetípicos, psicológicos e esotéricos." },
  { q: "A beta já está completa?", a: "Não. A beta é uma fase inicial de acesso e validação. Ela já entrega a experiência central do produto, mas a expansão seguirá em evolução." },
  { q: "Para quem a plataforma foi criada?", a: "Para mulheres que querem estudar tarô com mais profundidade, clareza e método." },
  { q: "O que torna essa plataforma diferente?", a: "A união entre estrutura pedagógica, jornada gamificada, profundidade simbólica e experiências vivas com os arcanos." },
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
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 60%, hsl(36 45% 58% / 0.06) 0%, transparent 50%)" }} />
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
              Beta Privada · Vagas Limitadas
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
            Aprenda tarô como uma jornada viva de símbolo, presença e leitura real.
          </h1>

          <p className="font-body text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-4" style={{ color: "hsl(230 15% 30% / 0.65)" }}>
            Uma plataforma imersiva de ensino de tarô que une método, profundidade simbólica, trilha gamificada e experiência viva com os arcanos.
          </p>

          <p className="font-accent text-xs md:text-sm italic leading-relaxed max-w-md mx-auto mb-8" style={{ color: "hsl(36 45% 45% / 0.65)" }}>
            Estude com base no Rider-Waite-Smith, avance por uma jornada progressiva e desenvolva leitura com mais estrutura, repertório e consciência simbólica.
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
            <Button
              variant="outline"
              onClick={() => navigate("/convite")}
              className="px-6 py-5 text-sm font-heading tracking-[0.15em] uppercase rounded-xl transition-all duration-300"
              style={{
                border: "1.5px solid hsl(36 25% 82% / 0.70)",
                color: "hsl(340 42% 28% / 0.70)",
                background: "transparent",
              }}
            >
              Conhecer a jornada
            </Button>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <ChevronDown className="w-5 h-5" style={{ color: "hsl(36 45% 58%)" }} />
        </div>
      </section>

      {/* ═══════════════ BLOCO 1 — O QUE É ═══════════════ */}
      <section className="py-20 px-6" style={{
        background: "linear-gradient(180deg, hsl(38 30% 95% / 0.50) 0%, hsl(36 33% 97%) 100%)",
        borderTop: "1px solid hsl(36 25% 82% / 0.50)",
      }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ O que é a plataforma
          </p>
          <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-6" style={{
            background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            A Jornada do Louco é uma plataforma de ensino de tarô criada para transformar estudo em experiência.
          </h2>
          <p className="font-body text-sm leading-relaxed mb-4" style={{ color: "hsl(230 15% 30% / 0.65)" }}>
            Aqui, o aprendizado não acontece por repetição vazia, nem por significados soltos decorados de forma mecânica. Ele acontece como travessia, construção de leitura e aprofundamento simbólico.
          </p>
          <p className="font-accent text-sm italic leading-relaxed" style={{ color: "hsl(340 42% 28% / 0.55)" }}>
            A plataforma adota como base principal o Rider-Waite-Smith, integrando leituras arquetípicas, psicológicas e esotéricas em uma estrutura clara, progressiva e visualmente imersiva.
          </p>
        </div>
      </section>

      {/* ═══════════════ BLOCO 2 — O PROBLEMA ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ O problema que ela resolve
          </p>
          <h2 className="font-heading text-xl md:text-2xl tracking-wide mb-6" style={{ color: "hsl(230 25% 12%)" }}>
            Muita gente estuda tarô, mas continua lendo de forma rasa.
          </h2>
          <p className="font-body text-sm leading-relaxed mb-4" style={{ color: "hsl(230 15% 30% / 0.65)" }}>
            Assiste vídeos soltos. Anota palavras-chave. Decora frases prontas. Junta interpretações desconexas. E, no fim, não desenvolve leitura real.
          </p>
          <p className="font-body text-sm leading-relaxed mb-4" style={{ color: "hsl(230 15% 30% / 0.65)" }}>
            Esta plataforma foi criada para resolver exatamente isso.
          </p>
          <p className="font-accent text-sm italic leading-relaxed" style={{ color: "hsl(340 42% 28% / 0.55)" }}>
            Aqui, cada carta é estudada com estrutura, contexto, símbolos, luz, sombra, aplicação prática e progressão. A aluna não apenas memoriza. Ela compreende.
          </p>
        </div>
      </section>

      {/* ═══════════════ BLOCO 3 — O DIFERENCIAL ═══════════════ */}
      <section className="py-20 px-6" style={{ background: "hsl(38 30% 95% / 0.5)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ O diferencial
          </p>
          <h2 className="font-heading text-2xl md:text-3xl tracking-wide mb-6" style={{
            background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Mais do que um curso.<br />Uma jornada viva de aprendizagem.
          </h2>
          <p className="font-body text-sm leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: "hsl(230 15% 30% / 0.65)" }}>
            Em vez de páginas frias e estáticas, os arcanos se tornam presenças de estudo, guias de linguagem e pontos de travessia dentro da jornada.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Estudo estruturado",
              "Profundidade simbólica",
              "Trilha gamificada",
              "Progresso visível",
              "Revisões",
              "Quizzes",
              "Experiências vivas com os arcanos",
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
        </div>
      </section>

      {/* ═══════════════ BLOCO 4 — O QUE A USUÁRIA ENCONTRA ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ O que você encontra dentro
          </p>
          <h2 className="font-heading text-xl md:text-2xl tracking-wide mb-10" style={{ color: "hsl(230 25% 12%)" }}>
            Dentro da plataforma, o estudo ganha forma, ritmo e direção.
          </h2>

          <div className="grid gap-3 max-w-md mx-auto text-left">
            {[
              "Fundamentos do Tarô",
              "Jornada dos 22 Arcanos Maiores",
              "Arcanos vivos, começando por O Louco",
              "Quizzes de fixação",
              "Progresso salvo com XP e streak",
              "Aprofundamento simbólico opcional",
              "Exercícios reflexivos",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{
                background: i % 2 === 0 ? "hsl(38 30% 95% / 0.4)" : "transparent",
              }}>
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(36 45% 50%)" }} />
                <span className="font-body text-sm" style={{ color: "hsl(230 15% 30% / 0.75)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BLOCO 5 — A JORNADA DO LOUCO ═══════════════ */}
      <section className="py-20 px-6" style={{ background: "hsl(38 30% 95% / 0.5)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <Compass className="w-8 h-8 mx-auto mb-4" style={{ color: "hsl(36 45% 55% / 0.40)" }} />
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ A Jornada do Louco
          </p>
          <h2 className="font-heading text-xl md:text-2xl tracking-wide mb-6" style={{ color: "hsl(230 25% 12%)" }}>
            A jornada começa no Louco, mas não termina no significado da carta.
          </h2>
          <p className="font-body text-sm leading-relaxed mb-4 max-w-lg mx-auto" style={{ color: "hsl(230 15% 30% / 0.65)" }}>
            A Jornada do Louco é o eixo simbólico da plataforma. Ela organiza o estudo dos Arcanos Maiores como um percurso de evolução, travessia e consciência.
          </p>
          <p className="font-accent text-sm italic leading-relaxed max-w-lg mx-auto" style={{ color: "hsl(340 42% 28% / 0.55)" }}>
            Cada arcano representa uma etapa. Cada etapa aprofunda percepção, repertório e leitura. O objetivo não é apenas saber o que a carta "significa", mas compreender o que ela faz dentro da experiência humana, da leitura e da narrativa do jogo.
          </p>
        </div>
      </section>

      {/* ═══════════════ BLOCO 6 — ARCANOS VIVOS ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Eye className="w-8 h-8 mx-auto mb-4" style={{ color: "hsl(340 42% 28% / 0.35)" }} />
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ Arcanos vivos
          </p>
          <h2 className="font-heading text-xl md:text-2xl tracking-wide mb-6" style={{ color: "hsl(230 25% 12%)" }}>
            Aprenda com os arcanos como presença, não só como imagem.
          </h2>
          <p className="font-body text-sm leading-relaxed mb-4 max-w-lg mx-auto" style={{ color: "hsl(230 15% 30% / 0.65)" }}>
            Na plataforma, o estudo dos arcanos não é tratado como uma sequência de páginas estáticas.
          </p>
          <p className="font-body text-sm leading-relaxed max-w-lg mx-auto" style={{ color: "hsl(230 15% 30% / 0.65)" }}>
            Ao entrar em uma carta, a aluna encontra uma experiência mais viva, visual e guiada. O arcano apresenta sua essência, seus símbolos, sua luz, sua sombra e sua lição iniciática dentro de uma estrutura elegante e progressiva.
          </p>
          <p className="font-accent text-xs italic mt-4" style={{ color: "hsl(36 45% 45% / 0.55)" }}>
            A experiência começa com O Louco e servirá de base para a expansão dos demais arcanos.
          </p>
        </div>
      </section>

      {/* ═══════════════ BLOCO 7 — MÉTODO DE ENSINO ═══════════════ */}
      <section className="py-20 px-6" style={{ background: "hsl(38 30% 95% / 0.5)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <Layers className="w-8 h-8 mx-auto mb-4" style={{ color: "hsl(36 45% 55% / 0.40)" }} />
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ Método de ensino
          </p>
          <h2 className="font-heading text-xl md:text-2xl tracking-wide mb-6" style={{ color: "hsl(230 25% 12%)" }}>
            Um método criado para desenvolver leitura real.
          </h2>
          <p className="font-body text-sm leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: "hsl(230 15% 30% / 0.65)" }}>
            Isso torna o aprendizado mais leve sem perder profundidade. A aluna pode avançar com fluidez, mas também pode mergulhar mais fundo quando desejar.
          </p>

          <div className="grid gap-4 max-w-md mx-auto text-left">
            {[
              { icon: Eye, label: "Conteúdo principal", desc: "Curto e obrigatório" },
              { icon: Brain, label: "Aprofundamento", desc: "Opcional, para quem quer ir mais fundo" },
              { icon: BookOpen, label: "Materiais extras", desc: "Referências e conexões expandidas" },
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

      {/* ═══════════════ BLOCO 8 — PARA QUEM É ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ Para quem é
          </p>
          <h2 className="font-heading text-xl md:text-2xl tracking-wide mb-6" style={{ color: "hsl(230 25% 12%)" }}>
            Para quem quer estudar tarô com mais profundidade, método e presença.
          </h2>
          <p className="font-body text-sm leading-relaxed max-w-lg mx-auto" style={{ color: "hsl(230 15% 30% / 0.65)" }}>
            Esta plataforma foi criada para mulheres iniciantes e intermediárias que desejam sair da leitura rasa, solta e confusa e entrar em uma experiência mais estruturada, simbólica e autoral.
          </p>
          <p className="font-accent text-sm italic mt-4" style={{ color: "hsl(340 42% 28% / 0.55)" }}>
            É para quem quer estudar com mais beleza, mais clareza e mais direção.
          </p>
        </div>
      </section>

      {/* ═══════════════ BLOCO 9 — O QUE É A BETA ═══════════════ */}
      <section className="py-20 px-6" style={{ background: "hsl(38 30% 95% / 0.5)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <Lock className="w-7 h-7 mx-auto mb-4" style={{ color: "hsl(36 45% 55% / 0.40)" }} />
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ O que é a beta
          </p>
          <h2 className="font-heading text-xl md:text-2xl tracking-wide mb-6" style={{ color: "hsl(230 25% 12%)" }}>
            Uma entrada antecipada para viver a primeira fase da plataforma.
          </h2>
          <p className="font-body text-sm leading-relaxed mb-4 max-w-lg mx-auto" style={{ color: "hsl(230 15% 30% / 0.65)" }}>
            A beta é a fase inicial de teste da plataforma com um grupo reduzido de usuárias. Nesta etapa, você terá acesso à base do produto, poderá experimentar a proposta pedagógica, entrar na Jornada do Louco, testar os primeiros conteúdos e acompanhar de perto a construção de uma experiência de estudo diferente do que hoje existe no mercado.
          </p>
          <p className="font-accent text-sm italic leading-relaxed" style={{ color: "hsl(340 42% 28% / 0.55)" }}>
            A beta não é um produto improvisado. É uma entrada antecipada em uma plataforma em construção refinada.
          </p>
        </div>
      </section>

      {/* ═══════════════ BLOCO 10 — O QUE JÁ ESTÁ DISPONÍVEL ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-heading tracking-[0.4em] uppercase mb-6" style={{ color: "hsl(36 45% 55% / 0.6)" }}>
            ✦ O que você poderá experimentar na beta
          </p>

          <div className="grid gap-3 max-w-md mx-auto text-left">
            {[
              "Onboarding inicial",
              "Dashboard da jornada",
              "Fundamentos do Tarô",
              "Início da Jornada dos Arcanos Maiores",
              "O Louco como primeira experiência viva",
              "Progresso, quiz e XP",
              "Primeiros arcanos da trilha",
              "Área premium inicial em desenvolvimento",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{
                background: i % 2 === 0 ? "hsl(38 30% 95% / 0.4)" : "transparent",
              }}>
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(36 45% 50%)" }} />
                <span className="font-body text-sm" style={{ color: "hsl(230 15% 30% / 0.75)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-20 px-6" style={{ background: "hsl(38 30% 95% / 0.5)" }}>
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

      {/* ═══════════════ BLOCO 11 — CONVITE FINAL ═══════════════ */}
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
            Entre na beta e acompanhe o nascimento desta jornada desde o início.
          </h2>
          <p className="font-body text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: "hsl(230 15% 30% / 0.60)" }}>
            Se você deseja estudar tarô com mais profundidade, beleza, método e consciência simbólica, esta é a hora de entrar. A beta é a porta de entrada para uma plataforma criada para formar leitura real.
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
              Quero entrar na beta
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/convite")}
              className="px-6 py-5 text-sm font-heading tracking-[0.15em] uppercase rounded-xl transition-all duration-300"
              style={{
                border: "1.5px solid hsl(36 25% 82% / 0.70)",
                color: "hsl(340 42% 28% / 0.70)",
                background: "transparent",
              }}
            >
              Conhecer a jornada
            </Button>
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
            Tarô com método, símbolo e jornada viva · Onde o tarô se revela
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

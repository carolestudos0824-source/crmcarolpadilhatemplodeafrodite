import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Crown, Sparkles, Check, ChevronRight,
  Eye, Heart, Star, BookOpen, Layers, Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTrackEvent } from "@/hooks/use-track-event";

/* ═══════════════ DATA ═══════════════ */

const FREE_ITEMS = [
  "Onboarding e introdução ao método",
  "Módulo de Fundamentos do Tarô",
  "O Louco — arcano completo",
  "Primeiro quiz e progresso",
  "Experiência inicial da plataforma",
];

const PREMIUM_UNLOCKS = [
  { icon: BookOpen, text: "O Mago — lição, símbolos, quiz, voz do arcano" },
  { icon: Eye, text: "A Sacerdotisa — lição, símbolos, quiz, voz do arcano" },
  { icon: Layers, text: "Aprofundamentos simbólicos em cada arcano" },
  { icon: Target, text: "Exercícios de reflexão guiada" },
  { icon: Star, text: "Revisão expandida com espaçamento inteligente" },
  { icon: Heart, text: "Continuidade da Jornada do Louco" },
];

const HIGHLIGHTS = [
  {
    icon: Layers,
    title: "Progressão viva",
    desc: "Cada arcano constrói sobre o anterior. A jornada tem direção.",
  },
  {
    icon: Eye,
    title: "Profundidade real",
    desc: "Essência, luz, sombra, símbolos e a voz de cada arcano.",
  },
  {
    icon: Target,
    title: "Prática guiada",
    desc: "Reflexões e exercícios que desenvolvem leitura, não apenas memória.",
  },
  {
    icon: Star,
    title: "Revisão inteligente",
    desc: "O conteúdo retorna no momento certo para consolidar o aprendizado.",
  },
];

/* ═══════════════ HELPERS ═══════════════ */

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

/* ═══════════════ MAIN ═══════════════ */

const PremiumPage = () => {
  const navigate = useNavigate();
  const { trackEvent } = useTrackEvent();

  useEffect(() => {
    trackEvent("premium_page_viewed");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══════════ HERO ═══════════ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(340 42% 30% / 0.08) 0%, transparent 55%)",
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
              Continue sua jornada. Aprofunde sua leitura.
            </h1>

            <p className="font-body text-[13px] leading-relaxed max-w-sm mx-auto" style={{
              color: "hsl(230 20% 15% / 0.50)",
            }}>
              Você conheceu O Louco e sentiu a proposta. Agora, desbloqueie O Mago e A Sacerdotisa — e entre na experiência completa do método.
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
                Quero continuar a jornada
              </Button>
              <p className="text-[10px] font-body" style={{ color: "hsl(230 15% 30% / 0.35)" }}>
                Em breve · Lista de interesse
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-16 space-y-12">

        {/* ═══════════ BLOCO 1 — O que muda ═══════════ */}
        <section className="space-y-4">
          <SectionLabel>O que muda</SectionLabel>
          <SectionTitle>O gratuito mostra a proposta. O premium abre o caminho.</SectionTitle>
          <SectionText>
            Na entrada gratuita, você conhece o método, estuda O Louco e sente a experiência da plataforma. No premium, você avança para os próximos arcanos com toda a profundidade que o método oferece.
          </SectionText>
        </section>

        <Divider />

        {/* ═══════════ BLOCO 2 — Comparação ═══════════ */}
        <section className="space-y-5">
          <SectionLabel>Comparação</SectionLabel>
          <SectionTitle>O que cada fase oferece</SectionTitle>

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
              <div className="space-y-2.5">
                {PREMIUM_UNLOCKS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(36 45% 50%)" }} />
                      <span className="text-[12px] font-body" style={{ color: "hsl(230 15% 25% / 0.60)" }}>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ═══════════ BLOCO 3 — Próximos arcanos ═══════════ */}
        <section className="space-y-5">
          <SectionLabel>Próximos arcanos</SectionLabel>
          <SectionTitle>O Mago e A Sacerdotisa esperam por você</SectionTitle>
          <SectionText>
            A jornada do tarô não termina em O Louco — ela começa. Cada arcano traz uma nova camada de compreensão, novos símbolos e novas perguntas.
          </SectionText>

          <div className="space-y-3 pt-2">
            {[
              { numeral: "I", name: "O Mago", subtitle: "A vontade que cria. O gesto que transforma.", color: "hsl(340 42% 28%)" },
              { numeral: "II", name: "A Sacerdotisa", subtitle: "O silêncio que sabe. A escuta que revela.", color: "hsl(260 30% 35%)" },
            ].map((arcano, i) => (
              <div key={i} className="rounded-xl p-5 flex items-center gap-4" style={{
                background: "linear-gradient(145deg, hsl(38 28% 95% / 0.90), hsl(36 33% 96% / 0.85))",
                border: "1.5px solid hsl(36 45% 58% / 0.22)",
                boxShadow: "0 4px 20px hsl(340 42% 28% / 0.04)",
              }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{
                  background: "linear-gradient(135deg, hsl(38 28% 93%), hsl(36 33% 96%), hsl(36 45% 55% / 0.12))",
                  border: `2px solid ${arcano.color}30`,
                  boxShadow: `0 0 20px ${arcano.color}10`,
                }}>
                  <span className="font-heading text-lg" style={{ color: arcano.color }}>{arcano.numeral}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-base tracking-wide" style={{ color: "hsl(340 42% 20%)" }}>
                    {arcano.name}
                  </h3>
                  <p className="font-accent text-[12px] italic" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
                    {arcano.subtitle}
                  </p>
                </div>
                <Crown className="w-4 h-4 shrink-0" style={{ color: "hsl(36 45% 50% / 0.50)" }} />
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ═══════════ BLOCO 4 — Diferenciais ═══════════ */}
        <section className="space-y-4">
          <SectionLabel>O diferencial</SectionLabel>
          <SectionTitle>Não é mais conteúdo. É a forma como o estudo foi construído.</SectionTitle>

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
        </section>

        <Divider />

        {/* ═══════════ CTA FINAL ═══════════ */}
        <section className="text-center space-y-5 pt-4">
          <SectionLabel>Próximo passo</SectionLabel>
          <SectionTitle>Se O Louco te encantou, o próximo arcano vai te surpreender.</SectionTitle>

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
              Quero continuar a jornada
            </Button>
            <p className="text-[10px] font-body" style={{ color: "hsl(230 15% 30% / 0.35)" }}>
              Em breve · Cadastre seu interesse
            </p>
          </div>

          {/* Footer ornament */}
          <div className="pt-6">
            <div className="text-lg" style={{ color: "hsl(36 45% 58% / 0.25)" }}>⟡</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PremiumPage;
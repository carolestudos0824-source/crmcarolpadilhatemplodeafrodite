import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Crown, Check, BookOpen, Eye, Layers,
  Target, Star, Heart, Sparkles, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTrackEvent } from "@/hooks/use-track-event";
import { usePremium } from "@/hooks/use-premium";
import { toast } from "sonner";

/* ═══════════════ DATA ═══════════════ */

const FREE_ITEMS = [
  "Onboarding e introdução ao método",
  "Dashboard com progresso e continuidade",
  "O Louco — arcano completo com voz, quiz e aprofundamento",
  "Fundamentos do Tarô",
  "Experiência real da plataforma",
];

const PREMIUM_UNLOCKS = [
  { icon: BookOpen, text: "21 arcanos maiores — lição completa, símbolos e voz" },
  { icon: Eye, text: "Aprofundamentos simbólicos em cada arcano" },
  { icon: Target, text: "Exercícios de reflexão guiada" },
  { icon: Layers, text: "Quizzes completos com feedback" },
  { icon: Star, text: "Revisão expandida com espaçamento inteligente" },
  { icon: Heart, text: "Módulos de Amor, Combinações, Tiragens e Prática" },
];

const HIGHLIGHTS = [
  {
    icon: Layers,
    title: "Progressão viva",
    desc: "Cada arcano constrói sobre o anterior. A jornada tem direção e ritmo.",
  },
  {
    icon: Eye,
    title: "Profundidade real",
    desc: "Essência, luz, sombra, símbolos e a voz de cada arcano.",
  },
  {
    icon: Target,
    title: "Prática guiada",
    desc: "Reflexões e exercícios que desenvolvem leitura — não apenas memória.",
  },
  {
    icon: Star,
    title: "Revisão inteligente",
    desc: "O conteúdo retorna no momento certo para consolidar o aprendizado.",
  },
];

const NEXT_ARCANOS = [
  { numeral: "I", name: "O Mago", subtitle: "A vontade que cria. O gesto que transforma.", hue: "340 42% 28%" },
  { numeral: "II", name: "A Sacerdotisa", subtitle: "O silêncio que sabe. A escuta que revela.", hue: "260 30% 35%" },
];

const PLANS = [
  {
    id: "monthly",
    name: "Mensal",
    price: "R$ 29,90",
    period: "/mês",
    description: "Acesso completo, cancele quando quiser",
    highlighted: false,
  },
  {
    id: "annual",
    name: "Anual",
    price: "R$ 199,90",
    period: "/ano",
    description: "Equivale a R$ 16,66/mês — economia de 44%",
    highlighted: true,
    badge: "Melhor valor",
  },
];

/* ═══════════════ HELPERS ═══════════════ */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-[9px] font-heading tracking-[0.4em] uppercase text-center"
    style={{ color: "hsl(var(--gold))" }}
  >
    {children}
  </p>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="font-heading text-lg md:text-xl tracking-wide text-center leading-snug"
    style={{ color: "hsl(var(--midnight))" }}
  >
    {children}
  </h2>
);

const SectionText = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-[13px] font-body leading-relaxed text-center max-w-md mx-auto"
    style={{ color: "hsl(var(--muted-foreground) / 0.65)" }}
  >
    {children}
  </p>
);

const Divider = () => (
  <div className="flex justify-center py-2">
    <div className="w-8 h-px" style={{ background: "hsl(var(--gold) / 0.25)" }} />
  </div>
);

/* ═══════════════ ACTIVE SUBSCRIBER VIEW ═══════════════ */

const ActiveSubscriberView = ({ premiumUntil, premiumSource }: { premiumUntil: string | null; premiumSource: string | null }) => {
  const navigate = useNavigate();

  const sourceLabel = premiumSource === "gift" ? "Presente" : premiumSource === "admin" ? "Acesso administrativo" : "Assinatura";
  const untilFormatted = premiumUntil
    ? new Date(premiumUntil).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-16">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-body">Voltar</span>
        </button>

        <div className="text-center space-y-6">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, hsl(var(--gold) / 0.15), hsl(var(--secondary) / 0.10))",
              border: "2px solid hsl(var(--gold) / 0.35)",
              boxShadow: "0 8px 40px hsl(var(--gold) / 0.12)",
            }}
          >
            <Crown className="w-8 h-8" style={{ color: "hsl(var(--gold))" }} />
          </div>

          <div>
            <p className="text-[9px] font-heading tracking-[0.4em] uppercase" style={{ color: "hsl(var(--gold))" }}>
              Jornada Completa
            </p>
            <h1 className="font-heading text-2xl tracking-wide mt-2" style={{ color: "hsl(var(--midnight))" }}>
              Sua jornada está ativa ✦
            </h1>
            <p className="font-body text-sm mt-2" style={{ color: "hsl(var(--muted-foreground) / 0.60)" }}>
              Todo o conteúdo está desbloqueado. Continue estudando no seu ritmo.
            </p>
          </div>

          <div className="rounded-xl p-5 max-w-xs mx-auto" style={{
            background: "hsl(var(--mystic-surface))",
            border: "1px solid hsl(var(--gold) / 0.20)",
          }}>
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-body" style={{ color: "hsl(var(--muted-foreground) / 0.50)" }}>Tipo</span>
                <span className="text-[12px] font-heading tracking-wide" style={{ color: "hsl(var(--secondary))" }}>{sourceLabel}</span>
              </div>
              {untilFormatted && (
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-body" style={{ color: "hsl(var(--muted-foreground) / 0.50)" }}>Válido até</span>
                  <span className="text-[12px] font-body" style={{ color: "hsl(var(--midnight))" }}>{untilFormatted}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-body" style={{ color: "hsl(var(--muted-foreground) / 0.50)" }}>Status</span>
                <span className="text-[11px] font-heading tracking-wide px-2 py-0.5 rounded-full" style={{
                  background: "hsl(140 35% 45% / 0.10)",
                  color: "hsl(140 35% 38%)",
                }}>
                  Ativo
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate("/app")}
            className="font-heading tracking-wide text-[11px] uppercase px-8 py-5"
            style={{
              background: "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--crimson-light)))",
              color: "hsl(var(--parchment))",
              border: "1px solid hsl(var(--secondary) / 0.40)",
            }}
          >
            Continuar estudando
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════ MAIN ═══════════════ */

const PremiumPage = () => {
  const navigate = useNavigate();
  const { trackEvent } = useTrackEvent();
  const { isPremium, premiumUntil, premiumSource, loading } = usePremium();
  const [selectedPlan, setSelectedPlan] = useState("annual");

  useEffect(() => {
    trackEvent("premium_page_viewed");
  }, []);

  if (loading) return null;

  // Active subscriber view
  if (isPremium) {
    return <ActiveSubscriberView premiumUntil={premiumUntil} premiumSource={premiumSource} />;
  }

  const handleSubscribe = () => {
    trackEvent("premium_subscribe_clicked", { plan: selectedPlan });
    toast.info("Assinatura será ativada em breve. Estamos finalizando a integração de pagamento.");
  };

  const handleRestore = () => {
    trackEvent("premium_restore_clicked");
    toast.info("Restauração de compra será implementada com a loja de aplicativos.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══════════ HERO ═══════════ */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, hsl(var(--secondary) / 0.06) 0%, transparent 55%)",
          }}
        />

        <div className="relative max-w-2xl mx-auto px-6 pt-8 pb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-body">Voltar</span>
          </button>

          <div className="text-center space-y-5">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, hsl(var(--secondary) / 0.10), hsl(var(--gold) / 0.15))",
                border: "1.5px solid hsl(var(--gold) / 0.25)",
                boxShadow: "0 8px 32px hsl(var(--gold) / 0.08)",
              }}
            >
              <Crown className="w-7 h-7" style={{ color: "hsl(var(--gold))" }} />
            </div>

            <p className="text-[9px] font-heading tracking-[0.4em] uppercase" style={{ color: "hsl(var(--gold))" }}>
              Jornada Completa
            </p>

            <h1
              className="font-heading text-[22px] md:text-[28px] tracking-wide leading-tight max-w-md mx-auto"
              style={{
                background: "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--gold-dark)))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Continue sua jornada. Aprofunde sua leitura.
            </h1>

            <p
              className="font-body text-[13px] leading-relaxed max-w-sm mx-auto"
              style={{ color: "hsl(var(--muted-foreground) / 0.65)" }}
            >
              Você conheceu O Louco e sentiu a proposta. Agora, desbloqueie os
              próximos arcanos e entre na experiência completa do método.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-16 space-y-12">

        {/* ═══════════ PLANOS ═══════════ */}
        <section className="space-y-5">
          <SectionLabel>Escolha seu plano</SectionLabel>
          <SectionTitle>Acesso completo, sem limites</SectionTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className="rounded-2xl p-5 text-left transition-all relative"
                  style={{
                    background: isSelected
                      ? "linear-gradient(170deg, hsl(var(--mystic-surface)), hsl(var(--secondary) / 0.03))"
                      : "hsl(var(--mystic-surface))",
                    border: isSelected
                      ? "2px solid hsl(var(--gold) / 0.40)"
                      : "1.5px solid hsl(var(--border) / 0.60)",
                    boxShadow: isSelected
                      ? "0 8px 40px hsl(var(--secondary) / 0.08)"
                      : "none",
                  }}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span
                        className="text-[9px] font-heading tracking-[0.2em] uppercase px-3 py-1 rounded-full whitespace-nowrap"
                        style={{
                          background: "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--crimson-light)))",
                          color: "hsl(var(--parchment))",
                          boxShadow: "0 2px 8px hsl(var(--secondary) / 0.20)",
                        }}
                      >
                        ✦ {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Selection indicator */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-heading text-sm tracking-wide" style={{ color: "hsl(var(--midnight))" }}>
                        {plan.name}
                      </p>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        border: isSelected
                          ? "2px solid hsl(var(--secondary))"
                          : "2px solid hsl(var(--border))",
                        background: isSelected
                          ? "hsl(var(--secondary))"
                          : "transparent",
                      }}
                    >
                      {isSelected && <Check className="w-3 h-3" style={{ color: "hsl(var(--parchment))" }} />}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-heading text-2xl tracking-wide" style={{ color: "hsl(var(--secondary))" }}>
                      {plan.price}
                    </span>
                    <span className="text-[11px] font-body" style={{ color: "hsl(var(--muted-foreground) / 0.50)" }}>
                      {plan.period}
                    </span>
                  </div>

                  <p className="text-[11px] font-body" style={{ color: "hsl(var(--muted-foreground) / 0.50)" }}>
                    {plan.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Subscribe CTA */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={handleSubscribe}
              className="font-heading tracking-wide px-10 py-6 text-sm w-full sm:w-auto"
              style={{
                background: "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--crimson-light)))",
                color: "hsl(var(--parchment))",
                border: "1px solid hsl(var(--secondary) / 0.40)",
                boxShadow: "0 6px 24px hsl(var(--secondary) / 0.18), inset 0 1px 0 hsl(var(--gold) / 0.10)",
              }}
            >
              <Crown className="w-4 h-4 mr-2" />
              Assinar {selectedPlan === "annual" ? "plano anual" : "plano mensal"}
            </Button>
            <p className="text-[10px] font-body" style={{ color: "hsl(var(--muted-foreground) / 0.40)" }}>
              Cancele quando quiser · Acesso imediato
            </p>
          </div>
        </section>

        <Divider />

        {/* ═══════════ O QUE MUDA ═══════════ */}
        <section className="space-y-4">
          <SectionLabel>O que muda</SectionLabel>
          <SectionTitle>
            O gratuito mostra a proposta. O premium abre o caminho.
          </SectionTitle>
          <SectionText>
            Na entrada gratuita, você conhece o método, estuda O Louco e sente a
            experiência. No premium, você avança com profundidade —
            arcano a arcano, no seu ritmo.
          </SectionText>
        </section>

        <Divider />

        {/* ═══════════ COMPARAÇÃO ═══════════ */}
        <section className="space-y-5">
          <SectionLabel>Comparação</SectionLabel>
          <SectionTitle>O que cada fase oferece</SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gratuito */}
            <div
              className="rounded-2xl p-5 space-y-3"
              style={{
                background: "hsl(var(--mystic-surface))",
                border: "1px solid hsl(var(--border) / 0.60)",
              }}
            >
              <div className="text-center pb-2" style={{ borderBottom: "1px solid hsl(var(--border) / 0.40)" }}>
                <p className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(var(--muted-foreground) / 0.50)" }}>
                  Gratuito
                </p>
              </div>
              <div className="space-y-2">
                {FREE_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(140 35% 45%)" }} />
                    <span className="text-[12px] font-body" style={{ color: "hsl(var(--muted-foreground) / 0.65)" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium */}
            <div
              className="rounded-2xl p-5 space-y-3 relative"
              style={{
                background: "linear-gradient(170deg, hsl(var(--mystic-surface)), hsl(var(--secondary) / 0.03))",
                border: "1.5px solid hsl(var(--gold) / 0.30)",
                boxShadow: "0 8px 40px hsl(var(--secondary) / 0.06)",
              }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span
                  className="text-[9px] font-heading tracking-[0.2em] uppercase px-3 py-1 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--crimson-light)))",
                    color: "hsl(var(--parchment))",
                    boxShadow: "0 2px 8px hsl(var(--secondary) / 0.20)",
                  }}
                >
                  ✦ Recomendado
                </span>
              </div>
              <div className="text-center pb-2" style={{ borderBottom: "1px solid hsl(var(--gold) / 0.18)" }}>
                <p className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(var(--secondary))" }}>
                  Premium
                </p>
              </div>
              <div className="space-y-2.5">
                {PREMIUM_UNLOCKS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(var(--gold))" }} />
                      <span className="text-[12px] font-body" style={{ color: "hsl(var(--muted-foreground) / 0.70)" }}>
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ═══════════ PRÓXIMOS ARCANOS ═══════════ */}
        <section className="space-y-5">
          <SectionLabel>Próximos arcanos</SectionLabel>
          <SectionTitle>O Mago e A Sacerdotisa esperam por você</SectionTitle>
          <SectionText>
            A jornada do tarô não termina em O Louco — ela começa. Cada arcano
            traz uma nova camada de compreensão, novos símbolos e novas perguntas.
          </SectionText>

          <div className="space-y-3 pt-2">
            {NEXT_ARCANOS.map((arcano, i) => (
              <div
                key={i}
                className="rounded-xl p-5 flex items-center gap-4"
                style={{
                  background: "linear-gradient(145deg, hsl(var(--mystic-surface) / 0.90), hsl(var(--card) / 0.85))",
                  border: "1.5px solid hsl(var(--gold) / 0.22)",
                  boxShadow: "0 4px 20px hsl(var(--secondary) / 0.04)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--mystic-surface)), hsl(var(--card)), hsl(var(--gold) / 0.12))",
                    border: `2px solid hsl(${arcano.hue} / 0.18)`,
                    boxShadow: `0 0 20px hsl(${arcano.hue} / 0.06)`,
                  }}
                >
                  <span className="font-heading text-lg" style={{ color: `hsl(${arcano.hue})` }}>
                    {arcano.numeral}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-base tracking-wide" style={{ color: "hsl(var(--midnight))" }}>
                    {arcano.name}
                  </h3>
                  <p className="font-accent text-[12px] italic" style={{ color: "hsl(var(--muted-foreground) / 0.55)" }}>
                    {arcano.subtitle}
                  </p>
                </div>
                <Crown className="w-4 h-4 shrink-0" style={{ color: "hsl(var(--gold) / 0.50)" }} />
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ═══════════ DIFERENCIAIS ═══════════ */}
        <section className="space-y-4">
          <SectionLabel>O diferencial</SectionLabel>
          <SectionTitle>
            Não é mais conteúdo. É a forma como o estudo foi construído.
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {HIGHLIGHTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl p-4 flex items-start gap-3.5"
                  style={{
                    background: "hsl(var(--mystic-surface) / 0.80)",
                    border: "1px solid hsl(var(--border) / 0.50)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: "hsl(var(--secondary) / 0.06)",
                      border: "1px solid hsl(var(--secondary) / 0.10)",
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "hsl(var(--secondary))" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-[13px] tracking-wide" style={{ color: "hsl(var(--midnight))" }}>
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-body leading-relaxed mt-0.5" style={{ color: "hsl(var(--muted-foreground) / 0.55)" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Divider />

        {/* ═══════════ MANIFESTO ═══════════ */}
        <section className="space-y-4">
          <SectionLabel>O método</SectionLabel>
          <SectionTitle>
            Estudar tarô é mais do que decorar cartas.
          </SectionTitle>
          <div className="max-w-md mx-auto space-y-3">
            <p className="text-[13px] font-body leading-relaxed text-center" style={{ color: "hsl(var(--muted-foreground) / 0.60)" }}>
              Tarô se aprende com o corpo inteiro: leitura, imagem, interação,
              narração e experiências imersivas com os arcanos. A Jornada
              Completa foi construída para desenvolver leitura viva, repertório
              simbólico e autonomia interpretativa.
            </p>
            <p className="font-accent text-[13px] italic text-center" style={{ color: "hsl(var(--muted-foreground) / 0.45)" }}>
              "O objetivo não é saber o que cada carta significa — é saber
              ouvir o que ela diz."
            </p>
          </div>
        </section>

        <Divider />

        {/* ═══════════ CTA FINAL + RESTORE ═══════════ */}
        <section className="text-center space-y-5 pt-4">
          <SectionLabel>Próximo passo</SectionLabel>
          <SectionTitle>
            Se O Louco te encantou, o próximo arcano vai te surpreender.
          </SectionTitle>

          <div className="flex flex-col items-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={handleSubscribe}
              className="font-heading tracking-wide px-10 py-6 text-sm"
              style={{
                background: "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--crimson-light)))",
                color: "hsl(var(--parchment))",
                border: "1px solid hsl(var(--secondary) / 0.40)",
                boxShadow: "0 6px 24px hsl(var(--secondary) / 0.18), inset 0 1px 0 hsl(var(--gold) / 0.10)",
              }}
            >
              <Crown className="w-4 h-4 mr-2" />
              Assinar {selectedPlan === "annual" ? "plano anual" : "plano mensal"}
            </Button>
            <p className="text-[10px] font-body" style={{ color: "hsl(var(--muted-foreground) / 0.40)" }}>
              Cancele quando quiser · Acesso imediato
            </p>
          </div>

          {/* Restore purchase */}
          <button
            onClick={handleRestore}
            className="inline-flex items-center gap-2 text-[11px] font-body transition-colors mt-4"
            style={{ color: "hsl(var(--muted-foreground) / 0.40)" }}
          >
            <RefreshCw className="w-3 h-3" />
            Restaurar compra anterior
          </button>

          <div className="pt-6">
            <div className="text-lg" style={{ color: "hsl(var(--gold) / 0.25)" }}>⟡</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PremiumPage;

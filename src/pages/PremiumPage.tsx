import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Sparkles, BookOpen, Star, Layers, Eye, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const PREMIUM_TIERS = [
  {
    icon: BookOpen,
    title: "Aprofundamentos",
    description: "Mergulhe nas camadas ocultas de cada arcano — simbolismo, história e conexões arquetípicas.",
    features: ["Análise simbólica completa", "Conexões entre arcanos", "Contexto histórico e esotérico"],
    free: false,
  },
  {
    icon: Layers,
    title: "Materiais Extras",
    description: "Cadernos de estudo, mapas simbólicos e materiais de apoio para sua prática pessoal.",
    features: ["Caderno de símbolos", "Mapas de correspondências", "Exercícios contemplativos"],
    free: false,
  },
  {
    icon: Compass,
    title: "Trilhas Avançadas",
    description: "Numerologia, astrologia nos arcanos, combinações e leituras complexas.",
    features: ["Numerologia arcana", "Correspondências astrológicas", "Combinações de cartas"],
    free: false,
  },
  {
    icon: Eye,
    title: "Prática Guiada",
    description: "Tiragens guiadas, meditações com arcanos e exercícios de intuição.",
    features: ["Tiragens passo a passo", "Meditações guiadas", "Diário de leituras"],
    free: false,
  },
  {
    icon: Star,
    title: "Biblioteca Completa",
    description: "Acesso integral à biblioteca de símbolos, significados e referências cruzadas.",
    features: ["78 arcanos detalhados", "Busca por símbolo", "Referências cruzadas"],
    free: false,
  },
];

const FREE_CONTENT = [
  "Introdução aos Arcanos Maiores",
  "Primeiras 3 cartas com conteúdo completo",
  "Quiz e exercícios básicos",
  "Flashcards de revisão",
  "Sistema de progresso e conquistas",
];

const PremiumPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-primary/5 to-transparent" />
        <div className="absolute top-6 left-6 text-primary/15 text-2xl">✦</div>
        <div className="absolute top-6 right-6 text-primary/15 text-2xl">✧</div>

        <div className="relative max-w-2xl mx-auto px-6 pt-8 pb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-[Inter]">Voltar</span>
          </button>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
              <Crown className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-[Cinzel] text-3xl font-semibold text-foreground tracking-wide">
              Jornada Completa
            </h1>
            <p className="font-[Cormorant_Garamond] text-lg text-muted-foreground italic leading-relaxed max-w-md mx-auto">
              Desbloqueie todas as camadas do conhecimento e mergulhe profundamente na sabedoria dos arcanos.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-16 space-y-10">
        {/* Free section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="font-[Cinzel] text-sm uppercase tracking-widest text-primary">
              Incluído gratuitamente
            </h2>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            {FREE_CONTENT.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                <span className="text-sm font-[Inter] text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-primary/40 text-xs">✦</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Premium tiers */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-secondary" />
            <h2 className="font-[Cinzel] text-sm uppercase tracking-widest text-secondary">
              Acesso Premium
            </h2>
          </div>

          <div className="space-y-4">
            {PREMIUM_TIERS.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <div
                  key={i}
                  className="group rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10 border border-secondary/20 shrink-0 group-hover:bg-secondary/15 transition-colors">
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="font-[Cinzel] text-base font-medium text-foreground">
                        {tier.title}
                      </h3>
                      <p className="text-sm font-[Inter] text-muted-foreground leading-relaxed">
                        {tier.description}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {tier.features.map((f, j) => (
                          <span
                            key={j}
                            className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-[Inter] text-muted-foreground"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4 pt-4">
          <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-secondary/5 p-6 text-center space-y-4">
            <p className="font-[Cormorant_Garamond] text-lg text-foreground italic">
              "A jornada completa revela o que os olhos não veem à primeira vista."
            </p>
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-[Cinzel] tracking-wide px-8"
            >
              <Crown className="w-4 h-4 mr-2" />
              Desbloquear Jornada Completa
            </Button>
            <p className="text-xs text-muted-foreground font-[Inter]">
              Em breve — cadastre-se para ser avisada no lançamento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;

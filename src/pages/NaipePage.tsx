import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Lock, Check, ChevronRight } from "lucide-react";
import {
  type Naipe,
  NAIPES,
  getCardsByNaipe,
  CARD_POSITIONS,
  getPositionLabel,
  getCardId,
  isCourtCard,
  hasContent,
} from "@/data/arcanos-menores";
import { useProgress } from "@/hooks/use-progress";
import mysticBg from "@/assets/mystic-bg.jpg";

const NAIPE_ROUTE_MAP: Record<string, Naipe> = {
  copas: "copas",
  paus: "paus",
  espadas: "espadas",
  ouros: "ouros",
};

const NaipePage = () => {
  const { naipe: naipeParam } = useParams();
  const navigate = useNavigate();
  const { progress } = useProgress();

  const naipe = NAIPE_ROUTE_MAP[naipeParam || ""];
  if (!naipe) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(36 33% 97%)" }}>
        <div className="text-center space-y-4">
          <p className="font-heading text-lg" style={{ color: "hsl(230 25% 15%)" }}>Naipe não encontrado</p>
          <button onClick={() => navigate("/app")} className="text-sm font-heading tracking-wider" style={{ color: "hsl(36 45% 58%)" }}>
            Voltar aos módulos
          </button>
        </div>
      </div>
    );
  }

  const naipeInfo = NAIPES[naipe];
  const cards = getCardsByNaipe(naipe);

  const isCardCompleted = (cardId: string) => progress.completedLessons.includes(cardId);
  const isCardUnlocked = (idx: number) => {
    if (idx === 0) return true;
    const prevCard = cards[idx - 1];
    return prevCard ? isCardCompleted(prevCard.id) : false;
  };

  const completedCount = cards.filter((c) => isCardCompleted(c.id)).length;
  const progressPct = Math.round((completedCount / 14) * 100);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <img src={mysticBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.10) 0%, hsl(36 33% 97% / 0.05) 30%, hsl(36 33% 97% / 0.08) 70%, hsl(36 33% 97% / 0.22) 100%)",
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10" style={{
        borderBottom: `1px solid ${naipeInfo.color.border}`,
        background: "linear-gradient(180deg, hsl(36 33% 96% / 0.94) 0%, hsl(38 28% 93% / 0.92) 100%)",
        backdropFilter: "blur(28px)",
      }}>
        <div className="container max-w-3xl py-5 px-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate("/app")} className="transition-colors hover:scale-105 duration-200" style={{ color: "hsl(230 10% 40%)" }}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col flex-1">
              <span className="text-[10px] tracking-[0.35em] uppercase font-body mb-1 flex items-center gap-1.5" style={{ color: naipeInfo.color.primary }}>
                {naipeInfo.icon} {naipeInfo.element}
              </span>
              <h1 className="font-heading text-xl md:text-2xl tracking-wide" style={{
                background: `linear-gradient(135deg, hsl(340 42% 22%), ${naipeInfo.color.primary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {naipeInfo.name}
              </h1>
            </div>
          </div>

          {/* Description */}
          <p className="font-accent text-xs italic leading-relaxed mb-4" style={{ color: "hsl(230 20% 25% / 0.60)" }}>
            {naipeInfo.description}
          </p>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2 mb-4">
            {naipeInfo.keywords.map((kw) => (
              <span key={kw} className="text-[10px] font-heading tracking-wider px-2.5 py-1 rounded-full" style={{
                background: naipeInfo.color.surface,
                border: `1px solid ${naipeInfo.color.border}`,
                color: naipeInfo.color.primary,
              }}>
                {kw}
              </span>
            ))}
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-heading tracking-wider" style={{ color: "hsl(230 10% 45%)" }}>
                {completedCount}/14 cartas
              </span>
              <span className="text-[10px] font-heading tracking-wider" style={{ color: naipeInfo.color.primary }}>
                {progressPct}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "hsl(36 18% 84%)", border: "1px solid hsl(36 22% 75% / 0.50)" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progressPct}%`, background: naipeInfo.color.primary }} />
            </div>
          </div>
        </div>
      </header>

      {/* Cards list */}
      <main className="relative z-10 container max-w-3xl py-8 px-6">
        {/* Numbered cards section */}
        <h2 className="font-heading text-xs tracking-[0.25em] uppercase text-center mb-4" style={{ color: "hsl(230 10% 45%)" }}>
          Ás ao Dez
        </h2>
        <div className="space-y-2.5 mb-8">
          {cards.filter((c) => typeof c.posicao === "number").map((card, i) => {
            const completed = isCardCompleted(card.id);
            const unlocked = isCardUnlocked(i);
            const isCurrent = unlocked && !completed;
            const filled = hasContent(card);

            return (
              <button
                key={card.id}
                onClick={() => filled && unlocked && navigate(`/arcano-menor/${card.id}`)}
                disabled={!unlocked || !filled}
                className="w-full text-left group transition-all duration-500"
                style={{ animation: `fade-up 0.4s ease-out both`, animationDelay: `${i * 50}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl transition-all duration-300" style={isCurrent && filled ? {
                  background: "linear-gradient(145deg, hsl(38 28% 93% / 0.94), hsl(36 33% 95% / 0.90))",
                  border: `1.5px solid ${naipeInfo.color.border}`,
                  boxShadow: `0 4px 20px ${naipeInfo.color.border}`,
                } : completed ? {
                  background: "hsl(38 28% 94% / 0.80)",
                  border: "1px solid hsl(36 42% 52% / 0.30)",
                } : {
                  background: "hsl(36 18% 90% / 0.45)",
                  border: "1px solid hsl(36 22% 80% / 0.45)",
                }}>
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={completed ? {
                      border: "2px solid hsl(36 42% 45% / 0.40)",
                      background: "hsl(38 28% 94% / 0.90)",
                    } : unlocked ? {
                      border: `1.5px solid ${naipeInfo.color.border}`,
                      background: naipeInfo.color.surface,
                    } : {
                      border: "1.5px solid hsl(36 22% 75% / 0.50)",
                      background: "hsl(36 18% 90% / 0.55)",
                    }}>
                      {completed ? (
                        <Check className="w-4 h-4" style={{ color: "hsl(36 42% 38%)" }} />
                      ) : unlocked ? (
                        <span className="text-xs font-heading" style={{ color: naipeInfo.color.primary }}>{typeof card.posicao === "number" ? card.posicao : ""}</span>
                      ) : (
                        <Lock className="w-3.5 h-3.5" style={{ color: "hsl(230 10% 45% / 0.30)" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-sm tracking-wide truncate" style={{
                        color: unlocked ? "hsl(230 20% 12% / 0.80)" : "hsl(230 10% 45% / 0.30)",
                      }}>
                        {card.nome}
                      </h3>
                      {card.subtitulo && (
                        <p className="font-accent text-xs italic truncate" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                          {card.subtitulo}
                        </p>
                      )}
                      {!filled && unlocked && (
                        <p className="text-[10px] font-body tracking-wider" style={{ color: "hsl(36 40% 50% / 0.60)" }}>
                          Conteúdo em breve
                        </p>
                      )}
                    </div>
                    {unlocked && filled && (
                      <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: naipeInfo.color.primary }} />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Court cards section */}
        <h2 className="font-heading text-xs tracking-[0.25em] uppercase text-center mb-4" style={{ color: "hsl(230 10% 45%)" }}>
          Cartas da Corte
        </h2>
        <div className="space-y-2.5">
          {cards.filter((c) => typeof c.posicao === "string").map((card, i) => {
            const globalIdx = 10 + i;
            const completed = isCardCompleted(card.id);
            const unlocked = isCardUnlocked(globalIdx);
            const isCurrent = unlocked && !completed;
            const filled = hasContent(card);

            return (
              <button
                key={card.id}
                onClick={() => filled && unlocked && navigate(`/arcano-menor/${card.id}`)}
                disabled={!unlocked || !filled}
                className="w-full text-left group transition-all duration-500"
                style={{ animation: `fade-up 0.4s ease-out both`, animationDelay: `${(10 + i) * 50}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl transition-all duration-300" style={isCurrent && filled ? {
                  background: `linear-gradient(145deg, ${naipeInfo.color.surface}, hsl(36 33% 95% / 0.90))`,
                  border: `1.5px solid ${naipeInfo.color.border}`,
                  boxShadow: `0 4px 20px ${naipeInfo.color.border}`,
                } : completed ? {
                  background: "hsl(38 28% 94% / 0.80)",
                  border: "1px solid hsl(36 42% 52% / 0.30)",
                } : {
                  background: "hsl(36 18% 90% / 0.45)",
                  border: "1px solid hsl(36 22% 80% / 0.45)",
                }}>
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={unlocked ? {
                      border: `1.5px solid ${naipeInfo.color.border}`,
                      background: naipeInfo.color.surface,
                    } : {
                      border: "1.5px solid hsl(36 22% 75% / 0.50)",
                      background: "hsl(36 18% 90% / 0.55)",
                    }}>
                      {completed ? (
                        <Check className="w-4 h-4" style={{ color: "hsl(36 42% 38%)" }} />
                      ) : unlocked ? (
                        <span className="text-xs" style={{ color: naipeInfo.color.primary }}>
                          {card.posicao === "pajem" ? "♟" : card.posicao === "cavaleiro" ? "♞" : card.posicao === "rainha" ? "♛" : "♚"}
                        </span>
                      ) : (
                        <Lock className="w-3.5 h-3.5" style={{ color: "hsl(230 10% 45% / 0.30)" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-sm tracking-wide truncate" style={{
                        color: unlocked ? "hsl(230 20% 12% / 0.80)" : "hsl(230 10% 45% / 0.30)",
                      }}>
                        {card.nome}
                      </h3>
                      {card.subtitulo && (
                        <p className="font-accent text-xs italic truncate" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                          {card.subtitulo}
                        </p>
                      )}
                      {!filled && unlocked && (
                        <p className="text-[10px] font-body tracking-wider" style={{ color: "hsl(36 40% 50% / 0.60)" }}>
                          Conteúdo em breve
                        </p>
                      )}
                    </div>
                    {unlocked && filled && (
                      <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: naipeInfo.color.primary }} />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default NaipePage;

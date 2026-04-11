import { useState, useEffect, useMemo } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getArcanoVivoConfig, type ArcanoVivoConfig } from "@/data/arcano-vivo-config";

interface ArcanoVivoIntroProps {
  arcanoId: number;
  name: string;
  numeral: string;
  subtitle: string;
  keywords: string[];
  cardImage: string;
  archetype: string;
  voiceIntro: string;
  voiceFullText: string;
  onEnterLesson: () => void;
}

type Phase = "darkness" | "reveal" | "awaken" | "shimmer" | "breathe" | "voice" | "ready";

/**
 * ARCANO VIVO — Intro Cinematográfica
 * 
 * Fases:
 * 1. darkness   — tela escura, silêncio
 * 2. reveal     — carta emerge das sombras
 * 3. awaken     — saturação aumenta, brilho cresce
 * 4. shimmer    — varredura de luz sobre a carta
 * 5. breathe    — aura começa a pulsar, partículas surgem
 * 6. voice      — arcano fala em primeira pessoa
 * 7. ready      — CTA para iniciar lição
 */
export function ArcanoVivoIntro({
  arcanoId, name, numeral, subtitle, keywords, cardImage,
  archetype, voiceIntro, voiceFullText, onEnterLesson,
}: ArcanoVivoIntroProps) {
  const config = useMemo(() => getArcanoVivoConfig(arcanoId), [arcanoId]);
  const [phase, setPhase] = useState<Phase>("darkness");
  const [voiceMode, setVoiceMode] = useState<"intro" | "full">("intro");
  const [charIndex, setCharIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [particlesVisible, setParticlesVisible] = useState(false);

  const activeText = voiceMode === "full" ? voiceFullText : voiceIntro;
  const typingDone = charIndex >= activeText.length;

  // Phase progression
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    timers.push(setTimeout(() => setPhase("reveal"), 400));
    timers.push(setTimeout(() => setPhase("awaken"), config.awakenDelay + 400));
    timers.push(setTimeout(() => setPhase("shimmer"), config.shimmerDelay + 400));
    timers.push(setTimeout(() => {
      setPhase("breathe");
      setParticlesVisible(true);
    }, config.shimmerDelay + 1200));
    timers.push(setTimeout(() => setPhase("voice"), config.shimmerDelay + 2200));

    return () => timers.forEach(clearTimeout);
  }, [config]);

  // Typewriter
  useEffect(() => {
    if (phase !== "voice" && phase !== "ready") return;
    if (charIndex >= activeText.length) {
      if (phase === "voice") setPhase("ready");
      return;
    }
    const speed = config.voiceStyle === "mystical" ? 30 : config.voiceStyle === "gentle" ? 26 : 22;
    const t = setTimeout(() => setCharIndex(i => i + 1), speed);
    return () => clearTimeout(t);
  }, [phase, charIndex, activeText, config.voiceStyle]);

  // Reset char index when switching voice mode
  useEffect(() => {
    setCharIndex(0);
    if (phase === "ready") setPhase("voice");
  }, [voiceMode]);

  const handleListen = () => {
    if (isListening) {
      window.speechSynthesis?.cancel();
      setIsListening(false);
      return;
    }
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(activeText);
      u.lang = "pt-BR";
      u.rate = config.voiceStyle === "mystical" ? 0.75 : 0.85;
      u.pitch = config.voiceStyle === "mystical" ? 0.8 : 0.9;
      u.onend = () => setIsListening(false);
      window.speechSynthesis.speak(u);
      setIsListening(true);
    }
  };

  const skipTyping = () => setCharIndex(activeText.length);

  const isRevealed = phase !== "darkness";
  const isAwakened = ["awaken", "shimmer", "breathe", "voice", "ready"].includes(phase);
  const isShimmering = phase === "shimmer";
  const isBreathing = ["breathe", "voice", "ready"].includes(phase);
  const showVoice = ["voice", "ready"].includes(phase);

  return (
    <div
      className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ "--arcano-glow": config.glowColor } as React.CSSProperties}
    >
      {/* Atmosphere gradient layers */}
      {config.atmosphere.map((stop, i) => (
        <div
          key={i}
          className="absolute inset-0 pointer-events-none transition-opacity duration-[2s]"
          style={{
            background: `radial-gradient(ellipse at ${i === 0 ? "50% 30%" : i === 1 ? "30% 70%" : "70% 50%"}, ${stop} 0%, transparent 65%)`,
            opacity: isBreathing ? 1 : 0,
          }}
        />
      ))}

      {/* Floating particles */}
      {particlesVisible && (
        <ParticleField particles={config.particles} intensity={config.intensity} glowColor={config.glowColor} />
      )}

      {/* Orbiting symbols */}
      {isBreathing && config.orbitSymbols && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {config.orbitSymbols.map((sym, i) => (
            <span
              key={i}
              className="absolute arcano-vivo-symbol"
              style={{
                "--orbit-radius": `${130 + i * 30}px`,
                animation: `arcano-symbol-orbit ${18 + i * 8}s linear infinite`,
                animationDelay: `${i * 3}s`,
                color: `hsl(${config.glowColor} / 0.25)`,
                fontSize: "14px",
              } as React.CSSProperties}
            >
              {sym}
            </span>
          ))}
        </div>
      )}

      {/* Card container */}
      <div className="relative">
        {/* Outer aura (breathing) */}
        <div
          className="absolute -inset-6 rounded-3xl pointer-events-none arcano-vivo-aura transition-opacity duration-1000"
          style={{
            background: `radial-gradient(ellipse, hsl(${config.glowColor} / ${isBreathing ? 0.15 : 0}) 0%, transparent 70%)`,
            animation: isBreathing ? `arcano-breathe ${config.breatheSpeed}s ease-in-out infinite` : undefined,
          }}
        />

        {/* The card itself */}
        <div
          className="arcano-vivo-card relative w-48 h-72 sm:w-56 sm:h-80 rounded-2xl overflow-hidden"
          style={{
            border: `2px solid hsl(${config.glowColor} / 0.40)`,
            animation: isRevealed
              ? isBreathing
                ? `arcano-aura-pulse ${config.breatheSpeed}s ease-in-out infinite, arcano-border-glow ${config.breatheSpeed}s ease-in-out infinite`
                : "arcano-card-awaken 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards"
              : undefined,
            opacity: isRevealed ? undefined : 0,
            boxShadow: `0 16px 48px hsl(${config.glowColor} / 0.15), 0 0 80px hsl(${config.ambientColor} / 0.08)`,
          }}
        >
          {/* Card image */}
          <img
            src={cardImage}
            alt={name}
            className="w-full h-full object-cover transition-all duration-[2s]"
            style={{
              filter: isAwakened ? "brightness(1) saturate(1)" : "brightness(0.5) saturate(0.3)",
            }}
          />

          {/* Shimmer sweep */}
          {isShimmering && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(105deg, transparent 30%, hsl(${config.glowColor} / 0.35) 50%, transparent 70%)`,
                animation: "arcano-shimmer-sweep 1.2s ease-in-out forwards",
              }}
            />
          )}

          {/* Bottom gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, hsl(230 25% 6% / 0.75) 0%, hsl(230 25% 8% / 0.2) 35%, transparent 65%)`,
            }}
          />

          {/* Card identity */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
            <p
              className="font-heading text-[10px] tracking-[0.35em] mb-1 transition-opacity duration-1000"
              style={{ color: `hsl(${config.glowColor})`, opacity: isAwakened ? 1 : 0 }}
            >
              {numeral}
            </p>
            <h1
              className="font-heading text-lg tracking-wide transition-opacity duration-1000"
              style={{ color: "hsl(36 33% 95%)", opacity: isAwakened ? 1 : 0 }}
            >
              {name}
            </h1>
          </div>

          {/* Subtle vibration on breathe */}
          {isBreathing && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                animation: "subtle-vibrate 0.15s linear infinite",
                opacity: 0.3,
                mixBlendMode: "overlay",
                background: `radial-gradient(circle at 50% 40%, hsl(${config.glowColor} / 0.05) 0%, transparent 60%)`,
              }}
            />
          )}
        </div>

        {/* Corner ornaments with breathing */}
        {isBreathing && (
          <>
            {[
              "-top-2 -left-2",
              "-top-2 -right-2",
              "-bottom-2 -left-2",
              "-bottom-2 -right-2",
            ].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-1.5 h-1.5 rounded-full`}
                style={{
                  background: `hsl(${config.glowColor} / 0.6)`,
                  animation: `twinkle ${2 + i * 0.7}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                  boxShadow: `0 0 6px hsl(${config.glowColor} / 0.3)`,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Subtitle & keywords */}
      <div
        className="mt-6 text-center transition-all duration-700"
        style={{ opacity: isAwakened ? 1 : 0, transform: isAwakened ? "translateY(0)" : "translateY(8px)" }}
      >
        <p className="text-[10px] font-heading tracking-[0.3em] uppercase mb-3" style={{ color: "hsl(36 40% 42%)" }}>
          {subtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="px-2.5 py-0.5 rounded-full text-[10px] font-medium"
              style={{
                background: `hsl(${config.glowColor} / 0.08)`,
                border: `1px solid hsl(${config.glowColor} / 0.18)`,
                color: "hsl(36 40% 35%)",
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Archetype */}
      <p
        className="mt-4 text-center text-xs font-accent italic leading-relaxed max-w-xs transition-all duration-700"
        style={{ color: "hsl(230 20% 25% / 0.60)", opacity: isBreathing ? 1 : 0 }}
      >
        {archetype}
      </p>

      {/* Voice section */}
      {showVoice && (
        <div className="mt-8 w-full max-w-md" style={{ animation: "arcano-voice-emerge 0.8s ease-out" }}>
          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, hsl(${config.glowColor} / 0.3), transparent)` }} />
            <span className="text-[9px] font-heading tracking-[0.3em] uppercase" style={{ color: `hsl(${config.glowColor} / 0.7)` }}>
              A voz do arcano
            </span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, hsl(${config.glowColor} / 0.3), transparent)` }} />
          </div>

          {/* Quote card */}
          <div
            className="relative rounded-2xl p-5 sm:p-6"
            style={{
              background: "linear-gradient(135deg, hsl(36 33% 97% / 0.9), hsl(38 30% 94% / 0.95))",
              border: `1px solid hsl(${config.glowColor} / 0.25)`,
              boxShadow: `0 8px 32px hsl(${config.glowColor} / 0.08), inset 0 1px 0 hsl(${config.glowColor} / 0.12)`,
            }}
          >
            <span className="absolute top-2 left-3 text-xl font-accent select-none" style={{ color: `hsl(${config.glowColor} / 0.2)` }}>"</span>
            <span className="absolute bottom-2 right-3 text-xl font-accent select-none" style={{ color: `hsl(${config.glowColor} / 0.2)` }}>"</span>

            <p
              className="font-accent text-sm sm:text-base leading-relaxed italic whitespace-pre-line min-h-[60px]"
              style={{ color: "hsl(230 25% 18%)" }}
            >
              {activeText.substring(0, charIndex)}
              {!typingDone && (
                <span
                  className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                  style={{ background: `hsl(${config.glowColor})`, animation: "pulse-gold 1s ease-in-out infinite" }}
                />
              )}
            </p>

            {/* Controls */}
            <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: `1px solid hsl(${config.glowColor} / 0.12)` }}>
              <span className="text-[10px] font-heading tracking-[0.2em] uppercase" style={{ color: `hsl(${config.glowColor} / 0.7)` }}>
                — {name}
              </span>
              <div className="flex items-center gap-2">
                {!typingDone && (
                  <button onClick={skipTyping} className="text-[10px] font-heading tracking-wider px-2 py-1 rounded-full" style={{ color: "hsl(230 10% 50%)" }}>
                    Revelar
                  </button>
                )}
                {typingDone && voiceMode === "intro" && (
                  <button
                    onClick={() => setVoiceMode("full")}
                    className="text-[10px] font-heading tracking-wider px-2 py-1 rounded-full"
                    style={{ color: `hsl(${config.glowColor})` }}
                  >
                    Ler mais
                  </button>
                )}
                <button
                  onClick={handleListen}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: `hsl(${config.glowColor} / ${isListening ? 0.15 : 0.08})`,
                    border: `1px solid hsl(${config.glowColor} / ${isListening ? 0.4 : 0.2})`,
                  }}
                  title={isListening ? "Parar" : "Ouvir o Arcano"}
                >
                  {isListening ? (
                    <VolumeX className="w-3.5 h-3.5" style={{ color: `hsl(${config.glowColor})` }} />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" style={{ color: `hsl(${config.glowColor})` }} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      {phase === "ready" && typingDone && (
        <div className="mt-8 flex flex-col items-center gap-3" style={{ animation: "arcano-voice-emerge 0.5s ease-out" }}>
          <button
            onClick={onEnterLesson}
            className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: `linear-gradient(135deg, hsl(36 40% 42%), hsl(${config.glowColor}))`,
              color: "hsl(36 33% 97%)",
              boxShadow: `0 4px 24px hsl(${config.glowColor} / 0.25), 0 0 40px hsl(${config.ambientColor} / 0.08)`,
            }}
          >
            ✦ Começar a Lição
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Particle Field Component ───

function ParticleField({ particles, intensity, glowColor }: { particles: string[]; intensity: ArcanoVivoConfig["intensity"]; glowColor: string }) {
  const count = intensity === "intense" ? 12 : intensity === "moderate" ? 8 : 5;

  const items = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const symbol = particles[i % particles.length];
      const x = 10 + Math.random() * 80;
      const y = 10 + Math.random() * 80;
      const driftX = (Math.random() - 0.5) * 40;
      const duration = 4 + Math.random() * 6;
      const delay = Math.random() * 5;
      const size = 8 + Math.random() * 6;
      const useFloat = Math.random() > 0.5;

      return { symbol, x, y, driftX, duration, delay, size, useFloat };
    });
  }, [particles, count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((p, i) => (
        <span
          key={i}
          className="absolute arcano-vivo-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            color: `hsl(${glowColor} / 0.35)`,
            "--drift-x": `${p.driftX}px`,
            animation: `${p.useFloat ? "particle-float" : "particle-drift"} ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}

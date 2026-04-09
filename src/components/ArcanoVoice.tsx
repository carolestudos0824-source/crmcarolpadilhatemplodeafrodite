import { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface ArcanoVoiceProps {
  text: string;
  arcanoName: string;
}

function useTypewriter(text: string, speed = 28, active = true) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setIndex(0);
    setDone(false);
  }, [text]);

  useEffect(() => {
    if (!active || done) return;
    if (index >= text.length) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setIndex((i) => i + 1), speed);
    return () => clearTimeout(t);
  }, [index, text, speed, active, done]);

  const skip = useCallback(() => {
    setIndex(text.length);
    setDone(true);
  }, [text]);

  return { displayed: text.substring(0, index), done, skip };
}

export function ArcanoVoice({ text, arcanoName }: ArcanoVoiceProps) {
  const [isListening, setIsListening] = useState(false);
  const { displayed, done, skip } = useTypewriter(text, 24, true);

  const handleListen = () => {
    if (isListening) {
      window.speechSynthesis?.cancel();
      setIsListening(false);
      return;
    }
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.9;
      utterance.pitch = 0.95;
      utterance.onend = () => setIsListening(false);
      window.speechSynthesis.speak(utterance);
      setIsListening(true);
    }
  };

  return (
    <div className="relative">
      {/* Decorative quote frame */}
      <div
        className="relative rounded-2xl p-6 md:p-8"
        style={{
          background: "linear-gradient(135deg, hsl(36 33% 97% / 0.85), hsl(38 30% 94% / 0.9))",
          border: "1px solid hsl(36 45% 58% / 0.25)",
          boxShadow:
            "0 8px 32px hsl(36 45% 58% / 0.08), inset 0 1px 0 hsl(36 45% 58% / 0.15), inset 0 -1px 0 hsl(36 25% 82% / 0.3)",
        }}
      >
        {/* Corner ornaments */}
        <span className="absolute top-3 left-4 text-2xl text-primary/25 font-accent leading-none select-none">"</span>
        <span className="absolute bottom-3 right-4 text-2xl text-primary/25 font-accent leading-none select-none">"</span>

        {/* Voice text */}
        <p className="font-accent text-base md:text-lg leading-relaxed italic whitespace-pre-line"
          style={{ color: "hsl(230 25% 18%)" }}
        >
          {displayed}
          {!done && (
            <span
              className="inline-block w-0.5 h-5 ml-1 align-middle"
              style={{
                background: "hsl(36 45% 58%)",
                animation: "pulse-gold 1s ease-in-out infinite",
              }}
            />
          )}
        </p>

        {/* Attribution */}
        <div className="mt-4 pt-3 flex items-center justify-between"
          style={{ borderTop: "1px solid hsl(36 45% 58% / 0.15)" }}
        >
          <span className="text-xs font-heading tracking-widest uppercase"
            style={{ color: "hsl(36 40% 42%)" }}
          >
            — {arcanoName}
          </span>

          <div className="flex items-center gap-3">
            {!done && (
              <button
                onClick={skip}
                className="text-xs transition-colors font-heading tracking-wider"
                style={{ color: "hsl(230 10% 50%)" }}
              >
                Revelar tudo
              </button>
            )}
            <button
              onClick={handleListen}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                background: isListening ? "hsl(36 45% 58% / 0.15)" : "hsl(36 45% 58% / 0.08)",
                border: `1px solid hsl(36 45% 58% / ${isListening ? "0.4" : "0.2"})`,
              }}
              title={isListening ? "Parar" : "Ouvir o Arcano"}
            >
              {isListening ? (
                <VolumeX className="w-4 h-4" style={{ color: "hsl(36 45% 58%)" }} />
              ) : (
                <Volume2 className="w-4 h-4" style={{ color: "hsl(36 45% 58%)" }} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

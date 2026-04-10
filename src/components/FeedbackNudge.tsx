import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X } from "lucide-react";

const NUDGE_DISMISSED_KEY = "feedback-nudge-dismissed";

interface Props {
  lessonsCompleted: number;
}

const FeedbackNudge = ({ lessonsCompleted }: Props) => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(NUDGE_DISMISSED_KEY) === "1");

  // Only show after 3+ lessons and not dismissed
  if (lessonsCompleted < 3 || dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(NUDGE_DISMISSED_KEY, "1");
    setDismissed(true);
  };

  return (
    <div
      className="relative rounded-xl p-4 mb-4 overflow-hidden"
      style={{
        background: "linear-gradient(145deg, hsl(280 30% 32% / 0.04), hsl(38 28% 93% / 0.90))",
        border: "1px solid hsl(280 30% 32% / 0.15)",
        animation: "fade-in 0.5s ease-out",
      }}
    >
      <button
        onClick={dismiss}
        className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
        style={{ color: "hsl(230 15% 40% / 0.25)" }}
      >
        <X className="w-3 h-3" />
      </button>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{
          background: "hsl(280 30% 32% / 0.06)",
          border: "1px solid hsl(280 30% 32% / 0.15)",
        }}>
          <MessageCircle className="w-4 h-4" style={{ color: "hsl(280 30% 32%)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading text-[12px] tracking-wide" style={{ color: "hsl(280 30% 25%)" }}>
            O que está achando até aqui?
          </p>
          <p className="text-[10px] font-body" style={{ color: "hsl(230 15% 30% / 0.45)" }}>
            Sua opinião molda a plataforma.{" "}
            <button
              onClick={() => { dismiss(); navigate("/feedback"); }}
              className="underline font-medium transition-colors hover:text-foreground"
              style={{ color: "hsl(280 30% 32%)" }}
            >
              Enviar feedback →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackNudge;

import { useState } from "react";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

interface LessonFeedbackProps {
  lessonId: string;
  lessonName: string;
}

const EMOJI_OPTIONS = [
  { emoji: "😔", value: 1 },
  { emoji: "😐", value: 2 },
  { emoji: "🙂", value: 3 },
  { emoji: "😊", value: 4 },
  { emoji: "🤩", value: 5 },
];

const LessonFeedback = ({ lessonId, lessonName }: LessonFeedbackProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!user || !rating) return;
    setSending(true);
    const { error } = await supabase.from("beta_feedback").insert({
      user_id: user.id,
      page: `/lesson/${lessonId}`,
      type: "praise",
      message: `[LESSON: ${lessonName}] Rating: ${rating}/5${comment ? ` — ${comment}` : ""}`,
      rating,
    });
    setSending(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  if (!user) return null;

  if (sent) {
    return (
      <div className="text-center py-4 rounded-xl" style={{
        background: "hsl(140 35% 45% / 0.06)",
        border: "1px solid hsl(140 35% 45% / 0.15)",
      }}>
        <p className="text-sm font-accent italic" style={{ color: "hsl(140 35% 40%)" }}>
          Obrigada pelo feedback! 💜
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-5 space-y-4" style={{
      background: "hsl(38 28% 95% / 0.70)",
      border: "1px solid hsl(36 25% 82% / 0.50)",
    }}>
      <div className="text-center">
        <p className="text-[10px] font-heading tracking-[0.25em] uppercase" style={{ color: "hsl(280 30% 35% / 0.60)" }}>
          Como foi essa lição?
        </p>
      </div>

      {/* Emoji rating */}
      <div className="flex justify-center gap-2">
        {EMOJI_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setRating(opt.value)}
            className="w-10 h-10 rounded-xl text-xl transition-all"
            style={{
              background: rating === opt.value ? "hsl(36 45% 58% / 0.15)" : "transparent",
              border: `1.5px solid ${rating === opt.value ? "hsl(36 45% 58% / 0.30)" : "transparent"}`,
              transform: rating === opt.value ? "scale(1.15)" : "scale(1)",
              opacity: rating && rating !== opt.value ? 0.4 : 1,
            }}
          >
            {opt.emoji}
          </button>
        ))}
      </div>

      {/* Expandable comment */}
      {rating > 0 && (
        <div className="space-y-3 animate-fade-in">
          {!showComment ? (
            <button
              onClick={() => setShowComment(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-accent italic transition-colors"
              style={{ color: "hsl(230 15% 40% / 0.40)" }}
            >
              <MessageCircle className="w-3 h-3" />
              Quer contar mais?
            </button>
          ) : (
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="O que achou? O que pode melhorar?"
              rows={2}
              className="text-sm resize-none"
            />
          )}

          <Button
            onClick={handleSend}
            disabled={sending}
            size="sm"
            className="w-full font-heading tracking-wide text-[10px] uppercase"
            style={{
              background: "linear-gradient(135deg, hsl(340 42% 28% / 0.80), hsl(280 30% 28% / 0.80))",
              color: "hsl(36 33% 97%)",
            }}
          >
            {sending ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LessonFeedback;

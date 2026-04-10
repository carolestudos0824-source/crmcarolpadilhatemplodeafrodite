import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Star, MessageCircle, Sparkles, BookOpen,
  ThumbsUp, ThumbsDown, AlertCircle, Lightbulb, Heart,
  Send, CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

type FeedbackCategory = "lesson" | "clarity" | "experience" | "difficulty" | "suggestion" | "general";

const CATEGORIES: { id: FeedbackCategory; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
  { id: "lesson", label: "Avaliar Lição", icon: <BookOpen className="w-5 h-5" />, desc: "Como foi a lição que você acabou de estudar?", color: "hsl(36 45% 50%)" },
  { id: "clarity", label: "Clareza", icon: <Star className="w-5 h-5" />, desc: "O conteúdo ficou claro? Entendeu bem?", color: "hsl(200 50% 45%)" },
  { id: "experience", label: "Experiência", icon: <Heart className="w-5 h-5" />, desc: "Como foi sua experiência com o arcano?", color: "hsl(340 42% 30%)" },
  { id: "difficulty", label: "Dificuldade", icon: <AlertCircle className="w-5 h-5" />, desc: "Algo foi confuso ou difícil?", color: "hsl(25 80% 50%)" },
  { id: "suggestion", label: "Sugestão", icon: <Lightbulb className="w-5 h-5" />, desc: "Tem uma ideia para melhorar algo?", color: "hsl(50 70% 45%)" },
  { id: "general", label: "Comentário", icon: <MessageCircle className="w-5 h-5" />, desc: "Quer dizer algo? Estamos ouvindo.", color: "hsl(280 30% 35%)" },
];

const EMOJI_RATINGS = [
  { emoji: "😔", label: "Difícil", value: 1 },
  { emoji: "😐", label: "Confuso", value: 2 },
  { emoji: "🙂", label: "OK", value: 3 },
  { emoji: "😊", label: "Bom", value: 4 },
  { emoji: "🤩", label: "Incrível", value: 5 },
];

const FeedbackPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState<FeedbackCategory | null>(null);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!user || !selected) return;
    setSending(true);

    const typeMap: Record<FeedbackCategory, string> = {
      lesson: "praise",
      clarity: "other",
      experience: "praise",
      difficulty: "bug",
      suggestion: "suggestion",
      general: "other",
    };

    const { error } = await supabase.from("beta_feedback").insert({
      user_id: user.id,
      page: `/feedback/${selected}`,
      type: typeMap[selected],
      message: `[${selected.toUpperCase()}] ${message.trim()}`,
      rating: rating || null,
    });

    setSending(false);
    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  const resetForm = () => {
    setSelected(null);
    setRating(0);
    setMessage("");
    setSent(false);
  };

  const activeCategory = CATEGORIES.find(c => c.id === selected);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(280 30% 30% / 0.06) 0%, transparent 55%)",
        }} />
        <div className="relative max-w-xl mx-auto px-6 pt-8 pb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-body">Voltar</span>
          </button>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl" style={{
              background: "hsl(280 30% 30% / 0.08)",
              border: "1px solid hsl(280 30% 30% / 0.15)",
            }}>
              <MessageCircle className="w-5 h-5" style={{ color: "hsl(280 30% 35%)" }} />
            </div>
            <h1 className="font-heading text-xl tracking-wide" style={{ color: "hsl(230 25% 12%)" }}>
              Sua voz importa
            </h1>
            <p className="font-accent text-sm italic" style={{ color: "hsl(230 15% 30% / 0.45)" }}>
              Cada opinião ajuda a tornar essa jornada mais bonita e profunda.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 pb-16">
        {/* Success state */}
        {sent ? (
          <div className="text-center py-16 space-y-5 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full" style={{
              background: "hsl(140 35% 45% / 0.10)",
              border: "1.5px solid hsl(140 35% 45% / 0.25)",
            }}>
              <CheckCircle className="w-7 h-7" style={{ color: "hsl(140 35% 45%)" }} />
            </div>
            <h2 className="font-heading text-lg" style={{ color: "hsl(230 25% 12%)" }}>Gratidão 💜</h2>
            <p className="text-sm max-w-xs mx-auto" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
              Seu feedback foi recebido com carinho. Ele nos ajuda a construir algo cada vez melhor para você.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" onClick={resetForm} className="font-heading tracking-wide text-[11px] uppercase">
                Enviar outro
              </Button>
              <Button onClick={() => navigate("/app")} className="font-heading tracking-wide text-[11px] uppercase"
                style={{ background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 42% 32%))", color: "hsl(36 33% 97%)" }}
              >
                Voltar à jornada
              </Button>
            </div>
          </div>
        ) : !selected ? (
          /* Category selection */
          <div className="space-y-6 pt-4">
            <p className="text-center text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(230 15% 40% / 0.40)" }}>
              Sobre o que quer falar?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelected(cat.id)}
                  className="rounded-xl p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "hsl(38 28% 95% / 0.80)",
                    border: "1px solid hsl(36 25% 82% / 0.50)",
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{
                    background: `${cat.color}11`,
                    border: `1px solid ${cat.color}22`,
                    color: cat.color,
                  }}>
                    {cat.icon}
                  </div>
                  <p className="font-heading text-[13px] tracking-wide" style={{ color: "hsl(230 25% 15%)" }}>{cat.label}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "hsl(230 15% 30% / 0.40)" }}>{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Feedback form */
          <div className="space-y-6 pt-4 animate-fade-in">
            {/* Category pill */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
                  background: `${activeCategory!.color}11`,
                  color: activeCategory!.color,
                }}>
                  {activeCategory!.icon}
                </div>
                <span className="font-heading text-sm tracking-wide" style={{ color: "hsl(230 25% 15%)" }}>
                  {activeCategory!.label}
                </span>
              </div>
              <button onClick={() => { setSelected(null); setRating(0); setMessage(""); }} className="text-[10px] font-accent italic" style={{ color: "hsl(230 15% 40% / 0.40)" }}>
                Trocar
              </button>
            </div>

            {/* Prompt */}
            <p className="font-accent text-sm italic" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
              {activeCategory!.desc}
            </p>

            {/* Emoji rating */}
            <div>
              <p className="text-[10px] font-heading tracking-[0.2em] uppercase mb-3" style={{ color: "hsl(230 15% 40% / 0.40)" }}>
                Como você se sentiu?
              </p>
              <div className="flex justify-between gap-2">
                {EMOJI_RATINGS.map(r => (
                  <button
                    key={r.value}
                    onClick={() => setRating(r.value)}
                    className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all"
                    style={{
                      background: rating === r.value ? "hsl(36 45% 58% / 0.12)" : "hsl(38 28% 95% / 0.60)",
                      border: `1.5px solid ${rating === r.value ? "hsl(36 45% 58% / 0.30)" : "hsl(36 25% 82% / 0.40)"}`,
                      transform: rating === r.value ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <span className="text-[9px] font-heading tracking-wider" style={{
                      color: rating === r.value ? "hsl(36 45% 45%)" : "hsl(230 15% 40% / 0.35)",
                    }}>
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <p className="text-[10px] font-heading tracking-[0.2em] uppercase mb-2" style={{ color: "hsl(230 15% 40% / 0.40)" }}>
                Quer contar mais? (opcional)
              </p>
              <Textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Escreva livremente... Pode ser uma palavra, uma frase, ou um parágrafo inteiro."
                rows={4}
                className="text-sm resize-none"
                style={{
                  background: "hsl(38 28% 95% / 0.60)",
                  border: "1px solid hsl(36 25% 82% / 0.50)",
                }}
              />
            </div>

            {/* Send */}
            <Button
              onClick={handleSend}
              disabled={(!message.trim() && !rating) || sending}
              className="w-full gap-2 font-heading tracking-wide text-[11px] uppercase py-5"
              style={{
                background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 42% 32%))",
                color: "hsl(36 33% 97%)",
              }}
            >
              <Send className="w-3.5 h-3.5" />
              {sending ? "Enviando..." : "Enviar com carinho"}
            </Button>

            <p className="text-center text-[10px] font-accent italic" style={{ color: "hsl(230 15% 40% / 0.30)" }}>
              Seus feedbacks são confidenciais e usados apenas para melhorar a plataforma.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;

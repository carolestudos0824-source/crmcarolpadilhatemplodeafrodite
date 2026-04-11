import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, Eye, EyeOff } from "lucide-react";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    // Check hash for recovery token
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/auth"), 2000);
    }
    setLoading(false);
  };

  if (!isRecovery && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "linear-gradient(170deg, hsl(36 33% 97%), hsl(38 28% 93%))" }}>
        <div className="text-center space-y-4">
          <p className="text-sm" style={{ color: "hsl(230 20% 30%)" }}>Link de recuperação inválido ou expirado.</p>
          <Button variant="outline" onClick={() => navigate("/auth")}>Voltar ao login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(170deg, hsl(36 33% 97%), hsl(38 28% 93%))" }}>
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mx-auto"
            style={{ background: "linear-gradient(135deg, hsl(340 42% 28% / 0.08), hsl(36 45% 58% / 0.12))", border: "1px solid hsl(36 45% 58% / 0.20)" }}>
            <Crown className="w-5 h-5" style={{ color: "hsl(36 45% 50%)" }} />
          </div>
          <h1 className="font-heading text-xl tracking-wide" style={{ color: "hsl(340 42% 20%)" }}>
            {success ? "Senha atualizada!" : "Nova senha"}
          </h1>
          {success && (
            <p className="text-sm" style={{ color: "hsl(120 40% 35%)" }}>Redirecionando para o login...</p>
          )}
        </div>

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <label className="text-[11px] text-muted-foreground mb-1 block">Nova senha</label>
              <Input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-7 text-muted-foreground">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-destructive text-center">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full font-heading tracking-wide text-[11px] uppercase py-5"
              style={{ background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 42% 32%))", color: "hsl(36 33% 97%)" }}>
              {loading ? "Aguarde..." : "Salvar nova senha"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;

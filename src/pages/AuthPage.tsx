import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, ArrowLeft, Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const { error } = await signUp(email, password, name);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    navigate("/app");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(170deg, hsl(36 33% 97%), hsl(38 28% 93%))" }}
    >
      <div className="w-full max-w-sm space-y-6">
        {/* Back */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mx-auto" style={{
            background: "linear-gradient(135deg, hsl(340 42% 28% / 0.08), hsl(36 45% 58% / 0.12))",
            border: "1px solid hsl(36 45% 58% / 0.20)",
          }}>
            <Crown className="w-5 h-5" style={{ color: "hsl(36 45% 50%)" }} />
          </div>
          <h1 className="font-heading text-xl tracking-wide" style={{ color: "hsl(340 42% 20%)" }}>
            {mode === "signup" ? "Criar conta" : "Entrar"}
          </h1>
          <p className="text-xs" style={{ color: "hsl(230 15% 40% / 0.45)" }}>
            {mode === "signup" ? "Junte-se à beta privada da jornada." : "Bem-vinda de volta à jornada."}
          </p>
          <span className="inline-block text-[9px] font-heading tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full" style={{
            background: "hsl(340 42% 28% / 0.08)",
            color: "hsl(340 42% 28%)",
            border: "1px solid hsl(340 42% 28% / 0.15)",
          }}>
            ✦ Beta Privada
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Nome</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" />
            </div>
          )}
          <div>
            <label className="text-[11px] text-muted-foreground mb-1 block">E-mail</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required />
          </div>
          <div className="relative">
            <label className="text-[11px] text-muted-foreground mb-1 block">Senha</label>
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

          {error && (
            <p className="text-xs text-destructive text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full font-heading tracking-wide text-[11px] uppercase py-5"
            style={{
              background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 42% 32%))",
              color: "hsl(36 33% 97%)",
            }}
          >
            {loading ? "Aguarde..." : mode === "signup" ? "Criar Conta" : "Entrar"}
          </Button>
        </form>

        {/* Toggle mode */}
        <p className="text-center text-xs" style={{ color: "hsl(230 15% 40% / 0.45)" }}>
          {mode === "signup" ? "Já tem conta?" : "Não tem conta?"}{" "}
          <button onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }} className="font-medium underline" style={{ color: "hsl(340 42% 28%)" }}>
            {mode === "signup" ? "Entrar" : "Criar conta"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, ArrowLeft, Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "forgot" ? "forgot" : "signup";
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditorLoading, setAuditorLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  // Preview-only: show auditor login button on lovable preview hosts (NOT production)
  const isPreviewHost = (() => {
    if (typeof window === "undefined") return false;
    const h = window.location.hostname;
    if (h === "apptaro.lovable.app") return false;
    return (
      h.endsWith(".lovable.app") ||
      h.endsWith(".lovableproject.com") ||
      h.endsWith(".lovable.dev") ||
      h === "localhost" ||
      h === "127.0.0.1"
    );
  })();

  const handleAuditorLogin = async () => {
    setError("");
    setInfo("");
    setAuditorLoading(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("seed-preview-auditor", { body: {} });
      if (fnErr || !data?.ok) {
        setError(data?.error || fnErr?.message || "Falha ao provisionar auditor");
        setAuditorLoading(false);
        return;
      }
      const { error: signErr } = await signIn(data.email, data.password);
      if (signErr) {
        setError(signErr.message);
        setAuditorLoading(false);
        return;
      }
      setAuditorLoading(false);
      navigate("/app");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setAuditorLoading(false);
    }
  };

  // Mensagem de sucesso após redefinição de senha
  useEffect(() => {
    if (searchParams.get("reset") === "success") {
      setMode("login");
      setInfo("Senha redefinida com sucesso. Faça login com a nova senha.");
      // Limpa o query param após exibir
      const next = new URLSearchParams(searchParams);
      next.delete("reset");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setError(error.message);
      } else {
        setInfo("E-mail de recuperação enviado. Verifique sua caixa de entrada.");
      }
      setLoading(false);
      return;
    }

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
            {mode === "signup" ? "Criar conta" : mode === "login" ? "Entrar" : "Recuperar senha"}
          </h1>
          <p className="text-xs" style={{ color: "hsl(230 15% 40% / 0.45)" }}>
            {mode === "signup" ? "Junte-se à beta privada da jornada." : mode === "login" ? "Boas-vindas de volta à jornada." : "Enviaremos um link para redefinir sua senha."}
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
          {mode !== "forgot" && (
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
          )}

          {error && (
            <p className="text-xs text-destructive text-center">{error}</p>
          )}
          {info && (
            <p className="text-xs text-center" style={{ color: "hsl(120 40% 35%)" }}>{info}</p>
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
            {loading ? "Aguarde..." : mode === "signup" ? "Criar Conta" : mode === "login" ? "Entrar" : "Enviar link"}
          </Button>
        </form>

        {/* Toggle mode */}
        <div className="text-center space-y-1">
          {mode === "login" && (
            <button onClick={() => { setMode("forgot"); setError(""); setInfo(""); }} className="text-xs underline block mx-auto" style={{ color: "hsl(340 42% 28% / 0.6)" }}>
              Esqueci minha senha
            </button>
          )}
          <p className="text-xs" style={{ color: "hsl(230 15% 40% / 0.45)" }}>
            {mode === "signup" ? "Já tem conta?" : mode === "login" ? "Não tem conta?" : "Lembrou a senha?"}{" "}
            <button onClick={() => { setMode(mode === "signup" ? "login" : mode === "login" ? "signup" : "login"); setError(""); setInfo(""); }} className="font-medium underline" style={{ color: "hsl(340 42% 28%)" }}>
              {mode === "signup" ? "Entrar" : mode === "login" ? "Criar conta" : "Entrar"}
            </button>
          </p>
        </div>

        {isPreviewHost && (
          <div className="pt-2 border-t border-dashed" style={{ borderColor: "hsl(36 45% 58% / 0.25)" }}>
            <p className="text-[10px] text-center mb-2 font-heading tracking-[0.18em] uppercase" style={{ color: "hsl(36 45% 35%)" }}>
              ✦ Modo Auditoria (Preview)
            </p>
            <Button
              type="button"
              onClick={handleAuditorLogin}
              disabled={auditorLoading}
              variant="outline"
              className="w-full text-[11px] tracking-wide"
            >
              {auditorLoading ? "Provisionando..." : "Entrar como Auditor"}
            </Button>
            <p className="text-[10px] text-center mt-1.5 text-muted-foreground">
              Conta premium temporária só para auditoria visual.
            </p>
          </div>
        )}

        <nav className="pt-4 mt-2 border-t border-dashed flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[10px]" style={{ borderColor: "hsl(36 45% 58% / 0.20)", color: "hsl(230 15% 40% / 0.60)" }}>
          <a href="/privacidade" className="hover:underline">Privacidade</a>
          <a href="/termos" className="hover:underline">Termos</a>
          <a href="/suporte" className="hover:underline">Suporte</a>
          <a href="/excluir-conta" className="hover:underline">Excluir conta</a>
        </nav>
      </div>
    </div>
  );
};

export default AuthPage;

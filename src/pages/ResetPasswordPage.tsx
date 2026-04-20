import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, Eye, EyeOff } from "lucide-react";

type RecoveryState = "checking" | "ready" | "invalid" | "expired";

/**
 * Snapshot da URL ANTES que o cliente Supabase (com detectSessionInUrl=true)
 * consuma o hash automaticamente. Isso evita perder o contexto de recovery.
 */
const captureUrlContext = () => {
  const hash = window.location.hash || "";
  const search = window.location.search || "";
  const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(search);

  const type = hashParams.get("type") ?? searchParams.get("type");
  const error = hashParams.get("error") ?? searchParams.get("error");
  const errorCode = hashParams.get("error_code") ?? searchParams.get("error_code");
  const errorDescription = hashParams.get("error_description") ?? searchParams.get("error_description");
  const code = searchParams.get("code");
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");

  return {
    type,
    code,
    accessToken,
    refreshToken,
    error,
    errorCode,
    errorDescription,
    hasAnyAuthParam: !!(type || code || accessToken || error),
  };
};

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [recoveryState, setRecoveryState] = useState<RecoveryState>("checking");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  // Captura síncrona no primeiro render — antes de qualquer await/useEffect
  const urlContextRef = useRef(captureUrlContext());

  useEffect(() => {
    let isMounted = true;
    const ctx = urlContextRef.current;

    const clearUrl = () => {
      window.history.replaceState({}, document.title, `${window.location.origin}/reset-password`);
    };

    const markReady = () => {
      if (!isMounted) return;
      setRecoveryState("ready");
      setError("");
      clearUrl();
    };

    const markExpired = (msg?: string) => {
      if (!isMounted) return;
      setRecoveryState("expired");
      if (msg) setErrorMessage(msg);
    };

    const markInvalid = () => {
      if (!isMounted) return;
      setRecoveryState("invalid");
    };

    // 1) Erro explícito vindo do Supabase no link (expirado, usado, etc.)
    if (ctx.error || ctx.errorCode) {
      const desc = ctx.errorDescription?.replace(/\+/g, " ") || ctx.error || "Link inválido";
      markExpired(decodeURIComponent(desc));
      return () => { isMounted = false; };
    }

    // 2) Listener para PASSWORD_RECOVERY ou SIGNED_IN — disparado pelo detectSessionInUrl
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        markReady();
        return;
      }
      if (event === "SIGNED_IN" && session) {
        // Se chegamos aqui via link de recovery, está OK editar a senha
        if (ctx.hasAnyAuthParam || ctx.type === "recovery") {
          markReady();
        }
      }
    });

    const resolve = async () => {
      // 3) Se temos um code (PKCE flow), trocar por sessão
      if (ctx.code) {
        const { error } = await supabase.auth.exchangeCodeForSession(ctx.code);
        if (!isMounted) return;
        if (error) {
          markExpired("O link já foi usado ou expirou. Solicite um novo e-mail.");
          return;
        }
        markReady();
        return;
      }

      // 4) Se temos tokens no hash, setar a sessão manualmente
      if (ctx.accessToken && ctx.refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: ctx.accessToken,
          refresh_token: ctx.refreshToken,
        });
        if (!isMounted) return;
        if (error) {
          markExpired("Não conseguimos abrir sua sessão de recuperação. Solicite um novo link.");
          return;
        }
        markReady();
        return;
      }

      // 5) Sem code/tokens explícitos — talvez o cliente Supabase já consumiu o hash.
      //    Esperar um tick e checar se há sessão ativa ou se evento PASSWORD_RECOVERY chegou.
      await new Promise((r) => setTimeout(r, 600));
      if (!isMounted) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (session && (ctx.hasAnyAuthParam || ctx.type === "recovery")) {
        markReady();
        return;
      }

      // 6) Nenhum sinal de recovery — link inválido
      if (!ctx.hasAnyAuthParam) {
        markInvalid();
      } else {
        markExpired("O link já foi usado ou expirou. Solicite um novo e-mail para redefinir sua senha.");
      }
    };

    void resolve();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
    window.setTimeout(() => navigate("/perfil", { replace: true }), 1200);
  };

  if (recoveryState === "checking" && !success) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">Validando link de recuperação...</p>
        </div>
      </div>
    );
  }

  if (recoveryState !== "ready" && !success) {
    const isExpired = recoveryState === "expired";
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center space-y-4 shadow-sm">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Crown className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-xl tracking-wide">{isExpired ? "Link expirado" : "Link inválido"}</h1>
            <p className="text-sm text-muted-foreground">
              {isExpired
                ? errorMessage || "O link já foi usado ou venceu. Solicite um novo e-mail para redefinir sua senha."
                : "Abra esta página a partir do link enviado por e-mail para redefinir sua senha."}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate("/auth", { replace: true })}>Solicitar novo link</Button>
            <Button variant="outline" onClick={() => navigate("/auth", { replace: true })}>Voltar ao login</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mx-auto border border-border bg-primary/10 text-primary">
            <Crown className="w-5 h-5" />
          </div>
          <h1 className="font-heading text-xl tracking-wide text-foreground">
            {success ? "Senha atualizada!" : "Nova senha"}
          </h1>
          {success && (
            <p className="text-sm text-muted-foreground">Redirecionando para o seu perfil...</p>
          )}
        </div>

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="relative space-y-1">
              <label className="text-[11px] text-muted-foreground mb-1 block">Nova senha</label>
              <Input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-8 text-muted-foreground">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-destructive text-center">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full font-heading tracking-wide text-[11px] uppercase py-5">
              {loading ? "Aguarde..." : "Salvar nova senha"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;

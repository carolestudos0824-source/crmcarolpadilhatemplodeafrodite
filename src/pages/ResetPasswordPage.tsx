import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, Eye, EyeOff } from "lucide-react";

type RecoveryState = "checking" | "ready" | "invalid" | "expired";

const getRecoveryContext = () => {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(window.location.search);

  const type = hashParams.get("type") ?? searchParams.get("type");
  const hasHashTokens = hashParams.has("access_token") || hashParams.has("refresh_token");
  const hasQueryCode = searchParams.has("code") || hashParams.has("code");

  return {
    isRecoveryLink: type === "recovery" || hasHashTokens || hasQueryCode,
  };
};

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [recoveryState, setRecoveryState] = useState<RecoveryState>("checking");
  const navigate = useNavigate();
  const recoveryContext = useMemo(() => getRecoveryContext(), []);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: number | undefined;

    const markReady = () => {
      if (!isMounted) return;
      setRecoveryState("ready");
      setError("");
    };

    const resolveRecoveryState = async (attempt = 0) => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (session) {
        markReady();
        return;
      }

      if (recoveryContext.isRecoveryLink && attempt === 0) {
        retryTimeout = window.setTimeout(() => {
          void resolveRecoveryState(1);
        }, 500);
        return;
      }

      setRecoveryState(recoveryContext.isRecoveryLink ? "expired" : "invalid");
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        markReady();
        return;
      }

      if (event === "SIGNED_IN" && session && recoveryContext.isRecoveryLink) {
        markReady();
      }
    });

    void resolveRecoveryState();

    return () => {
      isMounted = false;
      if (retryTimeout) window.clearTimeout(retryTimeout);
      subscription.unsubscribe();
    };
  }, [recoveryContext.isRecoveryLink]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      window.setTimeout(() => navigate("/perfil", { replace: true }), 1200);
    }
    setLoading(false);
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
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center space-y-4 shadow-sm">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Crown className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-xl tracking-wide">{recoveryState === "expired" ? "Link expirado" : "Link inválido"}</h1>
            <p className="text-sm text-muted-foreground">
              {recoveryState === "expired"
                ? "O link já foi usado ou venceu. Solicite um novo e-mail para redefinir sua senha."
                : "Abra esta página a partir do link enviado por e-mail para redefinir sua senha."}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/auth", { replace: true })}>Voltar ao login</Button>
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

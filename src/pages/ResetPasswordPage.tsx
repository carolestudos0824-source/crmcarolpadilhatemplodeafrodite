import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, Eye, EyeOff } from "lucide-react";

type RecoveryState = "checking" | "ready" | "invalid" | "expired" | "misconfigured" | "not_started";

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
    path: window.location.pathname,
    referrer: document.referrer || "",
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

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const classifyErrorState = (message: string): Exclude<RecoveryState, "checking" | "ready" | "invalid"> => {
  const normalized = message.toLowerCase();
  if (normalized.includes("redirect")) return "misconfigured";
  if (normalized.includes("session") || normalized.includes("token")) return "not_started";
  return "expired";
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

    const setFailureState = (state: Exclude<RecoveryState, "checking" | "ready">, msg: string) => {
      if (!isMounted) return;
      setRecoveryState(state);
      setErrorMessage(msg);
    };

    const markReady = () => {
      if (!isMounted) return;
      setRecoveryState("ready");
      setError("");
      clearUrl();
    };

    const waitForSession = async () => {
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return true;
        if (session?.user) {
          markReady();
          return true;
        }
        await wait(250);
      }
      return false;
    };

    // 1) Erro explícito vindo do backend de auth
    if (ctx.error || ctx.errorCode) {
      const desc = ctx.errorDescription?.replace(/\+/g, " ") || ctx.error || "Link inválido";
      const decoded = decodeURIComponent(desc);
      setFailureState(classifyErrorState(decoded), decoded);
      return () => { isMounted = false; };
    }

    if (ctx.path !== "/reset-password") {
      setFailureState("invalid", "A rota de redefinição não foi encontrada corretamente.");
      return () => { isMounted = false; };
    }

    // 2) Listener para recovery/sessão restaurada
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session?.user) {
        markReady();
      }
    });

    const resolve = async () => {
      if (await waitForSession()) return;

      // 3) Flow com code
      if (ctx.code) {
        const { error } = await supabase.auth.exchangeCodeForSession(ctx.code);
        if (!isMounted) return;
        if (error) {
          setFailureState(classifyErrorState(error.message), "O link já foi usado, expirou ou não pôde iniciar a sessão de recovery. Solicite um novo e-mail.");
          return;
        }
        markReady();
        return;
      }

      // 4) Flow com tokens no hash
      if (ctx.accessToken && ctx.refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: ctx.accessToken,
          refresh_token: ctx.refreshToken,
        });
        if (!isMounted) return;
        if (error) {
          setFailureState(classifyErrorState(error.message), "Não conseguimos abrir sua sessão de recuperação. Solicite um novo link e abra o e-mail mais recente.");
          return;
        }
        markReady();
        return;
      }

      // 5) Sessão pode demorar a ser restaurada pelo cliente
      if (await waitForSession()) {
        return;
      }

      // 6) Diagnóstico final
      if (ctx.hasAnyAuthParam || ctx.referrer.includes("/auth/v1/verify")) {
        setFailureState(
          "not_started",
          "A sessão de recuperação não foi iniciada. Isso geralmente acontece quando o link é aberto por um verificador automático do e-mail antes de você. Solicite um novo link e use o mais recente.",
        );
        return;
      }

      setFailureState("invalid", "Esta rota existe, mas o link aberto não trouxe um token de recuperação válido.");
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

    await supabase.auth.signOut();
    setSuccess(true);
    setLoading(false);
    window.setTimeout(() => navigate("/auth?reset=success", { replace: true }), 1200);
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
    const variants: Record<Exclude<RecoveryState, "checking" | "ready">, { title: string; message: string }> = {
      expired: {
        title: "Link expirado",
        message: errorMessage || "O link já foi usado ou venceu. Solicite um novo e-mail para redefinir sua senha.",
      },
      invalid: {
        title: "Link inválido",
        message: errorMessage || "Abra esta página a partir do link enviado por e-mail para redefinir sua senha.",
      },
      misconfigured: {
        title: "Redirect mal configurado",
        message: errorMessage || "A URL de retorno do fluxo de recuperação está incorreta. Solicite um novo link após a correção.",
      },
      not_started: {
        title: "Sessão de recovery não iniciada",
        message: errorMessage || "O token chegou à rota, mas não iniciou a sessão de redefinição. Solicite um novo link e abra o e-mail mais recente.",
      },
    };
    const variant = variants[recoveryState];

    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center space-y-4 shadow-sm">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Crown className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-xl tracking-wide">{variant.title}</h1>
            <p className="text-sm text-muted-foreground">{variant.message}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate("/auth?mode=forgot", { replace: true })}>Solicitar novo link</Button>
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
            <p className="text-sm text-muted-foreground">Redirecionando para o login...</p>
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

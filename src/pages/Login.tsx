import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  KeyRound,
  LifeBuoy,
  Gift,
  ArrowLeft,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { APP_CONFIG } from "@/config/appConfig";
import {
  loginWithPassword,
  requestPasswordRecovery,
  signUpWithPassword,
  checkUserAccess,
  checkProgramAccess,
  clearSession,
} from "@/lib/auth";
import { openSupportEmail } from "@/lib/openLink";
import { GiftCodeRedemption } from "@/components/GiftCodeRedemption";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { withTimeout } from "@/lib/promiseTimeout";

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition min-h-12";

const cardCls = "glass-strong p-6 sm:p-8 rounded-2xl";

type View = "auth" | "no_access" | "code" | "check_email" | "link_error";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete: string;
  placeholder?: string;
  minLength?: number;
};

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
  placeholder,
  minLength,
}: PasswordFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-xs text-muted-foreground mb-1 block">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`${inputCls} pr-12`}
          type={show ? "text" : "password"}
          placeholder={placeholder ?? "••••••••"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={minLength}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState<View>("auth");
  const [validatingSession, setValidatingSession] = useState(false);

  // ============ Magic link form ============
  const [magicEmail, setMagicEmail] = useState("");
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicError, setMagicError] = useState<string | null>(null);
  const [magicInfo, setMagicInfo] = useState<string | null>(null);

  // ============ Sign-in (password) form ============
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [showSigninPassword, setShowSigninPassword] = useState(false);
  const [signinLoading, setSigninLoading] = useState(false);
  const [signinError, setSigninError] = useState<string | null>(null);
  const [recovering, setRecovering] = useState(false);
  const [recoverInfo, setRecoverInfo] = useState<string | null>(null);

  // ============ Sign-up form ============
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupInfo, setSignupInfo] = useState<string | null>(null);

  // ============ Google ============
  const [googleLoading, setGoogleLoading] = useState(false);

  // ============ Accordion (outras formas) ============
  const [otherOpen, setOtherOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const hasAuthError =
      params.has("auth_error") ||
      params.has("error") ||
      params.has("error_description") ||
      hashParams.has("error") ||
      hashParams.has("error_description");

    if (hasAuthError) {
      setView("link_error");
      return;
    }

    const validateExistingSession = async () => {
      setValidatingSession(true);
      try {
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;
        if (!user) return;
        const access = await checkProgramAccess(user.id);
        if (cancelled) return;
        if (access.canEnter) {
          navigate("/entrega", { replace: true });
          return;
        }
        setSigninEmail(user.email ?? "");
        setView("no_access");
      } catch {
        /* noop */
      } finally {
        if (!cancelled) setValidatingSession(false);
      }
    };

    void validateExistingSession();
    return () => {
      cancelled = true;
    };
  }, [location.search, navigate]);

  // =========================== Handlers ===========================

  const onMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setMagicError(null);
    setMagicInfo(null);
    if (!magicEmail.trim()) {
      setMagicError("Informe seu e-mail.");
      return;
    }
    setMagicLoading(true);
    console.info({ auth_flow: "magic_link_requested" });
    try {
      const { error } = await withTimeout(
        supabase.auth.signInWithOtp({
          email: magicEmail.trim().toLowerCase(),
          options: {
            emailRedirectTo: window.location.origin + "/auth/callback?next=/entrega",
          },
        }),
        15000,
        "envio do link",
      );
      if (error) {
        setMagicError(
          "Não foi possível enviar o link agora. Verifique o e-mail e tente novamente em alguns minutos.",
        );
        return;
      }
      setMagicInfo(
        "Enviamos um link de acesso para seu e-mail. Abra a mensagem de login e clique para entrar no programa.",
      );
    } catch {
      setMagicError(
        "Demorou demais para responder. Verifique sua conexão e tente de novo.",
      );
    } finally {
      setMagicLoading(false);
    }
  };

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigninError(null);
    setRecoverInfo(null);
    if (!signinEmail.trim() || !signinPassword) {
      setSigninError("Informe e-mail e senha.");
      return;
    }
    setSigninLoading(true);
    console.info({ auth_flow: "password_login_requested" });
    try {
      const result = await withTimeout(
        loginWithPassword(signinEmail, signinPassword),
        15000,
        "login",
      );
      if (result.status === "ok") {
        toast.success("Acesso liberado");
        navigate("/entrega");
      } else if (result.status === "no_access") {
        setView("no_access");
      } else {
        setSigninError(
          "E-mail ou senha inválidos. Verifique os dados e tente novamente.",
        );
      }
    } catch {
      setSigninError(
        "Demorou demais para responder. Verifique sua conexão e tente de novo.",
      );
    } finally {
      setSigninLoading(false);
    }
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupInfo(null);
    console.info({ auth_flow: "signup_requested" });

    if (!signupName.trim()) {
      setSignupError("Informe seu nome.");
      return;
    }
    if (!signupEmail.trim()) {
      setSignupError("Informe o e-mail usado na compra.");
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError("As senhas não coincidem.");
      return;
    }

    setSignupLoading(true);
    try {
      const result = await withTimeout(
        signUpWithPassword(signupName, signupEmail, signupPassword),
        20000,
        "criação da conta",
      );

      if (result.status === "error") {
        console.info({ auth_flow: "signup_error" });
        setSignupError(result.message);
        return;
      }

      console.info({ auth_flow: "signup_success" });
      setSignupInfo("Senha criada com sucesso. Estamos verificando seu acesso...");

      if (result.needsConfirmation) {
        setView("check_email");
        return;
      }

      if (result.userId && (await checkUserAccess(result.userId))) {
        toast.success("Conta criada e acesso liberado");
        navigate("/entrega");
      } else {
        setView("no_access");
      }
    } catch {
      console.info({ auth_flow: "signup_error" });
      setSignupError(
        "Não foi possível criar sua senha agora. Tente novamente em alguns segundos.",
      );
    } finally {
      setSignupLoading(false);
    }
  };

  const onRecover = async () => {
    setSigninError(null);
    setRecoverInfo(null);
    if (!signinEmail.trim()) {
      setSigninError("Informe seu e-mail para receber o link de recuperação.");
      return;
    }
    setRecovering(true);
    console.info({ auth_flow: "password_recovery_requested" });
    try {
      await withTimeout(requestPasswordRecovery(signinEmail), 15000, "recuperação");
      setRecoverInfo(
        "Enviamos um link para redefinir sua senha. Esse link não entra direto na área do curso.",
      );
    } catch {
      setSigninError("Não foi possível enviar agora. Tente novamente em instantes.");
    } finally {
      setRecovering(false);
    }
  };

  const recheckAccess = async () => {
    setValidatingSession(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!data.user) {
        toast.info("Faça login novamente para verificar seu acesso.");
        return;
      }
      const access = await checkProgramAccess(data.user.id);
      if (access.canEnter) {
        toast.success("Acesso liberado");
        navigate("/entrega");
      } else {
        setView("no_access");
        toast.info("Acesso ainda não liberado.");
      }
    } catch {
      toast.error("Não foi possível verificar seu acesso agora.");
    } finally {
      setValidatingSession(false);
    }
  };

  const onGoogle = async () => {
    setMagicError(null);
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/entrega",
        extraParams: { prompt: "select_account" },
      });
      if (result.error) {
        setMagicError(
          "Não foi possível entrar com Google agora. Tente novamente, ou use link por e-mail.",
        );
        setGoogleLoading(false);
        return;
      }
      if (result.redirected) return;
      navigate("/entrega");
    } catch {
      setMagicError(
        "Não foi possível entrar com Google agora. Tente novamente, ou use link por e-mail.",
      );
      setGoogleLoading(false);
    }
  };

  const toggleVisibility = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    current: boolean,
  ) => {
    console.info({ auth_flow: "password_visibility_toggled" });
    setter(!current);
  };

  // =========================== Sub-views ===========================

  if (validatingSession) {
    return (
      <Section>
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-8">
            <Logo size="lg" asLink={false} />
          </div>
          <div className={`${cardCls} text-center`}>
            <Loader2 className="mx-auto mb-4 text-accent animate-spin" size={32} />
            <h1 className="text-2xl font-heading font-bold mb-2">Validando seu acesso…</h1>
            <p className="text-sm text-muted-foreground">
              Estamos confirmando seu login e liberando sua área do programa.
            </p>
          </div>
        </div>
      </Section>
    );
  }

  if (view === "link_error") {
    return (
      <Section>
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-8">
            <Logo size="lg" asLink={false} />
          </div>
          <div className={`${cardCls} text-center`}>
            <Mail className="mx-auto mb-4 text-accent" size={32} />
            <h1 className="text-2xl font-heading font-bold mb-2">Link seguro expirado</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Este link expirou ou já foi usado. Peça um novo link seguro para acessar.
            </p>
            <button
              type="button"
              onClick={() => {
                setView("auth");
                navigate("/login", { replace: true });
              }}
              className="btn-primary w-full justify-center"
            >
              Enviar novo link
            </button>
          </div>
        </div>
      </Section>
    );
  }

  if (view === "check_email") {
    return (
      <Section>
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-8">
            <Logo size="lg" asLink={false} />
          </div>
          <div className={`${cardCls} text-center`}>
            <Mail className="mx-auto mb-4 text-accent" size={32} />
            <h1 className="text-2xl font-heading font-bold mb-2">Conta criada</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Verifique seu e-mail para confirmar o acesso. Depois, volte aqui e faça login.
            </p>
            <button
              type="button"
              onClick={() => setView("auth")}
              className="btn-primary w-full"
            >
              Voltar para login
            </button>
          </div>
        </div>
      </Section>
    );
  }

  if (view === "no_access" || view === "code") {
    return (
      <Section>
        <div className="max-w-xl mx-auto">
          <div className="flex justify-center mb-8">
            <Logo size="lg" asLink={false} />
          </div>
          <div className={cardCls}>
            <h1 className="text-2xl font-heading font-bold mb-2">
              Este e-mail ainda não tem acesso liberado à Fábrica de Apps com IA.
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Confira se você entrou com o mesmo e-mail usado na compra. Se comprou com outro
              e-mail, saia e tente novamente com o e-mail correto.
            </p>

            {view === "no_access" ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={async () => {
                    await clearSession();
                    setView("auth");
                    setSigninEmail("");
                    setSigninPassword("");
                  }}
                  className="btn-primary w-full justify-center"
                >
                  Tentar outro e-mail
                </button>
                <button
                  type="button"
                  onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}
                  className="w-full px-4 py-3 rounded-xl border border-white/15 hover:bg-white/5 text-sm flex items-center justify-center gap-2"
                >
                  <LifeBuoy size={14} /> Falar com suporte
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/checkout?plano=fabrica")}
                  className="w-full px-4 py-3 rounded-xl border border-accent/40 bg-accent/10 text-accent text-sm flex items-center justify-center gap-2"
                >
                  Garantir acesso
                </button>
                <button
                  type="button"
                  onClick={() => setView("code")}
                  className="w-full px-4 py-3 text-xs text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-2"
                >
                  <Gift size={12} /> Tenho um código de acesso
                </button>
                <button
                  type="button"
                  onClick={recheckAccess}
                  className="w-full px-4 py-2 text-xs text-accent hover:text-accent/80"
                >
                  Já fui liberado — verificar novamente
                </button>
              </div>
            ) : (
              <>
                <GiftCodeRedemption />
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={recheckAccess}
                    className="w-full px-4 py-3 rounded-xl border border-accent/40 bg-accent/10 text-accent text-sm"
                  >
                    Verificar acesso agora
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("no_access")}
                    className="w-full px-4 py-3 text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={14} /> Voltar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Section>
    );
  }

  // =========================== Auth view ===========================


  return (
    <Section>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-8">
          <Logo size="lg" asLink={false} />
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] items-start">
          {/* ============== Main column ============== */}
          <div className="space-y-5">
            {/* ===== Card 1: Acesso rápido ===== */}
            <div className={cardCls}>
              <h1 className="text-2xl font-heading font-bold mb-1">
                Entrar na Fábrica de Apps com IA
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                Use o mesmo e-mail informado na compra.
              </p>

              <button
                type="button"
                onClick={onGoogle}
                disabled={googleLoading}
                className="w-full min-h-12 flex items-center justify-center gap-3 px-4 rounded-xl bg-white text-gray-900 hover:bg-white/90 transition font-medium text-sm shadow-md disabled:opacity-60"
              >
                {googleLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A9 9 0 0 0 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A9 9 0 0 0 0 9c0 1.452.348 2.827.957 4.04l3.007-2.333z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A9 9 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
                  </svg>
                )}
                Entrar com Google
              </button>

              <div className="flex items-center gap-3 my-6">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70">ou</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <form onSubmit={onMagicLink} className="space-y-3">
                <div>
                  <label htmlFor="magic-email" className="text-xs text-muted-foreground mb-1 block">
                    E-mail da compra
                  </label>
                  <input
                    id="magic-email"
                    className={inputCls}
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    value={magicEmail}
                    onChange={(e) => setMagicEmail(e.target.value)}
                    required
                  />
                </div>

                {magicError && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3">
                    {magicError}
                  </div>
                )}
                {magicInfo && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-sm px-4 py-3">
                    {magicInfo}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={magicLoading}
                  className="btn-primary w-full min-h-12"
                >
                  {magicLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Enviando link…
                    </>
                  ) : (
                    "Entrar sem senha por e-mail"
                  )}
                </button>
              </form>
            </div>

            {/* ===== Card 2: Entrar com senha ===== */}
            <div className={cardCls}>
              <h2 className="text-xl font-heading font-semibold mb-1">Já tenho senha</h2>
              <p className="text-xs text-muted-foreground mb-5">
                Use esta opção se você já criou uma senha anteriormente.
              </p>

              <form onSubmit={onSignIn} className="space-y-3">
                <div>
                  <label htmlFor="signin-email" className="text-xs text-muted-foreground mb-1 block">
                    E-mail
                  </label>
                  <input
                    id="signin-email"
                    className={inputCls}
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    value={signinEmail}
                    onChange={(e) => setSigninEmail(e.target.value)}
                    required
                  />
                </div>

                <PasswordField
                  id="signin-password"
                  label="Senha"
                  value={signinPassword}
                  onChange={setSigninPassword}
                  show={showSigninPassword}
                  onToggle={() => toggleVisibility(setShowSigninPassword, showSigninPassword)}
                  autoComplete="current-password"
                />

                {signinError && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3">
                    {signinError}
                  </div>
                )}
                {recoverInfo && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-sm px-4 py-3">
                    {recoverInfo}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={signinLoading}
                  className="btn-primary w-full min-h-12"
                >
                  {signinLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Entrando…
                    </>
                  ) : (
                    "Entrar com senha"
                  )}
                </button>

                <div className="pt-2 space-y-1">
                  <button
                    type="button"
                    onClick={onRecover}
                    disabled={recovering}
                    className="flex items-center gap-2 text-xs text-accent hover:text-accent/80 transition disabled:opacity-60"
                  >
                    <KeyRound size={12} />
                    {recovering ? "Enviando…" : "Redefinir minha senha"}
                  </button>
                  <p className="text-[11px] text-muted-foreground/80">
                    Use apenas se você quer criar uma nova senha.
                  </p>
                </div>
              </form>
            </div>

            {/* ===== Card 3: Primeiro acesso ===== */}
            <div className={cardCls}>
              <h2 className="text-xl font-heading font-semibold mb-1">Primeiro acesso?</h2>
              <p className="text-xs text-muted-foreground mb-5">
                Crie sua conta usando o mesmo e-mail informado na compra. Seu acesso será
                verificado automaticamente.
              </p>

              <form onSubmit={onSignUp} className="space-y-3">
                <div>
                  <label htmlFor="signup-name" className="text-xs text-muted-foreground mb-1 block">
                    Nome
                  </label>
                  <input
                    id="signup-name"
                    className={inputCls}
                    type="text"
                    placeholder="Seu nome"
                    autoComplete="name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="text-xs text-muted-foreground mb-1 block">
                    E-mail da compra
                  </label>
                  <input
                    id="signup-email"
                    className={inputCls}
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>

                <PasswordField
                  id="signup-password"
                  label="Senha"
                  value={signupPassword}
                  onChange={setSignupPassword}
                  show={showSignupPassword}
                  onToggle={() => toggleVisibility(setShowSignupPassword, showSignupPassword)}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />

                <PasswordField
                  id="signup-confirm"
                  label="Confirmar senha"
                  value={signupConfirm}
                  onChange={setSignupConfirm}
                  show={showSignupConfirm}
                  onToggle={() => toggleVisibility(setShowSignupConfirm, showSignupConfirm)}
                  autoComplete="new-password"
                  placeholder="Repita a senha"
                  minLength={6}
                />

                {signupError && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3">
                    {signupError}
                  </div>
                )}
                {signupInfo && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-sm px-4 py-3">
                    {signupInfo}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={signupLoading}
                  className="btn-primary w-full min-h-12"
                >
                  {signupLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Criando conta…
                    </>
                  ) : (
                    "Criar minha conta"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ============== Sidebar ============== */}
          <aside className="space-y-5">
            <div className={cardCls}>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={18} className="text-accent" />
                <h2 className="font-heading font-semibold text-lg">Como acessar seu programa</h2>
              </div>
              <ol className="space-y-3 text-sm text-muted-foreground">
                {[
                  "Use o mesmo e-mail informado na compra.",
                  "Entre com Google, link por e-mail ou senha.",
                  "Se o acesso não aparecer, confira o e-mail usado no pagamento ou fale com o suporte.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/15 text-accent text-xs font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className={cardCls}>
              <h3 className="font-heading font-semibold text-base mb-2">
                Ainda não tem acesso?
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Garanta a Fábrica de Apps com IA por R$47, pagamento único.
              </p>
              <button
                type="button"
                onClick={() => navigate("/checkout?plano=fabrica")}
                className="btn-primary w-full justify-center text-sm min-h-12"
              >
                Garantir acesso <ArrowRight size={14} />
              </button>
            </div>

            <div className={cardCls}>
              <button
                type="button"
                onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}
                className="w-full min-h-12 px-4 rounded-xl border border-white/15 hover:bg-white/5 text-sm flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition"
              >
                <LifeBuoy size={14} /> Falar com suporte
              </button>
            </div>
          </aside>
        </div>
      </div>
    </Section>
  );
}

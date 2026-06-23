import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Mail, KeyRound, LifeBuoy, Gift, ArrowLeft, ShieldCheck, ArrowRight } from "lucide-react";
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
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition";

type Tab = "magic" | "signin" | "signup";
type View = "auth" | "no_access" | "code" | "check_email" | "link_error";

const isPreviewEnv =
  typeof window !== "undefined" &&
  (window.location.hostname.includes("lovable") ||
    window.location.hostname === "localhost" ||
    window.location.hostname.startsWith("127."));

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState<Tab>("magic");
  const [view, setView] = useState<View>("auth");

  // shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [validatingSession, setValidatingSession] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // signup-only
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetMessages = () => {
    setInfo(null);
    setErrorMsg(null);
  };

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
      setErrorMsg("Este link expirou ou já foi usado. Peça um novo link seguro para acessar.");
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

        setEmail(user.email ?? "");
        setView("no_access");
      } catch {
        if (!cancelled) {
          setErrorMsg("Não foi possível validar seu acesso agora. Peça um novo link seguro ou tente novamente.");
        }
      } finally {
        if (!cancelled) setValidatingSession(false);
      }
    };

    void validateExistingSession();

    return () => {
      cancelled = true;
    };
  }, [location.search, navigate]);

  const onMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!email.trim()) return setErrorMsg("Informe seu e-mail.");
    setLoading(true);
    console.info({ auth_flow: "magic_link_requested" });
    try {
      const { error } = await withTimeout(
        supabase.auth.signInWithOtp({
          email: email.trim().toLowerCase(),
          options: { emailRedirectTo: window.location.origin + "/auth/callback?next=/entrega" },
        }),
        15000,
        "envio do link",
      );
      if (error) {
        setErrorMsg(
          "Não foi possível enviar o link agora. Verifique o e-mail e tente novamente em alguns minutos.",
        );
        return;
      }
      setInfo(
        "Enviamos um link de entrada para seu e-mail. Procure por uma mensagem sobre acesso/login, não redefinição de senha.",
      );
    } catch {
      setErrorMsg(
        "Demorou demais para responder. Verifique sua conexão e tente de novo. Se persistir, use Entrar com Google ou fale com suporte.",
      );
    } finally {
      setLoading(false);
    }
  };

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetMessages();
    try {
      const result = await withTimeout(loginWithPassword(email, password), 15000, "login");
      if (result.status === "ok") {
        toast.success("Acesso liberado");
        navigate("/entrega");
      } else if (result.status === "no_access") {
        setView("no_access");
      } else {
        setErrorMsg(
          "E-mail ou senha inválidos. Se não lembrar a senha, use Entrar sem senha (link por e-mail) ou Recuperar acesso.",
        );
      }
    } catch {
      setErrorMsg(
        "Demorou demais para responder. Verifique sua conexão e tente de novo.",
      );
    } finally {
      setLoading(false);
    }
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!name.trim()) return setErrorMsg("Informe seu nome.");
    if (!email.trim()) return setErrorMsg("Informe seu e-mail.");
    if (password.length < 6)
      return setErrorMsg("A senha deve ter pelo menos 6 caracteres.");
    if (password !== confirmPassword)
      return setErrorMsg("As senhas não coincidem.");

    setLoading(true);
    try {
      const result = await withTimeout(
        signUpWithPassword(name, email, password),
        20000,
        "criação da conta",
      );

      if (result.status === "error") {
        setErrorMsg(result.message);
        return;
      }

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
      setErrorMsg(
        "Demorou demais para criar a conta. Verifique sua conexão e tente novamente. Se persistir, tente entrar com o mesmo e-mail (talvez a conta já tenha sido criada) ou use Entrar com Google.",
      );
    } finally {
      setLoading(false);
    }
  };

  const onRecover = async () => {
    if (!email.trim()) {
      setErrorMsg("Informe seu e-mail para receber o link de recuperação.");
      return;
    }
    setRecovering(true);
    resetMessages();
    console.info({ auth_flow: "password_recovery_requested" });
    try {
      await withTimeout(requestPasswordRecovery(email), 15000, "recuperação");
      setInfo(
        "Enviamos um link para redefinir sua senha. Esse link não entra direto na área do curso.",
      );
    } catch {
      setErrorMsg("Não foi possível enviar agora. Tente novamente em instantes.");
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
      toast.error("Não foi possível verificar seu acesso agora. Tente novamente em instantes.");
    } finally {
      setValidatingSession(false);
    }
  };

  const onGoogle = async () => {
    resetMessages();
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/entrega",
        extraParams: {
          prompt: "select_account",
        },
      });
      if (result.error) {
        setErrorMsg(
          "Não foi possível entrar com Google agora. Tente novamente, ou use link por e-mail.",
        );
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      navigate("/entrega");
    } catch {
      setErrorMsg(
        "Não foi possível entrar com Google agora. Tente novamente, ou use link por e-mail.",
      );
      setLoading(false);
    }
  };


  // ============== Render ==============

  if (validatingSession) {
    return (
      <Section>
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-8">
            <Logo size="lg" asLink={false} />
          </div>
          <div className="glass-strong p-8 text-center">
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
          <div className="glass-strong p-8 text-center">
            <Mail className="mx-auto mb-4 text-accent" size={32} />
            <h1 className="text-2xl font-heading font-bold mb-2">Link seguro expirado</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Este link expirou ou já foi usado. Peça um novo link seguro para acessar.
            </p>
            <button
              type="button"
              onClick={() => {
                setView("auth");
                setTab("magic");
                setInfo(null);
                setErrorMsg(null);
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
          <div className="glass-strong p-8 text-center">
            <Mail className="mx-auto mb-4 text-accent" size={32} />
            <h1 className="text-2xl font-heading font-bold mb-2">
              Conta criada
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Verifique seu e-mail para confirmar o acesso. Depois, volte aqui e
              faça login.
            </p>
            <button
              onClick={() => {
                setView("auth");
                setTab("signin");
              }}
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
          <div className="glass-strong p-8">
            <h1 className="text-2xl font-heading font-bold mb-2">
              Este e-mail ainda não tem acesso liberado à Fábrica de Apps com IA.
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Confira se você entrou com o mesmo e-mail usado na compra. Se comprou com outro e-mail, saia e tente novamente com o e-mail correto.
            </p>

            {view === "no_access" ? (
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    await clearSession();
                    setView("auth");
                    setEmail("");
                    setPassword("");
                  }}
                  className="btn-primary w-full justify-center"
                >
                  Tentar outro e-mail
                </button>
                <button
                  onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}
                  className="w-full px-4 py-3 rounded-xl border border-white/15 hover:bg-white/5 text-sm flex items-center justify-center gap-2"
                >
                  <LifeBuoy size={14} /> Falar com suporte
                </button>
                <button
                  onClick={() => navigate("/checkout?plano=fabrica")}
                  className="w-full px-4 py-3 rounded-xl border border-accent/40 bg-accent/10 text-accent text-sm flex items-center justify-center gap-2"
                >
                  Garantir acesso
                </button>
                <button
                  onClick={() => setView("code")}
                  className="w-full px-4 py-3 text-xs text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-2"
                >
                  <Gift size={12} /> Tenho um código de acesso
                </button>
                <button
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
                    onClick={recheckAccess}
                    className="w-full px-4 py-3 rounded-xl border border-accent/40 bg-accent/10 text-accent text-sm"
                  >
                    Verificar acesso agora
                  </button>
                  <button
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

  return (
    <Section>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-8">
          <Logo size="lg" asLink={false} />
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] items-start">
          <div className="glass-strong p-8">
            <h1 className="text-2xl font-heading font-bold mb-1">
              Entrar na Fábrica de Apps com IA
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Use o mesmo e-mail informado na compra para acessar seu programa.
            </p>

            {/* === Bloco principal 1: Google === */}
            <button
              type="button"
              onClick={onGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-gray-900 hover:bg-white/90 transition font-medium text-sm shadow-md disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A9 9 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A9 9 0 0 0 0 9c0 1.452.348 2.827.957 4.04l3.007-2.333z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A9 9 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
              </svg>
              Entrar com Google
            </button>
            <p className="text-[11px] text-muted-foreground/80 mt-3 leading-relaxed">
              Escolha no Google o mesmo e-mail usado na compra.
            </p>

            {/* === Divider === */}
            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70">ou</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* === Bloco principal 2: Magic link === */}
            <form onSubmit={onMagicLink} className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Receba um link para acessar sua área imediatamente, sem criar nova senha.
              </p>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">E-mail da compra</label>
                <input
                  className={inputCls}
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3">
                  {errorMsg}
                </div>
              )}
              {info && (
                <div className="rounded-xl border border-accent/30 bg-accent/10 text-accent text-sm px-4 py-3">
                  {info}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Enviando…
                  </>
                ) : (
                  "Entrar sem senha por e-mail"
                )}
              </button>
            </form>

            {/* === Entrar com senha (sempre visível) === */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h2 className="text-sm font-heading font-semibold mb-1">Entrar com senha</h2>
              <p className="text-[11px] text-muted-foreground/80 mb-4">
                Alternativa caso você já tenha cadastrado uma senha. Use o mesmo e-mail da compra.
              </p>
              <form onSubmit={onSignIn} className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">E-mail</label>
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Senha</label>
                  <input
                    className={inputCls}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {errorMsg && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3">
                    {errorMsg}
                  </div>
                )}
                {info && (
                  <div className="rounded-xl border border-accent/30 bg-accent/10 text-accent text-sm px-4 py-3">
                    {info}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full">

                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Entrando…
                    </>
                  ) : (
                    "Entrar com senha"
                  )}
                </button>

                <div className="pt-1 space-y-1">
                  <button
                    type="button"
                    onClick={onRecover}
                    disabled={recovering}
                    className="flex items-center gap-2 text-xs text-accent hover:text-accent/80 transition"
                  >
                    <KeyRound size={12} />
                    {recovering ? "Enviando…" : "Redefinir minha senha"}
                  </button>
                  <p className="text-[11px] text-muted-foreground/80">
                    Use esta opção apenas se você quer criar uma nova senha.
                  </p>
                </div>
              </form>
            </div>

            {/* === Criar conta (sempre visível) === */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h2 className="text-sm font-heading font-semibold mb-1">Criar conta</h2>
              <p className="text-[11px] text-muted-foreground/80 mb-4">
                Primeiro acesso? Você também pode entrar com Google ou link seguro usando o e-mail da compra.
              </p>
              <form onSubmit={onSignUp} className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Nome</label>
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="Seu nome"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">E-mail</label>
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Senha</label>
                  <input
                    className={inputCls}
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Confirmar senha</label>
                  <input
                    className={inputCls}
                    type="password"
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Use o mesmo e-mail informado na compra. Depois da conta criada, seu acesso será verificado automaticamente.
                </p>


                {errorMsg && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3">
                    {errorMsg}
                  </div>
                )}
                {info && (
                  <div className="rounded-xl border border-accent/30 bg-accent/10 text-accent text-sm px-4 py-3">
                    {info}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full">

                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Criando conta…
                    </>
                  ) : (
                    "Criar conta"
                  )}
                </button>
              </form>
            </div>

            {/* === Suporte === */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}
                className="w-full px-4 py-3 rounded-xl border border-white/15 hover:bg-white/5 text-sm flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition"
              >
                <LifeBuoy size={14} /> Falar com suporte
              </button>
            </div>


            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-muted-foreground flex gap-2">
              <Mail size={14} className="mt-0.5 shrink-0 text-accent" />
              <p>
                Após a compra, entre usando o mesmo e-mail informado no pagamento. Se o acesso ainda não aparecer, verifique spam, promoções ou fale com suporte.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="glass-strong p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={18} className="text-accent" />
                <h2 className="font-heading font-semibold text-lg">Como acessar seu programa</h2>
              </div>
              <ol className="space-y-3 text-sm text-muted-foreground">
                {[
                  "Use o mesmo e-mail da compra.",
                  "Entre com Google ou receba um link seguro.",
                  "Se o acesso não aparecer, tente outro e-mail ou fale com suporte.",
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

            <div className="glass-strong p-5">
              <h3 className="font-heading font-semibold text-sm mb-2">Ainda não tem acesso?</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Garanta a Fábrica de Apps com IA por R$47, pagamento único.
              </p>
              <button
                onClick={() => navigate("/checkout?plano=fabrica")}
                className="btn-primary w-full justify-center text-sm"
              >
                Garantir acesso <ArrowRight size={14} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </Section>
  );
}


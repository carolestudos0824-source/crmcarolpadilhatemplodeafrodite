import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Mail, KeyRound, LifeBuoy, Gift, ArrowLeft, Sparkles } from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { APP_CONFIG } from "@/config/appConfig";
import {
  loginWithPassword,
  requestPasswordRecovery,
  signUpWithPassword,
  checkUserAccess,
  clearSession,
} from "@/lib/auth";
import { openSupportEmail } from "@/lib/openLink";
import { GiftCodeRedemption } from "@/components/GiftCodeRedemption";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition";

type Tab = "magic" | "signin" | "signup";
type View = "auth" | "no_access" | "code" | "check_email";

const isPreviewEnv =
  typeof window !== "undefined" &&
  (window.location.hostname.includes("lovable") ||
    window.location.hostname === "localhost" ||
    window.location.hostname.startsWith("127."));

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("magic");
  const [view, setView] = useState<View>("auth");

  // shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // signup-only
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetMessages = () => {
    setInfo(null);
    setErrorMsg(null);
  };

  const onMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!email.trim()) return setErrorMsg("Informe seu e-mail.");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin + "/entrega" },
    });
    setLoading(false);
    if (error) {
      setErrorMsg("Não foi possível enviar o link agora. Tente novamente em alguns minutos.");
      return;
    }
    setInfo("Enviamos um link de acesso para seu e-mail. Verifique também spam e promoções.");
  };

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetMessages();
    const result = await loginWithPassword(email, password);
    setLoading(false);

    if (result.status === "ok") {
      toast.success("Acesso liberado");
      navigate("/entrega");
    } else if (result.status === "no_access") {
      setView("no_access");
    } else {
      setErrorMsg(
        "E-mail ou senha inválidos. Se não lembrar a senha, use Entrar sem senha ou Recuperar senha.",
      );
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
    const result = await signUpWithPassword(name, email, password);
    setLoading(false);

    if (result.status === "error") {
      setErrorMsg(result.message);
      return;
    }

    if (result.needsConfirmation) {
      setView("check_email");
      return;
    }

    // session active — check access
    if (result.userId && (await checkUserAccess(result.userId))) {
      toast.success("Conta criada e acesso liberado");
      navigate("/entrega");
    } else {
      setView("no_access");
    }
  };

  const onRecover = async () => {
    if (!email.trim()) {
      setErrorMsg("Informe seu e-mail para receber o link de recuperação.");
      return;
    }
    setRecovering(true);
    resetMessages();
    await requestPasswordRecovery(email);
    setRecovering(false);
    setInfo(
      "Se o e-mail estiver cadastrado, enviaremos um link de recuperação. Verifique também spam e promoções.",
    );
  };

  const recheckAccess = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!data.user) {
        toast.info("Faça login novamente para verificar seu acesso.");
        return;
      }
      if (await checkUserAccess(data.user.id)) {
        toast.success("Acesso liberado");
        navigate("/entrega");
      } else {
        toast.info("Acesso ainda não liberado.");
      }
    } catch {
      toast.error("Não foi possível verificar seu acesso agora. Tente novamente em instantes.");
    }
  };

  const onGoogle = async () => {
    resetMessages();
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/entrega",
      });
      if (result.error) {
        setErrorMsg("Não foi possível entrar com Google agora. Tente novamente.");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      navigate("/entrega");
    } catch {
      setErrorMsg("Não foi possível entrar com Google agora. Tente novamente.");
      setLoading(false);
    }
  };

  // ============== Render ==============

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
              Acesso ainda não liberado
            </h1>
            <p className="text-sm text-muted-foreground mb-2">
              Seu login foi criado com sucesso, mas seu acesso ao programa ainda não foi liberado.
            </p>
            <p className="text-xs text-muted-foreground/80 mb-6">
              Confira se você entrou com o mesmo e-mail usado na compra. Se o pagamento já foi confirmado e o acesso ainda não apareceu, fale com o suporte.
            </p>

            {view === "no_access" ? (
              <div className="space-y-3">
                <button
                  onClick={() => setView("code")}
                  className="btn-primary w-full justify-center"
                >
                  <Gift size={16} /> Tenho um código de acesso
                </button>
                <button
                  onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}
                  className="w-full px-4 py-3 rounded-xl border border-white/15 hover:bg-white/5 text-sm flex items-center justify-center gap-2"
                >
                  <LifeBuoy size={14} /> Falar com suporte
                </button>
                <button
                  onClick={async () => {
                    await clearSession();
                    setView("auth");
                    setEmail("");
                    setPassword("");
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 text-sm text-muted-foreground hover:text-foreground"
                >
                  Tentar com outro e-mail
                </button>
                <button
                  onClick={recheckAccess}
                  className="w-full px-4 py-3 text-xs text-accent hover:text-accent/80"
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
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Logo size="lg" asLink={false} />
        </div>
        <div className="glass-strong p-8">
          <h1 className="text-2xl font-heading font-bold mb-1">
            Entrar na Fábrica de Apps com IA
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Entre com o mesmo e-mail usado na compra para acessar seu programa.
          </p>

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
            Use o mesmo e-mail da compra. Se entrar com outro e-mail, seu acesso pode não aparecer.
          </p>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70">Ou entre com e-mail</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/5 border border-white/10 mb-6">
            {([
              ["magic", "Sem senha"],
              ["signin", "Com senha"],
              ["signup", "Criar conta"],
            ] as [Tab, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setTab(key);
                  resetMessages();
                }}
                className={`px-3 py-2 rounded-lg text-sm transition ${
                  tab === key
                    ? "bg-accent/20 text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>


          {tab === "magic" ? (
            <form onSubmit={onMagicLink} className="space-y-4">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-accent" />
                <p>
                  Digite seu e-mail e enviaremos um link seguro para acessar sua
                  área. Sem precisar lembrar de senha.
                </p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  E-mail
                </label>
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
                  "Enviar link de acesso"
                )}
              </button>

              <div className="pt-2 space-y-2 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setTab("signin");
                    resetMessages();
                  }}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
                >
                  <KeyRound size={14} /> Prefiro entrar com senha
                </button>
                <button
                  type="button"
                  onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
                >
                  <LifeBuoy size={14} /> Falar com suporte
                </button>
              </div>

              {isPreviewEnv && (
                <p className="text-[11px] text-muted-foreground/70 pt-2 border-t border-white/5">
                  Está testando no preview? Use o mesmo e-mail cadastrado e
                  liberado no admin.
                </p>
              )}
            </form>
          ) : tab === "signin" ? (
            <form onSubmit={onSignIn} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  E-mail
                </label>
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
                <label className="text-xs text-muted-foreground mb-1 block">
                  Senha
                </label>
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

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Entrando…
                  </>
                ) : (
                  "Entrar com senha"
                )}
              </button>

              <div className="pt-2 space-y-2 text-sm">
                <button
                  type="button"
                  onClick={onRecover}
                  disabled={recovering}
                  className="flex items-center gap-2 text-accent hover:text-accent/80 transition"
                >
                  <KeyRound size={14} />
                  {recovering ? "Enviando…" : "Recuperar acesso"}
                </button>
                <button
                  type="button"
                  onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
                >
                  <LifeBuoy size={14} />
                  Falar com suporte
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={onSignUp} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Nome
                </label>
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
                <label className="text-xs text-muted-foreground mb-1 block">
                  E-mail
                </label>
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
                <label className="text-xs text-muted-foreground mb-1 block">
                  Senha
                </label>
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
                <label className="text-xs text-muted-foreground mb-1 block">
                  Confirmar senha
                </label>
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

              {errorMsg && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3">
                  {errorMsg}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Use o mesmo e-mail informado na compra. Depois da conta criada,
                seu acesso será verificado automaticamente.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Criando
                    conta…
                  </>
                ) : (
                  "Criar conta"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-muted-foreground flex gap-2">
            <Mail size={14} className="mt-0.5 shrink-0 text-accent" />
            <p>
              Após a compra, os dados de acesso são enviados para o e-mail
              informado no pagamento. Verifique também spam e promoções.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Mail, KeyRound, LifeBuoy } from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { APP_CONFIG } from "@/config/appConfig";
import { loginWithPassword, requestPasswordRecovery } from "@/lib/auth";
import { openSupportEmail } from "@/lib/openLink";

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setInfo(null);
    setErrorMsg(null);

    const result = await loginWithPassword(email, password);

    if (result.status === "ok") {
      toast.success("Acesso liberado");
      navigate("/entrega");
    } else if (result.status === "no_access") {
      setErrorMsg(
        "Seu login existe, mas seu acesso ainda não foi liberado. Fale com suporte.",
      );
    } else {
      setErrorMsg("E-mail ou senha inválidos.");
    }
    setLoading(false);
  };

  const onRecover = async () => {
    if (!email.trim()) {
      setErrorMsg("Informe seu e-mail para receber o link de recuperação.");
      return;
    }
    setRecovering(true);
    setErrorMsg(null);
    const { error } = await requestPasswordRecovery(email);
    setRecovering(false);
    if (error) {
      setInfo(
        "Se o e-mail estiver cadastrado, enviaremos um link de recuperação em instantes.",
      );
    } else {
      setInfo(
        "Enviamos um link de recuperação para o seu e-mail. Verifique também spam e promoções.",
      );
    }
  };

  return (
    <Section>
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Logo size="lg" asLink={false} />
        </div>
        <div className="glass-strong p-8">
          <h1 className="text-2xl font-heading font-bold mb-1">
            Entrar na área restrita
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Use o e-mail e a senha enviados após a compra para acessar seus materiais.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
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
                Senha de acesso
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
                "Entrar"
              )}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-sm">
            <button
              type="button"
              onClick={onRecover}
              disabled={recovering}
              className="flex items-center gap-2 text-accent hover:text-accent/80 transition"
            >
              <KeyRound size={14} />
              {recovering ? "Enviando…" : "Não recebeu sua senha? Recuperar acesso"}
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

          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-muted-foreground flex gap-2">
            <Mail size={14} className="mt-0.5 shrink-0 text-accent" />
            <p>
              Após a compra, os dados de acesso são enviados para o e-mail informado no pagamento. Verifique também spam e promoções.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

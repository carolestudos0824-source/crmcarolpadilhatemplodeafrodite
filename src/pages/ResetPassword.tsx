import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition";

const hasRecoveryError = () => {
  if (typeof window === "undefined") return false;
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return (
    search.has("error") ||
    search.has("error_description") ||
    hash.has("error") ||
    hash.has("error_description")
  );
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.info({ auth_flow: "reset_password_loaded" });
    if (hasRecoveryError()) {
      setLinkError(true);
      return;
    }
    // Supabase recovery link sets a session; ensure we have one
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");
    if (password !== confirm) return setError("As senhas não coincidem.");
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) return setError(err.message);
    toast.success("Senha atualizada");
    navigate("/entrega");
  };

  return (
    <Section>
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Logo size="lg" asLink={false} />
        </div>
        <div className="glass-strong p-8">
          <h1 className="text-2xl font-heading font-bold mb-1">Redefinir senha</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Você está criando uma nova senha. Depois disso, poderá acessar sua área normalmente.
          </p>

          {linkError ? (
            <p className="text-sm text-red-200 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              Esse link de redefinição expirou ou já foi usado. Peça um novo link ou entre usando o acesso sem senha.
            </p>
          ) : !ready ? (
            <p className="text-sm text-muted-foreground">
              Abra esta página pelo link enviado para o seu e-mail. Se o link expirou, peça um novo
              em "Redefinir minha senha".
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nova senha</label>
                <input
                  className={inputCls}
                  type="password"
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
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3">
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Salvando…
                  </>
                ) : (
                  <>
                    <KeyRound size={16} /> Salvar nova senha
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}

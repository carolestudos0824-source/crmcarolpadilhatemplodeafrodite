import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export function ChangePasswordDialog({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadingUser(true);
    setError(null);
    void supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      const u = data.user;
      setEmail(u?.email ?? null);
      const p =
        (u?.app_metadata as { provider?: string } | undefined)?.provider ??
        (u?.identities?.[0]?.provider ?? null);
      setProvider(p);
      setLoadingUser(false);
    }).catch(() => {
      if (cancelled) return;
      setLoadingUser(false);
      setError("Não foi possível carregar a sessão. Tente novamente.");
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const reset = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
    setError(null);
    setSubmitting(false);
  };

  const handleClose = (v: boolean) => {
    if (submitting) return;
    if (!v) reset();
    onOpenChange(v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Sessão inválida.");
      return;
    }
    if (!current || !next || !confirm) {
      setError("Preencha todos os campos.");
      return;
    }
    if (next.length < 8) {
      setError("A nova senha deve ter ao menos 8 caracteres.");
      return;
    }
    if (next !== confirm) {
      setError("A confirmação não confere com a nova senha.");
      return;
    }
    if (next === current) {
      setError("A nova senha deve ser diferente da senha atual.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: current,
      });
      if (signInError) {
        setCurrent("");
        setError("Senha atual incorreta.");
        setSubmitting(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: next });
      if (updateError) {
        const msg = updateError.message.toLowerCase();
        let friendly = "Não foi possível alterar a senha. Tente novamente.";
        if (msg.includes("pwned") || msg.includes("compromis")) {
          friendly = "Essa senha foi encontrada em vazamentos públicos. Escolha outra.";
        } else if (msg.includes("weak") || msg.includes("short") || msg.includes("password")) {
          friendly = "Senha fraca. Use uma senha mais forte (mínimo 8 caracteres).";
        } else if (msg.includes("same")) {
          friendly = "A nova senha deve ser diferente da atual.";
        }
        setError(friendly);
        setSubmitting(false);
        return;
      }

      reset();
      onOpenChange(false);
      toast.success("Senha alterada com sucesso. Entre novamente.");
      await supabase.auth.signOut();
      navigate("/login", { replace: true });
    } catch {
      setError("Erro inesperado. Tente novamente.");
      setSubmitting(false);
    }
  };

  const isOAuth = provider && provider !== "email";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-accent" />
            Alterar senha
          </DialogTitle>
          <DialogDescription>
            Atualize a senha da conta admin logada{email ? ` (${email})` : ""}.
          </DialogDescription>
        </DialogHeader>

        {loadingUser ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Loader2 size={14} className="animate-spin" /> Carregando sessão…
          </div>
        ) : isOAuth ? (
          <div className="space-y-3 py-2">
            <div className="flex items-start gap-2 p-3 rounded-lg admin-badge admin-badge-warning text-sm">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <div>
                Sua conta entra via <strong>{provider}</strong>. A senha é gerenciada pelo provedor externo — altere-a diretamente na conta {provider}.
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>Fechar</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
            <div className="space-y-1.5">
              <label htmlFor="cp-current" className="admin-label">Senha atual</label>
              <Input
                id="cp-current"
                type="password"
                autoComplete="current-password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                disabled={submitting}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="cp-new" className="admin-label">Nova senha (mín. 8 caracteres)</label>
              <Input
                id="cp-new"
                type="password"
                autoComplete="new-password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                disabled={submitting}
                minLength={8}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="cp-confirm" className="text-xs text-muted-foreground">Confirmar nova senha</label>
              <Input
                id="cp-confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={submitting}
                minLength={8}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={submitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 size={14} className="animate-spin mr-2" />}
                Alterar senha
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

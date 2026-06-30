import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, KeyRound, ShieldCheck, LogOut, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangePasswordDialog } from "@/components/admin/ChangePasswordDialog";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * "Minha conta admin" — gerenciamento seguro da própria conta admin logada.
 * - Usa apenas supabase.auth (cliente) — nunca service_role.
 * - Atualiza somente o usuário autenticado (auth.updateUser).
 * - O guard de admin é feito antes em AdminAccess (isAdmin).
 */
export function AdminAccountSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  // Email form
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSubmitting, setEmailSubmitting] = useState(false);

  // Password dialog
  const [pwdOpen, setPwdOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      const u = data.user;
      setEmail(u?.email ?? null);
      setCreatedAt(u?.created_at ?? null);
      const p =
        (u?.app_metadata as { provider?: string } | undefined)?.provider ??
        (u?.identities?.[0]?.provider ?? null);
      setProvider(p);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const isOAuth = !!provider && provider !== "email";

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    const a = newEmail.trim().toLowerCase();
    const b = confirmEmail.trim().toLowerCase();
    if (!a || !b) { setEmailError("Preencha os dois campos de e-mail."); return; }
    if (!EMAIL_RX.test(a)) { setEmailError("Formato de e-mail inválido."); return; }
    if (a !== b) { setEmailError("A confirmação não confere com o novo e-mail."); return; }
    if (email && a === email.toLowerCase()) {
      setEmailError("O novo e-mail deve ser diferente do atual.");
      return;
    }

    setEmailSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser(
        { email: a },
        { emailRedirectTo: `${window.location.origin}/auth/callback` },
      );
      if (error) {
        const msg = error.message.toLowerCase();
        let friendly = "Não foi possível atualizar o e-mail. Tente novamente.";
        if (msg.includes("registered") || msg.includes("exists") || msg.includes("already")) {
          friendly = "Este e-mail já está em uso por outra conta.";
        } else if (msg.includes("invalid")) {
          friendly = "E-mail inválido.";
        } else if (msg.includes("rate")) {
          friendly = "Muitas solicitações. Aguarde alguns minutos e tente novamente.";
        }
        setEmailError(friendly);
        setEmailSubmitting(false);
        return;
      }
      setNewEmail("");
      setConfirmEmail("");
      toast.success(
        "Solicitação de alteração de e-mail enviada. Verifique o novo endereço, se a confirmação estiver ativa.",
      );
    } catch {
      setEmailError("Erro inesperado. Tente novamente.");
    } finally {
      setEmailSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try { await supabase.auth.signOut(); } catch { /* ignore */ }
    navigate("/login", { replace: true });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-heading font-semibold uppercase tracking-wider text-foreground">
          Minha conta admin
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Gerencie o e-mail e a senha usados para entrar no painel administrativo.
        </p>
      </div>

      {/* Sessão atual */}
      <div className="admin-card">
        <div className="flex items-center gap-2 text-accent mb-2">
          <ShieldCheck size={16} />
          <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
            Sessão atual
          </h4>
        </div>
        {loading ? (
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Loader2 size={12} className="animate-spin" /> Carregando…
          </p>
        ) : (
          <div className="text-xs text-muted-foreground space-y-1">
            <div><span className="text-foreground/80">E-mail atual:</span> {email ?? "—"}</div>
            <div><span className="text-foreground/80">Provedor:</span> {provider ?? "email"}</div>
            {createdAt && (
              <div><span className="text-foreground/80">Conta criada em:</span> {new Date(createdAt).toLocaleDateString("pt-BR")}</div>
            )}
            <div className="text-[11px] text-muted-foreground/80 mt-2">
              Alterações afetam apenas a sua conta admin. Nenhum outro usuário é modificado.
            </div>
          </div>
        )}
      </div>

      {/* E-mail de entrada */}
      <div className="admin-card">
        <div className="flex items-center gap-2 text-accent mb-3">
          <Mail size={16} />
          <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
            E-mail de entrada
          </h4>
        </div>

        {isOAuth ? (
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-300" />
            <div>
              Sua conta entra via <strong>{provider}</strong>. O e-mail é gerenciado pelo provedor externo —
              altere-o diretamente na conta {provider}.
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateEmail} className="space-y-3" autoComplete="off">
            <div className="space-y-1.5">
              <label htmlFor="adm-current-email" className="admin-label">E-mail atual</label>
              <Input id="adm-current-email" type="email" value={email ?? ""} disabled readOnly />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="adm-new-email" className="admin-label">Novo e-mail</label>
              <Input
                id="adm-new-email"
                type="email"
                autoComplete="off"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={emailSubmitting}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="adm-confirm-email" className="admin-label">Confirmar novo e-mail</label>
              <Input
                id="adm-confirm-email"
                type="email"
                autoComplete="off"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                disabled={emailSubmitting}
                required
              />
            </div>

            {emailError && (
              <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {emailError}
              </div>
            )}

            <p className="text-[11px] text-muted-foreground/80">
              Pode ser necessário confirmar o novo e-mail antes da alteração ser concluída.
            </p>

            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={emailSubmitting}>
                {emailSubmitting && <Loader2 size={14} className="animate-spin mr-2" />}
                Atualizar e-mail
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Senha de acesso */}
      <div className="admin-card">
        <div className="flex items-center gap-2 text-accent mb-2">
          <KeyRound size={16} />
          <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
            Senha de acesso
          </h4>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          A senha é validada com a senha atual antes de ser atualizada. Mínimo de 8 caracteres.
        </p>
        <div className="flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={() => setPwdOpen(true)} disabled={isOAuth}>
            Atualizar senha
          </Button>
        </div>
        {isOAuth && (
          <p className="text-[11px] text-muted-foreground/80 mt-2">
            Sua conta entra via {provider}. A senha é gerenciada pelo provedor externo.
          </p>
        )}
      </div>

      {/* Segurança da conta */}
      <div className="admin-card">
        <div className="flex items-center gap-2 text-accent mb-2">
          <ShieldCheck size={16} />
          <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
            Segurança da conta
          </h4>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4 mb-3">
          <li>Use uma senha forte e exclusiva, com no mínimo 8 caracteres, misturando letras, números e símbolos.</li>
          <li>Não compartilhe seu acesso admin com terceiros.</li>
          <li>Saia da conta ao usar dispositivos compartilhados.</li>
        </ul>
        <div className="flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut size={14} className="mr-2" />
            Sair da conta
          </Button>
        </div>
      </div>

      <ChangePasswordDialog open={pwdOpen} onOpenChange={setPwdOpen} />
    </div>
  );
}

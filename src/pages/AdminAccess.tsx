import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Search,
  ShieldCheck,
  ShieldOff,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { Section } from "@/components/Section";
import { supabase } from "@/integrations/supabase/client";

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition";

type LookupRow = {
  user_id: string;
  email: string;
  has_access: boolean | null;
  source: string | null;
  access_created_at: string | null;
  access_exists: boolean;
};

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "found"; row: LookupRow }
  | { kind: "not_found" }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string; row: LookupRow };

export default function AdminAccess() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [acting, setActing] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate("/login", { replace: true });
        return;
      }
      const { data, error } = await supabase.rpc("is_admin");
      if (!mounted) return;
      if (error) {
        setIsAdmin(false);
      } else {
        setIsAdmin(Boolean(data));
      }
      setAuthChecked(true);
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus({ kind: "loading" });
    const { data, error } = await supabase.rpc("admin_lookup_user", {
      _email: email.trim(),
    });
    if (error) {
      setStatus({ kind: "error", message: error.message });
      return;
    }
    const rows = (data as LookupRow[] | null) ?? [];
    if (rows.length === 0) {
      setStatus({ kind: "not_found" });
      return;
    }
    setStatus({ kind: "found", row: rows[0] });
  };

  const setAccess = async (userId: string, hasAccess: boolean) => {
    setActing(true);
    const { data, error } = await supabase.rpc("admin_set_access", {
      _user_id: userId,
      _has_access: hasAccess,
    });
    setActing(false);
    if (error) {
      setStatus({ kind: "error", message: error.message });
      return;
    }
    const res = data as { success?: boolean; error?: string } | null;
    if (!res?.success) {
      setStatus({
        kind: "error",
        message: res?.error ?? "Erro ao executar ação",
      });
      return;
    }
    // refetch
    const { data: lookup } = await supabase.rpc("admin_lookup_user", {
      _email: email.trim(),
    });
    const rows = (lookup as LookupRow[] | null) ?? [];
    if (rows[0]) {
      setStatus({
        kind: "success",
        message: hasAccess
          ? "Acesso liberado com sucesso."
          : "Acesso revogado com sucesso.",
        row: rows[0],
      });
    }
  };

  if (!authChecked) {
    return (
      <Section>
        <div className="max-w-md mx-auto flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 size={16} className="animate-spin" /> Carregando…
        </div>
      </Section>
    );
  }

  if (!isAdmin) {
    return (
      <Section>
        <div className="max-w-md mx-auto glass-strong p-8 text-center">
          <AlertTriangle className="mx-auto text-red-400 mb-3" size={28} />
          <h1 className="text-xl font-heading font-bold mb-2">Acesso negado</h1>
          <p className="text-sm text-muted-foreground">
            Esta área é restrita a administradores.
          </p>
        </div>
      </Section>
    );
  }

  const row = status.kind === "found" || status.kind === "success" ? status.row : null;

  return (
    <Section>
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">
            Gerenciar acessos
          </h1>
          <p className="text-sm text-muted-foreground">
            Libere ou revogue o acesso de compradores à área de entrega.
          </p>
        </header>

        <SelfGrant />



        <div className="glass-strong p-6 mb-6">
          <form onSubmit={onSearch} className="space-y-3">
            <label className="text-xs text-muted-foreground block">
              E-mail do comprador
            </label>
            <div className="flex gap-2">
              <input
                className={inputCls}
                type="email"
                placeholder="comprador@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={status.kind === "loading"}
                className="btn-primary whitespace-nowrap"
              >
                {status.kind === "loading" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Search size={16} /> Buscar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {status.kind === "not_found" && (
          <div className="glass-strong p-6 text-center text-muted-foreground">
            Nenhum usuário encontrado com este e-mail no Auth.
          </div>
        )}

        {status.kind === "error" && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3">
            {status.message}
          </div>
        )}

        {status.kind === "success" && (
          <div className="rounded-xl border border-accent/30 bg-accent/10 text-accent text-sm px-4 py-3 mb-4">
            {status.message}
          </div>
        )}

        {row && (
          <div className="glass-strong p-6 space-y-4">
            <div className="flex items-center gap-2">
              <UserCheck size={18} className="text-accent" />
              <h2 className="font-heading font-semibold">Comprador encontrado</h2>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <Info label="E-mail" value={row.email} />
              <Info label="user_id" value={row.user_id} mono />
              <Info
                label="Status"
                value={
                  !row.access_exists
                    ? "Sem registro de acesso"
                    : row.has_access
                      ? "Ativo"
                      : "Sem acesso"
                }
                tone={
                  row.access_exists && row.has_access
                    ? "ok"
                    : row.access_exists
                      ? "warn"
                      : "muted"
                }
              />
              <Info label="Origem" value={row.source ?? "—"} />
              <Info
                label="Criado em"
                value={
                  row.access_created_at
                    ? new Date(row.access_created_at).toLocaleString("pt-BR")
                    : "—"
                }
              />
            </dl>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => setAccess(row.user_id, true)}
                disabled={acting || (row.access_exists && row.has_access === true)}
                className="btn-primary flex-1"
              >
                {acting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    {row.access_exists ? "Liberar acesso" : "Criar e liberar acesso"}
                  </>
                )}
              </button>
              <button
                onClick={() => setAccess(row.user_id, false)}
                disabled={acting || !row.access_exists || row.has_access === false}
                className="btn-ghost flex-1 border border-red-500/30 text-red-200 hover:bg-red-500/10"
              >
                <ShieldOff size={16} /> Revogar acesso
              </button>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

function Info({
  label,
  value,
  mono,
  tone = "default",
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: "default" | "ok" | "warn" | "muted";
}) {
  const toneCls =
    tone === "ok"
      ? "text-accent"
      : tone === "warn"
        ? "text-amber-300"
        : tone === "muted"
          ? "text-muted-foreground"
          : "text-foreground";
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </div>
      <div className={`${toneCls} ${mono ? "font-mono text-xs break-all" : ""}`}>
        {value}
      </div>
    </div>
  );
}

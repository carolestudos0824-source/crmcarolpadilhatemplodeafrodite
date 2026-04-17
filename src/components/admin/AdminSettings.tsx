import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Shield, Crown, Search, Trash2, UserPlus, Code2, Database, Store, CreditCard, LayoutDashboard, CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminEntry {
  id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  created_at: string | null;
  is_principal: boolean;
}

interface SearchResult {
  id: string;
  email: string;
  created_at: string;
}

const AdminSettings = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [pendingRemove, setPendingRemove] = useState<AdminEntry | null>(null);

  const call = async (body: object) => {
    const { data, error } = await supabase.functions.invoke("admin-manage", { body });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const loadAdmins = async () => {
    try {
      const data = await call({ action: "list" });
      setAdmins(data.admins ?? []);
    } catch (e: any) {
      toast.error("Erro ao carregar: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleSearch = async () => {
    if (!searchEmail.trim()) return;
    setSearching(true);
    try {
      const data = await call({ action: "search", email: searchEmail.trim() });
      setResults(data.users ?? []);
      if (!data.users?.length) toast.info("Nenhum usuário encontrado.");
    } catch (e: any) {
      toast.error("Erro: " + e.message);
    } finally {
      setSearching(false);
    }
  };

  const handlePromote = async (targetId: string, email: string) => {
    if (admins.some((a) => a.user_id === targetId)) {
      toast.info("Esse usuário já é administrador.");
      return;
    }
    try {
      await call({ action: "promote", target_user_id: targetId });
      toast.success(`${email} promovido(a) a administrador(a).`);
      setSearchEmail("");
      setResults([]);
      loadAdmins();
    } catch (e: any) {
      toast.error("Erro: " + e.message);
    }
  };

  const handleRemove = async () => {
    if (!pendingRemove) return;
    try {
      await call({ action: "demote", target_user_id: pendingRemove.user_id });
      toast.success("Administrador removido.");
      setPendingRemove(null);
      loadAdmins();
    } catch (e: any) {
      toast.error("Erro: " + e.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Carregando...</div>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-heading text-lg text-foreground">Configurações</h2>
        <p className="text-sm text-muted-foreground">Administradores, propriedade e integrações.</p>
      </div>

      {/* ADMINS */}
      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60">
            Administradores ativos
          </h3>
          <span className="text-[10px] font-heading tracking-wide text-muted-foreground">
            {admins.length} {admins.length === 1 ? "conta" : "contas"}
          </span>
        </header>

        <div className="space-y-2">
          {admins.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between gap-3 p-4 rounded-xl border border-border/50 bg-card/40"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    a.is_principal
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {a.is_principal ? <Crown className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-foreground truncate">
                      {a.display_name || a.email?.split("@")[0] || "—"}
                    </p>
                    {a.is_principal && (
                      <span className="text-[9px] font-heading tracking-[0.15em] uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        Principal
                      </span>
                    )}
                    {a.user_id === user?.id && !a.is_principal && (
                      <span className="text-[9px] font-heading tracking-[0.15em] uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        Você
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{a.email ?? "sem e-mail"}</p>
                </div>
              </div>
              {!a.is_principal && a.user_id !== user?.id && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPendingRemove(a)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PROMOTE */}
      <section className="space-y-4">
        <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60">
          Promover novo administrador
        </h3>

        <div className="p-4 rounded-xl border border-border/50 bg-card/30 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Buscar usuário por e-mail..."
                className="pl-9"
                type="email"
              />
            </div>
            <Button size="sm" onClick={handleSearch} disabled={searching || !searchEmail.trim()}>
              {searching ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          {results.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-border/30">
              {results.map((r) => {
                const already = admins.some((a) => a.user_id === r.id);
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <p className="text-xs text-foreground truncate">{r.email}</p>
                    <Button
                      size="sm"
                      variant={already ? "ghost" : "default"}
                      disabled={already}
                      onClick={() => handlePromote(r.id, r.email)}
                      className="shrink-0 h-7 text-[11px]"
                    >
                      {already ? (
                        "Já é admin"
                      ) : (
                        <>
                          <UserPlus className="w-3 h-3 mr-1" /> Promover
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* OWNERSHIP */}
      <section className="space-y-4">
        <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60">
          Propriedade do projeto
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { icon: Code2, label: "Acesso ao código", detail: "Lovable — edição e export", status: "Controlado" },
            { icon: Database, label: "Acesso ao banco", detail: "Lovable Cloud", status: "Controlado" },
            { icon: Store, label: "Contas de publicação", detail: "App Store · Google Play", status: "A configurar" },
            { icon: CreditCard, label: "Sistema de cobrança", detail: "Stripe · RevenueCat", status: "A configurar" },
            { icon: LayoutDashboard, label: "Painel administrativo", detail: "/admin (esta tela)", status: "Ativo" },
          ].map((item) => {
            const active = item.status === "Controlado" || item.status === "Ativo";
            return (
              <div
                key={item.label}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/40 bg-card/30"
              >
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                    active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{item.detail}</p>
                </div>
                <span
                  className={`text-[9px] font-heading tracking-[0.15em] uppercase px-2 py-0.5 rounded-full shrink-0 ${
                    active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="space-y-4">
        <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60">
          Integrações
        </h3>
        <div className="space-y-1.5">
          {[
            { name: "Banco de dados (Cloud)", state: "functional" as const },
            { name: "Autenticação (e-mail/senha)", state: "functional" as const },
            { name: "Gift Codes", state: "functional" as const },
            { name: "Painel administrativo", state: "functional" as const },
            { name: "Stripe / Pagamentos web", state: "structure" as const },
            { name: "RevenueCat / IAP mobile", state: "pending" as const },
            { name: "Notificações push", state: "not_implemented" as const },
            { name: "OAuth Google / Apple", state: "not_implemented" as const },
          ].map((int) => {
            const map = {
              functional: { label: "Funcional", icon: CheckCircle2, cls: "bg-primary/10 text-primary" },
              structure: { label: "Estrutura", icon: Circle, cls: "bg-secondary/20 text-secondary-foreground" },
              pending: { label: "Pendente", icon: Clock, cls: "bg-muted text-muted-foreground" },
              not_implemented: { label: "Não implementado", icon: AlertCircle, cls: "bg-muted/50 text-muted-foreground/60" },
            }[int.state];
            const Icon = map.icon;
            return (
              <div
                key={int.name}
                className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-card/20"
              >
                <span className="text-xs text-foreground">{int.name}</span>
                <span
                  className={`flex items-center gap-1.5 text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full ${map.cls}`}
                >
                  <Icon className="w-3 h-3" />
                  {map.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <AlertDialog open={!!pendingRemove} onOpenChange={(o) => !o && setPendingRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover administrador?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="text-foreground font-medium">
                {pendingRemove?.display_name || pendingRemove?.email}
              </span>{" "}
              perderá acesso ao painel administrativo. A conta de usuário continua ativa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="bg-destructive hover:bg-destructive/90">
              Remover acesso
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSettings;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Search, Crown, Gift, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserRow {
  user_id: string;
  display_name: string | null;
  is_premium: boolean;
  premium_until: string | null;
  premium_source: string | null;
  created_at: string;
  updated_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, is_premium, premium_until, premium_source, created_at, updated_at")
        .order("created_at", { ascending: false });
      setUsers(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const now = new Date();

  const getStatus = (u: UserRow) => {
    if (!u.is_premium) return { label: "Gratuito", cls: "bg-muted text-muted-foreground" };
    const until = u.premium_until ? new Date(u.premium_until) : null;
    if (until && until <= now) return { label: "Expirado", cls: "bg-destructive/10 text-destructive" };
    if (u.premium_source === "gift") return { label: "Presente", cls: "bg-primary/10 text-primary" };
    if (u.premium_source === "admin") return { label: "Admin", cls: "bg-primary/10 text-primary" };
    return { label: "Assinante", cls: "bg-primary/10 text-primary" };
  };

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.display_name || "").toLowerCase().includes(q) || u.user_id.toLowerCase().includes(q);
  });

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Carregando usuários...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg text-foreground">Usuários</h2>
        <p className="text-sm text-muted-foreground">{users.length} usuários cadastrados.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome ou ID..."
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 rounded-xl border border-border/50 bg-card/30 text-center">
          <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Nome</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Origem</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Cadastro</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Válido até</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 50).map(u => {
                  const status = getStatus(u);
                  return (
                    <tr key={u.user_id} className="border-b border-border/10 last:border-0">
                      <td className="p-3 text-foreground">{u.display_name || "Sem nome"}</td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full ${status.cls}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-3 text-center text-muted-foreground text-xs">
                        {u.premium_source || "—"}
                      </td>
                      <td className="p-3 text-center text-muted-foreground text-xs">
                        {new Date(u.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-3 text-center text-muted-foreground text-xs">
                        {u.premium_until ? new Date(u.premium_until).toLocaleDateString("pt-BR") : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length > 50 && (
            <div className="p-3 text-center text-xs text-muted-foreground border-t border-border/30">
              Mostrando 50 de {filtered.length} usuários
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

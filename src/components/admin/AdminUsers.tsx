import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Search, Crown, Gift, Clock, BarChart3, BookOpen, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserRow {
  user_id: string;
  display_name: string | null;
  is_premium: boolean;
  premium_until: string | null;
  premium_source: string | null;
  created_at: string;
  updated_at: string;
}

interface ProgressRow {
  user_id: string;
  completed_lessons: string[];
  completed_modules: string[];
  completed_quizzes: string[];
  last_active: string;
  streak: number;
  xp: number;
  level: number;
}

type StatusFilter = "all" | "premium" | "free" | "gift" | "expired";
type SortField = "created_at" | "last_active" | "xp" | "lessons";

const AdminUsers = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortField>("created_at");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: prof }, { data: prog }] = await Promise.all([
        supabase.from("profiles").select("user_id, display_name, is_premium, premium_until, premium_source, created_at, updated_at").order("created_at", { ascending: false }),
        supabase.from("user_progress").select("user_id, completed_lessons, completed_modules, completed_quizzes, last_active, streak, xp, level"),
      ]);
      setUsers(prof || []);
      setProgress(prog || []);
      setLoading(false);
    };
    load();
  }, []);

  const now = useMemo(() => new Date(), []);

  const progressMap = useMemo(() => {
    const map: Record<string, ProgressRow> = {};
    progress.forEach(p => { map[p.user_id] = p; });
    return map;
  }, [progress]);

  const getStatus = (u: UserRow) => {
    if (!u.is_premium) return { label: "Gratuito", cls: "bg-muted text-muted-foreground", key: "free" as const };
    const until = u.premium_until ? new Date(u.premium_until) : null;
    if (until && until <= now) return { label: "Expirado", cls: "bg-destructive/10 text-destructive", key: "expired" as const };
    if (u.premium_source === "gift" || u.premium_source === "admin") return { label: "Presenteado", cls: "bg-purple-500/10 text-purple-600", key: "gift" as const };
    return { label: "Assinante", cls: "bg-primary/10 text-primary", key: "premium" as const };
  };

  const enriched = useMemo(() => {
    return users.map(u => ({
      ...u,
      status: getStatus(u),
      progress: progressMap[u.user_id],
    }));
  }, [users, progressMap, now]);

  const filtered = useMemo(() => {
    let list = enriched;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u => (u.display_name || "").toLowerCase().includes(q) || u.user_id.toLowerCase().includes(q));
    }

    if (statusFilter !== "all") {
      list = list.filter(u => u.status.key === statusFilter);
    }

    // Sort
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "last_active":
          return new Date(b.progress?.last_active || 0).getTime() - new Date(a.progress?.last_active || 0).getTime();
        case "xp":
          return (b.progress?.xp || 0) - (a.progress?.xp || 0);
        case "lessons":
          return (b.progress?.completed_lessons?.length || 0) - (a.progress?.completed_lessons?.length || 0);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return list;
  }, [enriched, search, statusFilter, sortBy]);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Carregando usuários...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg text-foreground">Usuários</h2>
        <p className="text-sm text-muted-foreground">{users.length} cadastrados · {users.filter(u => u.is_premium).length} premium</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou ID..." className="pl-8 h-9 text-sm" />
        </div>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="premium">Assinantes</SelectItem>
            <SelectItem value="free">Gratuitos</SelectItem>
            <SelectItem value="gift">Presenteados</SelectItem>
            <SelectItem value="expired">Expirados</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={v => setSortBy(v as SortField)}>
          <SelectTrigger className="w-36 h-9 text-xs">
            <ArrowUpDown className="w-3 h-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Data de cadastro</SelectItem>
            <SelectItem value="last_active">Última atividade</SelectItem>
            <SelectItem value="xp">XP</SelectItem>
            <SelectItem value="lessons">Lições concluídas</SelectItem>
          </SelectContent>
        </Select>
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
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Última atividade</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Lições</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">XP</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Streak</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 100).map(u => (
                  <tr key={u.user_id} className="border-b border-border/10 last:border-0 hover:bg-card/80 transition-colors">
                    <td className="p-3">
                      <div>
                        <p className="text-foreground font-medium">{u.display_name || "Sem nome"}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{u.user_id.slice(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full ${u.status.cls}`}>
                        {u.status.label}
                      </span>
                    </td>
                    <td className="p-3 text-center text-muted-foreground text-xs">{u.premium_source || "—"}</td>
                    <td className="p-3 text-center text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                    <td className="p-3 text-center text-muted-foreground text-xs">
                      {u.progress?.last_active ? new Date(u.progress.last_active).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="p-3 text-center text-muted-foreground text-xs">{u.progress?.completed_lessons?.length || 0}</td>
                    <td className="p-3 text-center text-muted-foreground text-xs">{u.progress?.xp || 0}</td>
                    <td className="p-3 text-center">
                      {u.progress?.streak ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          🔥 {u.progress.streak}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > 100 && (
            <div className="p-3 text-center text-xs text-muted-foreground border-t border-border/30">
              Mostrando 100 de {filtered.length} usuários
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Crown, ShieldOff, MessageSquare, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminSupport = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [grantDays, setGrantDays] = useState(30);

  const searchUser = async () => {
    if (!search.trim()) return;
    setSearching(true);
    const q = search.trim().toLowerCase();
    
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .or(`display_name.ilike.%${q}%,user_id.eq.${q.length === 36 ? q : "00000000-0000-0000-0000-000000000000"}`);

    if (data && data.length > 0) {
      setUser(data[0]);
      // Fetch feedback for this user
      const { data: fb } = await supabase
        .from("beta_feedback")
        .select("*")
        .eq("user_id", data[0].user_id)
        .order("created_at", { ascending: false })
        .limit(10);
      setFeedback(fb || []);
    } else {
      setUser(null);
      setFeedback([]);
      toast.error("Usuário não encontrado.");
    }
    setSearching(false);
  };

  const grantPremium = async () => {
    if (!user) return;
    const until = new Date();
    until.setDate(until.getDate() + grantDays);

    const { error } = await supabase
      .from("profiles")
      .update({
        is_premium: true,
        premium_source: "admin",
        premium_until: until.toISOString(),
      })
      .eq("user_id", user.user_id);

    if (error) {
      toast.error("Erro: " + error.message);
    } else {
      toast.success(`Premium concedido por ${grantDays} dias.`);
      setUser({ ...user, is_premium: true, premium_source: "admin", premium_until: until.toISOString() });
    }
  };

  const revokePremium = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        is_premium: false,
        premium_source: null,
        premium_until: null,
      })
      .eq("user_id", user.user_id);

    if (error) {
      toast.error("Erro: " + error.message);
    } else {
      toast.success("Acesso premium revogado.");
      setUser({ ...user, is_premium: false, premium_source: null, premium_until: null });
    }
  };

  const now = new Date();
  const isActive = user?.is_premium && (!user?.premium_until || new Date(user.premium_until) > now);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg text-foreground">Suporte</h2>
        <p className="text-sm text-muted-foreground">Buscar usuário, conceder ou revogar acesso, ver feedback.</p>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nome ou ID do usuário..."
            className="pl-9"
            onKeyDown={e => e.key === "Enter" && searchUser()}
          />
        </div>
        <Button onClick={searchUser} disabled={searching} size="sm">
          {searching ? "..." : "Buscar"}
        </Button>
      </div>

      {/* User card */}
      {user && (
        <div className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm text-foreground">{user.display_name || "Sem nome"}</h3>
              <p className="text-[10px] text-muted-foreground font-mono">{user.user_id}</p>
            </div>
            <span className={`text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full ${
              isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}>
              {isActive ? "Premium Ativo" : "Gratuito"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Cadastro</span>
              <p className="text-foreground">{new Date(user.created_at).toLocaleDateString("pt-BR")}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Origem</span>
              <p className="text-foreground">{user.premium_source || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Válido até</span>
              <p className="text-foreground">
                {user.premium_until ? new Date(user.premium_until).toLocaleDateString("pt-BR") : "—"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Beta tester</span>
              <p className="text-foreground">{user.is_beta_tester ? "Sim" : "Não"}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-end gap-3 pt-2 border-t border-border/30">
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">Dias de premium</label>
              <Input
                type="number"
                value={grantDays}
                onChange={e => setGrantDays(Number(e.target.value))}
                className="w-20 h-8 text-xs"
                min={1}
              />
            </div>
            <Button size="sm" onClick={grantPremium} className="h-8 text-xs">
              <Crown className="w-3 h-3 mr-1" />
              Conceder
            </Button>
            {isActive && (
              <Button size="sm" variant="outline" onClick={revokePremium} className="h-8 text-xs">
                <ShieldOff className="w-3 h-3 mr-1" />
                Revogar
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Feedback */}
      {user && (
        <div>
          <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-3">
            Feedback do usuário
          </h3>
          {feedback.length === 0 ? (
            <div className="p-6 rounded-xl border border-border/50 bg-card/30 text-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Nenhum feedback registrado.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {feedback.map(fb => (
                <div key={fb.id} className="p-3 rounded-lg border border-border/30 bg-card/30">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-heading tracking-wide text-primary">{fb.type}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(fb.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-xs text-foreground">{fb.message}</p>
                  {fb.page && <p className="text-[10px] text-muted-foreground mt-1">Página: {fb.page}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSupport;

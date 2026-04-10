import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Settings, Shield, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AdminSettings = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<any[]>([]);
  const [newAdminId, setNewAdminId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("*");
      setRoles(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const addAdmin = async () => {
    if (!newAdminId.trim()) return;
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: newAdminId.trim(), role: "admin" as any });
    if (error) {
      toast.error("Erro: " + error.message);
    } else {
      toast.success("Admin adicionado!");
      setNewAdminId("");
      const { data } = await supabase.from("user_roles").select("*");
      setRoles(data || []);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Carregando...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-lg text-foreground">Configurações</h2>
        <p className="text-sm text-muted-foreground">Administradores, permissões e integrações.</p>
      </div>

      {/* Admins */}
      <div className="space-y-4">
        <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60">Administradores</h3>
        
        {roles.length === 0 ? (
          <div className="p-6 rounded-xl border border-border/50 bg-card/30 text-center">
            <Shield className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Nenhum administrador configurado.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {roles.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-card/30">
                <div>
                  <p className="text-xs font-mono text-foreground">{r.user_id}</p>
                  <span className="text-[10px] font-heading tracking-wide text-primary">{r.role}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={newAdminId}
            onChange={e => setNewAdminId(e.target.value)}
            placeholder="User ID do novo admin..."
            className="font-mono text-xs"
          />
          <Button size="sm" onClick={addAdmin}>
            Adicionar
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-4">
        <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60">Propriedade do Projeto</h3>
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
          <p className="text-sm text-foreground font-medium">🔑 Acesso completo da criadora</p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Código-fonte via Lovable (edição e export)</li>
            <li>Banco de dados via Lovable Cloud</li>
            <li>Contas de publicação (App Store, Google Play)</li>
            <li>Sistema de cobrança (Stripe / RevenueCat)</li>
            <li>Painel administrativo (/admin)</li>
          </ul>
        </div>
      </div>

      {/* Integrations status */}
      <div className="space-y-4">
        <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60">Integrações</h3>
        <div className="space-y-2">
          {[
            { name: "Lovable Cloud (Banco)", status: "Ativo", active: true },
            { name: "Autenticação", status: "Ativo", active: true },
            { name: "Gift Codes", status: "Ativo", active: true },
            { name: "Stripe / Pagamentos", status: "Pendente", active: false },
            { name: "RevenueCat / IAP", status: "Pendente", active: false },
            { name: "Notificações Push", status: "Pendente", active: false },
          ].map(int => (
            <div key={int.name} className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-card/30">
              <span className="text-xs text-foreground">{int.name}</span>
              <span className={`text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full ${
                int.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {int.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

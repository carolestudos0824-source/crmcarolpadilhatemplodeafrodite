import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Gift, Plus, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "ARCANO-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

const AdminGiftCodes = () => {
  const { user } = useAuth();
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newDuration, setNewDuration] = useState(30);
  const [newMaxUses, setNewMaxUses] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchCodes = async () => {
    const { data } = await supabase
      .from("gift_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setCodes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCodes(); }, []);

  const handleCreate = async () => {
    if (!user) return;
    setCreating(true);
    const code = generateCode();
    const { error } = await supabase.from("gift_codes").insert({
      code,
      duration_days: newDuration,
      max_uses: newMaxUses,
      created_by: user.id,
    });
    if (error) {
      toast.error("Erro ao criar código: " + error.message);
    } else {
      toast.success(`Código ${code} criado!`);
      fetchCodes();
    }
    setCreating(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success("Código copiado!");
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Carregando códigos...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg text-foreground">Códigos de Presente</h2>
        <p className="text-sm text-muted-foreground">Crie e gerencie códigos para presentear acesso premium.</p>
      </div>

      {/* Create new code */}
      <div className="p-4 rounded-xl border border-border/50 bg-card/50 space-y-4">
        <h3 className="font-heading text-sm text-foreground">Criar novo código</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">Duração (dias)</label>
            <Input
              type="number"
              value={newDuration}
              onChange={(e) => setNewDuration(Number(e.target.value))}
              className="w-24"
              min={1}
            />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">Usos máximos</label>
            <Input
              type="number"
              value={newMaxUses}
              onChange={(e) => setNewMaxUses(Number(e.target.value))}
              className="w-24"
              min={1}
            />
          </div>
          <Button onClick={handleCreate} disabled={creating} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            {creating ? "Criando..." : "Gerar código"}
          </Button>
        </div>
      </div>

      {/* List */}
      {codes.length === 0 ? (
        <div className="p-8 rounded-xl border border-border/50 bg-card/30 text-center">
          <Gift className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum código criado ainda.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Código</th>
                <th className="text-center p-3 text-xs text-muted-foreground font-medium">Dias</th>
                <th className="text-center p-3 text-xs text-muted-foreground font-medium">Usos</th>
                <th className="text-center p-3 text-xs text-muted-foreground font-medium">Status</th>
                <th className="text-center p-3 text-xs text-muted-foreground font-medium">Ação</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((gc) => (
                <tr key={gc.id} className="border-b border-border/10 last:border-0">
                  <td className="p-3 font-mono text-xs text-foreground">{gc.code}</td>
                  <td className="p-3 text-center text-muted-foreground">{gc.duration_days}</td>
                  <td className="p-3 text-center text-muted-foreground">{gc.current_uses}/{gc.max_uses}</td>
                  <td className="p-3 text-center">
                    <span className={`text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full ${
                      gc.is_active && gc.current_uses < gc.max_uses
                        ? "bg-green-500/10 text-green-600"
                        : "bg-red-500/10 text-red-500"
                    }`}>
                      {gc.is_active && gc.current_uses < gc.max_uses ? "Ativo" : "Esgotado"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => copyCode(gc.code)} className="text-muted-foreground hover:text-foreground transition-colors">
                      {copied === gc.code ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminGiftCodes;

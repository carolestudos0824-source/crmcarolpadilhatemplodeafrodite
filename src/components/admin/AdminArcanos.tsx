import { useState } from "react";
import { Plus, Edit, Eye, EyeOff, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ARCANOS_MAIORES } from "@/data/tarot-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FilterType = "all" | "published" | "draft";

const AdminArcanos = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingId, setEditingId] = useState<number | null>(null);

  const filtered = ARCANOS_MAIORES.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "published" && a.unlocked) || (filter === "draft" && !a.unlocked);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-lg text-foreground">Arcanos Maiores</h2>
          <p className="text-sm text-muted-foreground">{ARCANOS_MAIORES.length} arcanos · {ARCANOS_MAIORES.filter(a => a.unlocked).length} publicados</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Novo Arcano
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Buscar arcano..." 
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={v => setFilter(v as FilterType)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        {filtered.map(arcano => (
          <div
            key={arcano.id}
            className="flex items-center gap-4 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors group"
          >
            <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-heading text-sm text-primary shrink-0">
              {arcano.numeral}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground">{arcano.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{arcano.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                arcano.unlocked 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {arcano.unlocked ? "Publicado" : "Rascunho"}
              </span>
              <Button 
                variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setEditingId(arcano.id)}
              >
                <Edit className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={editingId !== null} onOpenChange={() => setEditingId(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              Editar Arcano — {editingId !== null && ARCANOS_MAIORES.find(a => a.id === editingId)?.name}
            </DialogTitle>
          </DialogHeader>
          {editingId !== null && (() => {
            const arcano = ARCANOS_MAIORES.find(a => a.id === editingId);
            if (!arcano) return null;
            return (
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Nome</label>
                    <Input defaultValue={arcano.name} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Numeral</label>
                    <Input defaultValue={arcano.numeral} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Subtítulo</label>
                  <Input defaultValue={arcano.subtitle} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Palavras-chave</label>
                  <Input defaultValue={arcano.keywords?.join(", ")} placeholder="Separadas por vírgula" />
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
                  <p>💡 Para editar conteúdo completo (lições, deep dive, quiz), acesse a aba <strong>Lições</strong> e filtre por este arcano.</p>
                </div>
                <Button className="w-full">Salvar Alterações</Button>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminArcanos;

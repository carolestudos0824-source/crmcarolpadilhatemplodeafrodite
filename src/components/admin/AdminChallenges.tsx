import { useState } from "react";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Challenge {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  xp: number;
}

const challengeTypes = [
  { id: "carta-do-dia", label: "Carta do Dia" },
  { id: "revisao-rapida", label: "Revisão Rápida" },
  { id: "perguntas-do-dia", label: "Perguntas do Dia" },
  { id: "simbolo-do-dia", label: "Símbolo do Dia" },
  { id: "combinacao-do-dia", label: "Combinação do Dia" },
  { id: "mini-interpretacao", label: "Mini Interpretação" },
];

const sampleChallenges: Challenge[] = [
  { id: "c1", type: "carta-do-dia", title: "Carta do Dia", subtitle: "Explore o arcano sorteado", xp: 15 },
  { id: "c2", type: "revisao-rapida", title: "Revisão Relâmpago", subtitle: "Teste sua memória", xp: 10 },
  { id: "c3", type: "mini-interpretacao", title: "Mini Interpretação", subtitle: "Interprete uma tiragem simples", xp: 20 },
];

const AdminChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>(sampleChallenges);
  const [editing, setEditing] = useState<Challenge | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (!editing) return;
    setChallenges(prev => {
      const exists = prev.find(c => c.id === editing.id);
      if (exists) return prev.map(c => c.id === editing.id ? editing : c);
      return [...prev, editing];
    });
    setEditing(null);
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-lg text-foreground">Desafios Diários</h2>
          <p className="text-sm text-muted-foreground">{challenges.length} tipos de desafio configurados</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => { setEditing({ id: `c${Date.now()}`, type: "carta-do-dia", title: "", subtitle: "", xp: 10 }); setIsOpen(true); }}>
          <Plus className="w-4 h-4" /> Novo Desafio
        </Button>
      </div>

      <div className="space-y-2">
        {challenges.map(ch => (
          <div key={ch.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors group">
            <Calendar className="w-4 h-4 text-primary/60 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground">{ch.title}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{ch.xp} XP</span>
              </div>
              <p className="text-xs text-muted-foreground">{ch.subtitle}</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setEditing(ch); setIsOpen(true); }}>
                <Edit className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => setChallenges(prev => prev.filter(c => c.id !== ch.id))}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Desafio Diário</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Tipo</label>
                <Select value={editing.type} onValueChange={v => setEditing({ ...editing, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {challengeTypes.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Título</label>
                <Input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Subtítulo</label>
                <Input value={editing.subtitle} onChange={e => setEditing({ ...editing, subtitle: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">XP</label>
                <Input type="number" value={editing.xp} onChange={e => setEditing({ ...editing, xp: Number(e.target.value) })} />
              </div>
              <Button onClick={handleSave} className="w-full">Salvar</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminChallenges;

import { useState } from "react";
import { Plus, Edit, GripVertical, Eye, EyeOff, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface Module {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  order: number;
  published: boolean;
  premium: boolean;
  lessonsCount: number;
}

const defaultModules: Module[] = [
  { id: "fundamentos", title: "Fundamentos do Tarô", subtitle: "Bases essenciais", icon: "📖", order: 1, published: true, premium: false, lessonsCount: 10 },
  { id: "arcanos-maiores", title: "Arcanos Maiores", subtitle: "Os 22 trunfos", icon: "🌟", order: 2, published: true, premium: false, lessonsCount: 22 },
  { id: "copas", title: "Naipe de Copas", subtitle: "Emoções e relacionamentos", icon: "💧", order: 3, published: true, premium: false, lessonsCount: 14 },
  { id: "ouros", title: "Naipe de Ouros", subtitle: "Material e prático", icon: "🪙", order: 4, published: true, premium: false, lessonsCount: 14 },
  { id: "espadas", title: "Naipe de Espadas", subtitle: "Mente e conflitos", icon: "⚔️", order: 5, published: true, premium: false, lessonsCount: 14 },
  { id: "paus", title: "Naipe de Paus", subtitle: "Ação e criatividade", icon: "🔥", order: 6, published: true, premium: false, lessonsCount: 14 },
  { id: "combinacoes", title: "Combinações", subtitle: "Leitura cruzada", icon: "🔗", order: 7, published: true, premium: true, lessonsCount: 8 },
  { id: "tiragens", title: "Tiragens", subtitle: "Métodos de leitura", icon: "🎴", order: 8, published: true, premium: true, lessonsCount: 6 },
  { id: "amor", title: "Tarô e Amor", subtitle: "Leituras afetivas", icon: "💜", order: 9, published: true, premium: true, lessonsCount: 6 },
  { id: "pratica", title: "Prática Guiada", subtitle: "Exercícios reais", icon: "🔮", order: 10, published: true, premium: true, lessonsCount: 5 },
];

const AdminModules = () => {
  const [modules, setModules] = useState<Module[]>(defaultModules);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleTogglePublish = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, published: !m.published } : m));
  };

  const handleTogglePremium = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, premium: !m.premium } : m));
  };

  const handleSave = () => {
    if (editingModule) {
      setModules(prev => {
        const exists = prev.find(m => m.id === editingModule.id);
        if (exists) return prev.map(m => m.id === editingModule.id ? editingModule : m);
        return [...prev, editingModule];
      });
      setEditingModule(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-lg text-foreground">Módulos</h2>
          <p className="text-sm text-muted-foreground">{modules.length} módulos cadastrados</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              className="gap-2"
              onClick={() => setEditingModule({ id: "", title: "", subtitle: "", icon: "📖", order: modules.length + 1, published: false, premium: false, lessonsCount: 0 })}
            >
              <Plus className="w-4 h-4" /> Novo Módulo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading">{editingModule?.id ? "Editar Módulo" : "Novo Módulo"}</DialogTitle>
            </DialogHeader>
            {editingModule && (
              <div className="space-y-4 mt-2">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Título</label>
                  <Input value={editingModule.title} onChange={e => setEditingModule({ ...editingModule, title: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Subtítulo</label>
                  <Input value={editingModule.subtitle} onChange={e => setEditingModule({ ...editingModule, subtitle: e.target.value })} />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground mb-1 block">Ícone</label>
                    <Input value={editingModule.icon} onChange={e => setEditingModule({ ...editingModule, icon: e.target.value })} />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground mb-1 block">Ordem</label>
                    <Input type="number" value={editingModule.order} onChange={e => setEditingModule({ ...editingModule, order: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Premium</span>
                  <Switch checked={editingModule.premium} onCheckedChange={v => setEditingModule({ ...editingModule, premium: v })} />
                </div>
                <Button onClick={handleSave} className="w-full">Salvar</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {modules.sort((a, b) => a.order - b.order).map(mod => (
          <div key={mod.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors group">
            <GripVertical className="w-4 h-4 text-muted-foreground/30 cursor-grab" />
            <span className="text-xl w-8 text-center">{mod.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground truncate">{mod.title}</h3>
                {mod.premium && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Premium</span>}
              </div>
              <p className="text-xs text-muted-foreground">{mod.subtitle} · {mod.lessonsCount} lições</p>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" size="sm" className="h-8 w-8 p-0"
                onClick={() => handleTogglePremium(mod.id)}
                title={mod.premium ? "Tornar gratuito" : "Tornar premium"}
              >
                <LockIcon className={`w-3.5 h-3.5 ${mod.premium ? "text-primary" : "text-muted-foreground"}`} />
              </Button>
              <Button 
                variant="ghost" size="sm" className="h-8 w-8 p-0"
                onClick={() => handleTogglePublish(mod.id)}
              >
                {mod.published ? <Eye className="w-3.5 h-3.5 text-primary" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
              </Button>
              <Button 
                variant="ghost" size="sm" className="h-8 w-8 p-0"
                onClick={() => { setEditingModule(mod); setIsOpen(true); }}
              >
                <Edit className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminModules;

import { useState } from "react";
import { Layers, Star, HelpCircle, Calendar, Lock, Eye, EyeOff, LockIcon, Edit, Plus, GripVertical, Search, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ARCANOS_MAIORES } from "@/data/tarot-data";

/* ═══════════ MODULES TAB ═══════════ */

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
  { id: "leitura-simbolica", title: "Leitura Simbólica", subtitle: "Ler a linguagem das cartas", icon: "🔍", order: 2, published: true, premium: false, lessonsCount: 8 },
  { id: "arcanos-maiores", title: "Arcanos Maiores", subtitle: "Os 22 trunfos", icon: "🌟", order: 3, published: true, premium: false, lessonsCount: 22 },
  { id: "arquitetura-menores", title: "Arcanos Menores", subtitle: "A estrutura dos 56", icon: "🏛", order: 4, published: true, premium: true, lessonsCount: 14 },
  { id: "combinacoes", title: "Combinações", subtitle: "Leitura cruzada", icon: "🔗", order: 5, published: true, premium: true, lessonsCount: 8 },
  { id: "tiragens", title: "Tiragens", subtitle: "Métodos de leitura", icon: "🎴", order: 6, published: true, premium: true, lessonsCount: 6 },
  { id: "espiritualidade", title: "Tarô e Espiritualidade", subtitle: "Conexão profunda", icon: "🕯", order: 7, published: true, premium: true, lessonsCount: 6 },
  { id: "amor", title: "Tarô e Amor", subtitle: "Leituras afetivas", icon: "💜", order: 8, published: true, premium: true, lessonsCount: 6 },
  { id: "mesa-taro", title: "Mesa de Tarô", subtitle: "Como montar uma mesa real", icon: "🔮", order: 9, published: true, premium: true, lessonsCount: 5 },
  { id: "trabalhar-taro", title: "Trabalhar com Tarô", subtitle: "Profissionalização", icon: "💼", order: 10, published: true, premium: true, lessonsCount: 5 },
  { id: "leitura-aplicada", title: "Leitura Aplicada", subtitle: "Prática real", icon: "📋", order: 11, published: true, premium: true, lessonsCount: 6 },
  { id: "pratica", title: "Prática Guiada", subtitle: "Exercícios reais", icon: "✨", order: 12, published: true, premium: true, lessonsCount: 5 },
];

function ModulesTab() {
  const [modules, setModules] = useState<Module[]>(defaultModules);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleTogglePremium = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, premium: !m.premium } : m));
  };

  const handleTogglePublish = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, published: !m.published } : m));
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{modules.length} módulos · {modules.filter(m => m.premium).length} premium</p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5" onClick={() => setEditingModule({ id: "", title: "", subtitle: "", icon: "📖", order: modules.length + 1, published: false, premium: false, lessonsCount: 0 })}>
              <Plus className="w-3.5 h-3.5" /> Módulo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading">{editingModule?.id ? "Editar Módulo" : "Novo Módulo"}</DialogTitle>
            </DialogHeader>
            {editingModule && (
              <div className="space-y-4 mt-2">
                <Input placeholder="Título" value={editingModule.title} onChange={e => setEditingModule({ ...editingModule, title: e.target.value })} />
                <Input placeholder="Subtítulo" value={editingModule.subtitle} onChange={e => setEditingModule({ ...editingModule, subtitle: e.target.value })} />
                <div className="flex gap-3">
                  <Input placeholder="Ícone" value={editingModule.icon} onChange={e => setEditingModule({ ...editingModule, icon: e.target.value })} className="w-20" />
                  <Input type="number" placeholder="Ordem" value={editingModule.order} onChange={e => setEditingModule({ ...editingModule, order: Number(e.target.value) })} className="w-24" />
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

      <div className="space-y-1.5">
        {modules.sort((a, b) => a.order - b.order).map(mod => (
          <div key={mod.id} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors group">
            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 cursor-grab hidden sm:block" />
            <span className="text-base w-7 text-center">{mod.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-medium text-foreground truncate">{mod.title}</h3>
                {mod.premium && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Premium</span>}
              </div>
              <p className="text-[11px] text-muted-foreground">{mod.subtitle} · {mod.lessonsCount} lições</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleTogglePremium(mod.id)} title={mod.premium ? "Tornar gratuito" : "Tornar premium"}>
                <LockIcon className={`w-3 h-3 ${mod.premium ? "text-primary" : "text-muted-foreground"}`} />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleTogglePublish(mod.id)}>
                {mod.published ? <Eye className="w-3 h-3 text-primary" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setEditingModule(mod); setIsOpen(true); }}>
                <Edit className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════ ARCANOS TAB ═══════════ */

function ArcanosTab() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [editingId, setEditingId] = useState<number | null>(null);

  const filtered = ARCANOS_MAIORES.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "published" && a.unlocked) || (filter === "draft" && !a.unlocked);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar arcano..." className="pl-8 h-9 text-sm" />
        </div>
        <Select value={filter} onValueChange={v => setFilter(v as any)}>
          <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground">{ARCANOS_MAIORES.length} arcanos · {ARCANOS_MAIORES.filter(a => a.unlocked).length} publicados</p>

      <div className="grid gap-1.5">
        {filtered.map(arcano => (
          <div key={arcano.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors group">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-heading text-xs text-primary shrink-0">{arcano.numeral}</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground">{arcano.name}</h3>
              <p className="text-[11px] text-muted-foreground truncate">{arcano.subtitle}</p>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${arcano.unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {arcano.unlocked ? "Publicado" : "Rascunho"}
            </span>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100" onClick={() => setEditingId(arcano.id)}>
              <Edit className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={editingId !== null} onOpenChange={() => setEditingId(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Editar Arcano — {editingId !== null && ARCANOS_MAIORES.find(a => a.id === editingId)?.name}</DialogTitle>
          </DialogHeader>
          {editingId !== null && (() => {
            const arcano = ARCANOS_MAIORES.find(a => a.id === editingId);
            if (!arcano) return null;
            return (
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-muted-foreground mb-1 block">Nome</label><Input defaultValue={arcano.name} /></div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">Numeral</label><Input defaultValue={arcano.numeral} /></div>
                </div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Subtítulo</label><Input defaultValue={arcano.subtitle} /></div>
                <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">💡 Para editar conteúdo completo (lições, deep dive, quiz), edite os arquivos em <code>src/data/arcanos/</code></div>
                <Button className="w-full">Salvar Alterações</Button>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ═══════════ ACCESS TAB ═══════════ */

interface AccessItem {
  id: string;
  name: string;
  type: "module" | "feature";
  premium: boolean;
  visible: boolean;
}

const defaultAccess: AccessItem[] = [
  { id: "m1", name: "Fundamentos do Tarô", type: "module", premium: false, visible: true },
  { id: "m2", name: "Arcanos Maiores", type: "module", premium: false, visible: true },
  { id: "m3", name: "Leitura Simbólica", type: "module", premium: false, visible: true },
  { id: "m4", name: "Combinações", type: "module", premium: true, visible: true },
  { id: "m5", name: "Tiragens", type: "module", premium: true, visible: true },
  { id: "m6", name: "Tarô e Espiritualidade", type: "module", premium: true, visible: true },
  { id: "m7", name: "Tarô e Amor", type: "module", premium: true, visible: true },
  { id: "m8", name: "Mesa de Tarô", type: "module", premium: true, visible: true },
  { id: "m9", name: "Trabalhar com Tarô", type: "module", premium: true, visible: true },
  { id: "m10", name: "Leitura Aplicada", type: "module", premium: true, visible: true },
  { id: "m11", name: "Prática Guiada", type: "module", premium: true, visible: true },
  { id: "f1", name: "Jornada do Louco", type: "feature", premium: false, visible: true },
  { id: "f2", name: "Biblioteca de Símbolos", type: "feature", premium: false, visible: true },
  { id: "f3", name: "Desafios Diários", type: "feature", premium: false, visible: true },
  { id: "f4", name: "Certificados", type: "feature", premium: true, visible: true },
  { id: "f5", name: "Rotina de Estudo", type: "feature", premium: true, visible: true },
];

function AccessTab() {
  const [items, setItems] = useState<AccessItem[]>(defaultAccess);

  const togglePremium = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, premium: !i.premium } : i));
  const toggleVisible = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, visible: !i.visible } : i));

  return (
    <div className="space-y-6">
      {(["module", "feature"] as const).map(type => (
        <div key={type}>
          <h3 className="font-heading text-xs tracking-[0.15em] uppercase text-muted-foreground/60 mb-2">
            {type === "module" ? "Módulos" : "Funcionalidades"}
          </h3>
          <div className="space-y-1">
            {items.filter(i => i.type === type).map(item => (
              <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/50 bg-card/50">
                <span className="text-sm text-foreground flex-1">{item.name}</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">Premium</span>
                    <Switch checked={item.premium} onCheckedChange={() => togglePremium(item.id)} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">Visível</span>
                    <Switch checked={item.visible} onCheckedChange={() => toggleVisible(item.id)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="p-3 rounded-xl border border-primary/20 bg-primary/5">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Regra:</strong> FREE_ARCANO_IDS = [0]. Apenas O Louco e Fundamentos são gratuitos. Todo o restante requer assinatura ativa.
        </p>
      </div>
    </div>
  );
}

/* ═══════════ MAIN COMPONENT ═══════════ */

const AdminContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg text-foreground">Conteúdo do Curso</h2>
        <p className="text-sm text-muted-foreground">Módulos, arcanos, acesso gratuito/premium e ordem da jornada.</p>
      </div>

      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="modules" className="gap-1.5 text-xs"><Layers className="w-3 h-3" /> Módulos</TabsTrigger>
          <TabsTrigger value="arcanos" className="gap-1.5 text-xs"><Star className="w-3 h-3" /> Arcanos</TabsTrigger>
          <TabsTrigger value="access" className="gap-1.5 text-xs"><Lock className="w-3 h-3" /> Acesso</TabsTrigger>
        </TabsList>

        <TabsContent value="modules"><ModulesTab /></TabsContent>
        <TabsContent value="arcanos"><ArcanosTab /></TabsContent>
        <TabsContent value="access"><AccessTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;

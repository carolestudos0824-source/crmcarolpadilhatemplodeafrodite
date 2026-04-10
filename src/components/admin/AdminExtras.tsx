import { useState } from "react";
import { Plus, Edit, Trash2, FileText, Video, Headphones, Link, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExtraMaterial {
  id: string;
  title: string;
  type: "text" | "video" | "audio" | "pdf" | "link";
  description: string;
  category: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  text: <FileText className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  audio: <Headphones className="w-4 h-4" />,
  pdf: <BookOpen className="w-4 h-4" />,
  link: <Link className="w-4 h-4" />,
};

const sampleExtras: ExtraMaterial[] = [
  { id: "e1", title: "Guia de Meditação com Tarô", type: "pdf", description: "PDF com técnicas de meditação usando arcanos.", category: "Prática" },
  { id: "e2", title: "Simbolismo das Cores", type: "text", description: "Significado das cores no Rider-Waite-Smith.", category: "Simbolismo" },
];

const AdminExtras = () => {
  const [extras, setExtras] = useState<ExtraMaterial[]>(sampleExtras);
  const [editing, setEditing] = useState<ExtraMaterial | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (!editing) return;
    setExtras(prev => {
      const exists = prev.find(e => e.id === editing.id);
      if (exists) return prev.map(e => e.id === editing.id ? editing : e);
      return [...prev, editing];
    });
    setEditing(null);
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-lg text-foreground">Materiais Extras</h2>
          <p className="text-sm text-muted-foreground">{extras.length} materiais cadastrados</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => { setEditing({ id: `e${Date.now()}`, title: "", type: "text", description: "", category: "" }); setIsOpen(true); }}>
          <Plus className="w-4 h-4" /> Novo Material
        </Button>
      </div>

      <div className="space-y-2">
        {extras.map(ex => (
          <div key={ex.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors group">
            <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary/60">
              {typeIcons[ex.type]}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground">{ex.title}</h3>
              <p className="text-xs text-muted-foreground">{ex.category} · {ex.type.toUpperCase()}</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setEditing(ex); setIsOpen(true); }}>
                <Edit className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => setExtras(prev => prev.filter(e => e.id !== ex.id))}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Material Extra</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Título</label>
                <Input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Tipo</label>
                <Select value={editing.type} onValueChange={v => setEditing({ ...editing, type: v as ExtraMaterial["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="audio">Áudio</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Descrição</label>
                <Textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Categoria</label>
                <Input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} placeholder="Ex: Simbolismo, Prática" />
              </div>
              <Button onClick={handleSave} className="w-full">Salvar</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminExtras;

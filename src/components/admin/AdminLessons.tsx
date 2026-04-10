import { useState } from "react";
import { Plus, Edit, Search, BookOpen, Layers, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Lesson {
  id: string;
  module: string;
  title: string;
  order: number;
  hasDeepDive: boolean;
  hasExercise: boolean;
  hasQuiz: boolean;
  published: boolean;
}

const sampleLessons: Lesson[] = [
  { id: "f1", module: "fundamentos", title: "O que é o Tarô?", order: 1, hasDeepDive: true, hasExercise: true, hasQuiz: true, published: true },
  { id: "f2", module: "fundamentos", title: "Estrutura do Baralho", order: 2, hasDeepDive: true, hasExercise: true, hasQuiz: true, published: true },
  { id: "f3", module: "fundamentos", title: "Como o Tarô fala", order: 3, hasDeepDive: true, hasExercise: true, hasQuiz: true, published: true },
  { id: "am1", module: "arcanos-maiores", title: "O Louco", order: 1, hasDeepDive: true, hasExercise: true, hasQuiz: true, published: true },
  { id: "am2", module: "arcanos-maiores", title: "O Mago", order: 2, hasDeepDive: true, hasExercise: true, hasQuiz: true, published: true },
  { id: "comb1", module: "combinacoes", title: "Princípios de Combinação", order: 1, hasDeepDive: true, hasExercise: true, hasQuiz: true, published: true },
  { id: "tir1", module: "tiragens", title: "Cruz Celta", order: 1, hasDeepDive: true, hasExercise: true, hasQuiz: true, published: true },
];

const modules = [
  { id: "all", label: "Todos os módulos" },
  { id: "fundamentos", label: "Fundamentos" },
  { id: "arcanos-maiores", label: "Arcanos Maiores" },
  { id: "copas", label: "Copas" },
  { id: "ouros", label: "Ouros" },
  { id: "espadas", label: "Espadas" },
  { id: "paus", label: "Paus" },
  { id: "combinacoes", label: "Combinações" },
  { id: "tiragens", label: "Tiragens" },
  { id: "amor", label: "Amor" },
  { id: "pratica", label: "Prática" },
];

const AdminLessons = () => {
  const [lessons, setLessons] = useState<Lesson[]>(sampleLessons);
  const [selectedModule, setSelectedModule] = useState("all");
  const [search, setSearch] = useState("");
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const filtered = lessons.filter(l => {
    const matchModule = selectedModule === "all" || l.module === selectedModule;
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase());
    return matchModule && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-lg text-foreground">Lições</h2>
          <p className="text-sm text-muted-foreground">{lessons.length} lições cadastradas</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Nova Lição
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar lição..." className="pl-9" />
        </div>
        <Select value={selectedModule} onValueChange={setSelectedModule}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {modules.map(m => (
              <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filtered.map(lesson => (
          <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors group">
            <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-xs font-medium text-muted-foreground">
              {lesson.order}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground">{lesson.title}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-muted-foreground capitalize">{lesson.module.replace("-", " ")}</span>
                <span className="text-muted-foreground/30">·</span>
                <div className="flex gap-1">
                  {lesson.hasDeepDive && <span className="text-[9px] px-1 rounded bg-muted text-muted-foreground">Deep Dive</span>}
                  {lesson.hasExercise && <span className="text-[9px] px-1 rounded bg-muted text-muted-foreground">Exercício</span>}
                  {lesson.hasQuiz && <span className="text-[9px] px-1 rounded bg-muted text-muted-foreground">Quiz</span>}
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setEditingLesson(lesson)}
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">Nenhuma lição encontrada.</div>
        )}
      </div>

      <Dialog open={!!editingLesson} onOpenChange={() => setEditingLesson(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Editar Lição</DialogTitle>
          </DialogHeader>
          {editingLesson && (
            <Tabs defaultValue="content" className="mt-2">
              <TabsList className="w-full">
                <TabsTrigger value="content" className="flex-1">Conteúdo Principal</TabsTrigger>
                <TabsTrigger value="deepdive" className="flex-1">Deep Dive</TabsTrigger>
                <TabsTrigger value="exercise" className="flex-1">Exercício</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Título</label>
                  <Input defaultValue={editingLesson.title} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Módulo</label>
                  <Select defaultValue={editingLesson.module}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {modules.filter(m => m.id !== "all").map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Essência</label>
                  <Textarea rows={3} placeholder="Conteúdo principal da lição..." />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Luz / Aspectos Positivos</label>
                  <Textarea rows={2} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Sombra / Aspectos Desafiadores</label>
                  <Textarea rows={2} />
                </div>
              </TabsContent>
              <TabsContent value="deepdive" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Habilitar Deep Dive</span>
                  <Switch defaultChecked={editingLesson.hasDeepDive} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Texto do Deep Dive</label>
                  <Textarea rows={5} placeholder="Conteúdo aprofundado opcional..." />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Simbolismo</label>
                  <Textarea rows={3} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Cabala</label>
                  <Textarea rows={3} />
                </div>
              </TabsContent>
              <TabsContent value="exercise" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Habilitar Exercício</span>
                  <Switch defaultChecked={editingLesson.hasExercise} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Instrução</label>
                  <Textarea rows={3} placeholder="O que a aluna deve fazer..." />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Tipo</label>
                  <Select defaultValue="reflection">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reflection">Reflexão</SelectItem>
                      <SelectItem value="practice">Prática</SelectItem>
                      <SelectItem value="observation">Observação</SelectItem>
                      <SelectItem value="writing">Escrita</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <div className="mt-4">
                <Button className="w-full">Salvar Lição</Button>
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLessons;

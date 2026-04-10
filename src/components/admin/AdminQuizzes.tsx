import { useState } from "react";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuizQuestion {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const sampleQuestions: QuizQuestion[] = [
  { id: "q1", lessonId: "f1", question: "Quantas cartas possui um baralho de Tarô completo?", options: ["52", "78", "56", "22"], correctIndex: 1, explanation: "Um baralho completo de Tarô possui 78 cartas." },
  { id: "q2", lessonId: "f1", question: "Quantos Arcanos Maiores existem?", options: ["12", "22", "56", "78"], correctIndex: 1, explanation: "Existem 22 Arcanos Maiores." },
  { id: "q3", lessonId: "f2", question: "Qual naipe está associado ao elemento Água?", options: ["Paus", "Espadas", "Copas", "Ouros"], correctIndex: 2, explanation: "Copas é o naipe da Água." },
];

const AdminQuizzes = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(sampleQuestions);
  const [editingQ, setEditingQ] = useState<QuizQuestion | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const newQuestion = (): QuizQuestion => ({
    id: `q${Date.now()}`,
    lessonId: "",
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: "",
  });

  const handleSave = () => {
    if (!editingQ) return;
    setQuestions(prev => {
      const exists = prev.find(q => q.id === editingQ.id);
      if (exists) return prev.map(q => q.id === editingQ.id ? editingQ : q);
      return [...prev, editingQ];
    });
    setEditingQ(null);
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-lg text-foreground">Quizzes</h2>
          <p className="text-sm text-muted-foreground">{questions.length} perguntas cadastradas</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => { setEditingQ(newQuestion()); setIsOpen(true); }}>
          <Plus className="w-4 h-4" /> Nova Pergunta
        </Button>
      </div>

      <div className="space-y-2">
        {questions.map((q, i) => (
          <div key={q.id} className="p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors group">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{q.question}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {q.options.map((opt, oi) => (
                    <span key={oi} className={`text-[11px] px-2 py-0.5 rounded-full ${
                      oi === q.correctIndex 
                        ? "bg-primary/10 text-primary" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {oi === q.correctIndex && <Check className="w-2.5 h-2.5 inline mr-0.5" />}
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setEditingQ(q); setIsOpen(true); }}>
                  <Edit className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => handleDelete(q.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingQ?.question ? "Editar Pergunta" : "Nova Pergunta"}
            </DialogTitle>
          </DialogHeader>
          {editingQ && (
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Pergunta</label>
                <Textarea value={editingQ.question} onChange={e => setEditingQ({ ...editingQ, question: e.target.value })} rows={2} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground block">Opções (clique para marcar a correta)</label>
                {editingQ.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingQ({ ...editingQ, correctIndex: i })}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        i === editingQ.correctIndex 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-border"
                      }`}
                    >
                      {i === editingQ.correctIndex && <Check className="w-3 h-3" />}
                    </button>
                    <Input 
                      value={opt} 
                      onChange={e => {
                        const newOpts = [...editingQ.options];
                        newOpts[i] = e.target.value;
                        setEditingQ({ ...editingQ, options: newOpts });
                      }}
                      placeholder={`Opção ${i + 1}`}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Explicação</label>
                <Textarea value={editingQ.explanation} onChange={e => setEditingQ({ ...editingQ, explanation: e.target.value })} rows={2} />
              </div>
              <Button onClick={handleSave} className="w-full">Salvar</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminQuizzes;

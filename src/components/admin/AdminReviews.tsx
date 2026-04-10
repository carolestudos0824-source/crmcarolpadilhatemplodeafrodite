import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ReviewCard {
  id: string;
  front: string;
  back: string;
  category: string;
}

const sampleReviews: ReviewCard[] = [
  { id: "r1", front: "O Louco", back: "Novos começos, liberdade, inocência. Número 0. Elemento: Ar.", category: "Arcanos Maiores" },
  { id: "r2", front: "O Mago", back: "Habilidade, poder pessoal, manifestação. Número I. Planeta: Mercúrio.", category: "Arcanos Maiores" },
  { id: "r3", front: "Naipe de Copas", back: "Elemento Água. Emoções, relacionamentos, intuição, criatividade.", category: "Arcanos Menores" },
];

const AdminReviews = () => {
  const [cards, setCards] = useState<ReviewCard[]>(sampleReviews);
  const [editingCard, setEditingCard] = useState<ReviewCard | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (!editingCard) return;
    setCards(prev => {
      const exists = prev.find(c => c.id === editingCard.id);
      if (exists) return prev.map(c => c.id === editingCard.id ? editingCard : c);
      return [...prev, editingCard];
    });
    setEditingCard(null);
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-lg text-foreground">Revisões Rápidas</h2>
          <p className="text-sm text-muted-foreground">{cards.length} cartões de revisão</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => { setEditingCard({ id: `r${Date.now()}`, front: "", back: "", category: "" }); setIsOpen(true); }}>
          <Plus className="w-4 h-4" /> Novo Cartão
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cards.map(card => (
          <div key={card.id} className="p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors group">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{card.category}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setEditingCard(card); setIsOpen(true); }}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => setCards(prev => prev.filter(c => c.id !== card.id))}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">{card.front}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{card.back}</p>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Cartão de Revisão</DialogTitle>
          </DialogHeader>
          {editingCard && (
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Frente (pergunta/conceito)</label>
                <Input value={editingCard.front} onChange={e => setEditingCard({ ...editingCard, front: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Verso (resposta)</label>
                <Textarea value={editingCard.back} onChange={e => setEditingCard({ ...editingCard, back: e.target.value })} rows={3} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Categoria</label>
                <Input value={editingCard.category} onChange={e => setEditingCard({ ...editingCard, category: e.target.value })} placeholder="Ex: Arcanos Maiores" />
              </div>
              <Button onClick={handleSave} className="w-full">Salvar</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReviews;

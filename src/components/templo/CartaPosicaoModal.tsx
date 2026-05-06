import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CartaPosicaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  posicaoNome: string;
  onConfirm: (dados: any) => void;
  initialData?: any;
}

export function CartaPosicaoModal({ isOpen, onClose, posicaoNome, onConfirm, initialData }: CartaPosicaoModalProps) {
  const [carta, setCarta] = useState(initialData?.carta || "");
  const [tipo, setTipo] = useState<"Arcano Maior" | "Arcano Menor">(initialData?.tipo || "Arcano Maior");
  const [naipe, setNaipe] = useState<"Copas" | "Ouros" | "Espadas" | "Paus" | undefined>(initialData?.naipe);
  const [orientacao, setOrientacao] = useState<"Normal" | "Invertida">(initialData?.orientacao || "Normal");
  const [observacao, setObservacao] = useState(initialData?.observacao || "");

  const { data: catalog } = useQuery({
    queryKey: ["tarot-catalog", carta],
    queryFn: async () => {
      if (carta.length < 2) return [];
      const { data } = await supabase.from("tarot_content").select("name").ilike("name", `%${carta}%`).limit(5);
      return data || [];
    },
    enabled: carta.length >= 2
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-templo-black border-templo-gold/20 text-templo-ivory max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-templo-gold italic">{posicaoNome}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">Nome da Carta</label>
            <div className="relative">
              <Input 
                value={carta}
                onChange={e => setCarta(e.target.value)}
                className="bg-white/5 border-templo-gold/20"
                placeholder="Ex: O Louco, Ás de Copas..."
              />
              {catalog && catalog.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-templo-black border border-templo-gold/20 mt-1 rounded-xl overflow-hidden z-50">
                  {catalog.map(c => (
                    <button 
                      key={c.name}
                      onClick={() => { setCarta(c.name); }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-templo-gold/10 transition-colors"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">Tipo</label>
              <select 
                value={tipo}
                onChange={e => setTipo(e.target.value as any)}
                className="w-full bg-white/5 border border-templo-gold/20 rounded-lg h-10 px-3 text-xs outline-none"
              >
                <option value="Arcano Maior">Arcano Maior</option>
                <option value="Arcano Menor">Arcano Menor</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">Orientação</label>
              <select 
                value={orientacao}
                onChange={e => setOrientacao(e.target.value as any)}
                className="w-full bg-white/5 border border-templo-gold/20 rounded-lg h-10 px-3 text-xs outline-none"
              >
                <option value="Normal">Normal</option>
                <option value="Invertida">Invertida</option>
              </select>
            </div>
          </div>

          {tipo === "Arcano Menor" && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">Naipe</label>
              <div className="flex gap-2">
                {["Copas", "Ouros", "Espadas", "Paus"].map(n => (
                  <button 
                    key={n}
                    onClick={() => setNaipe(n as any)}
                    className={`flex-1 h-9 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${
                      naipe === n ? "bg-templo-gold/20 border-templo-gold text-templo-gold" : "bg-white/5 border-white/5 text-white/40"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">Nota da Carol (Manual)</label>
            <Textarea 
              value={observacao}
              onChange={e => setObservacao(e.target.value)}
              className="bg-white/5 border-templo-gold/20 text-xs"
              placeholder="Ex: Carta saiu voando, sinto energia forte..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-templo-ivory/40">CANCELAR</Button>
          <Button 
            disabled={!carta}
            onClick={() => onConfirm({ carta, tipo, naipe, orientacao, observacao })}
            className="bg-templo-red hover:bg-templo-red/90 font-bold"
          >
            CONFIRMAR CARTA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

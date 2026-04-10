import { useState } from "react";
import { Lock, Unlock, Crown, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface AccessItem {
  id: string;
  name: string;
  type: "module" | "lesson" | "feature";
  premium: boolean;
  unlocked: boolean;
}

const defaultItems: AccessItem[] = [
  { id: "m1", name: "Fundamentos do Tarô", type: "module", premium: false, unlocked: true },
  { id: "m2", name: "Arcanos Maiores", type: "module", premium: false, unlocked: true },
  { id: "m3", name: "Naipe de Copas", type: "module", premium: false, unlocked: true },
  { id: "m4", name: "Naipe de Ouros", type: "module", premium: false, unlocked: true },
  { id: "m5", name: "Naipe de Espadas", type: "module", premium: false, unlocked: true },
  { id: "m6", name: "Naipe de Paus", type: "module", premium: false, unlocked: true },
  { id: "m7", name: "Combinações", type: "module", premium: true, unlocked: true },
  { id: "m8", name: "Tiragens", type: "module", premium: true, unlocked: true },
  { id: "m9", name: "Tarô e Amor", type: "module", premium: true, unlocked: true },
  { id: "m10", name: "Prática Guiada", type: "module", premium: true, unlocked: true },
  { id: "f1", name: "Jornada do Louco", type: "feature", premium: false, unlocked: true },
  { id: "f2", name: "Biblioteca de Símbolos", type: "feature", premium: false, unlocked: true },
  { id: "f3", name: "Desafios Diários", type: "feature", premium: false, unlocked: true },
  { id: "f4", name: "Certificados", type: "feature", premium: true, unlocked: true },
  { id: "f5", name: "Rotina de Estudo", type: "feature", premium: true, unlocked: true },
];

const AdminAccess = () => {
  const [items, setItems] = useState<AccessItem[]>(defaultItems);

  const togglePremium = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, premium: !i.premium } : i));
  };

  const toggleUnlocked = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, unlocked: !i.unlocked } : i));
  };

  const groupedByType = {
    module: items.filter(i => i.type === "module"),
    feature: items.filter(i => i.type === "feature"),
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-lg text-foreground">Acesso & Premium</h2>
        <p className="text-sm text-muted-foreground">Controle quais conteúdos são gratuitos e quais são premium.</p>
      </div>

      {(["module", "feature"] as const).map(type => (
        <div key={type}>
          <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-3">
            {type === "module" ? "Módulos" : "Funcionalidades"}
          </h3>
          <div className="space-y-1">
            {groupedByType[type].map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{item.name}</span>
                    {item.premium && (
                      <Crown className="w-3.5 h-3.5 text-primary" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">Premium</span>
                    <Switch checked={item.premium} onCheckedChange={() => togglePremium(item.id)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">Visível</span>
                    <Switch checked={item.unlocked} onCheckedChange={() => toggleUnlocked(item.id)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
        <p className="text-sm text-foreground font-medium mb-1">💡 Sobre Premium</p>
        <p className="text-xs text-muted-foreground">
          Conteúdos marcados como Premium só serão acessíveis por alunas com assinatura ativa.
          Conteúdos não visíveis ficam ocultos de toda a plataforma.
        </p>
      </div>
    </div>
  );
};

export default AdminAccess;

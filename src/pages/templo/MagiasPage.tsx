import { Sparkles, Info, Heart, Shield, Flame, Wind, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

const magias = [
  { name: "Adoçamento Amoroso", icon: Heart, color: "text-[#A61E25]", intensity: "Moderada", objective: "Suavizar tensões e abrir o coração do parceiro.", when: "Relações frias ou após discussões." },
  { name: "Harmonização Amorosa", icon: Sparkles, color: "text-[#C9A35A]", intensity: "Suave", objective: "Equilibrar as energias do casal.", when: "Manutenção de relações estáveis." },
  { name: "Limpeza Energética Amorosa", icon: Droplets, color: "text-blue-500", intensity: "Alta", objective: "Remover miasmas e energias negativas.", when: "Cargas pesadas ou inveja externa." },
  { name: "Abertura de Diálogo", icon: Wind, color: "text-[#C9A35A]", intensity: "Focalizada", objective: "Destravar a comunicação e o entendimento.", when: "Bloqueios ou silêncios prolongados." },
  { name: "Proteção Espiritual", icon: Shield, color: "text-[#111111]", intensity: "Contínua", objective: "Blindar o casal contra influências externas.", when: "Sempre recomendada como base." },
  { name: "Corte de Influência Externa", icon: Flame, color: "text-orange-500", intensity: "Drástica", objective: "Romper laços com terceiras pessoas ou obsessores.", when: "Traições ou interferência familiar." },
];

export function MagiasPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header>
        <h1 className="text-3xl font-bold text-[#111111] font-display">Magias Indicadas</h1>
        <p className="text-[#111111]/60 font-medium">Catálogo de rituais e orientações espirituais.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {magias.map((magia, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6 flex flex-col hover:border-[#C9A35A]/40 transition-all group">
            <div className="flex justify-between items-start">
              <div className={`w-14 h-14 rounded-2xl bg-[#F4F0EA] flex items-center justify-center ${magia.color} border border-[#C9A35A]/10`}>
                <magia.icon className="w-8 h-8" />
              </div>
              <div className="text-[10px] bg-[#ECE5DC] px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[#111111]/60 border border-[#C9A35A]/20">
                {magia.intensity}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#111111] leading-tight">{magia.name}</h3>
              <p className="text-sm text-[#111111]/70 font-medium leading-relaxed">{magia.objective}</p>
            </div>

            <div className="bg-[#F4F0EA] p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#C9A35A]">
                <Info className="w-3 h-3" />
                Quando Indicar
              </div>
              <p className="text-xs text-[#111111]/60 font-medium">{magia.when}</p>
            </div>

            <Button variant="ghost" className="w-full mt-auto rounded-xl font-bold text-[#A61E25] hover:bg-[#A61E25]/5 border border-transparent hover:border-[#A61E25]/20 gap-2">
              VER ORIENTAÇÃO COMPLETA
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
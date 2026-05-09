import { Sparkles, Info, Heart, Shield, Flame, Wind, Droplets, Clock, CheckCircle2, ChevronRight, Plus, Search, Tag, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
import { storage } from "@/lib/storage";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const catalog = [
  { name: "Adoçamento Amoroso", icon: Heart, color: "text-[#A61E25]", category: "Amor", intensity: "Moderada", objective: "Suavizar tensões e abrir o coração do parceiro.", when: "Relações frias ou após discussões.", price: "500,00" },
  { name: "Harmonização Amorosa", icon: Sparkles, color: "text-[#C9A35A]", category: "Harmonização", intensity: "Suave", objective: "Equilibrar as energias do casal.", when: "Manutenção de relações estáveis.", price: "500,00" },
  { name: "Limpeza Energética", icon: Droplets, color: "text-[#C9A35A]", category: "Limpeza", intensity: "Alta", objective: "Remover miasmas e energias negativas.", when: "Cargas pesadas ou inveja externa.", price: "500,00" },
  { name: "Abertura de Diálogo", icon: Wind, color: "text-[#C9A35A]", category: "Amor", intensity: "Focalizada", objective: "Destravar a comunicação e o entendimento.", when: "Bloqueios ou silêncios prolongados.", price: "500,00" },
  { name: "Proteção Espiritual", icon: Shield, color: "text-[#111111]", category: "Proteção", intensity: "Contínua", objective: "Blindar o casal contra influências externas.", when: "Sempre recomendada como base.", price: "500,00" },
  { name: "Corte de Influência", icon: Flame, color: "text-[#A61E25]", category: "Corte", intensity: "Drástica", objective: "Romper laços com terceiras pessoas.", when: "Traições ou interferência familiar.", price: "600,00" },
];

export function MagiasPage() {
  const activeMagias = useMemo(() => storage.getMagias(), []);
  const allClients = useMemo(() => storage.getClients(), []);
  const [searchTerm, setSearchTerm] = useState("");

  const getClientName = (id: string) => allClients.find(c => c.id === id)?.nome || "Desconhecida";

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-display italic text-[#111111]">Gestão de Magias</h1>
          <p className="text-[#C9A35A] uppercase tracking-[0.3em] text-[10px] font-bold mt-1">Catálogo e Acompanhamento</p>
        </div>
      </header>

      <Tabs defaultValue="catalogo" className="w-full">
        <TabsList className="bg-[#EBE5DB]/50 p-1 rounded-2xl h-auto flex-wrap justify-start gap-1">
          <TabsTrigger value="catalogo" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#111111] data-[state=active]:text-white uppercase tracking-widest text-[10px] font-bold transition-all">Catálogo</TabsTrigger>
          <TabsTrigger value="ativas" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#111111] data-[state=active]:text-white uppercase tracking-widest text-[10px] font-bold transition-all">Magias Ativas ({activeMagias.filter(m => m.statusExecucao !== 'Finalizada').length})</TabsTrigger>
          <TabsTrigger value="indicadas" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#111111] data-[state=active]:text-white uppercase tracking-widest text-[10px] font-bold transition-all">Indicadas</TabsTrigger>
        </TabsList>

        <TabsContent value="catalogo" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalog.map((magia, i) => (
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
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-[#C9A35A] tracking-widest">
                     <Tag className="w-3 h-3" /> {magia.category}
                  </div>
                  <p className="text-sm text-[#111111]/70 font-medium leading-relaxed">{magia.objective}</p>
                </div>

                <div className="bg-[#F4F0EA] p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#C9A35A]">
                    <Info className="w-3.5 h-3.5" /> Quando Indicar
                  </div>
                  <p className="text-xs text-[#111111]/60 font-medium italic">“{magia.when}”</p>
                  <div className="pt-2 border-t border-[#C9A35A]/10 flex items-center justify-between">
                     <span className="text-[10px] font-bold uppercase text-[#111111]/40">Investimento</span>
                     <span className="text-sm font-bold text-[#111111]">R$ {magia.price}</span>
                  </div>
                </div>

                <Button variant="ghost" className="w-full mt-auto rounded-xl font-bold text-[#A61E25] hover:bg-[#A61E25]/5 border border-transparent hover:border-[#A61E25]/20 gap-2 uppercase text-[10px] tracking-widest">
                  VER ORIENTAÇÃO COMPLETA
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ativas" className="mt-8">
           <div className="space-y-4">
              {activeMagias.length > 0 ? (
                activeMagias.map((m) => (
                  <div key={m.id} className="bg-white p-6 rounded-[2rem] border border-[#C9A35A]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#A61E25]/30 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-[#F4F0EA] flex items-center justify-center text-[#A61E25] border border-[#C9A35A]/10 shadow-inner">
                         <Sparkles className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#111111] text-lg">{m.nomeMagia}</h3>
                        <p className="text-xs font-bold text-[#C9A35A] uppercase tracking-widest flex items-center gap-2">
                           {getClientName(m.clientId)} • {m.statusExecucao}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                           <span className="text-[10px] text-[#111111]/30 font-medium">Contratada em: {new Date(m.dataContratacao).toLocaleDateString()}</span>
                           <span className={cn(
                             "text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border",
                             m.statusPagamento === 'Pago' ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                           )}>{m.statusPagamento}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <Button variant="outline" className="rounded-xl border-[#C9A35A]/20 h-11 text-[10px] font-bold uppercase px-6">Atualizar Status</Button>
                       <Link to={`/templo/clientes/${m.clientId}`}>
                          <Button variant="ghost" size="icon" className="rounded-xl border border-[#F4F0EA] text-[#111111]/20 hover:text-[#A61E25]">
                             <ChevronRight className="w-5 h-5" />
                          </Button>
                       </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/50 p-20 rounded-[3rem] border border-dashed border-[#C9A35A]/20 text-center space-y-4">
                   <Clock className="w-12 h-12 text-[#C9A35A]/30 mx-auto" />
                   <p className="text-[#111111] font-bold">Nenhuma magia ativa em acompanhamento.</p>
                </div>
              )}
           </div>
        </TabsContent>

        <TabsContent value="indicadas" className="mt-8">
           <div className="bg-white/50 p-20 rounded-[3rem] border border-dashed border-[#C9A35A]/20 text-center space-y-4">
              <Sparkles className="w-12 h-12 text-[#C9A35A]/30 mx-auto" />
              <p className="text-[#111111] font-bold">Consulte o histórico das clientes para ver magias sugeridas.</p>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { storage, Client } from "@/lib/storage";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Clock, TrendingUp, AlertCircle, Zap, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stages = [
  "Nova cliente", "Pediu informação", "Consulta marcada", "Consulta feita", 
  "Magia indicada", "Magia oferecida", "Magia contratada", "Em acompanhamento", "Finalizada"
];

export function PipelinePage() {
  const allClients = useMemo(() => storage.getClients(), []);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = useMemo(() => {
    return allClients.filter(c => c.nome.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allClients, searchTerm]);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-display italic text-[#111111]">Pipeline Comercial</h1>
          <p className="text-[#C9A35A] uppercase tracking-[0.3em] text-[10px] font-bold mt-1">Gestão de Fluxo e Oportunidades</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A35A]" />
          <input 
            type="text" 
            placeholder="Buscar cliente no funil..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-white border border-[#C9A35A]/20 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61E25]"
          />
        </div>
      </header>

      <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
        {stages.map((stage) => {
          const clientsInStage = filteredClients.filter(c => c.statusComercial === stage);
          return (
            <div key={stage} className="flex-shrink-0 w-80 space-y-4 snap-start">
              <div className="flex items-center justify-between bg-[#ECE5DC] p-4 rounded-2xl border border-[#C9A35A]/10">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#111111]">{stage}</h3>
                <span className="bg-white px-2 py-0.5 rounded-full text-[9px] font-bold text-[#A61E25] border border-[#A61E25]/10">
                  {clientsInStage.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[50vh] bg-[#F4F0EA]/50 rounded-[2rem] border border-dashed border-[#C9A35A]/20 p-2">
                {clientsInStage.length > 0 ? (
                  clientsInStage.map((client) => (
                    <Link 
                      key={client.id} 
                      to={`/templo/clientes/${client.id}`}
                      className="block bg-white p-5 rounded-2xl border border-[#C9A35A]/10 shadow-sm hover:border-[#A61E25]/30 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={cn(
                          "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                          client.temperatura === 'Quente' ? "bg-[#A61E25] text-white" : "bg-[#C9A35A]/20 text-[#C9A35A]"
                        )}>
                          {client.temperatura || 'Morna'}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#F4F0EA] flex items-center justify-center text-[10px] font-bold italic border border-[#C9A35A]/10 text-[#111111]">
                          {client.nome[0]}
                        </div>
                      </div>
                      <h4 className="font-bold text-[#111111] text-sm group-hover:text-[#A61E25] transition-colors truncate">{client.nome}</h4>
                      <p className="text-[10px] text-[#111111]/40 mt-1 line-clamp-1">{client.situacaoPrincipal}</p>
                      
                      <div className="mt-4 pt-3 border-t border-[#F4F0EA] flex items-center justify-between">
                         <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#111111]/30">
                            <Clock className="w-3 h-3" />
                            {new Date(client.updatedAt).toLocaleDateString()}
                         </div>
                         <ChevronRight className="w-4 h-4 text-[#C9A35A]/30 group-hover:text-[#A61E25]" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-[9px] uppercase tracking-widest text-[#111111]/20 font-bold">Vazio</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { storage, FollowUp, Client } from "@/lib/storage";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Clock, Calendar, CheckCircle2, AlertCircle, MessageCircle, 
  ChevronRight, Copy, Filter, Plus, Trash2 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function FollowUpsPage() {
  const allFollowUps = useMemo(() => storage.getFollowUps(), []);
  const allClients = useMemo(() => storage.getClients(), []);
  const [filter, setFilter] = useState<'Hoje' | 'Amanhã' | 'Esta semana' | 'Atrasados' | 'Todos'>('Hoje');

  const getClientName = (id: string) => allClients.find(c => c.id === id)?.nome || "Cliente Removida";

  const filteredList = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);

    return allFollowUps.filter(f => {
      const fDate = new Date(f.data);
      fDate.setHours(0, 0, 0, 0);

      if (filter === 'Hoje') return fDate.getTime() === today.getTime() && f.status === 'Pendente';
      if (filter === 'Amanhã') return fDate.getTime() === tomorrow.getTime() && f.status === 'Pendente';
      if (filter === 'Esta semana') return fDate >= today && fDate <= weekEnd && f.status === 'Pendente';
      if (filter === 'Atrasados') return fDate < today && f.status === 'Pendente';
      return true;
    }).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }, [allFollowUps, filter]);

  const toggleStatus = (id: string) => {
    const item = allFollowUps.find(f => f.id === id);
    if (item) {
      storage.saveFollowUp({ ...item, status: item.status === 'Feito' ? 'Pendente' : 'Feito' });
      toast({ title: "Status atualizado!", description: "Acompanhamento marcado como concluído." });
      window.location.reload(); // Refresh to show changes
    }
  };

  const copyMessage = (f: FollowUp) => {
    const client = allClients.find(c => c.id === f.clientId);
    const nome = client?.nome || "querida";
    const text = `Oi ${nome}, passando para saber como você está depois da nossa leitura e se houve algum movimento desde o atendimento.`;
    navigator.clipboard.writeText(text);
    toast({ title: "Mensagem copiada!", description: "Pronto para colar no WhatsApp." });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-display italic text-[#111111]">Agenda de Follow-ups</h1>
          <p className="text-[#C9A35A] uppercase tracking-[0.3em] text-[10px] font-bold mt-1">Lembretes e Acompanhamentos</p>
        </div>
        <div className="flex bg-[#EBE5DB]/50 p-1 rounded-2xl border border-[#C9A35A]/10">
          {(['Hoje', 'Amanhã', 'Esta semana', 'Atrasados', 'Todos'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                filter === f ? "bg-[#111111] text-white shadow-md" : "text-[#111111]/40 hover:text-[#111111]"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {filteredList.length > 0 ? (
          filteredList.map((f) => (
            <div key={f.id} className="bg-white p-6 rounded-[2rem] border border-[#C9A35A]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#A61E25]/30 transition-all">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                  f.status === 'Feito' ? "bg-green-100 text-green-600" : "bg-[#F4F0EA] text-[#C9A35A]"
                )}>
                  {f.status === 'Feito' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#111111]">{getClientName(f.clientId)}</h3>
                    <span className={cn(
                      "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                      f.prioridade === 'Urgente' ? "bg-[#A61E25] text-white" : "bg-[#C9A35A]/10 text-[#C9A35A]"
                    )}>
                      {f.prioridade}
                    </span>
                  </div>
                  <p className="text-sm text-[#111111]/60 font-medium">{f.tipo}</p>
                  <div className="flex items-center gap-3 mt-2">
                     <span className="text-[10px] font-bold text-[#C9A35A] uppercase flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(f.data).toLocaleDateString()}
                     </span>
                     {f.observacao && (
                       <span className="text-[10px] text-[#111111]/30 font-medium italic">“{f.observacao}”</span>
                     )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={() => copyMessage(f)}
                   className="rounded-xl border border-[#C9A35A]/10 text-[#C9A35A] hover:bg-[#C9A35A]/5 text-[10px] font-bold uppercase"
                 >
                   <Copy className="w-3.5 h-3.5 mr-2" /> Copiar Mensagem
                 </Button>
                 <Button 
                   onClick={() => toggleStatus(f.id)}
                   className={cn(
                     "rounded-xl h-10 px-6 text-[10px] font-bold uppercase tracking-widest shadow-lg",
                     f.status === 'Feito' ? "bg-green-600 text-white" : "bg-[#A61E25] text-white"
                   )}
                 >
                   {f.status === 'Feito' ? 'Concluído' : 'Marcar como Feito'}
                 </Button>
                 <Link to={`/templo/clientes/${f.clientId}`}>
                    <Button variant="ghost" size="icon" className="rounded-xl border border-[#F4F0EA] text-[#111111]/20 hover:text-[#A61E25]">
                       <ChevronRight className="w-5 h-5" />
                    </Button>
                 </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/50 p-20 rounded-[3rem] border border-dashed border-[#C9A35A]/20 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#C9A35A]/30 mx-auto" />
            <div className="space-y-1">
              <p className="text-[#111111] font-bold text-lg">Nada para {filter.toLowerCase()}!</p>
              <p className="text-sm text-[#111111]/40">Sua agenda está limpa por enquanto.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

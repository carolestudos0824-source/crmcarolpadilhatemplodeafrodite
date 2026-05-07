import { storage, Financeiro } from "@/lib/storage";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle2, 
  ChevronRight, ArrowUpRight, Plus, Search, Filter, Calendar,
  CreditCard, Smartphone, Banknote, User
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function FinanceiroPage() {
  const allFinanceiro = useMemo(() => storage.getFinanceiro(), []);
  const allClients = useMemo(() => storage.getClients(), []);

  const monthStats = useMemo(() => {
    const now = new Date();
    const currentMonth = allFinanceiro.filter(f => {
      const d = new Date(f.data);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const received = currentMonth.filter(f => f.status === 'Pago').reduce((acc, curr) => acc + curr.valor, 0);
    const pending = currentMonth.filter(f => f.status === 'Pendente').reduce((acc, curr) => acc + curr.valor, 0);

    return { received, pending };
  }, [allFinanceiro]);

  const getClientName = (id?: string) => allClients.find(c => c.id === id)?.nome || "Lançamento Avulso";

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-display italic text-[#111111]">Gestão Financeira</h1>
          <p className="text-[#C9A35A] uppercase tracking-[0.3em] text-[10px] font-bold mt-1">Fluxo de Caixa e Receitas</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#111111] text-white rounded-2xl h-12 px-6 font-bold gap-2">
            <Plus className="w-4 h-4" /> NOVO LANÇAMENTO
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#111111] p-8 rounded-[2.5rem] border border-[#C9A35A]/30 shadow-xl space-y-4">
           <div className="flex items-center gap-3 text-[#C9A35A]">
              <TrendingUp className="w-5 h-5" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Recebido (Mês)</p>
           </div>
           <h2 className="text-4xl font-bold text-white tracking-tighter">R$ {monthStats.received.toLocaleString('pt-BR')}</h2>
           <p className="text-white/30 text-xs italic">Consultas e Magias finalizadas</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-4">
           <div className="flex items-center gap-3 text-[#A61E25]">
              <Clock className="w-5 h-5" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40">A Receber</p>
           </div>
           <h2 className="text-4xl font-bold text-[#111111] tracking-tighter">R$ {monthStats.pending.toLocaleString('pt-BR')}</h2>
           <p className="text-[#111111]/30 text-xs italic">Valores em aberto ou parciais</p>
        </div>

        <div className="bg-[#ECE5DC] p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-4">
           <div className="flex items-center gap-3 text-[#111111]">
              <TrendingDown className="w-5 h-5" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40">Ticket Médio</p>
           </div>
           <h2 className="text-4xl font-bold text-[#111111] tracking-tighter">
             R$ {allFinanceiro.length > 0 ? (monthStats.received / allFinanceiro.filter(f => f.status === 'Pago').length || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) : '0'}
           </h2>
           <p className="text-[#111111]/30 text-xs italic">Média por atendimento</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-[#C9A35A]/10 shadow-sm space-y-8">
         <div className="flex items-center justify-between border-b border-[#F4F0EA] pb-6">
            <h3 className="text-xl font-bold text-[#111111] font-display">Últimas Transações</h3>
            <div className="flex items-center gap-4">
               <div className="relative group hidden sm:block">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#111111]/30" />
                  <input type="text" placeholder="Buscar..." className="h-10 w-48 bg-[#F4F0EA]/50 rounded-xl pl-10 pr-4 text-xs focus:ring-[#A61E25] border-none" />
               </div>
               <Button variant="ghost" size="icon" className="rounded-xl border border-[#F4F0EA]"><Filter className="w-4 h-4 text-[#111111]/40" /></Button>
            </div>
         </div>

         <div className="space-y-4">
            {allFinanceiro.length > 0 ? (
              allFinanceiro.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).map((f) => (
                <div key={f.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F4F0EA]/30 border border-[#C9A35A]/5 hover:border-[#C9A35A]/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      f.status === 'Pago' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                      {f.formaPagamento === 'Pix' && <Smartphone className="w-6 h-6" />}
                      {f.formaPagamento === 'Cartão' && <CreditCard className="w-6 h-6" />}
                      {f.formaPagamento === 'Dinheiro' && <Banknote className="w-6 h-6" />}
                      {!['Pix', 'Cartão', 'Dinheiro'].includes(f.formaPagamento) && <DollarSign className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111111] text-sm">{f.descricao}</h4>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] text-[#111111]/40 font-bold uppercase tracking-wider">{getClientName(f.clientId)}</span>
                         <span className="w-1 h-1 rounded-full bg-[#111111]/10" />
                         <span className="text-[10px] text-[#111111]/40 font-medium">{new Date(f.data).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-[#F4F0EA] pt-4 sm:pt-0">
                     <div className="text-right">
                        <p className="text-lg font-bold text-[#111111]">R$ {f.valor.toLocaleString('pt-BR')}</p>
                        <p className={cn(
                          "text-[9px] font-bold uppercase tracking-widest",
                          f.status === 'Pago' ? "text-green-600" : "text-[#A61E25]"
                        )}>{f.status}</p>
                     </div>
                     <Link to={f.clientId ? `/templo/clientes/${f.clientId}` : '#'}>
                        <Button variant="ghost" size="icon" className="rounded-xl border border-[#F4F0EA] text-[#111111]/20 hover:text-[#A61E25]">
                           <ChevronRight className="w-5 h-5" />
                        </Button>
                     </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                 <DollarSign className="w-16 h-16 text-[#C9A35A]/10 mx-auto" />
                 <div className="space-y-1">
                    <p className="text-[#111111] font-bold">Nenhum lançamento registrado.</p>
                    <p className="text-sm text-[#111111]/40">Comece a controlar suas receitas hoje.</p>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}

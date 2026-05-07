import { TrendingUp, Users, Calendar, Sparkles, ArrowUpRight, ArrowDownRight, DollarSign, Star, Zap } from "lucide-react";
import { useMemo } from "react";
import { storage } from "@/lib/storage";

export function ReportsPage() {
  const appointments = useMemo(() => storage.getAppointments(), []);
  const clients = useMemo(() => storage.getClients(), []);
  const magias = useMemo(() => storage.getMagias(), []);
  const financeiro = useMemo(() => storage.getFinanceiro(), []);

  const stats = useMemo(() => {
    const today = new Date();
    const thisMonth = appointments.filter(a => {
      const d = new Date(a.createdAt);
      return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });

    const income = financeiro.filter(f => f.status === 'Pago').reduce((acc, curr) => acc + curr.valor, 0);

    return [
      { label: "Consultas (Mês)", value: thisMonth.length.toString(), change: "+12%", up: true },
      { label: "Total Clientes", value: clients.length.toString(), change: "+5%", up: true },
      { label: "Magias Ativas", value: magias.filter(m => m.statusExecucao !== 'Finalizada').length.toString(), change: "+8%", up: true },
      { label: "Receita Total", value: `R$ ${income.toLocaleString('pt-BR')}`, change: "+15%", up: true },
    ];
  }, [appointments, clients, magias, financeiro]);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-display italic text-[#111111]">Métricas do Templo</h1>
          <p className="text-[#C9A35A] uppercase tracking-[0.3em] text-[10px] font-bold mt-1">Visão Analítica e Crescimento</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#111111]/40">{stat.label}</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-bold text-[#111111] tracking-tight">{stat.value}</h3>
              <div className={`flex items-center text-[10px] font-bold pb-1 ${stat.up ? "text-green-600" : "text-red-600"}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-[#C9A35A]/10 shadow-sm space-y-8">
           <div className="flex items-center justify-between border-b border-[#F4F0EA] pb-6">
              <h3 className="text-xl font-bold text-[#111111] font-display italic">Cartas Recorrentes</h3>
              <Star className="w-5 h-5 text-[#C9A35A]" />
           </div>
           <div className="space-y-6">
              <div className="flex items-center justify-center py-12">
                 <p className="text-[#111111]/30 italic text-sm">Dados insuficientes para análise de cartas.</p>
              </div>
           </div>
        </div>

        <div className="bg-[#111111] p-10 rounded-[3rem] border border-[#C9A35A]/30 shadow-xl space-y-8 text-white">
           <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <h3 className="text-xl font-bold font-display italic text-[#C9A35A]">Conversão Comercial</h3>
              <Zap className="w-5 h-5 text-[#C9A35A]" />
           </div>
           <div className="space-y-8">
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#C9A35A]">
                    <span>Atendimento → Magia</span>
                    <span>0%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#A61E25] w-[0%]" />
                 </div>
              </div>
              <p className="text-white/40 text-xs italic text-center">Inicie atendimentos e registre magias para ver sua taxa de conversão.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

import { TrendingUp, Users, Calendar, Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function ReportsPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header>
        <h1 className="text-3xl font-bold text-[#111111] font-display">Relatórios</h1>
        <p className="text-[#111111]/60 font-medium">Acompanhe o crescimento e fluxo do Templo.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Consultas (Mês)", value: "54", change: "+12%", up: true },
          { label: "Novas Clientes", value: "18", change: "+5%", up: true },
          { label: "Magias Contratadas", value: "32", change: "+8%", up: true },
          { label: "Ticket Médio", value: "R$ 380", change: "-2%", up: false },
        ].map((stat, i) => (
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
        <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm h-80 flex flex-col items-center justify-center space-y-4">
           <TrendingUp className="w-12 h-12 text-[#C9A35A]/20" />
           <p className="text-[#111111]/40 font-bold uppercase tracking-widest text-xs">Gráfico de Atendimentos Semanal</p>
           <div className="w-full flex items-end justify-between px-8 gap-2 flex-1 pt-4">
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <div key={i} className="flex-1 bg-[#F4F0EA] rounded-t-lg relative group">
                   <div style={{ height: `${h}%` }} className="bg-[#C9A35A]/40 group-hover:bg-[#A61E25] transition-all rounded-t-lg" />
                </div>
              ))}
           </div>
           <div className="w-full flex justify-between px-8 text-[10px] font-bold text-[#111111]/20">
              <span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SAB</span><span>DOM</span>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
           <h3 className="font-bold text-[#111111] font-display uppercase tracking-widest text-sm">Conversão de Magias</h3>
           <div className="space-y-6">
              {[
                { label: "Adoçamentos", val: 65, color: "bg-[#A61E25]" },
                { label: "Limpezas", val: 45, color: "bg-[#C9A35A]" },
                { label: "Cortes", val: 20, color: "bg-[#111111]" },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                      <span>{item.label}</span>
                      <span className="text-[#111111]/40">{item.val}%</span>
                   </div>
                   <div className="h-2 w-full bg-[#F4F0EA] rounded-full overflow-hidden">
                      <div style={{ width: `${item.val}%` }} className={`h-full ${item.color}`} />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
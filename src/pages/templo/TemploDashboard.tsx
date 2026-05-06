import { Users, Calendar, Sparkles, TrendingUp } from "lucide-react";

export function TemploDashboard() {
  const metrics = [
    { label: "Atendimentos Hoje", value: "0", icon: Calendar, color: "text-templo-gold" },
    { label: "Clientes Ativas", value: "0", icon: Users, color: "text-templo-gold" },
    { label: "Magias Indicadas", value: "0", icon: Sparkles, color: "text-templo-purple" },
    { label: "Receita (Mês)", value: "R$ 0,00", icon: TrendingUp, color: "text-templo-red" },
  ];

  const statuses = [
    { label: "Nova cliente", count: 0, color: "bg-templo-ivory/10 text-templo-ivory" },
    { label: "Consulta feita", count: 0, color: "bg-templo-gold/10 text-templo-gold" },
    { label: "Magia indicada", count: 0, color: "bg-templo-purple/10 text-templo-purple" },
    { label: "Magia contratada", count: 0, color: "bg-templo-red/10 text-templo-red" },
    { label: "Em acompanhamento", count: 0, color: "bg-templo-gold/20 text-templo-gold" },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-templo-gold uppercase tracking-tighter">
            Dashboard do Templo
          </h1>
          <p className="text-templo-ivory/40 text-sm">Visão geral do seu reino espiritual.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-templo-red hover:bg-templo-red/90 text-templo-ivory px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95">
            Novo Atendimento
          </button>
          <button className="border border-templo-gold/30 hover:bg-templo-gold/5 text-templo-gold px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95">
            Nova Cliente
          </button>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="bg-templo-black/40 border border-templo-gold/10 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-templo-gold/5 rounded-full blur-2xl group-hover:bg-templo-gold/10 transition-all"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-2 rounded-lg bg-white/5 ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-templo-ivory/40">{m.label}</span>
              </div>
              <p className="text-3xl font-display font-bold text-templo-gold">{m.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Status Breakdown */}
        <div className="bg-templo-black/40 border border-templo-gold/10 rounded-2xl p-6">
          <h3 className="font-display text-xl font-bold text-templo-gold mb-6 uppercase tracking-tight">Status das Clientes</h3>
          <div className="space-y-3">
            {statuses.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs font-medium">{s.label}</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${s.color}`}>
                  {s.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="lg:col-span-2 bg-templo-black/40 border border-templo-gold/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-bold text-templo-gold uppercase tracking-tight">Atendimentos Recentes</h3>
            <button className="text-[10px] uppercase tracking-widest text-templo-gold/60 hover:text-templo-gold transition-colors font-bold">Ver todos →</button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30">
            <Sparkles className="w-12 h-12 text-templo-gold" />
            <div className="space-y-1">
              <p className="font-display text-lg italic">O templo está calmo...</p>
              <p className="text-xs">Nenhum atendimento realizado hoje.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

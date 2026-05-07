import { 
  Plus, 
  Users, 
  Sparkles, 
  MessageCircle, 
  Clock, 
  ChevronRight,
  TrendingUp,
  UserPlus,
  Play
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const recentAttendance: any[] = [];

export function TemploDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111111] font-serif-elegant">Olá, Carol</h1>
          <p className="text-[#111111]/60 font-medium font-sans-clean">Bem-vinda de volta ao Templo de Afrodite.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/templo/novo-atendimento">
            <Button className="bg-[#A61E25] hover:bg-[#A61E25]/90 text-white rounded-2xl h-14 px-6 shadow-lg shadow-[#A61E25]/20 gap-2 font-bold transition-all active:scale-95 font-sans-clean">
              <Plus className="w-5 h-5" />
              NOVO ATENDIMENTO
            </Button>
          </Link>
        </div>
      </header>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/templo/clientes/novo" className="group">
          <div className="bg-[#EBE5DB] p-4 sm:p-5 rounded-[1.5rem] border border-[#C9A35A]/20 shadow-sm flex items-center gap-3 group-hover:border-[#C9A35A]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#C9A35A]/10 flex items-center justify-center text-[#C9A35A]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[#111111] font-bold text-xs sm:text-sm font-sans-clean">Nova Cliente</p>
              <p className="text-[9px] text-[#111111]/40 uppercase tracking-widest font-bold font-sans-clean">Cadastrar</p>
            </div>
          </div>
        </Link>
        <Link to="/templo/novo-atendimento" className="group">
          <div className="bg-[#EBE5DB] p-4 sm:p-5 rounded-[1.5rem] border border-[#C9A35A]/20 shadow-sm flex items-center gap-3 group-hover:border-[#C9A35A]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#A61E25]/10 flex items-center justify-center text-[#A61E25]">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-[#111111] font-bold text-xs sm:text-sm font-sans-clean">Novo Jogo</p>
              <p className="text-[9px] text-[#111111]/40 uppercase tracking-widest font-bold font-sans-clean">Iniciar leitura</p>
            </div>
          </div>
        </Link>
        <Link to="/templo/relatorios" className="group hidden lg:block">
          <div className="bg-[#EBE5DC] p-4 sm:p-5 rounded-[1.5rem] border border-[#C9A35A]/20 shadow-sm flex items-center gap-3 group-hover:border-[#C9A35A]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#111111]/5 flex items-center justify-center text-[#111111]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[#111111] font-bold text-xs sm:text-sm font-sans-clean">Desempenho</p>
              <p className="text-[9px] text-[#111111]/40 uppercase tracking-widest font-bold font-sans-clean">Ver métricas</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Atendimentos Hoje", value: "0", icon: Clock, color: "text-[#A61E25]" },
          { label: "Clientes Totais", value: "0", icon: Users, color: "text-[#C9A35A]" },
          { label: "Magias Indicadas", value: "0", icon: Sparkles, color: "text-[#C9A35A]" },
          { label: "Receita (Mês)", value: "R$ 0", icon: TrendingUp, color: "text-[#111111]" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#EBE5DC] p-6 sm:p-8 rounded-[2rem] border border-[#C9A35A]/10 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#111111] tracking-tight font-serif-elegant">{stat.value}</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#111111]/40 font-sans-clean">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Atendimentos Recentes */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#111111] font-serif-elegant">Atendimentos Recentes</h2>
            <Link to="/templo/clientes" className="text-[#A61E25] text-xs font-bold uppercase tracking-widest hover:underline font-sans-clean">Ver todos</Link>
          </div>
          <div className="space-y-4">
            {recentAttendance.length > 0 ? (
              recentAttendance.map((item, i) => (
                <div key={i} className="bg-[#EBE5DC] p-6 rounded-[2rem] border border-[#C9A35A]/10 shadow-sm flex items-center justify-between hover:border-[#C9A35A]/40 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#EBE5DC] flex items-center justify-center font-bold text-[#111111] text-lg italic border border-[#C9A35A]/20">
                      {item.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111111] font-sans-clean">{item.name}</h4>
                      <p className="text-xs text-[#111111]/60 font-medium">{item.situation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#A61E25] mb-1 font-sans-clean">{item.status}</div>
                      <div className="text-[10px] font-medium text-[#111111]/40">{item.date}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#111111]/20 group-hover:text-[#A61E25] transition-colors" />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#EBE5DC]/50 p-12 rounded-[2rem] border border-dashed border-[#C9A35A]/20 text-center space-y-4">
                <Users className="w-10 h-10 text-[#C9A35A]/30 mx-auto" />
                <div className="space-y-1">
                  <p className="text-[#111111] font-bold font-sans-clean">Nenhum atendimento registrado ainda.</p>
                  <p className="text-xs text-[#111111]/40 font-sans-clean">Inicie uma nova tiragem para começar seu histórico.</p>
                </div>
                <Link to="/templo/novo-atendimento" className="inline-block">
                  <Button variant="outline" className="rounded-xl border-[#A61E25] text-[#A61E25] hover:bg-[#A61E25]/5 text-xs font-bold px-6 font-sans-clean">
                    CRIAR PRIMEIRO ATENDIMENTO
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Próximos Retornos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#111111] font-serif-elegant">Próximos Retornos</h2>
          </div>
          <div className="bg-[#EBE5DC] p-8 rounded-[2rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
            {[
              { name: "Mariana Silva", reason: "Follow-up: 3 dias após Magia de Adoçamento" },
              { name: "Beatriz Oliveira", reason: "Acompanhar evolução do caso" },
              { name: "Julia Santos", reason: "Revisar tendências futuras" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 pb-6 border-b border-[#F2EFE8] last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-xl bg-[#F2EFE8] flex items-center justify-center text-[#111111]/40">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#111111] text-sm font-sans-clean">Retorno para {item.name}</h4>
                  <p className="text-xs text-[#111111]/60 font-medium font-sans-clean">{item.reason}</p>
                </div>
                <Button variant="outline" className="rounded-xl border-[#C9A35A]/30 text-[#C9A35A] hover:bg-[#C9A35A]/10 text-[10px] font-bold px-3 h-9 font-sans-clean">AGENDAR</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import { 
  Plus, 
  Users, 
  Sparkles, 
  Clock, 
  ChevronRight,
  TrendingUp,
  UserPlus,
  Play,
  Calendar,
  DollarSign,
  CheckCircle2,
  ArrowUpRight,
  MessageSquareHeart,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabaseService } from "@/lib/supabase-service";

export function TemploDashboard() {
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: () => supabaseService.getClients() });
  const { data: appointments = [] } = useQuery({ queryKey: ["appointments"], queryFn: () => supabaseService.getAppointments() });
  const { data: followUps = [] } = useQuery({ queryKey: ["follow-ups"], queryFn: () => supabaseService.getFollowUps() });
  const { data: magias = [] } = useQuery({ queryKey: ["magias"], queryFn: () => supabaseService.getMagias() });
  const { data: financeiro = [] } = useQuery({ queryKey: ["financeiro"], queryFn: () => supabaseService.getFinanceiro() });

  const stats = useMemo(() => {
    const today = new Date().toLocaleDateString('pt-BR');
    const todayApps = appointments.filter(a => new Date(a.createdAt).toLocaleDateString('pt-BR') === today);
    const pendentes = followUps.filter(f => f.status === 'Pendente');
    const monthIncome = financeiro
      .filter(f => {
        const date = new Date(f.data);
        const now = new Date();
        return f.status === 'Pago' && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((acc, curr) => acc + curr.valor, 0);

    return [
      { label: "Atendimentos Hoje", value: todayApps.length.toString(), icon: Clock, color: "text-[#A61E25]" },
      { label: "Follow-ups Pendentes", value: pendentes.length.toString(), icon: Calendar, color: "text-[#C9A35A]" },
      { label: "Magias Ativas", value: magias.filter(m => m.statusExecucao !== 'Finalizada' && m.statusExecucao !== 'Cancelada').length.toString(), icon: Sparkles, color: "text-[#C9A35A]" },
      { label: "Receita (Mês)", value: `R$ ${monthIncome.toLocaleString('pt-BR')}`, icon: DollarSign, color: "text-[#111111]" },
    ];
  }, [appointments, followUps, magias, financeiro]);

  const recentAttendance = useMemo(() => {
    return appointments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [appointments]);

  const pendingTasks = useMemo(() => {
    const list = [];
    
    // Clients without follow-up
    const noFollowUp = clients.filter(c => !followUps.some(f => f.clientId === c.id && f.status === 'Pendente')).slice(0, 2);
    noFollowUp.forEach(c => list.push({ type: 'retorno', title: `Retorno para ${c.nome}`, desc: 'Sem follow-up marcado', id: c.id }));

    // Unpaid appointments
    const unpaid = financeiro.filter(f => f.status === 'Pendente').slice(0, 2);
    unpaid.forEach(f => list.push({ type: 'pagamento', title: `Pagamento de R$ ${f.valor}`, desc: f.descricao, id: f.id }));

    return list;
  }, [clients, followUps, financeiro]);
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
          <Link to="/atendimento" target="_blank">
            <Button variant="outline" className="border-[#A61E25] text-[#A61E25] hover:bg-[#A61E25]/5 rounded-2xl h-14 px-6 gap-2 font-bold font-sans-clean group transition-all">
              <MessageSquareHeart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              FALAR COM CAROL
              <ExternalLink className="w-3 h-3 opacity-40" />
            </Button>
          </Link>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Atendimentos Recentes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#111111] font-display italic">Atendimentos Recentes</h2>
            <Link to="/templo/clientes" className="text-[#A61E25] text-xs font-bold uppercase tracking-widest hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-4">
            {recentAttendance.length > 0 ? (
              recentAttendance.map((item) => (
                <Link to={`/templo/clientes/${item.clientId}`} key={item.id} className="bg-white p-6 rounded-[2rem] border border-[#C9A35A]/10 shadow-sm flex items-center justify-between hover:border-[#A61E25]/40 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#F4F0EA] flex items-center justify-center font-bold text-[#111111] text-lg italic border border-[#C9A35A]/20">
                      {item.nomeCliente[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111111]">{item.nomeCliente}</h4>
                      <p className="text-xs text-[#111111]/60 font-medium">{item.situacaoAmorosa}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#A61E25] mb-1">{item.statusAtendimento}</div>
                      <div className="text-[10px] font-medium text-[#111111]/40">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#111111]/20 group-hover:text-[#A61E25] transition-colors" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white/50 p-12 rounded-[2rem] border border-dashed border-[#C9A35A]/20 text-center space-y-4">
                <Users className="w-10 h-10 text-[#C9A35A]/30 mx-auto" />
                <p className="text-[#111111] font-bold">Nenhum atendimento registrado.</p>
                <Link to="/templo/novo-atendimento">
                  <Button variant="outline" className="rounded-xl border-[#A61E25] text-[#A61E25] hover:bg-[#A61E25]/5 text-xs font-bold px-6">
                    CRIAR PRIMEIRO ATENDIMENTO
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Hoje eu preciso cuidar de */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#111111] font-display italic">Hoje preciso cuidar de</h2>
          <div className="bg-[#111111] p-6 rounded-[2.5rem] border border-[#C9A35A]/30 shadow-xl space-y-6">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-[#C9A35A]/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    task.type === 'retorno' ? "bg-[#C9A35A]/20 text-[#C9A35A]" : "bg-[#A61E25]/20 text-[#A61E25]"
                  )}>
                    {task.type === 'retorno' ? <Calendar className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm truncate">{task.title}</h4>
                    <p className="text-[#C9A35A] text-[10px] uppercase tracking-widest font-bold">{task.desc}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-[#C9A35A] transition-colors" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#C9A35A]/30 mx-auto" />
                <p className="text-white/40 text-xs italic">Tudo em dia por aqui!</p>
              </div>
            )}
            
            <Button className="w-full bg-[#C9A35A] hover:bg-[#B89249] text-[#111111] font-bold h-12 rounded-xl text-xs uppercase tracking-widest">
              Ver Todas as Tarefas
            </Button>
          </div>

          <div className="bg-[#ECE5DC] p-6 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-4">
             <h3 className="text-xs font-bold uppercase tracking-widest text-[#111111]/40">Resumo do Mês</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/50 rounded-2xl border border-[#C9A35A]/10">
                   <p className="text-[9px] font-bold uppercase tracking-widest text-[#111111]/40 mb-1">Consultas</p>
                   <p className="text-xl font-bold text-[#111111]">{appointments.length}</p>
                </div>
                <div className="p-4 bg-white/50 rounded-2xl border border-[#C9A35A]/10">
                   <p className="text-[9px] font-bold uppercase tracking-widest text-[#111111]/40 mb-1">Magias</p>
                   <p className="text-xl font-bold text-[#111111]">{magias.length}</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  PlusCircle, 
  History, 
  Sparkles, 
  BarChart3, 
  Settings,
  Heart,
  LogOut,
  Clock,
  DollarSign,
  MessageSquare,
  Search,
  Inbox,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/templo/dashboard" },
  { icon: Users, label: "Clientes", path: "/templo/clientes" },
  { icon: Inbox, label: "Caixa de Entrada", path: "/templo/caixa-entrada" },
  { icon: PlusCircle, label: "Novo Jogo", path: "/templo/novo-atendimento" },
  { icon: History, label: "Pipeline", path: "/templo/pipeline" },
  { icon: Clock, label: "Follow-ups", path: "/templo/follow-ups" },
  { icon: Sparkles, label: "Magias", path: "/templo/magias" },
  { icon: DollarSign, label: "Financeiro", path: "/templo/financeiro" },
  { icon: MessageSquare, label: "Mensagens", path: "/templo/mensagens" },
  { icon: BarChart3, label: "Relatórios", path: "/templo/relatorios" },
  { icon: Settings, label: "Ajustes", path: "/templo/configuracoes" },
  { icon: Shield, label: "Backup", path: "/templo/backup" },
];

export function CrmLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Sessão encerrada com segurança.",
      variant: "default",
    });
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F4F0EA] pb-24 lg:pb-0 lg:pl-64">
      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#111111] hidden lg:flex flex-col border-r border-[#C9A35A]/30 z-50">
        <div className="p-8 border-b border-[#C9A35A]/20 flex justify-center">
          <Link to="/templo/dashboard" className="block group w-full">
            <div className="flex justify-center items-center">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAABbsklEQVR42u29d5xc13Uffs69r0wvO9s7sIveARIEwd5JURZldckqkeUSyY7jHju25SS2fy6x7ESxI8eRHcmyZFpdIikWs"
                alt="Carol Padilha"
                style={{ width: '150px', height: 'auto', objectFit: 'contain' }}
              />
            </div>
            <div className="mt-4 text-center">
              <h2 className="text-[#F4F0EA] font-display text-sm leading-tight tracking-wide">TEMPLO DE AFRODITE CRM</h2>
              <p className="text-[#C9A35A] text-[9px] uppercase tracking-widest font-bold mt-1 opacity-70">SISTEMA INTERNO</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                  isActive 
                    ? "bg-[#A61E25] text-white shadow-lg shadow-[#A61E25]/20" 
                    : "text-[#F4F0EA]/60 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-[#C9A35A]" : "text-inherit")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#C9A35A]/20 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#C9A35A]/10 text-[#C9A35A] text-sm">
            <Heart className="w-4 h-4 fill-[#C9A35A]" />
            <span className="font-medium font-sans">Carol Padilha</span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#F4F0EA]/60 hover:text-[#A61E25] hover:bg-white/5 transition-all font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sair do sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <header className="mb-8 hidden lg:flex items-center justify-between">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/30 group-focus-within:text-[#C9A35A] transition-colors" />
            <input 
              type="text" 
              placeholder="Busca global (clientes, atendimentos, magias...)" 
              className="w-full h-12 bg-white/50 backdrop-blur-sm border border-[#C9A35A]/10 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A35A]/30 focus:bg-white transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/30">Bem-vinda de volta</p>
                <p className="text-sm font-display italic text-[#111111]">Carol Padilha</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C9A35A] to-[#9B7440] p-[2px]">
                <div className="w-full h-full rounded-full bg-[#111111] flex items-center justify-center text-[#C9A35A] font-bold text-xs italic">CP</div>
             </div>
          </div>
        </header>
        <Outlet />
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#111111] border-t border-[#C9A35A]/30 flex items-center justify-around p-3 z-50 lg:hidden rounded-t-[2rem] shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        {navItems.slice(0, 4).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                isActive ? "text-[#A61E25]" : "text-[#F4F0EA]/60"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive ? "text-[#A61E25]" : "text-inherit")} />
              <span className="text-[10px] uppercase tracking-wider font-bold">{item.label}</span>
            </Link>
          );
        })}
        <Link
          to="/templo/configuracoes"
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
            location.pathname === "/templo/configuracoes" ? "text-[#A61E25]" : "text-[#F4F0EA]/60"
          )}
        >
          <Settings className="w-6 h-6" />
          <span className="text-[10px] uppercase tracking-wider font-bold">Ajustes</span>
        </Link>
      </nav>
    </div>
  );
}
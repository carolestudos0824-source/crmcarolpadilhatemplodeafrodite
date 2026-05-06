import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  PlusCircle, 
  History, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/templo/dashboard" },
  { id: "clientes", label: "Clientes", icon: Users, path: "/templo/clientes" },
  { id: "atendimento", label: "Novo Atendimento", icon: PlusCircle, path: "/templo/novo-atendimento" },
  { id: "jogos", label: "Jogos do Amor", icon: History, path: "/templo/jogos" },
  { id: "relatorios", label: "Relatórios", icon: BarChart3, path: "/templo/relatorios" },
  { id: "configuracoes", label: "Configurações", icon: Settings, path: "/templo/configuracoes" },
];

export function CrmLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-templo-black text-templo-ivory font-body flex overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-templo-gold/20 bg-templo-black shrink-0">
        <div className="p-8 border-b border-templo-gold/10">
          <h1 className="font-display text-2xl font-bold text-templo-gold tracking-tighter uppercase italic">
            Templo de Afrodite
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-templo-gold/60 mt-1">
            CRM Espiritual
          </p>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive 
                    ? "bg-templo-red/10 text-templo-gold border border-templo-gold/30" 
                    : "text-templo-ivory/60 hover:text-templo-ivory hover:bg-white/5"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-templo-gold" : "text-templo-ivory/40 group-hover:text-templo-ivory/60"}`} />
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-templo-gold/10 bg-templo-black/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-templo-red flex items-center justify-center font-display text-templo-gold font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">{user?.email}</p>
              <p className="text-[10px] text-templo-ivory/40">Carol Padilha</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="w-full justify-start gap-3 text-templo-ivory/60 hover:text-templo-red hover:bg-templo-red/5 h-9 text-xs"
          >
            <LogOut className="w-4 h-4" />
            Sair do sistema
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-templo-black">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-templo-gold/20 bg-templo-black sticky top-0 z-50">
          <h1 className="font-display text-lg font-bold text-templo-gold uppercase italic tracking-tighter">
            Templo de Afrodite
          </h1>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-templo-gold"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,_#1a0000_0%,_#000000_70%)] relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none"></div>
          <div className="container max-w-6xl py-8 px-6 relative z-10">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-templo-black flex flex-col">
          <div className="p-6 border-b border-templo-gold/20 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-templo-gold uppercase italic">Templo</h1>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-templo-gold">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 p-6 space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-lg ${
                    isActive ? "bg-templo-red/20 text-templo-gold border border-templo-gold/30" : "text-templo-ivory/60"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="p-6 border-t border-templo-gold/10">
            <Button onClick={handleSignOut} variant="destructive" className="w-full h-12">
              Sair do Sistema
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

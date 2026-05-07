import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  PlusCircle, 
  History, 
  Sparkles, 
  BarChart3, 
  Settings,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/templo/dashboard" },
  { icon: Users, label: "Clientes", path: "/templo/clientes" },
  { icon: PlusCircle, label: "Novo", path: "/templo/novo-atendimento" },
  { icon: Sparkles, label: "Magias", path: "/templo/magias" },
  { icon: BarChart3, label: "Relatórios", path: "/templo/relatorios" },
  { icon: Settings, label: "Ajustes", path: "/templo/configuracoes" },
];

export function CrmLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F4F0EA] pb-24 lg:pb-0 lg:pl-64">
      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#111111] hidden lg:flex flex-col border-r border-[#C9A35A]/30 z-50">
        <div className="p-8 border-b border-[#C9A35A]/20">
          <Link to="/templo/dashboard" className="block">
            <img 
              src="https://qtbkvshbmqlszncxlcuc.supabase.co/storage/v1/object/public/dsl-uploads/FKxI2UX5GWafusX2CZ1rulDlY5n1/1fcb5fad-cd93-4055-9587-35b167be7490.png" 
              alt="Carol Padilha" 
              className="w-full"
            />
            <p className="text-[#C9A35A] text-[9px] uppercase tracking-widest font-bold mt-2 text-center opacity-70">CRM INTERNO</p>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
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

        <div className="p-6 border-t border-[#C9A35A]/20">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#C9A35A]/10 text-[#C9A35A] text-sm">
            <Heart className="w-4 h-4 fill-[#C9A35A]" />
            <span className="font-medium">Carol Padilha</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
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
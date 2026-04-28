import {
  LayoutDashboard, Users, Crown, Gift, BookOpen, Sparkles, HelpCircle,
  BarChart3, HeadphonesIcon, Settings, ScrollText, Shield, Smartphone,
} from "lucide-react";
import { canAccessSection, type AppRole } from "@/hooks/use-role";

export type AdminSection =
  | "overview"
  | "users"
  | "subscriptions"
  | "gifts"
  | "modules"
  | "arcanos"
  | "quizzes"
  | "progress"
  | "roles"
  | "audit"
  | "support"
  | "settings"
  | "playstore";

interface AdminSidebarProps {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
  role: AppRole;
}

const sections: { id: AdminSection; label: string; icon: React.ReactNode; group: string }[] = [
  { id: "overview", label: "Visão Geral", icon: <LayoutDashboard className="w-4 h-4" />, group: "Principal" },
  { id: "users", label: "Usuários", icon: <Users className="w-4 h-4" />, group: "Principal" },
  { id: "subscriptions", label: "Assinaturas & Vendas", icon: <Crown className="w-4 h-4" />, group: "Comercial" },
  { id: "gifts", label: "Presentes & Chaves", icon: <Gift className="w-4 h-4" />, group: "Comercial" },
  { id: "modules", label: "Módulos", icon: <BookOpen className="w-4 h-4" />, group: "Curso" },
  { id: "arcanos", label: "Arcanos", icon: <Sparkles className="w-4 h-4" />, group: "Curso" },
  { id: "quizzes", label: "Quizzes", icon: <HelpCircle className="w-4 h-4" />, group: "Curso" },
  { id: "progress", label: "Progresso & Uso", icon: <BarChart3 className="w-4 h-4" />, group: "Curso" },
  { id: "roles", label: "Funções", icon: <Shield className="w-4 h-4" />, group: "Operação" },
  { id: "audit", label: "Auditoria", icon: <ScrollText className="w-4 h-4" />, group: "Operação" },
  { id: "support", label: "Suporte", icon: <HeadphonesIcon className="w-4 h-4" />, group: "Operação" },
  { id: "settings", label: "Configurações", icon: <Settings className="w-4 h-4" />, group: "Operação" },
  { id: "playstore", label: "Play Store", icon: <Smartphone className="w-4 h-4" />, group: "Operação" },
];

const AdminSidebar = ({ active, onChange, role }: AdminSidebarProps) => {
  const visible = sections.filter((s) => canAccessSection(role, s.id));
  const groups = [...new Set(visible.map(s => s.group))];

  return (
    <aside className="w-56 shrink-0 border-r border-border/50 bg-card/30 min-h-[calc(100vh-57px)] overflow-y-auto hidden md:block">
      <nav className="p-3 space-y-5">
        <div className="px-3 pb-2 border-b border-border/30">
          <p className="text-[10px] font-heading tracking-[0.2em] uppercase text-muted-foreground/60">Papel</p>
          <p className={`text-xs font-medium ${role === "admin" ? "text-amber-600" : role === "moderator" ? "text-primary" : "text-muted-foreground"}`}>
            {role === "admin" ? "Administrador" : role === "moderator" ? "Moderador" : "Usuário"}
          </p>
        </div>
        {groups.map(group => (
          <div key={group}>
            <p className="text-[10px] font-heading tracking-[0.2em] uppercase text-muted-foreground/60 px-3 mb-1.5">
              {group}
            </p>
            <div className="space-y-0.5">
              {visible.filter(s => s.group === group).map(s => (
                <button
                  key={s.id}
                  onClick={() => onChange(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    active === s.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

/** Mobile bottom tabs for admin on small screens */
export const AdminMobileNav = ({ active, onChange, role }: AdminSidebarProps) => {
  const visible = sections.filter((s) => canAccessSection(role, s.id));
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-2 py-1.5 flex justify-around overflow-x-auto">
      {visible.map(s => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] transition-colors shrink-0 ${
            active === s.id ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {s.icon}
          <span className="truncate max-w-[52px]">{s.label.split(" ")[0]}</span>
        </button>
      ))}
    </nav>
  );
};

export default AdminSidebar;

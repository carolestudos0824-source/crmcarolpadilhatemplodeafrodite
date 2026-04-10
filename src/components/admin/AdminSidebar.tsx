import { 
  LayoutDashboard, Users, Crown, Gift, Layers, BookOpen, Star,
  HelpCircle, Calendar, BarChart3, HeadphonesIcon, Settings,
  Lock, RefreshCw, Package, Sparkles
} from "lucide-react";

export type AdminSection = 
  | "overview"
  | "users"
  | "subscriptions" | "gift-codes"
  | "modules" | "arcanos" | "quizzes" | "challenges" | "access"
  | "usage" | "analytics"
  | "support"
  | "settings";

interface AdminSidebarProps {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
}

const sections: { id: AdminSection; label: string; icon: React.ReactNode; group: string }[] = [
  // 1. Visão geral
  { id: "overview", label: "Visão Geral", icon: <LayoutDashboard className="w-4 h-4" />, group: "Principal" },

  // 2. Usuários
  { id: "users", label: "Usuários", icon: <Users className="w-4 h-4" />, group: "Principal" },

  // 3. Assinaturas e vendas
  { id: "subscriptions", label: "Assinaturas", icon: <Crown className="w-4 h-4" />, group: "Comercial" },

  // 4. Presentes e chaves
  { id: "gift-codes", label: "Presentes & Chaves", icon: <Gift className="w-4 h-4" />, group: "Comercial" },

  // 5. Conteúdo
  { id: "modules", label: "Módulos", icon: <Layers className="w-4 h-4" />, group: "Conteúdo" },
  { id: "arcanos", label: "Arcanos", icon: <Star className="w-4 h-4" />, group: "Conteúdo" },
  { id: "quizzes", label: "Quizzes", icon: <HelpCircle className="w-4 h-4" />, group: "Conteúdo" },
  { id: "challenges", label: "Desafios", icon: <Calendar className="w-4 h-4" />, group: "Conteúdo" },
  { id: "access", label: "Acesso & Premium", icon: <Lock className="w-4 h-4" />, group: "Conteúdo" },

  // 6. Progresso e uso
  { id: "usage", label: "Progresso & Uso", icon: <BarChart3 className="w-4 h-4" />, group: "Análise" },
  { id: "analytics", label: "Métricas", icon: <Sparkles className="w-4 h-4" />, group: "Análise" },

  // 7. Suporte
  { id: "support", label: "Suporte", icon: <HeadphonesIcon className="w-4 h-4" />, group: "Operação" },

  // 8. Configurações
  { id: "settings", label: "Configurações", icon: <Settings className="w-4 h-4" />, group: "Operação" },
];

const AdminSidebar = ({ active, onChange }: AdminSidebarProps) => {
  const groups = [...new Set(sections.map(s => s.group))];

  return (
    <aside className="w-56 shrink-0 border-r border-border/50 bg-card/30 min-h-[calc(100vh-57px)] overflow-y-auto">
      <nav className="p-3 space-y-5">
        {groups.map(group => (
          <div key={group}>
            <p className="text-[10px] font-heading tracking-[0.2em] uppercase text-muted-foreground/60 px-3 mb-1.5">
              {group}
            </p>
            <div className="space-y-0.5">
              {sections.filter(s => s.group === group).map(s => (
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

export default AdminSidebar;

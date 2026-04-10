import { 
  BookOpen, Users, BarChart3, Layers, GraduationCap, 
  HelpCircle, RefreshCw, Sparkles, Package, Lock, Star,
  Calendar
} from "lucide-react";

export type AdminSection = 
  | "modules" | "lessons" | "arcanos" | "quizzes" 
  | "reviews" | "challenges" | "extras" | "access"
  | "students" | "analytics" | "beta-metrics";

interface AdminSidebarProps {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
}

const sections: { id: AdminSection; label: string; icon: React.ReactNode; group: string }[] = [
  { id: "modules", label: "Módulos", icon: <Layers className="w-4 h-4" />, group: "Conteúdo" },
  { id: "lessons", label: "Lições", icon: <BookOpen className="w-4 h-4" />, group: "Conteúdo" },
  { id: "arcanos", label: "Arcanos", icon: <Star className="w-4 h-4" />, group: "Conteúdo" },
  { id: "quizzes", label: "Quizzes", icon: <HelpCircle className="w-4 h-4" />, group: "Avaliação" },
  { id: "reviews", label: "Revisões", icon: <RefreshCw className="w-4 h-4" />, group: "Avaliação" },
  { id: "challenges", label: "Desafios Diários", icon: <Calendar className="w-4 h-4" />, group: "Engajamento" },
  { id: "extras", label: "Materiais Extras", icon: <Package className="w-4 h-4" />, group: "Engajamento" },
  { id: "access", label: "Acesso & Premium", icon: <Lock className="w-4 h-4" />, group: "Controle" },
  { id: "students", label: "Alunas", icon: <Users className="w-4 h-4" />, group: "Gestão" },
  { id: "analytics", label: "Análises", icon: <BarChart3 className="w-4 h-4" />, group: "Gestão" },
  { id: "beta-metrics", label: "Beta · Validação", icon: <Sparkles className="w-4 h-4" />, group: "Gestão" },
];

const AdminSidebar = ({ active, onChange }: AdminSidebarProps) => {
  const groups = [...new Set(sections.map(s => s.group))];

  return (
    <aside className="w-56 shrink-0 border-r border-border/50 bg-card/30 min-h-[calc(100vh-57px)]">
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

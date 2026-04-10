import { Users, TrendingUp, Award, BookOpen } from "lucide-react";

const AdminStudents = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg text-foreground">Alunas</h2>
        <p className="text-sm text-muted-foreground">Visualize o progresso das alunas cadastradas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: <Users className="w-5 h-5" />, label: "Total de Alunas", value: "0", change: "" },
          { icon: <BookOpen className="w-5 h-5" />, label: "Lições Completas", value: "0", change: "" },
          { icon: <TrendingUp className="w-5 h-5" />, label: "Ativas (7d)", value: "0", change: "" },
          { icon: <Award className="w-5 h-5" />, label: "Certificados", value: "0", change: "" },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-xl border border-border/50 bg-card/50 text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary">
              {stat.icon}
            </div>
            <p className="text-2xl font-heading text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-xl border border-border/50 bg-card/30 text-center">
        <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Os dados das alunas aparecerão aqui quando o sistema de autenticação estiver ativo.</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Com Lovable Cloud, você pode gerenciar usuários, progresso e ranking.</p>
      </div>
    </div>
  );
};

export default AdminStudents;

import { BarChart3, TrendingUp, Eye, Clock } from "lucide-react";

const AdminAnalytics = () => {
  const topModules = [
    { name: "Arcanos Maiores", views: "—", completion: "—" },
    { name: "Fundamentos do Tarô", views: "—", completion: "—" },
    { name: "Naipe de Copas", views: "—", completion: "—" },
    { name: "Combinações", views: "—", completion: "—" },
    { name: "Tiragens", views: "—", completion: "—" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg text-foreground">Análises</h2>
        <p className="text-sm text-muted-foreground">Métricas de engajamento e performance da plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: <Eye className="w-5 h-5" />, label: "Total de Acessos", value: "—" },
          { icon: <TrendingUp className="w-5 h-5" />, label: "Média de Acerto", value: "—" },
          { icon: <Clock className="w-5 h-5" />, label: "Tempo Médio/Sessão", value: "—" },
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

      <div>
        <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-3">Módulos mais acessados</h3>
        <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Módulo</th>
                <th className="text-center p-3 text-xs text-muted-foreground font-medium">Visualizações</th>
                <th className="text-center p-3 text-xs text-muted-foreground font-medium">Conclusão</th>
              </tr>
            </thead>
            <tbody>
              {topModules.map((mod, i) => (
                <tr key={mod.name} className="border-b border-border/10 last:border-0">
                  <td className="p-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">{i + 1}</span>
                    <span className="text-foreground">{mod.name}</span>
                  </td>
                  <td className="p-3 text-center text-muted-foreground">{mod.views}</td>
                  <td className="p-3 text-center text-muted-foreground">{mod.completion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
        <p className="text-sm text-foreground font-medium mb-1">📊 Dados em tempo real</p>
        <p className="text-xs text-muted-foreground">
          As métricas serão preenchidas automaticamente quando a autenticação e o tracking estiverem ativos via Lovable Cloud.
        </p>
      </div>
    </div>
  );
};

export default AdminAnalytics;

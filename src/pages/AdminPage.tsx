import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Users, BookOpen, BarChart3 } from "lucide-react";
import { ARCANOS_MAIORES } from "@/data/tarot-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Tab = "arcanos" | "students" | "analytics";

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("arcanos");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "arcanos", label: "Arcanos", icon: <BookOpen className="w-4 h-4" /> },
    { id: "students", label: "Alunos", icon: <Users className="w-4 h-4" /> },
    { id: "analytics", label: "Análises", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-mystic-glow pointer-events-none" />

      <header className="relative z-10 border-b border-gold">
        <div className="container max-w-5xl py-3 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-lg text-gradient-gold tracking-wider">Painel Administrativo</h1>
        </div>
      </header>

      <div className="relative z-10 container max-w-5xl px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground bg-muted/50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Arcanos Tab */}
        {activeTab === "arcanos" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-sm text-muted-foreground tracking-widest uppercase">Gerenciar Arcanos</h2>
              <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
                <Plus className="w-4 h-4" /> Novo Arcano
              </Button>
            </div>

            <div className="grid gap-3">
              {ARCANOS_MAIORES.map((arcano) => (
                <div
                  key={arcano.id}
                  className="card-mystic p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-heading text-sm text-primary">
                      {arcano.numeral}
                    </span>
                    <div>
                      <h3 className="font-heading text-sm text-foreground">{arcano.name}</h3>
                      <p className="text-xs text-muted-foreground">{arcano.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${arcano.unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {arcano.unlocked ? "Publicado" : "Rascunho"}
                    </span>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="space-y-4">
            <h2 className="font-heading text-sm text-muted-foreground tracking-widest uppercase mb-4">Alunos</h2>
            <div className="card-mystic p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                Conecte um backend para visualizar dados dos alunos.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Com Lovable Cloud, você pode gerenciar usuários, progresso e ranking.
              </p>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-4">
            <h2 className="font-heading text-sm text-muted-foreground tracking-widest uppercase mb-4">Análises</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Total de Acessos", value: "—", desc: "Requer backend" },
                { label: "Lições Completas", value: "—", desc: "Requer backend" },
                { label: "Média de Acerto", value: "—", desc: "Requer backend" },
              ].map((stat) => (
                <div key={stat.label} className="card-mystic p-5 text-center">
                  <p className="text-2xl font-heading text-gradient-gold">{stat.value}</p>
                  <p className="text-sm text-foreground mt-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

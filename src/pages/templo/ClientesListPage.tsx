import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, Plus, UserPlus, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ClientesListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: clientes, isLoading } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data;
    },
  });

  const filteredClientes = clientes?.filter(c => {
    const matchesSearch = c.nome.toLowerCase().includes(search.toLowerCase()) || 
                         c.whatsapp.includes(search);
    const matchesStatus = statusFilter === "all" || c.status_comercial === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-templo-gold uppercase tracking-tighter">
            Gestão de Clientes
          </h1>
          <p className="text-templo-ivory/40 text-sm">Organize as almas que buscam sua orientação.</p>
        </div>
        
        <Button 
          onClick={() => navigate("/templo/clientes/novo")}
          className="bg-templo-red hover:bg-templo-red/90 text-templo-ivory gap-2 px-6 h-12 rounded-xl font-bold"
        >
          <UserPlus className="w-5 h-5" />
          Nova Cliente
        </Button>
      </header>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-templo-black/40 border border-templo-gold/10 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-templo-gold/40" />
          <Input 
            placeholder="Buscar por nome ou WhatsApp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-templo-black/50 border-templo-gold/20 text-templo-ivory rounded-xl h-11 focus:ring-templo-gold/30"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-templo-black/50 border border-templo-gold/20 text-templo-ivory rounded-xl px-4 h-11 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-templo-gold/30"
          >
            <option value="all">Todos os Status</option>
            <option value="Nova cliente">Nova cliente</option>
            <option value="Consulta feita">Consulta feita</option>
            <option value="Magia indicada">Magia indicada</option>
            <option value="Magia contratada">Magia contratada</option>
          </select>
        </div>
      </div>

      {/* Clientes Grid/List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-20 text-templo-gold/40 animate-pulse uppercase tracking-[0.3em] text-xs">Carregando Almas...</div>
        ) : filteredClientes?.length === 0 ? (
          <div className="bg-templo-black/40 border border-templo-gold/10 rounded-2xl p-20 text-center space-y-4">
            <p className="font-display text-2xl text-templo-gold/30 italic">Nenhuma cliente encontrada.</p>
            <Button variant="outline" onClick={() => setSearch("")} className="border-templo-gold/20 text-templo-gold">Limpar busca</Button>
          </div>
        ) : (
          filteredClientes?.map((c) => (
            <div 
              key={c.id} 
              className="bg-templo-black/40 border border-templo-gold/10 p-5 rounded-2xl hover:border-templo-gold/30 transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-templo-red/10 border border-templo-red/20 flex items-center justify-center font-display text-templo-red text-xl font-bold">
                  {c.nome[0]}
                </div>
                <div>
                  <h3 className="font-bold text-templo-ivory group-hover:text-templo-gold transition-colors">{c.nome}</h3>
                  <div className="flex items-center gap-3 text-xs text-templo-ivory/40 mt-1">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {c.whatsapp}</span>
                    <span className="text-templo-gold/30">•</span>
                    <span>{c.nome_envolvido ? `Envolvido: ${c.nome_envolvido}` : "Sem envolvido"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  c.status_comercial === 'Magia contratada' ? 'bg-templo-red/20 text-templo-red border border-templo-red/30' :
                  c.status_comercial === 'Magia indicada' ? 'bg-templo-purple/20 text-templo-purple border border-templo-purple/30' :
                  'bg-templo-gold/10 text-templo-gold border border-templo-gold/20'
                }`}>
                  {c.status_comercial}
                </span>
                
                <div className="flex gap-2 flex-1 md:flex-none">
                  <Button 
                    variant="ghost" 
                    className="flex-1 md:flex-none h-10 w-10 p-0 rounded-xl bg-white/5 border border-white/5 hover:border-templo-gold/30 hover:bg-templo-gold/10 text-templo-gold"
                    onClick={() => window.open(`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`, '_blank')}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/templo/clientes/${c.id}`)}
                    className="flex-1 md:flex-none border-templo-gold/20 text-templo-gold hover:bg-templo-gold/10 h-10 rounded-xl text-xs font-bold px-6"
                  >
                    VER FICHA
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

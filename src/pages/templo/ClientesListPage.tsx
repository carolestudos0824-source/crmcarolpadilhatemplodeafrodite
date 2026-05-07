import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  MessageSquare,
  MoreVertical,
  UserPlus,
  Users as UsersIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { storage, Client } from "@/lib/storage";
import { cn } from "@/lib/utils";

const statusOptions = [
  "Todas", "Nova cliente", "Consulta feita", "Magia indicada", 
  "Magia oferecida", "Magia contratada", "Em acompanhamento", 
  "Finalizada", "Arquivada"
];

export function ClientesListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todas");
  const clients = useMemo(() => storage.getClients(), []);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = 
        client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.whatsapp.includes(searchTerm) ||
        client.nomePessoaEnvolvida.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.situacaoPrincipal.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === "Todas" || client.statusComercial === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, selectedStatus]);

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111111] font-display">Clientes</h1>
          <p className="text-[#111111]/60 font-medium">Gerencie sua base de consulentes.</p>
        </div>
        <Link to="/templo/clientes/novo">
          <Button className="bg-[#A61E25] hover:bg-[#A61E25]/90 text-white rounded-2xl h-14 px-6 shadow-lg shadow-[#A61E25]/20 gap-2 font-bold transition-all active:scale-95 w-full md:w-auto">
            <UserPlus className="w-5 h-5" />
            NOVA CLIENTE
          </Button>
        </Link>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#111111]/30" />
            <Input 
              placeholder="Buscar por nome, WhatsApp ou situação..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white border-[#C9A35A]/20 h-14 rounded-2xl focus:ring-[#A61E25]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all",
                selectedStatus === status 
                  ? "bg-[#A61E25] border-[#A61E25] text-white shadow-md shadow-[#A61E25]/20" 
                  : "bg-white border-[#C9A35A]/20 text-[#111111]/60 hover:border-[#A61E25]/40"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Clientes Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredClients.length > 0 ? (
          filteredClients.map((cliente) => (
            <div key={cliente.id} className="bg-white p-6 rounded-[2rem] border border-[#C9A35A]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between hover:border-[#C9A35A]/40 transition-all group">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-14 h-14 rounded-full bg-[#EBE5DB] flex items-center justify-center font-bold text-[#111111] text-xl italic border border-[#C9A35A]/20 shadow-inner">
                  {cliente.nome[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">{cliente.nome}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#111111]/40 font-bold uppercase tracking-widest mt-1">
                    <span className="text-[#C9A35A]">{cliente.whatsapp}</span>
                    <span>•</span>
                    <span>{cliente.nomePessoaEnvolvida}</span>
                    <span>•</span>
                    <span className="italic normal-case font-medium">{cliente.situacaoPrincipal}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40 font-sans-clean">Status</span>
                  <span className="bg-[#A61E25]/10 text-[#A61E25] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1 font-sans-clean">
                    {cliente.statusComercial}
                  </span>
                </div>

                <div className="flex gap-2 ml-auto md:ml-0">
                  <Link to={`/templo/clientes/${cliente.id}`}>
                    <Button variant="ghost" className="rounded-xl font-bold text-[#111111] group-hover:text-[#A61E25] gap-1 px-4 font-sans-clean">
                      ABRIR FICHA
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/50 p-12 rounded-[2.5rem] border border-dashed border-[#C9A35A]/20 text-center space-y-6">
            <UsersIcon className="w-16 h-16 text-[#C9A35A]/20 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#111111]">Nenhuma cliente encontrada.</h3>
              <p className="text-sm text-[#111111]/40 max-w-xs mx-auto font-sans-clean">
                {searchTerm || selectedStatus !== "Todas" 
                  ? "Tente ajustar seus filtros ou busca." 
                  : "Cadastre sua primeira consulente para começar a usar o CRM."}
              </p>
            </div>
            <Link to="/templo/clientes/novo">
              <Button className="bg-[#A61E25] text-white font-bold px-8 h-14 rounded-2xl shadow-lg shadow-[#A61E25]/20 font-sans-clean">
                CADASTRAR PRIMEIRA CLIENTE
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
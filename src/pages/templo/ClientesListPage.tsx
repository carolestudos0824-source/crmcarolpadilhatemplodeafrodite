import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  MessageSquare,
  MoreVertical,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockClientes = [
  { id: 1, name: "Mariana Silva", whatsapp: "(11) 99999-9999", involved: "Rodrigo", situation: "Término recente", status: "Fez consulta", lastAttendance: "15/05/2026" },
  { id: 2, name: "Beatriz Oliveira", whatsapp: "(21) 98888-8888", involved: "Cássio", situation: "Ele bloqueia e desbloqueia", status: "Magia contratada", lastAttendance: "14/05/2026" },
  { id: 3, name: "Julia Santos", whatsapp: "(11) 97777-7777", involved: "Fábio", situation: "Relação fria", status: "Em acompanhamento", lastAttendance: "10/05/2026" },
  { id: 4, name: "Fernanda Lima", whatsapp: "(31) 96666-6666", involved: "Mateus", situation: "Terceira pessoa", status: "Arquivada", lastAttendance: "01/05/2026" },
];

export function ClientesListPage() {
  const [searchTerm, setSearchTerm] = useState("");

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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#111111]/30" />
          <Input 
            placeholder="Buscar por nome ou WhatsApp..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 bg-white border-[#C9A35A]/20 h-14 rounded-2xl focus:ring-[#A61E25]"
          />
        </div>
        <Button variant="outline" className="h-14 rounded-2xl border-[#C9A35A]/20 bg-white gap-2 font-bold px-6">
          <Filter className="w-5 h-5 text-[#C9A35A]" />
          FILTROS
        </Button>
      </div>

      {/* Clientes Grid */}
      <div className="grid grid-cols-1 gap-4">
        {mockClientes.map((cliente) => (
          <div key={cliente.id} className="bg-white p-6 rounded-[2rem] border border-[#C9A35A]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between hover:border-[#C9A35A]/40 transition-all group">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-14 h-14 rounded-full bg-[#ECE5DC] flex items-center justify-center font-bold text-[#111111] text-xl italic border border-[#C9A35A]/20 shadow-inner">
                {cliente.name[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111111]">{cliente.name}</h3>
                <div className="flex items-center gap-2 text-xs text-[#111111]/40 font-bold uppercase tracking-widest mt-1">
                  <span className="text-[#C9A35A]">{cliente.whatsapp}</span>
                  <span>•</span>
                  <span>{cliente.involved}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col items-start md:items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40">Status</span>
                <span className="bg-[#A61E25]/10 text-[#A61E25] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1">
                  {cliente.status}
                </span>
              </div>

              <div className="hidden lg:flex flex-col items-end px-6 border-x border-[#F4F0EA]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40">Último Atendimento</span>
                <span className="text-sm font-medium text-[#111111] mt-1">{cliente.lastAttendance}</span>
              </div>

              <div className="flex gap-2 ml-auto md:ml-0">
                <Button size="icon" variant="ghost" className="rounded-xl text-[#C9A35A] hover:bg-[#C9A35A]/10 h-12 w-12">
                  <MessageSquare className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-xl text-[#111111]/20 hover:text-[#A61E25] h-12 w-12">
                  <MoreVertical className="w-5 h-5" />
                </Button>
                <Button variant="ghost" className="rounded-xl font-bold text-[#111111] group-hover:text-[#A61E25] gap-1 px-4">
                  VER FICHA
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
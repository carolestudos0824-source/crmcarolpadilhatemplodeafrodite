import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, MessageCircle, Phone, Instagram, Calendar, Heart, Info, 
  ChevronRight, Clock, Zap, MessageSquare, Plus, FileText, Copy, RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { toast } from "@/hooks/use-toast";

export function ClienteProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = useMemo(() => id ? storage.getClientById(id) : null, [id]);
  const appointments = useMemo(() => id ? storage.getAppointmentsByClient(id) : [], [id]);

  if (!client) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-[#111111]">Cliente não encontrada.</h2>
        <Button onClick={() => navigate("/templo/clientes")} className="mt-4">VOLTAR</Button>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "Conteúdo copiado." });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20 px-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl border border-[#C9A35A]/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#111111] font-display">{client.nome}</h1>
            <p className="text-[#C9A35A] font-bold uppercase text-[10px] tracking-widest">{client.statusComercial}</p>
          </div>
        </div>
        <Link to="/templo/novo-atendimento">
          <Button className="bg-[#A61E25] text-white rounded-2xl h-14 px-8 font-bold shadow-lg shadow-[#A61E25]/20 gap-2 font-sans-clean">
            <Plus className="w-5 h-5" />
            NOVO ATENDIMENTO
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Lateral: Dados */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#EBE5DB] flex items-center justify-center font-bold text-[#111111] text-3xl italic border border-[#C9A35A]/20 mx-auto shadow-inner">
              {client.nome[0]}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-[#C9A35A]" />
                <span className="text-[#111111] font-medium">{client.whatsapp}</span>
              </div>
              {client.instagram && (
                <div className="flex items-center gap-3 text-sm">
                  <Instagram className="w-4 h-4 text-[#C9A35A]" />
                  <span className="text-[#111111] font-medium">{client.instagram}</span>
                </div>
              )}
              {client.dataNascimento && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-[#C9A35A]" />
                  <span className="text-[#111111] font-medium">Nasceu em: {new Date(client.dataNascimento).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="border-t border-[#F2EFE8] pt-6 space-y-4">
              <div>
                <label className="text-[9px] font-bold uppercase text-[#111111]/30 tracking-widest block mb-1">Envolvido(a)</label>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#A61E25]" />
                  <span className="text-[#111111] font-bold">{client.nomePessoaEnvolvida}</span>
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-[#111111]/30 tracking-widest block mb-1">Status da Relação</label>
                <span className="text-[#111111] font-medium">{client.statusRelacao}</span>
              </div>
            </div>
          </div>

          {client.observacoesPrivadas && (
            <div className="bg-[#111111] p-6 rounded-[2rem] border border-[#C9A35A]/20 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#C9A35A]">
                <Lock className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Notas Privadas</h3>
              </div>
              <p className="text-white/70 text-xs leading-relaxed font-sans-clean">{client.observacoesPrivadas}</p>
            </div>
          )}
        </div>

        {/* Coluna Central: Histórico */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#111111] font-display">Histórico de Atendimentos</h2>
              <span className="bg-[#EBE5DB] px-3 py-1 rounded-full text-[10px] font-bold text-[#111111]/40 uppercase tracking-widest">
                {appointments.length} registros
              </span>
            </div>

            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((app) => (
                  <div key={app.id} className="bg-white p-6 rounded-[2rem] border border-[#C9A35A]/10 shadow-sm space-y-4 hover:border-[#A61E25]/30 transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F2EFE8] flex items-center justify-center text-[#A61E25]">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#111111] text-sm">{app.situacaoAmorosa}</h4>
                          <p className="text-[10px] text-[#111111]/40 uppercase font-bold tracking-tighter">
                            {new Date(app.createdAt).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold text-[#A61E25] uppercase bg-[#A61E25]/5 px-3 py-1 rounded-full">
                           {app.magiasIndicadas}
                         </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                       {Object.entries(app.cartasConfirmadas).slice(0, 6).map(([posId, card]: any) => (
                         <div key={posId} className="text-center p-2 bg-[#F2EFE8]/50 rounded-lg border border-[#C9A35A]/5">
                           <span className="text-[8px] block text-[#111111]/30 uppercase font-bold truncate">Pos {posId}</span>
                           <span className="text-[9px] font-bold text-[#111111] uppercase truncate block">{card.name}</span>
                         </div>
                       ))}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => copyToClipboard(app.textoWhatsapp)}
                        className="rounded-xl border-[#111111]/10 text-xs font-bold gap-2 font-sans-clean"
                      >
                        <Copy className="w-3 h-3" /> COPIAR WHATSAPP
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="rounded-xl border-[#111111]/10 text-xs font-bold gap-2 font-sans-clean"
                      >
                        <Eye className="w-3 h-3" /> VER LEITURA
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#EBE5DB]/30 p-12 rounded-[2.5rem] border border-dashed border-[#C9A35A]/20 text-center space-y-4">
                <Clock className="w-10 h-10 text-[#C9A35A]/30 mx-auto" />
                <div className="space-y-1">
                  <p className="text-[#111111] font-bold font-sans-clean">Nenhum atendimento realizado para esta cliente.</p>
                  <p className="text-xs text-[#111111]/40 font-sans-clean">Inicie a primeira tiragem agora mesmo.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

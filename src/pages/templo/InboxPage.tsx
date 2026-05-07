import { useState, useMemo } from 'react';
import { 
  Inbox, 
  Search, 
  Filter, 
  UserPlus, 
  Play, 
  Trash2, 
  MessageSquare, 
  Instagram, 
  Copy, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Archive,
  Eye
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { leadService } from '@/types/templo/leadService';
import { Lead } from '@/types/templo/lead';
import { storage } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function InboxPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>(() => leadService.getLeads());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => 
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.whatsapp.includes(searchTerm) ||
      lead.situacaoAmorosa.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm]);

  const handleUpdateStatus = async (id: string, status: Lead['status']) => {
    await leadService.updateLeadStatus(id, status);
    setLeads(leadService.getLeads());
    toast({ title: "Status atualizado", description: `Lead movido para ${status}.` });
  };

  const handleArchive = async (id: string) => {
    await handleUpdateStatus(id, 'Arquivada');
  };

  const handleConvertToClient = async (lead: Lead) => {
    const clients = storage.getClients();
    
    // Check if already exists
    const exists = clients.find(c => c.whatsapp === lead.whatsapp);
    if (exists) {
      toast({ title: "Atenção", description: "Já existe uma cliente com este WhatsApp.", variant: "destructive" });
      return;
    }

    const newClient = {
      id: Math.random().toString(36).substr(2, 9),
      nome: lead.nome,
      whatsapp: lead.whatsapp,
      instagram: lead.instagram,
      origem: 'Pré-atendimento',
      statusComercial: 'Nova cliente',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedClients = [newClient, ...clients];
    localStorage.setItem('templo_afrodite_clients', JSON.stringify(updatedClients));
    
    await handleUpdateStatus(lead.id, 'Cliente criada');
    
    toast({ 
      title: "Cliente criada!", 
      description: "A ficha foi adicionada ao seu CRM.",
    });

    setIsViewModalOpen(false);
  };

  const handleStartAttendance = (lead: Lead) => {
    // We need to pass lead info to NovoAtendimentoPage
    // Since it's localStorage, we can pre-fill or use search params
    // Let's use search params or just navigate to the client profile first
    const clients = storage.getClients();
    const client = clients.find(c => c.whatsapp === lead.whatsapp);
    
    if (!client) {
      toast({ title: "Atenção", description: "Transforme o lead em cliente primeiro.", variant: "destructive" });
      return;
    }

    // Mark lead as attendance started
    handleUpdateStatus(lead.id, 'Atendimento iniciado');
    
    // Navigate to new attendance with pre-filled data
    // We'll need to modify NovoAtendimentoPage to accept these
    navigate(`/templo/novo-atendimento?clientId=${client.id}&situation=${encodeURIComponent(lead.situacaoAmorosa)}&relato=${encodeURIComponent(lead.relato)}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "WhatsApp copiado para a área de transferência." });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111111] font-display italic">Caixa de Entrada</h1>
          <p className="text-[#111111]/60 font-medium">Gerencie seus pré-atendimentos públicos.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/30 group-focus-within:text-[#C9A35A] transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar leads..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 bg-white border border-[#C9A35A]/10 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A35A]/30 w-full md:w-64"
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <div 
              key={lead.id} 
              className={cn(
                "bg-white p-6 rounded-[2rem] border transition-all hover:shadow-lg group",
                lead.status === 'Novo lead' ? "border-[#A61E25]/30 shadow-sm" : "border-[#C9A35A]/10"
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg italic border",
                    lead.status === 'Novo lead' ? "bg-[#A61E25]/5 border-[#A61E25]/20 text-[#A61E25]" : "bg-[#F4F0EA] border-[#C9A35A]/20 text-[#111111]"
                  )}>
                    {lead.nome[0]}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[#111111]">{lead.nome}</h3>
                      {lead.status === 'Novo lead' && (
                        <span className="bg-[#A61E25] text-white text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full">NOVO</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#111111]/60">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
                      <span className="w-1 h-1 bg-[#C9A35A]/30 rounded-full" />
                      <span className="text-[#A61E25] font-bold">{lead.situacaoAmorosa}</span>
                    </div>
                    <p className="text-xs text-[#111111]/40 line-clamp-1 italic">"{lead.relato}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:self-center">
                  <div className="hidden lg:block text-right mr-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/30">Interesse</p>
                    <p className="text-xs font-bold text-[#C9A35A]">{lead.servicoInteresse}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-xl h-10 border-[#C9A35A]/20 text-[#111111] hover:bg-[#F4F0EA]"
                      onClick={() => {
                        setSelectedLead(lead);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" /> Ver Caso
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="rounded-xl h-10 w-10 text-[#111111]/40 hover:text-[#A61E25]"
                      onClick={() => handleArchive(lead.id)}
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/50 p-20 rounded-[2.5rem] border border-dashed border-[#C9A35A]/20 text-center space-y-4">
            <Inbox className="w-12 h-12 text-[#C9A35A]/30 mx-auto" />
            <div>
              <p className="text-[#111111] font-bold">Sua caixa de entrada está vazia.</p>
              <p className="text-[#111111]/40 text-sm">Divulgue seu link de pré-atendimento para receber novos casos.</p>
            </div>
          </div>
        )}
      </div>

      {/* View Lead Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl bg-[#F4F0EA] border-none rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
          {selectedLead && (
            <>
              <div className="bg-[#111111] p-8 text-white relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#C9A35A] flex items-center justify-center text-white font-display text-3xl italic shadow-lg shadow-[#C9A35A]/20">
                    {selectedLead.nome[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-display italic">{selectedLead.nome}</h2>
                    <p className="text-[#C9A35A] text-[10px] uppercase tracking-widest font-bold">PRÉ-ATENDIMENTO RECEBIDO</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => copyToClipboard(selectedLead.whatsapp)}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <MessageSquare className="w-3 h-3 text-[#25D366]" /> {selectedLead.whatsapp}
                  </button>
                  {selectedLead.instagram && (
                    <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                      <Instagram className="w-3 h-3 text-[#E4405F]" /> {selectedLead.instagram}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40">Situação Amorosa</p>
                    <p className="text-[#A61E25] font-bold">{selectedLead.situacaoAmorosa}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40">Serviço de Interesse</p>
                    <p className="text-[#C9A35A] font-bold">{selectedLead.servicoInteresse}</p>
                  </div>
                  {selectedLead.nomePessoaEnvolvida && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40">Pessoa Envolvida</p>
                      <p className="font-bold text-[#111111]">{selectedLead.nomePessoaEnvolvida}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40">Data de Envio</p>
                    <p className="font-bold text-[#111111]">{new Date(selectedLead.createdAt).toLocaleString('pt-BR')}</p>
                  </div>
                </div>

                <div className="space-y-3 bg-white p-6 rounded-2xl border border-[#C9A35A]/10 italic">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40 not-italic mb-2">Relato da Cliente</p>
                   <p className="text-[#111111]/80 leading-relaxed">"{selectedLead.relato}"</p>
                </div>
              </div>

              <DialogFooter className="p-8 bg-white border-t border-[#C9A35A]/10 flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="rounded-xl h-14 border-[#C9A35A]/20 flex-1 font-bold uppercase tracking-widest text-[10px]"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Fechar
                </Button>
                
                {selectedLead.status !== 'Cliente criada' && selectedLead.status !== 'Atendimento iniciado' ? (
                  <Button 
                    className="bg-[#C9A35A] hover:bg-[#B89249] text-white rounded-xl h-14 flex-1 font-bold uppercase tracking-widest text-[10px] gap-2"
                    onClick={() => handleConvertToClient(selectedLead)}
                  >
                    <UserPlus className="w-4 h-4" /> Transformar em Cliente
                  </Button>
                ) : (
                  <Button 
                    className="bg-[#A61E25] hover:bg-[#8B191F] text-white rounded-xl h-14 flex-1 font-bold uppercase tracking-widest text-[10px] gap-2"
                    onClick={() => handleStartAttendance(selectedLead)}
                  >
                    <Play className="w-4 h-4 fill-current" /> Iniciar Jogo do Amor
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

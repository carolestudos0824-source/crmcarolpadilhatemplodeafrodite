import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Search, 
  Eye, 
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  FileText,
  Volume2,
  Lock
} from 'lucide-react';
import { leadService } from '@/types/templo/leadService';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PortalAcompanhar() {
  const [whatsapp, setWhatsapp] = useState('');
  const [searchDone, setSearchTerm] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // In a real Supabase app, this would be authenticated. 
  // For localStorage, we'll "search" by WhatsApp to see cases.
  const leads = useMemo(() => {
    if (!searchDone) return [];
    return leadService.getLeads().filter(l => l.whatsapp === whatsapp);
  }, [searchDone, whatsapp]);

  // Also search for appointments if client already exists
  const appointments = useMemo(() => {
    if (!searchDone) return [];
    const client = storage.getClients().find(c => c.whatsapp === whatsapp);
    if (!client) return [];
    return storage.getAppointmentsByClient(client.id).filter(a => a.isDeliveredToPortal);
  }, [searchDone, whatsapp]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (whatsapp) setSearchTerm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Novo': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Em análise': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Aguardando pagamento': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Em preparo': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Leitura entregue': return 'bg-green-50 text-green-600 border-green-100';
      case 'Finalizado': return 'bg-gray-50 text-gray-400 border-gray-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-display text-[#111111] italic leading-tight">Acompanhar Atendimento</h1>
        <p className="text-[#111111]/60 font-medium uppercase tracking-[0.2em] text-[10px] max-w-sm mx-auto">
          Veja o progresso do seu caso e acesse suas orientações.
        </p>
      </div>

      {!searchDone ? (
        <div className="max-w-md mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-[#C9A35A]/10 space-y-8">
           <div className="w-16 h-16 bg-[#C9A35A]/10 rounded-2xl flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-[#C9A35A]" />
           </div>
           <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40 ml-1 text-center block">Digite seu WhatsApp para buscar</label>
                 <input
                   required
                   type="tel"
                   value={whatsapp}
                   onChange={(e) => setWhatsapp(e.target.value)}
                   className="w-full h-16 bg-[#F4F0EA]/50 border border-[#C9A35A]/10 rounded-2xl px-6 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#C9A35A]/20 transition-all"
                   placeholder="(00) 00000-0000"
                 />
              </div>
              <Button type="submit" className="w-full h-16 bg-[#111111] text-white rounded-2xl font-bold uppercase tracking-widest text-xs">
                 BUSCAR MEU CASO
              </Button>
           </form>
           <p className="text-[9px] text-[#111111]/30 text-center uppercase tracking-widest italic leading-relaxed">
             * A busca é feita apenas neste dispositivo devido ao uso de armazenamento local.
           </p>
        </div>
      ) : (
        <div className="space-y-8">
           <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setSearchTerm(false)} className="text-[#111111]/40 hover:text-[#A61E25] text-xs font-bold uppercase tracking-widest">
                 ← Nova Busca
              </Button>
              <div className="text-right">
                 <p className="text-[9px] font-bold uppercase tracking-widest text-[#111111]/30">WhatsApp informado</p>
                 <p className="text-xs font-bold text-[#111111]">{whatsapp}</p>
              </div>
           </div>

           {leads.length === 0 && appointments.length === 0 ? (
             <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-[#C9A35A]/20 text-center space-y-4">
                <ClipboardList className="w-12 h-12 text-[#C9A35A]/20 mx-auto" />
                <p className="text-[#111111] font-bold">Nenhum caso encontrado para este número.</p>
                <p className="text-[#111111]/40 text-xs">Se você acabou de enviar, aguarde alguns instantes.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 gap-6">
                {/* Leads ativos */}
                {leads.map(lead => (
                  <div key={lead.id} className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-[#111111]">{lead.tipoAtendimento}</h3>
                              <span className={cn("px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border", getStatusColor(lead.status))}>
                                 {lead.status}
                              </span>
                           </div>
                           <p className="text-xs text-[#111111]/40 uppercase tracking-widest font-bold">Enviado em {new Date(lead.createdAt).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                           {lead.status === 'Leitura entregue' ? (
                             <Button className="bg-[#A61E25] text-white rounded-xl h-10 px-4 text-xs font-bold gap-2">
                                <Eye className="w-4 h-4" /> VER MINHA LEITURA
                             </Button>
                           ) : (
                             <div className="text-[10px] text-[#C9A35A] font-bold uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-4 h-4 animate-spin-slow" /> AGUARDANDO ANÁLISE
                             </div>
                           )}
                        </div>
                     </div>
                     
                     {lead.status === 'Aguardando pagamento' && (
                       <div className="bg-[#A61E25]/5 border-2 border-[#A61E25]/20 rounded-2xl p-6 flex items-start gap-4 animate-pulse-slow">
                          <ShieldAlert className="w-6 h-6 text-[#A61E25] shrink-0" />
                          <div className="space-y-2">
                             <p className="text-sm font-bold text-[#111111]">Pagamento pendente</p>
                             <p className="text-xs text-[#111111]/60 leading-relaxed">Seu caso já foi analisado. Realize o pagamento para que a Carol possa iniciar sua tiragem e preparar sua orientação.</p>
                             <Button size="sm" className="bg-[#A61E25] text-white text-[10px] h-8 rounded-lg mt-2">ENVIAR COMPROVANTE</Button>
                          </div>
                       </div>
                     )}
                  </div>
                ))}

                {/* Appointments entregues */}
                {appointments.map(app => (
                  <div key={app.id} className="bg-[#111111] p-8 rounded-[2.5rem] border border-[#C9A35A]/30 shadow-xl space-y-6 text-white group cursor-pointer hover:scale-[1.01] transition-all"
                    onClick={() => {
                      setSelectedCase(app);
                      setIsModalOpen(true);
                    }}>
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-[#C9A35A]" />
                              <h3 className="text-xl font-display italic text-[#C9A35A]">Orientação Entregue</h3>
                           </div>
                           <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40">{app.situacaoAmorosa}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#A61E25] transition-colors">
                           <Eye className="w-6 h-6" />
                        </div>
                     </div>
                     <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Manifestada em {new Date(app.createdAt).toLocaleDateString('pt-BR')}</p>
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">Acesso Liberado</span>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      )}

      {/* Modal Leitura */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-[#F4F0EA] border-none rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
           {selectedCase && (
             <>
               <div className="bg-[#111111] p-8 text-white relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#A61E25] flex items-center justify-center text-white shadow-lg shadow-[#A61E25]/20">
                      <Heart className="w-8 h-8 fill-current" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display italic text-[#C9A35A]">Sua Orientação</h2>
                      <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Templo de Afrodite • Carol Padilha</p>
                    </div>
                  </div>
               </div>

               <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                  <section className="bg-white p-6 rounded-2xl border border-[#C9A35A]/10 space-y-4">
                     <div className="flex items-center gap-2 text-[#A61E25]">
                        <FileText className="w-4 h-4" />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Leitura para Cliente</h4>
                     </div>
                     <div className="text-[#111111]/80 leading-relaxed italic whitespace-pre-wrap">
                        {selectedCase.textoWhatsapp}
                     </div>
                  </section>

                  <section className="space-y-4">
                     <div className="flex items-center gap-2 text-[#C9A35A]">
                        <Volume2 className="w-4 h-4" />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Orientação em Áudio</h4>
                     </div>
                     <div className="bg-[#EBE5DB] p-8 rounded-2xl border border-dashed border-[#C9A35A]/30 text-center">
                        <Lock className="w-6 h-6 text-[#111111]/20 mx-auto mb-2" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40">Áudio será liberado na próxima etapa</p>
                     </div>
                  </section>

                  <div className="bg-[#111111] p-8 rounded-[2rem] text-white">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A35A] mb-2">Próximo Passo Orientado</p>
                     <p className="text-sm italic leading-relaxed text-white/80">Siga as instruções enviadas na leitura e mantenha seu coração aberto para as transformações.</p>
                  </div>
               </div>

               <div className="p-8 bg-white border-t border-[#C9A35A]/10 text-center">
                  <p className="text-[9px] text-[#111111]/30 uppercase tracking-widest italic mb-4">Esta orientação é confidencial e exclusiva para você.</p>
                  <Button onClick={() => setIsModalOpen(false)} className="w-full bg-[#111111] text-white h-14 rounded-2xl font-bold uppercase tracking-widest text-xs">FECHAR ORIENTAÇÃO</Button>
               </div>
             </>
           )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

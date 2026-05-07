import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, MessageCircle, Phone, Instagram, Calendar, Heart, Info, 
  ChevronRight, Clock, Zap, MessageSquare, Plus, FileText, Copy, RotateCcw,
  Lock, Eye, MapPin, Search, TrendingUp, DollarSign, Sparkles, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 px-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl border border-[#C9A35A]/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <h1 className="text-3xl font-bold text-[#111111] font-display">{client.nome}</h1>
               <span className={cn(
                 "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
                 client.temperatura === 'Quente' ? "bg-[#A61E25] text-white" : "bg-[#C9A35A]/20 text-[#C9A35A]"
               )}>
                 {client.temperatura || 'Morna'}
               </span>
            </div>
            <p className="text-[#C9A35A] font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
              <TrendingUp className="w-3 h-3" /> {client.statusComercial}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/templo/novo-atendimento">
            <Button className="bg-[#A61E25] text-white rounded-2xl h-14 px-8 font-bold shadow-lg shadow-[#A61E25]/20 gap-2">
              <Plus className="w-5 h-5" />
              NOVO ATENDIMENTO
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Dados Rápidos */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-8">
            <div className="relative mx-auto w-24 h-24">
              <div className="w-full h-full rounded-full bg-[#EBE5DB] flex items-center justify-center font-bold text-[#111111] text-4xl italic border-2 border-[#C9A35A]/20 shadow-inner">
                {client.nome[0]}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-[#C9A35A]/20 flex items-center justify-center shadow-md">
                 <Zap className={cn("w-4 h-4", client.temperatura === 'Quente' ? "text-[#A61E25]" : "text-[#C9A35A]")} />
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3 text-sm p-3 bg-[#F4F0EA]/50 rounded-xl border border-[#C9A35A]/5">
                <Phone className="w-4 h-4 text-[#C9A35A]" />
                <span className="text-[#111111] font-bold">{client.whatsapp}</span>
              </div>
              {client.instagram && (
                <div className="flex items-center gap-3 text-sm p-3 bg-[#F4F0EA]/50 rounded-xl border border-[#C9A35A]/5">
                  <Instagram className="w-4 h-4 text-[#C9A35A]" />
                  <span className="text-[#111111] font-bold">{client.instagram}</span>
                </div>
              )}
              {client.cidade && (
                <div className="flex items-center gap-3 text-sm p-3 bg-[#F4F0EA]/50 rounded-xl border border-[#C9A35A]/5">
                  <MapPin className="w-4 h-4 text-[#C9A35A]" />
                  <span className="text-[#111111] font-bold">{client.cidade}</span>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-[#F4F0EA]">
               <div>
                  <p className="text-[9px] font-bold uppercase text-[#111111]/30 tracking-widest mb-1">Status Comercial</p>
                  <p className="text-sm font-bold text-[#111111]">{client.statusComercial}</p>
               </div>
               <div>
                  <p className="text-[9px] font-bold uppercase text-[#111111]/30 tracking-widest mb-1">Origem</p>
                  <p className="text-sm font-bold text-[#111111]">{client.origem || 'Não informada'}</p>
               </div>
            </div>
          </div>

          <div className="bg-[#111111] p-8 rounded-[2.5rem] border border-[#C9A35A]/30 shadow-xl space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A35A] flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#A61E25] fill-[#A61E25]" /> A Pessoa Envolvida
            </h3>
            <div className="space-y-4">
               <div>
                  <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest mb-1">Nome</p>
                  <p className="text-lg font-bold text-white italic">{client.nomePessoaEnvolvida}</p>
               </div>
               <div>
                  <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest mb-1">Status da Relação</p>
                  <p className="text-sm font-bold text-[#C9A35A]">{client.statusRelacao}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Main Content: Tabs */}
        <div className="lg:col-span-3 space-y-8">
          <Tabs defaultValue="atendimentos" className="w-full">
            <TabsList className="bg-[#EBE5DB]/50 p-1 rounded-2xl h-auto flex-wrap justify-start gap-1">
              <TabsTrigger value="resumo" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#111111] data-[state=active]:text-white uppercase tracking-widest text-[10px] font-bold transition-all">Resumo</TabsTrigger>
              <TabsTrigger value="atendimentos" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#111111] data-[state=active]:text-white uppercase tracking-widest text-[10px] font-bold transition-all">Atendimentos</TabsTrigger>
              <TabsTrigger value="magias" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#111111] data-[state=active]:text-white uppercase tracking-widest text-[10px] font-bold transition-all">Magias</TabsTrigger>
              <TabsTrigger value="financeiro" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#111111] data-[state=active]:text-white uppercase tracking-widest text-[10px] font-bold transition-all">Financeiro</TabsTrigger>
              <TabsTrigger value="notas" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#111111] data-[state=active]:text-white uppercase tracking-widest text-[10px] font-bold transition-all">Notas</TabsTrigger>
            </TabsList>

            <TabsContent value="resumo" className="mt-8 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-4">
                     <h3 className="text-xs font-bold uppercase tracking-widest text-[#111111]/40">Situação Atual</h3>
                     <p className="text-xl font-bold text-[#111111] leading-relaxed italic">“{client.situacaoPrincipal}”</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-4">
                     <h3 className="text-xs font-bold uppercase tracking-widest text-[#111111]/40">Último Atendimento</h3>
                     <p className="text-xl font-bold text-[#111111]">{appointments.length > 0 ? new Date(appointments[0].createdAt).toLocaleDateString() : 'Nenhum'}</p>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="atendimentos" className="mt-8 space-y-6">
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((app) => (
                    <div key={app.id} className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6 hover:border-[#A61E25]/30 transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#F4F0EA] flex items-center justify-center text-[#A61E25]">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#111111] text-lg">{app.situacaoAmorosa}</h4>
                            <p className="text-xs text-[#111111]/40 uppercase font-bold tracking-widest">
                              {new Date(app.createdAt).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                           <span className="text-[10px] font-bold text-[#A61E25] uppercase bg-[#A61E25]/5 px-4 py-2 rounded-full border border-[#A61E25]/10">
                             {app.magiasIndicadas}
                           </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
                         {Object.entries(app.cartasConfirmadas).map(([posId, card]: any) => (
                           <div key={posId} className="text-center p-2 bg-[#F4F0EA]/50 rounded-xl border border-[#C9A35A]/5">
                             <span className="text-[7px] block text-[#111111]/30 uppercase font-bold truncate">Pos {posId}</span>
                             <span className="text-[8px] font-bold text-[#111111] uppercase truncate block">{card.name}</span>
                           </div>
                         ))}
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <Button variant="outline" onClick={() => copyToClipboard(app.textoWhatsapp)} className="rounded-xl border-[#C9A35A]/20 h-11 text-xs font-bold gap-2">
                          <Copy className="w-4 h-4" /> WHATSAPP
                        </Button>
                        <Button variant="outline" onClick={() => navigate(`/templo/novo-atendimento?view=${app.id}`)} className="rounded-xl border-[#C9A35A]/20 h-11 text-xs font-bold gap-2">
                          <Eye className="w-4 h-4" /> LEITURA
                        </Button>
                        <Button variant="outline" onClick={() => navigate(`/templo/novo-atendimento?reopen=${app.id}`)} className="rounded-xl border-[#C9A35A]/20 h-11 text-xs font-bold gap-2">
                          <RotateCcw className="w-4 h-4" /> REABRIR
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/50 p-16 rounded-[3rem] border border-dashed border-[#C9A35A]/20 text-center space-y-4">
                  <Clock className="w-12 h-12 text-[#C9A35A]/30 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-[#111111] font-bold text-lg">Nenhum atendimento realizado.</p>
                    <p className="text-sm text-[#111111]/40">Inicie a primeira tiragem agora mesmo.</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="magias" className="mt-8">
               <div className="bg-white/50 p-16 rounded-[3rem] border border-dashed border-[#C9A35A]/20 text-center space-y-4">
                  <Sparkles className="w-12 h-12 text-[#C9A35A]/30 mx-auto" />
                  <p className="text-[#111111] font-bold">Nenhuma magia contratada por esta cliente.</p>
               </div>
            </TabsContent>

            <TabsContent value="financeiro" className="mt-8">
               <div className="bg-white/50 p-16 rounded-[3rem] border border-dashed border-[#C9A35A]/20 text-center space-y-4">
                  <DollarSign className="w-12 h-12 text-[#C9A35A]/30 mx-auto" />
                  <p className="text-[#111111] font-bold">Nenhum registro financeiro pendente.</p>
               </div>
            </TabsContent>

            <TabsContent value="notas" className="mt-8">
               <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 text-[#111111]">
                    <Lock className="w-5 h-5 text-[#C9A35A]" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Notas Privadas</h3>
                  </div>
                  <div className="p-6 bg-[#F4F0EA]/50 rounded-2xl border border-[#C9A35A]/10 min-h-[150px] text-[#111111]/80 leading-relaxed italic">
                    {client.observacoesPrivadas || 'Nenhuma observação privada registrada.'}
                  </div>
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
    </div>
  );
}

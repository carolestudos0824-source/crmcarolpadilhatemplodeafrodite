import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  User, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Heart
} from 'lucide-react';
import { messageService } from '@/types/templo/messageService';
import { ChatMessage } from '@/types/templo/message';
import { leadService } from '@/types/templo/leadService';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function PortalMensagens() {
  const [whatsapp, setWhatsapp] = useState('');
  const [searchDone, setSearchDone] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In this local version, we search for lead or client by whatsapp
    const lead = leadService.getLeads().find(l => l.whatsapp === whatsapp);
    const client = storage.getClients().find(c => c.whatsapp === whatsapp);
    
    const id = client?.id || lead?.id;
    if (id) {
      setTargetId(id);
      setSearchDone(true);
      loadMessages(id);
    }
  };

  const loadMessages = (id: string) => {
    const msgs = messageService.getMessages(id);
    setMessages(msgs);
    messageService.markAsRead(id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !targetId) return;

    const isClient = storage.getClientById(targetId);
    
    await messageService.sendMessage({
      clientId: isClient ? targetId : undefined,
      leadId: !isClient ? targetId : undefined,
      sender: 'cliente',
      texto: newMessage,
    });

    setNewMessage('');
    loadMessages(targetId);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="space-y-10 animate-fade-in pb-20 px-4 h-full">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-display text-[#111111] italic leading-tight">Falar com Carol</h1>
        <p className="text-[#111111]/60 font-medium uppercase tracking-[0.2em] text-[10px] max-w-sm mx-auto">
          Tire suas dúvidas e acompanhe suas orientações em tempo real.
        </p>
      </div>

      {!searchDone ? (
        <div className="max-w-md mx-auto bg-white rounded-[2.5rem] p-12 shadow-xl border border-[#C9A35A]/10 space-y-8">
           <div className="w-16 h-16 bg-[#111111] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
           </div>
           <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40 ml-1 text-center block">Digite seu WhatsApp para iniciar</label>
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
                 ABRIR CHAT PRIVADO
              </Button>
           </form>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-[#C9A35A]/10 overflow-hidden flex flex-col h-[600px]">
           {/* Chat Header */}
           <div className="bg-[#111111] p-6 text-white flex items-center justify-between border-b border-[#C9A35A]/30">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-[#A61E25] flex items-center justify-center border border-[#C9A35A]/30">
                    <Heart className="w-6 h-6 fill-current" />
                 </div>
                 <div>
                    <h3 className="font-display italic text-lg text-[#C9A35A]">Carol Padilha</h3>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-white/40">Online agora</p>
                 </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSearchDone(false)} className="text-white/40 hover:text-white uppercase text-[10px] font-bold tracking-widest">Sair</Button>
           </div>

           {/* Chat Messages */}
           <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto bg-[#F4F0EA]/30 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                   <Sparkles className="w-12 h-12 text-[#C9A35A]" />
                   <p className="text-sm italic">Inicie sua conversa com a Carol.<br/>Ela responderá assim que possível.</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={cn(
                    "flex flex-col max-w-[85%] space-y-1",
                    msg.sender === 'cliente' ? "ml-auto items-end" : "mr-auto items-start"
                  )}>
                    <div className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.sender === 'cliente' 
                        ? "bg-[#111111] text-white rounded-tr-none" 
                        : "bg-white text-[#111111] border border-[#C9A35A]/20 rounded-tl-none"
                    )}>
                      {msg.texto}
                    </div>
                    <span className="text-[8px] uppercase tracking-widest font-bold text-[#111111]/30">
                       {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
           </div>

           {/* Chat Input */}
           <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-[#C9A35A]/10 flex gap-4">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-[#F4F0EA]/50 border border-[#C9A35A]/10 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#A61E25]/20"
              />
              <Button type="submit" className="bg-[#A61E25] text-white w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                 <Send className="w-5 h-5" />
              </Button>
           </form>
        </div>
      )}
    </div>
  );
}

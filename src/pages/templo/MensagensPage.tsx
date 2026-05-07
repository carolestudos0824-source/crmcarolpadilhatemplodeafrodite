import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  User, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Heart,
  ChevronRight
} from 'lucide-react';
import { messageService } from '@/types/templo/messageService';
import { ChatMessage, Conversation } from '@/types/templo/message';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MensagensPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const convs = messageService.getConversations();
    setConversations(convs);
  }, []);

  const selectConversation = (conv: Conversation) => {
    setActiveConv(conv);
    loadMessages(conv.targetId);
  };

  const loadMessages = (id: string) => {
    const msgs = messageService.getMessages(id);
    setMessages(msgs);
    messageService.markAsRead(id);
    // Refresh conversation list to clear unread counts
    setConversations(messageService.getConversations());
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;

    const isClient = storage.getClientById(activeConv.targetId);
    
    await messageService.sendMessage({
      clientId: isClient ? activeConv.targetId : undefined,
      leadId: !isClient ? activeConv.targetId : undefined,
      sender: 'carol',
      texto: newMessage,
    });

    setNewMessage('');
    loadMessages(activeConv.targetId);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6 animate-fade-in">
      {/* Sidebar Conversations */}
      <div className="w-80 bg-white rounded-[2rem] border border-[#C9A35A]/10 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#F4F0EA]">
           <h2 className="text-xl font-display italic text-[#111111]">Mensagens</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           {conversations.length === 0 ? (
             <div className="text-center py-10 opacity-30 italic text-sm">Nenhuma conversa ativa</div>
           ) : (
             conversations.map(conv => (
               <div 
                key={conv.id} 
                onClick={() => selectConversation(conv)}
                className={cn(
                  "p-4 rounded-2xl cursor-pointer transition-all border group",
                  activeConv?.id === conv.id 
                    ? "bg-[#A61E25] border-[#A61E25] text-white shadow-lg shadow-[#A61E25]/10" 
                    : "bg-[#F4F0EA]/30 border-[#C9A35A]/10 hover:border-[#C9A35A]/30"
                )}
               >
                 <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-xs truncate">{conv.targetName}</span>
                    {conv.unreadCount > 0 && (
                      <span className="bg-[#A61E25] text-white text-[8px] px-2 py-0.5 rounded-full ring-2 ring-white">NOVA</span>
                    )}
                 </div>
                 <p className={cn("text-[10px] truncate opacity-60", activeConv?.id === conv.id ? "text-white" : "text-[#111111]")}>
                    {conv.lastMessage || 'Iniciando conversa...'}
                 </p>
               </div>
             ))
           )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-[2rem] border border-[#C9A35A]/10 shadow-sm flex flex-col overflow-hidden">
         {activeConv ? (
           <>
             <div className="p-6 border-b border-[#F4F0EA] flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-[#EBE5DB] flex items-center justify-center font-bold text-[#111111] italic border border-[#C9A35A]/20">
                      {activeConv.targetName[0]}
                   </div>
                   <div>
                      <h3 className="font-bold text-sm">{activeConv.targetName}</h3>
                      <p className="text-[9px] uppercase tracking-widest text-[#111111]/40">Atendimento Ativo</p>
                   </div>
                </div>
                <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-[#A61E25]">Ver Ficha</Button>
             </div>

             <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#F4F0EA]/20">
                {messages.map(msg => (
                  <div key={msg.id} className={cn(
                    "flex flex-col max-w-[70%] space-y-1",
                    msg.sender === 'carol' ? "ml-auto items-end" : "mr-auto items-start"
                  )}>
                    <div className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.sender === 'carol' 
                        ? "bg-[#A61E25] text-white rounded-tr-none" 
                        : "bg-white text-[#111111] border border-[#C9A35A]/10 rounded-tl-none"
                    )}>
                      {msg.texto}
                    </div>
                    <span className="text-[8px] uppercase tracking-widest font-bold text-[#111111]/30">
                       {new Date(msg.createdAt).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                ))}
             </div>

             <form onSubmit={handleSendMessage} className="p-6 border-t border-[#F4F0EA] flex gap-4">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escreva sua resposta..."
                  className="flex-1 bg-[#F4F0EA]/50 border border-[#C9A35A]/10 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#A61E25]/20"
                />
                <Button type="submit" className="bg-[#111111] text-white px-6 rounded-xl font-bold text-xs uppercase tracking-widest gap-2">
                   Enviar <Send className="w-3 h-3" />
                </Button>
             </form>
           </>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-30 space-y-4">
              <MessageSquare className="w-16 h-16 text-[#C9A35A]" />
              <div className="space-y-1">
                 <p className="font-bold">Selecione uma conversa</p>
                 <p className="text-sm">Para visualizar o histórico e responder à cliente.</p>
              </div>
           </div>
         )}
      </div>
    </div>
  );
}

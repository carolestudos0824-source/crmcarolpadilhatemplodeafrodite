import { ChatMessage, Conversation } from "./message";

const MESSAGES_KEY = 'templo_afrodite_portal_messages';

export const messageService = {
  getMessages: (targetId: string): ChatMessage[] => {
    const data = localStorage.getItem(MESSAGES_KEY);
    const allMessages: ChatMessage[] = data ? JSON.parse(data) : [];
    return allMessages.filter(m => m.clientId === targetId || m.leadId === targetId);
  },

  sendMessage: async (msgData: Omit<ChatMessage, 'id' | 'createdAt' | 'status'>): Promise<ChatMessage> => {
    const data = localStorage.getItem(MESSAGES_KEY);
    const allMessages: ChatMessage[] = data ? JSON.parse(data) : [];
    
    const newMsg: ChatMessage = {
      ...msgData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'sent',
      createdAt: new Date().toISOString(),
    };
    
    allMessages.push(newMsg);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
    return newMsg;
  },

  getConversations: (): Conversation[] => {
    const data = localStorage.getItem(MESSAGES_KEY);
    const allMessages: ChatMessage[] = data ? JSON.parse(data) : [];
    
    // Group messages by targetId to create conversation list
    const conversationsMap = new Map<string, Conversation>();
    
    allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    allMessages.forEach(msg => {
      const targetId = msg.clientId || msg.leadId;
      if (!targetId) return;
      
      const existing = conversationsMap.get(targetId);
      if (existing) {
        existing.lastMessage = msg.texto;
        existing.lastUpdate = msg.createdAt;
        if (msg.sender === 'cliente' && !msg.readAt) {
          existing.unreadCount++;
        }
      } else {
        conversationsMap.set(targetId, {
          id: targetId,
          targetId: targetId,
          targetName: 'Cliente ' + targetId.slice(0, 4), // Fallback name
          lastMessage: msg.texto,
          lastUpdate: msg.createdAt,
          unreadCount: (msg.sender === 'cliente' && !msg.readAt) ? 1 : 0
        });
      }
    });
    
    return Array.from(conversationsMap.values()).sort((a, b) => 
      new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
    );
  },

  markAsRead: (targetId: string) => {
    const data = localStorage.getItem(MESSAGES_KEY);
    const allMessages: ChatMessage[] = data ? JSON.parse(data) : [];
    const now = new Date().toISOString();
    
    const updated = allMessages.map(m => {
      if ((m.clientId === targetId || m.leadId === targetId) && m.sender === 'cliente' && !m.readAt) {
        return { ...m, readAt: now, status: 'read' as const };
      }
      return m;
    });
    
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  }
};

export interface ChatMessage {
  id: string;
  clientId?: string;
  leadId?: string;
  sender: 'carol' | 'cliente';
  texto: string;
  createdAt: string;
  readAt?: string;
  status: 'sent' | 'read';
}

export interface Conversation {
  id: string;
  targetId: string; // clientId or leadId
  targetName: string;
  lastMessage?: string;
  lastUpdate: string;
  unreadCount: number;
}

export type User = {
  idUser: string;
  userName: string;
  surname: string;
  email: string;
  pseudo: string;
  password: string;
  statusUser: boolean;
  role: string;
  responsibilities?: string[]; // Optional responsibilities
  createdAt?: string;
  updatedAt?: string;
  avatar?: string; // Optional avatar URL
};

// Pour les conversations
export type ConversationUser = {
  idConversation: string;
  idUser: string;
  isRead: boolean;
};
// Pour les correspondances de chat
export type ChatConversation = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  icon ?: string
  isRead: boolean;
  userIdConversations: string[]; // IDs of users in the conversation
  lastMessage?: ChatMessage;
};
export type ChatMessage = {
  id: string;
  conversationId: string;
  content: string;
  file?: string; // Optional file attachment
  createdAt: string;
  updatedAt: string;
  senderId: string;
};

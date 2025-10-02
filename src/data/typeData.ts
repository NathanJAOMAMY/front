export type User = {
  idUser: string;
  userName: string;
  surname: string;
  email: string;
  pseudo: string;
  password: string;
  statusUser: boolean;
  roleUser: "admin" | "user";
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
  icon?: string;
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
// types.ts

export interface Folder {
  id: string;               // ancien id_folder
  name: string;             // ancien libelle_folder
  parentFolderId: string ;
  userId: string;
  userIdAcces?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface File {
  id: string;               // ancien id_file
  fileName: string;         // nouveau nom pour libelle_file
  originalName: string;     // nom d’origine
  sizeFile: number;         // en bytes ?? a revoire 
  typeFile: string;         // ex: "pdf", "jpg"
  mimeType?: string;        // ex: "application/pdf"
  url: string;
  readCount?: number;       // ancien readed
  status?: "active" | "archived" | "deleted"; // ancien status_file
  folderId?: string | null; // ancien folder_id
  userId: string;
  userIdAcces?: string[];
  createdAt?: string;
  updatedAt?: string;
}
export enum PATH_FILE {
  USER = "/",
  PRODUCTION = "/production",
  QUALITE = "/quality",
  SANTE_SECURITE = "/health-security",
  RH = "/rh",
  MAINTENANCE = "/maintenance",
  DIRECTION = "/direction",
  SECURITE = "/security",
  LOGISTIQUE = "/logistique",
  CERTIFICATION = "/certification",
}

import React, { createContext, useCallback, useContext, useState, useMemo } from "react";
import type { ChatMessage } from "../../data/typeData";

type UnreadMap = { [id: string]: number };
interface ChatCtx {
  unread: UnreadMap;
  markAsRead: (convId: string) => void;
  pushMessage: (m: ChatMessage, openId: string | null) => void;
}

const ChatContext = createContext<ChatCtx | null>(null);
export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("ChatContext missing");
  return ctx;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unread, setUnread] = useState<UnreadMap>({});

  const pushMessage = useCallback(
    (msg: ChatMessage, openId: string | null) => {
      if (msg.conversationId === openId) return; // déjà ouverte
      setUnread((u) => ({
        ...u,
        [msg.conversationId]: (u[msg.conversationId] || 0) + 1,
      }));
    },
    [] // stable, pas recréée à chaque render
  );

  const markAsRead = useCallback(
    (convId: string) => setUnread((u) => ({ ...u, [convId]: 0 })),
    []
  );

  /* Fournir un objet MEMOISÉ pour ne pas changer de référence */
  const value = useMemo(() => ({ unread, pushMessage, markAsRead }), [
    unread,
    pushMessage,
    markAsRead,
  ]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

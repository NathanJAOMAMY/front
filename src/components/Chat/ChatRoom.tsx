import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import type { ChatMessage } from "../../typeData";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./ChatItem";
import ChatDetail from "./ChatDetail";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  markAsRead,
  setCurrentConversation,
  updateLastMessage,
} from "../../features/chat/chatSlice";
import { RootState } from "../../redux";
import { v4 as uuid } from "uuid";
import { fetchMessages, sendMessage } from "./chatFonction";
import MediaModal from "../MediaModal";

const ChatRoom: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const currentUserId = currentUser?.idUser;
  const chatConversations = useSelector(
    (state: RootState) => state.chat.chatConversations
  );
  const currentConversation = chatConversations.find((c) => c.id === conversationId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [modalMediaFiles, setModalMediaFiles] = useState<string[]>([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);

  const closeMediaModal = () => {
    setMediaModalOpen(false);
    setModalMediaFiles([]);
    setModalCurrentIndex(0);
  };

  const allMediaFiles = messages.filter((msg) => msg.file && /\.(jpg|jpeg|png|gif|webp|mp4|webm)$/i.test(msg.file))
    .map((msg) => msg.file!) as string[];

  const [initialLoaded, setInitialLoaded] = useState(false);
  const seenIds = React.useRef<Set<string>>(new Set());
  const [showDetail, setShowDetail] = useState(false);

  // Charger les messages et écouter la conversation
  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    const load = async () => {
      try {
        const fetched = await fetchMessages(conversationId);
        if (Array.isArray(fetched)) {
          setMessages(fetched);
          fetched.forEach((m) => seenIds.current.add(m.id));
        } else {
          console.warn("fetchMessages n'a pas retourné un tableau :", fetched);
        }
      } catch (err) {
        console.error("Erreur lors du fetchMessages :", err);
      } finally {
        setInitialLoaded(true);
      }
    };

    load();

    socket.emit("joinConversation", conversationId);
    dispatch(setCurrentConversation(conversationId));

    const handleNewMessage = (message: ChatMessage) => {
      if (message.conversationId !== conversationId) return;
      if (seenIds.current.has(message.id)) return; // déduplication
      dispatch(
        updateLastMessage({ conversationId: message.conversationId, message: message })
      );
      seenIds.current.add(message.id);
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.emit("leaveConversation", conversationId);
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId, currentUserId, dispatch]);

  const handleSendMessage = useCallback(
    async (text: string, file?: string) => {
      if (!conversationId || !currentUserId) return;

      const otherUserId = currentConversation?.userIdConversations.filter(
        (uid) => uid !== currentUserId
      );

      const newMessage: ChatMessage = {
        id: uuid(),
        conversationId,
        senderId: currentUserId,
        content: text,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        file,
      };

      // Persister en base
      try {
        await sendMessage(newMessage);
      } catch (err) {
        console.error("Erreur en sauvegardant le message :", err);
      }
      for (const uid of otherUserId || []) {
        socket.emit("sendMessage", {
          ...newMessage,
          receiverId: uid,
        });
        dispatch(
          markAsRead({
            idConversation: newMessage.conversationId,
            idUser: uid,
            isRead: false,
          })
        );
      }

      // Optimistic update + marquer comme vu pour éviter doublon
      if (!seenIds.current.has(newMessage.id)) {
        seenIds.current.add(newMessage.id);
        setMessages((prev) => [...prev, newMessage]);
        dispatch(
          updateLastMessage({ conversationId, message: newMessage })
        );
      }
    },
    [conversationId, currentUserId, currentConversation]
  );

  useEffect(() => {
    // Défile vers le bas à chaque fois que la liste des messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  if (!currentConversation) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-500">
        Aucun utilisateur sélectionné.
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <ChatHeader
        userIdConversations={currentConversation.userIdConversations}
        currentUserId={currentUserId}
        onShowDetail={() => { setShowDetail(!showDetail) }}
        currenteConversation={currentConversation}
      />
      {showDetail &&
        <ChatDetail
          currentConversation={currentConversation}
          onShowDetail={() => { setShowDetail(!showDetail) }}
          showDetail={showDetail}
        />
      }
      <div className="h-[78vh] flex flex-col gap-1.5 p-4 overflow-y-auto rounded-bl-lg bg-white">
          {messages.map((msg) => (
            <div>
              <MessageBubble
                message={msg}
                currentUserId={currentUserId}
                onMediaClick={(file) => {
                  setModalMediaFiles(allMediaFiles);
                  setModalCurrentIndex(allMediaFiles.indexOf(file));
                  setMediaModalOpen(true);
                }}
              />
            </div>
          ))}
        {initialLoaded && messages.length === 0 && (
          <div className="text-center text-gray-400 mt-4">Aucun message ici.</div>
        )}

        <div ref={messagesEndRef} />
      </div>
      <MediaModal currentIndexSelected={modalCurrentIndex} isOpen={mediaModalOpen} mediaFiles={modalMediaFiles} onClose={closeMediaModal} ></MediaModal>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatRoom;

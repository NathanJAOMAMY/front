import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import type { ChatConversation, ConversationUser, User, ChatMessage } from "../../typeData";
import { fetchUser } from "./chatFonction";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux";
import { socket } from "../../socket";
import {
  addConversation,
  addConversationUser,
  markAsRead,
  setCurrentConversation,
} from "../../features/chat/chatSlice";
import ChatAdd from "./ChatAdd";
import { setUser } from "../../features/user/user";
import { FiMessageSquare } from "react-icons/fi";
import classNames from "classnames";
import { getLastMessageForConversation, truncate } from "./tools";

interface UserSidebarProps {
  conversation: ChatConversation[];
  currentUserId: string;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ conversation, currentUserId }) => {


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const conversationUser = useSelector((state: RootState) => state.chat.conversationUser);
  const currentConversationId = useSelector(
    (state: RootState) => state.chat.currentConversationId
  );
  const userList = useSelector((state: RootState) => state.user.users);
  const userTo = userList.filter((u: User) => u.idUser !== currentUserId);
  const messages = useSelector((state: RootState) => state.chat.messages);

  const [hide, setHide] = React.useState(false);
  const onHide = async () => {
    setHide((h) => !h);
    if (hide) {
      const users = await fetchUser();
      if (users) dispatch(setUser(users));
    }
  };

  // synchroniser currentConversationId avec l'URL
  useEffect(() => {
    const match = location.pathname.match(/\/chat\/([^/]+)/);
    if (match) {
      const convId = match[1];
      if (convId !== currentConversationId) {
        dispatch(setCurrentConversation(convId));
      }
    } else if (currentConversationId !== null) {
      dispatch(setCurrentConversation(null));
    }
  }, [location.pathname, dispatch, currentConversationId]);

  const isConversationRead = (conversationId: string): boolean => {
    const cu = conversationUser.find(
      (c: ConversationUser) =>
        c.idConversation === conversationId && c.idUser === currentUserId
    );
    return cu ? cu.isRead : true;
  };

  useEffect(() => {
    if (!currentUserId) return;

    socket.emit("userConnected", currentUserId);

    const handleNewConversation = (newConv: ChatConversation) => {
      dispatch(addConversation(newConv));
      dispatch(
        addConversationUser({
          idConversation: newConv.id,
          idUser: currentUserId,
          isRead: false,
        })
      );
    };

    const handleNewMessageNotification = ({
      conversationId: convId,
    }: {
      conversationId: string;
      message?: any;
      fromUser?: string;
    }) => {
      if (convId !== currentConversationId) {
        dispatch(
          markAsRead({
            idConversation: convId,
            idUser: currentUserId,
            isRead: false,
          })
        );
      }
    };

    const handleConversationRead = ({ conversationId: convId }: { conversationId: string }) => {
      dispatch(
        markAsRead({
          idConversation: convId,
          idUser: currentUserId,
          isRead: true,
        })
      );
    };

    socket.on("newConversation", handleNewConversation);
    socket.on("new_message_notification", handleNewMessageNotification);
    socket.on("conversation_read", handleConversationRead);

    return () => {
      socket.off("newConversation", handleNewConversation);
      socket.off("new_message_notification", handleNewMessageNotification);
      socket.off("conversation_read", handleConversationRead);
    };
  }, [currentUserId, dispatch, currentConversationId]);

  const handleNavClick = (id: string) => {
    if (!currentUserId) return;
    dispatch(
      markAsRead({
        idConversation: id,
        idUser: currentUserId,
        isRead: true,
      })
    );
    dispatch(setCurrentConversation(id));
    navigate(`/chat/${id}`);
  };
  // Trier les conversations par date du dernier message (ou par createdAt si aucun message)
  const sortedConversations = [...conversation].sort((a, b) => {
    const aLastMsg = getLastMessageForConversation(messages[a.id]);
    const bLastMsg = getLastMessageForConversation(messages[b.id]);

    return new Date(bLastMsg.createdAt).getTime() - new Date(aLastMsg.createdAt).getTime();
  });
  return (
    <aside className="w-64 h-screen p-4 overflow-y-auto relative">
      <h2 className="text-xl font-bold mb-5 text-gray-800">Conversations</h2>

      <ul className="space-y-2">
        {sortedConversations.map(({ id, name, userIdConversations }) => {
          const isRead = isConversationRead(id);
          const otherUser =
            userIdConversations.length === 2
              ? userList.find(
                ({ idUser }) =>
                  idUser === userIdConversations.find((uid) => uid !== currentUserId)
              )
              : null;
          const displayName = name || otherUser?.userName || "Groupe";
          const initial =
            name?.[0]?.toUpperCase() ||
            otherUser?.userName?.[0]?.toUpperCase() ||
            "G";

          return (
            <li key={id}>
              <NavLink
                to={`/chat/${id}`}
                onClick={() => handleNavClick(id)}
                className={({ isActive }) =>
                  classNames(
                    "flex items-center justify-between p-2 rounded-lg transition-all relative",
                    {
                      "bg-primary text-white": isActive,
                      "hover:bg-gray-100 text-gray-800": !isActive,
                    }
                  )
                }
              >
                <div className="flex flex-1 items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-lg shadow-sm">
                    {initial}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium text-sm truncate max-w-[120px]">
                      {displayName}
                    </span>
                    <div className="flex justify-between w-[100%] items-center text-xs">
                      <span className="text-xs text-gray-500 truncate max-w-[140px]">
                        {truncate(getLastMessageForConversation(messages[id]).content)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(getLastMessageForConversation(messages[id]).createdAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {!isRead && (
                  <div className="absolute top-2 right-2 w-2 h-2">
                    <span
                      className="w-3 h-3 rounded-full bg-primary"
                      aria-label="Nouveau message"
                    >
                      <span className="absolute inset-0 animate-ping rounded-full bg-primary/80" />
                      <span className="relative block w-full h-full rounded-full" />
                    </span>
                  </div>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>

      <div
        onClick={onHide}
        className="flex items-center justify-center absolute bottom-6 right-6 bg-primary text-white font-medium px-4 py-2 rounded-full shadow-md hover:shadow-lg cursor-pointer transition-transform hover:scale-105 gap-2"
      >
        <FiMessageSquare />
        <div className="label">Nouvelle</div>
      </div>

      {/* <ChatAdd allUser={userTo} hide={hide} onHide={onHide} /> */}
    </aside>
  );
};

export default UserSidebar;

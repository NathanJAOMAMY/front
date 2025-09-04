import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import type { ChatConversation, User } from "../../typeData";
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
import {
  FiCheckCircle,
  FiList,
  FiMail,
  FiMessageSquare,
  FiSearch,
  FiXCircle,
} from "react-icons/fi";
import classNames from "classnames";
import {
  getConversationDisplay,
  getLastMessageForConversation,
  truncate,
} from "./tools";
import { AnimatePresence, motion } from "framer-motion";

interface UserSidebarProps {
  conversation: ChatConversation[];
  currentUserId: string;
}

const UserSidebar: React.FC<UserSidebarProps> = ({
  conversation,
  currentUserId,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const conversationUser = useSelector(
    (state: RootState) => state.chat.conversationUser
  );
  const currentConversationId = useSelector(
    (state: RootState) => state.chat.currentConversationId
  );
  const userList = useSelector((state: RootState) => state.user.users);
  const userTo = userList.filter((u: User) => u.idUser !== currentUserId);
  const messages = useSelector((state: RootState) => state.chat.messages);

  const [hide, setHide] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const onHide = async () => {
    setHide((h) => !h);
    if (hide) {
      const users = await fetchUser();
      if (users) dispatch(setUser(users));
    }
  };

  // Synchroniser currentConversationId avec l'URL
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

  // Map des conversations lues / non lues
  const conversationReadMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    conversationUser.forEach((cu) => {
      if (cu.idUser === currentUserId) map[cu.idConversation] = cu.isRead;
    });
    return map;
  }, [conversationUser, currentUserId]);

  const chatConversationsVoid = {
    id: "",
    name: "",
    createdAt: "",
    isRead: true,
    userIdConversations: [],
  };

  const isConversationRead = (conversationId: string) =>
    conversationReadMap[conversationId] ?? true;

  const findConversationById = (id: string, currentUserId: string) =>
    conversationUser.find(
      (c) => c.idConversation === id && currentUserId === c.idUser
    ) || chatConversationsVoid;

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
    }) => {
      if (convId !== currentConversationId) {
        console.log("handleNotif for Navbar");
        dispatch(
          markAsRead({ idConversation: convId, idUser: currentUserId, isRead: false })
        );
      }
    };

    socket.on("newConversation", handleNewConversation);
    socket.on("new_message_notification", handleNewMessageNotification);

    return () => {
      socket.off("newConversation", handleNewConversation);
      socket.off("new_message_notification", handleNewMessageNotification);
    };
  }, [currentUserId, dispatch, currentConversationId]);

  // Nouveau : marquer comme lu uniquement quand une conversation est ouverte
  useEffect(() => {
    if (currentConversationId && currentUserId) {
      dispatch(
        markAsRead({
          idConversation: currentConversationId,
          idUser: currentUserId,
          isRead: true,
        })
      );
    }
  }, [currentConversationId, currentUserId]);

  const handleNavClick = (id: string) => {
    if (!currentUserId) return;
    dispatch(setCurrentConversation(id));
    navigate(`/chat/${id}`);
  };

  // Trier les conversations par date du dernier message
  const sortedConversations = [...conversation].sort((a, b) => {
    const aLastMsg = getLastMessageForConversation(messages[a.id]);
    const bLastMsg = getLastMessageForConversation(messages[b.id]);
    return (
      new Date(bLastMsg.createdAt).getTime() -
      new Date(aLastMsg.createdAt).getTime()
    );
  });

  const filteredConversations = sortedConversations
    .filter(({ id }) => {
      if (filter === "unread") return !isConversationRead(id);
      if (filter === "read") return isConversationRead(id);
      return true;
    })
    .filter(({ name, userIdConversations }) => {
      const { displayName } = getConversationDisplay(
        userIdConversations,
        userList,
        currentUserId,
        name
      );
      return displayName.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const unreadCount = sortedConversations.filter(
    (c) => !isConversationRead(c.id)
  ).length;
  const readCount = sortedConversations.filter((c) =>
    isConversationRead(c.id)
  ).length;
  const totalCount = sortedConversations.length;

  return (
    <aside className="w-75 h-screen p-4 overflow-y-auto relative">
      <h2 className="text-xl font-bold mb-5 text-gray-700">Conversations</h2>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Rechercher une conversation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-3 pr-10 border-2 border-primary bg-white rounded-lg text-sm outline-none focus:border-primary"
        />
        <AnimatePresence>
          {searchTerm && (
            <motion.div
              key="close-icon"
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              transition={{ duration: 0.25 }}
              className="absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setSearchTerm("")}
              title="effacer"
            >
              <FiXCircle
                size={18}
                className="text-primary hover:text-gray-800 transition-colors"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <FiSearch
          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer"
          size={18}
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`flex items-center gap-1 relative px-3 py-1 rounded-full text-sm ${filter === "all"
              ? "bg-primary text-white"
              : " text-gray-700 border border-primary"
            }`}
        >
          <FiList />
          Tous
          <span className="bg-white absolute top-[-7px] right-[-4px] text-primary font-bold text-xs px-2 rounded-full">
            {totalCount}
          </span>
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`flex items-center relative gap-1 px-3 py-1 rounded-full text-sm ${filter === "unread"
              ? "bg-primary text-white"
              : "text-gray-700 border border-primary"
            }`}
        >
          <FiCheckCircle /> Non lus
          <span className="bg-white absolute top-[-7px] right-[-4px] text-primary font-bold text-xs px-2 rounded-full">
            {unreadCount}
          </span>
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`flex items-center relative gap-1 px-3 py-1 rounded-full text-sm ${filter === "read"
              ? "bg-primary text-white"
              : "text-gray-700 border border-primary"
            }`}
        >
          <FiMail /> Lus
          <span className="bg-white absolute top-[-7px] right-[-4px] text-primary font-bold text-xs px-2 rounded-full">
            {readCount}
          </span>
        </button>
      </div>

      <ul className="space-y-2 p-2 overflow-y-auto max-h-[73vh]">
        <AnimatePresence>
          {filteredConversations.map(({ id, name, userIdConversations, icon }) => {
            const { avatarToShow, initial, displayName } =
              getConversationDisplay(
                userIdConversations,
                userList,
                currentUserId,
                name,
                icon
              );
            const isRead = findConversationById(id, currentUserId).isRead;

            return (
              <motion.li
                key={id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <NavLink
                  to={`/chat/${id}`}
                  onClick={() => handleNavClick(id)}
                  className={({ isActive }) =>
                    classNames(
                      "flex items-center justify-between p-2 rounded-lg transition-all relative",
                      {
                        "bg-primary text-white": isActive,
                        "hover:bg-gray-100 text-gray-800": !isActive,
                        "font-bold text-primary": !isRead,
                      }
                    )
                  }
                >
                  <div className="flex flex-1 items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-lg shadow-sm">
                      {avatarToShow ? (
                        <img
                          src={avatarToShow}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className={classNames({ "text-gray-800 font-400": !isRead, })}>{initial}</span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm truncate max-w-[120px]">
                        {displayName}
                      </span>
                      <div className="flex justify-between w-[100%] items-center text-xs">
                        <span className="text-xs text-gray-500 truncate max-w-[140px]">
                          {truncate(
                            getLastMessageForConversation(messages[id]).content
                          )}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(
                            getLastMessageForConversation(messages[id]).createdAt
                          ).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pastille qui reste tant que non lu */}
                  {!isRead && (
                    <motion.div
                      layout
                      className="absolute top-2 right-2 w-2 h-2"
                    >
                      <span
                        className="w-3 h-3 rounded-full bg-primary"
                        aria-label="Nouveau message"
                      >
                        <span className="absolute inset-0 animate-ping rounded-full bg-primary/80" />
                        <span className="relative block w-full h-full rounded-full" />
                      </span>
                    </motion.div>
                  )}
                </NavLink>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <div
        onClick={onHide}
        className="flex items-center justify-center absolute bottom-6 right-6 bg-primary text-white font-medium px-4 py-2 rounded-full shadow-md hover:shadow-lg cursor-pointer transition-transform hover:scale-105 gap-2"
      >
        <FiMessageSquare />
        <div className="label">Nouvelle</div>
      </div>

      <ChatAdd
        allUser={userTo}
        hide={hide}
        onHide={onHide}
        userSelects={[]}
        title="Nouvelle Conversation"
      />
    </aside>
  );
};

export default UserSidebar;

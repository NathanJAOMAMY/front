import React, { useEffect, useState } from "react";
import type { ChatConversation, User } from "../../typeData";
import { useDispatch, useSelector } from "react-redux";
import { addConversation, addConversationUser } from "../../features/chat/chatSlice";
import { RootState } from "../../redux";
import { socket } from "../../socket";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { conversationExist } from "./tools";
import { findConversationUser, updatedConversation } from "./chatFonction";
import { FiSearch, FiUsers } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

interface ChatAddProps {
  allUser: User[],
  onHide: (hide: boolean) => void,
  hide: boolean,
  userSelects: User[],
  title: string,
  conversation?: ChatConversation; // Nouveau : si présent => ajout membres
}

const ChatAdd: React.FC<ChatAddProps> = ({
  onHide,
  allUser,
  hide,
  userSelects,
  title,
  conversation
}) => {
  const [userSelect, setUserSelect] = useState<User[]>(userSelects);
  const [userTo, setUserTo] = useState<User[]>([]);
  const [isNameChat, setIsNameChat] = useState<boolean>(false);
  const [nameChat, setNameChat] = useState<string>('');
  const chatConversations = useSelector((state: RootState) => state.chat.chatConversations);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserTo(allUser);
  }, [allUser]);

  const reset = () => {
    setNameChat('');
    setIsNameChat(false);
    onHide(false);
    setUserSelect([]);
  };

  const onSearch = (text: string) => {
    const newListe = allUser.filter(({ userName, surname }) =>
      `${userName} ${surname}`.toLowerCase().includes(text.toLowerCase())
    );
    setUserTo(newListe);
  };

  const onSelectUser = (user: User) => {
    if (!userSelect.some((u) => u.idUser === user.idUser)) {
      setUserSelect((prev) => [...prev, user]);

      const newList = userTo.filter(
        (u) => u.idUser !== user.idUser // On enlève l'utilisateur sélectionné
      );

      setUserTo(newList);
    }
  };


  const onDisSelectUser = (idUser: string) => {
    // Trouver l'utilisateur qu'on enlève
    const userRemoved = userSelect.find(user => user.idUser === idUser);

    // Retirer de la liste sélectionnée
    setUserSelect(prev => prev.filter(user => user.idUser !== idUser));

    // Le remettre dans liste userTo
    if (userRemoved) {
      setUserTo(prev => [...prev, userRemoved]);
    }
  };


  const onAdd = async () => {
    const idUsers = Array.from(new Set([
      ...userSelect.map(u => u.idUser.trim()),
      currentUser.idUser.trim()
    ]));

    // MODE "AJOUT MEMBRES"
    if (conversation) {
      if (!conversationExist(chatConversations, idUsers)) {
        idUsers.forEach(idUser => {
          dispatch(addConversationUser({
            idConversation: conversation.id,
            idUser,
            isRead: false,
            idCurrentUser: idUser === currentUser.idUser ? idUser : undefined
          }));
        });
        const updatConversation = await updatedConversation(conversation.id, idUsers);
        updatConversation && dispatch(addConversation(updatConversation));

        for (const idUser of idUsers) {
          let conversationFinded = await findConversationUser(idUser, conversation.id);
          if (!conversationFinded) {
            dispatch(addConversationUser({
              idConversation: conversation.id,
              idUser,
              isRead: false,
              idCurrentUser: idUser === currentUser.idUser ? idUser : undefined
            }));
          }
        }

        socket.emit("newConversation", { conversation, userIds: idUsers });
        toast.success("Membres ajoutés avec succès.");
        reset();
      }
      else {
        // console.log(conversationExist(chatConversations, idUsers))
        toast.warning(`Vous avez déjà une conversation avec eux dans ' ${conversationExist(chatConversations, idUsers)?.name} '`);
      }
      return;
    }

    // MODE "CRÉATION CONVERSATION"
    if (!conversationExist(chatConversations, idUsers)) {
      const conversation: ChatConversation = {
        id: uuid(),
        name: nameChat,
        createdAt: new Date().toISOString(),
        isRead: false,
        userIdConversations: idUsers
      };

      if (userSelect.length > 1 && isNameChat) {
        if (!nameChat.trim()) {
          toast.error('Veuillez entrer un nom pour le groupe.');
          return;
        }

        dispatch(addConversation(conversation));
        idUsers.forEach(idUser => {
          dispatch(addConversationUser({
            idConversation: conversation.id,
            idUser,
            isRead: false,
            idCurrentUser: idUser === currentUser.idUser ? idUser : undefined
          }));
        });
        socket.emit("newConversation", { conversation, userIds: idUsers });
        toast.success('Conversation de groupe créée avec succès.');
        reset();

      } else if (userSelect.length > 1) {
        setIsNameChat(true);

      } else if (userSelect.length === 1) {
        dispatch(addConversation(conversation));
        idUsers.forEach(idUser => {
          dispatch(addConversationUser({
            idConversation: conversation.id,
            idUser,
            isRead: false,
            idCurrentUser: idUser === currentUser.idUser ? idUser : undefined
          }));
        });

        socket.emit("newConversation", { conversation, userIds: idUsers });
        toast.success('Conversation créée avec succès.');
        reset();
      }

    } else {
      toast.warning('Cette conversation existe déjà.');
    }
  };

  const profile = 'https://mxbzfekwbvybtxlutkpz.supabase.co/storage/v1/object/public/intranet/avatar.png';
  if (!hide) return null;

  return (
    <AnimatePresence>
      <div className="flex flex-col text-primary relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onHide(false)}
          className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col bg-white shadow-lg rounded-lg h-[85vh] w-[50%] relative z-44"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="text-lg font-bold p-2.5 bg-primary rounded-t-lg text-white">{title}</div>

            {/* Utilisateurs sélectionnés */}
            <div className="flex flex-wrap gap-2 mt-2 pl-1.5 pr-1.5 text-white">
              {userSelect.map(user => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.85, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 6 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.8 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }} key={user.idUser} className="flex items-center gap-2 bg-primary rounded-full px-3 py-1 text-sm">
                  <img src={user.avatar || profile} alt={user.userName} className="w-6 h-6 rounded-full object-cover" />
                  <span>{user.userName}</span>
                  <button onClick={() => onDisSelectUser(user.idUser)} className="text-gray-400 hover:text-red-500 font-bold">&times;</button>
                </motion.div>
              ))}
            </div>

            {/* Recherche */}
            <div className="p-4">
              <div className="flex items-center gap-2 shadow-md p-3 border-2 border-primary rounded-lg bg-white focus:ring-primary">
                <input
                  type="text"
                  className="outline-none w-full text-gray-700 placeholder-gray-400"
                  placeholder="Recherche..."
                  onChange={(e) => onSearch(e.target.value)}
                />
                <button className="text-primary hover:text-primary/80 transition-colors">
                  <FiSearch size={20} />
                </button>
              </div>
            </div>

            {/* Liste utilisateurs */}
            <div className="overflow-y-auto max-h-[55vh] px-6">
              {userTo.map(user => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.85, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 6 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.8 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  key={user.idUser}
                  onClick={() => onSelectUser(user)}
                  className="p-2 border-b flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                >
                  {user.avatar ? (
                    <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt="profil" />
                  ) :
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-lg shadow-sm text-white">
                      {user.userName[0].toUpperCase()}
                    </div>
                  }
                  <div>
                    <div>{user.userName}</div>
                    <div className="text-sm text-gray-500">{user.surname}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Boutons */}
            <div className="flex absolute bottom-2 right-2 gap-2 p-4 rounded-lg bg-white justify-end">
              <button onClick={onAdd} className="bg-primary text-white px-4 py-2 rounded">
                {conversation ? "Ajouter" : "Valider"}
              </button>
              <button onClick={() => onHide(false)} className="border border-primary text-primary px-4 py-2 rounded">
                Annuler
              </button>
            </div>
          </motion.div>
        </motion.div>


        {/* Saisie nom du groupe */}
        {isNameChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-45 flex items-center justify-center"
            onClick={() => setIsNameChat(false)}
          >

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg w-[35%] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-center p-2.5 rounded-t-lg text-white bg-primary">
                Nom du groupe
              </h2>
              <div className="flex flex-col p-3">
                <div className="relative w-full mb-4">
                  <input
                    type="text"
                    placeholder="Nom du groupe"
                    value={nameChat}
                    onChange={(e) => setNameChat(e.target.value)}
                    className="w-full p-3 pr-10 outline-none border-2 border-primary rounded"
                  />
                  <FiUsers
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
                    size={20}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={onAdd}
                    className="bg-primary text-white px-4 py-2 rounded"
                  >
                    Ajouter
                  </button>
                  <button
                    onClick={() => setIsNameChat(false)}
                    className="border border-primary text-primary px-4 py-2 rounded"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>

          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default ChatAdd;

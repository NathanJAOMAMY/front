import React, { useEffect, useState } from "react";
import type { ChatConversation } from "../../data/typeData";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getConversationDisplay } from "./tools";
import { findeUser } from "../../tools/tools";

interface ChatHeaderProps {
  currenteConversation: ChatConversation;
  onShowDetail: (showDetail: boolean) => void;
  userIdConversations: string[];
  currentUserId: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  currenteConversation,
  onShowDetail,
  userIdConversations,
  currentUserId,
}) => {
  const user = useSelector((state: RootState) => state.user.users);
  const [showDetail, setShowDetail] = useState(false);

  // États pour les données calculées
  const [avatarToShow, setAvatarToShow] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("Groupe");
  const [initial, setInitial] = useState<string>("G");

  const allUser = useSelector((state: RootState) => state.user.users);
  const handleShowDetail = () => {
    setShowDetail(true);
    onShowDetail(true);
  };

  // Calcul des infos à partir de la conversation
  useEffect(() => {
    const { avatarToShow, displayName, initial } = getConversationDisplay(
      userIdConversations,
      user,
      currentUserId,
      currenteConversation.name,
      currenteConversation.icon
    );
    setAvatarToShow(avatarToShow);
    setDisplayName(displayName);
    setInitial(initial);
  }, [
    currenteConversation,
    userIdConversations,
    user,
    currentUserId
  ]);

  return (
    <div onClick={handleShowDetail}
      className="flex items-center justify-between px-4 py-3 border-b bg-primary shadow text-white">
      <div className="flex items-center gap-3">
        {/* Avatar cercle avec initiale */}
        <div className="w-10 h-10 rounded-full bg-white text-primary font-bold flex items-center justify-center text-lg shadow">
          {avatarToShow ? (
            <img
              src={avatarToShow}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span>{initial}</span>
          )}
        </div>

        {/* Nom de l’utilisateur ou groupe */}
        <div className="flex flex-col">
          <div>
            <p className="font-semibold text-base">{displayName}</p>
          </div>
          {/* si groupe on affiche les participant */}
          <div className="flex gap-1">
            {currenteConversation.userIdConversations.length !== 2 && currenteConversation.userIdConversations.map((idUser) =>
              <div className="flex text-[12px]" key={idUser}>
                {currentUserId === idUser ? 'Vous' : findeUser(idUser, allUser).userName},
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Icône option */}
      <button
        onClick={(e) => { handleShowDetail(); e.stopPropagation() }}
        className="hover:bg-white/10 rounded-full p-2 transition"
        title="Détails"
      >
        <BsThreeDotsVertical className="text-xl" />
      </button>
    </div>
  );
};

export default ChatHeader;

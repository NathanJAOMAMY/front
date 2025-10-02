import { useState } from "react";
import type { ChatConversation, User } from "../../data/typeData";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { AnimatePresence, motion } from "framer-motion";
import { downloadFile, uploadFile } from "../../tools/tools";
import { FiChevronDown, FiChevronRight, FiEdit, FiFile } from "react-icons/fi";
import ChatAdd from "./ChatAdd";
import { getConversationDisplay } from "./tools";
import { updatedConversation } from "./chatFonction";
import { addConversation } from "../../redux/features/chat/chatSlice";
import EditableText from "./EditableText";
import ConversationInfo from "./Info";
import MediaModal from "../MediaModal";

interface ChatDetailProps {
  onShowDetail: (show: boolean) => void;
  showDetail: boolean;
  currentConversation: ChatConversation;
}

const ChatDetail: React.FC<ChatDetailProps> = ({ currentConversation, onShowDetail, showDetail, }) => {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"media" | "participants" | "info">("info");
  const [hide, setHide] = useState(false);
  const [showImages, setShowImages] = useState(true);
  const [showFiles, setShowFiles] = useState(false);

  const dispatch = useDispatch();
  // Changement de l'icon
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    let urlFile = await uploadFile(file, 'chatIcon');
    if (urlFile) {
      const updatCurrentConversation = { ...currentConversation, icon: urlFile }
      let conversationUpdated = await updatedConversation(currentConversation.id, undefined, updatCurrentConversation)
      console.log(conversationUpdated, urlFile)
      conversationUpdated && dispatch(addConversation(conversationUpdated))
    }
  };
  // changement du nom de la conversation
  const handleNameChange = async (newValue: string) => {
    const updatCurrentConversation = { ...currentConversation, name: newValue };
    let conversationUpdated = await updatedConversation(currentConversation.id, undefined, updatCurrentConversation)
    conversationUpdated && dispatch(addConversation(conversationUpdated))
  };
  const openImage = (index: number) => {
    setCurrentIndex(index);
    setIsImageOpen(true);
  };
  const closeModal = () => {
    setIsImageOpen(false);
    setCurrentIndex(0);
  };
  const onHide = () => setHide((h) => !h);

  const userId = Array.isArray(currentConversation.userIdConversations) ? currentConversation.userIdConversations : [];
  const users = useSelector((state: RootState) => state.user.users);
  const messages = useSelector((state: RootState) => state.chat.messages);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const userList: User[] = users.filter(({ idUser }) => userId.includes(idUser));
  const userAddInConvesation: User[] = users.filter(
    ({ idUser }) => !userId.includes(idUser)
  );

  // On filtre uniquement les messages avec fichier
  const mediaMessages = messages[currentConversation.id]?.filter((msg) => msg.conversationId === currentConversation.id
    && typeof msg.file === "string" && msg.file.trim() !== "") || [];
  const { avatarToShow, initial, displayName } = getConversationDisplay(
    currentConversation.userIdConversations,
    userList,
    currentUser.idUser,
    currentConversation.name,
    currentConversation.icon
  );

  if (!showDetail) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-start justify-end slide-in-right transition-transform duration-300 translate-x-0">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-transparent z-10"
          onClick={() => onShowDetail(false)}
        />

        {/* Side panel */}
        <div className="relative w-102 h-full bg-white shadow-lg border-gray-200 z-50 flex flex-col animate-slide-in">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3">
            <h2 className="text-lg font-semibold text-white">Détails</h2>
            <button onClick={() => onShowDetail(false)} className="text-gray-500 hover:text-gray-700" aria-label="Fermer">
              <Icon icon="ic:round-close" className="text-2xl" />
            </button>
          </div>
          {/* Tabs */}
          <div className="flex bg-white sticky top-0 mb-4 z-20">
            <button className={`flex-1 text-center py-2 text-sm font-medium ${activeTab === "info" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("info")}>
              Info
            </button>
            <button className={`flex-1 text-center py-2 text-sm font-medium ${activeTab === "media" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("media")}>
              Médias
            </button>
            <button className={`flex-1 text-center py-2 text-sm font-medium ${activeTab === "participants" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("participants")}>
              Participants
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "media" && (
              <motion.div
                key="media"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                {/* --- Section Images --- */}
                <div>
                  <button
                    onClick={() => setShowImages(!showImages)}
                    className="flex items-center text-gray-700 justify-between w-full px-4 py-2 rounded-lg hover:text-primary transition"
                  >
                    <span className="text-sm font-semibold text-gray-700">Images</span>
                    {showImages ? <FiChevronDown /> : <FiChevronRight />}
                  </button>

                  <AnimatePresence>
                    {showImages && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-3 gap-2 px-4 py-2"
                      >
                        {mediaMessages
                          .filter(media =>
                            typeof media.file === "string" &&
                            /\.(jpg|jpeg|png|gif|webp|mp4|webm)$/i.test(media.file)
                          )
                          .map((media, idx) => (
                            <div
                              key={idx}
                              className="relative w-full aspect-square overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                              {/\.(mp4|webm)$/i.test(media.file as string) ? (
                                <video
                                  src={media.file as string}
                                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                  muted
                                  loop
                                  playsInline
                                  onClick={() => openImage(idx)}
                                />
                              ) : (
                                <img
                                  src={media.file as string}
                                  alt="media"
                                  onClick={() => openImage(idx)}
                                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                />
                              )}
                            </div>
                          ))}

                        {!mediaMessages.some(m =>
                          typeof m.file === "string" &&
                          /\.(jpg|jpeg|png|gif|webp|mp4|webm)$/i.test(m.file)
                        ) && (
                            <div className="bg-gray-50 h-20 rounded flex items-center justify-center text-gray-400 text-sm italic border col-span-3">
                              Aucune image ou vidéo
                            </div>
                          )}
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

                {/* --- Section Fichiers --- */}
                <div>
                  <button
                    onClick={() => setShowFiles(!showFiles)}
                    className="flex items-center text-gray-700 justify-between w-full px-4 py-2 rounded-lg hover:text-primary transition"
                  >
                    <span className="text-sm font-semibold">Fichiers</span>
                    {showFiles ? <FiChevronDown /> : <FiChevronRight />}
                  </button>

                  <AnimatePresence>
                    {showFiles && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-2 px-4 py-2"
                      >
                        {mediaMessages.filter(media =>
                          !(typeof media.file === "string" &&
                            /\.(jpg|jpeg|png|gif|webp)$/i.test(media.file))
                        ).map((media, idx) => {
                          const fileName = typeof media.file === "string"
                            ? media.file.split("/").pop() || "fichier"
                            : "fichier";
                          return (
                            <button
                              key={idx}
                              onClick={() => downloadFile(media.file!, fileName)}
                              className="flex items-center hover:text-primary"
                              title="Telecharger le fichier"
                            >
                              <FiFile size={28} className="mb-1" />
                              <span className="truncate max-w-[90%]">{fileName}</span>
                            </button>
                          );
                        })}

                        {!mediaMessages.some(m =>
                          !(typeof m.file === "string" &&
                            /\.(jpg|jpeg|png|gif|webp)$/i.test(m.file))
                        ) && (
                            <div className="bg-gray-50 h-20 rounded flex items-center justify-center text-gray-400 text-sm italic border col-span-2">
                              Aucun fichier
                            </div>
                          )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeTab === "participants" && (
              <motion.div key="participants" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.25 }} className="flex-1">
                <div className="flex flex-col gap-2 overflow-auto px-4">
                  {userList.map((userItem) => (
                    <div key={userItem.idUser}
                      className="flex items-center gap-3 p-2 rounded-lg text-gray-800 hover:bg-primary hover:text-white cursor-pointer transition-colors">
                      <div className="w-10 h-10 rounded-full bg-red-500 overflow-hidden">
                        {userItem.avatar ? (
                          <img src={userItem.avatar} className="w-full h-full object-cover" alt="profil" />
                        ) : (
                          <div className="w-full h-full bg-primary flex items-center justify-center font-bold text-lg text-white">
                            {userItem.userName[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {userItem.userName} {userItem.surname}
                        </p>
                      </div>
                    </div>
                  ))}

                  <button onClick={onHide} title="Ajouter un participant"
                    className="flex items-center gap-2.5 p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm">
                    <Icon icon="mdi:account-plus" className="text-xl" />
                    <span>Ajout nouveau membre</span>
                  </button>
                </div>
              </motion.div>
            )}
            {
              activeTab === "info" && (
                <motion.div key="info" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.25 }} className="flex-1">
                  <div className="flex flex-col gap-2 overflow-auto px-4 py-4">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-30 h-30 rounded-full flex items-center justify-center relative bg-primary group">
                        {avatarToShow ? (
                          <img
                            src={avatarToShow}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-3xl">{initial}</span>
                        )}

                        {/* Overlay cliquable */}
                        <div onClick={() => document.getElementById("avatarInput")?.click()}
                          className="absolute inset-0 rounded-full hover:bg-black/40 cursor-pointer transition-all duration-300"
                          aria-label="Changer l'avatar">
                          {/* Icône alignée à droite */}
                          <span className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-semibold">
                            <FiEdit />
                          </span>
                        </div>

                        <input
                          id="avatarInput"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleIconUpload}
                        />
                      </div>
                      <div className="p-4">
                        <EditableText
                          value={displayName}
                          onChange={handleNameChange}
                          className="max-w-xs"
                          placeholder="Nom utilisateur"
                        />
                      </div>
                    </div>
                    <ConversationInfo
                      createdAt={currentConversation.createdAt}
                      mediaCount={mediaMessages.length}
                      participantCount={currentConversation.userIdConversations.length}
                    />
                  </div>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal image */}
      <MediaModal isOpen={isImageOpen}  mediaFiles={mediaMessages.map(m => m.file!)}  onClose={closeModal} currentIndexSelected={currentIndex}/>
      <ChatAdd allUser={userAddInConvesation} hide={hide} onHide={onHide} userSelects={userList} title="Nouveau membre" conversation={currentConversation} />
    </>
  );
};

export default ChatDetail;
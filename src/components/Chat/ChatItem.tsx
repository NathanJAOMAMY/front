import type { ChatMessage } from "../../data/typeData";
import { FiPaperclip } from "react-icons/fi";
import { downloadFile, findeUser } from "../../tools/tools";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";

interface MessageBubbleProps {
  message: ChatMessage;
  currentUserId: string;
  onMediaClick?: (file: string) => void
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUserId , onMediaClick}) => {
  const isSentByUser = message.senderId === currentUserId;
  const allUser = useSelector((state: RootState) => state.user.users);

  const isImage = message.file && /\.(jpg|jpeg|png|gif|webp)$/i.test(message.file);
  const isVideo = message.file && /\.(mp4|webm|ogg|mov)$/i.test(message.file);
  const userInfo = findeUser(message.senderId, allUser);

  return (
    <>
      <div className={`flex my-1 ${isSentByUser ? "justify-end" : "justify-start"} gap-2`}>
        {/* Avatar */}
        <div title={userInfo.userName} className="w-8 h-8 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform">
          {userInfo.avatar ? (
            <img src={userInfo.avatar} className="w-full h-full object-cover" alt="profil" />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center font-bold text-lg text-white">
              {userInfo.userName[0]?.toUpperCase() || "?"}
            </div>
          )}
        </div>

        {/* Bulle du message */}
        <div
          className={`
            max-w-[60%] p-2 rounded-lg text-sm overflow-hidden flex flex-col gap-1
            ${isSentByUser ? "bg-primary text-white" : "bg-white shadow-sm text-gray-800"}
          `}
        >
          <div className="flex text-[10px] ">
            {userInfo.idUser !== currentUserId && `De : ${userInfo.userName}`}
          </div>

          <div className="flex flex-col px-1">
            {/* Fichier joint */}
            {message.file && (
              <div className="mb-2"
                onClick={() => onMediaClick && onMediaClick(message.file!)}
              >
                {isImage ? (
                  <img
                    src={message.file}
                    alt="Image"
                    className="rounded-lg max-h-64 object-cover cursor-pointer"
                  />
                ) : isVideo ? (
                  <video
                    src={message.file}
                    controls={false}
                    className="rounded-lg max-h-64 cursor-pointer"
                  />
                ) : (
                  <button
                    className="flex items-center gap-2"
                    onClick={() =>
                      downloadFile(
                        `${message.file}`,
                        `${message.file && message.file.split("/").pop()}`
                      )
                    }
                  >
                    <FiPaperclip size={15} /> Télécharger le fichier
                  </button>
                )}
              </div>
            )}

            {/* Texte du message */}
            {message.content && (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            )}

            <span className="block text-[10px] mt-1 text-right opacity-70">
              {new Date(message.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageBubble;

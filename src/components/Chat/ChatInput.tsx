import React, { useState, useRef, useEffect } from "react";
import { FiLoader, FiPaperclip, FiX, FiFile } from "react-icons/fi";
import { uploadFile } from "../../tools/tools";

interface ChatInputProps {
  onSendMessage: (message: string, file?: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [messageContent, setMessageContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      setIsImage(false);
      return;
    }

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setIsImage(true);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
      setIsImage(false);
    }
  }, [selectedFile]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async () => {
    if (!messageContent.trim() && !selectedFile) return;

    setIsSending(true);

    let uploadedFileUrl: string | undefined = undefined;

    if (selectedFile) {
      try {
        uploadedFileUrl = await uploadFile(selectedFile, "chat");
      } catch (error) {
        console.error("Erreur upload fichier:", error);
        setIsSending(false);
        return;
      }
    }

    onSendMessage(messageContent.trim(), uploadedFileUrl);

    // reset
    setMessageContent("");
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="relative flex flex-col p-3 gap-2">

      {/* Aperçu fichier */}
      {selectedFile && (
        isImage ? (
          <div className="absolute top-[-90px] w-24 h-24 rounded-md overflow-hidden shadow-md">
            <img
              src={previewUrl!}
              alt="aperçu fichier"
              className="object-cover w-full h-full"
            />
            <button
              onClick={removeFile}
              className="absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-red-200 transition"
              aria-label="Supprimer image"
              type="button"
            >
              <FiX size={18} />
            </button>
          </div>
        ) : (
          <div className="absolute top-[-45px] flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-gray-50 shadow-sm max-w-[200px]">
            <FiFile size={20} className="text-gray-500" />
            <span className="truncate text-sm">{selectedFile.name}</span>
            <button
              onClick={removeFile}
              className="ml-auto bg-white rounded-full p-1 hover:bg-red-200 transition"
              aria-label="Supprimer fichier"
              type="button"
            >
              <FiX size={18} />
            </button>
          </div>
        )
      )}

      {/* Zone de saisie */}
      <div className="flex gap-4">
        <div className="flex items-center flex-1 bg-white rounded-md shadow-sm overflow-hidden">
          <input
            type="text"
            placeholder="Écrivez un message..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-4 py-2 text-gray-800 outline-none"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={openFileDialog}
            className="px-3 py-2 text-gray-600 hover:text-gray-900 transition"
            title="Joindre un fichier"
            type="button"
          >
            <FiPaperclip size={20} />
          </button>
        </div>

        <button
          onClick={sendMessage}
          disabled={!messageContent.trim() && !selectedFile}
          className={`px-5 py-2 rounded-md text-white transition ${
            !messageContent.trim() && !selectedFile
              ? "bg-primary/45 cursor-not-allowed"
              : "bg-primary hover:bg-primary-dark"
          }`}
          type="button"
          aria-label="Envoyer message"
        >
          {isSending ? <FiLoader className="animate-spin" size={18} /> : "Envoyer"}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

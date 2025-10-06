import { FC } from "react";
import Button from "./Button";
import { File, Folder } from "../../data/typeData";
import useFilesManager from "../../hooks/useFilesManager";

interface ModalDialogeProps {
  onClose: () => void;
  title: string;
  type: "File" | "Folder";
  action: "delete" | "rename" | "move" | "share";
  content: File | Folder;
}

const ModalDialoge: FC<ModalDialogeProps> = ({ onClose, title, type, content }) => {
  const { removeFile, removeFolder } = useFilesManager();

  const response = () => {
    if (type === "File" && "url" in content) {
      removeFile(content.id, content.url);
    } else {
      removeFolder(content.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 z-50 w-[90%] sm:w-[400px] animate-fadeIn">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>

        <p className="text-gray-600 mb-6">
          Voulez-vous vraiment supprimer ce{" "}
          <span className="font-semibold">
            {type === "File" ? "fichier" : "dossier"}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} title="Annuler" variant="secondary" />
          <Button onClick={response} title="Confirmer" variant="primary" />
        </div>
      </div>
    </div>
  );
};

export default ModalDialoge;

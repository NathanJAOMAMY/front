import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "../../UI/Button";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => Promise<void>;
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = async () => {
    if (!folderName.trim()) {
      toast.warning("Le nom du dossier est requis !");
      return;
    }
    await onCreate(folderName);
    setFolderName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
        <h2 className="text-lg mb-4">Créer un dossier</h2>
        <input
          type="text"
          className="w-full border rounded-md py-1 px-2 mb-4"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button title="Annuler" variant="secondary" onClick={onClose} />
          <Button title="Créer" variant="primary" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;

import React, { useState } from "react";
import { PATH_FILE } from "../../../data/typeData";
import Button from "../../UI/Button";

type ShareDepartementModalProps = {
  isOpen: boolean;
  fileId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
  onShareConfirm?: (departements: string[]) => void;
};

const ShareDepartementModal: React.FC<ShareDepartementModalProps> = ({
  isOpen,
  fileId,
  onClose,
  onSuccess,
  onShareConfirm,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !fileId) return null;

  const handleToggle = (dep: string) => {
    setSelected((prev) =>
      prev.includes(dep) ? prev.filter((d) => d !== dep) : [...prev, dep]
    );
  };

  const handleConfirm = async () => {
  if (selected.length === 0) {
    setError("Veuillez sélectionner au moins un département.");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    if (onShareConfirm) {
      await onShareConfirm(selected); // <-- utilise la fonction de HomeFile
    }
    onClose();
  } catch (err) {
    setError("Impossible de partager. Réessayez.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4">
          Organiser dans département
        </h2>

        <div className="max-h-60 overflow-y-auto space-y-2">
          {Object.entries(PATH_FILE).filter(([key]) => key !== "USER").map(([key, dep]) => (
            <label
              key={dep}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                value={dep}
                checked={selected.includes(dep)}
                onChange={() => handleToggle(dep)}
              />
              <span className="capitalize">{key.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <Button
            onClick={onClose}
            title="Annuler"
            variant="secondary"
          >
          </Button>
          <Button
            onClick={handleConfirm}
            title="Confirmer"
            variant="primary"
          >
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareDepartementModal;

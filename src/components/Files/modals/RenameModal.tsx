import { FC, useState, useEffect } from "react";
import Button from "../../UI/Button";

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
}

const RenameModal: FC<RenameModalProps> = ({ isOpen, onClose, onRename, currentName }) => {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-60">
      <div className="bg-white p-4 rounded shadow w-96">
        <h3 className="text-lg font-semibold mb-2">Renommer</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-2 py-1 mb-4"
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} title="Annuler" variant="secondary" />
          <Button onClick={() => onRename(name)} title="Renomer" variant="primary" />
        </div>
      </div>
    </div>
  );
};

export default RenameModal;

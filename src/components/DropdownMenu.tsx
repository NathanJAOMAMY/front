import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useRef, FC } from "react";

interface DropdownMenuProps {
  handleCreateFolder: () => void;
  handleChange: (files: FileList) => void;
  handleUploadFolder: (files: FileList) => void;
}

const DropdownMenu: FC<DropdownMenuProps> = ({ handleCreateFolder, handleChange, handleUploadFolder }) => {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileClick = () => fileInputRef.current?.click();
  const handleFolderClick = () => folderInputRef.current?.click();

  return (
    <div className="inline-block text-left text-base relative">
      {/* overlay pour fermer le menu */}
      {open && <div className="fixed inset-0 bg-transparent" onClick={() => setOpen(false)}></div>}

      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center gap-1"
      >
        <Icon icon="icon-park-outline:upload-one" /> Nouveau
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-10"
          role="menu"
        >
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={handleCreateFolder}
            role="menuitem"
          >
            Créer un dossier
          </button>

          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={handleFileClick}
            role="menuitem"
          >
            Importer un fichier
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => e.target.files && handleChange(e.target.files)}
          />

          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={handleFolderClick}
            role="menuitem"
          >
            Importer un dossier
          </button>
          <input
            type="file"
            ref={folderInputRef}
            className="hidden"
            // @ts-ignore : TypeScript ne connaît pas ces attributs
            webkitdirectory="true"
            // @ts-ignore
            directory=""
            onChange={(e) => e.target.files && handleUploadFolder(e.target.files)}
          />
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

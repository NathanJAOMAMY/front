import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useRef } from "react";

export default function DropdownMenu({handleCreateFolder,handlechange, handleUploadFolder}) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleFileClick = () => fileInputRef.current?.click();
  const handleFolderClick = () => folderInputRef.current?.click();

  return (
    <div className="inline-block text-left text-base">
      {open && <div className="absolute top-0 bottom-0 right-0 left-0 bg-transparent" onClick={() => setOpen(false)}></div>}
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center gap-1"
      >
      <Icon icon="icon-park-outline:upload-one" /> Nouveau
      </button>
      {open && (
        
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-10">
          
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={handleCreateFolder}
          >
            Créer un dossier
          </button>

          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={handleFileClick}
          >
            Importer un fichier
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handlechange(e)}
          />

          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={handleFolderClick}
          >
            Importer un dossier
          </button>
          <input
            type="file"
            ref={folderInputRef}
            className="hidden"
            webkitdirectory="true"
            directory=""
            onChange={(e) => handleUploadFolder(e)}
          />
        </div>
      )}
    </div>
  );
}

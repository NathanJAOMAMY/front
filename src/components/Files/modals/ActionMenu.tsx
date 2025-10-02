import { Icon } from "@iconify/react/dist/iconify.js";
import { FC, useEffect, useRef } from "react";

interface MenuProps {
  index: number;
  handleClick: () => void;
  isOpen: number | null;
  handleRemove: () => void;
  handleDownload: () => void;
  on?: "grid" | "table";
  fileName?: string;
  onRename: () => void;
  onShare: () => void;
  onShareDepartement: () => void;
  handleClose: () => void; // pour fermer en dehors
  context: "home" | "share" | "shareme";
}

const ActionMenu: FC<MenuProps> = ({
  index,
  handleClick,
  isOpen,
  handleRemove,
  handleDownload,
  on,
  fileName,
  onRename,
  onShare,
  onShareDepartement,
  handleClose,
  context,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose(); // ferme si clic à l'extérieur
      }
    }

    if (isOpen === index) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, index, handleClose]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <Icon
        icon="ri:more-line"
        className={`cursor-pointer transition-transform ${on === "grid" ? "rotate-90" : ""
          }`}
        onClick={handleClick}
      />

      {isOpen === index && (
        <ul className="absolute right-0 mt-2 w-40 bg-background-primary px-2 py-1 rounded-md shadow-md z-50 text-sm text-gray-800 animate-scale-in">
          <li
            className="flex gap-2 items-center px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer"
            onClick={handleDownload}
          >
            <Icon icon="mdi:download" className="w-4 h-4" />
            <span>Télécharger</span>
          </li>
          {/* Uniquement pour Home */}
          {context === "home" && (
            <>
              <li
                className="flex gap-2 items-center px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer"
                onClick={onRename}
              >
                <Icon icon="mdi:rename-box" className="w-4 h-4" />
                <span>Renommer</span>
              </li>
              <li
                className="flex gap-2 items-center px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer"
                onClick={handleRemove}
              >
                <Icon icon="mdi:delete-outline" className="w-4 h-4" />
                <span>Supprimer</span>
              </li>
              <li
                className="flex gap-2 items-center px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer"
                onClick={onShare}
              >
                <Icon icon="mdi:share-variant" className="w-4 h-4" />
                <span>Partager</span>
              </li>
              <li
                className="flex gap-2 items-center px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer"
                onClick={onShareDepartement}
              >
                <Icon icon="mdi:account-group" className="w-4 h-4" />
                <span>Organiser</span>
              </li>
            </>
          )}
          {fileName && (
            <li className="text-xs text-gray-300 px-2 py-1 italic truncate">
              {fileName}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ActionMenu;

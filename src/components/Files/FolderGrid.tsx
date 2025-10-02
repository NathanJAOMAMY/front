import { Icon } from "@iconify/react";
import ActionMenu from "./modals/ActionMenu";
import { Folder } from "../../data/typeData";

interface FolderGridProps {
  folders: Folder[];
  isMenuOpen: number | null;
  onToggleMenu: (index: number) => void;
  onCloseMenu: () => void;
  onOpenFolder: (folder: Folder) => void;
  onDownload: (id: string, name: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, type: "folder", currentName: string) => void;
  onShare: (folder: Folder) => void;
  onShareDepartement: (folder: Folder) => void;
  context: "home" | "share" | "shareme";
}

const FolderGrid: React.FC<FolderGridProps> = ({
  folders,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  onOpenFolder,
  onDownload,
  onRemove,
  onRename,
  onShare,
  onShareDepartement,
  context,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
      {folders.map((folder, index) => (
        <div
          key={index}
          className="relative flex flex-col justify-between 
          rounded-xl shadow bg-background-primary hover:shadow-lg transition-shadow p-3"
        >
          {/* Icône + nom dossier */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onDoubleClick={() => onOpenFolder(folder)}
          >
            {/* Icône dossier */}
            <div className="flex items-center justify-center w-12 h-12 rounded-lg">
              <Icon
                className="w-10 h-10 text-primary"
                icon="material-symbols:folder"
              />
            </div>

            {/* Nom du dossier (truncate) */}
            <span className="truncate text-sm font-medium flex-1" title={folder.name}>
              {folder.name}
            </span>
          </div>

          {/* Menu actions */}
          <div className="absolute top-2 right-2">
            <ActionMenu
              index={index}
              isOpen={isMenuOpen}
              handleClick={() => onToggleMenu(index)}
              handleClose={onCloseMenu}
              handleDownload={() => onDownload(folder.id, folder.name)}
              fileName={folder.name}
              handleRemove={() => onRemove(folder.id)}
              on="grid"
              onRename={() => onRename(folder.id, "folder", folder.name)}
              onShare={() => onShare(folder)}
              onShareDepartement={() => onShareDepartement(folder)} // Pas de partage par département pour les dossiers
              context={context}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FolderGrid;

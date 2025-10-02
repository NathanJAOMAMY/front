import { Icon } from "@iconify/react";
import { getFileIcon, getTypeFile } from "../../utils/fileHelpers";
import { File } from "../../data/typeData";
import { formatDate } from "../../tools/tools";
import ActionMenu from "./modals/ActionMenu";
import { useState } from "react";

interface FileGridProps {
  files: File[];
  onViewFile: (file: File) => void;
  onImageClick: (url: string) => void;
  onDownload: (fileName: string, url: string) => void;
  onDelete: (id: string, url: string) => void;
  onRename: (id: string, type: "file", currentName: string) => void;
  onShare: (file: File) => void;
  onShareDepartement?: (file: File) => void;
  context: "home" | "share" | "shareme";
}

const FileGrid: React.FC<FileGridProps> = ({ files, onDelete, onRename, onViewFile, onImageClick, onDownload, onShare, onShareDepartement, context }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const toggleMenu = (index: number) => {
    setOpenMenuIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex flex-col rounded-xl bg-primary text-white shadow-md
          hover:shadow-xl transition-all relative min-w-[100px]"
        >
          {/* Header (Nom + Menu) */}
          <div className="flex items-center justify-between px-3 py-2">
            <p className="truncate text-sm font-medium ">
              {`${file.fileName.split(".")[0]}.${file.typeFile}`}
            </p>
            <ActionMenu
              index={index}
              isOpen={openMenuIndex}
              handleClose={() => setOpenMenuIndex(null)}
              handleClick={() => toggleMenu(index)}
              handleDownload={() => onDownload(file.url, file.fileName)}
              handleRemove={() => onDelete(file.id, file.url)}
              fileName={file.fileName}
              on="grid"
              onRename={() => onRename(file.id, "file", file.fileName)}
              onShare={() => onShare && onShare(file)}
              onShareDepartement={() => onShareDepartement && onShareDepartement(file)}
              context={context}
            />
          </div>

          {/* Aperçu fichier */}
          {getTypeFile(file.typeFile) === "image" ? (
            <div
              className="flex items-center justify-center h-35 bg-background-primary cursor-pointer"
              onClick={() => onImageClick(file.url)}
            >
              <div className="flex bg-contain bg-center bg-no-repeat h-full w-full" style={{ backgroundImage: `url(${file.url})` }}></div>
            </div>
          ) : (
            <div
              className="flex items-center justify-center h-40 text-gray-700 bg-background-primary cursor-pointer"
              onClick={() => onViewFile(file)}
            >
              <Icon className="w-16 h-16" icon={getFileIcon(file.typeFile)} />
            </div>
          )}

          {/* Footer (infos) */}
          <div className="px-3 py-2 border-t text-xs">
            {`Créé  ${file.createdAt && formatDate(file.createdAt)}`}
          </div>
        </div>
      ))
      }
    </div >
  );
};

export default FileGrid;

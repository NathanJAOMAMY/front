import { Icon } from "@iconify/react";
import ActionMenu from "./modals/ActionMenu";
import { File } from "../../data/typeData";
import { useState } from "react";

interface FileTableProps {
  files: File[];
  loading?: boolean;
  onDelete: (id: string, url: string) => void;
  onDownload: (file: File) => void;
  onViewFile: (type: string, url: string) => void;
  onRename: (id: string, type: "file", currentName: string) => void;
}

const FileTable: React.FC<FileTableProps> = ({
  files,
  loading = false,
  onDelete,
  onDownload,
  onViewFile,
  onRename,
}) => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const toggleMenu = (index: number) => {
    setOpenMenuIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="text-base relative">
      <table className="w-full text-left table-auto min-w-max px-2">
        <thead>
          <tr className="text-left p-4 border-b border-blue-gray-100">
            <th className="py-2">Nom du fichier</th>
            <th className="py-2">Date de création</th>
            <th className="py-2">Type</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center py-4">
                Chargement des fichiers...
              </td>
            </tr>
          ) : files.length > 0 ? (
            files.map((file, index) => (
              <tr key={file.id} className="text-left h-4 hover:bg-slate-50">
                <td
                  className="flex gap-2 items-center py-2 cursor-pointer"
                  onClick={() => onViewFile(file.typeFile, file.url)}
                >
                  <Icon icon="ion:document-text-outline" />
                  {file.fileName}
                </td>
                <td className="py-2">
                  {file.createdAt && new Date(file.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2">{file.typeFile}</td>
                <td className="py-2">
                  <ActionMenu
                    index={index}
                    isOpen={openMenuIndex}
                    handleClose={()=> setOpenMenuIndex(null)}
                    handleClick={() => toggleMenu(index)}
                    handleDownload={() => onDownload(file)}
                    handleRemove={() => onDelete(file.id, file.url)}
                    fileName={file.fileName}
                    on="table"
                    onRename={() => onRename(file.id, "file", file.fileName)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4">
                Aucun fichier trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;

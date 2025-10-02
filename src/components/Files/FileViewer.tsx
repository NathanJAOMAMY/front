import { FC } from "react";
import { Icon } from "@iconify/react";
import { File } from "../../data/typeData";
import { getTypeFile } from "../../utils/fileHelpers";

export interface FileViewerProps {
  file: File | null;
  onClose: () => void;
}

const FileViewer: FC<FileViewerProps> = ({ file, onClose }) => {
  if (!file) return null;

  const renderContent = () => {
    const type = getTypeFile(file.typeFile);

    switch (type) {
      case "image":
        return (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <img
              src={file.url}
              alt={file.fileName}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>
        );

      case "pdf":
        return (
          <embed
            src={file.url}
            type="application/pdf"
            className="w-full h-full rounded-lg"
          />
        );

      case "video":
        return (
          <video
            src={file.url}
            controls
            className="w-full h-full object-contain rounded-lg"
          />
        );

      case "audio":
        return (
          <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg">
            <audio controls className="w-full max-w-md">
              <source src={file.url} type={`audio/${file.typeFile}`} />
            </audio>
          </div>
        );

      case "text":
        return (
          <iframe
            src={file.url}
            className="w-full h-full bg-white rounded-lg"
            title={file.fileName}
          />
        );

      case "office":
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url)}`}
            className="w-full h-full rounded-lg"
            title={file.fileName}
          />
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-600 bg-gray-50 rounded-lg">
            <Icon icon="mdi:file-document-outline" className="w-16 h-16" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="flex flex-col bg-white w-[90%] h-[90%] rounded-xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 bg-background-primary border-b-2 border-gray-800">
          <span className="text-sm font-medium text-gray-700 truncate">
            {file.fileName}
          </span>
          <button
            className="text-gray-400 hover:text-red-500 transition-colors"
            onClick={onClose}
          >
            <Icon icon="mdi:close" className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-2">{renderContent()}</div>
      </div>
    </div>
  );
};

export default FileViewer;

import { Icon } from "@iconify/react";
import { getFileIcon, getTypeFile } from "../../utils/fileHelpers";
import { File } from "../../data/typeData";

const renderPreview = (
  file: File,
  // onImageClick: (url: string) => void,
  // onViewFile: (type: string, url: string) => void
) => {
  const type = getTypeFile(file.typeFile);

  switch (type) {
    case "image":
      return (
        <div
          className="flex items-center justify-center h-40 bg-gray-50 cursor-pointer"
          // onClick={() => onImageClick(file.url)}
        >
          <div
            className="flex bg-contain bg-center bg-no-repeat h-full w-full"
            style={{ backgroundImage: `url(${file.url})` }}
          ></div>
        </div>
      );

    case "pdf":
      return (
        <div className="flex items-center justify-center h-40 bg-gray-50">
          <embed src={file.url} type="application/pdf" className="w-full h-full" />
        </div>
      );

    case "video":
      return (
        <video src={file.url} controls className="w-full h-40 object-cover rounded-b-xl" />
      );

    case "audio":
      return (
        <div className="flex items-center justify-center h-20 bg-gray-50">
          <audio controls className="w-full">
            <source src={file.url} type={`audio/${file.typeFile}`} />
          </audio>
        </div>
      );

    case "text":
      return (
        <iframe
          src={file.url}
          className="w-full h-40 bg-white"
          title={file.fileName}
        />
      );

    case "office": // docx, xlsx, pptx
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url)}`}
          className="w-full h-40"
          title={file.fileName}
        />
      );

    default:
      return (
        <div
          className="flex items-center justify-center h-40 text-gray-700 bg-gray-50 cursor-pointer"
          // onClick={() => onViewFile(type, file.url)}
        >
          <Icon className="w-16 h-16" icon={getFileIcon(file.typeFile)} />
        </div>
      );
  }
};

export default renderPreview;

import React from "react";
import { getFileType } from "./tools";

interface MediaPreviewProps {
  url: string;
  filename?: string;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ url, filename }) => {
  const type = getFileType(url);

  if (type === 'image') {
    return <img src={url} alt={filename || "Image"} className="max-w-xs rounded-lg shadow" />;
  }

  if (type === 'video') {
    return (
      <video controls className="max-w-xs rounded-lg shadow">
        <source src={url} type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo.
      </video>
    );
  }

  if (type === 'audio') {
    return (
      <audio controls className="w-full">
        <source src={url} type="audio/mpeg" />
        Votre navigateur ne supporte pas l’audio.
      </audio>
    );
  }

  if (type === 'pdf') {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
        📄 Voir le PDF
      </a>
    );
  }

  return (
    <a
      href={url}
      download={filename}
      className="text-blue-500 underline"
    >
      📎 Télécharger {filename || "le fichier"}
    </a>
  );
};

export default MediaPreview;

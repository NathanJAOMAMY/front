import React from "react";

interface ConversationInfoProps {
  createdAt: string | Date;
  mediaCount: number;
  participantCount: number;
}

const ConversationInfo: React.FC<ConversationInfoProps> = ({
  createdAt,
  mediaCount,
  participantCount,
}) => {
  // Format date en français
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl">
      {/* Création */}
      <div className="flex flex-col justify-between">
        <span className="text-sm text-gray-500">Créé</span>
        <span className="text-gray-800 px-2 font-medium">{formattedDate}</span>
      </div>

      {/* Nombre de participants */}
      <div className="flex flex-col justify-between">
        <span className="text-sm text-gray-500">Nombre de participants</span>
        <span className="text-gray-800 px-2 font-semibold">{participantCount}</span>
      </div>
      {/* Nombre de fichiers */}
      <div className="flex flex-col justify-between">
        <span className="text-sm text-gray-500">Nombre de fichiers (images & documents)</span>
        <span className="text-gray-800 px-2 font-semibold">{mediaCount}</span>
      </div>
    </div>
  );
};

export default ConversationInfo;

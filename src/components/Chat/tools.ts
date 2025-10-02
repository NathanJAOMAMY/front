import type { ChatConversation, ChatMessage, User } from "../../data/typeData";

export const getLastMessageForConversation = (msg: ChatMessage[] = []) => {
  if (!msg || msg.length === 0) {
    return {
      content: "Pas encore de message",
      createdAt: new Date(),
    };
  }

  const lastMsg = msg.reduce((latest, m) =>
    new Date(m.createdAt).getTime() > new Date(latest.createdAt).getTime()
      ? m
      : latest
  );

  const hasText = lastMsg.content && lastMsg.content.trim() !== "";
  const hasFile = !!lastMsg.file;

  return {
    content: hasText
      ? lastMsg.content
      : hasFile
      ? "Fichier envoyé"
      : "Pas encore de message",
    createdAt: lastMsg.createdAt,
  };
};
export const truncate = (text: string, maxLength: number = 30) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
const arraysAreEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  return a.slice().sort().join(",") === b.slice().sort().join(",");
};

export const conversationExist = (
  listeConversations: ChatConversation[],
  nouveauxUserIds: string[]
): ChatConversation | null  => {
  for (const conv of listeConversations) {
    if (arraysAreEqual(conv.userIdConversations, nouveauxUserIds)) {
      return conv;
    }
  }
  return null;
};

export const getConversationDisplay = (
  userIdConversations: string[],
  userList: User[],
  currentUserId: string,
  name?: string,
  icon?: string
) => {
  // Trouver l'autre utilisateur
  const otherUser =
    userIdConversations.length === 2
      ? userList.find(
          ({ idUser }) =>
            idUser === userIdConversations.find((uid) => uid !== currentUserId)
        )
      : null;

  // Nom d'affichage
  const displayName = name || otherUser?.userName || "Groupe";

  // Initiale
  const initial =
    name?.[0]?.toUpperCase() || otherUser?.userName?.[0]?.toUpperCase() || "G";

  // Avatar à afficher
  let avatarToShow: string | null = null;
  if (otherUser?.avatar) {
    avatarToShow = otherUser.avatar;
  } else if (icon) {
    avatarToShow = icon;
  }

  return { otherUser, displayName, initial, avatarToShow };
};
export const getFileType = (url: string) => {
  const ext = url.split(".").pop()?.toLowerCase();
  if (!ext) return "unknown";

  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
    return "image";
  if (["mp4", "webm", "ogg"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg"].includes(ext)) return "audio";
  if (["pdf"].includes(ext)) return "pdf";

  return "other";
};

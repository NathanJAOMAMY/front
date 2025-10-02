export const getTypeFile = (
  type: string
):
  | "image"
  | "pdf"
  | "word"
  | "excel"
  | "compress"
  | "video"
  | "audio"
  | "text"
  | "office"
  | "default" => {
  if (!type) return "default"; // valeur par défaut si type absent
  const normalizedType = type.toLowerCase();

  if (
    ["png", "jpg", "jpeg", "gif", "webp", "svg"].some((ext) =>
      normalizedType.includes(ext)
    )
  ) {
    return "image";
  } else if (normalizedType.includes("pdf")) {
    return "pdf";
  } else if (
    ["xls", "xlsx", "doc", "docx", "ppt", "pptx","csv"].some((ext) =>
      normalizedType.includes(ext)
    )
  ) {
    return "office"; // PowerPoint → office
  } else if (["zip", "rar", "7z"].some((ext) => normalizedType.includes(ext))) {
    return "compress";
  } else if (
    ["mp4", "webm", "avi", "mov"].some((ext) => normalizedType.includes(ext))
  ) {
    return "video";
  } else if (
    ["mp3", "wav", "ogg"].some((ext) => normalizedType.includes(ext))
  ) {
    return "audio";
  } else if (
    ["txt", "md", "json", "csv", "xml"].some((ext) =>
      normalizedType.includes(ext)
    )
  ) {
    return "text";
  } else {
    return "default";
  }
};

export const getFileIcon = (type: string) => {
  const icons: Record<string, string> = {
    pdf: "material-icon-theme:pdf",
    compress: "mdi:folder-zip",
    video: "mdi:file-video",
    audio: "mdi:file-music",
    text: "mdi:file-document-outline",
    image: "mdi:file-image",
    default: "mdi:file-document",

    // Office
    doc: "vscode-icons:file-type-word",
    docx: "vscode-icons:file-type-word",
    csv: "vscode-icons:file-type-excel",
    xls: "vscode-icons:file-type-excel",
    xlsx: "vscode-icons:file-type-excel",
    ppt: "vscode-icons:file-type-powerpoint",
    pptx: "vscode-icons:file-type-powerpoint",
  };

  return icons[type] || icons.default;
};

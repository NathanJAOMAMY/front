 export  const getTypeFile = (type)=>{
  const normalizedType = type.toLowerCase();

     if (normalizedType.includes("png") || normalizedType.includes("jpg") || normalizedType.includes("jpeg")) {
    return "image";
  } else if (normalizedType.includes("pdf")) {
    return "pdf";
  } else if (normalizedType.includes("doc") || normalizedType.includes("docx")) {
    return "word";
  } else if (normalizedType.includes("xls") || normalizedType.includes("xlsx")) {
    return "excel";
  } else if (normalizedType.includes("zip") || normalizedType.includes("rar")) {
    return "compress";
  } else {
    return "default";
  }
  }

  export const getFileIcon = (type)=>{

      const icons = {
    pdf: "material-icon-theme:pdf",
    excel: "vscode-icons:file-type-excel",
    word: "vscode-icons:file-type-word",
    // compress: "vscode-icons:file-type-zip",
    default: "mdi:file-document",
     compress: "mdi:folder-zip",
  };

   // Normalisation pour éviter les erreurs de casse
  const file = getTypeFile(type);

 return icons[file]
  }
import React, { useEffect, useState } from "react";
import mammoth from "mammoth";
import { supabase } from "../supabase";

const WordViewer = ({ fileUrl, folder = false, loading }) => {
  const [content, setContent] = useState("");

  const foldername = folder ? `${folder}/` : "";

  useEffect(() => {
    const fetchWordFile = async () => {
       const response = await supabase
    .storage
    .from('intranet')
    .download(`file/${foldername}${fileUrl.split('/').pop()}`);

      const arrayBuffer = await response.data.arrayBuffer();

      const result = await mammoth.convertToHtml({ arrayBuffer });
      setContent(result.value);
    };

    fetchWordFile();
  }, [fileUrl]);

    if (loading) {
    return (
      <p className="text-center text-blue-500">Chargement du fichier Word...</p>
    );
  }

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default WordViewer;

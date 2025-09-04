import { supabase } from "../supabase";
import { v4 as uuid } from "uuid";
import { User } from "../typeData";

const userVoid: User = {
  idUser: "",
  userName: "Inconnu",
  surname: "Inconnu",
  pseudo: "",
  password: "",
  email: "",
  responsibilities: [],
  statusUser: true,
  role: "",
  createdAt: "",
  updatedAt: "",
  avatar: "",
};
export const uploadFile = async (
  file: File,
  uploadTo: string
): Promise<string | undefined> => {
  if (!file) return undefined;

  const fileExt = file.name.split(".").pop();
  const filePath = `${uploadTo}/${uuid()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("intranet")
    .upload(filePath, file, {
      cacheControl: "1500",
      upsert: false, // empêche l’écrasement si le fichier existe déjà
    });

  if (error) {
    console.error("Erreur lors de l'upload :", error.message);
    return undefined;
  }

  const { data: urlData } = supabase.storage
    .from("intranet")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

export const deleteFile = async (fileUrl : string) => {
  if (!fileUrl) return false;

  try {
    // Extraire le chemin relatif du fichier dans le bucket
    const baseUrl = "https://mxbzfekwbvybtxlutkpz.supabase.co/storage/v1/object/public/intranet/";
    const filePath = fileUrl.replace(baseUrl, "");

    if (!filePath) return false;

    const { data, error } = await supabase.storage
      .from("intranet")
      .remove([filePath]);

    if (error) {
      console.error("Erreur suppression fichier :", error.message);
      return false;
    }

    // console.log("Fichier supprimé avec succès :", data);
    return true;
  } catch (err) {
    console.error("Erreur deleteFile :", err);
    return false;
  }
};

export const downloadFile = async (url: string, filename: string) => {
  const response = await fetch(url);
  const blob = await response.blob();

  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl); // nettoyage
};
export const findeUser = (idUser: string, allUsers :User[]) => {
  let userFinded = allUsers.find((u) => u.idUser === idUser);
  return userFinded ? userFinded : userVoid;
};

import { useState } from "react";
import axios from "axios";
import { supabase } from "../supabase";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api";
import { File, Folder } from "../data/typeData";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { updateFile, updateFolder, uploadFile } from "../tools/tools";
import { folderVoid } from "../data/voidData";

const useFilesManager = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loadingFile, setLoadingFile] = useState(false);
  const [progress, setProgress] = useState(0);
  const [navagation, setNavigation] = useState<string[]>([]);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [currentFolder, setCurrentFolder] = useState<Folder>(folderVoid);
  const [isDownloading, setIsDownloading] = useState(false);

  // Récupérer fichiers
  const getFiles = async (
    folder: Folder,
    userId: string = currentUser.idUser,
    isDepartement: boolean = false,
    departmentRoutes?: string
  ) => {
    setLoadingFile(true);
    try {
      const params: {
        folderId: string;
        userId?: string;
        departmentRoutes?: string;
      } = {
        folderId: folder.id,
        departmentRoutes: departmentRoutes,
      };
      if (!isDepartement) {
        params.userId = userId;
      }

      const res = await axios.get<{ allFiles: File[] }>(
        `${API_BASE_URL}/file`,
        { params: params }
      );

      setFiles(res.data.allFiles);
    } catch (err) {
      console.error("Erreur getFiles:", err);
    } finally {
      setLoadingFile(false);
    }
  };

  // Récupérer dossiers
  const getFolders = async (
    parentFolderId: string,
    userId: string = currentUser.idUser,
    isDepartement: boolean = false,
    departmentRoutes?: string
  ) => {
    try {
      const params: {
        parentFolderId: string;
        departmentRoutes?: string;
        userId?: string;
      } = { parentFolderId, departmentRoutes: departmentRoutes };
      if (!isDepartement) {
        params.userId = userId;
      }

      const res = await axios.get<{ data: Folder[] }>(
        `${API_BASE_URL}/folder`,
        { params: params }
      );

      setFolders(res.data.data);
    } catch (err) {
      console.error("Erreur getFolders:", err);
    }
  };

  // Crée récursivement les dossiers pour un chemin relatif
  const ensureFolderPath = async (
    relativePath: string,
    parentId: string | "/"
  ): Promise<string> => {
    const parts = relativePath.split("/");
    parts.pop();
    let currentParentId = parentId;

    for (const folderName of parts) {
      let existing = folders.find((f) => f.name === folderName);
      console.log(folders);
      if (existing) {
        currentParentId = existing.id;
      } else {
        const newFolder: Folder = {
          id: uuid(),
          name: folderName,
          parentFolderId: currentParentId,
          userId: currentUser.idUser,
          userIdAcces: [],
        };
        await axios.post(`${API_BASE_URL}/folder`, newFolder);
        currentParentId = newFolder.id;
        setFolders((prev) => [...prev, newFolder]); // met à jour la liste locale
      }
    }

    return currentParentId;
  };
  const handleUploadFile = async (files: FileList) => {
    setLoadingFile(true);

    try {
      // Vérification : est-ce qu'il existe au moins un fichier avec extension ?
      const hasExtension = Array.from(files).some((file) => {
        return file.name.includes(".") && !!file.name.split(".").pop();
      });

      if (!hasExtension) {
        toast.error(
          "Veuillez ajouter uniquement des fichiers, pas des dossiers !"
        );
        setLoadingFile(false);
        return;
      }

      const folderPaths = new Set<string>();

      Array.from(files).forEach((file) => {
        const relativePath = file.webkitRelativePath || file.name;
        const parts = relativePath.split("/");
        parts.pop(); // enlever le nom du fichier

        if (parts.length > 0) folderPaths.add(parts.join("/"));
      });

      const folderIdMap: Record<string, string> = {};
      for (const path of folderPaths) {
        const folderId = await ensureFolderPath(path, currentFolder.id || "/");
        folderIdMap[path] = folderId;
      }

      for (const file of Array.from(files)) {
        const relativePath = file.webkitRelativePath || file.name;
        const parts = relativePath.split("/");
        parts.pop();
        const url = await uploadFile(file, "file/");

        if (url) {
          const infoFile: File = {
            id: uuid(),
            fileName: file.name,
            originalName: file.name,
            sizeFile: file.size,
            typeFile: file.name.split(".").pop() || "unknown",
            mimeType: file.type,
            url,
            folderId: currentFolder.id,
            userId: currentUser.idUser,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: "active",
          };
          await axios.post(`${API_BASE_URL}/file`, infoFile);
          toast.success(`Fichier ${file.name} uploadé avec succès !`);
        }
      }

      getFiles(currentFolder, currentUser.idUser);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l’upload des fichiers");
    } finally {
      setLoadingFile(false);
    }
  };

  // Suppression fichier
  const removeFile = async (id: string, url: string): Promise<void> => {
    try {
      await supabase.storage
        .from("intranet")
        .remove([`file/${url.split("/").pop()}`]);
      await axios.delete(`${API_BASE_URL}/file/${id}`);
      toast.success("Fichier supprimé");
      getFiles(currentFolder, currentUser.idUser);
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Suppression d’un dossier
  const removeFolder = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/folder/${id}`);
      toast.success("Dossier supprimé");
      getFolders(currentFolder?.id);
    } catch (err) {
      toast.error("Erreur lors de la suppression du dossier");
    }
  };

  // Télécharger un dossier (zip)
  const downloadFolder = async (folderId: string, folderName: string) => {
    try {
      setIsDownloading(true);
      const response = await axios.get(
        `${API_BASE_URL}/folder/download-folder/${folderId}`,
        {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            console.log(progressEvent);
            const total = progressEvent.total ?? 0;
            const current = progressEvent.loaded;
            const percentCompleted = Math.floor((current / total) * 100);
            setProgress(percentCompleted);
          },
        }
      );
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${folderName}.zip`;
      link.click();
      setProgress(0);
      toast.success("Dossier téléchargé avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du téléchargement du dossier");
      setProgress(0);
    } finally {
      setIsDownloading(false);
    }
  };

  // Création d’un dossier
  const createFolder = async (folderName: string) => {
    if (!folderName.trim()) {
      toast.warning("Le nom du dossier est requis !");
      return;
    }
    const folder: Folder = {
      id: uuid(),
      name: folderName,
      parentFolderId: currentFolder.id,
      userId: currentUser.idUser,
      userIdAcces: [],
    };
    try {
      await axios.post(`${API_BASE_URL}/folder`, folder);
      toast.success("Dossier créé avec succès !");
      getFolders(currentFolder?.id);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création du dossier");
    }
  };

  // Renommer un fichier
  const renameFile = async (id: string, newName: string) => {
    if (!newName.trim()) {
      toast.warning("Le nouveau nom est requis !");
      return;
    }
    try {
      await updateFile(id, newName);
      toast.success("Fichier renommé avec succès !");
      getFiles(currentFolder);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du renommage du fichier");
    }
  };

  // Renommer un dossier
  const renameFolder = async (id: string, newName: string) => {
    if (!newName.trim()) {
      toast.warning("Le nouveau nom est requis !");
      return;
    }
    try {
      let response = await updateFolder(id, newName);
      if (response) {
        toast.success("Dossier renommé avec succès !");
        getFolders(currentFolder.id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du renommage du dossier");
    }
  };

  return {
    files,
    folders,
    loadingFile,
    progress,
    navagation,
    currentFolder,
    isDownloading,
    setCurrentFolder,
    setProgress,
    setNavigation,
    getFiles,
    getFolders,
    handleUploadFile,
    removeFile,
    removeFolder,
    renameFile,
    renameFolder,
    downloadFolder,
    createFolder,
  };
};

export default useFilesManager;

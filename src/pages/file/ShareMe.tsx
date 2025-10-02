import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { File, Folder } from "../../data/typeData";
import FileGrid from "../../components/Files/FileGrid";
import FolderGrid from "../../components/Files/FolderGrid";
import { API_BASE_URL } from "../../api";
import useFilesManager from "../../hooks/useFilesManager";
import { downloadFile } from "../../tools/tools";
import { MdChevronRight } from "react-icons/md";
import axios from "axios";
import FileViewer from "../../components/Files/FileViewer";
import ImageModal from "../../components/Files/modals/ImageModal";

type FolderTree = Folder & { files?: File[]; folders?: FolderTree[] };
interface ShareMeProps {
  title: string;
}
const ShareMe: React.FC<ShareMeProps> = ({ title }) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [folders, setFolders] = useState<FolderTree[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [currentFolder, setCurrentFolder] = useState<FolderTree | null>(null);
  const [navigateFolder, setNavigateFolder] = useState<FolderTree[]>([]);
  const [loading, setLoading] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const { downloadFolder } = useFilesManager();

  // Récupère la racine des partages
  useEffect(() => {
    if (!currentUser?.idUser) return;
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/folder/shared-with-me?userId=${currentUser.idUser}`)
      .then((res) => setFolders(res.data.folders || []))
      .catch(() => setFolders([]))
      .finally(() => setLoading(false));
    axios
      .get(`${API_BASE_URL}/file/shared-with-me?userId=${currentUser.idUser}`)
      .then((res) => setFiles(res.data.files || []))
      .catch(() => setFiles([]));
  }, [currentUser]);

  // Ouvre un dossier partagé (récupère son contenu)
  const handleOpenFolder = async (folder: FolderTree) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/folder/tree/${folder.id}`);
      setCurrentFolder(res.data.data);
      setNavigateFolder((prev) => [...prev, folder]);
    } catch {
      // gestion d'erreur
    } finally {
      setLoading(false);
    }
  };

  // Breadcrumb navigation
  const handleBreadcrumbClick = async (index: number) => {
    if (index === -1) {
      setCurrentFolder(null);
      setNavigateFolder([]);
      return;
    }
    const folder = navigateFolder[index];
    const res = await axios.get(`${API_BASE_URL}/folder/tree/${folder.id}`);
    setCurrentFolder(res.data.data);
    setNavigateFolder(navigateFolder.slice(0, index + 1));
  };
  // IDs des dossiers partagés (pour filtrer les fichiers racine)
  const sharedFolderIds: string[] = folders.map((f) => String(f.id));

  // Fichiers racine = fichiers sans parentFolderId
  const rootFiles = files.filter(
    (file) =>
      !file.folderId ||
      file.folderId === "/" ||
      !sharedFolderIds.includes(file.folderId)
  );

  // Affichage dynamique
  const displayedFolders = currentFolder ? currentFolder.folders || [] : folders;
  const displayedFiles = currentFolder ? currentFolder.files || [] : rootFiles;

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleViewFile = (file: File) => {
    setSelectedFile(file);
    setIsViewerOpen(true);
  };

  return (
    <div className="px-4 py-2">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 pb-3 relative">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      {/* Breadcrumb */}
      <div className="flex gap-2 text-sm mb-2">
        <span
          className="cursor-pointer text-primary"
          onClick={() => handleBreadcrumbClick(-1)}
        >
          Racine
        </span>
        {navigateFolder.map((folder, index) => (
          <span key={folder.id} className="flex gap-1 items-center">
            <MdChevronRight />
            <span
              className="cursor-pointer"
              onClick={() => handleBreadcrumbClick(index)}
            >
              {folder.name}
            </span>
          </span>
        ))}
      </div>
      <ImageModal
        isOpen={isImageOpen}
        imageUrl={imageUrl}
        onClose={() => setIsImageOpen(false)}
      />
      {/* Dossiers */}
      <FolderGrid
        folders={displayedFolders}
        isMenuOpen={openMenuIndex}
        onCloseMenu={() => setOpenMenuIndex(null)}
        onToggleMenu={(index) => setOpenMenuIndex(index)}
        onOpenFolder={handleOpenFolder}
        onDownload={downloadFolder}
        onRemove={() => { }}
        onRename={() => { }}
        onShare={() => { }}
        onShareDepartement={() => { }}
        context="shareme"
      />
      {/* Fichiers */}
      <FileGrid
        files={displayedFiles}
        onViewFile={handleViewFile}
        onImageClick={(url) => {
          setImageUrl(url);
          setIsImageOpen(true);
        }}
        onDownload={downloadFile}
        onDelete={() => { }}
        onRename={() => { }}
        onShare={() => { }}
        onShareDepartement={() => { }}
        context="shareme"
      />
      {!loading &&
        displayedFolders.length === 0 &&
        displayedFiles.length === 0 && (
          <div className="mt-4 text-gray-500">Aucun fichier ou dossier reçu.</div>
        )}
      {/* Viewer */}
      {isViewerOpen && selectedFile && (
        <FileViewer file={selectedFile} onClose={() => setIsViewerOpen(false)} />
        // <RenderPreview file={selectedFile}></RenderPreview>
      )}
    </div>
  );
};

export default ShareMe;
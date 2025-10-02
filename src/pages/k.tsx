import { FC, useEffect, useRef, useState } from "react";
import CreateFolderModal from "../components/Files/modals/CreateFolderModal";
import useFilesManager from "../hooks/useFilesManager";
import FileGrid from "../components/Files/FileGrid";
import FileViewer from "../components/Files/FileViewer";
import Uploader, { UploaderRef } from "../components/Files/Uploader";
import { Pannel } from "../components/Ts/Utils";
import ImageModal from "../components/Files/modals/ImageModal";
import { File, Folder } from "../data/typeData";
import FolderGrid from "../components/Files/FolderGrid";
import { Icon } from "@iconify/react/dist/iconify.js";
import RenameModal from "../components/Files/modals/RenameModal";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { folderVoid } from "../data/voidData";
import { downloadFile } from "../tools/tools";
import { MdChevronRight } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api";
import ShareModal from "../components/Files/modals/ShareModal";
import { FiLoader } from "react-icons/fi";

interface HomeProps {
  title: string;
  path: string;
  departement?: boolean;
}

const Home: FC<HomeProps> = ({ title, path, departement = false }) => {
  const [isCreateFolderOpen, setModaleCreateFolder] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [navigateFolder, setNavigateFolder] = useState<Folder[]>([]);
  const [showModalImport, setShowModalImport] = useState<boolean>(false);
  const uploaderFileRef = useRef<UploaderRef>(null);
  const uploaderFolderRef = useRef<UploaderRef>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{
    id: string;
    type: "file" | "folder";
    name: string;
  }>();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<any>(null);

  const {
    files,
    folders,
    currentFolder,
    isDownloading,
    createFolder,
    getFiles,
    handleUploadFile,
    removeFile,
    removeFolder,
    downloadFolder,
    setCurrentFolder,
    getFolders,
    renameFile,
    renameFolder,
  } = useFilesManager();

  const users = useSelector((state: RootState) => state.user.users) || [];
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const isDepartement = departement === true;

  const handleViewFile = (file: File) => {
    setSelectedFile(file);
    setIsViewerOpen(true);
  };

  const openRenameModal = (
    id: string,
    type: "file" | "folder",
    currentName: string
  ) => {
    setRenameTarget({ id, type, name: currentName });
    setRenameModalOpen(true);
  };

  const handleRename = async (newName: string) => {
    if (!renameTarget) return;
    try {
      if (renameTarget.type === "file") {
        await renameFile(renameTarget.id, newName);
      } else {
        await renameFolder(renameTarget.id, newName);
      }
    } catch (err) {
      console.error("Erreur rename:", err);
      toast.error("Erreur lors du renommage");
    } finally {
      setRenameModalOpen(false);
    }
  };

  const openShareModal = (target: any) => {
    setShareTarget(target);
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
    setShareTarget(null);
  };

  const handleShareConfirm = async (userIds: string[]) => {
    if (!shareTarget) return;
    try {
      if ("fileName" in shareTarget) {
        await axios.post(`${API_BASE_URL}/file/share/${shareTarget.id}`, {
          userIdAcces: userIds,
        });
        toast.success("Fichier partagé !");
      } else {
        await axios.post(`${API_BASE_URL}/folder/share/${shareTarget.id}`, {
          userIdAcces: userIds,
        });
        toast.success("Dossier partagé !");
      }
      closeShareModal();
    } catch (err) {
      toast.error("Erreur lors du partage");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.idUser) return;
      setLoadingData(true);

      try {
        await Promise.all([
          getFiles({ ...folderVoid, id: path }, currentUser.idUser, isDepartement),
          getFolders(path, currentUser.idUser, isDepartement),
        ]);

        if (currentFolder.id !== path) {
          setCurrentFolder({
            ...folderVoid,
            id: path,
            userId: currentUser.idUser,
          });
          setNavigateFolder([]);
        }
      } catch (err) {
        console.error("Erreur lors du chargement initial :", err);
        toast.error("Impossible de charger les fichiers/dossiers");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, path, isDepartement]);


  return (

    <div className="flex flex-col gap-2 px-4 relative">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 pb-3 relative">
        <h1 className="text-xl font-semibold">{title}</h1>

        <button
          onClick={() => setShowModalImport(true)}
          className="px-4 flex gap-2 py-2 items-center bg-primary/90 text-white rounded-lg hover:bg-primary transition"
        >
          <Icon icon="icon-park-outline:upload-one" /> Nouveau
        </button>

        {showModalImport && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowModalImport(false)}
            ></div>
            <div className="absolute top-[90%] right-0 w-56 rounded-lg shadow-2xs bg-background-primary z-50 p-2">
              <button
                onClick={() => setModaleCreateFolder(true)}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
              >
                <Icon icon="mdi:folder-plus-outline" /> Nouveau Dossier
              </button>

              <button
                onClick={() => uploaderFileRef.current?.openFileDialog()}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
              >
                <Icon icon="mdi:file-import-outline" /> Importer des fichiers
              </button>

              <Uploader
                ref={uploaderFileRef}
                onlyDrop={true}
                multiple={true}
                accept=".pdf,.docx,image/*"
                onUpload={(files) => {
                  setShowModalImport(false);
                  handleUploadFile(files);
                }}
              />

              <button
                onClick={() => uploaderFolderRef.current?.openFileDialog()}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
              >
                <Icon icon="mdi:folder-upload-outline" /> Importer un dossier
              </button>

              <Uploader
                ref={uploaderFolderRef}
                onlyDrop={true}
                multiple={true}
                folder={true}
                onUpload={(files) => {
                  handleUploadFile(files);
                  setShowModalImport(false);
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Breadcrumb / navigation */}
      <div className="flex gap-2 text-sm mb-2">
        <span
          className="cursor-pointer text-primary"
          onClick={() => {
            // reset breadcrumb and current folder to root path
            setNavigateFolder([]);
            getFolders(path, currentUser?.idUser ?? "", isDepartement);
            getFiles({ ...folderVoid, id: path }, currentUser?.idUser ?? "", isDepartement);
            setCurrentFolder({ ...folderVoid, id: path, userId: currentUser?.idUser });
          }}
        >
          Racine
        </span>

        {navigateFolder.map((folder, index) => (
          <span key={folder.id} className="flex gap-1 items-center">
            <MdChevronRight />
            <span
              className="cursor-pointer"
              onClick={() => {
                setCurrentFolder(folder);
                getFiles(folder, currentUser?.idUser ?? "", isDepartement);
                getFolders(folder.id, currentUser?.idUser ?? "", isDepartement);
                setNavigateFolder((prev) => prev.slice(0, index + 1));
              }}
            >
              {folder.name}
            </span>
          </span>
        ))}
      </div>

      <Uploader
        onlyDrop={false}
        onUpload={(files) => {
          handleUploadFile(files);
        }}
      />

      {/* Modals */}
      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setModaleCreateFolder(false)}
        onCreate={createFolder}
      />
      <RenameModal
        isOpen={renameModalOpen}
        currentName={renameTarget?.name || ""}
        onClose={() => setRenameModalOpen(false)}
        onRename={handleRename}
      />
      <ImageModal
        isOpen={isImageOpen}
        imageUrl={imageUrl}
        onClose={() => setIsImageOpen(false)}
      />

      {/* Fichiers et dossiers */}
      {currentFolder.id === "/" ? (
        <>
          <Pannel title="Mes dossiers">
            <FolderGrid
              folders={folders}
              isMenuOpen={openMenuIndex}
              onCloseMenu={() => setOpenMenuIndex(null)}
              onToggleMenu={(index) => setOpenMenuIndex(index)}
              onOpenFolder={(folder) => {
                setCurrentFolder(folder);
                getFiles(folder, currentUser?.idUser ?? "", isDepartement);
                getFolders(folder.id, currentUser?.idUser ?? "", isDepartement);
                setNavigateFolder((prev) => [...prev, folder]);
              }}
              onDownload={downloadFolder}
              onRemove={removeFolder}
              onRename={openRenameModal}
              onShare={openShareModal}
              context="home"
            />
            {folders.length === 0 && <div className="w-full text-center">Aucun dossier</div>}
          </Pannel>

          <Pannel title="Mes fichiers">
            <FileGrid
              files={files}
              onViewFile={handleViewFile}
              onImageClick={(url) => {
                setImageUrl(url);
                setIsImageOpen(true);
              }}
              onDelete={removeFile}
              onDownload={downloadFile}
              onRename={openRenameModal} // uniformisé : ouvre la modale
              onShare={openShareModal}
              context="home"
            />
            {files.length === 0 && <div className="w-full text-center">Aucun Fichier</div>}
          </Pannel>
        </>
      ) : (
        <>
          <FolderGrid
            folders={folders}
            isMenuOpen={openMenuIndex}
            onCloseMenu={() => setOpenMenuIndex(null)}
            onToggleMenu={(index) => setOpenMenuIndex(index)}
            onOpenFolder={(folder) => {
              setCurrentFolder(folder);
              getFiles(folder, currentUser?.idUser ?? "", isDepartement);
              getFolders(folder.id, currentUser?.idUser ?? "", isDepartement);
              setNavigateFolder((prev) => [...prev, folder]);
            }}
            onDownload={downloadFolder}
            onRemove={removeFolder}
            onRename={openRenameModal}
            onShare={openShareModal}
            context="home"
          />
          <FileGrid
            files={files as File[]}
            onViewFile={handleViewFile}
            onImageClick={(url) => {
              setImageUrl(url);
              setIsImageOpen(true);
            }}
            onDelete={removeFile}
            onDownload={downloadFile}
            onRename={openRenameModal}
            onShare={openShareModal}
            context="home"
          />
        </>
      )}

      <ShareModal
        isOpen={shareModalOpen}
        onClose={closeShareModal}
        fileName={
          shareTarget
            ? "fileName" in shareTarget
              ? shareTarget.fileName
              : shareTarget.name
            : ""
        }
        users={users}
        onShareConfirm={handleShareConfirm}
      />

      {/* Viewer */}
      {isViewerOpen && selectedFile && (
        <FileViewer file={selectedFile} onClose={() => setIsViewerOpen(false)} />
      )}

      {isDownloading && (
        <div className="flex items-center justify-center w-full h-full bg-black/50 fixed inset-0 z-100">
          <FiLoader className="animate-spin text-primary z-101 absolute" size={40} />
        </div>
      )}
    </div>
  );
};

export default Home;

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
import ShareDepartementModal from "../components/Files/modals/ShareDepartementModal";
import Button from "../components/UI/Button";

interface HomeProps {
  title: string;
  path: string;
  departement?: boolean;
  departementRoutes?: string;
}
const Home: FC<HomeProps> = ({ title, path, departement, departementRoutes }) => {
  const [isCreateFolderOpen, setModaleCreateFolder] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [navigateFolder, setNavigateFolder] = useState<Folder[]>([])
  const [showModalImport, setShowModalImport] = useState<boolean>(false);
  const uploaderFileRef = useRef<UploaderRef>(null);
  const uploaderFolderRef = useRef<UploaderRef>(null)
  const [renameTarget, setRenameTarget] = useState<{ id: string; type: "file" | "folder"; name: string }>();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<any>(null);
  const [shareDeptModalOpen, setShareDeptModalOpen] = useState(false);
  const [shareDeptTarget, setShareDeptTarget] = useState<any>(null);
  const isDepartement = departement === true;

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
    // console.log('rename before returne')
    if (!renameTarget) return;
    if (renameTarget.type === "file") {
      console.log('rename after returne')
      await renameFile(renameTarget.id, newName);
    } else {
      await renameFolder(renameTarget.id, newName);
    }

    setRenameModalOpen(false);
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
          userIdAcces: userIds
        });
        toast.success("Fichier partagé !");
      } else {
        await axios.post(`${API_BASE_URL}/folder/share/${shareTarget.id}`, {
          userIdAcces: userIds
        });
        toast.success("Dossier partagé !");
      }
      closeShareModal();
    } catch (err) {
      toast.error("Erreur lors du partage");
      console.error(err);
    }
  };

  const openShareDeptModal = (target: any) => {
    setShareDeptTarget(target);
    setShareDeptModalOpen(true);
  };

  const closeShareDeptModal = () => {
    setShareDeptModalOpen(false);
    setShareDeptTarget(null);
  };

  const handleShareDeptConfirm = async (departements: string[]) => {
    if (!shareDeptTarget) return;
    try {
      if ("fileName" in shareDeptTarget) {
        await axios.post(`${API_BASE_URL}/file/share-departement/${shareDeptTarget.id}`, {
          departementAcces: departements,
        });
        toast.success("Fichier partagé avec département !");
      } else {
        await axios.post(`${API_BASE_URL}/folder/share-departement/${shareDeptTarget.id}`, {
          departementAcces: departements,
        });
        toast.success("Dossier partagé avec département !");
      }
      closeShareDeptModal();
    } catch (err) {
      toast.error("Erreur lors du partage au département");
      console.error(err);
    }
  };

  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.idUser) return;
      setLoadingData(true);

      try {
        await Promise.all([
          getFiles({ ...folderVoid, id: path }, currentUser.idUser, isDepartement, departementRoutes),
          getFolders(path, currentUser.idUser, isDepartement, departementRoutes),
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
  }, [currentUser, path, isDepartement]);


  return (
    <div className="flex flex-col gap-2 px-4 relative">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 pb-3 relative">
        <h1 className="text-xl font-semibold">{title}</h1>
          <Button onClick={() => setShowModalImport(true)} title="Nouveau" variant="primary" icon="icon-park-outline:upload-one"></Button>
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

              {/* Ici le clic déclenche directement l’Uploader */}
              <button
                onClick={() => uploaderFileRef.current?.openFileDialog()}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
              >
                <Icon icon="mdi:file-import-outline" /> Importer des fichiers
              </button>
              {/* Uploader caché mais dispo via ref */}
              <Uploader
                ref={uploaderFileRef}
                onlyDrop={true}
                multiple={true}
                accept=".pdf,.docx,image/*"
                onUpload={(files) => {
                  setShowModalImport(false); // ferme le menu après upload
                  handleUploadFile(files)
                }}
              />
              <button
                onClick={() => uploaderFolderRef.current?.openFileDialog()}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
              >
                <Icon icon="mdi:folder-upload-outline" /> Importer un dossier
              </button>
              {/* Uploader caché mais dispo via ref */}
              <Uploader
                ref={uploaderFolderRef}
                onlyDrop={true}
                multiple={true}
                folder={true}
                onUpload={(files) => {
                  handleUploadFile(files)
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
            setNavigateFolder([]); // reset
            getFolders(path, currentUser.idUser, isDepartement, departementRoutes);
            getFiles({ ...folderVoid, id: path }, currentUser.idUser, isDepartement, departementRoutes);
            setCurrentFolder({ ...folderVoid, id: path, userId: currentUser.idUser });
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
                getFiles(folder, currentUser.idUser, isDepartement, departementRoutes);
                getFolders(folder.id, currentUser.idUser, isDepartement, departementRoutes);
                // supprimer les dossiers après ce niveau
                setNavigateFolder(navigateFolder.slice(0, index + 1));

              }}
            >
              {folder.name}
            </span>
          </span>
        ))}
      </div>


      {/* UploadLoader : drop direct dans le parent */}
      {/* <Uploader
        onlyDrop={false}
        onUpload={(files) => {
          handleUploadFile(files)
        }}
      /> */}

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
      <div className="flex flex-col relative w-full overflow-auto h-[67vh]">
        {/* Fichiers et dossiers */}
        {loadingData ? (<>
          <div className="flex items-center justify-center w-full h-full absolute inset-0 z-50">
            <FiLoader className="animate-spin text-primary absolute" size={40} />
          </div></>) : currentFolder.id === "/" ? (
            <>
              <Pannel title="Mes dossiers">
                <FolderGrid
                  folders={folders}
                  isMenuOpen={openMenuIndex}
                  onCloseMenu={() => setOpenMenuIndex(null)}
                  onToggleMenu={(index) => setOpenMenuIndex(index)}
                  onOpenFolder={(folder) => {
                    setCurrentFolder(folder);
                    getFiles(folder, currentUser.idUser, isDepartement, departementRoutes);
                    getFolders(folder.id, currentUser.idUser, isDepartement, departementRoutes);
                    setNavigateFolder((prev) => [...prev, folder]);
                  }}
                  onDownload={downloadFolder}
                  onRemove={removeFolder}
                  onRename={openRenameModal}
                  onShare={openShareModal}
                  onShareDepartement={openShareDeptModal}
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
                    // setCurrentFile()
                  }}
                  onDelete={removeFile}
                  onDownload={downloadFile}
                  onRename={openRenameModal}
                  onShare={openShareModal}
                  onShareDepartement={openShareDeptModal}
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
                getFiles(folder, currentUser.idUser, isDepartement, departementRoutes);
                getFolders(folder.id, currentUser.idUser, isDepartement, departementRoutes);
                setNavigateFolder((prev) => [...prev, folder]);
              }}
              onDownload={downloadFolder}
              onRemove={removeFolder}
              onRename={openRenameModal}
              onShare={openShareModal}
              onShareDepartement={openShareDeptModal}
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
              onShareDepartement={openShareDeptModal}
              context="home"
            />
          </>
        )}
      </div>
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
        currentUserId={currentUser?.idUser || ""}
      />
      <ShareDepartementModal
        isOpen={shareDeptModalOpen}
        fileId={shareDeptTarget ? shareDeptTarget.id : null}
        onClose={closeShareDeptModal}
        onShareConfirm={handleShareDeptConfirm}
      />

      {/* Viewer */}
      {isViewerOpen && selectedFile && (
        <FileViewer file={selectedFile} onClose={() => setIsViewerOpen(false)} />
        // <RenderPreview file={selectedFile}></RenderPreview>
      )}
      {
        isDownloading && (
          <div className="flex items-center justify-center w-full h-full bg-black/50 fixed inset-0 z-50">
            <FiLoader className="animate-spin text-primary absolute" size={40} />
          </div>)
      }
    </div>
  );
};

export default Home;

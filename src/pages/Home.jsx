import React, { useCallback, useEffect, useState } from "react";
import { Modal, Pannel } from "../components/Utils";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import Menu from "../components/file/Menu";
import fileDownload from "js-file-download";
import DropdownMenu from "../components/DropdownMenu";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { v4 as uuid } from "uuid";
// notification
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { uploadFile } from "../tools/tools";

// importation de l'api
import { API_BASE_URL } from "../api";

import * as XLSX from "xlsx";
import WordViewer from "../components/WordViewer";
import { getFileIcon, getTypeFile } from "../utils/fileHelpers";
import { supabase } from "../supabase";
import Loader from "../components/file/Loader";
import ImageWithPlaceholder from "../components/ImageWithPlaceholder";

const Home = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState(null);
  const [insertedFile, setInsertedFile] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isGridOpen, setIsGridOpen] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [modalFolder, setModalFolder] = useState(false);
  const [fileTypeOpen, setFileTypeOpen] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [visibleRows, setVisibleRows] = useState(20);
  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  const [fileUrl, setFileUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // For folder and multifile
  const [folderName, setFolderName] = useState("");
  const [listFolder, setListFolder] = useState([]);

  const [progress, setProgress] = useState(0);
  const downloadFile = async (url, name) => {
    setFileLoading(true)
    try {
      const response = await supabase.storage
          .from("intranet")
          .download(`file/${url.split("/").pop()}`);

      fileDownload(response.data, name);
      // Reset après téléchargement
      toast.success("Téléchargement effectué avec succès !");
      setIsMenuOpen(null);
      setProgress(0);
    } catch (error) {
      console.error("Erreur de téléchargement", error);
      setProgress(0);
    }
    setFileLoading(false);
  };
  const downloadFolder = async (folderId, folderName) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/download-folder/${folderName}`,
        {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            const total = progressEvent.total;
            const current = progressEvent.loaded;
            const percentCompleted = Math.floor((current / total) * 100);
            setProgress(percentCompleted);
            console.log(percentCompleted);
          },
        }
      );

      fileDownload(response.data, `${folderName}.zip`);
      // Reset après téléchargement

      setProgress(0);
      setIsDownloaded(true);
      setIsGridOpen(null);
      setTimeout(() => {
        setIsDownloaded(false);
      }, 3000);
    } catch (error) {
      console.error("Erreur de téléchargement", error);
      setProgress(0);
    }
  };

  const handleImageClick = (url) => {
    setFileUrl(url);
    setIsImageOpen(true);
  };

  const closeModal = () => {
    setFileUrl("");
    setIsImageOpen(false);
  };

  // const isElectron = () =>{return navigator.userAgent.includes('electron')};

  const handleViewFile = async (type, url) => {
    // const folderName = null;
    // const url = `${API_BASE_URL}/file/read/${folderName}/${filename}`;
    setFileUrl(url);
    setIsOpen(true);
    setFileTypeOpen(type);

    if (type === "excel") {
      setLoading(true);
      try {
        const response = await supabase.storage
          .from("intranet")
          .download(`file/${url.split("/").pop()}`);

        // console.log(response.data);
        const arrayBuffer = await response.data.arrayBuffer();
        const dataArray = new Uint8Array(arrayBuffer);

        const workbook = XLSX.read(dataArray, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        setExcelData(json);
      } catch (err) {
        console.error("Erreur lecture Excel:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    console.log(fileUrl);
  }, [fileUrl]);

  useEffect(() => {
    console.log("type : ", fileTypeOpen);
  }, [fileTypeOpen]);

  const handleOpenMenu = useCallback(
    (id) => {
      setIsMenuOpen(isMenuOpen == id ? null : id);
    },
    [isMenuOpen]
  );

  const handleOpenGridMenu = useCallback(
    (id) => {
      setIsGridOpen(isGridOpen == id ? null : id);
    },
    [isGridOpen]
  );

  const handleOpenFlder = (id, folderName) => {
    navigate(`/file/${id}/${folderName}`);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);

    setFile(e.target.files[0]);
  };

  const handleFolderChange = (e) => {
    const selectedFolder = Array.from(e.target.files);
    setFolderName(e.target.files[0].webkitRelativePath.split("/")[0]);
    setFolder(selectedFolder);
  };

  const uploadMultipleFiles = async (files) => {
    try {
      const uploadPromises = files.map((file) => {
        
        const fileExt = file.name.split(".").pop();
        const path = `file/${
          file.webkitRelativePath.split("/")[0]
        }/${uuid()}.${fileExt}`;
        return (
          supabase.storage
            .from("intranet")
            .upload(path, file)
            // eslint-disable-next-line no-unused-vars
            .then(({ data, error }) => {
              if (error) throw error;

              // Retourner le lien public
              const { data : urlData } = supabase.storage
                .from("intranet")
                .getPublicUrl(path);
                
              return {
                id_file: uuid(),
                libelle_file: file.name,
                size_file: file.size,
                type_file: file.name.split(".").pop(),
                url: urlData.publicUrl,
              };
            })
        );
      });

      const results = await Promise.all(uploadPromises);
      console.log(
        "Tous les fichiers ont été uploadés avec leurs URLs :",
        results
      );
      return results;
    } catch (err) {
      console.error("Erreur lors de l’upload:", err.message);
      return null;
    }
  };

  const handleUploadFolder = async () => {
    // const formData = new FormData();

    setFileLoading(true);
    let data = {
      folder_id: uuid(),
      folder_name: folderName,
    }
    let infoFile = []
    const insertedFiles = await uploadMultipleFiles(folder)
    infoFile = insertedFiles
    console.log(infoFile);
    data["files"] = infoFile;

    try {
      await axios.post(`${API_BASE_URL}/file/many`, data);
      toast.success("Dossier importé avec succès !");
      getFiles();
      getFolders();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'importation.");
    }
    setFileLoading(false);
    setFolderName("");

  };

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);
  useEffect(() => {
    console.log(insertedFile);
  }, [insertedFile]);

  useEffect(() => {
    if (folder) {
      handleUploadFolder();
    }
  }, [folder]);

  useEffect(() => {
    getFolders();
    getFiles();
  }, []);

  const getFiles = async () => {
    setLoadingFile(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/file`);

      const myFile = response.data.data;
      setInsertedFile(myFile);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingFile(false);
    }
  };

  const getFolders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/folder`);

      const myFolders = response.data.data;
      setListFolder(myFolders);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFiles = async (id, image_url) => {
    setFileLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { data, error } = await supabase.storage
        .from("intranet")
        .remove(`file/${image_url.split("/").pop()}`);
      if (error) {
        toast.error("Error deleting file:", error.message);
      } else {
        
        await axios.delete(`${API_BASE_URL}/file/${id}`);
      }
      toast.success("Fichier supprimé avec succès !");
      getFiles();
      setIsMenuOpen(null);
    } catch (error) {
      console.log(error);
    }
    setFileLoading(false);
  };

  const removeFolder = async (id) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.delete(`${API_BASE_URL}/folder/${id}`);
      getFolders();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async (folderName) => {
    if (folderName) {
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await axios.post(`${API_BASE_URL}/folder`, {
          id_folder: uuid(),
          libelle_folder: folderName,
        });
        getFiles();
        setIsMenuOpen(null);
        setModalFolder(false);
        getFolders();
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.warning("Ce chammps est à remplir obligatoirement");
    }
  };

  const handleUpload = async () => {
    setFileLoading(true)
    const url = await uploadFile(file, "file");
    const infoFile = {
      id_file: uuid(),
      libelle_file: file.name,
      size_file: file.size,
      type_file: file.name.split(".").pop(),
      url: url,
    };

    console.log(file);

    try {
      const res = await axios.post(`${API_BASE_URL}/file`, infoFile);

      toast.success(res.data.message);
      getFiles();
      setFileLoading(false)
    } catch (err) {
      console.error(err);
      setFileLoading(false)
      toast.error("Erreur lors de l'envoi");
    }
  };

  // Function to run while wanna reading file

  const openFile = () => {
    if (loading) {
      return (
        <p className="text-center text-blue-500">Chargement du fichier...</p>
      );
    }

    if (fileTypeOpen === "pdf") {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-full"
          title="Aperçu du fichier"
        ></iframe>
      );
    } else if (fileTypeOpen === "image") {
      return <img src={fileUrl} className="h-[400px] mx-auto" alt="" />;
    } else if (fileTypeOpen === "excel") {
      return (
        <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          <table className="w-full text-left table-auto min-w-max">
            <tbody>
              {excelData.slice(0, visibleRows).map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-50">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`${
                        rowIndex === 0
                          ? "p-4 border-b border-slate-300 bg-slate-50"
                          : "p-4 border-b border-slate-200"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {visibleRows < excelData.length && (
            <div className="my-2 mx-2">
              <button
                onClick={() => setVisibleRows((prev) => prev + 20)}
                className="mt-2 px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                Charger plus
              </button>
            </div>
          )}
        </div>
      );
    } else if (fileTypeOpen === "word") {
      return <WordViewer fileUrl={fileUrl} loading={loading}/>;
    } else {
      return (
        <p className="text-gray-500 text-center">
          Type de fichier pas encore pris en charge.
        </p>
      );
    }
  };

  return (
    <div>
      <Modal
        handleValidate={() => handleCreate(folderName)}
        open={modalFolder}
        title="Créer un dossier"
        handleClose={() => setModalFolder(false)}
      >
        <input
          type="text"
          className="w-full mb-2 border rounded-md py-1 px-2"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
      </Modal>

      {/* Modal image avec animation */}
      <AnimatePresence>
        {isImageOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex items-center justify-center"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={`${fileUrl}`}
              alt="Aperçu"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-[80vw] max-h-[80vh] rounded-md shadow-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* <!-- From Uiverse.io by devAaus -->  */}
      {fileLoading && <div className="absolute top-0 flex items-center justify-center right-0 left-0 bottom-0 bg-black/10 z-50">
        <div className="flex-col gap-4 w-fit flex items-center justify-center p-4 bg-white  rounded-lg shadow-lg">
          <Loader/>
        </div>
      </div>}

      {/* Modal ou Viewer */}
      {isOpen && (
        <div className="fixed  inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white overflow-auto w-3/4 h-3/4 py-14 px-4 relative">
            <button
              className="absolute top-2 right-2 text-red-500 px-2 rounded-md transition-all duration-100 hover:bg-red-500 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Fermer
            </button>
            {openFile()}
          </div>
        </div>
      )}

      {progress > 0 && progress < 100 && (
        <div className="h-20 px-4 flex items-center gap-2 absolute z-900 bottom-10 right-2 bg-slate-400 rounded-xl">
          <p>Telechargement en cours</p>
          <div className="w-10 h-10">
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={buildStyles({
                textColor: "#fff",
              })}
            />
            ;
          </div>
        </div>
      )}

      {isDownloaded && (
        <div className="h-20 px-4 flex items-center absolute z-900 bottom-10 right-2 bg-slate-400 rounded-xl">
          <div className="text-base text-white flex items-center">
            <Icon className="size-10 text-green" icon="ei:check" />{" "}
            <span>Téléchagement effectuer !!</span>
          </div>
        </div>
      )}

      <div id="header" className="">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-lg">Bienvenu dans PromaCloud</p>
          <div>
            <DropdownMenu
              handleCreateFolder={() => setModalFolder(true)}
              handlechange={(e) => handleChange(e)}
              handleUploadFolder={handleFolderChange}
            />
            {/* <label
          htmlFor="uploadFile1"
          className="flex gap-1 bg-primary hover:bg-primary/80 text-white text-base font-medium px-4 py-2.5 outline-none rounded w-max cursor-pointer mx-auto items-center"
        >
          <Icon icon="icon-park-outline:upload-one" /> Nouveau
          <input type="file" id="uploadFile1" className="hidden" onChange={handleChange}/>
        </label>     */}
          </div>
        </div>
        <hr />
      </div>
      <div className="content mt-4">
        <Pannel title="Fichiers récentes">
          {loadingFile ? (
            <p className="text-center text-gray-500">
              Chargement des fichiers...
            </p>
          ) : insertedFile.length > 0 || listFolder.length > 0 ? (
            <div className="grid grid-cols-4 gap-4 items-center">
              {listFolder &&
                listFolder.map((item, key) => (
                  <div
                    key={key}
                    className="flex flex-col items-center relative justify-center cursor-pointer  rounded-lg shadow bg-neutral-100 p-2 hover:shadow-lg transition-shadow h-full"
                  >
                    <div className="absolute right-2 top-3">
                      <Menu
                        index={key}
                        isOpen={isGridOpen}
                        handleClick={() => handleOpenGridMenu(key)}
                        handleDownload={() =>
                          downloadFolder(item.id_folder, item.libelle_folder)
                        }
                        fileName={item.libelle_file}
                        handleRemove={() => removeFolder(item.id_folder)}
                        on="grid"
                      />
                    </div>
                    <div
                      className="flex items-center justify-center w-full h-full"
                      onClick={() =>
                        handleOpenFlder(item.id_folder, item.libelle_folder)
                      }
                    >
                      <Icon
                        className="w-2/3 h-2/3 text-amber-300"
                        icon="material-symbols:folder"
                      />
                    </div>
                    <p className="text-center text-sm mt-2">
                      {item.libelle_folder}
                    </p>
                  </div>
                ))}

              {insertedFile.map((item, key) => {
                return (
                  <div
                    key={key}
                    className="flex flex-col items-center justify-center cursor-pointer overflow-hidden rounded-lg shadow bg-neutral-100 p-2 hover:shadow-lg transition-shadow  h-full"
                  >
                    {getTypeFile(item.type_file) === "image" ? (
                      <div className="flex items-center justify-center w-full h-36" onClick={() => handleImageClick(item.url)}>
                        {/* <img
                          src={`${item.url}`}
                          className="object-contain max-h-full"
                          alt=""
                          onClick={() => handleImageClick(item.url)}
                        /> */}
                        <ImageWithPlaceholder src={`${item.url}`} alt={item.libelle_file}/>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-500">
                        <Icon
                          className="w-2/3 h-2/3"
                          icon={getFileIcon(item.type_file)}
                          onClick={() =>
                            handleViewFile(
                              getTypeFile(item.type_file),
                              item.url
                            )
                          }
                        />
                      </div>
                    )}

                    <div className="text-center mt-2 w-full">
                      <p className="truncate w-28 mx-auto">
                        {item.libelle_file.split(".")[0]}
                      </p>
                      <p className="text-sm text-gray-500">{item.type_file}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center">Aucune fichier récente.</div>
          )}
        </Pannel>

        <Pannel title="Mes fichiers">
          <div className="text-base relative">
            <table className="w-full text-left table-auto min-w-max px-2">
              <thead>
                <tr className="text-left p-4 border-b border-blue-gray-100">
                  <th className="py-2">Libelle fichier</th>
                  <th className="py-2">Date de création</th>
                  <th className="py-2">type</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {loadingFile ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Chargement des fichiers...
                    </td>
                  </tr>
                ) : insertedFile.length > 0 ? (
                  insertedFile.map((item, key) => (
                    <tr key={key} className="text-left h-4">
                      <td className="flex gap-1 items-center py-2">
                        <Icon icon="ion:images" /> {item.libelle_file}
                      </td>
                      <td className="py-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2">{item.type_file}</td>
                      <td className="py-2">
                        <Menu
                          index={key}
                          isOpen={isMenuOpen}
                          handleClick={() => handleOpenMenu(key)}
                          handleDownload={() => downloadFile(item.url, item.libelle_file)}
                          fileName={item.libelle_file}
                          handleRemove={() =>
                            removeFiles(item.id_file, item.url)
                          }
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Aucun fichier
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Pannel>
        {/* <ModalForm/> */}
      </div>
    </div>
  );
};

export default Home;

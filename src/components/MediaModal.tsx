import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiDownload } from "react-icons/fi";
import { downloadFile } from "../tools/tools";

interface MediaModalProps {
  isOpen: boolean;
  mediaFiles: string[];
  onClose: () => void;
  currentIndexSelected : number
}

const MediaModal: React.FC<MediaModalProps> = ({ isOpen, mediaFiles, onClose ,currentIndexSelected}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(currentIndexSelected);

useEffect(() => {
  setCurrentIndex(currentIndexSelected);
}, [currentIndexSelected]);


  if (!mediaFiles || mediaFiles.length === 0) return null;

  const currentFile = mediaFiles[currentIndex];
  const isVideo = /\.(mp4|webm)$/i.test(currentFile);

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : mediaFiles.length - 1));
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < mediaFiles.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fileName = currentFile.split("/").pop() || "fichier";
    downloadFile(currentFile, fileName);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
        >

          {/* Navigation */}
          <button
            onClick={showPrev}
            className="absolute left-4 text-white text-4xl p-2 hover:text-gray-300"
          >
            ‹
          </button>
          <button
            onClick={showNext}
            className="absolute right-4 text-white text-4xl p-2 hover:text-gray-300"
          >
            ›
          </button>

          {/* Téléchargement */}
          <div
            className="fixed top-8 right-10 text-white"
            onClick={handleDownload}
          >
            <FiDownload size={40} />
          </div>

          {/* Contenu */}
          {isVideo ? (
            <motion.video
              key={currentFile}
              src={currentFile}
              controls
              autoPlay
              className="max-w-[80vw] max-h-[80vh] rounded-md shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.img
              key={currentFile}
              src={currentFile}
              alt="Aperçu"
              className="max-w-[80vw] max-h-[80vh] rounded-md shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaModal;

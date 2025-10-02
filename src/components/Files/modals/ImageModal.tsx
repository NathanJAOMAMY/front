import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex items-center justify-center"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.img
            src={imageUrl}
            alt="Aperçu"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-[80vw] max-h-[80vh] rounded-md shadow-lg"
            onClick={(e) => e.stopPropagation()} // éviter fermeture en cliquant sur l'image
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;

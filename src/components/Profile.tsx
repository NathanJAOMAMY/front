import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { User } from "../typeData";
import { deleteFile, uploadFile } from "../tools/tools";
import { AnimatePresence , motion} from "framer-motion";

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onUpdate: (updatedUser: Partial<User>) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onUpdate }) => {
  const [editField, setEditField] = useState<keyof User | null>(null);
  const [tempValue, setTempValue] = useState("");

  const handleEdit = (field: keyof User) => {
    const value = user[field];
    if (field === "responsibilities" && Array.isArray(value)) {
      setTempValue(value.join(", "));
    } else {
      setTempValue(value !== undefined && value !== null ? String(value) : "");
    }
    setEditField(field);
  };

  const handleSave = () => {
    if (editField) {
      if (editField === "responsibilities") {
        const arr = tempValue
          .split(",")
          .map((r) => r.trim())
          .filter((r) => r.length > 0);
        onUpdate({ [editField]: arr });
      } else {
        onUpdate({ [editField]: tempValue });
      }
      setEditField(null);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (user.avatar) {
      let deleteOldeFile = await deleteFile(user.avatar);
      if (deleteOldeFile) {
        let urlFile = await uploadFile(file, 'avatar')
        if (urlFile) {
          onUpdate({ avatar: urlFile });
        }
      }
    }
    else {
      let urlFile = await uploadFile(file, 'avatar')
      if (urlFile) {
        onUpdate({ avatar: urlFile });
      }
    }
    setEditField(null);
  };

  const defaultAvatar = "https://mxbzfekwbvybtxlutkpz.supabase.co/storage/v1/object/public/intranet/avatar.png";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 text-black bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className=" bg-white rounded-xl shadow-xl w-[50%] max-w-5xl flex flex-col gap-4"
        >
          {/* Partie en haut */}
          <div className="text-lg font-bold p-2.5 bg-primary rounded-t-lg text-white text-center">Mon Profile</div>
          <div className="flex flex-col px-6 py-3 md:flex-row">
            {/* COLONNE GAUCHE - Lecture seule */}
            <div className="flex flex-col items-center w-full md:w-1/3 space-y-6">
              {/* Avatar avec upload au clic */}
              <div className="relative w-32 h-32">
                <img
                  src={user.avatar || defaultAvatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border border-gray-300 cursor-pointer"
                  onClick={() => document.getElementById("avatarInput")?.click()}
                  title="Cliquez pour changer l'avatar"
                />
                <div
                  onClick={() => document.getElementById("avatarInput")?.click()}
                  className="absolute inset-0 rounded-full hover:bg-opacity-60 flex justify-center items-center text-white text-lg font-semibold cursor-pointer transition-opacity duration-300"
                  aria-label="Changer l'avatar"
                >
                  <span className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <FiEdit />
                  </span>
                </div>
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              {/* Nom en lecture seule */}
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-800">{user.userName || "Non défini"}</h3>
              </div>

              {/* Responsabilités en lecture seule */}
              <div className="text-center">
                <h4 className="font-semibold mb-2 text-gray-700">Responsabilités</h4>
                <p className="text-gray-600 italic">
                  {user.responsibilities && user.responsibilities.length > 0
                    ? user.responsibilities.join(", ")
                    : "Non défini"}
                </p>
              </div>
            </div>

            {/* COLONNE DROITE - Édition possible */}
            <div className="flex flex-col w-full md:w-2/3 space-y-6">
              {/* Nom */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Nom :</label>
                {editField === "userName" ? (
                  <>
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus
                    />
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded transition"
                      >
                        Sauver
                      </button>
                      <button
                        onClick={() => setEditField(null)}
                        className="border border-primary text-primary rounded self-center cursor-pointer flex gap-2 hover:bg-black/5 items-center px-4 py-2 transition"
                      >
                        Annuler
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{user.userName || "Non défini"}</span>
                    <button
                      onClick={() => handleEdit("userName")}
                      className="text-primary hover:text-primary-dark ml-3"
                      aria-label="Modifier prénom"
                    >
                      <FiEdit size={20} />
                    </button>
                  </div>
                )}
              </div>
              {/* Prénom */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Prénom :</label>
                {editField === "surname" ? (
                  <>
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus
                    />
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded transition"
                      >
                        Sauver
                      </button>
                      <button
                        onClick={() => setEditField(null)}
                        className="border border-primary text-primary rounded self-center cursor-pointer flex gap-2 hover:bg-black/5 items-center px-4 py-2 transition"
                      >
                        Annuler
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{user.surname || "Non défini"}</span>
                    <button
                      onClick={() => handleEdit("surname")}
                      className="text-primary hover:text-primary-dark ml-3"
                      aria-label="Modifier prénom"
                    >
                      <FiEdit size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Pseudo */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Pseudo :</label>
                {editField === "pseudo" ? (
                  <>
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus
                    />
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded transition"
                      >
                        Sauver
                      </button>
                      <button
                        onClick={() => setEditField(null)}
                        className="border border-primary text-primary rounded self-center cursor-pointer flex gap-2 hover:bg-black/5 items-center px-4 py-2 transition"
                      >
                        Annuler
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">@{user.pseudo || "Non défini"}</span>
                    <button
                      onClick={() => handleEdit("pseudo")}
                      className="text-primary hover:text-primary-dark ml-3"
                      aria-label="Modifier pseudo"
                    >
                      <FiEdit size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Email :</label>
                {editField === "email" ? (
                  <>
                    <input
                      type="email"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus
                    />
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded transition"
                      >
                        Sauver
                      </button>
                      <button
                        onClick={() => setEditField(null)}
                        className="border border-primary text-primary rounded self-center cursor-pointer flex gap-2 hover:bg-black/5 items-center px-4 py-2 transition"
                      >
                        Annuler
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{user.email || "Non défini"}</span>
                    <button
                      onClick={() => handleEdit("email")}
                      className="text-primary hover:text-primary-dark ml-3"
                      aria-label="Modifier email"
                    >
                      <FiEdit size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Bouton Fermer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="border border-primary text-primary px-4 py-2 rounded transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileModal;

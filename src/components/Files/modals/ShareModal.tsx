import React, { useState } from "react";
import Button from "../../UI/Button";

interface User {
  idUser: string;
  userName: string;
  surname: string;
  pseudo: string;
  email: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  users: User[]; // Liste des utilisateurs à qui partager
  onShareConfirm: (userIds: string[]) => void;
  currentUserId: string; 
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  fileName,
  users,
  onShareConfirm,
  currentUserId,
}) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredUsers = users
  .filter((user) => user.idUser !== currentUserId) // exclure soi-même
  .filter((user) => {
    const term = (searchTerm || "").toLowerCase();
    return (
      (user.userName || "").toLowerCase().includes(term) ||
      (user.surname || "").toLowerCase().includes(term) ||
      (user.pseudo || "").toLowerCase().includes(term) ||
      (user.email || "").toLowerCase().includes(term)
    );
  });


  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 400 }}>
        <h2 className="mb-2 text-lg font-bold">Partager "{fileName}"</h2>
        <hr className="mb-4" />
        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <div className="mb-2">
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {searchTerm.trim() === "" ? (
              <p className="text-sm text-gray-500">
                Tapez un nom ou email pour rechercher
              </p>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.idUser} style={{ marginBottom: 6 }}>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={user.idUser}
                      checked={selectedUserIds.includes(user.idUser)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUserIds((prev) => [...prev, user.idUser]);
                        } else {
                          setSelectedUserIds((prev) =>
                            prev.filter((id) => id !== user.idUser)
                          );
                        }
                      }}
                    />
                    <span>
                      {user.userName} {user.surname} {user.email}
                    </span>
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucun utilisateur trouvé</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={onClose}
            title="Annuler"
            variant="secondary"
          >
          </Button>
          <Button
            onClick={() => {
              onShareConfirm(selectedUserIds);
              onClose();
            }}
            title="Partager"
            variant="primary"
          >
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
import { FC } from "react";
import Button from "./Button";
import { File, Folder } from "../../data/typeData";
import useFilesManager from "../../hooks/useFilesManager";
interface ModalDialogeProps {
  onClose: () => void;
  title: string;
  type: "File" | "Folder";
  action: "delete" | "rename" | "move" | "share";
  content: File | Folder;
}
const ModalDialoge: FC<ModalDialogeProps> = ({ onClose, title, type, content }) => {
  const { removeFile, removeFolder } = useFilesManager()
  const response = () => {
    if (type === "File") {
      // remo
    }
    onClose();
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed bg-black/50 inset-0 z-9" onClick={onClose}></div>
      <div className="flex flex-col bg-white rounded-lg p-6 z-10 w-1/3">
        <h2 className="text-xl font-semibold">Titre de la boîte de dialogue</h2>
        {/* <p className="">Contenu de la boîte de dialogue.</p> */}
        <div className="flex gap-1.5">
          <Button onClick={() => onClose} title="Non" variant="secondary" />
          <Button onClick={() => response} title="Oui" variant="primary" />
        </div>
      </div>
    </div>
  )
}
export default ModalDialoge;
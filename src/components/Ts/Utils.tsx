import { Icon } from "@iconify/react/dist/iconify.js";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState, MouseEvent } from "react";

// ---------- Button ----------
interface ButtonProps {
  title: string;
  type?: "success" | "secondary";
  handleSubmit?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  htmlType?: "button" | "submit" | "reset"; // <-- ajouté
}

export function Button({ title, type = "success", handleSubmit, htmlType = "button" }: ButtonProps) {
  return (
    <button
      type={htmlType} // <-- ici
      onClick={handleSubmit}
      className={`${type === "success"
        ? "bg-primary text-white"
        : "bg-transparent text-primary"
        } cursor-pointer rounded-md px-4 py-2`}
    >
      {title}
    </button>
  );
}

// export const ButtonUi = ()=>{

// }

// ---------- Pannel ----------
interface PannelProps {
  title: string;
  children?: ReactNode;
}

export const Pannel = ({ title, children }: PannelProps) =>{
  const [open, setOpen] = useState(false);

  return (
    <div className="text-normal mb-2">
      <div
        className="header mb-3 cursor-pointer text-normal flex items-center gap-2"
        onClick={() => setOpen(!open)}
      >
        <Icon
          icon="weui:arrow-outlined"
          className={`${open && "rotate-90"}`}
        />
        <p>{title}</p>
      </div>
      <div
        className={`${open ? "h-fit opacity-100" : "h-0 opacity-0 invisible"
          } py-1 transition-all duration-200`}
      >
        {children}
      </div>
    </div>
  );
}

// ---------- Modal ----------
interface ModalProps {
  title: string;
  handleValidate?: () => void;
  handleClose: () => void;
  open: boolean;
  children?: ReactNode;
}

export function Modal({
  title,
  handleValidate,
  handleClose,
  open,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ duration: 0.2 }}
        onClick={handleClose} className="fixed text-base flex items-center z-50 justify-center top-0 left-0 right-0 bottom-0 bg-black/40"
      >
        <div className="rounded-md min-w-[30%] bg-white py-5 px-4" onClick={(e) => e.stopPropagation()}>
          <p className="text-xl mb-3">{title}</p>
          {children}
          <div className="flex justify-end gap-2 mt-4">
            {handleValidate && (
              <button
                className="bg-primary px-2 py-1 rounded-md cursor-pointer text-white"
                onClick={handleValidate}
              >
                Valider
              </button>
            )}
            <button
              className="cursor-pointer border border-primary text-primary px-2 py-1 rounded"
              onClick={handleClose}
            >
              Annuler
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ---------- FileViewer ----------
export function FileViewer() {
  return null;
}

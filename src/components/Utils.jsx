import { Icon } from "@iconify/react/dist/iconify.js"
import { useState } from "react"

export function Button({ title, type, handleSubmit }) {
  return (
    <button onClick={handleSubmit} className={`${type === "success" ? "bg-primary text-white" : "bg-transparent text-primary"} cursor-pointer rounded-md px-4 py-2 `}>{title}</button>
  )
}

export function Pannel({ title, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="text-normal mb-2">
      <div className="header mb-3 cursor-pointer text-normal flex items-center gap-2">
        <Icon icon="weui:arrow-outlined" className={`${open && "rotate-90"} `} /><p onClick={() => setOpen(!open)}>{title}</p>
      </div>
      <div className={`${open ? "h-fit opacity-100" : "h-0 opacity-0 invisible"} py-1`}>
        {children}
      </div>
    </div>
  )
}

export function Modal({ title, handleValidate, handleClose, open, children }) {
  return open && (
    <div className="fixed text-base flex items-center z-50 justify-center top-0 left-0 right-0 bottom-0 bg-black/40 ">
      <div className="rounded-md min-w-[30%] bg-white py-5 px-4">
        <p className="text-xl mb-3">{title}</p>
        {children}
        <div className="flex justify-end gap-2">
          <button className="bg-primary px-2 py-1  rounded-md cursor-pointer text-white" onClick={handleValidate}>Valider</button>
          <button className="cursor-pointer border border-primary text-primary px-2 py-1 rounded" onClick={handleClose}>Annuler</button>
        </div>
      </div>
    </div>)
}

export function FileViewer() {

}
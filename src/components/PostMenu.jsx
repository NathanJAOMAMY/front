import React, { useState, useRef, useEffect } from "react";

export default function PostMenu({ onEdit, onDelete, isOwner }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  if (!isOwner) return null;
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen((v) => !v)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>⋯</button>
      {open && (
        <div className="post-menu-dropdown" >
          <button onClick={() => { setOpen(false); onEdit(); }} >Modifier</button>
          <button onClick={() => { setOpen(false); onDelete(); }} style={{color: "red"}}>Supprimer</button>
        </div>
      )}
    </div>
  );
}
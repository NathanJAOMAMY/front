import React, { useState, useRef, useEffect } from "react";
import { FiEdit, FiCheck } from "react-icons/fi";

interface EditableTextProps {
  value?: string;
  onChange?: (newValue: string) => void;
  className?: string;
  placeholder?: string;
}

const EditableText: React.FC<EditableTextProps> = ({
  value = "",
  onChange = () => { },
  className = "",
  placeholder = "Cliquer pour éditer",
}) => {
  const [text, setText] = useState<string>(value);
  const [editing, setEditing] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  // Ajuste la largeur de l'input selon le texte
  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      inputRef.current.style.width = `${spanRef.current.offsetWidth + 12}px`;
    }
  }, [text, editing]);

  // Focus auto
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const saveAndClose = () => {
    setEditing(false);
    onChange(text);
  };

  return (
    <div className={`flex gap-2 items-center text-gray-800 ${className}`}>
      {/* Élément caché pour mesurer la largeur du texte */}
      <span
        ref={spanRef}
        className="absolute text-primary invisible whitespace-pre px-3 py-1.5 border-2 border-transparent"
      >
        {text || placeholder}
      </span>

      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveAndClose()}
          onBlur={saveAndClose}
          className="border-2 border-primary rounded-xl px-3 py-1.5 outline-none bg-transparent 
                     focus:ring-2 focus:ring-primary/50 text-primary placeholder-gray-400 
                     transition-all duration-300 ease-in-out animate-scaleIn"
        />
      ) : (
        <span
          className="text-primary/70 cursor-pointer select-none"
          onClick={() => setEditing(true)}
        >
          {text || <span className="text-primary">{placeholder}</span>}
        </span>
      )}

      {!editing && (
        <span
          className="cursor-pointer text-primary/70 hover:text-primary transition-colors duration-200"
          onClick={() => setEditing(true)}
        >
          <FiEdit size={18} />
        </span>
      )}

      {editing && (
        <span
          className="cursor-pointer text-primary/70 hover:text-primary transform hover:scale-110 
                     transition-all duration-300 ease-in-out"
          onClick={saveAndClose}
        >
          <FiCheck size={18} />
        </span>
      )}
    </div>
  );
};

export default EditableText;

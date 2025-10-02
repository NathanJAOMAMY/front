import classNames from "classnames";
import { DragEvent, useRef, forwardRef, useImperativeHandle } from "react";

interface UploaderProps {
  onUpload: (files: FileList) => void;
  multiple?: boolean;
  onlyDrop?: boolean;
  accept?: string;
  folder?: boolean;
}

export interface UploaderRef {
  openFileDialog: () => void;
}

const Uploader = forwardRef<UploaderRef, UploaderProps>(
  ({ onUpload, multiple = true, accept, folder = false, onlyDrop = false }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFiles = (files: FileList | null) => {
      if (files && files.length > 0) {
        onUpload(files);
      }
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    };

    // Expose méthode openFileDialog
    useImperativeHandle(ref, () => ({
      openFileDialog: handleClick,
    }));

    return (
      <div
        className={classNames(
          !onlyDrop &&
            "border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
        )}
        onClick={!onlyDrop ? handleClick : undefined}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {!onlyDrop && (
          <>
            <p className="text-gray-500 mb-2">
              {folder
                ? "Déposez un dossier ici ou cliquez pour parcourir"
                : "Déposez des fichiers ici ou cliquez pour parcourir"}
            </p>
          </>
        )}

        {/* Input caché */}
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          {...(folder ? { webkitdirectory: "true", directory: "true" } : {})}
        />
      </div>
    );
  }
);

export default Uploader;

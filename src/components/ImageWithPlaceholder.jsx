import { useState } from "react";
import Loader from "./file/Loader";

export default function ImageWithPlaceholder({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative h-auto w-full">
      {/* Placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-lg flex items-center justify-center" >
            <Loader/>
        </div>
      )}    

      {/* Image réelle */}
      {loaded && <img
        src={src}
        alt={alt}
        className="object-contain max-h-full"
      />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className="hidden object-contain max-h-full"
      />
    </div>
  );
}

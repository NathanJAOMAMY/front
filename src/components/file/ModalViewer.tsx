import { FC } from "react"

interface ModalViewerProps {
  onClose: () => void
}
const ModalViewer: FC<ModalViewerProps> = ({ onClose }) => {
  const openFile = () => {
    return (
      <>hello</>
    )
  }
  // const openFile = () => {
  //   if (loading) {
  //     return (
  //       <p className="text-center text-blue-500">Chargement du fichier...</p>
  //     );
  //   }

  //   if (fileTypeOpen === "pdf") {
  //     return (
  //       <iframe
  //         src={fileUrl}
  //         className="w-full h-full"
  //         title="Aperçu du fichier"
  //       ></iframe>
  //     );
  //   } else if (fileTypeOpen === "image") {
  //     return <img src={fileUrl} className="h-[400px] mx-auto" alt="" />;
  //   } else if (fileTypeOpen === "excel") {
  //     return (
  //       <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
  //         <table className="w-full text-left table-auto min-w-max">
  //           <tbody>
  //             {excelData.slice(0, visibleRows).map((row, rowIndex) => (
  //               <tr key={rowIndex} className="hover:bg-slate-50">
  //                 {row.map((cell, cellIndex) => (
  //                   <td
  //                     key={cellIndex}
  //                     className={`${rowIndex === 0
  //                         ? "p-4 border-b border-slate-300 bg-slate-50"
  //                         : "p-4 border-b border-slate-200"
  //                       }`}
  //                   >
  //                     {cell}
  //                   </td>
  //                 ))}
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>

  //         {visibleRows < excelData.length && (
  //           <div className="my-2 mx-2">
  //             <button
  //               onClick={() => setVisibleRows((prev) => prev + 20)}
  //               className="mt-2 px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
  //             >
  //               Charger plus
  //             </button>
  //           </div>
  //         )}
  //       </div>
  //     );
  //   } else if (fileTypeOpen === "word") {
  //     return <WordViewer fileUrl={fileUrl} loading={loading} />;
  //   } else {
  //     return (
  //       <p className="text-gray-500 text-center">
  //         Type de fichier pas encore pris en charge.
  //       </p>
  //     );
  //   }
  // };
  return (
    <div className="fixed  inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white overflow-auto w-3/4 h-3/4 py-14 px-4 relative">
        <button
          className="absolute top-2 right-2 text-red-500 px-2 rounded-md transition-all duration-100 hover:bg-red-500 hover:text-white"
          onClick={onClose}
        >
          Fermer
        </button>
        {openFile()}
      </div>
    </div>
  )
}
export default ModalViewer;
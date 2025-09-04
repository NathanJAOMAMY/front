import React from 'react';

const PdfViewer = ({ fileName }) => {
  return (
    <div style={{ width: '100%', height: '800px' }}>
      <iframe
        src={`http://localhost:3001/uploads/${fileName}`}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        title="PDF Viewer"
      />
    </div>
  );
};

export default PdfViewer;

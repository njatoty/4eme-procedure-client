import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CCard, CCardBody, CCardHeader, CButton, CSpinner } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilCloudDownload } from '@coreui/icons';
import './../assets/css/fileUpload.css'

const FileUpload = ({ onUpload, label, showDownloadButton=false, onDownloadFile, required=false }) => {
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  // Fonction de gestion des fichiers déposés
  const onDrop = (acceptedFiles) => {
    setLoading(true);
    setFileName(acceptedFiles[0].name);
    onUpload?.(acceptedFiles);
    setLoading(false);
  };

  // Configuration de la dropzone avec la fonction onDrop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,  // Si vous souhaitez autoriser plusieurs fichiers
  });

  const baseStyle = {
    border: "1px dashed #8ab0d8",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    width: "100%",
    minHeight: "150px",
    margin: "20px auto",
    borderRadius: "8px",
    transition: "border 0.3s ease-in-out"
  }

  const activeStyle = {
    border: "2px solid #28a745",
    backgroundColor: "#f8f9fa",
  }

  return (
    <CCard>
      <CCardHeader>
        <h6>{label || 'AJOUTER UN FICHIER'}</h6>
      </CCardHeader>
      <CCardBody>
        <div {...getRootProps()} style={isDragActive ? {...baseStyle, ...activeStyle} : baseStyle} className='border-secondary'>
          <input {...getInputProps()} {...(required) && { required }} accept='application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'/>
          <p style={{ fontSize: '0.87rem'}}>
            {isDragActive ?
            "Déposez un fichier ici ..." :
            "Faites glisser et déposez un fichier ici, ou cliquez pour sélectionner"
            }
          </p>
          <CButton type='button' size='sm' color="secondary" className=''>
            {loading ? <CSpinner size="sm" /> : (label || 'AJOUTER UN FICHIER')}
          </CButton>
          {showDownloadButton && (
            <CButton
              type='button'
              size='sm'
              color="primary"
              className='ms-2'
              title='Télécharger le fichier'
              onClick={(e) => {
                e.stopPropagation();
                onDownloadFile?.()
              }}
            >
              <CIcon icon={cilCloudDownload} />
            </CButton>
          )}
          {fileName && <p style={{ fontSize: '0.87rem'}}>Fichier sélectionné: {fileName}</p>}
        </div>
      </CCardBody>
    </CCard>
  );
};

export default FileUpload;

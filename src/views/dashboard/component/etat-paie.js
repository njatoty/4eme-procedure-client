import React, { useCallback, useEffect, useState } from 'react'

import {
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow,
  CFormInput,
  CFormLabel,
  CButton,
  CForm
} from '@coreui/react'

import FileUpload from '../../../components/FileUpload'
import { copyDataToTheTemplate, downloadBlob, getFileFromServer, startProcessus } from '../../../services/services';
import FPOptionService from '../../../services/fp-option-service';

const EtatDePaie = () => {

  const [gssFile, setGssFile] = useState(null);
  const [templateFile, setTemplateFile] = useState(null);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [joursOuvrables, setJoursOuvrables] = useState('');
  const [joursOuvres, setJoursOuvres] = useState('');
  const [joursCalendaires, setJoursCalendaires] = useState('');
  const [plafondCnaps, setPlafondCnaps] = useState('262680');
  const [coutTransport, setCoutTransport] = useState('');
  const [coutRepas, setCoutRepas] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputFiles, setInputFiles] = useState([
    {
      name: 'template',
      label: 'Remplacer le fichier Template',
      required: false,
      download: true,
      onDownload: handleDownloadTemplate,
      onUpload: (files) => setUploadedFile('template', files[0]),
      value: null
    },
    {
      name: 'gss',
      label: 'Importer le fichier GSS',
      required: true,
      download: false,
      onUpload: (files) => setUploadedFile('gss', files[0]),
      value: null
    },
    {
      name: 'majoration',
      label: 'Importer le fichier Majoration',
      required: true,
      download: false,
      onUpload: (files) => setUploadedFile('majoration', files[0]),
      value: null
    }
  ]);

  const setUploadedFile = (name, fileValue) => {
    setInputFiles(prev => prev.map(input => input.name === name ? ({
      ...input,
      value: fileValue
    }) : input ));
  }

  useEffect(() => {
    // TODO
    async function fetchFPOption() {
      const response = await FPOptionService.getOption();
      if (response.plafondCNAPS) {
        setPlafondCnaps(response.plafondCNAPS);
      }
    }
    void fetchFPOption();
  }, []);

  async function handleStartTreatment(e) {
    e.preventDefault();
    setLoading(true);

    // get option
    const options = await FPOptionService.getOption();
    // get file uploaded
    // gss: GSSFile, template: TemplateFile, etc...
    const filesUploaded = inputFiles.reduce((obj, input) => {
      obj[input.name] = input.value;
      return obj;
    }, {});

    const data = {
      dateDebut,
      dateFin,
      joursOuvrables,
      joursOuvres,
      joursCalendaires,
      plafondCnaps,
      coutTransport,
      coutRepas,
      options
    };

    try {
      const response = await startProcessus({ ...data, ...filesUploaded});

      console.log(response)

      // start copying data
      const blob = await copyDataToTheTemplate(response.data, response.variable);
      // download out
      downloadBlob(blob);

      // update plafond cnaps
      await FPOptionService.updatePlafondCNAPS(parseFloat(plafondCnaps));

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Method to download template uploaded
   */
  async function handleDownloadTemplate() {
    const blob = await getFileFromServer('template.xlsx');
    downloadBlob(blob);
  }

  return (
    <CForm onSubmit={handleStartTreatment}>
      <CCard className="mb-3">
        <CCardHeader className="border-bottom-0">
          <h6 className="fw-semibold m-0 d-flex align-items-center">
            <span className="me-2">Informations pour le traitement de la fiche de paie</span>
            <hr className="flex-grow-1 border-secondary" />
          </h6>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-4" xs={{ gutter: 4 }}>
            <CCol sm={6} xl={4} xxl={3}>
              <CFormLabel className="">Date de début</CFormLabel>
              <CFormInput
                type="date"
                placeholder="Sélectionner une date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </CCol>
            <CCol sm={6} xl={4} xxl={3}>
              <CFormLabel className="">Date de fin</CFormLabel>
              <CFormInput
                type="date"
                placeholder="Sélectionner une date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </CCol>
          </CRow>
          <CRow className="mb-4" xs={{ gutter: 4 }}>
            <CCol sm={6} xl={4} xxl={3}>
              <CFormLabel className="">Jours ouvrables</CFormLabel>
              <CFormInput
                type="number"
                placeholder="Ex. : 2"
                value={joursOuvrables}
                onChange={(e) => setJoursOuvrables(e.target.value)}
              />
            </CCol>
            <CCol sm={6} xl={4} xxl={3}>
              <CFormLabel className="">Jours ouvrés </CFormLabel>
              <CFormInput
                type="number"
                placeholder="Ex. : 1"
                value={joursOuvres}
                onChange={(e) => setJoursOuvres(e.target.value)}
              />
            </CCol>
            <CCol sm={6} xl={4} xxl={3}>
              <CFormLabel className="">Jours calendaires </CFormLabel>
              <CFormInput
                type="number"
                placeholder="Ex. : 5"
                value={joursCalendaires}
                onChange={(e) => setJoursCalendaires(e.target.value)}
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <CCard className='mb-3'>
        <CCardHeader className="border-bottom-0">
          <h6 className="fw-semibold m-0 d-flex align-items-center">
            <span className="me-2">Options de traitement</span>
            <hr className="flex-grow-1 border-secondary" />
          </h6>
        </CCardHeader>
        <CCardBody>
          <CRow xs={{ gutter: 4 }}>
            <CCol sm={6} xl={4} xxl={3}>
              <CFormLabel className="">Plafond CNAPS</CFormLabel>
              <CFormInput
                type="number"
                placeholder=""
                value={plafondCnaps}
                onChange={(e) => setPlafondCnaps(e.target.value)}
              />
            </CCol>
            <CCol sm={6} xl={4} xxl={3} style={{ display: 'none' }}>
              <CFormLabel className="">Coût de transport</CFormLabel>
              <CFormInput
                type="number"
                placeholder=""
                value={coutTransport}
                onChange={(e) => setCoutTransport(e.target.value)}
              />
            </CCol>
            <CCol sm={6} xl={4} xxl={3} style={{ display: 'none' }}>
              <CFormLabel className="">Coût repas</CFormLabel>
              <CFormInput
                type="number"
                placeholder=""
                value={coutRepas}
                onChange={(e) => setCoutRepas(e.target.value)}
              />
            </CCol>
          </CRow>
        </CCardBody>

      </CCard>

      <CRow>
        {
          inputFiles.map(input => (
            <CCol key={input.name} md={4} sm={12} style={{ marginBottom: '0.5rem'}}>
              <FileUpload
                label={input.label}
                onUpload={input.onUpload}
                showDownloadButton={input.download}
                {...(input.onDownload && { onDownloadFile: handleDownloadTemplate })}
                required={input.required}
              />
            </CCol>
          ))
        }
      </CRow>

      <CRow style={{ marginBlock: "1rem" }}>
        <CCol sm={6}>
          <CButton type='submit' color='primary' disabled={loading}>
            {loading ? 'Traitement en cours...' : 'Commencer le Traitement'}
          </CButton>
        </CCol>
      </CRow>
    </CForm>
  )
}

export default EtatDePaie

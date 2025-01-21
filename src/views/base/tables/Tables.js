import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow, 
  CFormInput
} from '@coreui/react'
import "./../../../assets/css/table-fiche.css"

const Tables = () => {
  return (
    <>
    <CRow>
      <CCol xs={12} className='mb-4'>
        <CButton className='button-table telecharger me-2'>TELECHARGER LES FICHES</CButton>
        <CButton className='button-table vider'>VIDER LE DOSSIER</CButton>
      </CCol>
      <CCol xs={12}>
        <CRow xs={{ gutter: 4 }}>
          <CCol sm={6} xl={4} xxl={3}>
            <CCard className="mb-4">
              <CCardHeader>
                <CFormInput 
                  type="text"
                  placeholder="Rechercher..."
                  // value={searchTerm}
                  // onChange={(e) => setSearchTerm(e.target.value)}
                  className="recherche-input"
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '10px',
                  }}/>
              </CCardHeader>
              <CCardBody>
                
                  <CTable>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell>Mark</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Jacob</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell colSpan={2}>Larry the Bird</CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={6} xl={8} xxl={9} className='fichier'>
            fichier
          </CCol>
        </CRow>
        
      </CCol>
      
    </CRow>
    </>
  )
}

export default Tables

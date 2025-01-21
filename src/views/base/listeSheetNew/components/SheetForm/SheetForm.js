import React from 'react';
import { CRow, CCol, CFormInput, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';


export const SheetForm = ({ newSheetName, onNameChange, onAdd }) => {
  return (
    <CRow className="mb-4">
      <CCol xs={10}>
        <CFormInput
          placeholder="Nouveau Sheet"
          value={newSheetName}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </CCol>
      <CCol xs={2}>
        <CButton color="primary" onClick={onAdd} className="w-100">
          <CIcon icon={cilPlus} className="me-2" size='sm' />
          Ajout Sheet
        </CButton>
      </CCol>
    </CRow>
  );
};
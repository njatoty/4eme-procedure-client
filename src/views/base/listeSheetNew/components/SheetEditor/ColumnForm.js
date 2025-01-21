import React from 'react';
import { CRow, CCol, CFormInput, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';

export const ColumnForm = ({ 
  newColumnName, 
  newColumnValue, 
  onNameChange, 
  onValueChange, 
  onAdd 
}) => {
  return (
    <CRow className="mt-4">
      <CCol xs={5}>
        <CFormInput
          placeholder="Nouveau colonne"
          value={newColumnName}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </CCol>
      <CCol xs={5}>
        <CFormInput
          placeholder="Nouveau Value"
          value={newColumnValue}
          onChange={(e) => onValueChange(e.target.value)}
        />
      </CCol>
      <CCol xs={2}>
        <CButton color="success" onClick={onAdd}>
          <CIcon icon={cilPlus} size='sm'/>
        </CButton>
      </CCol>
    </CRow>
  );
};
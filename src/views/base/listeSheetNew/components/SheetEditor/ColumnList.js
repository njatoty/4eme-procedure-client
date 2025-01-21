import React from 'react';
import { CRow, CCol, CFormInput, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';

export const ColumnList = ({ columns, onColumnChange, onDeleteColumn }) => {
  
  return (
    <>
      {Object.entries(columns).map(([name, value]) => (
        <CRow key={name} className="mb-3">
          <CCol xs={5}>
            <CFormInput value={name} disabled />
          </CCol>
          <CCol xs={5}>
            <CFormInput
              value={value}
              onChange={(e) => onColumnChange(name, e.target.value)}
            />
          </CCol>
          <CCol xs={2}>
            <CButton
              color="danger"
              variant="outline"
              onClick={() => onDeleteColumn(name)}
            >
              <CIcon icon={cilTrash}/>
            </CButton>
          </CCol>
        </CRow>
      ))}
    </>
  );
};
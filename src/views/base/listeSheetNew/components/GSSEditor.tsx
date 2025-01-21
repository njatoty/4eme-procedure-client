import React, { useState } from 'react';
import {
  CContainer,
  CButton,
  CFormInput,
  CRow,
  CCol,
  CAlert,
} from '@coreui/react';
import { Plus } from 'lucide-react';
import { SheetEditor } from './SheetEditor';
import { GSSColumns, ColumnDefinition } from '../types/gss';

const initialGSSColumns: GSSColumns = {
  sheet1: {
    numbering: 'A',
    m_code: 'B',
    transport: 'O',
    // ... (other columns)
  },
  // ... (other sheets)
};

export const GSSEditor: React.FC = () => {
  const [gssColumns, setGSSColumns] = useState<GSSColumns>(initialGSSColumns);
  const [newSheetName, setNewSheetName] = useState('');
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(
    null
  );

  const handleAddSheet = () => {
    if (newSheetName) {
      if (gssColumns[newSheetName]) {
        setAlert({
          type: 'danger',
          message: 'Sheet name already exists!',
        });
        return;
      }

      setGSSColumns((prev) => ({
        ...prev,
        [newSheetName]: {},
      }));
      setNewSheetName('');
      setAlert({
        type: 'success',
        message: 'Sheet added successfully!',
      });
    }
  };

  const handleUpdateSheet = (sheetName: string, columns: ColumnDefinition) => {
    setGSSColumns((prev) => ({
      ...prev,
      [sheetName]: columns,
    }));
    setAlert({
      type: 'success',
      message: 'Sheet updated successfully!',
    });
  };

  const handleDeleteSheet = (sheetName: string) => {
    const newGSSColumns = { ...gssColumns };
    delete newGSSColumns[sheetName];
    setGSSColumns(newGSSColumns);
    setAlert({
      type: 'success',
      message: 'Sheet deleted successfully!',
    });
  };

  return (
    <CContainer className="py-4">
      <h1 className="mb-4">GSS Columns Editor</h1>

      {alert && (
        <CAlert color={alert.type} dismissible onClose={() => setAlert(null)}>
          {alert.message}
        </CAlert>
      )}

      <CRow className="mb-4">
        <CCol xs={10}>
          <CFormInput
            placeholder="New Sheet Name"
            value={newSheetName}
            onChange={(e) => setNewSheetName(e.target.value)}
          />
        </CCol>
        <CCol xs={2}>
          <CButton color="primary" onClick={handleAddSheet} className="w-100">
            <Plus size={16} className="me-2" />
            Add Sheet
          </CButton>
        </CCol>
      </CRow>

      {Object.entries(gssColumns).map(([sheetName, columns]) => (
        <SheetEditor
          key={sheetName}
          sheetName={sheetName}
          columns={columns}
          onUpdate={handleUpdateSheet}
          onDelete={handleDeleteSheet}
        />
      ))}
    </CContainer>
  );
};
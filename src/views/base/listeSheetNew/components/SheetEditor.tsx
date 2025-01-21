import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
} from '@coreui/react';
import { Plus, Trash2, Save } from 'lucide-react';
import { ColumnDefinition } from '../types/gss';

interface SheetEditorProps {
  sheetName: string;
  columns: ColumnDefinition;
  onUpdate: (sheetName: string, columns: ColumnDefinition) => void;
  onDelete: (sheetName: string) => void;
}

export const SheetEditor: React.FC<SheetEditorProps> = ({
  sheetName,
  columns,
  onUpdate,
  onDelete,
}) => {
  const [editedColumns, setEditedColumns] = useState<ColumnDefinition>(columns);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnValue, setNewColumnValue] = useState('');

  const handleColumnChange = (columnName: string, value: string) => {
    setEditedColumns((prev) => ({
      ...prev,
      [columnName]: value,
    }));
  };

  const handleAddColumn = () => {
    if (newColumnName && newColumnValue) {
      setEditedColumns((prev) => ({
        ...prev,
        [newColumnName]: newColumnValue,
      }));
      setNewColumnName('');
      setNewColumnValue('');
    }
  };

  const handleDeleteColumn = (columnName: string) => {
    const newColumns = { ...editedColumns };
    delete newColumns[columnName];
    setEditedColumns(newColumns);
  };

  const handleSave = () => {
    onUpdate(sheetName, editedColumns);
  };

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h3 className="m-0">{sheetName}</h3>
        <div>
          <CButton color="primary" className="me-2" onClick={handleSave}>
            <Save className="me-2" size={16} />
            Save Changes
          </CButton>
          <CButton color="danger" onClick={() => onDelete(sheetName)}>
            <Trash2 className="me-2" size={16} />
            Delete Sheet
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CForm>
          {Object.entries(editedColumns).map(([name, value]) => (
            <CRow key={name} className="mb-3">
              <CCol xs={5}>
                <CFormInput value={name} disabled />
              </CCol>
              <CCol xs={5}>
                <CFormInput
                  value={value}
                  onChange={(e) => handleColumnChange(name, e.target.value)}
                />
              </CCol>
              <CCol xs={2}>
                <CButton
                  color="danger"
                  variant="outline"
                  onClick={() => handleDeleteColumn(name)}
                >
                  <Trash2 size={16} />
                </CButton>
              </CCol>
            </CRow>
          ))}
          <CRow className="mt-4">
            <CCol xs={5}>
              <CFormInput
                placeholder="New Column Name"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
              />
            </CCol>
            <CCol xs={5}>
              <CFormInput
                placeholder="Column Value"
                value={newColumnValue}
                onChange={(e) => setNewColumnValue(e.target.value)}
              />
            </CCol>
            <CCol xs={2}>
              <CButton color="success" onClick={handleAddColumn}>
                <Plus size={16} />
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  );
};
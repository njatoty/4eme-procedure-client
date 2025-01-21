import React, { useState } from 'react';
import { CCard, CCardBody, CCardHeader, CForm, CButton } from '@coreui/react';
import { ColumnForm } from './ColumnForm';
import { ColumnList } from './ColumnList';
import { addColumn, deleteColumn, updateColumnValue } from '../../utils/columnUtils';
import CIcon from '@coreui/icons-react';
import { cilSave, cilTrash } from '@coreui/icons';

export const SheetEditor = ({ sheetName, columns, onUpdate, onDelete }) => {
  const [editedColumns, setEditedColumns] = useState(columns);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnValue, setNewColumnValue] = useState('');
  
  const handleColumnChange = (columnName, value) => {
    setEditedColumns(prev => updateColumnValue(columnName, value, prev));
  };

  const handleAddColumn = async () => {
    const updatedColumns = await addColumn(sheetName, newColumnName, newColumnValue, editedColumns);
    setEditedColumns(updatedColumns);
    setNewColumnName('');
    setNewColumnValue('');
  };
  
  const handleDeleteColumn = async (columnName) => {    
    const deleteColumn1 = await deleteColumn(columnName, sheetName);
        // setGSSColumns(deleteColumn);
    setEditedColumns(deleteColumn1);
  };

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h3 className="m-0">{sheetName}</h3>
        <div>
          <CButton color="primary" className="me-2" onClick={() => onUpdate(sheetName, editedColumns)}>
            <CIcon icon={cilSave} size='sm'/>
            Mis à jours
          </CButton>
          <CButton color="danger" onClick={() => onDelete(sheetName)}>
            <CIcon icon={cilTrash} size='sm'/>
            Supprimer Sheet
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <ColumnList
            columns={editedColumns}
            onColumnChange={handleColumnChange}
            onDeleteColumn={handleDeleteColumn}
          />

          <ColumnForm
            newColumnName={newColumnName}
            newColumnValue={newColumnValue}
            onNameChange={setNewColumnName}
            onValueChange={setNewColumnValue}
            onAdd={handleAddColumn}
          />
        </CForm>
      </CCardBody>
    </CCard>
  );
};
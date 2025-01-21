import React, { useState } from 'react';
import { CContainer } from '@coreui/react';
import { SheetEditor } from '../SheetEditor/SheetEditor';
import { SheetForm } from '../SheetForm/SheetForm';
import { Alert } from '../Alert/Alert';
import { useAlert } from '../../hooks/useAlert';

import { useEffect } from 'react';
import axios from 'axios';
import {  validateSheetName,
  createNewSheet,
  deleteSheet,
  updateSheet,
} from '../../utils/sheetUtils';

export const GSSEditor = () => {
  const [gssColumns, setGSSColumns] = useState([]);
  const [newSheetName, setNewSheetName] = useState('');
  const { alert, showAlert, clearAlert } = useAlert();

  console.log("gsss === ",gssColumns);
  
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get('http://localhost:6969/template/allColumns');
        setGSSColumns(response.data);
      } catch (error) {
        showAlert('danger', 'Failed to fetch initial data');
      }
    };

    fetchInitialData();
  }, []);


  const handleAddSheet = async () => {
    const validation = validateSheetName(newSheetName, gssColumns);
    if (!validation.isValid) {
      showAlert('danger', validation.message);
      return;
    }
    const newColumns = await createNewSheet(newSheetName, gssColumns);
    const updatedColumns = [...gssColumns, newColumns];
    
    setGSSColumns(updatedColumns);

    setNewSheetName('');
    showAlert('success', 'Sheet added successfully!');
  };
  
  const fetchInitialData = async () => {
    try {
      const response = await axios.get('http://localhost:6969/template/allColumns');
      setGSSColumns(response.data);
    } catch (error) {
      showAlert('danger', 'Failed to fetch initial data');
    }
  };

  const handleUpdateSheet = async (sheetName, columns) => {
    var update = await updateSheet(sheetName, columns);
    // setGSSColumns(update);
    fetchInitialData()
    showAlert('success', 'Sheet updated successfully!');
  };

  const handleDeleteSheet = async (_id) => {

    await deleteSheet(_id, gssColumns);
    const deleteColumn = gssColumns.filter((column) => column._id !== _id);
    setGSSColumns(deleteColumn);
    // setGSSColumns(prev => deleteSheet(sheetName, prev));
    showAlert('success', 'Sheet deleted successfully!');
  };
  return (
    <CContainer className="py-4">
      <h2 className="mb-4">GLOBAL SALARY SHEET</h2>
      
      <Alert alert={alert} onClose={clearAlert} />
      

      <SheetForm
        newSheetName={newSheetName}
        onNameChange={setNewSheetName}
        onAdd={handleAddSheet}
      />
      
      {Object.entries(gssColumns).map(([sheetName, columns]) => (
        
        <SheetEditor
          key={sheetName}
          sheetName={columns.sheetName}
          columns={columns.columns || ""}
          onUpdate={handleUpdateSheet}
          onDelete={() => handleDeleteSheet(columns._id)}
        />
      ))}
    </CContainer>
  );
};
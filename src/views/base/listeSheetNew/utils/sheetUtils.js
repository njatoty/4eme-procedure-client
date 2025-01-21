
const BD = "http://localhost:6969/"

export const validateSheetName = (sheetName, existingSheets) => {
  
  if (!sheetName.trim()) {
    return { isValid: false, message: 'Sheet name cannot be empty' };
  }

  const sheetExists = existingSheets.some(sheet => sheet.sheetName === sheetName);
  if (sheetExists) {
    return { isValid: false, message: 'Sheet name already exists!' };
  }
  return { isValid: true };
};

export const createNewSheet = async (sheetName, existingSheets) => {
  
  try {
    const response = await fetch(`${BD}template/sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sheetName })
    });

    const data = await response.json();
    console.log('Sheet created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating sheet:', error);
    throw error;
  }
};

export const deleteSheet = async (sheetName) => {  
  try {
    const response = await fetch(`${BD}template/removeSheet/${sheetName}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete sheet');
    }

    const data = await response.json();
    console.log('Sheet deleted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error deleting sheet:', error);
    throw error;
  }
};

export const updateSheet = async (sheetName, columns) => {
  
  
  try {
    const response = await fetch(`${BD}template/updateColumn`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sheetName, columns })
    });

    if (!response.ok) {
      throw new Error('Failed to update columns');
    }

    const data = await response.json();
    console.log('Columns updated successfully:', data);
    return data.sheet.columns;
  } catch (error) {
    console.error('Error updating columns:', error);
    throw error;
  }
};
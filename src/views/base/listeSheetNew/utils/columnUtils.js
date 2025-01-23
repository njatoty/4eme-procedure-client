import { API_BASE_URL } from "../../../../services/fp-option-service";

const BD = "http://localhost:6969/"

export const addColumn = async (sheetName, columnName, columnValue, existingColumns) => {

  if (!columnName && !columnValue) {
    return existingColumns;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/template/addColumn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sheetName,
        columnName,
        columnValue
      })
    });
    const data = await response.json();
    console.log('Success:', data);
    return data.sheet.columns;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const deleteColumn = async (columnName, sheetName) => {

  console.log("newColumns", sheetName);

  try {
    const response = await fetch(`${API_BASE_URL}/template/removeColumn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        columnName, sheetName
      })
    });
    const data = await response.json();
    console.log('Success:', data);
    return data.sheet.columns;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const updateColumnValue = (columnName, value, columns) => {
  return {
    ...columns,
    [columnName]: value
  };
};

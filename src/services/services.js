const baseURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:6969';

/**
 * Method do get file from server by file name
 */

export const getFileFromServer = async (filename) => {
  const response = await fetch(`${baseURL}/fiche-paie/file/${filename}`);
  if (!response.ok) {
    throw new Error("File fetch failed!");
  }
  const data = await response.blob();
  return data;
}



/**
 * Method to upload file to the server
 */
export const uploadFileToServer = async(name, file) => {
  try {

    const formData = new FormData();
    formData.append(name, file);

    const response = await fetch(`${baseURL}/fiche-paie/upload-${name}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error("File upload failed!");
    }
    const result = await response.json(); // Assuming server returns JSON
    console.log("File uploaded successfully:", result);

    return result;

  } catch (error) {
    console.error("Error uploading file:", error);
  }

}


/**
 * Method to start processus
 */
export const startProcessus = async (obj) => {
  try {

    const formData = new FormData();
    Object.entries(obj).forEach((([k, v]) => {
      formData.append(k, v);
    }));

    const response = await fetch(`${baseURL}/fiche-paie/start-processus`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(response.message);
    }

    let result = await response.json(); // Assuming server returns JSON

    delete obj.gss;
    delete obj.template;
    delete obj.majoration;
    result.variable = obj


    return result;

  } catch (error) {
    console.error("Error while starting processus:", error);
  }
}


export const copyDataToTheTemplate = async (data, variable) => {



  try {
    const response = await fetch(`${baseURL}/fiche-paie/copy-data-template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data, variable })
    });

    if (!response.ok) {
      throw new Error("Failed to copy data!");
    }

    const result = await response.blob(); // Assuming server returns JSON

    return result;

  } catch (error) {
    console.error("Error while starting processus:", error);
  }
}


/**
 * Method to download blob
 */

export const downloadBlob = (blob, filename) => {
    // download out
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    if (filename) a.download = filename; // Name of the downloaded file
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

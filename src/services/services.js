const baseURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080';

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

    console.log("dd", obj);
    
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    console.log("FormData:", [...formData.entries()]);

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


    console.log("Processus started successfully:", result.data.slice(0, 5));
    
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

    // const result = await response.blob(); // Assuming server returns JSON
    // console.log("resu", result);
    

    // return result;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Etat_De_Paie.xlsx';  // Nom du fichier à télécharger
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);


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






//Service salaire 
import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080/';

export const getEmployees = async () => {
    
  try {
    const response = await axios.get(`${API_URL}/fp-option/agents`);    
    return response.data; // Supposons que l'API retourne un tableau d'employés
  } catch (error) {
    console.error('Erreur lors de la récupération des employés', error);
    return [];
  }
};

// import axios from 'axios';
export const getSalaryEmployees = async () => {
  try {
    const response = await axios.get(`${API_URL}/salaire/list-salaries`);
    return response.data; // Renvoie les données des salaires
  } catch (error) {
    console.error("Error fetching salaries:", error);
    throw error;
  }
};
// Fonction pour récupérer un salaire par ID
export const getSalaryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/salaire/get-salary/${id}`);
    return response.data; // Renvoie le salaire avec l'ID spécifié
  } catch (error) {
    console.error("Error fetching salary by ID:", error);
    throw error;
  }
};

// Fonction pour créer un salaire
export const addSalaireEmployee = async (salaryData) => {
  try {
    const response = await axios.post(`${API_URL}/salaire/add-salary`, salaryData);
      
    return response.data; // Renvoie le salaire créé
  } catch (error) {
    console.error("Error creating salary:", error);
    throw error;
  }
};

// Fonction pour mettre à jour un salaire
export const updateSalaireEmployee = async (id, monthlySalaries) => {
  try {
    
    const response = await axios.put(`${API_URL}/salaire/update-salary/${id}`, monthlySalaries);
    
    return response.data; // Renvoie le salaire mis à jour
  } catch (error) {
    console.error("Error updating salary:", error);
    throw error;
  }
};

// Fonction pour supprimer un salaire
export const deleteSalaireEmployee = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/salaire/delete-salary/${id}`);
    
    return response.data; // Renvoie la confirmation de la suppression
  } catch (error) {
    console.error("Error deleting salary:", error);
    throw error;
  }
};

export const uploadFile = async (file) => {
  if (!file) {
    throw new Error("Aucun fichier sélectionné");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_URL}/salaire/uploadFile`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("respons == ", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'upload du fichier", error);
    return null;
  }
};


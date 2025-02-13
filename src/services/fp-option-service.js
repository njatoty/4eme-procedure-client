// services/IRSADuService.js

import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080'; // Adjust base URL as needed
const IRSA_API_URL = `${API_BASE_URL}/fp-option`;

console.log(import.meta.env.VITE_SERVER_URL);

const IRSADuService = {
    // Get the single IRSA entry (create if not exists)
    getOption: async () => {
        try {
            const response = await axios.get(`${IRSA_API_URL}`);
            
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            } else {
                throw error;
            }
        }
    },

    // Update the single IRSA entry
    updateIRSA: async (valeurMinimum) => {
        try {
            const response = await axios.put(`${IRSA_API_URL}`, { valeurMinimum });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            } else {
                throw error;
            }
        }
    },

    // Add a new tranche
    addTranche: async (tranche) => {
        try {
            const response = await axios.post(`${IRSA_API_URL}/tranches`, tranche);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            } else {
                throw error;
            }
        }
    },

    // Add a new tranche
    addManyTranches: async (tranches) => {
        try {
            const response = await axios.post(`${IRSA_API_URL}/tranches/many`, { tranches });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            } else {
                throw error;
            }
        }
    },

    // Update a specific tranche
    updateTranche: async (trancheId, tranche) => {
        try {
            const response = await axios.put(`${IRSA_API_URL}/tranches/${trancheId}`, tranche);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            } else {
                throw error;
            }
        }
    },

    // Delete a specific tranche
    deleteTranche: async (trancheId) => {
        try {
            const response = await axios.delete(`${IRSA_API_URL}/tranches/${trancheId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            } else {
                throw error;
            }
        }
    },

    // Delete a specific tranche
    deleteAllTranches: async () => {
        try {
            const response = await axios.delete(`${IRSA_API_URL}/tranches/all`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            } else {
                throw error;
            }
        }
    },


    // Update the single IRSA entry
    updatePlafondCNAPS: async (plafondCNAPS) => {
      try {
          const response = await axios.put(`${IRSA_API_URL}/plafond-cnaps`, { plafondCNAPS });
          return response.data;
      } catch (error) {
          if (axios.isAxiosError(error)) {
              throw error.response?.data || error.message;
          } else {
              throw error;
          }
      }
    },

    getAgents: async () => {
      try {
          const response = await axios.get(`${IRSA_API_URL}/agents`);
          
          return response.data;
      } catch (error) {
          if (axios.isAxiosError(error)) {
              throw error.response?.data || error.message;
          } else {
              throw error;
        }
      }
    },

    updateHeuresTravails: async (data) => {
        
      try {
          const response = await axios.put(`${IRSA_API_URL}/heures-travails`, { ...data });
          return response.data;
      } catch (error) {
          if (axios.isAxiosError(error)) {
              throw error.response?.data || error.message;
          } else {
              throw error;
        }
      }
    },
};

export default IRSADuService;

import { useState } from 'react';

export const useAlert = () => {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const clearAlert = () => {
    setAlert(null);
  };

  return { alert, showAlert, clearAlert };
};
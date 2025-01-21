import React from 'react';
import { CAlert } from '@coreui/react';

export const Alert = ({ alert, onClose }) => {
  if (!alert) return null;

  return (
    <CAlert color={alert.type} dismissible onClose={onClose}>
      {alert.message}
    </CAlert>
  );
};
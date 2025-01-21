import React from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import { GSSEditor } from './components/GSSEditor/GSSEditor';

function Sheet() {
  return (
    <div className="bg-light min-vh-100">
      <GSSEditor />
    </div>
  );
}

export default Sheet;
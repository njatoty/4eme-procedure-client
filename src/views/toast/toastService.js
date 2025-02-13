import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { CToast, CToastBody, CToastClose } from "@coreui/react";

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    window.showToast = (message, type = "success") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);

      // Manala ny toast aorian'ny 5 segondra
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 5000);
    };
  }, []);

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1050, 
        color: '#fff',
        marginTop: "100px"
      }}
    >
      {toasts.map(({ id, message, type }) => (
        <CToast
          key={id}
          autohide={false}
          visible
          color={type === "success" ? "success" : "danger"}
          className="d-flex align-items-center"
        >
          <CToastBody>{message}</CToastBody>
          <CToastClose
            className="me-2 m-auto"
            onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== id))}
          />
        </CToast>
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;

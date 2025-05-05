// src/components/Modal.jsx
import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
};

export default Modal;

import React from 'react';
import './ConfirmModal.css'; // Create styling separately

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn btn-danger" onClick={onConfirm}>Yes, Delete</button>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;


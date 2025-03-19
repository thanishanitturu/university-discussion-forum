import React from "react";
import styles from '../../assets/ClubsModal.module.css';// Import your CSS styles

const Modal = ({ isOpen, onClose, onSubmit, title, inputFields }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{title}</h2>
        <form onSubmit={onSubmit} encType="multipart/form-data">
          {inputFields.map((field, index) => (
            <div key={index} className={styles.formGroup}>
              <label>{field.label}</label>
              <input
                type={field.type}
                value={field.value}
                onChange={field.onChange}
                required
              />
            </div>
          ))}
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
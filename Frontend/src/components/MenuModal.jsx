import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

function MenuModal({ isOpen, onClose, triggerRef }) {
  const getModalPosition = () => {
    if (triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const top = rect.bottom + window.scrollY;
      return { top };
    }
    return { top: "50%" };
  };

  const modalPosition = getModalPosition();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose} // Close modal when clicking outside
      contentLabel="Menu Modal"
      overlayClassName="modal-overlay" // Use the custom overlay class
      style={{
        content: {
          position: "absolute",
          top: `${modalPosition.top + 20}px`,
          left: "10px",
          transform: "none",
          width: "300px",
          maxHeight: "150px", // Set a fixed maximum height
          overflowY: "auto", // Enable scrolling if content overflows
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
        },
      }}
    >
      <div>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "18px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        <h3>Menu</h3>
        <a href="/" style={{ display: "block", marginBottom: "10px" }}>Map</a>
        <a href="/ships/" style={{ display: "block", marginBottom: "10px" }}>Ship List</a>
      </div>
    </Modal>
  );
}

export default MenuModal;
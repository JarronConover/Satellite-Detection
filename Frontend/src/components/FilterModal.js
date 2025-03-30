import React, { useState } from "react";
import Modal from "react-modal";

// Make sure to bind the modal's root element to your app
Modal.setAppElement("#root");

function FilterModal({ isOpen, onClose, filters, setFilters, triggerRef }) {
  const [isLocked, setIsLocked] = useState(false); // State for the "Lock Modal Open" checkbox
  const classifications = ["Cargo", "Fishing", "Warship", "Unauthorized"];

  const handleCheckboxChange = (classification) => {
    setFilters((prev) =>
      prev.includes(classification)
        ? prev.filter((item) => item !== classification)
        : [...prev, classification]
    );
  };

  // Calculate dynamic modal position based on the trigger element's location
  const getModalPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top = rect.bottom + window.scrollY; // Position below the trigger element
      return { top };
    }
    return { top: "50%" }; // Default fallback
  };

  const modalPosition = getModalPosition();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={isLocked ? null : onClose} // Prevent closing when locked
      contentLabel="Filter Modal"
      style={{
        content: {
          position: "absolute",
          top: `${modalPosition.top + 20}px`,
          right: `10px`,
          transform: "none", // Avoid default centering
          width: "300px", // Set a fixed width for consistency
          zIndex: 10, // Ensure modal stays above the map
          pointerEvents: "auto", // Ensure modal is interactive
        },
        overlay: {
          backgroundColor: isLocked ? "transparent" : "rgba(0, 0, 0, 0.5)", // Remove overlay when locked
          pointerEvents: isLocked ? "none" : "auto", // Allow clicks through the overlay when locked
        },
      }}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div>
        <button
          onClick={onClose}
          className="close-button"
          style={{
            position: "absolute",
            top: "10px", // Adjust top positioning
            right: "10px", // Adjust right positioning
            fontSize: "18px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        <h3>Filter by Boat Classification</h3>
        {classifications.map((classification) => (
          <div key={classification} style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={filters.includes(classification)}
                onChange={() => handleCheckboxChange(classification)}
              />
              {classification}
            </label>
          </div>
        ))}

        <div style={{ marginTop: "20px" }}>
          <label>
            <input
              type="checkbox"
              checked={isLocked}
              onChange={() => setIsLocked((prev) => !prev)} // Toggle lock state
            />
            Lock Modal Open
          </label>
        </div>
      </div>
    </Modal>
  );
}

export default FilterModal;
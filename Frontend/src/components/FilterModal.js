import React from "react";

function FilterModal({ filters, setFilters }) {
  const classifications = ["Cargo", "Fishing", "Warship", "Unauthorized"];

  const handleCheckboxChange = (classification) => {
    setFilters((prev) =>
      prev.includes(classification)
        ? prev.filter((item) => item !== classification)
        : [...prev, classification]
    );
  };

  return (
    <div id="filterModal" className="modal">
      <div className="modal-content">
        <span className="close">&times;</span>
        <h3>Filter by Boat Classification</h3>
        {classifications.map((classification) => (
          <label key={classification}>
            <input
              type="checkbox"
              checked={filters.includes(classification)}
              onChange={() => handleCheckboxChange(classification)}
            />
            {classification}
          </label>
        ))}
      </div>
    </div>
  );
}

export default FilterModal;
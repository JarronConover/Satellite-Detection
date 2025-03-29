import React from "react";

const Header = ({ menuRef, filtersRef, onMenuClick, onFiltersClick }) => {
  return (
    <header>
      <div className="banner">
        <div
          className="left_text point"
          id="menu"
          ref={menuRef} // Attach reference to the "Menu" button
          onClick={onMenuClick} // Open menu modal
        >
          Menu
        </div>
        <div className="center">Map</div>
        <div
          className="right_text point"
          id="filters"
          ref={filtersRef} // Attach reference to the "Filters" button
          onClick={onFiltersClick} // Open filter modal
        >
          Filters
        </div>
      </div>
    </header>
  );
};

export default Header;
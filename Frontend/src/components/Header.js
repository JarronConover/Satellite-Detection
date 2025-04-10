import React from "react";

const Header = ({ menuRef, filtersRef, onMenuClick, onFiltersClick, title, isFilters }) => {
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
        <div className="center">{title}</div>
        {isFilters && ( // Render "Filters" conditionally
          <div
            className="right_text point"
            id="filters"
            ref={filtersRef} // Attach reference to the "Filters" button
            onClick={onFiltersClick} // Open filter modal
          >
            Filters
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
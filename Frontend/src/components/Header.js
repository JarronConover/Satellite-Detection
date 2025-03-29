import React from "react";
import "./styles.css";

function Header() {
  return (
    <header>
      <div className="banner">
        <div className="left_text point" id="menu">
          <i className="material-icons">menu</i>
        </div>
        <div className="center">Map</div>
        <div className="right_text point" id="filters">Filters</div>
      </div>
    </header>
  );
}

export default Header;
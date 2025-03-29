import React from "react";

function MenuModal() {
  return (
    <div id="menuModal" className="menu modal">
      <div className="modal-content">
        <span className="close">&times;</span>
        <h3>Menu</h3>
        <a href="/">Map</a>
        <br />
        <a href="/ships/">Ship List</a>
        <br />
      </div>
    </div>
  );
}

export default MenuModal;
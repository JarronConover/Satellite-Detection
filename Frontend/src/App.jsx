import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Ships from "./pages/Ships.jsx";
import Ship from "./pages/Ship.jsx";
// import "./styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:center" element={<Home />} />
        <Route path="/ships" element={<Ships />} />
        <Route path="/ships/filter/:bounds" element={<Ships />} />
        <Route path="/ships/:id" element={<Ship />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Import Home page
import Ships from "./pages/Ships"; // Import the Ships page
import Ship from "./pages/Ship"; // Import Individual Ship page
import "./styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home Page */}
        <Route path="/ships" element={<Ships />} /> {/* Ships Page */}
        <Route path="/ships/:id" element={<Ship />} />
      </Routes>
    </Router>
  );
}

export default App;
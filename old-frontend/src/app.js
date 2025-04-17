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
        <Route path="/:center" element={<Home />} /> {/* Centered Map */}
        <Route path="/ships" element={<Ships />} /> {/* Ships Page */}
        <Route path="/ships/filter/:bounds" element={<Ships />} /> {/* Ship in Bounds Page */}
        <Route path="/ships/:id" element={<Ship />} /> {/* Individual Ship Page */}
      </Routes>
    </Router>
  );
}

export default App;
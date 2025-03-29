import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Import Home page
import Ships from "./pages/Ships"; // Import the Ships page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home Page */}
        <Route path="/ships" element={<Ships />} /> {/* Ships Page */}
      </Routes>
    </Router>
  );
}

export default App;
import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Map from "../components/Map";
import Markers from "../components/Markers";
import FilterModal from "../components/FilterModal";
import MenuModal from "../components/MenuModal";

const Home = () => {
  const [map, setMap] = useState(null); // Map instance
  const [ships, setShips] = useState({}); // Ships data state
  const [filters, setFilters] = useState(["Cargo", "Fishing", "Warship", "Unauthorized"]); // Filters state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Filter modal open state
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false); // Menu modal open state
  const filtersRef = useRef(null); // Reference to the "Filters" button
  const menuRef = useRef(null); // Reference to the "Menu" button

  // Fetch ships data from the backend when the component mounts
  useEffect(() => {
    const fetchShips = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ships"); // Endpoint for ships data
        if (!response.ok) throw new Error("Failed to fetch ships data");
        const data = await response.json();
        setShips(data); // Store the fetched data in state
      } catch (error) {
        console.error("Error fetching ships:", error);
      }
    };

    fetchShips();
  }, []);

  return (
    <div className="app-container" style={{ height: "100%" }}>
      <Header
        menuRef={menuRef}
        filtersRef={filtersRef}
        onMenuClick={() => setIsMenuModalOpen(true)}
        onFiltersClick={() => setIsFilterModalOpen(true)}
      />
      <Map onMapLoad={setMap} />
      <Markers map={map} ships={ships} filters={filters} /> {/* Pass ships data */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)} // Close filter modal
        filters={filters}
        setFilters={setFilters} // Pass filters state
        triggerRef={filtersRef} // Pass the reference for positioning the modal
      />
      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)} // Close menu modal when clicking outside
        triggerRef={menuRef} // Pass the reference for positioning the menu modal
      />
    </div>
  );
};

export default Home;
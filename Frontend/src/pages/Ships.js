import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import FilterModal from "../components/FilterModal";
import MenuModal from "../components/MenuModal";
import List from "../components/List";
import { useParams } from "react-router-dom";

const Ships = () => {
  let { bounds } = useParams();
  bounds = bounds ? bounds.split("_").map(Number) : null; // Convert bounds string to array of numbers
  const title = "Ships List";
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

    fetchShips(); // Initial Fetch

    const interval = setInterval(fetchShips, 5000);

    return () => clearInterval(interval)
  }, []);

  // Update the document title
  useEffect(() => {
    document.title = title;
  }, []);

  // Filter ships based on dynamic bounds (latitude and longitude)
const filteredShips = bounds
? Object.keys(ships)
    .filter((shipKey) => {
      const ship = ships[shipKey];
      const latMin = Math.min(bounds[0], bounds[1]); // Get the smaller latitude
      const latMax = Math.max(bounds[0], bounds[1]); // Get the larger latitude
      const lngMin = Math.min(bounds[2], bounds[3]); // Get the smaller longitude
      const lngMax = Math.max(bounds[2], bounds[3]); // Get the larger longitude

      return (
        ship.lat >= latMin && ship.lat <= latMax && // Latitude in range
        ship.lng >= lngMin && ship.lng <= lngMax // Longitude in range
      );
    })
    .reduce((acc, key) => {
      acc[key] = ships[key];
      return acc;
    }, {})
: ships; // If no bounds, return all ships

  return (
    <div>
      <Header
        menuRef={menuRef}
        filtersRef={filtersRef}
        onMenuClick={() => setIsMenuModalOpen(true)}
        onFiltersClick={() => setIsFilterModalOpen(true)}
        title={title}
        isFilters={true}
      />
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
      <List ships={filteredShips} filters={filters} /> {/* Pass the filtered ships */}
    </div>
  );
};

export default Ships;
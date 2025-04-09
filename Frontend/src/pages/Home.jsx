import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
// import Map from "../components/Map";
// import Markers from "../components/Markers";
import FilterModal from "../components/FilterModal";
import MenuModal from "../components/MenuModal";
import { useParams } from "react-router-dom";

const Home = () => {
  let { center } = useParams();
  center = center ? center.split("_").map(Number) : null;
  const title = "Map";
  const [map, setMap] = useState(null);
  const [ships, setShips] = useState({});
  const [filters, setFilters] = useState(["Cargo", "Fishing", "Warship", "Unauthorized"]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const filtersRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchShips = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ships");
        if (!response.ok) throw new Error("Failed to fetch ships data");
        const data = await response.json();
        setShips(data);
      } catch (error) {
        console.error("Error fetching ships:", error);
      }
    };

    fetchShips();
  }, []);

  useEffect(() => {
    if (map) {
      document.title = title;
    }
  }, [map]);

  return (
    <div className="app-container" style={{ height: "100%" }}>


        <div className="text-red-500">
            watermelon
        </div>
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
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        triggerRef={filtersRef}
      />
      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        triggerRef={menuRef}
      />
      {/* <Map onMapLoad={setMap} center={center} />
      <Markers map={map} ships={ships} filters={filters} /> */}
    </div>
  );
};

export default Home;

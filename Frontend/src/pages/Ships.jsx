import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import FilterModal from "../components/FilterModal";
import MenuModal from "../components/MenuModal";
import List from "../components/List";
import { useParams } from "react-router-dom";

const Ships = () => {
  let { bounds } = useParams();
  bounds = bounds ? bounds.split("_").map(Number) : null;

  const title = "Ships List";
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
    document.title = title;
  }, []);

  const filteredShips = bounds
    ? Object.keys(ships)
        .filter((shipKey) => {
          const ship = ships[shipKey];
          const latMin = Math.min(bounds[0], bounds[1]);
          const latMax = Math.max(bounds[0], bounds[1]);
          const lngMin = Math.min(bounds[2], bounds[3]);
          const lngMax = Math.max(bounds[2], bounds[3]);

          return (
            ship.lat >= latMin && ship.lat <= latMax &&
            ship.lng >= lngMin && ship.lng <= lngMax
          );
        })
        .reduce((acc, key) => {
          acc[key] = ships[key];
          return acc;
        }, {})
    : ships;

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
      <List ships={filteredShips} filters={filters} />
    </div>
  );
};

export default Ships;

import React, { useEffect, useState } from "react";
import FilterModal from "../components/FilterModal";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; 

const Ships = () => {
  let { bounds } = useParams();
  bounds = bounds ? bounds.split("_").map(Number) : null;

  const title = "Ships List";
  const [ships, setShips] = useState([]);
  const [filters, setFilters] = useState(["fishing", "merchant", "warship", "other", "ais ship"]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    const fetchShips = async () => {
      try {
        const response = await fetch("/api/ships");
        if (!response.ok) throw new Error("Failed to fetch ships data");
        const data = await response.json();
        console.log("Fetched ships:", data);
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

  const filteredShips = ships.filter((ship) => {
    if (!filters.includes(ship.classification.toLowerCase())) return false;

    if (bounds) {
      const latMin = Math.min(bounds[0], bounds[1]);
      const latMax = Math.max(bounds[0], bounds[1]);
      const lngMin = Math.min(bounds[2], bounds[3]);
      const lngMax = Math.max(bounds[2], bounds[3]);

      return (
        ship.latitude >= latMin &&
        ship.latitude <= latMax &&
        ship.longitude >= lngMin &&
        ship.longitude <= lngMax
      );
    }

    return true;
  });

  const sortedShips = filteredShips.sort((a, b) => {
    if (a.classification === "Unauthorized" && b.classification !== "Unauthorized") return -1;
    if (a.classification !== "Unauthorized" && b.classification === "Unauthorized") return 1;
    return 0;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 space-x-4">
        <div className="py-4">
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        {/* Ships List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedShips.length > 0 ? (
            sortedShips.map((ship, index) => (
              <Link
                key={`${ship.id}-${index}`}
                to={`/ships/${ship.id}`}
                className="transform transition-transform hover:scale-105"
              >
                <div
                  className={`cursor-pointer rounded-lg p-4 flex flex-col items-center justify-between space-y-4 transition-all duration-200 shadow-md hover:shadow-xl hover:bg-opacity-90 ${
                    ship.classification.toLowerCase() === "ais ship"
                      ? "border-4 border-red-500 bg-red-100"
                      : ship.classification.toLowerCase() === "fishing"
                      ? "border-4 border-blue-500 bg-blue-100"
                      : ship.classification.toLowerCase() === "warship"
                      ? "border-4 border-green-500 bg-green-100"
                      : ship.classification.toLowerCase() === "merchant"
                      ? "border-4 border-purple-500 bg-purple-100"
                      : ship.classification.toLowerCase() === "other"
                      ? "border-4 border-yellow-500 bg-yellow-100"
                      : "border border-gray-200 bg-white"
                  }`}
                >
                  <div className="text-center space-y-2 flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {ship.classification.charAt(0).toUpperCase() + ship.classification.slice(1)}
                    </h3>
                    <img
                      src={`data:image/png;base64,${ship.img}`}
                      alt={ship.name}
                      className="w-4 h-auto mx-auto"
                    />
                    <p className="text-gray-500">ID: {ship.id}</p>
                    <p className="text-gray-500">
                      <strong>Location:</strong> Lat: {ship.latitude}, Lng: {ship.longitude}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-xl text-gray-600 col-span-full">No ships found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ships;

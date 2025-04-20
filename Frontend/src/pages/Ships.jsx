import React, { useEffect, useState } from "react";
import FilterModal from "../components/FilterModal";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Ships = () => {
  let { bounds } = useParams();
  bounds = bounds ? bounds.split("_").map(Number) : null;

  const title = "Ships List";
  const [ships, setShips] = useState([]);
  const [filters, setFilters] = useState([
    "fishing", "merchant", "warship", "other",
    "cargo", "passenger", "unknown"
  ]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const fallbackImages = {
    fishing: "/boats/fishing.jpg",
    merchant: "/boats/merchant.jpg",
    warship: "/boats/warship.jpg",
    cargo: "/boats/cargo.jpg",
    passenger: "/boats/passenger.jpg",
    unknown: "/boats/unknown.jpg",
    default: "/boats/default-ship.jpg"
  };

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
    const classification = ship.classification?.toLowerCase();
    if (!filters.includes(classification)) return false;

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
    if (a.danger === 1 && b.danger !== 1) return -1;
    if (a.danger !== 1 && b.danger === 1) return 1;
    return 0;
  });

  const getShipStyles = (ship) => {
    const cls = ship.classification?.toLowerCase();
    if (ship.danger === 1) return "border-4 border-red-500 bg-red-100";
    switch (cls) {
      case "fishing":
        return "border-4 border-blue-500 bg-blue-100";
      case "warship":
        return "border-4 border-green-500 bg-green-100";
      case "merchant":
        return "border-4 border-purple-500 bg-purple-100";
      case "cargo":
        return "border-4 border-amber-500 bg-amber-100";
      case "passenger":
        return "border-4 border-pink-500 bg-pink-100";
      case "unknown":
        return "border-4 border-gray-400 bg-gray-100";
      default:
        return "border-4 border-black-400 bg-black-100";
    }
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {sortedShips.length > 0 ? (
            sortedShips.map((ship, index) => (
              <Link
                key={`${ship.id}-${index}`}
                to={`/ships/${ship.id}`}
                className="transform transition-transform hover:scale-105"
              >
                <div
                  className={`cursor-pointer rounded-lg p-4 flex flex-col items-center justify-between space-y-4 transition-all duration-200 shadow-md hover:shadow-xl hover:bg-opacity-90 ${getShipStyles(
                    ship
                  )}`}
                >
                  <div className="text-center space-y-2 flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {ship.classification.charAt(0).toUpperCase() + ship.classification.slice(1)}
                    </h3>
                    <img
                      src={
                        ship.img
                          ? `data:image/png;base64,${ship.img}`
                          : fallbackImages[ship.classification?.toLowerCase()] || fallbackImages.default
                      }
                      alt={ship.classification || "Ship"}
                      className={`h-auto mx-auto ${ship.img ? "w-4" : "w-16"}`}
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

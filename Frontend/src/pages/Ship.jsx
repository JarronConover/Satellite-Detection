import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import MenuModal from "../components/MenuModal";
import { useParams, Link } from "react-router-dom";

const Ship = () => {
  const { id } = useParams();
  const title = `Ship: ${id}`;
  const [ships, setShips] = useState({});
  const [ship, setShip] = useState(null);
  const [shouldRotate, setShouldRotate] = useState(false);

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
        setShips(data);
      } catch (error) {
        console.error("Error fetching ships:", error);
      }
    };

    fetchShips();
  }, []);

  useEffect(() => {
    if (Object.keys(ships).length > 0) {
      const foundShip = Object.values(ships).find((s) => s.id === parseInt(id));
      setShip(foundShip || null);
    }
  }, [ships, id]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (ship && ship.img) {
      const img = new Image();
      img.src = `data:image/png;base64,${ship.img}`;
      img.onload = () => {
        if (img.naturalHeight > img.naturalWidth) {
          setShouldRotate(true);
        }
      };
    }
  }, [ship]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Danger/Clear Status Bar */}
      {ship && (
        <div
          className={`text-white text-center py-2 font-semibold ${
            ship.danger === 1 ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {ship.danger === 1 ? "DANGEROUS" : "CLEAR"}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          {ship ? (
            <div>
              {/* Title */}
              <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">
                Ship Details
              </h2>

              {/* Ship Image */}
              <div className="flex justify-center mb-6">
                <img
                  src={
                    ship.img
                      ? `data:image/png;base64,${ship.img}`
                      : fallbackImages[ship.classification?.toLowerCase()] || fallbackImages.default
                  }
                  alt={ship.classification || "Ship"}
                  className={`h-auto mx-auto ${ship.img ? "w-22" : "w-88"} ${shouldRotate ? "rotate-90" : ""}`}
                />
              </div>

              {/* Ship Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4 text-lg text-gray-700">
                  <p>
                    <strong className="font-semibold">ID:</strong> {ship.id}
                  </p>
                  <p>
                    <strong className="font-semibold">Classification:</strong>{" "}
                    {ship.classification.charAt(0).toUpperCase() + ship.classification.slice(1)}
                  </p>
                  <p>
                    <strong className="font-semibold">Latitude:</strong>{" "}
                    {ship.latitude}
                  </p>
                  <p>
                    <strong className="font-semibold">Longitude:</strong>{" "}
                    {ship.longitude}
                  </p>
                </div>

                {/* Button */}
                <div className="flex justify-center items-center">
                  <Link to={`/map/${ship.latitude}_${ship.longitude}`}>
                    <button className="bg-blue-500 text-white py-2 px-6 rounded-full shadow hover:bg-blue-400 transition-all">
                      Show on Map
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-xl text-gray-600">Ship not found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ship;

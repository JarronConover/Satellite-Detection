import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Map from "../components/Map";
import Markers from "../components/Markers";
import FilterModal from "../components/FilterModal";
import MenuModal from "../components/MenuModal";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const MapPage = () => {
    let { center } = useParams();
    center = center ? center.split("_").map(Number) : null;
    
    const title = "Map";
    const [map, setMap] = useState(null);
    const [ships, setShips] = useState({});
    const [filters, setFilters] = useState(["fishing", "merchant", "warship", "other", "ais ship"]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const filtersRef = useRef(null);
    const menuRef = useRef(null);

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
        if (map) {
            document.title = title;
        }
    }, [map]);

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col w-full relative">
            {/* Floating Filter Modal Over the Map */}
            <div className="absolute top-4 left-4 z-50 bg-transparent p-3 rounded-lg shadow-none">
                <FilterModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>

            {/* Floating Menu Modal */}
            <MenuModal
                isOpen={isMenuModalOpen}
                onClose={() => setIsMenuModalOpen(false)}
                triggerRef={menuRef}
            />

            {/* Map and Markers */}
            <div className="flex-grow relative">
                <Map onMapLoad={setMap} center={center} />
                <Markers map={map} ships={ships} filters={filters} />
            </div>      
        </div>
    );
};

export default MapPage;
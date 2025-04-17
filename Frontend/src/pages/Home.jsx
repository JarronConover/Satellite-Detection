import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Map from "../components/Map";
import Markers from "../components/Markers";
import FilterModal from "../components/FilterModal";
import MenuModal from "../components/MenuModal";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Panel from "@/components/Panel";

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
<div className="flex flex-col">
    <Panel
        backgroundImage="/images/map.jpg"
        title="View the Map"
        description="Explore ship locations on an interactive map."
        link="/map"
      />

      <Panel
        backgroundImage="/images/Ships.jpg"
        title="Ship Overview"
        description="Monitor global ship movements with satellite precision."
        link="/ships"
      />

      <Panel
        backgroundImage="/images/utah.jpg"
        title="Your Account"
        description="Manage your settings and preferences."
        link="/account"
      />
    </div>
  );
};

export default Home;

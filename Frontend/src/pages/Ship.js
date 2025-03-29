import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import MenuModal from "../components/MenuModal";
import { useParams } from "react-router-dom";

const Ship = () => {
    const { id } = useParams(); // Get the ship ID from the URL
    const title = `Ship: ${id}`;
    const [ships, setShips] = useState({}); // Ships data state
    const [ship, setShip] = useState(null); // Current Ship (set to null initially)
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false); // Menu modal open state
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

    // Find the specific ship based on the ID
    useEffect(() => {
        if (Object.keys(ships).length > 0) {
            const foundShip = Object.values(ships).find((s) => s.id === parseInt(id)); // Convert id to integer
            setShip(foundShip || null); // Set the found ship or null if not found
        }
    }, [ships, id]);

    // Update the document title
    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <div>
            <Header
                menuRef={menuRef}
                onMenuClick={() => setIsMenuModalOpen(true)}
                title={title}
                isFilters={false}
            />
            <MenuModal
                isOpen={isMenuModalOpen}
                onClose={() => setIsMenuModalOpen(false)} // Close menu modal when clicking outside
                triggerRef={menuRef} // Pass the reference for positioning the menu modal
            />
            <div className="gap"></div>
            <div className="ship-details">
                {ship ? (
                    <div className="left">
                        <h2 className="center_text">Ship Details</h2>
                        <p><strong>ID:</strong> {ship.id}</p>
                        <p><strong>Classification:</strong> {ship.classification}</p>
                        <p><strong>Latitude:</strong> {ship.lat}</p>
                        <p><strong>Longitude:</strong> {ship.lng}</p>
                    </div>
                ) : (
                    <p>Ship not found.</p> // Fallback if the ship doesn't exist
                )}
            </div>
        </div>
    );
};

export default Ship;
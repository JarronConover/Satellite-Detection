import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import MenuModal from "../components/MenuModal";
import { useParams, Link } from "react-router-dom";

const Ship = () => {
    const { id } = useParams();
    const title = `Ship: ${id}`;
    const [ships, setShips] = useState({});
    const [ship, setShip] = useState(null);
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
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
        if (Object.keys(ships).length > 0) {
            const foundShip = Object.values(ships).find((s) => s.id === parseInt(id));
            setShip(foundShip || null);
        }
    }, [ships, id]);

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
                onClose={() => setIsMenuModalOpen(false)}
                triggerRef={menuRef}
            />
            <div className="gap"></div>
            <div className="ship-details">
                {ship ? (
                    <div>
                        <div className="left">
                            <h2 className="center_text">Ship Details</h2>
                            <p><strong>ID:</strong> {ship.id}</p>
                            <p><strong>Classification:</strong> {ship.classification}</p>
                            <p><strong>Latitude:</strong> {ship.lat}</p>
                            <p><strong>Longitude:</strong> {ship.lng}</p>
                        </div>
                        <Link to={`/${ship.lat}_${ship.lng}`}>
                            <button className="bottom-right">Show on Map</button>
                        </Link>
                    </div>
                ) : (
                    <p>Ship not found.</p>
                )}
            </div>
        </div>
    );
};

export default Ship;

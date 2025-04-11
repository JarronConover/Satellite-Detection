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
        <div className="min-h-screen bg-gray-100">
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
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    {ship ? (
                        <div>
                            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Ship Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <p className="text-lg text-gray-700">
                                        <strong className="font-semibold">ID:</strong> {ship.id}
                                    </p>
                                    <p className="text-lg text-gray-700">
                                        <strong className="font-semibold">Classification:</strong> {ship.classification}
                                    </p>
                                    <p className="text-lg text-gray-700">
                                        <strong className="font-semibold">Latitude:</strong> {ship.lat}
                                    </p>
                                    <p className="text-lg text-gray-700">
                                        <strong className="font-semibold">Longitude:</strong> {ship.lng}
                                    </p>
                                </div>
                                <div className="flex justify-center items-center">
                                    <Link to={`/map`}>
                                        <button className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-blue-400 transition-all">
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

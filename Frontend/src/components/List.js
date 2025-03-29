import React from "react";
import { useNavigate } from "react-router-dom";

const List = ({ ships, filters }) => {
    const navigate = useNavigate();
    // Filter the ships based on classification
    const filteredShips = Object.keys(ships).filter((shipKey) => {
        const ship = ships[shipKey];
        return filters.includes(ship.classification);
    });

    return (
        <div>
            <div className="gap"></div>
            {filteredShips.length === 0 ? (
                <p className="center">No ships match the selected filters.</p> // Message when no ships match
            ) : (
                filteredShips.map((shipKey) => {
                    const ship = ships[shipKey];
                    // Render each ship as a list item
                    return (
                        <div className="ship_bar" key={ship.id} onClick={() => navigate(`/ships/${ship.id}`)}>
                            <strong>ID:</strong> {ship.id} | 
                            <strong> Classification:</strong> {ship.classification} | 
                            <strong> Lat:</strong> {ship.lat} | 
                            <strong> Lng:</strong> {ship.lng}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default List;
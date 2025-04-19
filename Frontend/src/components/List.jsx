import React from "react";
import { useNavigate } from "react-router-dom";

const List = ({ ships, filters }) => {
    const navigate = useNavigate();
    // Filter the ships based on classification
    const filteredShips = Object.keys(ships).filter((shipKey) => {
        const ship = ships[shipKey];
        return filters.includes(ship.classification);
    });

    // Calculate the counts of each classification
    const counts = filteredShips.reduce(
        (acc, shipKey) => {
            const ship = ships[shipKey];
            if (!acc[ship.classification]) {
                acc[ship.classification] = 0;
            }
            acc[ship.classification]++;
            return acc;
        },
        {
            Fishing: 0,
            Cargo: 0,
            Warship: 0,
            Unauthorized: 0,
        } // Initial counts for each classification
    );

    return (
        <div>
            <div className="gap"></div>
            {filteredShips.length > 0 && (
                <div className="center_text">
                    <h3>
                        Found {filteredShips.length} ship{filteredShips.length > 1 ? "s" : ""}
                    </h3>
                    <h5>
                        Fishing: {counts.Fishing} | Cargo: {counts.Cargo} | Warships: {counts.Warship} | Unauthorized: {counts.Unauthorized}
                    </h5>
                </div>
            )}
            {filteredShips.length === 0 ? (
                <p className="center_text">No ships match the selected filters.</p> // Message when no ships match
            ) : (
                filteredShips.map((shipKey) => {
                    const ship = ships[shipKey];
                    // Render each ship as a list item
                    return (
                        <div
                            className={`ship_bar ${ship.classification.toLowerCase()}`}
                            key={ship.id}
                            onClick={() => navigate(`/ships/${ship.id}`)}
                        >
                            <div className="left_text">
                            <strong>ID:</strong> {ship.id} | 
                            <strong> Classification:</strong> {ship.classification}
                            </div>
                            <div className="right_text">
                            <strong> Lat:</strong> {ship.latitude} | 
                            <strong> Lng:</strong> {ship.longitude}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default List;
/* global google */
import React, { useEffect } from "react";
import MarkerClusterer from "@google/markerclustererplus";

const Markers = ({ map, ships, filters }) => {
  useEffect(() => {
    if (!map) return;

    const markers = []; // To hold all markers
    let visibleMarkers = [];

    // Add markers based on filtered ships
    for (const ship in ships) {
      const shp = ships[ship];
      if (!filters.includes(shp.classification)) continue; // Skip markers outside filters

      const marker = new google.maps.Marker({
        position: { lat: shp.latitude, lng: shp.longitude },
        icon: { url: `/img/${shp.classification.toLowerCase()}.png` },
      });

      marker.classification = shp.classification;

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="px-4 rounded-md bg-white shadow-md text-gray-800 max-w-xs">
            <h3 class="text-lg font-bold mb-4">
            <button
              onclick="window.location.href='/ships/${shp.id}'"
              class="bg-purple-300 hover:bg-purple-200 text-black font-medium py-2 px-4 rounded shadow-md transition duration-150 active:scale-95"
            >
              Ship #${shp.id}: ${shp.classification.charAt(0).toUpperCase() + shp.classification.slice(1)}
            </button>
            </h3>
            <div class="text-sm text-gray-600 space-y-1 pb-8">
              <p><strong>Latitude:</strong> ${shp.latitude}</p>
              <p><strong>Longitude:</strong> ${shp.longitude}</p>
            </div>
          </div>
        `,
      });
      

      marker.addListener("click", () => {
        if (visibleMarkers.includes(marker)) {
          infoWindow.close();
          visibleMarkers.splice(visibleMarkers.indexOf(marker), 1);
        } else {
          infoWindow.open(map, marker);
          visibleMarkers.push(marker);
        }
      });

      markers.push(marker);
    }

    // Create a marker clusterer with the filtered markers
    const markerCluster = new MarkerClusterer(map, markers, {
      imagePath: "/img/m",
    });

    // Cleanup markers and clusterer when component unmounts or dependencies change
    return () => {
      markers.forEach((marker) => marker.setMap(null)); // Remove markers from map
      markerCluster.clearMarkers(); // Clear the clusterer
    };
  }, [map, ships, filters]); // Re-run effect when map, ships, or filters change

  return null;
};

export default Markers;
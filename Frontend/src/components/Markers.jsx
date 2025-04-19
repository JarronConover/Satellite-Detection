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
          <div class="text-center p-2">
            <h3 class="text-lg font-semibold text-gray-800 mb-1">
              <a href="/ships/${shp.id}" class="text-blue-500 hover:underline">
                ${shp.id}: ${shp.classification.charAt(0).toUpperCase() + shp.classification.slice(1)}
              </a>
            </h3>
            <p class="text-sm text-gray-600">
              <strong>Lat:</strong> ${shp.latitude} | <strong>Lng:</strong> ${shp.longitude}
            </p>
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
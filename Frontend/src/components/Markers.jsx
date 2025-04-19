/* global google */
import React, { useEffect } from "react";
import MarkerClusterer from "@google/markerclustererplus";

const Markers = ({ map, ships, filters }) => {
  useEffect(() => {
    if (!map || !Array.isArray(ships)) return;

    const markers = [];
    let visibleMarkers = [];

    for (const shp of ships) {
      const classification = shp.classification?.toLowerCase();
      if (!filters.includes(classification)) continue;

      const marker = new google.maps.Marker({
        position: { lat: shp.latitude, lng: shp.longitude },
        icon: { url: `/img/${classification}.png` },
      });

      marker.classification = classification;

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

    const markerCluster = new MarkerClusterer(map, markers, {
      imagePath: "/img/m",
    });

    return () => {
      markers.forEach((marker) => marker.setMap(null));
      markerCluster.clearMarkers();
    };
  }, [map, ships, filters]);

  return null;
};

export default Markers;

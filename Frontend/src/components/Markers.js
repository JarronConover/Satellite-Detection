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
        position: { lat: shp.lat, lng: shp.lng },
        icon: { url: `./img/${shp.classification.toLowerCase()}.png` },
      });

      marker.classification = shp.classification;

      const infoWindow = new google.maps.InfoWindow({
        content: `<div><h3><a href="/ships/${shp.id}">${shp.classification}</a></h3><p>Latitude: ${shp.lat}</p><p>Longitude: ${shp.lng}</p></div>`,
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
      imagePath: "./img/m",
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
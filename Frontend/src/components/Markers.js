/* global google */
import React, { useEffect } from "react";
import MarkerClusterer from "@google/markerclustererplus";

const Markers = ({ map, locations, filters }) => {
  useEffect(() => {
    if (!map) return;

    const markers = []; // To hold all markers
    let visibleMarkers = [];

    // Add markers based on filtered locations
    for (const location in locations) {
      const loc = locations[location];
      if (!filters.includes(loc.classification)) continue; // Skip markers outside filters

      const marker = new google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        icon: { url: `./img/${loc.classification.toLowerCase()}.png` },
      });

      marker.classification = loc.classification;

      const infoWindow = new google.maps.InfoWindow({
        content: `<div><h3><a href="/ships/${loc.id}">${loc.classification}</a></h3><p>Latitude: ${loc.lat}</p><p>Longitude: ${loc.lng}</p></div>`,
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
  }, [map, locations, filters]); // Re-run effect when map, locations, or filters change

  return null;
};

export default Markers;
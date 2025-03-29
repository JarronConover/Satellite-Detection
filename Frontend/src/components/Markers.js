/* global google */
import React, { useEffect } from "react";
import MarkerClusterer from "@google/markerclustererplus";

const Markers = ({ map, locations, filters }) => {
  useEffect(() => {
    if (!map) return;

    const markers = [];
    const visibleMarkers = [];
    
    // Add markers based on locations
    for (const location in locations) {
      const loc = locations[location];
      if (!filters.includes(loc.classification)) continue; // Skip markers outside filters
      
      const marker = new google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map: map,
        icon: { url: `./img/${loc.classification.toLowerCase()}.png` },
      });

      marker.classification = loc.classification;
      const infoWindow = new google.maps.InfoWindow({
        content: `<div><h3><a href="/ships/${loc.id}">${loc.classification}</a></h3><p>Latitude: ${loc.lat}</p><p>Longitude: ${loc.lng}</p></div>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      markers.push(marker);
    }

    // Cluster Markers
    new MarkerClusterer(map, markers, { imagePath: "./img/m" });

    return () => markers.forEach(marker => marker.setMap(null));
  }, [map, locations, filters]);

  return null;
};

export default Markers;
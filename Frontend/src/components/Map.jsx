/* global google */
import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useNavigate } from "react-router-dom";

const apiOptions = {
    apiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ["drawing"], // Include the Drawing library
};

function Map({ onMapLoad, center }) {
  let zoom = 16;
  if (!center) {
    center = [37.7166, -122.2830];
    zoom = 9;
  }
  const navigate = useNavigate();
  useEffect(() => {
    const loader = new Loader(apiOptions);
    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: center[0], lng: center[1] },
        zoom: zoom,
        mapTypeControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM },
        fullscreenControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
        streetViewControl: false,
        styles: [
          {
            featureType: "poi", // Points of Interest
            elementType: "labels", // Labels for POIs
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.business", // Businesses
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit", // Transit stations
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "road", // Roads
            elementType: "labels", // Labels for roads
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      onMapLoad(map); // Pass the map instance to the parent
    });
  }, [onMapLoad]);

  return <div id="map" style={{ height: "100%", width: "100%" }}></div>;
}

export default Map;
/* global google */
import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const apiOptions = {
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    version: "weekly",
};

function Map({ onMapLoad }) {
    useEffect(() => {
      const loader = new Loader(apiOptions);
      loader.load().then(() => {
        const map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: -33.860664, lng: 151.208138 },
          zoom: 14,
          mapTypeControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM },
          fullscreenControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
          streetViewControl: false,
        });
  
        onMapLoad(map); // Pass the map instance to the parent
      });
    }, [onMapLoad]);
  
    return <div id="map" style={{ height: "100%", width: "100%" }}></div>;
  }

export default Map;
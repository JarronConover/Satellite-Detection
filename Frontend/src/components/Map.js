/* global google */
import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useNavigate } from "react-router-dom";

const apiOptions = {
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["drawing"], // Include the Drawing library
};

function Map({ onMapLoad }) {
  const navigate = useNavigate();
  useEffect(() => {
    const loader = new Loader(apiOptions);
    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -33.860664, lng: 151.208138 },
        zoom: 14,
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

      // Initialize the Drawing Manager for rectangles only
      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.RECTANGLE, // Default mode
        drawingControl: true, // Show drawing controls
        drawingMode: null,
        drawingControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM, // Position of drawing controls
          drawingModes: ["rectangle"], // Restrict to rectangles only
        },
        rectangleOptions: {
          fillColor: "#FF0000",
          fillOpacity: 0.2,
          strokeWeight: 2,
          clickable: true,
          editable: true,
          draggable: true,
        },
      });

      drawingManager.setMap(map); // Attach the Drawing Manager to the map

      // Add an event listener to capture rectangle bounds
      google.maps.event.addListener(drawingManager, "overlaycomplete", (event) => {
        if (event.type === google.maps.drawing.OverlayType.RECTANGLE) {
          const bounds = event.overlay.getBounds();
          const northeast = bounds.getNorthEast(); // Top-right corner
          const southwest = bounds.getSouthWest(); // Bottom-left corner

          navigate(`/ships/filter/${northeast.lat()}_${southwest.lat()}_${northeast.lng()}_${southwest.lng()}`);
        }
      });

      onMapLoad(map); // Pass the map instance to the parent
    });
  }, [onMapLoad]);

  return <div id="map" style={{ height: "100%", width: "100%" }}></div>;
}

export default Map;
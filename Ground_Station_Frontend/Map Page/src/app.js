/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Loader } from '@googlemaps/js-api-loader';
import MarkerClusterer from '@google/markerclustererplus';

const apiOptions = {
    apiKey: "AIzaSyAyl34KLIdA0-IviP9ervlO8-pDJcoTGNA"
}

const loader = new Loader(apiOptions);

loader.load().then(() => {
  console.log('Maps JS API loaded');
  const map = displayMap();
  const markers = addMarkers(map);
  clusterMarkers(map, markers);
});

function displayMap() {
  const mapOptions = {
    center: { lat: -33.860664, lng: 151.208138 },
    zoom: 14,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    }
  };
  const mapDiv = document.getElementById('map');
  const map = new google.maps.Map(mapDiv, mapOptions);
  return map;
}
const markers = [];
function addMarkers(map) {
  const locations = {
    operaHouse: { lat: -33.8567844, lng: 151.213108, classification: "Cargo" },
    tarongaZoo: { lat: -33.8472767, lng: 151.2188164, classification: "Cargo" },
    manlyBeach: { lat: -33.8209738, lng: 151.2563253, classification: "Cargo" },
    hyderPark: { lat: -33.8690081, lng: 151.2052393, classification: "Cargo" },
    theRocks: { lat: -33.8587568, lng: 151.2058246, classification: "Fishing" },
    circularQuay: { lat: -33.858761, lng: 151.2055688, classification: "Fishing" },
    harbourBridge: { lat: -33.852228, lng: 151.2038374, classification: "Fishing" },
    kingsCross: { lat: -33.8737375, lng: 151.222569, classification: "Fishing" },
    botanicGardens: { lat: -33.864167, lng: 151.216387, classification: "Fishing" },
    museumOfSydney: { lat: -33.8636005, lng: 151.2092542, classification: "Warship" },
    maritimeMuseum: { lat: -33.869395, lng: 151.198648, classification: "Warship" },
    kingStreetWharf: { lat: -33.8665445, lng: 151.1989808, classification: "Warship" },
    aquarium: { lat: -33.869627, lng: 151.202146, classification: "Warship" },
    darlingHarbour: { lat: -33.87488, lng: 151.1987113, classification: "Warship" },
    barangaroo: { lat: - 33.8605523, lng: 151.1972205, classification: "Unauthorized" },
    bondiBeach: { lat: -33.890842, lng: 151.274292, classification: "Unauthorized" },
    lunaPark: { lat: -33.847927, lng: 151.210478, classification: "Unauthorized" },
    artGalleryNSW: { lat: -33.868684, lng: 151.217482, classification: "Unauthorized" },
    queenVictoriaBuilding: { lat: -33.872903, lng: 151.206197, classification: "Unauthorized" },
    centennialPark: { lat: -33.896073, lng: 151.240601, classification: "Cargo" },
    sydneyTowerEye: { lat: -33.870453, lng: 151.208755, classification: "Cargo" },
    powerhouseMuseum: { lat: -33.878367, lng: 151.200638, classification: "Fishing" },
    anzacMemorial: { lat: -33.876553, lng: 151.210800, classification: "Fishing" },
    observatoryHill: { lat: -33.859935, lng: 151.203991, classification: "Warship" },
    cockatooIsland: { lat: -33.846372, lng: 151.170838, classification: "Fishing" },
    whiteRabbitGallery: { lat: -33.882959, lng: 151.202974, classification: "Warship" },
    bondiIcebergs: { lat: -33.892275, lng: 151.275620, classification: "Unauthorized" },
    tarongaZooSkySafari: { lat: -33.843586, lng: 151.239229, classification: "Cargo" },
    statueOfLiberty: { lat: 40.689247, lng: -74.044502, classification: "Unauthorized" },
    eiffelTower: { lat: 48.858370, lng: 2.294481, classification: "Cargo" },
    colosseum: { lat: 41.890210, lng: 12.492231, classification: "Unauthorized" },
    greatWall: { lat: 40.431908, lng: 116.570375, classification: "Fishing" },
    bigBen: { lat: 51.500729, lng: -0.124625, classification: "Unauthorized" },
    christTheRedeemer: { lat: -22.951916, lng: -43.210487, classification: "Cargo" },
    pyramidsOfGiza: { lat: 29.977296, lng: 31.132495, classification: "Fishing" },
    tajMahal: { lat: 27.175015, lng: 78.042155, classification: "Cargo" },
    sydneyOperaHouse: { lat: -33.856784, lng: 151.215297, classification: "Warship" },
    machuPicchu: { lat: -13.163141, lng: -72.544963, classification: "Fishing" },
  };
  
  for (const location in locations) {
    let img;
      switch(locations[location].classification) {
        case 'Cargo':
          img = './img/cargo.png';
          break;
          case 'Fishing':
            img = './img/fishing.png';
            break;
            case 'Warship':
              img = './img/warship.png';
              break;
              case 'Unauthorized':
                img = './img/unauthorized.png';
                break;
              }
              const markerOptions = {
                map: map,
        position: locations[location],
        icon: {
          url: img,
          anchor: new google.maps.Point(38.5, 38.5)
        }
      }
      const marker = new google.maps.Marker(markerOptions);
      marker.classification = locations[location].classification;
      const infoWindow = new google.maps.InfoWindow({
        content: `<div><h3>${locations[location].classification}</h3><p>Latitude: ${locations[location].lat}</p><p>Longitude: ${locations[location].lng}</p></div>`
      });
      marker.addListener('click', () => {
        if (infoWindow.getMap()) {
          infoWindow.close()
        } else {
          infoWindow.open(map, marker);
        }
      });
      markers.push(marker);
    }
    return markers;
  }
  
  let markerCluster;
  function clusterMarkers(map, markers) {
    const clustererOptions = { imagePath: './img/m' }
    markerCluster = new MarkerClusterer(map, markers, clustererOptions);
  }
  
  // Get the modal
  const modal = document.getElementById("filterModal");
  
  // Get the button that opens the modal
  const btn = document.getElementById("filters");
  
  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName("close")[0];
  
  // When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Function to apply filters dynamically
const checkboxes = document.querySelectorAll(".classification-filter");
checkboxes.forEach(checkbox => {
  checkbox.addEventListener("change", applyFilters);
});

function applyFilters() {
  const filters = Array.from(document.querySelectorAll(".classification-filter:checked")).map(cb => cb.value);
  console.log("Applied Filters:", filters);
  filterMarkers(filters);
}

function filterMarkers(filters) {
  const visibleMarkers = [];
  markers.forEach(marker => {
    const classification = marker.classification;
    if (filters.includes(classification)) {
      marker.setVisible(true);
      visibleMarkers.push(marker);
    } else {
      marker.setVisible(false);
    }
  });

  markerCluster.clearMarkers();
  markerCluster.addMarkers(visibleMarkers);
}

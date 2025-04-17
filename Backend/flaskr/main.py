from flask import Flask, jsonify, Blueprint, g, request
from flaskr.db import get_db
import asyncio
import json
import websockets
from datetime import datetime, timezone

 # Enable CORS to allow cross-origin requests from React frontend

bp = Blueprint('main', __name__)
#Sample Ship data that will get removed once we have a database to draw on
ships_data = {
    "operaHouse": { "lat": -33.8567844, "lng": 151.213108, "classification": "Cargo", "id": 0 },
    "tarongaZoo": { "lat": -33.8472767, "lng": 151.2188164, "classification": "Cargo", "id": 1 },
    "manlyBeach": { "lat": -33.8209738, "lng": 151.2563253, "classification": "Cargo", "id": 2 },
    "hyderPark": { "lat": -33.8690081, "lng": 151.2052393, "classification": "Cargo", "id": 3 },
    "theRocks": { "lat": -33.8587568, "lng": 151.2058246, "classification": "Fishing", "id": 4 },
    "circularQuay": { "lat": -33.858761, "lng": 151.2055688, "classification": "Fishing", "id": 5 },
    "harbourBridge": { "lat": -33.852228, "lng": 151.2038374, "classification": "Fishing", "id": 6 },
    "kingsCross": { "lat": -33.8737375, "lng": 151.222569, "classification": "Fishing", "id": 7 },
    "botanicGardens": { "lat": -33.864167, "lng": 151.216387, "classification": "Fishing", "id": 8 },
    "museumOfSydney": { "lat": -33.8636005, "lng": 151.2092542, "classification": "Warship", "id": 9 },
    "maritimeMuseum": { "lat": -33.869395, "lng": 151.198648, "classification": "Warship", "id": 10 },
    "kingStreetWharf": { "lat": -33.8665445, "lng": 151.1989808, "classification": "Warship", "id": 11 },
    "aquarium": { "lat": -33.869627, "lng": 151.202146, "classification": "Warship", "id": 12 },
    "darlingHarbour": { "lat": -33.87488, "lng": 151.1987113, "classification": "Warship", "id": 13 },
    "barangaroo": { "lat": - 33.8605523, "lng": 151.1972205, "classification": "Unauthorized", "id": 14 },
    "bondiBeach": { "lat": -33.890842, "lng": 151.274292, "classification": "Unauthorized", "id": 15 },
    "lunaPark": { "lat": -33.847927, "lng": 151.210478, "classification": "Unauthorized", "id": 16 },
    "artGalleryNSW": { "lat": -33.868684, "lng": 151.217482, "classification": "Unauthorized", "id": 17 },
    "queenVictoriaBuilding": { "lat": -33.872903, "lng": 151.206197, "classification": "Unauthorized", "id": 18 },
    "centennialPark": { "lat": -33.896073, "lng": 151.240601, "classification": "Cargo", "id": 19 },
    "sydneyTowerEye": { "lat": -33.870453, "lng": 151.208755, "classification": "Cargo", "id": 20 },
    "powerhouseMuseum": { "lat": -33.878367, "lng": 151.200638, "classification": "Fishing", "id": 21 },
    "anzacMemorial": { "lat": -33.876553, "lng": 151.210800, "classification": "Fishing", "id": 22 },
    "observatoryHill": { "lat": -33.859935, "lng": 151.203991, "classification": "Warship", "id": 23 },
    "cockatooIsland": { "lat": -33.846372, "lng": 151.170838, "classification": "Fishing", "id": 24 },
    "whiteRabbitGallery": { "lat": -33.882959, "lng": 151.202974, "classification": "Warship", "id": 25 },
    "bondiIcebergs": { "lat": -33.892275, "lng": 151.275620, "classification": "Unauthorized", "id": 26 },
    "tarongaZooSkySafari": { "lat": -33.843586, "lng": 151.239229, "classification": "Cargo", "id": 27 },
    "statueOfLiberty": { "lat": 40.689247, "lng": -74.044502, "classification": "Unauthorized", "id": 28 },
    "eiffelTower": { "lat": 48.858370, "lng": 2.294481, "classification": "Cargo", "id": 29 },
    "colosseum": { "lat": 41.890210, "lng": 12.492231, "classification": "Unauthorized", "id": 30 },
    "greatWall": { "lat": 40.431908, "lng": 116.570375, "classification": "Fishing", "id": 31 },
    "bigBen": { "lat": 51.500729, "lng": -0.124625, "classification": "Unauthorized", "id": 32 },
    "christTheRedeemer": { "lat": -22.951916, "lng": -43.210487, "classification": "Cargo", "id": 33 },
    "pyramidsOfGiza": { "lat": 29.977296, "lng": 31.132495, "classification": "Fishing", "id": 34 },
    "tajMahal": { "lat": 27.175015, "lng": 78.042155, "classification": "Cargo", "id": 35 },
    "sydneyOperaHouse": { "lat": -33.856784, "lng": 151.215297, "classification": "Warship", "id": 36 },
    "machuPicchu": { "lat": -13.163141, "lng": -72.544963, "classification": "Fishing", "id": 37 },
}

async def connect_ais_stream():

    async with websockets.connect("wss://stream.aisstream.io/v0/stream") as websocket:
        subscribe_message = {"APIKey": "54fd66873359f819fab51694d01a39f847d8795b",  # Required !
                             "BoundingBoxes": [[[-90, -180], [90, 180]]], # Required!
                             "FiltersShipMMSI": ["368207620", "367719770", "211476060"], # Optional!
                             "FilterMessageTypes": ["PositionReport"]} # Optional!

        subscribe_message_json = json.dumps(subscribe_message)
        await websocket.send(subscribe_message_json)

        async for message_json in websocket:
            message = json.loads(message_json)
            message_type = message["MessageType"]

            if message_type == "PositionReport":
                # the message parameter contains a key of the message type which contains the message itself
                ais_message = message['Message']['PositionReport']
                print(f"[{datetime.now(timezone.utc)}] ShipId: {ais_message['UserID']} Latitude: {ais_message['Latitude']} Latitude: {ais_message['Longitude']}")

asyncio.run(asyncio.run(connect_ais_stream()))
@bp.route('/api/ships', methods=['get'])        #This is where the frontend requests ship data
def get_ships():
    return jsonify(ships_data)

@bp.route('/satdump', methods=['post'])
def sat_dump():

    db = get_db()
    data = request.json

    classification = data.get('Classification')
    timestamp = data.get('timestamp')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    width = data.get('width')
    height = data.get('height')
    image = data.get('image')
    confidence = data.get('confidence')

    danger = 0
    

    try:
        db.execute(
            "INSERT INTO ship (classification, lattitude, longitude, img, width, height, confidence, time, danger) VALUES (?,?,?,?,?,?,?,?,?)",
            (classification, timestamp, latitude, longitude, width, height, image, confidence, danger))
        db.commit()
    except:
        pass

    return #status.HTTP_200_OK

#"Classification": label,
 #                       "timestamp": time.time(),  # Current timestamp
  #                      "latitude": 37.7749,  # Placeholder, need actual calculation
   #                     "longitude": -122.4194,  # Placeholder, need actual calculation
    #                    "width": width,
     #                   "height": height,
      #                  "image": base64_image,
       #                 "confidence": confidence
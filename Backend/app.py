from flask import Flask, jsonify
from flask import current_app, g
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests from React frontend

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

@app.route('/api/ships', methods=['get'])        #This is where the frontend requests ship data
def get_ships():
    return jsonify(ships_data)

@app.route('/satdump', methods=['get'])
def sat_dump():    
    return "Satellite data dump endpoint"

if __name__ == "__main__":
    app.run(debug=True)